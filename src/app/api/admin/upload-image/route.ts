import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { verifyAdminSession, verifyCsrfOrigin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
]);

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  if (!verifyCsrfOrigin(req)) {
    return NextResponse.json({ success: false, error: 'Invalid origin header' }, { status: 403 });
  }

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (!blobToken) {
    return NextResponse.json(
      {
        success: false,
        error: 'Vercel Blob storage is not configured. Please add BLOB_READ_WRITE_TOKEN in Vercel environment variables to enable durable image uploads.',
      },
      { status: 503 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds maximum 5MB limit.' },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only JPEG, PNG, WebP, and AVIF images are permitted.' },
        { status: 400 }
      );
    }

    const ext = file.type.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';
    const randomId = Math.random().toString(36).substring(2, 10);
    const filename = 'lone-wolf-uploads/' + Date.now() + '-' + randomId + '.' + ext;

    const blob = await put(filename, file, {
      access: 'public',
      token: blobToken,
      contentType: file.type,
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      pathname: blob.pathname,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'Image upload failed: ' + err.message },
      { status: 500 }
    );
  }
}