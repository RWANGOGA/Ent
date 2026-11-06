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
- Add document upload metadata and verification state for transcripts, IDs, and recommendations.
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
