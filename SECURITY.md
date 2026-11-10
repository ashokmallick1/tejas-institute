# TEJAS Institute of Advanced Technology
## Security Architecture & Threat Model

### Security Posture Overview
TEJAS is designed to protect sensitive student records, proprietary laboratory curricula, and computational access quotas. Security is implemented with defense-in-depth across the network, application, database, and object storage tiers.

---

## 1. Secrets Management & Credential Isolation

- **Frontend Isolation**:
  - The client bundle **ONLY** receives public, non-privileged credentials (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_APP_URL`).
  - **Zero Exposure Rule**: The following secrets are strictly restricted to Node.js server environments and are **NEVER** imported or referenced in client-side code:
    - `SUPABASE_SERVICE_ROLE_KEY`
    - `R2_ACCESS_KEY_ID`
    - `R2_SECRET_ACCESS_KEY`
    - `PAYMENT_GATEWAY_SECRETS`

---

## 2. Cloudflare R2 Storage Security

- **Direct Object Protection**:
  - Direct public bucket listing and unrestricted public reading of course videos, assignment submissions, and student documents is disabled.
- **Presigned URLs**:
  - **Download / Stream**: Generated via Next.js server route (`/api/storage/signed-url`) with a strict time-to-live (TTL) of 3,600 seconds (1 hour).
  - **Uploads**: Issued with 900 seconds (15 minutes) TTL.
- **Upload Validation**:
  - Pre-flight checks on file size (maximum 100MB) and validated MIME types (`application/pdf`, `video/mp4`, `image/*`, `application/zip`) before generating presigned upload tokens.

---

## 3. Database Row-Level Security (RLS)

- Every table in PostgreSQL has RLS explicitly enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`).
- Roles are validated through PostgreSQL `auth.uid()` and the `auth_user_role()` security definer function.
- Students cannot update their own grades, attendance records, or certificate issuance hashes.
- Tamper-proof certificate verification utilizes public SHA-256 hashes without exposing student personal phone numbers, emails, or government IDs.

---

## 4. Application & Transport Security

- **Strict Transport Security**: Enforced HTTPS across all endpoints.
- **Content Security Policy**: Restricts script execution to validated origins.
- **Sanitized Markdown Rendering**: Course player markdown renders in sanitized HTML safe containers.
- **Input Validation**: All client forms (admissions, assignment submissions, attendance logging) are typed and validated through strict TypeScript models and Zod schemas.

---

## 5. Audit Logging

Privileged actions generate immutable records in the `audit_logs` table:
- User role elevations or reassignment
- Grade modifications & mentor approval overrides
- Certificate issuance and ledger hashing
- Course publication or archiving
- Admissions status transitions
