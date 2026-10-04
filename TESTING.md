# Testing Strategy for MW Trends

## 1. Unit Tests
- Business logic (price calculation, idempotency hash generation, cart grouping).
- Located in `lib/__tests__/`.

## 2. Integration Tests
- Endpoints testing DB constraints. 
- Using a separate test Supabase environment to prevent touching production data.

## 3. End-to-End (E2E) Tests
We use **Playwright** to verify critical user journeys.

### Critical Paths
1. **Standard Order:** Landing -> Quick Shop -> Select Variant -> Add to Bag -> Cart -> Checkout -> COD -> Success.
2. **Custom Product:** Custom Lab -> Upload Artwork -> Print Check -> Add to Bag -> Checkout -> Success.
3. **Admin Verification:** Login -> Change Order Status -> Publish Campaign.

## 4. Manual Launch Checks
Prior to a production deployment, verify:
- Mobile responsiveness (Safari iOS, Chrome Android).
- No blank 3D scenes on low-end devices.
- Successful order tracking resolution.
