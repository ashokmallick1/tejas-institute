import React from 'react';
import { PublicShell } from '@/components/layout/public-shell';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, User, Clock, ArrowLeft, Tag } from 'lucide-react';
import { blogPosts } from '@/lib/data/blog';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: `${post.title} | TEJAS Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = blogPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);
    
  if (relatedPosts.length < 3) {
    const more = blogPosts.filter(p => p.slug !== post.slug && !relatedPosts.includes(p)).slice(0, 3 - relatedPosts.length);
    relatedPosts.push(...more);
  }

  return (
    <PublicShell>
      <article className="min-h-screen bg-background pb-20">
        {/* Header */}
        <header className="pt-16 pb-8 sm:pt-24 sm:pb-12 md:pt-32 md:pb-16 px-4">
          <div className="container mx-auto max-w-3xl">
            <Link href="/blog" className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 sm:mb-8">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
            
            <div className="mb-4 sm:mb-6 flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="rounded-full bg-tejas-blue/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-tejas-blue">
                {post.category}
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {post.readTimeMinutes} min read
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-foreground leading-tight tracking-tight mb-4 sm:mb-6">
              {post.title}
            </h1>
            
            <p className="text-base sm:text-xl md:text-2xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
              {post.subtitle}
            </p>

            <div className="flex items-center gap-4 pt-4 sm:pt-6 border-t border-border/50">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold text-base sm:text-lg">
                {post.author.name.charAt(0)}
              </div>
              <div>
                <div className="font-medium text-sm sm:text-base text-foreground">{post.author.name}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{post.author.role}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Cover */}
        <div className="container mx-auto max-w-5xl px-4 mb-10 sm:mb-16">
          <div className={`w-full h-48 sm:h-64 md:h-96 rounded-2xl sm:rounded-3xl ${post.coverGradient} shadow-lg`} />
        </div>

        {/* Content */}
        <div className="container mx-auto max-w-3xl px-4">
          <div 
            className="prose prose-sm sm:prose-base md:prose-lg dark:prose-invert prose-headings:font-display prose-a:text-tejas-blue hover:prose-a:text-tejas-blue-bright max-w-none prose-p:leading-relaxed prose-li:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Related */}
        <div className="container mx-auto max-w-5xl px-4 mt-24 pt-16 border-t border-border">
          <h3 className="text-2xl font-bold font-display mb-8">Related Reading</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map(related => (
              <Link href={`/blog/${related.slug}`} key={related.slug} className="group block space-y-4">
                <div className={`w-full h-40 rounded-xl ${related.coverGradient}`} />
                <div>
                  <h4 className="font-bold text-lg group-hover:text-tejas-blue transition-colors line-clamp-2">
                    {related.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {related.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </PublicShell>
  );
}
