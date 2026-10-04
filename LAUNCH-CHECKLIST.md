# MW Trends - Production Launch Checklist

## 1. Environment & Config
- [ ] Supabase connection URL and ANON KEY configured.
- [ ] Supabase Service Role Key stored safely (never exposed to client).
- [ ] Database migrations applied (`supabase/migrations`).
- [ ] RLS policies enabled for profiles, designs, orders, products.
- [ ] Cloudflare Pages environment variables mapped correctly.

## 2. Infrastructure & Scale
- [ ] Cloudflare caching set up for 3D assets (`.glb`, `.jpg` textures).
- [ ] Atomic order creation transaction (RPC) deployed to Supabase.
- [ ] Idempotency implemented on the checkout route.
- [ ] Server-side price calculation enforced.

## 3. Security
- [ ] Admin dashboard routes (`/admin`) protected via server-side session checks.
- [ ] Designs storage bucket set to Private.
- [ ] CSP headers reviewed for Cloudflare and Supabase compatibility.

## 4. UI/UX Reliability
- [ ] No blank screens on WebGL crash (fallbacks to static image).
- [ ] Checkout works even if Analytics tracking fails.

## 5. Operations
- [ ] Admin account created safely.
- [ ] Demo data (fake orders, fake customers) wiped from production DB.
- [ ] Runbooks and Backup procedures reviewed by the owner.
