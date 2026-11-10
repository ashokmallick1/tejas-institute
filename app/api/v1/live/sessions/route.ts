import { NextResponse } from 'next/server';
import { SAMPLE_LIVE_SESSIONS } from '@/lib/live/live-class-service';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: SAMPLE_LIVE_SESSIONS,
    count: SAMPLE_LIVE_SESSIONS.length,
    timestamp: new Date().toISOString(),
  });
}
