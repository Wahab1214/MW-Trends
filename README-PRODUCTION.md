# MW Trends - Production Architecture & Operations Guide

## Overview
MW Trends is a modern, high-performance Next.js application built for the Edge. It utilizes a 3D WebGL frontend (React Three Fiber) coupled with a highly scalable, idempotent backend powered by Supabase PostgreSQL.

## Architecture

**Frontend / Edge Application:**
- **Hosting:** Cloudflare Pages (Free Tier)
- **Framework:** Next.js App Router
- **3D Engine:** Three.js / React Three Fiber
- **Styling:** Tailwind CSS + Framer Motion

**Backend / Database:**
- **Database:** Supabase PostgreSQL
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage (S3-compatible)

## Scale & Free-Tier Reality
The initial launch utilizes free-tier infrastructure. This means:
- **Cloudflare Pages:** Generous free limit for static asset delivery.
- **Supabase:** Limited concurrent connections and storage. 
- **Mitigation:** The application is built "Edge-Heavy" and "Cache-Heavy". The database is only hit for stateful mutations (checkout, admin) and authenticated views. Anonymous product browsing hits static Cloudflare caches.

### Upgrade Triggers (When to pay)
- **Database Latency:** If checkout latency spikes due to connection pool limits.
- **Storage Nearing Cap:** When user uploaded artwork approaches the free Supabase storage limit (1GB).
- **Custom Domain:** When the owner is ready to purchase a domain, it can be attached directly to Cloudflare without application rewrites.

## Deployment Process
1. Commit changes to the `main` branch.
2. Cloudflare Pages automatically detects the push.
3. CI runs `npm run build`.
4. If successful, Cloudflare deploys to the Edge.

## Local Setup
1. Clone the repository.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and add your Supabase keys.
4. Run `npm run dev`.

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
- `SUPABASE_SERVICE_ROLE_KEY`: Your private Service Role Key (NEVER commit this).
