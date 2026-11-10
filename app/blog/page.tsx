'use client';

import React, { useState } from 'react';
import { PublicShell } from '@/components/layout/public-shell';
import Link from 'next/link';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';
import { blogPosts, BlogCategory } from '@/lib/data/blog';

const CATEGORIES: ('All' | BlogCategory)[] = [
  'All',
  'AI & ML',
  'Cloud & DevOps',
  'Career',
  'Industry',
  'Semiconductor',
  'Research'
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<'All' | BlogCategory>('All');
  const [visibleCount, setVisibleCount] = useState(6);

  const featuredPost = blogPosts.find(p => p.featured) || blogPosts[0];
  
  const filteredPosts = blogPosts.filter(post => 
    post.slug !== featuredPost.slug && 
    (activeCategory === 'All' || post.category === activeCategory)
  );

  const visiblePosts = filteredPosts.slice(0, visibleCount);

  return (
    <PublicShell>
      {/* Hero / Featured */}
      <section className="border-b border-border bg-card/30 py-10 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-display text-foreground">
              Engineering Blog
            </h1>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground md:text-lg max-w-2xl mx-auto">
              Deep dives, architectural decisions, and technical insights from the TEJAS engineering team.
            </p>
          </div>

          <Link href={`/blog/${featuredPost.slug}`} className="block group">
            <div className="rounded-2xl sm:rounded-3xl border border-border bg-card overflow-hidden shadow-sm transition hover:border-tejas-blue/40 flex flex-col md:flex-row">
              <div className={`w-full md:w-1/2 min-h-[220px] sm:min-h-[300px] ${featuredPost.coverGradient}`} />
              <div className="w-full md:w-1/2 p-5 sm:p-8 md:p-12 flex flex-col justify-center">
                <span className="inline-block rounded-full bg-tejas-blue/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-tejas-blue w-fit mb-3 sm:mb-4">
                  {featuredPost.category}
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-foreground mb-3 sm:mb-4 group-hover:text-tejas-blue transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-sm text-muted-foreground mb-4 sm:mb-6 line-clamp-3">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" /> {featuredPost.author.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" /> {featuredPost.readTimeMinutes} min read
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          
          {/* Filters - Horizontal scroll on mobile, wrap on desktop */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 sm:flex-wrap sm:justify-center no-scrollbar scroll-touch px-1 -mx-1">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => { setActiveCategory(category); setVisibleCount(6); }}
                className={`shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-colors ${
                  activeCategory === category 
                    ? 'bg-tejas-blue text-white shadow-sm' 
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {visiblePosts.map(post => (
              <Link href={`/blog/${post.slug}`} key={post.slug} className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-sm transition hover:border-tejas-blue/40 hover:-translate-y-1">
                <div className={`w-full h-48 ${post.coverGradient}`} />
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-xs font-bold text-tejas-blue uppercase mb-3">
                    {post.category}
                  </span>
                  <h3 className="text-xl font-bold font-display text-foreground mb-3 group-hover:text-tejas-blue transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6 line-clamp-2 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/50 mt-auto">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readTimeMinutes} min
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Load More */}
          {visiblePosts.length < filteredPosts.length && (
            <div className="mt-16 flex justify-center">
              <button 
                onClick={() => setVisibleCount(prev => prev + 6)}
                className="inline-flex items-center justify-center rounded-full bg-secondary px-8 py-3 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                Load More Articles
              </button>
            </div>
          )}

          {filteredPosts.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              No articles found in this category.
            </div>
          )}

        </div>
      </section>
    </PublicShell>
  );
}
