import { NextRequest } from 'next/server';
import { jsonResponse, handleOptions } from '@/app/api/v1/cors';
import { PROGRAMS, SCHOOLS } from '@/lib/data/programs';

export async function OPTIONS() {
  return handleOptions();
}

/**
 * GET /api/v1/programs
 * Mobile Programs & Schools catalog API
 * Query params: school, featured, search
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const schoolFilter = searchParams.get('school');
  const featuredOnly = searchParams.get('featured') === 'true';
  const query = searchParams.get('q')?.toLowerCase();

  let filtered = [...PROGRAMS];

  if (schoolFilter) {
    const matchedSchool = SCHOOLS.find(s => s.slug === schoolFilter || s.id === schoolFilter);
    const targetSchoolId = matchedSchool ? matchedSchool.id : schoolFilter;
    filtered = filtered.filter(p => p.school_id === targetSchoolId);
  }

  if (featuredOnly) {
    filtered = filtered.filter(p => p.is_featured);
  }

  if (query) {
    filtered = filtered.filter(
      p =>
        p.title.toLowerCase().includes(query) ||
        p.tagline.toLowerCase().includes(query) ||
        p.tools.some(t => t.toLowerCase().includes(query))
    );
  }

  return jsonResponse({
    total: filtered.length,
    schools: SCHOOLS,
    programs: filtered.map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      tagline: p.tagline,
      school_id: p.school_id,
      school_name: p.school_name,
      duration: `${p.duration_weeks} Weeks`,
      class_count: p.class_count,
      fee_inr: p.fee_inr,
      badge: p.badge,
      is_featured: p.is_featured,
      tools: p.tools,
      labs: p.labs || [],
      projects_count: p.projects_highlight?.length || 3,
    })),
  });
}
