import React from 'react';
import { PublicShell } from '@/components/layout/public-shell';
import { Hero } from '@/components/home/hero';
import { LearnWhileYouWorkSection } from '@/components/home/learn-while-you-work';
import { InteractiveTerminal } from '@/components/home/interactive-terminal';
import { SchoolsSection } from '@/components/home/schools-section';
import { FeaturedPrograms } from '@/components/home/featured-programs';
import { ProjectsShowcase } from '@/components/home/projects-showcase';
import { CampusLabs } from '@/components/home/campus-labs';
import { CtaBanner } from '@/components/home/cta-banner';

export default function HomePage() {
  return (
    <PublicShell>
      <Hero />
      <LearnWhileYouWorkSection />
      <InteractiveTerminal />
      <SchoolsSection />
      <FeaturedPrograms />
      <ProjectsShowcase />
      <CampusLabs />
      <CtaBanner />
    </PublicShell>
  );
}
