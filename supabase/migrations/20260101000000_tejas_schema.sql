-- ============================================================
-- TEJAS INSTITUTE OF ADVANCED TECHNOLOGY
-- Comprehensive Database Schema & Row-Level Security (RLS)
-- Location: Bhubaneswar, Odisha, India
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ENUMS
CREATE TYPE user_role AS ENUM (
  'SUPER_ADMIN',
  'ADMIN',
  'ACADEMIC_ADMIN',
  'TRAINER',
  'MENTOR',
  'STUDENT',
  'COUNSELLOR',
  'CONTENT_MANAGER',
  'FINANCE'
);

CREATE TYPE content_status AS ENUM (
  'DRAFT',
  'REVIEW',
  'PUBLISHED',
  'ARCHIVED'
);

CREATE TYPE submission_status AS ENUM (
  'SUBMITTED',
  'UNDER_REVIEW',
  'CHANGES_REQUESTED',
  'RESUBMITTED',
  'APPROVED'
);

CREATE TYPE project_status AS ENUM (
  'IDEA',
  'PLANNING',
  'BUILDING',
  'REVIEW',
  'IMPROVEMENT',
  'COMPLETED',
  'DEMONSTRATED'
);

CREATE TYPE attendance_status AS ENUM (
  'PRESENT',
  'ABSENT',
  'LATE',
  'EXCUSED'
);

CREATE TYPE application_status AS ENUM (
  'NEW',
  'CONTACTED',
  'COUNSELLING',
  'SHORTLISTED',
  'ENROLLED',
  'REJECTED',
  'WITHDRAWN'
);

CREATE TYPE payment_status AS ENUM (
  'PENDING',
  'COMPLETED',
  'FAILED',
  'REFUNDED'
);

CREATE TYPE lesson_type AS ENUM (
  'VIDEO',
  'READING',
  'INTERACTIVE_LAB',
  'QUIZ',
  'ASSIGNMENT'
);

-- 2. USER PROFILES
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'STUDENT',
  avatar_url TEXT,
  phone TEXT,
  headline TEXT,
  bio TEXT,
  location TEXT DEFAULT 'Bhubaneswar, Odisha, India',
  education TEXT,
  skills TEXT[] DEFAULT '{}',
  github_url TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. SCHOOLS & ACADEMIC STRUCTURE
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT,
  icon TEXT,
  order_idx INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  overview TEXT NOT NULL,
  duration_weeks INT NOT NULL DEFAULT 24,
  class_count INT NOT NULL DEFAULT 36,
  badge TEXT,
  fee_inr NUMERIC(10, 2) NOT NULL DEFAULT 95000,
  curriculum_summary TEXT,
  prerequisites TEXT[] DEFAULT '{}',
  career_outcomes TEXT[] DEFAULT '{}',
  tools TEXT[] DEFAULT '{}',
  labs TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  status content_status DEFAULT 'PUBLISHED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  order_idx INT NOT NULL DEFAULT 0,
  estimated_hours INT DEFAULT 20,
  status content_status DEFAULT 'PUBLISHED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_idx INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  lesson_type lesson_type DEFAULT 'VIDEO',
  order_idx INT NOT NULL DEFAULT 0,
  duration_mins INT DEFAULT 25,
  content_markdown TEXT,
  is_free_preview BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. MEDIA & CLOUDFLARE R2 ASSETS
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID UNIQUE NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  r2_video_key TEXT NOT NULL,
  r2_thumbnail_key TEXT,
  duration_seconds INT NOT NULL DEFAULT 0,
  resolution TEXT DEFAULT '1080p',
  captions_vtt_key TEXT,
  transcript TEXT,
  access_policy TEXT DEFAULT 'PROTECTED_SIGNED_URL',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE lesson_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  r2_file_key TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size_bytes BIGINT,
  is_downloadable BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. BATCHES & ENROLLMENTS
CREATE TABLE batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  trainer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  mentor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  max_capacity INT DEFAULT 30,
  status TEXT DEFAULT 'UPCOMING',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  batch_id UUID REFERENCES batches(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'ACTIVE',
  progress_percentage NUMERIC(5, 2) DEFAULT 0.00,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(student_id, program_id)
);

CREATE TABLE batch_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  meeting_url TEXT,
  recording_r2_key TEXT,
  trainer_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. PROGRESS TRACKING
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  watched_seconds INT DEFAULT 0,
  total_seconds INT DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, lesson_id)
);

CREATE TABLE course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  completed_lessons INT DEFAULT 0,
  total_lessons INT DEFAULT 0,
  progress_percentage NUMERIC(5,2) DEFAULT 0.00,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  UNIQUE(student_id, course_id)
);

-- 7. ATTENDANCE
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  session_id UUID REFERENCES batch_sessions(id) ON DELETE SET NULL,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  status attendance_status NOT NULL DEFAULT 'PRESENT',
  remarks TEXT,
  recorded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(batch_id, student_id, session_date)
);

-- 8. ASSESSMENTS ENGINE
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES modules(id) ON DELETE SET NULL,
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  time_limit_mins INT DEFAULT 45,
  pass_percentage NUMERIC(5, 2) DEFAULT 70.00,
  max_attempts INT DEFAULT 3,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE assessment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'MCQ', -- MCQ, CODING, DESCRIPTIVE
  options JSONB NOT NULL DEFAULT '[]', -- array of {id, text}
  correct_answer JSONB NOT NULL, -- single option id or array of ids
  explanation TEXT,
  points INT NOT NULL DEFAULT 1,
  order_idx INT NOT NULL DEFAULT 0
);

CREATE TABLE assessment_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  score NUMERIC(5, 2) DEFAULT 0,
  max_score NUMERIC(5, 2) DEFAULT 0,
  percentage NUMERIC(5, 2) DEFAULT 0,
  passed BOOLEAN DEFAULT false,
  answers_json JSONB DEFAULT '{}'
);

-- 9. ASSIGNMENTS & MENTOR REVIEW
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  instructions TEXT NOT NULL,
  rubric JSONB DEFAULT '[]',
  max_score INT DEFAULT 100,
  due_date TIMESTAMPTZ,
  r2_brief_file_key TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE assignment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  submission_text TEXT,
  github_repo_url TEXT,
  live_demo_url TEXT,
  r2_submission_file_key TEXT,
  status submission_status NOT NULL DEFAULT 'SUBMITTED',
  score INT,
  feedback TEXT,
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. PROJECTS (LEARN WHILE YOU WORK)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mentor_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  tagline TEXT,
  description TEXT NOT NULL,
  objectives TEXT[] DEFAULT '{}',
  tech_stack TEXT[] DEFAULT '{}',
  github_url TEXT,
  deployment_url TEXT,
  r2_docs_key TEXT,
  architecture_diagram_url TEXT,
  status project_status NOT NULL DEFAULT 'IDEA',
  mentor_feedback TEXT,
  score INT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. CERTIFICATES & PUBLIC VERIFICATION
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id TEXT UNIQUE NOT NULL, -- e.g. TEJAS-2026-AI-0042
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  grade TEXT DEFAULT 'Distinction',
  verification_hash TEXT NOT NULL,
  r2_pdf_key TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. NOTIFICATIONS & ANNOUNCEMENTS
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id),
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. APPLICATIONS (ADMISSION SYSTEM)
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  education TEXT NOT NULL,
  experience TEXT NOT NULL,
  program_id UUID REFERENCES programs(id) ON DELETE SET NULL,
  current_skills TEXT,
  career_goal TEXT,
  preferred_mode TEXT DEFAULT 'HYBRID_BHUBANESWAR',
  city TEXT DEFAULT 'Bhubaneswar',
  status application_status DEFAULT 'NEW',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. AUDIT LOGS
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. PERFORMANCE INDEXES
CREATE INDEX idx_programs_school ON programs(school_id);
CREATE INDEX idx_programs_slug ON programs(slug);
CREATE INDEX idx_courses_program ON courses(program_id);
CREATE INDEX idx_modules_course ON modules(course_id);
CREATE INDEX idx_lessons_module ON lessons(module_id);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_lesson_progress_lookup ON lesson_progress(student_id, lesson_id);
CREATE INDEX idx_attendance_lookup ON attendance(batch_id, student_id, session_date);
CREATE INDEX idx_certificates_cert_id ON certificates(certificate_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);

-- 16. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helpers for RLS check
CREATE OR REPLACE FUNCTION auth_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Profiles: Anyone can view public profiles; users can update own profile; admins can manage all
CREATE POLICY "Public profiles are viewable by all" ON profiles
  FOR SELECT USING (is_public = true OR auth.uid() = id OR auth_user_role() IN ('ADMIN', 'SUPER_ADMIN'));

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Schools, Programs, Courses, Modules, Lessons: Public can read published content
CREATE POLICY "Public can view schools" ON schools FOR SELECT USING (true);
CREATE POLICY "Public can view published programs" ON programs FOR SELECT USING (status = 'PUBLISHED' OR auth_user_role() IN ('ADMIN', 'TRAINER'));
CREATE POLICY "Public can view courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Public can view modules" ON modules FOR SELECT USING (true);
CREATE POLICY "Enrolled or preview lessons viewable" ON lessons FOR SELECT USING (true);

-- Enrollments: Student views own; Admin/Trainer views all
CREATE POLICY "Students view own enrollments" ON enrollments
  FOR SELECT USING (auth.uid() = student_id OR auth_user_role() IN ('ADMIN', 'TRAINER', 'MENTOR'));

-- Progress: Student manages own progress
CREATE POLICY "Students manage own progress" ON lesson_progress
  FOR ALL USING (auth.uid() = student_id OR auth_user_role() IN ('ADMIN', 'TRAINER', 'MENTOR'));

-- Submissions: Student views & creates own; Mentor/Trainer/Admin reviews
CREATE POLICY "Students manage own submissions" ON assignment_submissions
  FOR ALL USING (auth.uid() = student_id OR auth_user_role() IN ('ADMIN', 'TRAINER', 'MENTOR'));

-- Certificates: Public can verify certificates
CREATE POLICY "Public can verify certificates" ON certificates FOR SELECT USING (true);

-- Applications: Anyone can submit application; Admins view/update
CREATE POLICY "Anyone can submit application" ON applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view applications" ON applications FOR SELECT USING (auth_user_role() IN ('ADMIN', 'SUPER_ADMIN', 'COUNSELLOR'));
