'use client';

import React, { useState } from 'react';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { useAuth } from '@/lib/auth/auth-context';
import { useLms } from '@/lib/store/lms-store';
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Github,
  Linkedin,
  Globe,
  Camera,
  Save,
  Shield,
  Award,
  BookOpen,
  Code2,
  CheckCircle2,
} from 'lucide-react';

const SKILLS_LIST = [
  'Python', 'TypeScript', 'React', 'Next.js', 'Node.js', 'FastAPI',
  'PostgreSQL', 'MongoDB', 'Docker', 'Kubernetes', 'AWS', 'Azure',
  'GCP', 'Terraform', 'Ansible', 'LangChain', 'PyTorch', 'TensorFlow',
  'SQL', 'Git', 'Linux', 'Kafka', 'Redis', 'Elasticsearch',
  'CI/CD', 'MLflow', 'Airflow', 'Spark', 'Databricks', 'Grafana',
];

export default function StudentProfilePage() {
  const { user } = useAuth();
  const { enrollments, certificates } = useLms();
  const [activeTab, setActiveTab] = useState<'profile' | 'privacy'>('profile');
  const [saved, setSaved] = useState(false);
  const [profilePublic, setProfilePublic] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  const [form, setForm] = useState({
    full_name: user?.full_name ?? 'Rohan Sharma',
    email: user?.email ?? 'rohan.sharma@example.com',
    phone: user?.phone ?? '+91 98765 43210',
    location: user?.location ?? 'Bhubaneswar, Odisha',
    education: user?.education ?? 'B.Tech Computer Science, NIT Rourkela (2024)',
    github: user?.github_url ?? 'https://github.com/rohan-dev',
    linkedin: user?.linkedin_url ?? 'https://linkedin.com/in/rohan-sharma',
    portfolio: user?.portfolio_url ?? 'https://rohan.dev',
    bio: user?.bio ?? 'Passionate AI engineer building production-grade ML systems. Currently enrolled in AI Engineering & GenAI program at TEJAS Institute.',
    selectedSkills: user?.skills ?? ['Python', 'Docker', 'AWS', 'TypeScript', 'SQL', 'Git'],
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const toggleSkill = (skill: string) => {
    setForm(f => ({
      ...f,
      selectedSkills: f.selectedSkills.includes(skill)
        ? f.selectedSkills.filter(s => s !== skill)
        : [...f.selectedSkills, skill],
    }));
  };

  const completedEnrollments = enrollments.filter(e => e.status === 'COMPLETED');
  const isStudent = user?.role === 'STUDENT';

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your profile, skills, and visibility settings
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-lg bg-muted p-1 w-fit">
          {(['profile', 'privacy'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left — avatar + stats */}
            <div className="space-y-4">
              {/* Avatar */}
              <div className="rounded-xl border border-border bg-card p-6 text-center">
                <div className="relative mx-auto mb-4 h-24 w-24">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-tejas-blue to-tejas-cyan flex items-center justify-center text-white text-3xl font-bold select-none">
                    {form.full_name.charAt(0)}
                  </div>
                  <button className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-tejas-blue text-white shadow hover:bg-tejas-blue/80 transition-colors">
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="text-lg font-semibold">{form.full_name}</div>
                <div className="text-sm text-muted-foreground">
                  {user?.role === 'STUDENT' ? 'Fellow' : user?.role ?? 'Member'}
                </div>
                <div className="mt-1 text-xs text-tejas-cyan font-medium">
                  {profilePublic ? '🌍 Profile Public' : '🔒 Profile Private'}
                </div>
              </div>

              {/* Stats */}
              <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Stats</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>Enrolled Programs</span>
                  </div>
                  <span className="font-semibold">{enrollments.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Completed</span>
                  </div>
                  <span className="font-semibold">{completedEnrollments.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span>Certificates</span>
                  </div>
                  <span className="font-semibold">{certificates.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Code2 className="h-4 w-4 text-tejas-cyan" />
                    <span>Skills Tagged</span>
                  </div>
                  <span className="font-semibold">{form.selectedSkills.length}</span>
                </div>
              </div>
            </div>

            {/* Right — edit form */}
            <div className="lg:col-span-2 space-y-4">
              {/* Basic info */}
              <div className="rounded-xl border border-border bg-card p-4 sm:p-6 space-y-4">
                <h2 className="font-semibold flex items-center gap-2">
                  <User className="h-4 w-4 text-tejas-blue" /> Basic Information
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Full Name</label>
                    <input
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-tejas-blue/50"
                      value={form.full_name}
                      onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Email</label>
                    <input
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-tejas-blue/50"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Phone</label>
                    <input
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-tejas-blue/50"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Location</label>
                    <input
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-tejas-blue/50"
                      value={form.location}
                      onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Education</label>
                  <input
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-tejas-blue/50"
                    value={form.education}
                    onChange={e => setForm(f => ({ ...f, education: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Bio</label>
                  <textarea
                    rows={3}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-tejas-blue/50 resize-none"
                    value={form.bio}
                    onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  />
                </div>
              </div>

              {/* Links */}
              <div className="rounded-xl border border-border bg-card p-4 sm:p-6 space-y-4">
                <h2 className="font-semibold flex items-center gap-2">
                  <Globe className="h-4 w-4 text-tejas-cyan" /> Links
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Github className="h-4 w-4 text-muted-foreground shrink-0" />
                    <input
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-tejas-blue/50"
                      placeholder="https://github.com/username"
                      value={form.github}
                      onChange={e => setForm(f => ({ ...f, github: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Linkedin className="h-4 w-4 text-muted-foreground shrink-0" />
                    <input
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-tejas-blue/50"
                      placeholder="https://linkedin.com/in/username"
                      value={form.linkedin}
                      onChange={e => setForm(f => ({ ...f, linkedin: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                    <input
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-tejas-blue/50"
                      placeholder="https://yourportfolio.dev"
                      value={form.portfolio}
                      onChange={e => setForm(f => ({ ...f, portfolio: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="rounded-xl border border-border bg-card p-4 sm:p-6 space-y-4">
                <h2 className="font-semibold flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-tejas-orange" /> Skills
                </h2>
                <p className="text-xs text-muted-foreground">Select the technologies and skills you have.</p>
                <div className="flex flex-wrap gap-2">
                  {SKILLS_LIST.map(skill => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                        form.selectedSkills.includes(skill)
                          ? 'border-tejas-blue bg-tejas-blue/10 text-tejas-blue'
                          : 'border-border bg-muted/30 text-muted-foreground hover:border-tejas-blue/50'
                      }`}
                    >
                      {form.selectedSkills.includes(skill) && '✓ '}{skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Save */}
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className={`inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white shadow transition-all ${
                    saved
                      ? 'bg-green-600 hover:bg-green-600'
                      : 'bg-tejas-blue hover:bg-tejas-blue/90'
                  }`}
                >
                  {saved ? <><CheckCircle2 className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Profile</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="max-w-2xl space-y-4">
            <div className="rounded-xl border border-border bg-card p-6 space-y-5">
              <h2 className="font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4 text-tejas-blue" /> Privacy Settings
              </h2>

              {[
                { label: 'Public Profile', desc: 'Allow employers and mentors to view your profile', state: profilePublic, set: setProfilePublic },
                { label: 'Show Email', desc: 'Display your email on your public profile', state: showEmail, set: setShowEmail },
                { label: 'Show Phone', desc: 'Display your phone number on your public profile', state: showPhone, set: setShowPhone },
              ].map(({ label, desc, state, set }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <div className="text-sm font-medium">{label}</div>
                    <div className="text-xs text-muted-foreground">{desc}</div>
                  </div>
                  <button
                    onClick={() => set(!state)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                      state ? 'bg-tejas-blue' : 'bg-muted'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${state ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 p-6">
              <h2 className="font-semibold text-red-700 dark:text-red-400 mb-1">Danger Zone</h2>
              <p className="text-sm text-red-600/80 dark:text-red-400/70 mb-4">
                These actions are irreversible. Please be certain.
              </p>
              <button className="rounded-lg border border-red-300 dark:border-red-700 bg-background px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors">
                Request Account Deletion
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
