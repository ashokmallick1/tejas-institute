/**
 * TEJAS Universal Mobile SDK
 * 
 * Cross-platform TypeScript client for React Native, Expo, Flutter, and Capacitor apps.
 * Provides typed methods for authentication, courses, admissions, invoices, attendance, and push tokens.
 */

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'ACADEMIC_ADMIN' | 'TRAINER' | 'MENTOR' | 'STUDENT' | 'COUNSELLOR' | 'CONTENT_MANAGER' | 'FINANCE' | 'TESTER' | 'QA_ENGINEER';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
}

export interface StudentAdmission {
  id: string;
  program_title: string;
  status: string;
  [key: string]: any;
}

export interface StudentInvoice {
  id: string;
  status: string;
  total_amount: number;
  [key: string]: any;
}

export interface MobileAuthResponse {
  success: boolean;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: UserProfile;
}

export interface MobileDeviceRegistration {
  device_token: string;
  platform: 'ios' | 'android';
  device_name?: string;
  os_version?: string;
  app_version?: string;
}

export interface StorageAdapter {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}

/** Default in-memory / browser fallback storage adapter */
const defaultStorage: StorageAdapter = {
  getItem: async (key: string) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return null;
  },
  setItem: async (key: string, val: string) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, val);
    }
  },
  removeItem: async (key: string) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  },
};

export class TejasMobileClient {
  private baseUrl: string;
  private storage: StorageAdapter;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(options?: { baseUrl?: string; storage?: StorageAdapter }) {
    this.baseUrl = options?.baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://tejas.bhashaai.in');
    this.storage = options?.storage || defaultStorage;
  }

  /**
   * Initialize client by restoring saved tokens from secure storage
   */
  async init(): Promise<boolean> {
    try {
      this.accessToken = await this.storage.getItem('tejas_mobile_access_token');
      this.refreshToken = await this.storage.getItem('tejas_mobile_refresh_token');
      return Boolean(this.accessToken);
    } catch {
      return false;
    }
  }

  /**
   * Authenticate mobile user (supports demo roles or credentials)
   */
  async login(credentials: { email: string; password?: string; roleKey?: string }): Promise<MobileAuthResponse> {
    const res = await fetch(`${this.baseUrl}/api/v1/auth/mobile-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Authentication failed with status ${res.status}`);
    }

    const data: MobileAuthResponse = await res.json();
    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token;

    await this.storage.setItem('tejas_mobile_access_token', data.access_token);
    await this.storage.setItem('tejas_mobile_refresh_token', data.refresh_token);
    await this.storage.setItem('tejas_mobile_user', JSON.stringify(data.user));

    return data;
  }

  /**
   * Log out and wipe secure storage tokens
   */
  async logout(): Promise<void> {
    this.accessToken = null;
    this.refreshToken = null;
    await this.storage.removeItem('tejas_mobile_access_token');
    await this.storage.removeItem('tejas_mobile_refresh_token');
    await this.storage.removeItem('tejas_mobile_user');
  }

  /**
   * Authenticated HTTP request wrapper with Bearer token injection
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');
    if (this.accessToken) {
      headers.set('Authorization', `Bearer ${this.accessToken}`);
    }

    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `Request failed with status ${response.status}`);
    }

    return response.json();
  }

  // ── 1. Student LMS APIs ──

  async getStudentDashboard() {
    return this.request<{ success: boolean; data: any }>(`/api/v1/student/dashboard`);
  }

  async getCourses() {
    return this.request<{ success: boolean; data: any[] }>(`/api/v1/programs`);
  }

  // ── 2. Admissions & CRM APIs ──

  async getAdmissions(params?: { status?: string; search?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<{ success: boolean; data: StudentAdmission[]; metrics: any }>(
      `/api/v1/crm/admissions${query ? `?${query}` : ''}`
    );
  }

  async getInvoices(params?: { status?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<{ success: boolean; data: StudentInvoice[]; metrics: any }>(
      `/api/v1/crm/invoices${query ? `?${query}` : ''}`
    );
  }

  // ── 3. Push Notifications & Device Telemetry ──

  async registerDevice(payload: MobileDeviceRegistration) {
    return this.request<{ success: boolean; message: string }>(`/api/v1/mobile/device`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

/** Global singleton client instance */
export const tejasMobileClient = new TejasMobileClient();
