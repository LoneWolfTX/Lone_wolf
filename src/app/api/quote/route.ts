import { NextRequest, NextResponse } from 'next/server';
import { saveLeadInRedis } from '@/lib/redis';

export const dynamic = 'force-dynamic';

const RECIPIENT_EMAIL = process.env.NOTIFICATION_EMAIL || 'lonewolfdumpsters@gmail.com';

/**
 * POST /api/quote
 * Server-side lead intake & direct Resend email delivery pipeline.
 * FormSubmit dependency completely removed.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || !body.name || !body.phone) {
      return NextResponse.json(
        { success: false, error: 'Full Name and Phone Number are required.' },
        { status: 400 }
      );
    }

    const {
      name,
      phone,
      email = '',
      deliveryAddress = '',
      streetAddress = '',
      city = '',
      zip = '',
      service = '20-yard-dumpster',
      projectType = 'Home Cleanout',
      preferredDate = 'As soon as possible',
      notes = 'None provided',
    } = body;

    const fullAddress = deliveryAddress || `${streetAddress} ${city} ${zip}`.trim() || 'DFW Metroplex';

    // 1. DURABLE LEAD PERSISTENCE IN UPSTASH REDIS FIRST (Lead cannot disappear!)
    const savedLead = await saveLeadInRedis({
      name,
      phone,
      email,
      deliveryAddress: fullAddress,
      service,
      projectType,
      preferredDate,
      notes,
    });

    const leadId = savedLead ? savedLead.id : `lead_${Date.now()}`;

    const emailStatus = {
      status: 'pending',
      provider: 'Resend API',
      recipient: RECIPIENT_EMAIL,
      error: null as string | null,
    };

    const smsStatus = {
      status: 'NOT_IMPLEMENTED',
      provider: 'Paid Provider Required',
      note: 'Native SMS omitted due to zero-recurring-cost requirement',
    };

    // 2. DIRECT SERVER-SIDE EMAIL DELIVERY (Resend Vercel API)
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Lone Wolf Dumpsters <onboarding@resend.dev>',
            to: [RECIPIENT_EMAIL],
            subject: `🐺 New Quote Request: ${name} (${phone})`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; color: #1e293b;">
                <h2 style="color: #d97706; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
                  🐺 New Lone Wolf Dumpster Quote Lead
                </h2>
                <p><strong>Lead ID:</strong> <code>${leadId}</code></p>
                <p><strong>Customer Name:</strong> ${name}</p>
                <p><strong>Phone Number:</strong> <a href="tel:${phone}">${phone}</a></p>
                <p><strong>Email:</strong> ${email ? `<a href="mailto:${email}">${email}</a>` : 'Not provided'}</p>
                <p><strong>Delivery Address:</strong> ${fullAddress}</p>
                <p><strong>Dumpster Size / Service:</strong> ${service}</p>
                <p><strong>Project Type:</strong> ${projectType}</p>
                <p><strong>Preferred Date:</strong> ${preferredDate}</p>
                <p><strong>Customer Notes:</strong> ${notes || 'None'}</p>
                <hr style="border: none; border-top: 1px solid #cbd5e1; margin: 20px 0;" />
                <p style="font-size: 0.85rem; color: #64748b;">
                  This lead is stored permanently in Upstash Redis and accessible in Admin Studio.
                </p>
              </div>
            `,
          }),
        });

        const resendData = await resendRes.json().catch(() => null);

        if (resendRes.ok && resendData?.id) {
          emailStatus.status = 'sent';
          emailStatus.error = null;
        } else {
          emailStatus.status = 'failed';
          emailStatus.error = resendData?.message || `Resend API returned HTTP ${resendRes.status}`;
        }
      } catch (err: any) {
        emailStatus.status = 'failed';
        emailStatus.error = err.message || 'Resend network error';
      }
    } else {
      emailStatus.status = 'requires_api_key';
      emailStatus.error = 'RESEND_API_KEY environment variable not set in Vercel. Lead saved to Redis database.';
    }

    // 3. RETURN STRUCTURED PIPELINE RESPONSE
    return NextResponse.json({
      success: true,
      leadId,
      message: 'Quote request received and saved to Upstash Redis database.',
      email: emailStatus,
      sms: smsStatus,
      leadSaved: !!savedLead,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Server error processing quote submission.' },
      { status: 500 }
    );
  }
}
