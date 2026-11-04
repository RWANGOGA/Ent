# INTERN — component port

This directory is the **Next.js / React / TypeScript port** of the static prototype in the repo root.

The root `index.html` + `app.js` + `styles.css` is the original; everything here is the componentised version. `src/app/globals.css` is byte-identical to `styles.css`.

## Run

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Architecture

- `src/app/page.tsx` — root, wires `AppProvider`, `PublicSite`, `DashboardShell`, and the global overlays.
- `src/components/public/` — `HomeView`, `PlacementsView`, `PlacementDetailView`, `AboutView`, `UniversitiesView`, `EmployersView`, `ContactView`, `PlansView`, `SignInView`, `PublicSite`.
- `src/components/dashboard/{admin,student,employer,jobseeker}/` — the four role dashboards.
- `src/components/common/` — `Header`, `Footer`, `MobileMenu`, `ChatDrawer`, `Modal`, `Toast`.
- `src/components/icons/Icons.tsx` — all 16 SVG symbols + the `Icon` component.
- `src/context/AppContext.tsx` — all state, hash routing, eligibility, chat assistant, modals, toasts and domain actions.
- `src/data/index.ts` and `src/types/index.ts` — the model.

Every feature in the root prototype has a counterpart here. Hash routing is preserved (`#home`, `#placement-p1`, `#dashboard-admin-requirements`, etc.).

A placement office in software. Universities publish internships from **companies, government agencies, NGOs and university departments**; students see the requirement before applying; the office verifies documents; employers receive only qualified candidates.

---

## Screens

### Public site

| Page | Hash | Notes |
|---|---|---|
| Home | `#home` | Photo hero, placement search, organisation-type counts, three host types, student band, requirement specimen, latest placements, university band, testimonial |
| Placements | `#placements` | Filter by organisation type / sector / course + live search, full table, eligibility explainer |
| Placement detail | `#placement-p1` … `p12` | Stated requirements, documents, past testimonial, apply ticket |
| About | `#about` | Mission, four principles, how the index is verified, the office |
| Universities | `#universities` | Publish / verify / report, requirement-set example |
| Employers | `#employers` | Three-step model |
| Contact | `#contact` | Form, three offices, hours, response time |
| Plans | `#plans` | Five buyer segments, three tiers each, comparison table, free offers |
| Sign in | `#signin` | Four role entries |

### Dashboards

| Role | Hash | Views |
|---|---|---|
| University admin | `#dashboard-admin` | Overview, Placements, Requirements, Students |
| Student | `#dashboard-student` | Overview, Placements, Documents, **Application pack**, Testimonial |
| Employer | `#dashboard-employer` | Overview, My placements, Applicants — plus plan usage and premium tools |
| Job seeker | `#dashboard-jobseeker` | Overview, Graduate roles, Applications |

Deep links accept a view: `#dashboard-admin-requirements`, `#dashboard-student-documents`, `#dashboard-employer-applicants`.

---

## Assistant

**"Ask INTERN"** — the button at the bottom right of every page opens a drawer that answers from the actual record:

- **Eligibility** — "Am I eligible for the Data Analyst Intern?" → matches the placement, compares course and CGPA against the stated grade, lists missing documents, quotes the closing date.
- **Documents** — counts verified / missing files from the student record and explains the 48-hour review.
- **Government listings** — counts live government placements and names the agencies.
- **Verification** — explains the office's role and that employers only receive verified files.
- **Deadlines** — sorts the next three closings.
- **Cost, contact, what INTERN is** — direct answers.

It is context-aware: on a placement page it reasons about that placement; otherwise it falls back to the signed-in student record.

---

## Plans and premium features

`#plans` — segmented by buyer, three tiers each, with a comparison table beneath.

| Segment | Free | Middle | Top |
|---|---|---|---|
| **Companies** | 1 placement, 10 applications | **$99/mo** — unlimited, featured, talent search, ATS sync, branded page | Enterprise — SSO, API, invoice |
| **Ministries & agencies** | 2 placements, PDF cohort report | **$249/mo** — bulk CSV import, regional dashboards, M&E export, procurement pack | Ministry — national dashboard, audit log |
| **Universities** | 1 faculty, 50 students, first term free | **$1,900/yr** — all faculties, 24h verification SLA, placement-rate reporting, branded portal | Consortium — SIS integration, SSO |
| **Career sites** | Branded widget, 10 roles | **$149/mo** — unbranded widget, API, custom domain, analytics | Network — revenue share per hire |
| **Students** | **$0 forever** — everything | Graduate — free 12 months after graduation, then $3 | Sponsored — a university or employer pays |

**Free offers** (also on the home page): students never pay · first three placements free · public universities get one full term free.

**Premium surfaces inside the product:**
- Employer overview — plan and usage panel (2 of 3 free placements), review-time SLA, premium tools list
- Employer applicants — locked talent search across 41,208 students
- Career page embed — copy-paste widget snippet (`data-org`, `data-theme`, `data-limit`)
- Dashboard sidebar — "Plans and billing"

## Application pack (the "made" application)

Students build one reusable pack: a 600-character statement, their verified documents, and target roles. Every placement application sends the pack in one click, with the role reference and closing line appended.

`#dashboard-student-pack` — edit the statement, see attachment statuses, preview exactly what an employer receives, and see what was sent this term. The placement page button now reads **"Apply with my pack"** and the confirmation modal shows the statement and documents before sending.

## The requirements model

Six fields per placement, set by the university with the host organisation:

1. **Organisation** — dropdown grouped by type
2. **Eligible courses** — multi-select
3. **Minimum grade** — CGPA band or class of degree
4. **Required documents** — transcript, ID, recommendation, portfolio, CV, writing sample, testimonial
5. **Testimonial rule**
6. **Closing date** and slots

Students see `You qualify` / `Not eligible` before applying. The admin verifies each file; the employer sees only cleared candidates.

---

## Imagery

Student photography is real, sourced from Unsplash (free licence, no attribution required) and **stored locally** in `img/` so the prototype works offline:

| File | Source photo |
|---|---|
| `img/hero.jpg` | `unsplash.com/photos/…` — students working in a university library |
| `img/students.jpg` | five students sitting together on campus |
| `img/portrait.jpg` | student portrait with a folder |
| `img/classroom.jpg` | students in a lecture room |
| `img/building.jpg` | university building |

Images are lightly desaturated (`saturate(.92)`) so they sit inside the paper palette rather than on top of it.

---

## Shape language

| Shape | Where | Why |
|---|---|---|
| Arch (190px top radius) | Hero photograph | Civic, institutional — not a product card |
| Ticket (punched sides) | Search card, application status, apply panel | Reads as a record you keep |
| Folded corner | Requirement sets | A page in a file |
| Seal (rotated circle) | Organisation type, verification, testimonial | A stamp of authority |
| Rules only | Placement tables, approval queue | No boxes where data should dominate |

---

## Figma status — still blocked

1. `8rdQ7kqD7n8guoMkaztrFW` is **view-only** for the connected account — the MCP cannot read or write it.
2. The Figma MCP is on the **Starter** plan and returns *"You've reached the Figma MCP tool call limit"*.

Fix: share the file as **Editor** with `akandwanahojonan256@gmail.com` (or duplicate it into *Akandwanaho Jonan's team*), and upgrade the plan. Then this prototype becomes the spec for the frames.

---

## Limits

- Uploads and applications are simulated; nothing persists across reload.
- Eligibility uses one demo student record (Design, CGPA 3.7).
- Assistant answers are rule-based, not a language model.
- Photography is licensed stock, not the actual students named in the copy.
