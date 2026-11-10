import { MetadataRoute } from 'next';
import { PROGRAMS, SCHOOLS } from '@/lib/data/programs';
import { blogPosts } from '@/lib/data/blog';
import { whitepapers } from '@/lib/data/whitepapers';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tejas.bhashaai.in';

  // Static marketing routes
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/about',
    '/about/vision',
    '/about/faculty',
    '/about/labs',
    '/about/career-support',
    '/programs',
    '/schools',
    '/learn-while-you-work',
    '/projects',
    '/admissions',
    '/admissions/apply',
    '/blog',
    '/resources/whitepapers',
    '/faq',
    '/contact',
    '/career',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic Programs (18 programs)
  const programRoutes: MetadataRoute.Sitemap = PROGRAMS.map((p) => ({
    url: `${baseUrl}/programs/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: p.slug === 'forward-deployment-engineer' ? 0.95 : 0.85,
  }));

  // Dynamic Schools (6 schools)
  const schoolRoutes: MetadataRoute.Sitemap = SCHOOLS.map((s) => ({
    url: `${baseUrl}/schools/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }));

  // Dynamic Blog Posts (8 articles)
  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((b) => ({
    url: `${baseUrl}/blog/${b.slug}`,
    lastModified: new Date(b.publishedAt || Date.now()),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...programRoutes, ...schoolRoutes, ...blogRoutes];
}
