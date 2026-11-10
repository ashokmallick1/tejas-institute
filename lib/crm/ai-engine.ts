import { StudentApplication, LeadSentiment } from '@/types';
import { PROGRAMS } from '@/lib/data/programs';

export interface LeadAnalysisResult {
  score: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C';
  summary: string;
  sentiment: LeadSentiment;
  keyStrengths: string[];
  riskFactors: string[];
  recommendedTrack: string;
  interviewQuestions: string[];
  fellowshipRecommendation: string;
}

/**
 * Twenty CRM-style AI Copilot Engine
 * Provides deterministic and generative heuristics for candidate evaluation,
 * profile extraction, outreach generation, and sentiment analysis.
 */
export class CrmAiEngine {
  /**
   * Evaluates a candidate's profile against TEJAS deep-tech curricula
   */
  static analyzeLead(lead: StudentApplication): LeadAnalysisResult {
    let score = 65;
    const strengths: string[] = [];
    const risks: string[] = [];

    const edu = (lead.education || '').toLowerCase();
    const exp = (lead.experience || '').toLowerCase();
    const skills = (lead.current_skills || '').toLowerCase();
    const progId = lead.program_id;

    // Academic pedigree bonus
    if (edu.includes('iit') || edu.includes('nit rourkela') || edu.includes('iiit')) {
      score += 15;
      strengths.push('Tier-1 institutional foundational rigor in mathematics and algorithms');
    } else if (edu.includes('kiit') || edu.includes('iter') || edu.includes('outr') || edu.includes('vssut') || edu.includes('ravenshaw')) {
      score += 10;
      strengths.push('Leading regional engineering institution with strong lab infrastructure');
    }

    // Target Track alignment
    if (progId === 'prog-fde' || progId.includes('fde')) {
      // Forward Deployment Engineer needs breadth + client orientation
      if (skills.includes('python') || skills.includes('docker') || skills.includes('fastapi') || skills.includes('sql')) {
        score += 10;
        strengths.push('Proven backend systems & API deployment fluency for FDE roles');
      }
      if (exp.includes('intern') || exp.includes('year') || exp.includes('engineer')) {
        score += 8;
        strengths.push('Industry exposure reduces client onboarding ramp-up');
      } else {
        risks.push('Fresher candidate will require intensive client simulation training in Sprint 1');
      }
    } else if (progId === 'prog-01' || progId.includes('ai')) {
      // AI / GenAI track
      if (skills.includes('pytorch') || skills.includes('langchain') || skills.includes('transformers') || edu.includes('statistics')) {
        score += 12;
        strengths.push('Applied tensor & vector retrieval foundations already established');
      } else {
        risks.push('Will need preparatory review of linear algebra and matrix calculus');
      }
    } else if (progId === 'prog-09' || progId.includes('vlsi')) {
      // Semiconductor
      if (skills.includes('verilog') || skills.includes('vhdl') || skills.includes('systemverilog') || edu.includes('electronics')) {
        score += 15;
        strengths.push('Digital circuit RTL foundations compatible with Xilinx synthesis lab');
      } else {
        risks.push('Non-electronics background requires fundamental silicon pre-work');
      }
    } else if (progId === 'prog-13' || progId.includes('ev') || progId.includes('battery')) {
      // EV & BMS
      if (skills.includes('matlab') || skills.includes('can') || skills.includes('embedded') || edu.includes('electrical')) {
        score += 14;
        strengths.push('Hardware telemetry & CAN bus controller familiarity');
      }
    }

    // Clamp score
    score = Math.min(98, Math.max(45, score));

    // Determine grade & sentiment
    let grade: LeadAnalysisResult['grade'] = 'B';
    let sentiment: LeadSentiment = 'WARM';

    if (score >= 90) {
      grade = 'A+';
      sentiment = 'HIGH_INTENT';
    } else if (score >= 80) {
      grade = 'A';
      sentiment = 'HIGH_INTENT';
    } else if (score >= 70) {
      grade = 'B+';
      sentiment = 'WARM';
    } else if (score >= 60) {
      grade = 'B';
      sentiment = 'NURTURING';
    } else {
      grade = 'C';
      sentiment = 'SKEPTICAL';
    }

    // Default strengths/risks if list is short
    if (strengths.length === 0) {
      strengths.push('Demonstrates strong motivation to transition into frontier deep-tech');
    }
    if (risks.length === 0) {
      risks.push('Standard cohort curriculum rigor applies');
    }

    // Interview screening questions
    const interviewQuestions = [
      `1. Architecture: How would you approach building a production pipeline for ${lead.program_title || 'this track'} under high concurrency?`,
      `2. Failure Recovery: Describe a technical bug or race condition you debugged in your recent code.`,
      `3. Commitment: TEJAS requires 20+ hours/week of physical lab immersion in Bhubaneswar. How will you manage this alongside your schedule?`,
    ];

    const fellowshipRecommendation =
      score >= 88
        ? '★ Recommended for 25% Merit Fellowship (Founder Cohort)'
        : score >= 75
        ? 'Recommended for Standard Cohort Admission'
        : 'Requires Technical Diagnostic Test before confirmation';

    return {
      score,
      grade,
      summary: `${lead.full_name} exhibits a ${grade} profile (Fit Score: ${score}/100) for ${lead.program_title || 'TEJAS Fellowship'}. ${strengths[0]}.`,
      sentiment,
      keyStrengths: strengths,
      riskFactors: risks,
      recommendedTrack: lead.program_title || 'Forward Deployment Engineer (FDE) Fellowship',
      interviewQuestions,
      fellowshipRecommendation,
    };
  }

  /**
   * Generates AI personalized admissions outreach emails
   */
  static generateOutreach(
    lead: StudentApplication,
    template: 'FDE_INVITATION' | 'INTERVIEW_SHORTLIST' | 'CURRICULUM_DEEPDIVE' | 'FELLOWSHIP_OFFER' | 'COUNSELOR_FOLLOWUP'
  ): { subject: string; body: string } {
    const firstName = lead.full_name.split(' ')[0] || lead.full_name;
    const track = lead.program_title || 'Forward Deployment Engineer (FDE) Fellowship';

    switch (template) {
      case 'FDE_INVITATION':
        return {
          subject: `TEJAS Fellowship Invitation: Forward Deployment Engineering Cohort 2026`,
          body: `Dear ${firstName},\n\nWe reviewed your application and technical background (${lead.education}). Your profile stood out to our Admissions Review Panel for the upcoming Forward Deployment Engineer (FDE) Fellowship at TEJAS Institute.\n\nAs an FDE fellow, you will work directly on enterprise deployment pipelines, multi-cloud integrations, and client architectures at our Bhubaneswar campus with dedicated mentor reviews.\n\nWould you be available for a 20-minute Technical Alignment Discussion this Thursday or Friday?\n\nSchedule your slot here: https://tejas.ac.in/admissions/schedule?ref=${lead.id}\n\nWarm regards,\nAdmissions Directorate\nTEJAS Institute of Advanced Technology\nBhubaneswar, Odisha`,
        };

      case 'INTERVIEW_SHORTLIST':
        return {
          subject: `Shortlisted: Technical Interview for ${track} at TEJAS`,
          body: `Dear ${firstName},\n\nCongratulations! Based on your background in ${lead.education || 'technology'}, you have been shortlisted for the final cohort evaluation round for ${track}.\n\nFormat:\n• 30-minute system design & code critique with a Senior Staff Mentor\n• Discussion on your learning objectives and Bhubaneswar lab schedule\n\nPlease confirm your preferred time slot by replying to this email or accessing your applicant portal.\n\nBest,\nOffice of Admissions & Fellow Selection\nTEJAS Institute`,
        };

      case 'FELLOWSHIP_OFFER':
        return {
          subject: `Admissions Confirmation: Welcome to TEJAS Cohort 2026`,
          body: `Dear ${firstName},\n\nOn behalf of the Academic Council, we are pleased to offer you formal admission to the ${track} (Cohort 2026).\n\nKey Highlights of your Enrollment:\n• Program: ${track}\n• Mode: ${lead.preferred_mode || 'Hybrid (Bhubaneswar Lab Immersion)'}\n• Physical Lab Access: H100 Cluster & Hardware Benches, Infocity Campus\n• Mentor Ratio: 1:8 dedicated guidance\n\nPlease review your formal enrollment dossier and complete confirmation within 5 business days: https://tejas.ac.in/dashboard/enroll?id=${lead.id}\n\nWelcome to TEJAS.\nDirector of Admissions`,
        };

      case 'CURRICULUM_DEEPDIVE':
      default:
        return {
          subject: `Deep-Dive Curriculum & Lab Specifications for ${track}`,
          body: `Hi ${firstName},\n\nFollowing up on your inquiry regarding ${track} at TEJAS Institute.\n\nUnlike traditional theoretical programs, TEJAS is built entirely around our LEARN WHILE YOU WORK methodology across 36 Master Classes and hardware-in-the-loop labs:\n• 100% Hands-on Lab Time in Bhubaneswar\n• Weekly GitHub PR reviews with Chief Architects\n• Capstone projects deployed to live production ranges\n\nTake a look at the detailed syllabus and lab hardware here: https://tejas.ac.in/programs\n\nFeel free to ping me directly if you have any questions!\n\nCounseling Team\nTEJAS Institute`,
        };
    }
  }

  /**
   * Extracts candidate profile from raw resume text or inquiry messages
   */
  static parseResumeText(rawText: string): Partial<StudentApplication> {
    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    const textLower = rawText.toLowerCase();

    // Heuristics for name
    let name = 'Applicant';
    if (lines.length > 0 && lines[0].length < 35 && !lines[0].includes('@')) {
      name = lines[0].replace(/^(resume|cv|name|profile)[:\s-]*/i, '');
    }

    // Email regex
    const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const email = emailMatch ? emailMatch[0] : `applicant.${Date.now().toString().slice(-4)}@gmail.com`;

    // Phone regex
    const phoneMatch = rawText.match(/(?:\+91[\-\s]?)?[6-9]\d{9}/);
    const phone = phoneMatch ? phoneMatch[0] : '+91 98765 00000';

    // Education detection
    let education = 'B.Tech Graduate';
    if (textLower.includes('kiit')) education = 'B.Tech, KIIT University Bhubaneswar';
    else if (textLower.includes('iter') || textLower.includes('soa')) education = 'B.Tech CSE, ITER SOA University';
    else if (textLower.includes('outr') || textLower.includes('cet')) education = 'B.Tech, OUTR Bhubaneswar';
    else if (textLower.includes('vssut')) education = 'B.Tech, VSSUT Burla';
    else if (textLower.includes('nit rourkela')) education = 'B.Tech, NIT Rourkela';
    else if (textLower.includes('m.sc') || textLower.includes('mca')) education = 'Post-Graduate in Computer Applications / Science';

    // Program recommendation
    let program_id = 'prog-fde';
    let program_title = 'Forward Deployment Engineer (FDE) Fellowship';

    if (textLower.includes('vlsi') || textLower.includes('verilog') || textLower.includes('semiconductor')) {
      program_id = 'prog-09';
      program_title = 'VLSI RTL Design & Verification';
    } else if (textLower.includes('bms') || textLower.includes('battery') || textLower.includes('ev')) {
      program_id = 'prog-13';
      program_title = 'EV Battery, BMS & Power Electronics';
    } else if (textLower.includes('kubernetes') || textLower.includes('cloud') || textLower.includes('devops')) {
      program_id = 'prog-05';
      program_title = 'Kubernetes & Cloud Infrastructure Engineering';
    } else if (textLower.includes('agent') || textLower.includes('genai') || textLower.includes('llm') || textLower.includes('rag')) {
      program_id = 'prog-01';
      program_title = 'AI Engineering & Generative AI';
    }

    // Skills extraction
    const detectedSkills: string[] = [];
    const skillBank = ['Python', 'Docker', 'FastAPI', 'PyTorch', 'Next.js', 'Kubernetes', 'Verilog', 'C++', 'Git', 'MATLAB', 'SQL', 'Linux'];
    skillBank.forEach(s => {
      if (textLower.includes(s.toLowerCase())) detectedSkills.push(s);
    });

    return {
      full_name: name,
      email,
      phone,
      education,
      experience: textLower.includes('year') ? '1-2 years experience' : 'Final Year Student / Fresher',
      program_id,
      program_title,
      current_skills: detectedSkills.length ? detectedSkills.join(', ') : 'Python, Problem Solving, Git',
      city: textLower.includes('cuttack') ? 'Cuttack' : 'Bhubaneswar',
      status: 'NEW',
      admin_notes: `Profile auto-extracted by Twenty AI Resume Parser from raw text. Detected skills: ${detectedSkills.join(', ')}.`,
      created_at: new Date().toISOString(),
    };
  }
}
