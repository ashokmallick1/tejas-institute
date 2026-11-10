'use client';

import React from 'react';
import { PublicShell } from '@/components/layout/public-shell';
import { MapPin, Mail, Phone, Clock, Send } from 'lucide-react';


export default function ContactPage() {
  return (
    <PublicShell>
      <section className="border-b border-border bg-card/30 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <span className="rounded-full bg-tejas-blue/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-tejas-blue">
            Bhubaneswar Campus
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl font-display text-foreground">
            Connect with TEJAS
          </h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg max-w-2xl mx-auto">
            Visit our laboratories, schedule an admissions interview, or submit general inquiries.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Contact Details */}
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-xl font-bold font-display text-foreground">
                Campus Location
              </h2>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
                  <MapPin className="h-5 w-5 text-tejas-orange shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-foreground">Main Campus &amp; Labs</div>
                    <div className="text-muted-foreground mt-0.5">
                      TEJAS Institute of Advanced Technology<br />
                      Infocity &amp; Chandaka Tech Corridor<br />
                      Bhubaneswar, Odisha 751024, India
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
                  <Mail className="h-5 w-5 text-tejas-blue shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-foreground">Email Communications</div>
                    <div className="text-muted-foreground mt-0.5">
                      Admissions: admissions@tejas.ac.in<br />
                      Academic Affairs: academics@tejas.ac.in<br />
                      Verification: verify@tejas.ac.in
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
                  <Phone className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-foreground">Telephone Inquiries</div>
                    <div className="text-muted-foreground mt-0.5">
                      +91 (0674) 295-8800<br />
                      +91 98765 43210 (Admissions Desk)
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
                  <Clock className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-foreground">Operating Hours</div>
                    <div className="text-muted-foreground mt-0.5">
                      Monday – Saturday: 08:30 AM – 08:00 PM IST<br />
                      Labs are accessible 24/7 for enrolled fellows.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiries Form */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
                <h3 className="text-lg font-bold font-display text-foreground">Send an Inquiry</h3>
                <p className="text-xs text-muted-foreground mt-1">Our academic coordinators will respond within 24 hours.</p>

                <form className="mt-6 space-y-4" onSubmit={e => { e.preventDefault(); alert('Inquiry received. A TEJAS coordinator will connect with you.'); }}>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-foreground">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Soumya Mishra"
                        className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-tejas-blue focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground">Your Email</label>
                      <input
                        type="email"
                        required
                        placeholder="soumya@example.com"
                        className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-tejas-blue focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground">Subject / Program of Interest</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Inquiring about GPU compute allocations in AI Engineering"
                      className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-tejas-blue focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground">Message</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Share your background, questions, or request to tour the Bhubaneswar labs..."
                      className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-tejas-blue focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 rounded-xl bg-tejas-blue px-6 py-2.5 text-xs font-bold text-white hover:bg-tejas-blue-dark transition"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send Message</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
