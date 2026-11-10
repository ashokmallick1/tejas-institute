import React from 'react';
import { PublicShell } from '@/components/layout/public-shell';
import { DEMO_PROFILES } from '@/lib/data/mock-store';
import { Users, Linkedin, Github, Award, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Faculty & Industry Mentors | TEJAS Institute',
  description: 'Meet the distinguished faculty and staff engineers guiding TEJAS fellows in Bhubaneswar.',
};

export default function FacultyPage() {
  const facultyList = [
    {
      name: DEMO_PROFILES.admin.full_name,
      role: 'Director of Academic Affairs & Systems Architect',
      education: DEMO_PROFILES.admin.education,
      bio: DEMO_PROFILES.admin.bio,
      avatar: DEMO_PROFILES.admin.avatar_url,
      skills: DEMO_PROFILES.admin.skills,
      linkedin: DEMO_PROFILES.admin.linkedin_url,
    },
    {
      name: DEMO_PROFILES.trainer.full_name,
      role: 'Principal AI & MLOps Architect',
      education: DEMO_PROFILES.trainer.education,
      bio: DEMO_PROFILES.trainer.bio,
      avatar: DEMO_PROFILES.trainer.avatar_url,
      skills: DEMO_PROFILES.trainer.skills,
      linkedin: DEMO_PROFILES.trainer.linkedin_url,
    },
    {
      name: DEMO_PROFILES.mentor.full_name,
      role: 'Lead Cloud Infrastructure & Platform Specialist',
      education: DEMO_PROFILES.mentor.education,
      bio: DEMO_PROFILES.mentor.bio,
      avatar: DEMO_PROFILES.mentor.avatar_url,
      skills: DEMO_PROFILES.mentor.skills,
      linkedin: DEMO_PROFILES.mentor.linkedin_url,
    },
    {
      name: 'Dr. Debabrata Jena',
      role: 'Head of VLSI & Semiconductor Systems',
      education: 'PhD Microelectronics, IIT Madras',
      bio: '20+ years leading physical verification and tape-outs across global fabless semiconductor design centers.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      skills: ['VLSI RTL', 'SystemVerilog', 'UVM', 'FPGA Prototyping'],
      linkedin: 'https://linkedin.com',
    },
  ];

  return (
    <PublicShell>
      <section className="border-b border-border bg-card/30 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <span className="rounded-full bg-tejas-blue/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-tejas-blue">
            Distinguished Mentors
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl font-display text-foreground">
            Faculty &amp; Engineering Directors
          </h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg max-w-2xl mx-auto">
            Learn directly from seasoned architects who have deployed planetary-scale software, verified chip designs, and trained thousands of engineers.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {facultyList.map(member => (
              <div
                key={member.name}
                className="flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:border-tejas-blue/40 hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center gap-4">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="h-16 w-16 rounded-2xl object-cover ring-2 ring-tejas-blue/30"
                    />
                    <div>
                      <h2 className="text-base font-bold font-display text-foreground">
                        {member.name}
                      </h2>
                      <div className="text-xs font-semibold text-tejas-blue">
                        {member.role}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {member.education}
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                    {member.bio}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {member.skills.map(s => (
                      <span key={s} className="rounded bg-muted px-2 py-0.5 text-[10px] text-foreground">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Bhubaneswar Campus</span>
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 font-semibold text-tejas-blue hover:underline"
                    >
                      <Linkedin className="h-3.5 w-3.5" />
                      <span>LinkedIn Profile</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
