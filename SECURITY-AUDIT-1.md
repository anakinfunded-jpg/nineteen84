# Security Audit Report — 1984.si

**Date:** 2026-02-20
**Scope:** Full codebase audit of production SaaS platform
**Platform:** Next.js 14 (App Router), TypeScript, Supabase, Stripe
**Domain:** 1984.si

---

## Executive Summary

Comprehensive security audit covering 53 API routes, 20+ client pages, and all library files. The codebase demonstrates strong foundational security with proper authentication, timing-safe comparisons, parameterized queries, and correct client/server secret separation. **3 critical vulnerabilities** and **3 medium-severity issues** were identified and fixed.

---

## Critical Vulnerabilities Found & Fixed

### 1. CRITICAL: Open Redirect in `/api/track/click`

**File:** `app/api/track/click/route.ts`
**Severity:** CRITICAL (CVSS 6.1)

**Issue:** The outreach email click-tracking endpoint accepted any URL via query parameter and redirected to it without validation. An attacker could craft `https://1984.si/api/track/click?url=https://phishing-site.com` to redirect users to malicious sites.

**Before:**
```typescript
const url = request.nextUrl.searchParams.get("url");
const destination = url || process.env.NEXT_PUBLIC_APP_URL || "https://www.1984.si";
return NextResponse.redirect(destination); // No validation!
```

**Fix:** Added `sanitizeRedirectUrl()` function that validates URLs against an allowlist of trusted hostnames (`1984.si`, `www.1984.si`). Rejects any URL pointing to external domains, falling back to the app URL.

**Risk eliminated:** Phishing attacks, social engineering, malware distribution via crafted redirect links.

---

### 2. CRITICAL: Outreach Routes Missing Admin Authorization

**Files:**
- `app/api/outreach/campaigns/route.ts`
- `app/api/outreach/contacts/route.ts`

**Severity:** CRITICAL

**Issue:** Both outreach management routes only checked if the user was authenticated (`if (!user)`), but did NOT verify admin privileges. Any logged-in user could:
- View all outreach contacts (names, emails, companies)
- Create marketing campaigns
- Import/modify the contact database

**Before:**
```typescript
const { data: { user } } = await supabase.auth.getUser();
if (!user) { // Only checks login, not admin role!
  return NextResponse.json({ error: "Neavtorizirano" }, { status: 401 });
}
```

**Fix:** Added `checkAdmin()` function with `ADMIN_EMAILS` whitelist (same pattern as `/api/admin/` routes). Both GET and POST handlers now return 403 Forbidden for non-admin users.

**Risk eliminated:** Unauthorized data access, privilege escalation, data exfiltration of contact database.

---

### 3. CRITICAL: `authLimit` Rate Limiter Never Enforced

**File:** `lib/rate-limit.ts` (defined), `app/api/contact/route.ts` (now applied)
**Severity:** CRITICAL

**Issue:** The `authLimit` rate limiter (5 requests per 60 seconds) was defined and exported but never actually used on any endpoint. The public contact form had no rate limiting at all, enabling:
- Spam bombing via the contact form
- Email flooding the admin inbox
- Resource exhaustion on the Resend email API

**Fix:** Applied `authLimit` to the contact form route (`/api/contact`) with IP-based rate limiting. Also added basic email format validation.

**Risk eliminated:** Spam attacks, email flooding, resource abuse on public endpoints.

---

## Medium-Severity Issues Found & Fixed

### 4. MEDIUM: MIME Type Not Validated on Image Uploads

**Files:**
- `app/api/ai/replace/route.ts`
- `app/api/ai/vision/route.ts`

**Issue:** Image upload routes accepted the client-provided MIME type without validation. A user could submit `type: "text/html"` which would be embedded into the data URL sent to the AI API.

**Fix:** Added allowlist validation against `["image/jpeg", "image/png", "image/gif", "image/webp"]` in both routes. Rejects uploads with unsupported MIME types before processing.

---

### 5. MEDIUM: File Parser Extension-Only Validation (No Magic Bytes)

**File:** `lib/file-parser.ts`

**Issue:** File parsing relied solely on the file extension (`.pdf`, `.docx`, etc.) without validating actual file content. A malicious file renamed to `.pdf` but containing different content could bypass validation.

**Fix:** Added magic byte validation for binary formats:
- PDF: `%PDF` (0x25504446)
- DOCX/PPTX/XLSX: `PK..` ZIP signature (0x504B0304)

Files whose content doesn't match the expected format are rejected before parsing.

---

### 6. MEDIUM: Contact Form Missing Email Validation

**File:** `app/api/contact/route.ts`

**Issue:** The contact form accepted any string as an email address with no format validation, allowing injection of invalid/malformed addresses.

**Fix:** Added basic email regex validation (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).

---

## Known Risks (No Fix Available)

### 7. LOW: xlsx Package Vulnerabilities

**Package:** `xlsx@0.18.5`
**Advisories:** Prototype Pollution (GHSA-4r6h-8v6p-xvw6), ReDoS (GHSA-5pgg-2g8v-p4x9)
**Status:** No fix available from the maintainer.

**Mitigations in place:**
- 4 MB file size limit enforced before parsing
- 200,000 character output truncation
- Server-side only (no client exposure)
- Magic byte validation now prevents non-XLSX files from reaching the parser
- Rate limiting on file parse endpoint (20 req/60s)

**Recommendation:** Monitor for a fix or evaluate migration to an alternative library (e.g., `exceljs`).

### 8. LOW: CSP Uses `unsafe-inline` and `unsafe-eval`

**File:** `next.config.ts`

**Status:** Required for Next.js framework, Stripe.js, and Umami analytics to function. These are standard for SPA applications and cannot be easily removed without breaking functionality.

### 9. LOW: Dev-Only Dependency Vulnerabilities

**Packages:** ajv, minimatch, eslint chain
**Status:** Development dependencies only. Not included in production builds. No production impact.

---

## Verified Secure (No Issues Found)

### Secrets Management
- `.env*` pattern in `.gitignore` — all env files excluded from git
- No hardcoded API keys, tokens, or passwords in source code
- All secrets accessed via `process.env.*`
- Server-only secrets (STRIPE_SECRET_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY, RESEND_API_KEY, SUPABASE_SERVICE_ROLE_KEY, CRON_SECRET) never imported in client components
- Only `NEXT_PUBLIC_*` variables accessible client-side
- 20+ client components verified: none reference server secrets

### SQL Injection
- All Supabase queries use parameterized methods (`.eq()`, `.insert()`, `.update()`, `.delete()`)
- All RPC calls pass parameters as named objects (never concatenated)
- No raw SQL strings or template literal injection points found
- No `child_process`, `exec`, or `spawn` usage anywhere in codebase

### XSS (Cross-Site Scripting)
- All `dangerouslySetInnerHTML` usage is for JSON-LD schema markup only (hardcoded/serialized data, never user input)
- `react-markdown` used without `rehype-raw` or `allowDangerousHtml` — HTML rendering disabled by default
- React's built-in XSS escaping handles all dynamic content rendering
- Blog content, chat messages, and AI responses rendered through React components (auto-escaped)

### Authentication
- All 53 API routes verified:
  - 40+ user routes check `supabase.auth.getUser()` and return 401
  - 4 cron routes use timing-safe `verifyCronSecret()`
  - 5 admin routes use email whitelist with 403 response
  - Public routes (health, webhook, affiliate click, tracking, unsubscribe) appropriately unauthenticated
- Stripe webhook uses `stripe.webhooks.constructEvent()` with raw body signature verification
- Auth callback has proper open redirect protection via `sanitizeRedirect()`

### Authorization (User Data Isolation)
- Every user-facing Supabase query filters by `user_id` or `auth.uid()`
- Tables verified: subscriptions, user_usage, conversations, messages, documents, document_chunks, generated images, user_referrals, affiliate_applications, api_keys
- RLS enabled on `user_referrals` table with `auth.uid() = referrer_id`
- Admin client (`SUPABASE_SERVICE_ROLE_KEY`) only used in API routes for trusted operations

### API Security
- API key auth uses SHA-256 hash lookup (keys never stored in plaintext)
- API keys generated with `crypto.randomBytes(32)` (256-bit entropy)
- Bearer token format validated before database lookup
- Plan-level access control (Poslovno only)
- 60 req/60s rate limiting on API v1 endpoints

### Cron Authentication
- All 4 cron routes use `verifyCronSecret()` from `lib/cron-auth.ts`
- Timing-safe comparison via `crypto.timingSafeEqual()` prevents timing attacks
- Length check before comparison for additional safety

### File Upload Security
- 4 MB server-side size limit for document parsing
- 10 MB limit for image uploads
- Extension allowlist validation
- Magic byte validation (newly added)
- PPTX ZIP entry names validated with regex to prevent path traversal
- Output truncation (200,000 chars) prevents memory exhaustion
- Files stored in Supabase Storage (not local filesystem)
- User-scoped file paths (`${user.id}/...`) prevent cross-user access

### Security Headers
- `X-Frame-Options: DENY` (clickjacking protection)
- `X-Content-Type-Options: nosniff` (MIME sniffing prevention)
- `Strict-Transport-Security: max-age=63072000` (2-year HSTS)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(self), ...`
- Content-Security-Policy with restrictive directives

### GDPR Compliance
- Account deletion endpoint (`/api/account/delete`) cleans all user data
- Data export endpoint (`/api/account/export`) with UI in settings
- Cookie consent banner gates analytics loading
- IP addresses hashed (SHA-256) before storage in affiliate tracking

### Rate Limiting
- AI text: 20 req/60s per user
- AI images: 10 req/60s per user
- API v1: 60 req/60s per user
- Memory/embeddings: 10 req/60s per user
- File parsing: 20 req/60s per user
- Contact form: 5 req/60s per IP (newly added)

---

## Recommendations for Future Hardening

1. **DMARC upgrade:** Change from `p=none` to `p=quarantine` after sufficient monitoring (scheduled)
2. **xlsx replacement:** Evaluate `exceljs` or `SheetJS Pro` to address unpatched vulnerabilities
3. **Database-backed admin roles:** Replace hardcoded email whitelist with a database table for more flexible access control
4. **Audit logging:** Add structured logging for admin actions (affiliate management, campaign creation)
5. **Content-Length pre-check:** Reject oversized requests before parsing FormData body
6. **Nonce-based CSP:** Consider generating per-request nonces for inline scripts to remove `unsafe-inline`

---

## Files Modified in This Audit

| File | Change |
|------|--------|
| `app/api/track/click/route.ts` | Added URL validation against allowed domains |
| `app/api/outreach/campaigns/route.ts` | Added admin whitelist authorization |
| `app/api/outreach/contacts/route.ts` | Added admin whitelist authorization |
| `app/api/contact/route.ts` | Added rate limiting + email validation |
| `app/api/ai/replace/route.ts` | Added MIME type allowlist validation |
| `app/api/ai/vision/route.ts` | Added MIME type allowlist validation |
| `lib/file-parser.ts` | Added magic byte validation for binary formats |

---

*Audit performed on 2026-02-20. All critical and medium issues fixed and verified with successful build.*
