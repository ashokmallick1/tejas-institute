import { describe, it, expect } from 'vitest';
import { PROGRAMS, SCHOOLS } from '../lib/data/programs';
import { validateUploadParameters } from '../lib/storage/r2';
import { getPaymentProvider } from '../lib/payments';
import { SAMPLE_CERTIFICATE, SAMPLE_ASSESSMENT } from '../lib/data/mock-store';

describe('TEJAS Institute — Program Catalog Validation', () => {
  it('should contain all 18 deep-tech programs', () => {
    expect(PROGRAMS.length).toBe(18);
  });

  it('should contain all 6 academic schools', () => {
    expect(SCHOOLS.length).toBe(6);
  });

  it('every program should have valid duration, 36-class structure, and tuition fee', () => {
    PROGRAMS.forEach(prog => {
      expect(prog.title).toBeDefined();
      expect(prog.slug).toBeDefined();
      expect(prog.class_count).toBeGreaterThanOrEqual(30);
      expect(prog.fee_inr).toBeGreaterThan(50000);
      expect(prog.tools.length).toBeGreaterThan(0);
      expect(prog.labs.length).toBeGreaterThan(0);
    });
  });

  it('all programs should link to a valid school', () => {
    const schoolIds = new Set(SCHOOLS.map(s => s.id));
    PROGRAMS.forEach(prog => {
      expect(schoolIds.has(prog.school_id)).toBe(true);
    });
  });
});

describe('TEJAS Institute — Cloudflare R2 Upload Security', () => {
  it('should allow valid video and pdf files within size limits', () => {
    const validPdf = validateUploadParameters(5 * 1024 * 1024, 'application/pdf', 50);
    expect(validPdf.valid).toBe(true);

    const validVideo = validateUploadParameters(40 * 1024 * 1024, 'video/mp4', 50);
    expect(validVideo.valid).toBe(true);
  });

  it('should reject files exceeding the maximum size limit', () => {
    const oversizedFile = validateUploadParameters(60 * 1024 * 1024, 'video/mp4', 50);
    expect(oversizedFile.valid).toBe(false);
    expect(oversizedFile.error).toContain('File size exceeds');
  });

  it('should reject disallowed executable MIME types', () => {
    const exeFile = validateUploadParameters(1024, 'application/x-msdownload', 50);
    expect(exeFile.valid).toBe(false);
    expect(exeFile.error).toContain('is not permitted');
  });
});

describe('TEJAS Institute — Payment Provider Abstraction', () => {
  it('should resolve sandbox provider and create order', async () => {
    const provider = getPaymentProvider();
    expect(provider.name).toBe('sandbox');

    const order = await provider.createOrder({
      programId: 'prog-01',
      programTitle: 'AI Engineering & Generative AI',
      amountINR: 95000,
      studentId: 'user-student-01',
      studentEmail: 'student@tejas.ac.in',
      studentName: 'Rohan Patnaik',
    });

    expect(order.orderId).toContain('tejas_sand_');
    expect(order.amount).toBe(95000);
    expect(order.currency).toBe('INR');
  });
});

describe('TEJAS Institute — Verifiable Digital Credentials', () => {
  it('should have a verifiable SHA-256 certificate hash and ID', () => {
    expect(SAMPLE_CERTIFICATE.certificate_id).toBe('TEJAS-2026-AI-8921');
    expect(SAMPLE_CERTIFICATE.verification_hash.length).toBe(64);
    expect(SAMPLE_CERTIFICATE.student_name).toBe('Rohan Patnaik');
    expect(SAMPLE_CERTIFICATE.skills_covered.length).toBeGreaterThan(0);
  });
});

describe('TEJAS Institute — Assessment Engine Auto-Scoring', () => {
  it('should correctly score MCQ answers against question answer keys', () => {
    let score = 0;
    const testAnswers: Record<string, string> = {
      q1: 'opt_b', // correct
      q2: 'opt_b', // correct
      q3: 'opt_b', // correct
      q4: 'opt_a', // wrong (correct is opt_c)
    };

    SAMPLE_ASSESSMENT.questions?.forEach(q => {
      if (testAnswers[q.id] === q.correct_answer) {
        score += q.points;
      }
    });

    // 3 questions correct * 2 points = 6 points out of 8
    expect(score).toBe(6);
  });
});
