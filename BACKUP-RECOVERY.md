# Backup & Disaster Recovery Plan

## 1. Database Backups
- **Free Tier Consideration:** Supabase Free Tier does not include Point-In-Time Recovery (PITR).
- **Manual Backups:** The Admin/Owner must regularly export the database via the Supabase Dashboard (`Database > Backups > Logical Backups`) or via `pg_dump`.
- **Recommendation:** Once the business generates revenue (Stage B), upgrade to Supabase Pro to enable automated daily backups and 7-day PITR.

## 2. Media Backups
- Supabase Storage buckets (`designs`, `products`) must be backed up locally using the Supabase CLI (`supabase storage ls` and download scripts) weekly.

## 3. Incident Runbook

### Incident: Site Down (Cloudflare Pages Error)
- **Action:** Re-deploy the last known good commit from the Cloudflare Dashboard.
- **Check:** Verify domain DNS settings are correctly pointing to the `.pages.dev` alias.

### Incident: Database Unavailable (Checkout Failing)
- **Action:** Verify Supabase project status.
- **Degraded State:** The frontend will gracefully fail checkout and display "We couldn't confirm your order yet. Your bag is safe. Please try again." No carts will be lost.

### Incident: 3D Experience Failing
- **Action:** Use the "Kill Switch" in the Admin dashboard to set `ENABLE_3D_WORLD = false`.
- **Degraded State:** The Landing page will immediately bypass the MW Plaza and route users directly to the 2D Quick Shop. Commerce will continue uninterrupted.
