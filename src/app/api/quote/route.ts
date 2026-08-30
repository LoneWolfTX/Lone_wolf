import { NextRequest, NextResponse } from 'next/server';
import { saveLeadInRedis, checkRateLimit } from '@/lib/redis';

export const dynamic = 'force-dynamic';

const RECIPIENT_EMAIL = 'lonewolfdumpsters@gmail.com';

const VALID_SERVICES = new Set([
  '15-yard-dumpster',
  '20-yard-dumpster',
  '25-yard-dumpster',
  'commercial',
  'contractor',
  'junk-removal',
  'other',
]);

const VALID_DURATIONS = new Set([
  '3 Days',
  '5 Days',
  '7 Days',
  '14 Days',
  '30 Days',
  'Custom',
]);

function getClientIp(req: NextRequest): string {
  if (process.env.NODE_ENV === 'test' || process.env.ENABLE_TEST_OVERRIDE === 'true') {
    const testIp = req.headers.get('x-test-ip');
    if (testIp) return testIp.trim();
  }
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown-ip';
}

/**
 * POST /api/quote
 * Lead intake & verification endpoint with bot & rate protection.
 */
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    // 1. IP Rate Limiting: max 5 quote requests per 10 minutes
    const rate = await checkRateLimit('quote_submission', ip, 5, 10 * 60);
    if (!rate.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many submissions from this IP. Please call or text (214) 876-0321 directly.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid JSON payload' }, { status: 400 });
    }

    // 2. Honeypot check: reject bot submissions
    if (body._hp_field || body.website_confirm_field || body._hp_website || body.hp_website_company) {
      // Silently accept bots without persisting
      return NextResponse.json({ success: true, leadId: 'lead_bot_filtered' });
    }

    // 3. Strict field validations
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().slice(0, 120) : '';
    const streetAddress = typeof body.streetAddress === 'string' ? body.streetAddress.trim() : '';
    const city = typeof body.city === 'string' ? body.city.trim() : '';
    const zip = typeof body.zip === 'string' ? body.zip.trim() : '';
    const deliveryAddressRaw = typeof body.deliveryAddress === 'string' ? body.deliveryAddress.trim() : '';
    const rawService = typeof body.service === 'string' ? body.service.trim().toLowerCase() : '20-yard-dumpster';
    const projectType = typeof body.projectType === 'string' ? body.projectType.trim().slice(0, 100) : 'General Cleanout';
    const preferredDate = typeof body.preferredDate === 'string' ? body.preferredDate.trim().slice(0, 50) : 'As soon as possible';
    const rawDuration = typeof body.rentalDuration === 'string' ? body.rentalDuration.trim() : '7 Days';
    const notes = typeof body.notes === 'string' ? body.notes.trim().slice(0, 1000) : '';

    if (name.length < 2 || name.length > 100) {
      return NextResponse.json({ success: false, error: 'Name must be between 2 and 100 characters.' }, { status: 400 });
    }

    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      return NextResponse.json({ success: false, error: 'Please enter a valid 10-digit phone number.' }, { status: 400 });
    }

    const fullAddress = deliveryAddressRaw || [streetAddress, city, zip].filter(Boolean).join(', ') || 'DFW Metroplex';
    if (fullAddress.length < 3 || fullAddress.length > 200) {
      return NextResponse.json({ success: false, error: 'Please provide a valid delivery address or city.' }, { status: 400 });
    }

    const service = VALID_SERVICES.has(rawService) ? rawService : '20-yard-dumpster';
    const rentalDuration = VALID_DURATIONS.has(rawDuration) ? rawDuration : '7 Days';

    // 4. ATOMIC DATABASE PERSISTENCE IN UPSTASH REDIS
    const savedLead = await saveLeadInRedis({
      name,
      phone,
      email,
      deliveryAddress: fullAddress,
      service,
      projectType,
      preferredDate,
      rentalDuration,
      notes,
      leadMethod: body.leadMethod || 'Website Form',
      firstTouchSource: body.firstTouchSource,
      firstTouchMedium: body.firstTouchMedium,
      firstTouchCampaign: body.firstTouchCampaign,
      firstTouchContent: body.firstTouchContent,
      firstTouchTerm: body.firstTouchTerm,
      firstTouchLandingPage: body.firstTouchLandingPage,
      firstTouchReferrer: body.firstTouchReferrer,
      firstTouchGclid: body.firstTouchGclid,
      firstTouchFbclid: body.firstTouchFbclid,
      firstTouchAt: body.firstTouchAt,
      lastTouchSource: body.lastTouchSource,
      lastTouchMedium: body.lastTouchMedium,
      lastTouchCampaign: body.lastTouchCampaign,
      lastTouchContent: body.lastTouchContent,
      lastTouchTerm: body.lastTouchTerm,
      lastTouchLandingPage: body.lastTouchLandingPage,
      lastTouchReferrer: body.lastTouchReferrer,
      lastTouchGclid: body.lastTouchGclid,
      lastTouchFbclid: body.lastTouchFbclid,
      lastTouchAt: body.lastTouchAt,
      normalizedSource: body.normalizedSource || 'Direct',
      reportingAttributionSource: body.reportingAttributionSource || 'Direct',
      reportingAttributionCampaignId: body.reportingAttributionCampaignId,
      attributedCampaignId: body.attributedCampaignId,
    });

    if (!savedLead) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to record quote request in persistent storage. Please call or text (214) 876-0321 directly.',
        },
        { status: 500 }
      );
    }

    // 5. EMAIL NOTIFICATION DISPATCH (Non-blocking / Resend)
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Lone Wolf Leads <leads@lonewolfdumpsters.com>',
            to: RECIPIENT_EMAIL,
            subject: `🐺 NEW LEAD: ${name} (${service.toUpperCase()}) - ${fullAddress}`,
            text: `New Dumpster Quote Request

Name: ${name}
Phone: ${phone}
Email: ${email}
Address: ${fullAddress}
Service: ${service}
Project: ${projectType}
Date: ${preferredDate}
Duration: ${rentalDuration}
Notes: ${notes}

Lead ID: ${savedLead.id}`,
          }),
        });
      } catch (emailErr) {
        console.error('Email dispatch non-fatal error:', emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      leadId: savedLead.id,
      message: 'Quote request received successfully. We will follow up shortly!',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'Server error: ' + err.message },
      { status: 500 }
    );
  }
}