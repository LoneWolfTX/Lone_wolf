import { NextRequest, NextResponse } from 'next/server';
import { saveLeadInRedis } from '@/lib/redis';

export const dynamic = 'force-dynamic';

const RECIPIENT_EMAIL = process.env.NOTIFICATION_EMAIL || 'lonewolfdumpsters@gmail.com';

/**
 * POST /api/quote
 * Single Server-Side Lead Intake & Notification Pipeline
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

    // 1. DURABLE LEAD PERSISTENCE IN UPSTASH REDIS (Lead cannot disappear!)
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

    const emailStatus = { status: 'failed', provider: 'FormSubmit.co', error: null as string | null };
    const smsStatus = { status: 'omitted_no_recurring_cost', provider: 'None', note: 'Omitted due to 0-recurring-cost constraint' };

    // 2. SERVER-SIDE EMAIL NOTIFICATION DISPATCH
    try {
      // Check if Resend API key is present
      if (process.env.RESEND_API_KEY) {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Lone Wolf Dumpsters <onboarding@resend.dev>',
            to: [RECIPIENT_EMAIL],
            subject: `🐺 New Lone Wolf Quote Request: ${name} (${phone})`,
            html: `
              <h2>New Lone Wolf Dumpster Quote Request</h2>
              <p><strong>Customer Name:</strong> ${name}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Email:</strong> ${email || 'Not provided'}</p>
              <p><strong>Delivery Address:</strong> ${fullAddress}</p>
              <p><strong>Selected Service:</strong> ${service}</p>
              <p><strong>Project Type:</strong> ${projectType}</p>
              <p><strong>Preferred Date:</strong> ${preferredDate}</p>
              <p><strong>Notes:</strong> ${notes}</p>
            `,
          }),
        });
        if (resendRes.ok) {
          emailStatus.status = 'sent';
          emailStatus.provider = 'Resend API';
        }
      }

      // FormSubmit Server-Side fallback if Resend API is not configured
      if (emailStatus.status !== 'sent') {
        const fsRes = await fetch(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            _subject: `🐺 New Lone Wolf Lead: ${name} (${phone})`,
            Name: name,
            Phone: phone,
            Email: email || 'Not provided',
            'Delivery Address': fullAddress,
            Service: service,
            'Project Type': projectType,
            'Preferred Date': preferredDate,
            Notes: notes,
            Lead_ID: leadId,
          }),
        });

        const fsData = await fsRes.json().catch(() => null);
        if (fsRes.ok && fsData?.success !== 'false') {
          emailStatus.status = 'sent';
          emailStatus.provider = 'FormSubmit.co';
        } else {
          emailStatus.error = fsData?.message || 'FormSubmit activation required by recipient email.';
        }
      }
    } catch (err: any) {
      emailStatus.error = err.message || 'Email dispatch exception';
    }

    // 3. RETURN STRUCTURED PIPELINE RESPONSE
    return NextResponse.json({
      success: true,
      leadId,
      message: 'Quote request received and saved to database.',
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
