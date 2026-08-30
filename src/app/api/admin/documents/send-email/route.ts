import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession, verifyCsrfOrigin } from '@/lib/auth';
import { getDocumentByIdFromRedis, saveDocumentInRedis } from '@/lib/documents';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  if (!verifyCsrfOrigin(req)) {
    return NextResponse.json({ success: false, error: 'Invalid origin header' }, { status: 403 });
  }

  try {
    const body = await req.json().catch(() => null);
    const { docId, recipientEmail, subject } = body || {};

    if (!docId || !recipientEmail) {
      return NextResponse.json({ success: false, error: 'docId and recipientEmail are required' }, { status: 400 });
    }

    const doc = await getDocumentByIdFromRedis(docId);
    if (!doc) {
      return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + resendApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Lone Wolf Dumpsters <dispatch@lonewolfdumpsters.com>',
          to: recipientEmail,
          subject: subject || `${doc.type} ${doc.number} from Lone Wolf Dumpsters`,
          text: `Dear ${doc.customerName},

Please find your ${doc.type} ${doc.number} from Lone Wolf Dumpsters.
Total: $${doc.total.toFixed(2)}

Thank you for choosing Lone Wolf Dumpsters! (214) 876-0321`,
        }),
      });
    }

    if (doc.type === 'QUOTE') doc.quoteStatus = 'Sent';
    if (doc.type === 'INVOICE') doc.invoiceStatus = 'Sent';
    await saveDocumentInRedis(doc);

    return NextResponse.json({ success: true, message: 'Document sent successfully', docNumber: doc.number });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'Server error: ' + err.message }, { status: 500 });
  }
}