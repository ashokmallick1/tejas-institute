import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const key = url.searchParams.get('key') || 'uploaded-file';
  return NextResponse.json({
    success: true,
    message: `Mock Cloudflare R2 upload received for key '${key}'.`,
    key,
  });
}
