import { UserRole } from '@/types';

export type Permission =
  | 'view_public_site'
  | 'submit_application'
  | 'access_lms_courses'
  | 'submit_assignments'
  | 'view_own_certificates'
  | 'grade_assignments'
  | 'conduct_mentor_reviews'
  | 'manage_curriculum'
  | 'access_crm_pipeline'
  | 'issue_admission_offers'
  | 'generate_gst_invoices'
  | 'record_fee_payments'
  | 'access_qa_command_center'
  | 'execute_automated_tests'
  | 'manage_system_users'
  | 'view_financial_analytics';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    'view_public_site',
    'submit_application',
    'access_lms_courses',
    'submit_assignments',
    'view_own_certificates',
    'grade_assignments',
    'conduct_mentor_reviews',
    'manage_curriculum',
    'access_crm_pipeline',
    'issue_admission_offers',
    'generate_gst_invoices',
    'record_fee_payments',
    'access_qa_command_center',
    'execute_automated_tests',
    'manage_system_users',
    'view_financial_analytics',
  ],
  ADMIN: [
    'view_public_site',
    'submit_application',
    'access_lms_courses',
    'view_own_certificates',
    'grade_assignments',
    'conduct_mentor_reviews',
    'manage_curriculum',
    'access_crm_pipeline',
    'issue_admission_offers',
    'generate_gst_invoices',
    'record_fee_payments',
    'access_qa_command_center',
    'execute_automated_tests',
    'manage_system_users',
    'view_financial_analytics',
  ],
  ACADEMIC_ADMIN: [
    'view_public_site',
    'access_lms_courses',
    'grade_assignments',
    'manage_curriculum',
    'access_crm_pipeline',
    'issue_admission_offers',
  ],
  COUNSELLOR: [
    'view_public_site',
    'access_crm_pipeline',
    'issue_admission_offers',
    'generate_gst_invoices',
    'record_fee_payments',
  ],
  FINANCE: [
    'view_public_site',
    'access_crm_pipeline',
    'generate_gst_invoices',
    'record_fee_payments',
    'view_financial_analytics',
  ],
  TRAINER: [
    'view_public_site',
    'access_lms_courses',
    'grade_assignments',
    'manage_curriculum',
  ],
  MENTOR: [
    'view_public_site',
    'access_lms_courses',
    'conduct_mentor_reviews',
    'grade_assignments',
  ],
  STUDENT: [
    'view_public_site',
    'submit_application',
    'access_lms_courses',
    'submit_assignments',
    'view_own_certificates',
  ],
  TESTER: [
    'view_public_site',
    'access_qa_command_center',
    'execute_automated_tests',
    'access_crm_pipeline',
    'access_lms_courses',
  ],
  QA_ENGINEER: [
    'view_public_site',
    'access_qa_command_center',
    'execute_automated_tests',
    'access_crm_pipeline',
    'access_lms_courses',
  ],
  CONTENT_MANAGER: [
    'view_public_site',
    'manage_curriculum',
  ],
};

/**
 * Route protection rules: maps route path prefix to allowed roles
 */
export const ROUTE_ACCESS_RULES: { prefix: string; allowedRoles: UserRole[]; description: string }[] = [
  {
    prefix: '/crm',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'COUNSELLOR', 'FINANCE', 'TESTER'],
    description: 'Admissions CRM, Offer Letters, GST Invoicing & Billing',
  },
  {
    prefix: '/test-data',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'TESTER', 'QA_ENGINEER'],
    description: 'In-App QA Command Center & Test Execution Matrix',
  },
  {
    prefix: '/tester-activity',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'TESTER', 'QA_ENGINEER'],
    description: 'QA Audit Trail & Automated Multi-Device Logs',
  },
  {
    prefix: '/dashboard/admin',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
    description: 'System Administration & Institutional Controls',
  },
  {
    prefix: '/dashboard/trainer',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'TRAINER', 'ACADEMIC_ADMIN'],
    description: 'Faculty Curriculum & Cohort Lab Grading',
  },
  {
    prefix: '/dashboard/mentor',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'MENTOR'],
    description: 'Mentor 1-on-1 Evaluations & Code Defense Reviews',
  },
  {
    prefix: '/dashboard/student',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'STUDENT', 'TESTER'],
    description: 'Student Fellow LMS, Terminal & Project Workspaces',
  },
];

/**
 * Verify if a user with a given role has a specific capability permission
 */
export function hasPermission(role: UserRole | null | undefined, permission: Permission): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

/**
 * Check if a path requires privileged access and whether the role is allowed
 */
export function checkRouteAccess(pathname: string, role: UserRole | null | undefined): {
  isPrivileged: boolean;
  isAllowed: boolean;
  requiredRule?: (typeof ROUTE_ACCESS_RULES)[number];
} {
  const rule = ROUTE_ACCESS_RULES.find((r) => pathname.startsWith(r.prefix));
  if (!rule) {
    return { isPrivileged: false, isAllowed: true };
  }

  if (!role) {
    return { isPrivileged: true, isAllowed: false, requiredRule: rule };
  }

  const isAllowed = rule.allowedRoles.includes(role);
  return { isPrivileged: true, isAllowed, requiredRule: rule };
}

/**
 * Get default home landing page for a given role
 */
export function getRoleLandingPage(role: UserRole | null | undefined): string {
  if (!role) return '/';
  switch (role) {
    case 'SUPER_ADMIN':
    case 'ADMIN':
      return '/dashboard/admin';
    case 'COUNSELLOR':
    case 'FINANCE':
      return '/crm';
    case 'TRAINER':
      return '/dashboard/trainer';
    case 'MENTOR':
      return '/dashboard/mentor';
    case 'TESTER':
    case 'QA_ENGINEER':
      return '/test-data';
    case 'STUDENT':
    default:
      return '/dashboard/student';
  }
}
