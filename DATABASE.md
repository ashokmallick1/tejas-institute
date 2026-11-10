# TEJAS Institute of Advanced Technology
## Database Architecture & Row-Level Security (RLS) Specification

### Overview
The TEJAS data tier is powered by **PostgreSQL** hosted via **Supabase**, with zero-trust database security enforced through **Row Level Security (RLS)** and role-based policies. Object assets (videos, submissions, PDFs, transcripts) are stored in **Cloudflare R2** and tracked via metadata keys.

---

## 1. Core Enumerations

| Enum Name | Values | Purpose |
| :--- | :--- | :--- |
| `user_role` | `SUPER_ADMIN`, `ADMIN`, `ACADEMIC_ADMIN`, `TRAINER`, `MENTOR`, `STUDENT`, `COUNSELLOR`, `CONTENT_MANAGER`, `FINANCE` | Multi-tier RBAC for all portal permissions |
| `content_status` | `DRAFT`, `REVIEW`, `PUBLISHED`, `ARCHIVED` | Academic syllabus lifecycle |
| `submission_status` | `SUBMITTED`, `UNDER_REVIEW`, `CHANGES_REQUESTED`, `RESUBMITTED`, `APPROVED` | 5-stage assignment code review workflow |
| `project_status` | `IDEA`, `PLANNING`, `BUILDING`, `REVIEW`, `IMPROVEMENT`, `COMPLETED`, `DEMONSTRATED` | 7-stage Learn While You Work project lifecycle |
| `attendance_status` | `PRESENT`, `ABSENT`, `LATE`, `EXCUSED` | Session-level laboratory telemetry |
| `application_status` | `NEW`, `CONTACTED`, `COUNSELLING`, `SHORTLISTED`, `ENROLLED`, `REJECTED`, `WITHDRAWN` | Admissions pipeline progression |
| `lesson_type` | `VIDEO`, `READING`, `INTERACTIVE_LAB`, `QUIZ`, `ASSIGNMENT` | Course player content rendering |

---

## 2. Table Specifications

### `profiles`
User metadata extending `auth.users(id)`:
- `id` (UUID, PK, FK -> `auth.users`)
- `email` (TEXT, UNIQUE, NOT NULL)
- `full_name` (TEXT, NOT NULL)
- `role` (user_role, NOT NULL)
- `avatar_url`, `phone`, `headline`, `bio`, `location`
- `skills` (TEXT[]): Verified engineering competencies
- `github_url`, `linkedin_url`, `portfolio_url`
- `is_public` (BOOLEAN): Controls public directory visibility
- `created_at`, `updated_at` (TIMESTAMPTZ)

### `schools` & `programs`
The 5 foundational schools and 17 deep-tech specializations:
- `schools`: `id`, `name`, `slug`, `tagline`, `description`, `icon`, `order_idx`
- `programs`: `id`, `school_id`, `title`, `slug`, `tagline`, `overview`, `duration_weeks` (24), `class_count` (36), `badge`, `fee_inr`, `prerequisites` (TEXT[]), `career_outcomes` (TEXT[]), `tools` (TEXT[]), `labs` (TEXT[])

### `courses`, `modules`, `lessons`
Curricular hierarchy supporting the 3-pane player:
- `courses`: `id`, `program_id`, `title`, `slug`, `description`, `order_idx`, `estimated_hours`
- `modules`: `id`, `course_id`, `title`, `description`, `order_idx`
- `lessons`: `id`, `module_id`, `title`, `slug`, `lesson_type`, `order_idx`, `duration_mins`, `content_markdown`, `is_free_preview`

### `videos` & `lesson_resources` (Cloudflare R2)
- `videos`: `id`, `lesson_id`, `r2_video_key`, `r2_thumbnail_key`, `duration_seconds`, `resolution`, `captions_vtt_key`, `transcript`
- `lesson_resources`: `id`, `lesson_id`, `title`, `r2_file_key`, `file_type`, `file_size_bytes`, `is_downloadable`

### `batches`, `enrollments`, `batch_sessions`, `attendance`
- `batches`: `id`, `program_id`, `name`, `code`, `start_date`, `end_date`, `trainer_id`, `mentor_id`, `max_capacity`, `status`
- `enrollments`: `id`, `student_id`, `program_id`, `batch_id`, `status`, `progress_percentage`, `enrolled_at`, `completed_at`
- `attendance`: `id`, `batch_id`, `session_id`, `student_id`, `session_date`, `status`, `remarks`, `recorded_by`

### `assessments`, `questions`, `attempts`
Interactive MCQ, coding, and benchmark assessment engine:
- `assessments`: `id`, `program_id`, `title`, `time_limit_mins`, `pass_percentage`, `max_attempts`
- `assessment_questions`: `id`, `assessment_id`, `question_text`, `question_type`, `options` (JSONB), `correct_answer` (JSONB), `explanation`, `points`
- `assessment_attempts`: `id`, `assessment_id`, `student_id`, `score`, `percentage`, `passed`, `answers_json`

### `assignments` & `assignment_submissions`
- `assignments`: `id`, `module_id`, `title`, `instructions`, `max_score`, `due_date`, `r2_brief_file_key`
- `assignment_submissions`: `id`, `assignment_id`, `student_id`, `submission_text`, `github_repo_url`, `live_demo_url`, `r2_submission_file_key`, `status`, `score`, `feedback`, `reviewed_by`

### `projects` (Learn While You Work)
- `projects`: `id`, `program_id`, `student_id`, `mentor_id`, `title`, `tagline`, `description`, `objectives` (TEXT[]), `tech_stack` (TEXT[]), `github_url`, `deployment_url`, `status`, `mentor_feedback`, `score`, `is_featured`

### `certificates`
- `certificates`: `id`, `certificate_id` (e.g. `TEJAS-2026-AI-8921`), `student_id`, `program_id`, `issued_at`, `grade`, `verification_hash` (SHA-256), `r2_pdf_key`

### `applications` (Admissions Pipeline)
- `applications`: `id`, `full_name`, `email`, `phone`, `education`, `experience`, `program_id`, `current_skills`, `career_goal`, `preferred_mode`, `city`, `status`, `admin_notes`

### `audit_logs`
- `audit_logs`: `id`, `actor_id`, `action`, `resource_type`, `resource_id`, `metadata` (JSONB), `ip_address`, `created_at`

---

## 3. Row-Level Security (RLS) Strategy

1. **Student Isolation**:
   - Students can only read and write their own `enrollments`, `lesson_progress`, `assignment_submissions`, and `assessment_attempts`.
   - `attendance` is read-only for students, writable by Trainers and Admins.

2. **Faculty / Trainer Access**:
   - Trainers can author and update `courses`, `modules`, `lessons`, and `assessments` for assigned programs.
   - Trainers can mark `attendance` and review class-wide completion progress.

3. **Mentor Access**:
   - Mentors have access to review, score, and annotate `assignment_submissions` and `projects` for assigned fellows.

4. **Public Access**:
   - Public visitors can query published `programs`, `schools`, `courses`, `projects`, and verify credentials via `/verify/[certificateId]` using the `certificates` public view.

5. **Security Definer Function**:
   ```sql
   CREATE OR REPLACE FUNCTION auth_user_role()
   RETURNS user_role AS $$
     SELECT role FROM profiles WHERE id = auth.uid();
   $$ LANGUAGE sql STABLE SECURITY DEFINER;
   ```
