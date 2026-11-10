import { NextRequest } from 'next/server';
import { jsonResponse, handleOptions } from '@/app/api/v1/cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';

    // 1. JSON payload with base64 data URI
    if (contentType.includes('application/json')) {
      const body = await request.json();
      const { data_url, filename = 'evidence_screenshot.png' } = body;

      if (!data_url) {
        return jsonResponse({ success: false, error: 'data_url required' }, 400);
      }

      return jsonResponse({
        success: true,
        message: 'Evidence screenshot uploaded and referenced.',
        file_url: data_url,
        filename,
      }, 201);
    }

    // 2. FormData file upload
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return jsonResponse({ success: false, error: 'No file found in formData' }, 400);
    }

    // Convert file buffer to base64 Data URI for durable browser preview
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mime = file.type || 'image/png';
    const base64Data = `data:${mime};base64,${buffer.toString('base64')}`;

    return jsonResponse({
      success: true,
      message: 'Evidence screenshot uploaded successfully.',
      file_url: base64Data,
      filename: file.name,
      file_size: file.size,
    }, 201);
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}
