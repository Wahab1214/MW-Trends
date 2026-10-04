# Security Configuration & Runbook

## Core Principles
1. **Client Prices Are Never Trusted:** All final calculations happen securely within the `create_order_transaction` RPC on the Supabase PostgreSQL layer.
2. **Customer Artwork is Private:** By default, user-uploaded designs are placed in a private Supabase Storage bucket. Access requires an authenticated session mapped to the design owner.
3. **Atomic Orders:** The checkout process is atomic. Inventory is never decremented unless the order fully commits. If a network retry occurs, the Idempotency Key ensures duplicate orders are not created.

## Row Level Security (RLS)
The following tables have strict RLS enforced:
- **profiles:** `uid()` matching.
- **orders / order_items:** `uid()` matching for customers. Admin role check for staff.
- **designs:** `uid()` matching.
- **products:** Public read for published items, Admin for writes.

## API Keys
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Safe to expose to the frontend. Used for public queries and authenticated user actions bounded by RLS.
- `SUPABASE_SERVICE_ROLE_KEY`: **DANGER**. Never commit to Git. Never expose to the browser. Used in `lib/supabase/server.ts` `createAdminClient()` only for administrative overrides and server-side atomic transactions.

## Vulnerability Prevention
- **XSS:** Next.js automatically escapes HTML. No `dangerouslySetInnerHTML` is used for user content.
- **SQL Injection:** Supabase client uses parameterized queries. RPC functions strictly type-check inputs.
