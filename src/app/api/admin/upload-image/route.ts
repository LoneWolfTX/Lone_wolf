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

function detectImageTypeFromBuffer(buffer: Buffer): 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif' | null {
  if (buffer.length < 12) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return 'image/png';
  }

  // WebP: RIFF .... WEBP
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return 'image/webp';
  }

  // AVIF: ftyp box with avif/avis/mif1
  const brand = buffer.toString('ascii', 4, 12);
  if (brand.startsWith('ftyp')) {
    const majorBrand = brand.substring(4);
    if (['avif', 'avis', 'mif1', 'msf1'].includes(majorBrand)) {
      return 'image/avif';
    }
  }

  return null;
}

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

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const verifiedType = detectImageTypeFromBuffer(buffer);

    if (!verifiedType) {
      return NextResponse.json(
        { success: false, error: 'Invalid image file signature. Only verified JPEG, PNG, WebP, and AVIF image binaries are permitted (SVG/executables are strictly prohibited).' },
        { status: 400 }
      );
    }

    const extMap = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/avif': 'avif',
    };
    const ext = extMap[verifiedType];
    const randomId = Math.random().toString(36).substring(2, 10);
    const filename = 'lone-wolf-uploads/' + Date.now() + '-' + randomId + '.' + ext;

    const blob = await put(filename, buffer, {
      access: 'public',
      token: blobToken,
      contentType: verifiedType,
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