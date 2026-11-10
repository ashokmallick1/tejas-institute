# TEJAS Twenty AI CRM Architecture & Implementation
## Open-Source, Modern, AI-Native Admissions CRM

Inspired by **[Twenty](https://twenty.com/)** (the modern open-source alternative to Salesforce and HubSpot), this module integrates an AI-native CRM directly inside the TEJAS platform at `/crm` and across subdomains (`crm.tejas.ac.in` / `crm.tejas.bhashaai.in`).

---

## 1. Twenty Architecture Comparison & Parity

| Feature | Twenty CRM Specification | TEJAS AI CRM Implementation |
| :--- | :--- | :--- |
| **UX & Aesthetic** | Notion/Linear-grade dark canvas, high-density typography, keyboard-friendly. | `#08090a` canvas, Plus Jakarta Sans, Source Serif 4 accents, Radix primitives. |
| **View Modes** | Dual Kanban Board + Spreadsheet Table + Metadata Views. | **Kanban Pipeline**, **Data Table View** (checkbox multi-select, inline status selector), **AI Radar View**. |
| **Slide-Over Detail**| Right slide-over drawer with tabs (Timeline, Properties, Tasks). | **Slide-Over Dossier Drawer** with 4 tabs: AI Copilot Analysis, Call Logs & Notes, AI Outreach, Tasks. |
| **AI Copilot** | AI lead enrichment, auto-summarization, sentiment analysis. | **CrmAiEngine**: Dynamic 0-100 fit score, key strengths, curriculum gaps, tailored interview questions. |
| **Resume Extraction**| AI-assisted document and text ingestion. | **AI Resume Parser Modal**: Pastes raw resume text/inquiry -> extracts contact, college, skills, track. |
| **Smart Outreach** | AI email generation with personalized context. | **AI Outreach Generator**: Generates contextual emails (*FDE Invite*, *Interview Shortlist*, *Admissions Offer*). |
| **Pipeline Stages** | Configurable deal stages with monetary sums. | `NEW` → `CONTACTED` → `COUNSELLING` → `SHORTLISTED` → `ENROLLED` → `REJECTED`, with live ₹ INR sums. |
| **LMS Handshake** | Disconnected in standard CRMs; manual onboarding needed. | **Native Lead-to-Fellow Handshake**: 1-click enrollment automatically provisions LMS credentials & batch roster. |

---

## 2. Native Inside TEJAS: Bi-Directional LMS Bridge

Unlike third-party CRMs that sit in a silo, the TEJAS Admissions CRM is natively intertwined with the institute's learning management engine:

1. **Website Application Flow (`/admissions/apply`)**:
   - When a prospective applicant submits their dossier on `/admissions/apply` or any program page, it is ingested directly into `useLms()`.
   - The AI Copilot (`CrmAiEngine.analyzeLead`) automatically scores the applicant in real-time, tagging intent sentiment (`HIGH_INTENT`, `WARM`, `PRICE_SENSITIVE`).
   - The lead appears instantly on the Twenty Kanban board under **New Inquiries**.

2. **Lead-to-Fellow Handshake (`enrollLeadAsStudent`)**:
   - Inside the candidate dossier drawer, counselors have a 1-click action: **"Enroll Fellow"**.
   - Upon click, the candidate's status advances to `ENROLLED`, and an active student enrollment record (`Enrollment` with `batch_id: 'batch-alpha-2026'`) is provisioned in the central LMS store.
   - The fellow can immediately log into the Student LMS portal (`/dashboard/student`) to start their coursework and lab sprints.

3. **Executive Console Integration (`/dashboard/admin`)**:
   - The Director & Operations Console features a real-time **Twenty AI Admissions Widget** displaying live pipeline volume, hot candidate count, confirmed fellows, and total cohort booking value.

4. **Multi-Role Switcher Persona**:
   - Counselors and Admissions Officers have their own dedicated demo persona (**Priyanka Rout**, Head of Admissions) selectable from the universal navigation bar.

---

## 3. Inbound Webhook Ingestion (`/api/v1/crm/webhook`)

For future-proof multi-channel lead capture from Meta Ads, Google Ads, WhatsApp bots, and offline campus drives:

- **Endpoint**: `POST /api/v1/crm/webhook`
- **Method**: `POST`
- **Payload Schema**:
  ```json
  {
    "full_name": "Debashree Mohanty",
    "email": "debashree.mohanty@example.com",
    "phone": "+91 98610 54321",
    "education": "B.Tech CSE, 2025",
    "experience": "1 yr Backend Developer (FastAPI, Redis, Docker)",
    "program_id": "prog-fde",
    "city": "Bhubaneswar",
    "career_goal": "Lead infrastructure & AI platform deployments",
    "source": "META_ADS"
  }
  ```
- **Response**: Returns HTTP 201 with generated lead ID, calculated AI Fit Score, candidate sentiment, category, and evaluation summary.
- **Documentation**: Inspect schema dynamically via `GET /api/v1/crm/webhook`.

---

## 4. AI Intelligence Engine (`lib/crm/ai-engine.ts`)

```typescript
// 1. Candidate Fit & Readiness Appraisal
const analysis = CrmAiEngine.analyzeLead(candidate);
// Returns: { score: 95, grade: 'A+', keyStrengths: [...], riskFactors: [...], interviewQuestions: [...] }

// 2. Automated Personalized Email Drafting
const email = CrmAiEngine.generateOutreach(candidate, 'FDE_INVITATION');
// Returns: { subject: '...', body: '...' }

// 3. Resume & Inquiry Text Parser
const profile = CrmAiEngine.parseResumeText(rawText);
// Returns: Partial<StudentApplication> with extracted skills and recommended track
```

---

## 5. Dedicated API Endpoints (`/api/v1/crm/*`)

- `GET /api/v1/crm/leads` — List leads with filters (`status`, `search`, `program`).
- `POST /api/v1/crm/leads` — Create new lead dossier.
- `PATCH /api/v1/crm/leads/:id` — Move stage, append counselor notes, assign counselor.
- `POST /api/v1/crm/ai` — AI Copilot actions (`ANALYZE_LEAD`, `GENERATE_OUTREACH`, `PARSE_RESUME`).
- `POST /api/v1/crm/webhook` — Multi-channel inbound lead webhook with automated AI evaluation.
- `GET /api/v1/crm/webhook` — Integrator schema & health check endpoint.

---

## 6. Subdomain & Ingress Integration

- Accessible directly at `https://tejas.bhashaai.in/crm` or `http://localhost:3002/crm`.
- Mapped via host-based middleware rewriting to `crm.tejas.bhashaai.in` and `crm.tejas.ac.in`.
- Mobile apps access via `@tejas/api-client` at `https://api.tejas.bhashaai.in/api/v1/crm/leads`.
