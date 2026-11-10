import { NextRequest, NextResponse } from 'next/server';
import { AdmissionInvoiceService, INITIAL_INVOICES } from '@/lib/crm/admission-invoice-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const applicationId = searchParams.get('application_id');

    let invoices = AdmissionInvoiceService.getInvoices();

    if (status && status !== 'ALL') {
      invoices = invoices.filter((i) => i.status === status);
    }

    if (applicationId) {
      invoices = invoices.filter((i) => i.application_id === applicationId);
    }

    const metrics = AdmissionInvoiceService.getInvoicesMetrics();

    return NextResponse.json({
      success: true,
      data: invoices,
      metrics,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.application?.id || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'application object and at least one item are required' },
        { status: 400 }
      );
    }

    const newInvoice = AdmissionInvoiceService.createInvoice({
      application: body.application,
      admissionId: body.admissionId,
      items: body.items,
      discountInr: body.discountInr,
      discountLabel: body.discountLabel,
      paymentPlan: body.paymentPlan,
      billingAddress: body.billingAddress,
      billingCity: body.billingCity,
      billingState: body.billingState,
      gstin: body.gstin,
      dueDays: body.dueDays,
      notes: body.notes,
    });

    return NextResponse.json(
      {
        success: true,
        message: `Invoice ${newInvoice.invoice_number} created successfully`,
        data: newInvoice,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create invoice' },
      { status: 500 }
    );
  }
}
