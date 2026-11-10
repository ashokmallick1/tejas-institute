import { NextRequest, NextResponse } from 'next/server';
import { getPaymentProvider } from '@/lib/payments';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { programId, programTitle, amountINR, studentId, studentEmail, studentName } = body;

    const provider = getPaymentProvider();
    const order = await provider.createOrder({
      programId: programId || 'prog-01',
      programTitle: programTitle || 'AI Engineering & Generative AI',
      amountINR: Number(amountINR) || 95000,
      studentId: studentId || 'user-student-01',
      studentEmail: studentEmail || 'student@tejas.ac.in',
      studentName: studentName || 'Rohan Patnaik',
    });

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to initialize payment gateway order.' },
      { status: 500 }
    );
  }
}
