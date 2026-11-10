# TEJAS — Institute of Advanced Technology
### *Building India’s Next-Generation Technologists*

**Location**: Infocity & Chandaka Tech Corridor, Bhubaneswar, Odisha, India  
**Core USP**: **LEARN WHILE YOU WORK**  
**Supporting Philosophy**: `Learn → Lab → Apply → Mentor Review → Improve → Document → Demonstrate`

---

## Executive Overview
**TEJAS** is a production-ready, modern deep-tech education platform and engineering academy website + comprehensive Learning Management System (LMS) + Student Portal + Trainer Studio + Mentor Code Review Desk + Admin Operations Console.

Designed with the aesthetic precision of leading engineering academies, GitHub, and high-performance developer platforms.

---

## Key Platform Features

### 1. Public Engineering Institute Website
- **High-Impact Hero Section**: Technology visualization across AI, GPU Clusters, Cloud, SOC Defense, VLSI, Embedded 5G, EV Mobility, Robotics, and HealthTech.
- **The 7-Stage Flywheel**: Interactive breakdown of TEJAS's central differentiator (`Learn → Lab → Apply → Mentor Review → Improve → Document → Demonstrate`).
- **The 5 Foundational Schools**:
  1. *School of AI, Data & Automation*
  2. *School of Cloud, Platform & Cybersecurity*
  3. *School of Software & Digital Engineering*
  4. *School of Semiconductor, Embedded & Mobility*
  5. *School of Industrial & Applied Technology*
- **17 Comprehensive Programs**: Complete 36-class curricula, tool stacks, lab quotas, and tuition specifications (`/programs`).
- **Interactive Admissions**: Multi-step application funnel with instant candidate intake into the operations pipeline (`/admissions/apply`).
- **Public Credential Verification**: Tamper-proof, cryptographically verifiable digital certificates with SHA-256 ledger hashes (`/verify/[certificateId]`).
- **Student Projects Showcase**: Open engineering showcase with live demo links and GitHub repositories (`/projects`).
- **Bhubaneswar Campus & Labs**: Detailed technical specifications of our H100 GPU clusters, FPGA synthesis boards, battery cyclers, and live cyber range.

### 2. Complete LMS & Course Player
- **Desktop 3-Pane Course Player**:
  - **Left**: Collapsible curriculum navigation with completed lesson checkmarks and progress percentages.
  - **Center**: Video streaming player with speed controls, resume playback, and completion threshold (auto-completes at 80% watched). Plus tabbed views for Theory, Assessment Quizzes, and Assignment Submissions.
  - **Right**: Cloudflare R2 protected downloadable attachments, and personal local-saved notes scratchpad.
- **Assessment Engine**:
  - Interactive quizzes with instant automatic grading, explanations, and attempts tracking.
- **Assignment PR Workflow**:
  - `SUBMITTED → UNDER_REVIEW → CHANGES_REQUESTED → RESUBMITTED → APPROVED`.
  - Fellows submit GitHub repositories, live endpoints, and benchmark notes.

### 3. Dedicated Role Portals
- **Student Portal (`/dashboard/student`)**: Welcome banner, overall progress ring, current module checklist, next scheduled session, pending assignments, verified attendance rate, verifiable certificate, and mentor feedback.
- **Trainer Studio (`/dashboard/trainer`)**: Curriculum authoring, lesson publishing, cohort batch tracking, and session attendance marking.
- **Mentor Review Desk (`/dashboard/mentor`)**: Active PR audits, line-by-line architectural critiques, scoring, and capstone milestone defense tracking.
- **Director / Admin Console (`/dashboard/admin`)**: Executive metrics, admissions candidate pipeline management, cohort capacity, and immutable audit security logs.
- **Instant Role Switcher**: Interactive switcher in top navbar allowing evaluators to preview all 4 roles immediately.

---

## Technology Stack

- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript.
- **Styling**: Tailwind CSS + Radix UI + Lucide React icons.
- **Database & Auth**: PostgreSQL (Supabase) with Row-Level Security (RLS) policies.
- **Object Storage**: Cloudflare R2 (S3-compatible presigned streaming and upload URLs).
- **Payment Abstraction**: Modular `PaymentProvider` supporting Sandbox, Razorpay, and Stripe.
- **Zero-Config Demo Mode**: Out-of-the-box local testing fallback without requiring external cloud accounts.

---

## Quick Start & Local Execution

### 1. Clone & Install Dependencies
```bash
cd "tejas institute"
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 3. Switch Portal Roles
Use the **DEMO** role switcher in the top navigation bar to test perspectives:
- **Fellow / Student**: `student@tejas.ac.in` → `/dashboard/student`
- **Trainer / Faculty**: `trainer@tejas.ac.in` → `/dashboard/trainer`
- **Mentor Reviewer**: `mentor@tejas.ac.in` → `/dashboard/mentor`
- **Director / Admin**: `admin@tejas.ac.in` → `/dashboard/admin`

---

## Documentation Index

- [ARCHITECTURE.md](file:///f:/antigravity/tejas%20institute/ARCHITECTURE.md) — Comprehensive architectural blueprint and service topology.
- [DATABASE.md](file:///f:/antigravity/tejas%20institute/DATABASE.md) — Database schema, table relationships, and RLS policies.
- [SECURITY.md](file:///f:/antigravity/tejas%20institute/SECURITY.md) — Zero-trust access controls, secret isolation, and R2 signed URLs.
- [DEPLOYMENT.md](file:///f:/antigravity/tejas%20institute/DEPLOYMENT.md) — Production setup for Vercel, Supabase, and Cloudflare R2.
- `supabase/migrations/20260101000000_tejas_schema.sql` — Complete PostgreSQL migration script.
- `supabase/seed.sql` — Seed data for 5 schools, 17 programs, courses, and demo profiles.

---

## Verification & Testing
Run unit and integration tests:
```bash
npm run test
```

Run TypeScript compilation check:
```bash
npx tsc --noEmit
```

Build production bundle:
```bash
npm run build
```
