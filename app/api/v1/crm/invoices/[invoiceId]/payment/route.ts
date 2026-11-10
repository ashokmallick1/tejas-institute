import { NextRequest, NextResponse } from 'next/server';
import { AdmissionInvoiceService } from '@/lib/crm/admission-invoice-service';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  try {
    const { invoiceId } = await params;
    const body = await req.json();

    if (!body.amountInr || body.amountInr <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid payment amountInr is required' },
        { status: 400 }
      );
    }

    const result = AdmissionInvoiceService.recordPayment({
      invoiceId,
      amountInr: Number(body.amountInr),
      paymentMode: body.paymentMode || 'UPI',
      transactionReference: body.transactionReference,
      notes: body.notes,
      recordedBy: body.recordedBy || 'Finance Desk',
    });

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Payment of ₹${body.amountInr.toLocaleString('en-IN')} recorded successfully. Receipt ${result.payment.receipt_number} issued.`,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to record payment' },
      { status: 500 }
    );
  }
}
