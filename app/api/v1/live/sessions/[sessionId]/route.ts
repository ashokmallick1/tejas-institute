import { NextRequest, NextResponse } from 'next/server';
import { LiveClassService } from '@/lib/live/live-class-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const session = LiveClassService.getSessionById(sessionId);

  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Live session not found' },
      { status: 404 }
    );
  }

  const doubts = LiveClassService.getDoubts(sessionId);
  const chat = LiveClassService.getChatMessages(sessionId);
  const poll = LiveClassService.getActivePoll(sessionId);

  return NextResponse.json({
    success: true,
    data: {
      session,
      doubts,
      chat,
      poll,
    },
  });
}
