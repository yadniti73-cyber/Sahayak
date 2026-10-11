# GuideShala

GuideShala is a mentorship marketplace platform that connects **seekers** (people looking for guidance) with **mentors** (verified experts across categories), with an **admin** layer for moderation, verification, and platform operations. The product covers mentor discovery/search, mentor public profiles, a booking lifecycle (request → confirm → complete → review), role-aware dashboards, and in-app notifications.

This README is the single entry point for engineers picking up this repo. It summarizes the approved architecture, database design, authentication design, and folder structure so implementation can proceed without re-deriving decisions already made. The full source documents this is distilled from live in [`docs/`](./docs).

**Live:** [https://sahayak-india.onrender.com](https://guideshala.in/)

> Folders follow the approved structure. The public-site UI (hero, features, founders trust section, feedback form, header, footer and shells) is in place; the remaining modules follow the build order in [§10](#10-recommended-build-order).

---

## 1. Tech Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 15, App Router, JavaScript only (no TypeScript) |
| Styling | Tailwind CSS, CSS-variable design tokens (Fraunces for headings, Inter for body) |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Auth | JWT (httpOnly cookie) backed by a server-side `authSessions` collection |
| Password hashing | bcryptjs, 12 salt rounds |
| Validation | Zod |
| Forms | React Hook Form + Zod |
| Animation | CSS keyframes + IntersectionObserver (`Reveal`, `LazySection`, rotating headline words); all reduced-motion aware. Framer Motion is optional |
| Icons | Lucide React |
| Search (prod) | MongoDB Atlas Search over a denormalized mentor search projection |
| Deployment | Render (app) + MongoDB Atlas (db); Node runtime for all DB-backed routes |

## 2. Core Architectural Decision

GuideShala is built as a **modular monolith**:

- One Next.js App Router application
- One MongoDB Atlas database
- One REST API surface under `/api`
- Explicit, enforced feature boundaries (see §3 and §4)
- Server-first rendering with client islands only where interactivity requires it

This is deliberate for V1: auth, catalog, booking, dashboards, and admin are tightly related, and a single deployable keeps authorization, caching, and operations simple — while module boundaries stay explicit so pieces can be extracted later if needed.

### Runtime topology

```text
Browser
  -> Next.js App Router pages and layouts
  -> Client islands for interactivity
  -> Route Handlers under /api
  -> Feature services
  -> Repositories
  -> MongoDB Atlas

Cross-cutting: Authentication, Rate limiting, Notification dispatch,
               Search provider, Media storage, Audit logging
```

### Request handling model

**Public read flow:** Server Component page → Service → Repository → MongoDB → view model → HTML stream

**Mutation flow:** Form/client action → `/api` route handler → validate input → require auth if protected → enforce role + ownership → service executes business workflow → repository persists → notifications/audit recorded → consistent JSON response

## 3. Bounded Modules (Feature Ownership)

Every product feature belongs to exactly one owning module. Cross-module reuse only happens through a module's exported public interface — never by deep-importing another module's internals.

| Module | Owns routes | Owns write models | Responsibility |
| --- | --- | --- | --- |
| **Public Site** | `/`, `/about`, `/how-it-works`, `/faq`, `/contact` | none | Marketing content, homepage, global nav/footer, SEO |
| **Auth** | `/login`, `/register`, `/forgot-password`, `/reset-password`, `/api/auth/*` | `users`, `authSessions`, `passwordResetTokens` | Registration, login, logout, current user, password lifecycle, lockout, auth audit |
| **Catalog** | `/mentors`, `/categories`, `/category/[slug]`, `/api/mentors`, `/api/categories` | `categories`, read projections over mentors | Discovery, filters, sorting, featured mentors, search ranking |
| **Mentor Profiles** | `/mentors/[slug]`, `/mentor/profile`, `/api/mentor/*`, `/api/documents/[id]` | `mentorProfiles`, `verificationSubmissions`, `mentorDocuments`, `availabilityRules`, `availabilityExceptions` | Public mentor pages, verification application, document upload, availability |
| **Bookings** | `/dashboard/bookings`, `/mentor/bookings`, `/mentor/calendar`, booking APIs | `bookings`, `bookingEvents` | Request/accept/reject/cancel/reschedule/complete, conflict checks, reminders |
| **User Account** | `/dashboard/profile`, `/dashboard/settings`, `/dashboard/favorites` | `favorites`, seeker profile fields on `users` | Seeker profile, settings, saved mentors |
| **Notifications** | notification APIs + bell dropdown | `notifications` | In-app activity feed, unread counts, read state |
| **Dashboards** | `/dashboard`, `/dashboard/home`, `/mentor/dashboard`, `/admin` home shell | none (composes others) | Role-aware shell, overview metrics, quick actions |
| **Admin** | `/admin/*`, `/api/admin/*` | moderation/config over admin workflows | User management, **mentor verification review (approve / request changes / reject / revoke)**, categories, booking oversight |

**Ownership rules:** only the owning module changes its business rules; other modules may render its exported components but not deep-import internals; shared UI stays generic — no domain copy or business rules.

## 4. Dependency Rules (enforced, not optional)

```text
app routes/layouts  -> feature public interfaces -> shared UI/utilities
feature UI           -> same feature internals -> shared UI/utilities
feature server        -> repositories -> models -> domain policies -> shared server infra
repositories          -> models -> db connection -> query helpers
models                 -> mongoose -> shared constants
```

Hard rules:

- `src/app` never imports repositories directly.
- React components never import Mongoose models.
- Services never import React components.
- Repositories never call other repositories.
- No deep cross-feature imports into another feature's internals (only public exports, e.g. `@/features/bookings/server`).
- Shared components (`@/shared/*`) stay domain-agnostic — no "mentor", "booking", "admin" language in there.
- Permission logic on the current user belongs in a service/server helper — never in client code.

## 5. Folder Structure

```text
.
├─ docs/                        # architecture docs (this repo's source-of-truth specs)
├─ public/                      # static assets served as-is
│  ├─ icons/
│  ├─ images/
│  ├─ illustrations/
│  └─ seo/
├─ scripts/                     # operational scripts, never imported at runtime
│  ├─ db/
│  └─ maintenance/
├─ tests/
│  ├─ unit/
│  ├─ integration/
│  ├─ e2e/
│  └─ fixtures/
└─ src/
   ├─ app/
   │  ├─ (public)/              # about, how-it-works, mentors, categories, faq, contact
   │  ├─ (auth)/                # login, register, forgot-password, reset-password
   │  ├─ (protected)/
   │  │  ├─ dashboard/          # seeker: home, bookings, favorites, profile, settings
   │  │  ├─ mentor/             # dashboard, bookings, calendar, availability, profile, analytics, settings
   │  │  └─ admin/              # users, mentors, categories, bookings, reports, settings
   │  ├─ api/
   │  │  ├─ auth/               # register, login, logout, me, forgot-password, reset-password
   │  │  ├─ mentors/[id]/
   │  │  ├─ categories/[slug]/
   │  │  ├─ bookings/[id]/
   │  │  ├─ reviews/
   │  │  ├─ favorites/[mentorId]/
   │  │  ├─ profile/
   │  │  ├─ notifications/[id]/, notifications/read-all/
   │  │  └─ admin/              # users, mentors, categories, bookings, reports, settings
   │  ├─ globals.css, not-found.js, global-error.js, sitemap.js, robots.js
   ├─ features/
   │  ├─ public-site/    { components, sections, content, constants, mappers, server/{services,presenters} }
   │  ├─ auth/            { components, forms, hooks, validators, constants, mappers, server/{services,policies,presenters} }
   │  ├─ catalog/         { components, filters, hooks, validators, constants, mappers, server/{services,presenters} }
   │  ├─ mentor-profiles/ { components, forms, hooks, validators, constants, mappers, server/{services,policies,presenters} }
   │  ├─ bookings/        { components, forms, hooks, validators, constants, mappers, server/{services,policies,presenters} }
   │  ├─ user-account/    { components, forms, hooks, validators, constants, mappers, server/{services,presenters} }
   │  ├─ notifications/   { components, hooks, constants, server/{services,presenters} }
   │  ├─ dashboards/      { components, widgets, constants, mappers, server/{services,presenters} }
   │  └─ admin/           { components, forms, hooks, validators, constants, mappers, server/{services,policies,presenters} }
   ├─ shared/
   │  ├─ ui/          # generic primitives: Button, Input, Select, Dialog, Tabs, Toast, EmptyState, etc.
   │  ├─ forms/
   │  ├─ layout/
   │  ├─ feedback/
   │  ├─ icons/
   │  ├─ hooks/
   │  ├─ lib/
   │  └─ constants/
   ├─ server/
   │  ├─ auth/           # tokens/, cookies/, sessions/, guards/, roles/, viewer/, utils/
   │  ├─ cache/
   │  ├─ config/
   │  ├─ db/
   │  ├─ integrations/   { email/, media/, search/ }
   │  ├─ jobs/           # cron-triggered reminder dispatcher, etc.
   │  ├─ models/         { users/, mentor-profiles/, categories/, availability/, bookings/, reviews/, notifications/, audit/ }
   │  ├─ observability/
   │  ├─ repositories/   { users/, mentor-profiles/, categories/, availability/, bookings/, reviews/, notifications/, audit/ }
   │  └─ security/       # rate limiting, origin checks, sanitization, safe-error helpers
   └─ styles/
      ├─ tokens/
      └─ utilities/
```

**Path aliases:** `@/app/*`, `@/features/*`, `@/shared/*`, `@/server/*`, `@/styles/*` — no `../../../../` relative imports.

**Public export rule:** consumers import from `@/features/<feature>` or `@/features/<feature>/server`, never `@/features/<feature>/components/some-internal-file`.

Full folder-by-folder responsibilities and import rules: [`docs/GuideShala-folder-structure.md`](./docs/GuideShala-folder-structure.md).

## 6. Database Architecture (MongoDB + Mongoose)

### Collections (V1)

| Collection | Purpose |
| --- | --- |
| `users` | Identity, role (`SEEKER`/`MENTOR`/`ADMIN`), status, seeker-level profile fields |
| `authSessions` | Server-side session record backing every JWT — required for real logout/reset invalidation |
| `passwordResetTokens` | Hashed, short-lived, TTL-indexed reset tokens (forgot-password flow) |
| `mentorProfiles` | Public mentor data: pricing, experience, languages, verification summary, denormalized search fields |
| `verificationSubmissions` | One verification application per mentor (personal info, education, experience, declaration) + reviewer decisions and history, for the admin queue |
| `mentorDocuments` | Mentor verification files (certificates, resume, government ID), stored AES-256-GCM encrypted; served only to the owner and admins |
| `categories` | Mentorship categories/hierarchy |
| `availabilityRules` | Recurring weekly availability windows |
| `availabilityExceptions` | Date-specific overrides (leave, blackout dates) |
| `bookings` | Current authoritative state of each booking only |
| `bookingEvents` | Immutable timeline of booking lifecycle events (reminders, transitions, etc.) |
| `reviews` | One review per completed booking |
| `favorites` | Seeker → mentor saved relationships |
| `notifications` | In-app notifications, unread state (V1's only delivery channel) |
| `auditLogs` | Immutable security/admin audit trail |

Future (not V1, but architecture leaves room): `payments`, `transactions`, `refunds`, `subscriptions`, `conversations`, `messages`, `videoSessions`, `communities`, `events`, `certificates`, `organizations`.

### Canonical booking status

A single `status` field on `bookings` — do not use it as a timeline log:

```
REQUESTED -> CONFIRMED -> COMPLETED -> CLOSED
          -> REJECTED
          -> CANCELLED
          -> RESCHEDULE_REQUESTED
          -> NO_SHOW
```

Everything else (reminder sent, session started, review submitted, etc.) is recorded as an immutable `bookingEvents` entry, not a status value.

### Time modeling

Store `startAtUtc`, `endAtUtc`, `mentorTimezone`, `seekerTimezoneAtBooking` — never rely on independent local date/time strings as the source of truth.

### Transactions required for

Mentor registration (user + profile + session), booking create, booking accept/reject/cancel/reschedule, review submission + mentor aggregate update, admin verification decision + profile summary update, password reset + session revocation.

### Soft delete

Soft-delete: `users`, `mentorProfiles`, `categories`.
Never soft-delete (transactional/evidence records): `bookings`, `bookingEvents`, `reviews`, `favorites`, `notifications`, `auditLogs`, `verificationSubmissions`.

Full schema fields, indexes, and aggregation strategy: [`docs/GuideShala-mongodb-architecture.md`](./docs/GuideShala-mongodb-architecture.md).

## 7. Authentication & Authorization

- **Transport:** JWT access token in an `httpOnly`, `sameSite=lax`, `secure` (prod) cookie. Minimal payload only: `sub`, `role`, `sessionId`, `email`, `iat`, `exp`.
- **Backing store:** every JWT maps to an `authSessions` record — this is what makes logout and password-reset invalidation actually work; JWT alone cannot do this.
- **Passwords:** bcrypt, 12 rounds; strength policy enforced (min 8 chars, upper/lower/number/special).
- **Route protection is two-stage:**
  1. Edge middleware — cheap checks: path classification, cookie presence, optional lightweight JWT check, redirect to login with `returnTo`.
  2. Server-side guards (authoritative) — load current user, verify active session, verify role, verify ownership. **Middleware is never the sole security boundary.**
- **Roles:** `VISITOR` (unauthenticated, not stored), `SEEKER`, `MENTOR`, `ADMIN`.
- **Authorization chain:** middleware gate → JWT verify → session verify → user load → role check → ownership check → business policy check → service execution.
- **Account protection:** failed-login counter, temporary lockout after 5 failed attempts, audit log on login success/failure/logout/reset/role change/admin action.
- **Client boundary:** the browser never parses or stores the raw JWT; client code only ever sees a sanitized viewer model (id, name, role, avatar — never secrets).

Full flow diagrams, helper function signatures, and API auth rules: [`docs/GuideShala-authentication-architecture.md`](./docs/GuideShala-authentication-architecture.md).

## 8. Environment Variables

GuideShala depends on environment variables for production configuration. Do not commit real secrets to source control. The values below are examples only.

Example `.env`:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/GuideShala?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-strong-secret
AUTH_COOKIE_NAME=GuideShala_session
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=<google-oauth-client-id>
GOOGLE_CLIENT_SECRET=<google-oauth-client-secret>
GOOGLE_REDIRECT_URI=https://your-app.onrender.com/api/auth/google/callback

# Optional: footer contact details and social links (empty ones are hidden)
# Optional but recommended in production: key used to encrypt mentor verification documents.
# If unset it is derived from JWT_SECRET. Do not change it later without re-encrypting stored files.
DOCUMENT_ENCRYPTION_KEY=

NEXT_PUBLIC_CONTACT_EMAIL=
NEXT_PUBLIC_CONTACT_PHONE=
NEXT_PUBLIC_CONTACT_LOCATION=
NEXT_PUBLIC_WHATSAPP_NUMBER=
NEXT_PUBLIC_INSTAGRAM_URL=
NEXT_PUBLIC_X_URL=
NEXT_PUBLIC_LINKEDIN_URL=
```

Required env vars:

- `MONGODB_URI` — MongoDB connection string for the production database.
- `JWT_SECRET` — Secret used to sign auth JWTs.
- `AUTH_COOKIE_NAME` — Optional custom auth cookie name; defaults to `GuideShala_session`.
- `JWT_EXPIRES_IN` — Optional JWT expiration interval; defaults to `7d`.
- `GOOGLE_CLIENT_ID` — Server-side Google OAuth client ID used when exchanging tokens and handling OAuth redirects.
- `GOOGLE_CLIENT_SECRET` — Server-side Google OAuth client secret.
- `GOOGLE_REDIRECT_URI` — Fully qualified redirect URI for the Google OAuth callback route.
- `DOCUMENT_ENCRYPTION_KEY` — Optional. Secret used to encrypt mentor verification documents at rest (AES-256-GCM). Falls back to a key derived from `JWT_SECRET`. Losing or changing it makes already-uploaded documents unreadable.
- `NEXT_PUBLIC_CONTACT_*`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_*_URL` — Optional public footer details (email, phone, location, WhatsApp number with country code, social profile links). These are public by design; never put secrets in `NEXT_PUBLIC_` variables.

On Render:

- Deploy this repo as a Web Service.
- Set the `Build Command` to `npm run build` and the `Start Command` to `npm run start`.
- Add the environment variables under the service's Environment section.
- Use your Render app URL in `GOOGLE_REDIRECT_URI`, for example `https://<your-app>.onrender.com/api/auth/google/callback`.
- Do not expose any Google secrets in browser-facing env variables.

## 9. API Conventions

- All application APIs live under `/api`; this is the canonical mutation boundary. Server actions, if used, must delegate to the same services — never a second logic path.
- Route handlers only: parse → validate → authenticate → authorize (role + ownership) → call **one** service method → map result to response. **No direct Mongoose queries in route handlers.**
- Response envelope:

  ```js
  // success
  { success: true, message: "Operation successful.", data: {}, meta: {} }
  // failure
  { success: false, message: "Validation failed.", errors: [], meta: {} }
  ```

- List endpoints paginate via `meta.pagination`: `currentPage`, `pageSize`, `totalItems`, `totalPages`, `hasNextPage`, `hasPreviousPage`.
- Route groups: `/api/auth/*`, `/api/mentors/*`, `/api/categories/*`, `/api/bookings/*`, `/api/reviews/*`, `/api/favorites/*`, `/api/profile/*`, `/api/notifications/*`, `/api/admin/*`.
- Admin never piggybacks on seeker/mentor endpoints — dedicated `/api/admin/*` handlers only.

## 10. Recommended Build Order

1. **Foundation** — route groups, design tokens, shared primitives, server infra (`db`, `config`, `observability`)
2. **Auth** — `users`, `authSessions` models → password/token/cookie helpers → session repo/service → `register`/`login`/`logout`/`me` → `getCurrentUser`/`requireAuth`/`requireRole` → middleware
3. **Catalog & mentor profiles** — categories, mentor discovery, public mentor profile
4. **Booking domain** — availability rules/exceptions, booking create + lifecycle, notifications
5. **Dashboards** — seeker, mentor, admin shell
6. **Admin operations** — verification queue, category management, user/booking oversight

## 11. Non-Negotiable Rules

- Modular monolith, not ad hoc pages with embedded logic.
- App Router pages stay thin and server-first; business workflows live in feature `server/services`, DB access only in `server/repositories`.
- Search, booking, auth, and admin are first-class domains, not utility logic.
- Never use booking `status` as a catch-all lifecycle log — use `bookingEvents`.
- JWT must always be backed by a session record.
- Shared UI stays generic; domain UI stays inside its owning feature.
- URL state drives discovery/filtering; server rendering drives first paint.
- Don't build future modules (payments, messaging, video) in V1 — but don't block their extension points either.

## 12. Open Product Decisions

Still need explicit sign-off before/while building the related feature — see `docs/GuideShala-architecture.md` §20 for the full list. Notable ones:

- V1 session modes: `VIDEO` + `IN_PERSON` only?
- Media storage provider for avatars (verification documents are currently stored encrypted in MongoDB, 5 MB per file; move to S3/R2 if volume grows)
- Is forgot-password in V1 or deferred?
- ~~Staged mentor profile completion vs. full profile at signup?~~ Decided: mentors sign up with just name/email, then complete the long verification form (§15).
- Review publication: immediate or moderated?
- Category selection: single vs. multi-select on mentor profile?

Until confirmed, the architecture docs define the safest buildable defaults, and this codebase should follow them.

## 13. UI Theme and Front-End Conventions

**Palette:** blue (`app-primary`), green (`green-600` / `emerald`) and white. Every page uses the same blue-to-green gradient language as the hero.

- **Backgrounds:** `bg-gradient-to-br from-white via-blue-50/60 to-green-50/50` for sections; `bg-section-blue` / `bg-section-green` helpers; the footer uses a green gradient with a faint dot pattern.
- **Accents:** headline highlights use `bg-gradient-to-r from-app-primary to-green-600 bg-clip-text text-transparent`; cards use a thin green top border and lift on hover.
- **Headings:** exactly one `h1` per page. `SectionHeading` renders an `h2` unless `as="h1"` is passed.
- **Motion:** `Reveal` fades sections in on scroll; `RotatingWords` / `DynamicHeading` rotate a highlighted word; `LazySection` plus `next/dynamic` defers below-the-fold sections; images use `loading="lazy"`. All animation is disabled for `prefers-reduced-motion`.
- **Global CSS:** the tokens, keyframes (`reveal`, `word-swap`, `float-slow`, `shimmer`, `pop-in`) and background helpers live in `theme-additions.css`, appended to `src/app/globals.css`.
- **Shells:** `PublicShell` (header, main, footer, skip link) and `DashboardShell` (responsive sidebar and top bar, active-route highlighting). The header shows a reading-progress bar and a mobile menu; the footer builds its category column from `@/lib/frontend-data`.
- **Trust content:** no invented ratings, review counts or testimonials. The home page shows the founders (photos in `public/images/team/`) and the mission and vision. Add real reviews only after real sessions are completed.
- **Feedback:** `FeedbackForm` posts to `POST /api/feedback`. Replace the logging in that route with a database write or an email notification.

## 14. Mentor Verification

Only **verified** mentors appear on the portal. A mentor signs up as before, then completes an application that an admin reviews.

### Flow

```text
Mentor signs up (role MENTOR)
  -> /mentor/profile: long form, saved as a private draft
       1 Personal info   2 Public profile   3 Education   4 Past experience   5 Documents + declaration
  -> Submit for review      (status PENDING_REVIEW, form locked, admins notified)
  -> /admin/mentors/[id]: admin reads everything, opens documents, ticks the identity / education / experience checks
       Approve         -> public profile fields are copied onto the mentor profile, verified = true, mentor is listed
       Request changes -> mentor edits and re-submits (a live profile stays live)
       Reject          -> mentor is hidden (verified = false) and can re-apply
       Remove (revoke) -> a verified mentor is taken off the portal
  -> Mentor is notified in-app for every decision
```

Key rules:

- **Seekers only see verified mentors.** `verified: true` and `active: true` are required by the mentor list, mentor profile page, favorites and booking creation.
- **Drafts never go public.** The application is a proposal; the public `mentorProfiles` fields only change when an admin approves.
- **Editing after approval.** A verified mentor can edit and re-submit. Their current profile stays live until the admin approves the changes.
- **Required to submit:** full personal details (18+), headline, bio of at least 100 characters, category, experience, price, at least one language, one education entry, one past experience entry, resume, government ID (with ID type), at least one certificate, and the declaration.
- **Documents:** PDF, JPG or PNG up to 5 MB each (up to 10 certificates). The real file type is checked from the file contents, files are encrypted before being stored, and `GET /api/documents/[id]` only answers to the owning mentor or an admin.
- **Existing mentors:** profiles already marked `verified: true` before this feature stay live (status shown as Verified). Unverified profiles are hidden until approved. No data migration is needed.

### Status values

`NOT_SUBMITTED` -> `PENDING_REVIEW` -> `APPROVED` | `CHANGES_REQUESTED` | `REJECTED`. The status is stored on both the application (`verificationSubmissions`) and as a summary on the mentor profile (`verificationStatus`); `verified` stays the single public flag.

### API

| Method + route | Who | Purpose |
| --- | --- | --- |
| `GET /api/mentor/profile` | Mentor | Load the application, status and uploaded document list |
| `PUT /api/mentor/profile` | Mentor | Save a draft |
| `POST /api/mentor/profile/submit` | Mentor | Validate and submit for review |
| `POST /api/mentor/documents` | Mentor | Upload a document (`multipart/form-data`: `type` = `CERTIFICATE` / `RESUME` / `GOV_ID`, `file`) |
| `DELETE /api/mentor/documents/[id]` | Mentor | Remove an uploaded document |
| `GET /api/documents/[id]` | Owner or admin | View a document |
| `GET /api/admin/mentors?status=` | Admin | Review queue, filterable by status |
| `GET /api/admin/mentors/[id]` | Admin | Full application and document list |
| `POST /api/admin/mentors/[id]/decision` | Admin | `{ decision: APPROVE / REQUEST_CHANGES / REJECT / REVOKE, note, checklist }` |

### Code map

```text
src/features/mentor-profiles/   constants.js, validators.js, server/service.js, components/MentorApplicationForm.js
src/features/admin/             server/mentorVerificationService.js, components/MentorReviewActions.js
src/server/models/              mentorVerification.js, mentorDocument.js (+ new fields on mentorProfile.js)
src/server/repositories/        mentorVerifications.js, mentorDocuments.js
src/server/security/            documentCrypto.js
src/app/(protected)/mentor/profile/page.js        mentor application page
src/app/(protected)/admin/mentors/                review queue + [id] review page
```

## 15. Applying an Update Package (script)

Updates can be delivered as a zip plus a small Node script. Put both in your **Downloads** folder, then from the project root (the folder that contains `src/`):

```bash
node ~/Downloads/apply-guideshala-update.mjs              # apply the newest guideshala-mentor-verification*.zip in Downloads
node ~/Downloads/apply-guideshala-update.mjs --dry-run    # show what would change, write nothing
node ~/Downloads/apply-guideshala-update.mjs --undo       # restore the files from the last run
node ~/Downloads/apply-guideshala-update.mjs --zip /path/to/update.zip   # use a specific zip
```

On Windows PowerShell use `node $HOME\Downloads\apply-guideshala-update.mjs`. The script lists every file as `new`, `changed` or `same`, backs up each file it overwrites into `.update-backup/<timestamp>/`, and never writes outside the project folder. Add `.update-backup/` to `.gitignore`. After applying, restart `npm run dev`.

## 16. Source Documents

The full, unabridged versions of everything summarized above:

- [`docs/GuideShala-architecture.md`](./docs/GuideShala-architecture.md) — system architecture, modules, dependency rules, caching, security, deployment
- [`docs/GuideShala-folder-structure.md`](./docs/GuideShala-folder-structure.md) — canonical folder tree, import rules, anti-patterns
- [`docs/GuideShala-mongodb-architecture.md`](./docs/GuideShala-mongodb-architecture.md) — full schema fields, indexes, aggregation and search strategy
- [`docs/GuideShala-authentication-architecture.md`](./docs/GuideShala-authentication-architecture.md) — full auth/authz flows, middleware design, helper contracts

---
