import React from 'react';
import { Navbar } from './navbar';
import { Footer } from './footer';
import { MobileBottomNav } from './mobile-bottom-nav';
import { StaffPrivilegedBar } from './staff-privileged-bar';

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-16 pb-16 md:pb-0">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
      <StaffPrivilegedBar />
    </div>
  );
}
