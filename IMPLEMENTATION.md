# BrighterWorks Platform Implementation Plan

## 1. Purpose

BrighterWorks is one platform with two distinct opportunity portals:

- **Internship Portal** for university and college students, recent graduates, universities, NGOs, government agencies, companies, and placement offices.
- **Jobs Portal** for job seekers, employers, NGOs, government institutions, and companies.

The portals share authentication, organisations, profiles, notifications, applications, career support, and platform infrastructure. They do not share one mixed navigation or one oversized opportunity model.

The existing visual identity remains the product standard. No new visual language, Vibe-style components, unrelated design system, or replacement palette will be introduced.

## 2. Product principles

1. Internship and Jobs are first-class product contexts inside the same platform.
2. A user enters the relevant portal before seeing its features.
3. Live backend data is the source of truth.
4. Hardcoded listings, dashboard metrics, user records, and workflow state are removed feature by feature.
5. Access is derived from the authenticated account and organisation relationship.
6. Every completed feature is tested, committed, and pushed to `main` before the next feature begins.
7. Existing screens, colors, spacing, typography, imagery, and interaction patterns are preserved unless a change is required by the new portal structure.
8. Code remains clean and focused, with comments only where the behavior is not self-explanatory.

## 3. Existing design contract

The current frontend design in `intern/src/app/globals.css` is the source of truth.

Preserve:

- White page and card surfaces
- Zinc borders and neutral text scale
- Primary red `--blue: #BC2132`
- Dark near-black bands using `--blue-deep`
- Existing red, green, gold, and cream status treatments
- Plus Jakarta Sans headings
- Inter body text
- JetBrains Mono labels and metadata
- Existing rounded rectangle geometry
- Current spacing, card, button, table, drawer, modal, and dashboard patterns
- Existing local imagery and icon system
- Current responsive behavior and accessibility focus styles

Do not introduce:

- Purple gradients
- Glassmorphism
- Neon accents
- Decorative blobs
- Unrelated dashboard templates
- Generic Vibe-coded component libraries
- New typography systems
- New global color tokens without a demonstrated product need

## 4. Portal information architecture

### Global navigation

The global header should expose only platform-level destinations:

- BrighterWorks
- Internships
- Jobs
- Employers
- Resources
- About
- Sign in

Job-specific and internship-specific tools must not remain as unrelated global header items.

### Internship Portal

Primary navigation:

- Find Internships
- Saved Internships
- My Applications
- My Profile
- Skills Profile
- Documents
- Application Pack
- Career Advisor
- Internship Guidance

Supported users:

- Students
- Recent graduates
- University placement officers
- University administrators
- NGOs
- Government agencies
- Companies
- University departments
- Platform administrators

### Jobs Portal

Candidate navigation:

- Find Jobs
- Companies
- Saved Jobs
- My Applications
- Job Alerts
- Career Profile
- CV/Resume
- Cover Letters
- Learning
- Career Assistant

Employer navigation:

- Employer Overview
- Post a Job
- Manage Jobs
- Applicants
- Shortlisted Candidates
- Company Profile
- Interview Management
- Subscription and Billing

Supported users:

- Job seekers
- Employers
- NGOs
- Government institutions
- Companies
- Platform administrators

## 5. Dashboard model

Dashboards remain inside the existing dashboard shell and use the existing visual system. Portal context determines which navigation and data are shown.

### Student dashboard

- Overview
- Recommended Internships
- Saved Internships
- Applications
- Skills Profile
- Documents
- Application Pack
- Verification Status
- Career Advisor

### Recent graduate dashboard

- Overview
- Recommended Internships
- Recommended Jobs
- Saved Opportunities
- Applications
- Career Profile
- CV/Resume
- Job Alerts
- Career Assistant

### University dashboard

- Overview
- Students
- Internship Requirements
- Internship Listings
- Applications
- Document Verification
- Placement Outcomes
- Reports

### NGO dashboard

- Overview
- Internship Listings
- Job Listings
- Applicants
- Shortlisted Candidates
- Organisation Profile
- Reports
- Subscription and Billing

### Government dashboard

- Overview
- Internship and Attachment Programmes
- Job Listings
- Applicants
- Regional/District Reporting
- Cohort Reports
- Compliance Documents
- Organisation Profile

### Employer/company dashboard

- Overview
- Internship Listings
- Job Listings
- Applicants
- Shortlisted Candidates
- Talent Search
- Company Profile
- Subscription and Billing

### Job seeker dashboard

- Overview
- Find Jobs
- Saved Jobs
- Applications
- Job Alerts
- Career Profile
- CV/Resume
- Cover Letters
- Learning

### Platform administrator dashboard

- Overview
- Users
- Organisations
- Internship Listings
- Job Listings
- Applications
- Verification Queue
- Reports
- Plans and Billing
- Audit Activity

## 6. Backend domain direction

Shared entities:

- User
- Organisation
- Organisation membership
- Candidate profile
- Candidate documents
- Notifications
- Subscription

Internship entities:

- Internship
- Internship requirements
- Saved internship
- Internship application
- Internship verification
- University placement programme
- Internship outcome

Jobs entities:

- Job
- Job requirements
- Saved job
- Job application
- Job alert
- Candidate CV
- Cover letter
- Interview
- Shortlist

Jobs and internships should not be forced into one table. Their shared fields may use common value objects or services, but their business rules remain separate.

## 7. API direction

Existing APIs remain stable while the portal migration starts:

- `/api/auth/*`
- `/api/placements/*`
- `/api/match`
- `/api/skills/extract`
- `/api/advisor`
- `/api/saved`
- `/api/applications`
- `/api/subscription`

Internship APIs will gradually move toward explicit naming:

- `GET /api/internships`
- `GET /api/internships/{id}`
- `GET /api/internships/meta`
- `POST /api/internships/{id}/apply`
- `GET /api/internship-applications`
- `GET /api/saved-internships`

Compatibility routes may remain temporarily so existing clients do not break.

Jobs APIs will include:

- `GET /api/jobs`
- `GET /api/jobs/{id}`
- `POST /api/jobs`
- `PATCH /api/jobs/{id}`
- `POST /api/jobs/{id}/apply`
- `GET /api/job-applications`
- `GET /api/saved-jobs`
- `POST /api/saved-jobs/toggle`
- `GET /api/job-alerts`
- `POST /api/job-alerts`
- `GET /api/companies`
- `GET /api/companies/{id}`
- `GET /api/jobs/{id}/applicants`

All protected operations must derive identity and organisation scope from the authenticated token.

## 8. Live data rules

The Neon database, accessed only through the backend, is the source of truth.

Frontend requirements:

- No hardcoded opportunity catalogue
- No hardcoded user-specific dashboard metrics
- No fixed employer organisation IDs
- No local-only saved opportunities when the API is enabled
- No fake application status after a successful-looking action
- No silent fallback that looks like successful live data
- Explicit loading, empty, error, and unauthorized states

Temporary seed data is allowed only for backend development and test fixtures. It must not be used as production frontend state.

Environment requirements:

- The Neon connection string remains in backend environment configuration.
- Secrets are never committed.
- The frontend receives only the public API base URL.
- Database access is never performed directly from browser code.

## 9. Feature delivery sequence

Each feature is complete only when its backend, frontend, tests, documentation, commit, and push are complete.

### Feature 0: Implementation contract — complete

- Add this implementation document.
- Confirm portal boundaries, role dashboards, design rules, and delivery workflow.
- Commit and push this document.

### Feature 1: Portal foundation — complete

- Add portal-aware application state.
- Add Internship and Jobs entry points.
- Move job-related navigation under Jobs.
- Move internship-specific navigation under Internships.
- Add portal-aware routes and active navigation.
- Preserve existing screens and colors.
- Add route and navigation tests where practical.
- Commit and push. Completed in `cd8c8fe`.

### Feature 2: Live Internship Portal catalogue — complete

- Rename public-facing placement concepts to internships where appropriate.
- Add explicit internship API compatibility.
- Load internships and metadata from Neon through the backend.
- Add robust loading, empty, and error states.
- Remove the frontend catalogue fallback.
- Commit and push. Completed in `01a36e5`.

### Feature 3: Live internship candidate workflows — in progress

- Persist saved internships. Complete in `cd8c8fe`/`01a36e5`.
- Persist internship applications. Complete in `cd8c8fe`/`01a36e5`.
- Load application history from the backend. Complete in `c730087`.
- Track applications and withdraw eligible submissions. Complete in the current student dashboard workflow.
- Connect eligibility and matching to live backend metadata. Complete for the dashboard overview in `c730087`.
- Remove related local-only state. Remaining dashboard views are still being migrated.
- Commit and push.

### Feature 4: Internship student profile and documents — partially complete

- Add persistent student/recent-graduate profile records. Complete in `4d28284`.
- Add skills persistence. Complete in `4d28284`.
- Add resume upload metadata and content storage. Complete in the current student dashboard workflow.
- Add live document upload metadata/content and student-owned status records. Complete in the current student dashboard workflow.
- Add administrator verification actions and rejection reasons.
- Persist application pack data.
- Connect dashboard views to live records.
- Commit and push.

### Feature 5: Internship institution and host dashboards

- Build university dashboard.
- Build NGO dashboard.
- Build government dashboard.
- Build employer/company internship dashboard.
- Add role and organisation authorization.
- Replace hardcoded queues, counts, and activity with backend data.
- Commit and push.

Progress update:

- Employer/company internship posting now has a live backend workflow:
  - `GET /api/organization/internships`
  - `POST /api/organization/internships`
- Posting records now persist real lifecycle fields:
  - `published_at`
  - `closes_at`
  - `starts_at`
  - `requirements`
  - `review_status` (`pending_review` on submission)
- Public internship catalogue visibility now excludes records pending review.
- Employer dashboard now submits internships for admin review using live backend data.

### Feature 6: Jobs domain and database

- Add jobs, requirements, companies, saved jobs, applications, alerts, CVs, cover letters, interviews, and shortlist entities.
- Add migrations or a proper schema migration process.
- Add seed fixtures only for tests/development.
- Add repository and service tests.
- Commit and push.

### Feature 7: Jobs candidate portal

- Build jobs catalogue.
- Add search and filters.
- Add job detail and company detail views.
- Add saved jobs.
- Add applications and application tracking.
- Add candidate profile, CV, and cover-letter workflows.
- Commit and push.

### Feature 8: Jobs employer portal

- Add job creation and editing.
- Add publish/unpublish controls.
- Add applicant review.
- Add shortlist and status updates.
- Add company profile.
- Add employer billing and usage.
- Commit and push.

### Feature 9: Alerts, learning, and career assistance

- Add persistent job alerts.
- Add internship alerts where applicable.
- Add learning/resource records.
- Make the assistant portal-aware.
- Ground recommendations in live records.
- Commit and push.

### Feature 10: Hardcoded-state removal

- Audit frontend constants and local state.
- Remove production catalogue constants.
- Remove fake dashboard metrics.
- Remove demo-only workflow success paths.
- Keep only presentation defaults and test fixtures.
- Commit and push.

### Feature 11: Production readiness

- Restrict CORS.
- Verify Neon deployment configuration.
- Add migration deployment steps.
- Add logging and error visibility.
- Verify authorization for every role.
- Verify mobile behavior.
- Verify accessibility and loading states.
- Commit and push.

## 10. Definition of done for every feature

Before a feature is marked complete:

1. The affected backend and frontend code is implemented.
2. The feature uses the existing design tokens and components.
3. No unrelated design system or visual language is introduced.
4. Backend tests cover business rules and authorization.
5. Frontend type checking and production build pass.
6. Live API behavior is verified where applicable.
7. Hardcoded state related to the feature is removed or explicitly limited to test fixtures.
8. Errors are visible to the user and not silently converted into success.
9. The worktree is reviewed for unrelated changes.
10. Only the completed feature is committed.
11. The commit is pushed to `main`.
12. The next feature starts only after the push succeeds.

## 11. Working rules

- Preserve existing uncommitted work unless it is explicitly part of the current feature.
- Do not commit secrets, `.env.local` files, database credentials, or generated private data.
- Do not amend existing commits.
- Do not use broad destructive commands.
- Keep components focused and reuse existing helpers.
- Prefer backend contracts and typed DTOs over duplicated frontend models.
- Keep comments sparse and purposeful.
- Keep the implementation clean, readable, and consistent with the current codebase.

## 12. Current implementation status

The first implementation target, **Portal Foundation**, is complete. The current
delivery target is the student dashboard workflow: live documents/resume,
application tracking, and application withdrawal.

Its acceptance criteria are:

- The global header shows Internship and Jobs as the two main opportunity portals.
- Job-specific links are removed from the global header.
- Internship-specific links are grouped under the Internship Portal.
- Jobs-specific links are grouped under the Jobs Portal.
- Existing public pages still work.
- Existing authentication still works.
- Existing dashboard styles and colors remain unchanged.
- Portal navigation is ready for live backend data.
- Tests/build pass.
- Each feature is committed and pushed before the next feature begins.

## 13. Current system documentation

This section documents the implemented system as it exists today. It is
updated alongside each feature so the implementation contract remains useful
for development, testing, onboarding, and deployment.

### Frontend architecture

The frontend is a Next.js 14 and React 18 TypeScript application in
`intern/`. It uses one App Router page with hash-based navigation so the
public website, portal catalogue, sign-in flow, and role dashboards can be
served as a static GitHub Pages export.

- `src/app/` contains the root layout, metadata, global styles, and page entry.
- `src/components/public/` contains the public home, about, employers,
  universities, portal, catalogue, detail, sign-in, plans, and legal views.
- `src/components/dashboard/` contains the shared dashboard shell and
  student, employer, admin, and job-seeker views.
- `src/context/AppContext.tsx` owns routing, session state, portal state,
  catalogue state, dashboard state, application actions, document actions,
  saved items, subscriptions, and existing modal/toast behavior.
- `src/lib/api.ts` is the typed browser-to-backend boundary. It translates
  backend snake_case DTOs to frontend camelCase models and attaches the
  authenticated bearer token.
- `src/types/` contains frontend domain types.
- `src/data/` contains presentation defaults and legacy demo-only dashboard
  data that is still being migrated; it is not the source of truth for live
  catalogue, student profile, application, resume, or document data.
- `public/img/` contains local static imagery. Public image references are
  relative so they work under the GitHub Pages project path.

The visual system is defined in `src/app/globals.css` and remains the source
of truth: BrighterMonday-inspired red `#BC2132`, near-black bands, white and
zinc surfaces, existing status colors, Plus Jakarta Sans headings, Inter body
text, current cards/tables/buttons, and existing responsive behavior.

### Backend architecture

The backend is a FastAPI application in `backend/`, mounted under `/api` in
production and exposed at the root in the test harness.

- `app/presentation/main.py` is the composition root and mounts the feature
  sub-application.
- `app/presentation/sub.py` registers feature routers and maps authentication
  failures to HTTP 401 responses.
- `app/presentation/routers/` contains thin HTTP handlers for authentication,
  placements, matching, advisor, authenticated user state, organization
  posting, and administrator review.
- `app/application/` contains use-case services and ports.
- `app/domain/` contains persistence-independent entities and matching rules.
- `app/infrastructure/orm.py` contains SQLAlchemy models.
- `app/infrastructure/repositories.py` maps ORM records to domain entities and
  implements repository ports.
- `app/infrastructure/db.py` creates the Neon/Postgres or SQLite engine,
  creates missing tables, and applies additive compatibility columns.
- `app/infrastructure/seed.py` contains development/test seed records only.
- `backend/tests/` contains unit tests and HTTP integration tests using an
  isolated SQLite database.

The backend derives the acting user and organization from the bearer token.
Employer internship writes require an employer account linked to an
organization. Administrator review requires the `admin` role. Browser code
never connects directly to Neon.

### Implemented live workflows

- Authentication: register, login, current-user lookup, role-aware dashboard
  selection, and sign-out.
- Internship catalogue: live organization and internship reads, search/filter
  metadata, detail views, and backend matching.
- Student profile: persisted course, year, CGPA, university, and skills.
- Student documents: live resume and student document uploads, replacement,
  metadata, size/type validation, and student ownership.
- Student applications: live application history, idempotent application
  submission, status tracking, and eligible withdrawal.
- Organization internship posting: organization-scoped posting creation with
  eligible courses, requirements, required documents, publication date,
  closing date, start date, duration, location, slots, stipend, duties, and
  `pending_review` status.
- Administrator internship review: protected review queue, approve/reject
  decisions, required rejection reasons, and public-catalogue visibility only
  after approval.
- GitHub Pages export: relative public asset paths and static frontend build.

### APIs currently used by the frontend

Authentication:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Public internship and matching:

- `GET /api/placements`
- `GET /api/placements/{placement_id}`
- `GET /api/placements/meta`
- `POST /api/match`
- `POST /api/skills/extract`
- `POST /api/advisor`

Authenticated student state:

- `GET/POST /api/saved`
- `POST /api/saved/toggle`
- `GET/POST /api/applications`
- `POST /api/applications/{application_id}/withdraw`
- `GET/PUT /api/profile`
- `GET/PUT /api/resume`
- `GET /api/resume/download`
- `GET /api/documents`
- `PUT /api/documents/{document_type}`
- `GET/POST /api/subscription`

Organization internship posting:

- `GET /api/organization/internships`
- `POST /api/organization/internships`

Administrator internship review:

- `GET /api/admin/internships/review`
- `PATCH /api/admin/internships/{internship_id}/review`

### Completion status

Complete and pushed:

- Implementation contract and portal foundation
- Live internship catalogue
- Live student dashboard overview and matching
- Persistent student profile and skills
- BrighterWorks rebrand
- Resume upload
- Application tracking and withdrawal
- Live student documents
- Organization internship submission
- Administrator internship approval/rejection workflow

In progress:

- Replacing remaining legacy seeded dashboard metrics and queues
- Administrator overview metrics, user/organization management, audit activity,
  reports, and document verification actions
- University, NGO, government, and company-specific organization dashboards
- Jobs domain, jobs catalogue, candidate workflows, and employer jobs portal
- Notifications, alerts, learning, and career assistance persistence
- Production hardening: restricted CORS, formal migrations, observability,
  deployment verification, and accessibility/mobile review

### Authentication entry-point contract

All protected work begins at the sign-in/sign-up screen:

1. The frontend calls `POST /api/auth/login` or `POST /api/auth/register`.
2. The backend returns a signed bearer token and safe account record.
3. The frontend stores the token, calls `/api/auth/me` on reload, and derives
   the dashboard role from the authenticated account.
4. Successful authentication routes to the matching dashboard overview.
5. Unauthenticated dashboard deep links return to sign-in.
6. A dashboard URL cannot switch an authenticated user into another role's
   workspace; the frontend redirects to the account's own role dashboard and
   backend authorization remains authoritative.
7. Admin accounts are provisioned by the platform and cannot be created through
   public sign-up.

The backend container is defined by `backend/Dockerfile` and
`backend/docker-compose.yml`. It runs the FastAPI service on port `8000`,
includes a health check, runs as a non-root user, and supports either local
Postgres through Compose or Neon through `DATABASE_URL`. Secrets belong in a
local/deployment `.env`, never in the image or repository.

Container deployment:

```bash
cd backend
cp .env.example .env
# Set DATABASE_URL to Neon and SECRET_KEY to a long production secret.
docker build -t brighterworks-api .
docker run --env-file .env -p 8000:8000 brighterworks-api
```

For local Postgres development:

```bash
cd backend
docker compose up --build
```

The frontend remains a separate static deployment. Set
`NEXT_PUBLIC_API_BASE_URL` to the reachable backend URL before building the
frontend; GitHub Pages cannot host the authenticated FastAPI API.

The current deployed backend is:

```text
https://global-inetrnship.onrender.com
```

The frontend is configured to use:

```text
https://global-inetrnship.onrender.com/api
```

This value is configured for local frontend development and the GitHub Pages
workflow. It is a public API URL, not a secret. The backend remains responsible
for authentication, authorization, Neon access, and all protected data.

### Jobs Portal status

The Jobs Portal is **not complete**. The current implementation contains the
portal entry point, role-aware job-seeker dashboard shell, and presentation
demo screens only. It does not yet have live Jobs entities, database tables,
organization job posting, job approval, live search, saved jobs, applications,
alerts, CV/cover-letter persistence, interviews, or shortlist workflows.

The correct Jobs delivery order is:

1. Add separate Job domain entities, ORM tables, migrations, repositories, and
   organization/admin authorization.
2. Add organization job drafts, requirements, publication dates, closing dates,
   and admin approval using the same lifecycle proven for internships.
3. Add live Jobs catalogue and job detail pages.
4. Add job-seeker profile, saved jobs, applications, and status tracking.
5. Add employer applicants, shortlist, interviews, and company profile.
6. Remove the remaining job dashboard demo data and verify the full
   sign-in-to-dashboard flow.

Jobs Portal progress:

- The first Jobs sub-feature is complete: a separate live Jobs catalogue now
  has `Job` domain/ORM records, development seed fixtures, repository mapping,
  `GET /api/jobs`, `GET /api/jobs/{id}`, search/location/mode filters, and
  authenticated job-seeker dashboard loading with explicit loading, empty, and
  error states.
- Job applications and employer job posting are intentionally not marked
  complete until their own backend and frontend slices are delivered.

Learner dashboard progress:

- The application pack is now persisted per authenticated student through
  `GET /api/application-pack` and `PUT /api/application-pack`.
- Student pack statements are limited to 600 characters and target roles are
  normalized and deduplicated by the backend.
- The pack preview uses the student's live profile, documents, and
  recommendation scores.
- The sent-application panel uses live application and placement records rather
  than bundled demo applications.
- Remaining learner workflow work includes persisted testimonials and any
  remaining dashboard actions that currently only display local confirmation.

The next implementation slice begins only after the current feature has
passed backend tests, frontend build/type checking, staged-diff review, commit,
and push.
