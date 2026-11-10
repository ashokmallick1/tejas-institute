'use client';

import React, { useState } from 'react';
import { PublicShell } from '@/components/layout/public-shell';
import { FileText, Download, Lock, CheckCircle2 } from 'lucide-react';
import { whitepapers, Whitepaper } from '@/lib/data/whitepapers';

export default function WhitepapersPage() {
  const openPapers = whitepapers.filter(p => p.access === 'open');
  const gatedPapers = whitepapers.filter(p => p.access === 'gated');

  const [selectedGated, setSelectedGated] = useState<Whitepaper | null>(null);
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSubmitted(true);
    // In real app, trigger download or send email
  };

  return (
    <PublicShell>
      <div className="min-h-screen bg-background pb-24">
        
        {/* Hero */}
        <section className="bg-card/50 border-b border-border py-12 sm:py-20">
          <div className="container mx-auto px-4 max-w-5xl text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-display mb-4 sm:mb-6">
              Research &amp; Whitepapers
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              In-depth analysis, architectural blueprints, and industry reports from the TEJAS research division.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-6xl mt-10 sm:mt-16 space-y-16 sm:space-y-24">
          
          {/* Open Access Section */}
          <section>
            <div className="flex items-center gap-3 mb-10">
              <div className="h-8 w-1.5 rounded-full bg-tejas-blue" />
              <h2 className="text-3xl font-bold font-display">Open Access Papers</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {openPapers.map(paper => (
                <div key={paper.slug} className="flex flex-col sm:flex-row rounded-2xl border border-border bg-card overflow-hidden hover:border-tejas-blue/30 transition-colors shadow-sm group">
                  <div className={`w-full sm:w-48 h-48 sm:h-auto ${paper.coverGradient}`} />
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-tejas-blue uppercase">{paper.category}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5" /> {paper.pages} pages • {paper.fileSize}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-tejas-blue transition-colors">{paper.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1">
                      {paper.abstract}
                    </p>
                    <a href={paper.downloadUrl} className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-tejas-blue transition-colors mt-auto w-fit">
                      <Download className="h-4 w-4" /> Download PDF
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Premium / Gated Section */}
          <section>
            <div className="flex items-center gap-3 mb-10">
              <div className="h-8 w-1.5 rounded-full bg-tejas-orange" />
              <h2 className="text-3xl font-bold font-display">Premium Reports</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {gatedPapers.map(paper => (
                <div key={paper.slug} className="rounded-2xl border border-border bg-card overflow-hidden hover:border-tejas-orange/30 transition-colors shadow-sm flex flex-col">
                  <div className={`w-full h-40 ${paper.coverGradient} relative`}>
                    <div className="absolute top-4 right-4 bg-background/80 backdrop-blur rounded-full p-2 text-foreground">
                      <Lock className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <span className="text-xs font-bold text-tejas-orange uppercase mb-2">{paper.category}</span>
                    <h3 className="text-lg font-bold mb-3">{paper.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
                      {paper.abstract}
                    </p>
                    <button 
                      onClick={() => { setSelectedGated(paper); setEmailSubmitted(false); }}
                      className="w-full py-2.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
                    >
                      <Lock className="h-4 w-4" /> Request Access
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>

      {/* Gated Modal */}
      {selectedGated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-8 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar scroll-touch">
            <button onClick={() => setSelectedGated(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              ✕
            </button>
            
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Get the Report</h3>
            <p className="text-muted-foreground text-xs sm:text-sm mb-6">
              Enter your details to download <strong className="text-foreground">{selectedGated.title}</strong>
            </p>

            {emailSubmitted ? (
              <div className="py-8 text-center flex flex-col items-center">
                <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                <h4 className="text-lg font-bold">Access Granted!</h4>
                <p className="text-sm text-muted-foreground mt-2 mb-6">Your download should start automatically.</p>
                <a href={selectedGated.downloadUrl} className="text-tejas-blue text-sm font-medium hover:underline">
                  Click here if it doesn&apos;t
                </a>
              </div>
            ) : (
              <form onSubmit={handleDownload} className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 text-foreground">Name</label>
                  <input required type="text" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-tejas-blue" placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 text-foreground">Work Email</label>
                  <input required type="email" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-tejas-blue" placeholder="jane@company.com" />
                </div>
                <button type="submit" className="w-full py-2.5 mt-2 rounded-lg bg-tejas-blue text-white text-xs sm:text-sm font-bold hover:bg-tejas-blue/90 transition-colors">
                  Send me the report
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </PublicShell>
  );
}
