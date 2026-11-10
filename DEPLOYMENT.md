# TEJAS Institute of Advanced Technology
## Production Deployment Guide

This guide details deployment of the TEJAS modern education platform across the target infrastructure:
- **Frontend / Application Server**: Vercel (or Node.js Docker container)
- **Database & Auth**: Supabase Managed PostgreSQL
- **Object Storage**: Cloudflare R2
- **DNS & CDN**: Cloudflare

---

## 1. Supabase Backend Setup

1. **Create Supabase Project**:
   - Create a project on [database.new](https://database.new) or your self-hosted Supabase instance.
   - Region recommendation: **ap-south-1 (Mumbai, India)** for optimal low-latency access from Bhubaneswar.

2. **Execute Schema Migration**:
   - In Supabase SQL Editor, run `supabase/migrations/20260101000000_tejas_schema.sql`.
   - Verify all 16 tables, 7 enums, and RLS policies are enabled.

3. **Execute Seed Data**:
   - In Supabase SQL Editor, execute `supabase/seed.sql` to populate the 5 schools, 17 programs, demo courses, and initial faculty profiles.

---

## 2. Cloudflare R2 Setup

1. **Create R2 Bucket**:
   - Log into Cloudflare Dashboard → R2 Object Storage.
   - Create bucket: `tejas-institute-storage` (Location: Asia Pacific).

2. **Generate API Token**:
   - Go to Manage R2 API Tokens → Create Token.
   - Permissions: `Admin Read & Write`.
   - Copy `Access Key ID`, `Secret Access Key`, and your Cloudflare Account ID.

3. **CORS Configuration**:
   Add the following CORS policy to allow video streaming and direct browser uploads:
   ```json
   [
     {
       "AllowedOrigins": ["https://tejas.ac.in", "http://localhost:3000"],
       "AllowedMethods": ["GET", "PUT", "HEAD"],
       "AllowedHeaders": ["*"],
       "ExposeHeaders": ["ETag"],
       "MaxAgeSeconds": 3600
     }
   ]
   ```

---

## 3. Frontend Deployment (Vercel)

1. Connect your repository to Vercel.
2. Framework Preset: **Next.js**.
3. Configure Environment Variables in Project Settings:
   ```bash
   NEXT_PUBLIC_APP_URL=https://tejas.ac.in
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

   R2_ACCOUNT_ID=your-cloudflare-account-id
   R2_ACCESS_KEY_ID=your-r2-access-key-id
   R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
   R2_BUCKET_NAME=tejas-institute-storage
   R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com

   PAYMENT_PROVIDER=sandbox
   ```
4. Click **Deploy**.

---

## 4. Verification Checklist

- [ ] Public website loads with high-speed hero and 7-stage flywheel (`/`).
- [ ] Filterable catalog renders all 17 programs (`/programs`).
- [ ] Admissions application form submits into database (`/admissions/apply`).
- [ ] Certificate verification validates hash without login (`/verify/TEJAS-2026-AI-8921`).
- [ ] Student LMS course player streams video and tracks progress (`/dashboard/student`).
- [ ] Trainer studio allows lesson authoring and attendance logging (`/dashboard/trainer`).
- [ ] Mentor review console audits GitHub pull requests (`/dashboard/mentor`).
- [ ] Director console manages admissions and inspects audit logs (`/dashboard/admin`).
