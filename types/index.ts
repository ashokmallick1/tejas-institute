export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'ACADEMIC_ADMIN'
  | 'TRAINER'
  | 'MENTOR'
  | 'STUDENT'
  | 'COUNSELLOR'
  | 'CONTENT_MANAGER'
  | 'FINANCE'
  | 'TESTER'
  | 'QA_ENGINEER';

export * from './qa';
export * from './admission-invoice';
export * from './live-class';

export type ContentStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';

export type SubmissionStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'CHANGES_REQUESTED'
  | 'RESUBMITTED'
  | 'APPROVED';

export type ProjectStatus =
  | 'IDEA'
  | 'PLANNING'
  | 'BUILDING'
  | 'REVIEW'
  | 'IMPROVEMENT'
  | 'COMPLETED'
  | 'DEMONSTRATED';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export type ApplicationStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'COUNSELLING'
  | 'SHORTLISTED'
  | 'ENROLLED'
  | 'REJECTED'
  | 'WITHDRAWN';

export type LessonType = 'VIDEO' | 'READING' | 'INTERACTIVE_LAB' | 'QUIZ' | 'ASSIGNMENT';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  phone?: string;
  headline?: string;
  bio?: string;
  location?: string;
  education?: string;
  skills: string[];
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface School {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  icon: string;
  order_idx: number;
  programs_count?: number;
}

export interface ProgramCurriculumWeek {
  week: number;
  title: string;
  topics: string[];
  handsOnLab: string;
  deliverable: string;
}

export interface ProgramFAQ {
  question: string;
  answer: string;
}

export interface Program {
  id: string;
  school_id: string;
  school_name?: string;
  title: string;
  slug: string;
  tagline: string;
  overview: string;
  duration_weeks: number;
  class_count: number;
  badge?: string;
  fee_inr: number;
  curriculum_summary?: string;
  curriculum_weeks?: ProgramCurriculumWeek[];
  prerequisites: string[];
  career_outcomes: string[];
  outcomes?: string[];
  mode?: string;
  intake?: string;
  tools: string[];
  labs: string[];
  projects_highlight?: string[];
  faqs?: ProgramFAQ[];
  is_featured: boolean;
  status: ContentStatus | 'ACTIVE' | 'COMING_SOON' | 'REGISTRATIONS_OPEN';
  created_at?: string;
}

export interface Course {
  id: string;
  program_id: string;
  title: string;
  slug: string;
  description: string;
  order_idx: number;
  estimated_hours: number;
  status: ContentStatus;
  modules?: Module[];
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string;
  order_idx: number;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  slug: string;
  lesson_type: LessonType;
  order_idx: number;
  duration_mins: number;
  content_markdown?: string;
  is_free_preview: boolean;
  video?: LessonVideo;
  resources?: LessonResource[];
  is_completed?: boolean;
}

export interface LessonVideo {
  id: string;
  lesson_id: string;
  r2_video_key: string;
  r2_thumbnail_key?: string;
  video_url?: string; // Signed streaming URL
  duration_seconds: number;
  resolution: string;
  captions_vtt_url?: string;
  transcript?: string;
}

export interface LessonResource {
  id: string;
  lesson_id: string;
  title: string;
  r2_file_key: string;
  download_url?: string; // Signed download URL
  file_type: string;
  file_size_bytes?: number;
  is_downloadable: boolean;
}

export interface Batch {
  id: string;
  program_id: string;
  program_title?: string;
  name: string;
  code: string;
  start_date: string;
  end_date?: string;
  trainer_id?: string;
  trainer_name?: string;
  mentor_id?: string;
  mentor_name?: string;
  max_capacity: number;
  enrolled_count?: number;
  status: 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface Enrollment {
  id: string;
  student_id: string;
  program_id: string;
  program?: Program;
  batch_id?: string;
  batch?: Batch;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  progress_percentage: number;
  enrolled_at: string;
  completed_at?: string;
}

export interface LessonProgress {
  id: string;
  student_id: string;
  lesson_id: string;
  watched_seconds: number;
  total_seconds: number;
  is_completed: boolean;
  completed_at?: string;
  last_accessed_at: string;
}

export interface AttendanceRecord {
  id: string;
  batch_id: string;
  student_id: string;
  student_name?: string;
  session_date: string;
  session_topic?: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface AssessmentQuestion {
  id: string;
  assessment_id: string;
  question_text: string;
  question_type: 'MCQ' | 'MULTIPLE_ANSWER' | 'CODING' | 'DESCRIPTIVE';
  options: { id: string; text: string }[];
  correct_answer: string | string[];
  explanation?: string;
  points: number;
  order_idx: number;
}

export interface Assessment {
  id: string;
  module_id?: string;
  program_id: string;
  title: string;
  description: string;
  time_limit_mins: number;
  pass_percentage: number;
  max_attempts: number;
  questions?: AssessmentQuestion[];
}

export interface AssessmentAttempt {
  id: string;
  assessment_id: string;
  student_id: string;
  started_at: string;
  submitted_at?: string;
  score: number;
  max_score: number;
  percentage: number;
  passed: boolean;
  answers_json: Record<string, any>;
}

export interface Assignment {
  id: string;
  module_id: string;
  module_title?: string;
  title: string;
  instructions: string;
  max_score: number;
  due_date: string;
  r2_brief_file_key?: string;
}

export interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  assignment_title?: string;
  student_id: string;
  student_name?: string;
  student_avatar?: string;
  submission_text?: string;
  github_repo_url?: string;
  live_demo_url?: string;
  r2_submission_file_key?: string;
  file_name?: string;
  status: SubmissionStatus;
  score?: number;
  feedback?: string;
  reviewed_by?: string;
  reviewer_name?: string;
  reviewed_at?: string;
  submitted_at: string;
}

export interface StudentProject {
  id: string;
  program_id: string;
  program_title?: string;
  student_id: string;
  student_name?: string;
  mentor_id?: string;
  mentor_name?: string;
  title: string;
  tagline?: string;
  description: string;
  objectives: string[];
  tech_stack: string[];
  github_url?: string;
  deployment_url?: string;
  status: ProjectStatus;
  mentor_feedback?: string;
  score?: number;
  is_featured: boolean;
  created_at: string;
}

export interface Certificate {
  id: string;
  certificate_id: string;
  student_id: string;
  student_name: string;
  program_id: string;
  program_title: string;
  issued_at: string;
  grade: string;
  verification_hash: string;
  verification_url: string;
  skills_covered: string[];
  authorized_signatory: string;
  signatory_title: string;
}

export type LeadSentiment = 'HIGH_INTENT' | 'WARM' | 'NURTURING' | 'SKEPTICAL' | 'PRICE_SENSITIVE';
export type LeadSource = 'WEBSITE' | 'CAMPUS_OUTREACH' | 'LINKEDIN' | 'REFERRAL' | 'DIRECT_INQUIRY' | 'HACKATHON';

export interface CrmTask {
  id: string;
  title: string;
  due_date: string;
  completed: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface StudentApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  education: string;
  experience: string;
  program_id: string;
  program_title?: string;
  current_skills?: string;
  career_goal?: string;
  preferred_mode: string;
  city: string;
  status: ApplicationStatus;
  admin_notes?: string;
  created_at: string;
  // Twenty CRM & AI Intelligence Extensions
  ai_score?: number; // 0-100 fit score
  ai_summary?: string;
  ai_recommendation?: string;
  sentiment?: LeadSentiment;
  source?: LeadSource;
  counselor_name?: string;
  deal_value_inr?: number;
  tasks?: CrmTask[];
  github_profile?: string;
  linkedin_profile?: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  link_url?: string;
  is_read: boolean;
  created_at: string;
}

export interface AnnouncementItem {
  id: string;
  batch_id?: string;
  program_id?: string;
  title: string;
  content: string;
  author_name: string;
  is_pinned: boolean;
  created_at: string;
}
