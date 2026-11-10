'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '@/types';
import { DEMO_PROFILES } from '@/lib/data/mock-store';
import { getSupabaseBrowserClient, isDemoMode } from '@/lib/supabase/client';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isLoading: boolean;
  loginAs: (roleKey: 'student' | 'trainer' | 'mentor' | 'admin' | 'counselor' | 'tester') => void;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: DEMO_PROFILES.student,
  role: 'STUDENT',
  isLoading: false,
  loginAs: () => {},
  logout: async () => {},
  updateProfile: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(DEMO_PROFILES.student);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Restore saved demo role from localStorage if exists
    try {
      const savedRole = localStorage.getItem('tejas_active_role');
      if (savedRole && DEMO_PROFILES[savedRole]) {
        setUser(DEMO_PROFILES[savedRole]);
      } else {
        setUser(DEMO_PROFILES.student);
      }
    } catch {
      setUser(DEMO_PROFILES.student);
    }
  }, []);

  const loginAs = (roleKey: 'student' | 'trainer' | 'mentor' | 'admin' | 'counselor' | 'tester') => {
    const profile = DEMO_PROFILES[roleKey];
    if (profile) {
      setUser(profile);
      try {
        localStorage.setItem('tejas_active_role', roleKey);
      } catch {}
    }
  };

  const logout = async () => {
    setIsLoading(true);
    if (!isDemoMode) {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
    }
    setUser(null);
    try {
      localStorage.removeItem('tejas_active_role');
    } catch {}
    setIsLoading(false);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    setUser(prev => (prev ? { ...prev, ...updates, updated_at: new Date().toISOString() } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isLoading,
        loginAs,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
