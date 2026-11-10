import { NextRequest, NextResponse } from 'next/server';
import { getProtectedReadUrl, getProtectedUploadUrl, validateUploadParameters } from '@/lib/storage/r2';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, key, contentType, fileSizeBytes } = body;

    if (!key) {
      return NextResponse.json({ error: 'Storage object key is required.' }, { status: 400 });
    }

    if (action === 'upload') {
      // Validate upload metadata
      const validation = validateUploadParameters(fileSizeBytes || 1024, contentType || 'application/octet-stream', 100);
      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }

      const uploadResult = await getProtectedUploadUrl(key, contentType || 'application/octet-stream', 900);
      return NextResponse.json(uploadResult);
    }

    // Default: read action
    const signedUrl = await getProtectedReadUrl(key, 3600);
    return NextResponse.json({ url: signedUrl, key, expiresInSeconds: 3600 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to process R2 storage operation.' },
      { status: 500 }
    );
  }
}
