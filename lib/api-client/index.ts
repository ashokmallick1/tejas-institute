/**
 * TEJAS Universal Client SDK (@tejas/api-client)
 * 
 * Platform-agnostic TypeScript client for TEJAS Institute.
 * Compatible with:
 *  - React Native / Expo (iOS & Android)
 *  - Next.js / React Web
 *  - Node.js backend scripts / Webhooks
 */

export interface ClientConfig {
  baseUrl?: string;
  authToken?: string | null;
  getAuthToken?: () => Promise<string | null> | string | null;
  onUnauthorized?: () => void;
  platform?: 'expo' | 'react-native' | 'web' | 'node';
  clientVersion?: string;
}

export class TejasClient {
  private baseUrl: string;
  private config: ClientConfig;

  constructor(config: ClientConfig = {}) {
    this.config = config;
    this.baseUrl = (config.baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002').replace(/\/$/, '');
  }

  private async getHeaders(): Promise<HeadersInit> {
    let token = this.config.authToken;
    if (!token && this.config.getAuthToken) {
      token = await this.config.getAuthToken();
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Client-Version': this.config.clientVersion || '1.0.0',
      'X-Platform': this.config.platform || 'web',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const headers = await this.getHeaders();

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers || {}),
      },
    });

    if (response.status === 401 && this.config.onUnauthorized) {
      this.config.onUnauthorized();
    }

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // ── Authentication & Profile ──
  public auth = {
    getSession: () => this.request<{ authenticated: boolean; user: any }>('/api/v1/auth/session'),
  };

  // ── Programs & Catalog ──
  public programs = {
    list: (params?: { school?: string; featured?: boolean; q?: string }) => {
      const q = new URLSearchParams();
      if (params?.school) q.set('school', params.school);
      if (params?.featured) q.set('featured', 'true');
      if (params?.q) q.set('q', params.q);
      const queryStr = q.toString() ? `?${q.toString()}` : '';
      return this.request<{ total: number; schools: any[]; programs: any[] }>(`/api/v1/programs${queryStr}`);
    },
  };

  // ── Student LMS Portal ──
  public student = {
    getDashboard: () => this.request<any>('/api/v1/student/dashboard'),
  };

  // ── CRM & Admissions ──
  public crm = {
    getLeads: (params?: { status?: string; q?: string }) => {
      const q = new URLSearchParams();
      if (params?.status) q.set('status', params.status);
      if (params?.q) q.set('q', params.q);
      const queryStr = q.toString() ? `?${q.toString()}` : '';
      return this.request<{ success: boolean; stats: any; count: number; leads: any[] }>(`/api/v1/crm/leads${queryStr}`);
    },
    createLead: (lead: {
      full_name: string;
      email: string;
      phone: string;
      program_id?: string;
      program_title?: string;
      education?: string;
      experience?: string;
      city?: string;
      career_goal?: string;
    }) => this.request<{ success: boolean; lead: any }>('/api/v1/crm/leads', {
      method: 'POST',
      body: JSON.stringify(lead),
    }),
    updateLead: (id: string, updates: Partial<any>) =>
      this.request<{ success: boolean; lead: any }>(`/api/v1/crm/leads/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      }),
  };

  // ── Cloudflare R2 Presigned Uploads ──
  public storage = {
    getUploadUrl: (params: { filename: string; contentType: string; bucketCategory: string }) =>
      this.request<{ uploadUrl: string; fileKey: string; publicUrl: string }>('/api/storage/signed-url', {
        method: 'POST',
        body: JSON.stringify(params),
      }),
  };
}

// Default singleton instance
export const tejasApi = new TejasClient();
