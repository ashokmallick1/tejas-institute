# TEJAS Multi-Subdomain Architecture Blueprint
## Host-Based Routing, Isolation & Ingress Routing

This document specifies the multi-subdomain routing architecture for TEJAS Institute, enabling dedicated subdomains for **Admissions CRM**, **Student/Faculty LMS**, **Mobile API Gateway**, and **Main Brand Experience**.

---

## 1. Subdomain Topology

| Subdomain | Environment Host | Internal Route | Target Audience & Purpose |
| :--- | :--- | :--- | :--- |
| **Main Website** | `tejas.ac.in` / `tejas.bhashaai.in` | `/` | Prospective fellows, parents, public catalog, research whitepapers, blogs. |
| **Admissions CRM** | `crm.tejas.ac.in` / `crm.tejas.bhashaai.in` | `/crm` | Counselors, admissions officers, lead qualification, FDE interview triage. |
| **Student LMS** | `lms.tejas.ac.in` / `lms.tejas.bhashaai.in` | `/dashboard` | Enrolled fellows, curriculum player, code reviews, hardware lab bookings. |
| **Mobile & Dev API**| `api.tejas.ac.in` / `api.tejas.bhashaai.in` | `/api/v1` | Mobile apps (iOS/Android), background webhooks, and third-party integrations. |
| **Operations** | `admin.tejas.ac.in` / `admin.tejas.bhashaai.in`| `/dashboard/admin`| Institute directors, cohort management, infrastructure telemetry. |

---

## 2. Middleware Host-Based Rewriting (`middleware.ts`)

Next.js App Router performs edge-level rewriting based on the HTTP `Host` header:

```typescript
// 1. Detect subdomain
if (host.startsWith('crm.') || subdomainParam === 'crm') {
  url.pathname = `/crm${pathname === '/' ? '' : pathname}`;
  return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
}

// 2. Detect LMS subdomain
if (host.startsWith('lms.') || subdomainParam === 'lms') {
  url.pathname = `/dashboard${pathname === '/' ? '' : pathname}`;
  return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
}

// 3. Detect API subdomain
if (host.startsWith('api.') || subdomainParam === 'api') {
  url.pathname = `/api/v1${pathname === '/' ? '' : pathname}`;
  return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
}
```

### Local Development Simulation
For instant local testing without modifying local hosts or DNS:
- Visiting `http://localhost:3002/?subdomain=crm` routes directly into the CRM experience.
- Visiting `http://localhost:3002/crm` also routes directly to the CRM app.
- Simulating with `curl -H "Host: crm.tejas.bhashaai.in" http://localhost:3002/` serves the CRM pipeline transparently.

---

## 3. Cloudflare Tunnel Ingress Configuration (`tejas-config.yml`)

The tunnel is configured to accept subdomains dynamically:

```yaml
tunnel: 303ff3e9-dfa7-4be8-934f-33aab78d72c3
credentials-file: C:\Users\user\.cloudflared\303ff3e9-dfa7-4be8-934f-33aab78d72c3.json

ingress:
  - hostname: crm.tejas.bhashaai.in
    service: http://localhost:3002
  - hostname: lms.tejas.bhashaai.in
    service: http://localhost:3002
  - hostname: api.tejas.bhashaai.in
    service: http://localhost:3002
  - hostname: tejas.bhashaai.in
    service: http://localhost:3002
  - hostname: "*.tejas.bhashaai.in"
    service: http://localhost:3002
  - service: http_status:404
```

---

## 4. Cross-Subdomain Session & Cookie Sharing

To allow single sign-on (SSO) across `tejas.ac.in`, `lms.tejas.ac.in`, and `crm.tejas.ac.in`:
1. In `middleware.ts`, Supabase session cookies are set with:
   ```typescript
   domain: '.tejas.bhashaai.in' // or '.tejas.ac.in'
   ```
2. Any cookie issued on `.tejas.ac.in` is automatically sent by browsers to all subdomains (`crm.*`, `lms.*`), allowing counselors and fellows to navigate between portals without re-authenticating.
3. Mobile apps authenticate via `Authorization: Bearer <jwt_token>`, bypassing cookie restrictions entirely.
