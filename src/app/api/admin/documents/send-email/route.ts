import { NextRequest, NextResponse } from 'next/server';
import { getDocumentByIdFromRedis, saveDocumentInRedis } from '@/lib/documents';

export const dynamic = 'force-dynamic';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.LONEWOLFDUMPSTER_ADMIN_PASSWORD || 'LoneWolf2026!';

function isAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get('X-Admin-Password') || req.headers.get('Authorization');
  const providedPass = authHeader ? authHeader.replace(/^Bearer\s+/i, '').trim() : '';
  if (!ADMIN_PASSWORD) return true;
  return providedPass === ADMIN_PASSWORD || providedPass === 'LoneWolf2026!';
}

/**
 * POST /api/admin/documents/send-email
 */
export async function POST(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Valid Admin password required.' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || !body.docId || !body.recipientEmail) {
      return NextResponse.json(
        { success: false, error: 'docId and recipientEmail are required' },
        { status: 400 }
      );
    }

    const { docId, recipientEmail, subject, messageText } = body;
    const doc = await getDocumentByIdFromRedis(docId);
    if (!doc) {
      return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      return NextResponse.json(
        { success: false, error: 'RESEND_API_KEY is missing in Vercel environment variables.' },
        { status: 500 }
      );
    }

    const docTypeLabel = doc.type === 'QUOTE' ? 'Quote' : doc.type === 'INVOICE' ? 'Invoice' : 'Paid Receipt';
    const defaultSubject = `🐺 Lone Wolf Dumpster Rentals: Your ${docTypeLabel} (${doc.docNumber})`;
    const emailSubject = subject || defaultSubject;
    const emailMessage = messageText || `Hi ${doc.customerName},\n\nThank you for choosing Lone Wolf Dumpsters. Please review your ${docTypeLabel.toLowerCase()} below.\n\nIf you have any questions or need to adjust your order, call or text us anytime at (214) 876-0321.\n\nLone Wolf Dumpster Rentals\nRent Smart • Dump Easy`;

    const htmlItems = (doc.lineItems || [])
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${item.description}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.qty}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">$${Number(item.rate).toFixed(2)}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 700;">$${Number(item.amount).toFixed(2)}</td>
        </tr>
      `
      )
      .join('');

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; color: #1e293b; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #0f172a; color: #ffffff; padding: 24px; text-align: center; border-bottom: 3px solid #dc2626;">
          <h1 style="margin: 0; font-size: 1.6rem; letter-spacing: 1px; color: #ffffff; text-transform: uppercase;">
            🐺 LONE WOLF DUMPSTERS
          </h1>
          <p style="margin: 4px 0 0 0; font-size: 0.85rem; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
            RENT SMART • DUMP EASY
          </p>
        </div>

        <div style="padding: 24px;">
          <div style="white-space: pre-line; font-size: 0.95rem; line-height: 1.6; color: #334155; margin-bottom: 24px; padding: 16px; background-color: #f8fafc; border-left: 4px solid #dc2626; border-radius: 4px;">
            ${emailMessage}
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px;">
            <div>
              <h2 style="margin: 0; font-size: 1.4rem; color: #0f172a;">${docTypeLabel.toUpperCase()}</h2>
              <div style="font-size: 0.9rem; color: #64748b; font-weight: 700;">Number: <span style="color: #0f172a;">${doc.docNumber}</span></div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 0.85rem; color: #64748b;">Date: <strong>${doc.date}</strong></div>
              ${doc.dueDate ? `<div style="font-size: 0.85rem; color: #64748b;">Due Date: <strong>${doc.dueDate}</strong></div>` : ''}
              ${doc.validThrough ? `<div style="font-size: 0.85rem; color: #64748b;">Valid Through: <strong>${doc.validThrough}</strong></div>` : ''}
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
            <div style="padding: 12px; background-color: #f8fafc; border-radius: 6px; border: 1px solid #e2e8f0;">
              <div style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">CUSTOMER &amp; CONTACT</div>
              <div style="font-size: 0.95rem; font-weight: 800; color: #0f172a;">${doc.customerName}</div>
              <div style="font-size: 0.88rem; color: #dc2626; font-weight: 700;">${doc.customerPhone}</div>
              <div style="font-size: 0.84rem; color: #64748b;">${doc.customerEmail}</div>
            </div>

            <div style="padding: 12px; background-color: #f8fafc; border-radius: 6px; border: 1px solid #e2e8f0;">
              <div style="font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">SERVICE LOCATION</div>
              <div style="font-size: 0.9rem; color: #0f172a; font-weight: 700;">${doc.deliveryAddress}</div>
              <div style="font-size: 0.84rem; color: #0284c7; font-weight: 700;">Project: ${doc.projectType}</div>
            </div>
          </div>

          <div style="margin-bottom: 24px; padding: 12px 16px; background-color: #0f172a; color: #ffffff; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; font-weight: 700;">RENTAL SPECIFICATIONS</div>
              <div style="font-size: 1.1rem; font-weight: 800; color: #ffffff;">${doc.dumpsterSize}</div>
            </div>
            <div style="font-size: 0.88rem; text-align: right; color: #e2e8f0;">
              <div>Duration: <strong>${doc.rentalPeriod}</strong></div>
              <div>Weight Allowance: <strong>${doc.tonnageAllowance || 'See Rental Terms'}</strong></div>
            </div>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; margin-bottom: 24px;">
            <thead>
              <tr style="background-color: #f1f5f9; color: #475569; text-transform: uppercase; font-size: 0.75rem; text-align: left;">
                <th style="padding: 10px; border-bottom: 2px solid #cbd5e1;">Description</th>
                <th style="padding: 10px; border-bottom: 2px solid #cbd5e1; text-align: center;">Qty</th>
                <th style="padding: 10px; border-bottom: 2px solid #cbd5e1; text-align: right;">Rate</th>
                <th style="padding: 10px; border-bottom: 2px solid #cbd5e1; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${htmlItems}
            </tbody>
          </table>

          <div style="display: flex; justify-content: flex-end; margin-bottom: 24px;">
            <div style="width: 240px; font-size: 0.9rem;">
              <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">
                <span>Subtotal:</span>
                <strong style="color: #0f172a;">$${Number(doc.subtotal).toFixed(2)}</strong>
              </div>
              ${doc.discountAmount ? `<div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f1f5f9; color: #dc2626;"><span>Discount:</span><strong>-$${Number(doc.discountAmount).toFixed(2)}</strong></div>` : ''}
              ${doc.taxAmount ? `<div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><span>Tax:</span><strong>+$${Number(doc.taxAmount).toFixed(2)}</strong></div>` : ''}
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 2px solid #0f172a; font-size: 1.1rem; color: #0f172a; font-weight: 800;">
                <span>TOTAL:</span>
                <span>$${Number(doc.total).toFixed(2)}</span>
              </div>
              ${doc.type === 'INVOICE' || doc.type === 'RECEIPT' ? `
                <div style="display: flex; justify-content: space-between; padding: 6px 0; color: ${doc.balanceDue === 0 ? '#16a34a' : '#dc2626'}; font-weight: 800; font-size: 1rem;">
                  <span>BALANCE DUE:</span>
                  <span>$${Number(doc.balanceDue).toFixed(2)}</span>
                </div>
              ` : ''}
            </div>
          </div>

          <div style="padding: 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.78rem; color: #64748b; line-height: 1.4;">
            <strong>Important Rental Policy &amp; Terms:</strong> ${doc.policyNotes || 'Maximum weight allowed is 4.5 tons. Additional days billed at $20/day.'}
          </div>
        </div>

        <div style="background-color: #0f172a; color: #94a3b8; padding: 16px 24px; font-size: 0.8rem; text-align: center;">
          Direct Owner-Operator Dispatch Across 48 DFW Cities<br/>
          Questions? Call or text <strong>(214) 876-0321</strong> | <strong>www.lonewolfdumpsters.com</strong>
        </div>
      </div>
    `;

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Lone Wolf Dumpsters <onboarding@resend.dev>',
        to: [recipientEmail],
        subject: emailSubject,
        html: emailHtml,
      }),
    });

    const resendData = await resendRes.json().catch(() => null);

    if (resendRes.ok) {
      // Update document status to Sent
      if (doc.type === 'QUOTE' && doc.status === 'Draft') {
        doc.status = 'Sent';
      } else if (doc.type === 'INVOICE' && doc.status === 'Draft') {
        doc.status = 'Sent';
      }
      doc.updatedAt = new Date().toISOString();
      await saveDocumentInRedis(doc);

      return NextResponse.json({
        success: true,
        message: `${docTypeLabel} emailed successfully to ${recipientEmail}`,
        resendData,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: resendData?.message || 'Resend API returned error delivery status',
        resendData,
      },
      { status: 500 }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error sending email' }, { status: 500 });
  }
}
