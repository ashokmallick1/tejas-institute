import { NextRequest, NextResponse } from 'next/server';
import { AdmissionInvoiceService, INITIAL_ADMISSIONS } from '@/lib/crm/admission-invoice-service';
import { StudentAdmission } from '@/types/admission-invoice';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const programId = searchParams.get('program_id');

    let admissions = AdmissionInvoiceService.getAdmissions();

    if (status && status !== 'ALL') {
      admissions = admissions.filter((a) => a.status === status);
    }

    if (programId && programId !== 'ALL') {
      admissions = admissions.filter((a) => a.program_id === programId);
    }

    const metrics = AdmissionInvoiceService.getAdmissionsMetrics();

    return NextResponse.json({
      success: true,
      data: admissions,
      metrics,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch admissions' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.application?.id || !body.batchId) {
      return NextResponse.json(
        { success: false, error: 'application object and batchId are required' },
        { status: 400 }
      );
    }

    const newAdmission = AdmissionInvoiceService.issueAdmissionOffer({
      application: body.application,
      batchId: body.batchId,
      batchName: body.batchName || 'Batch Alpha 2026',
      scholarshipTitle: body.scholarshipTitle,
      scholarshipPercentage: body.scholarshipPercentage,
      acceptanceDays: body.acceptanceDays,
      remarks: body.remarks,
    });

    return NextResponse.json(
      {
        success: true,
        message: `Admission Offer ${newAdmission.admission_number} issued successfully`,
        data: newAdmission,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to issue admission offer' },
      { status: 500 }
    );
  }
}
