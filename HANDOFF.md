# INTERN — design handoff pack

Everything needed to lay the system onto a FigJam board, plus what to rebuild as an editable Figma design file.

**Contents:** `handoff/*.png` — fourteen rendered screens, desktop and mobile.

---

## First, a distinction worth making

The link you sent is a **FigJam board** (`/board/`). A board holds sections, stickies, images and connectors — it does **not** hold UI frames. So there are two different jobs:

| Goal | Where it belongs |
|---|---|
| Flow map, annotated screens, stakeholder review | **This board** — drop the PNGs in, add stickies and connectors |
| Editable UI, components, variables, developer handoff | A **Design file** — the board cannot hold frames |

The MCP can still not write to either: the connected account (`akandwanahojonan256@gmail.com`) is **Viewer** on the files you have shared, and the plan is **Starter**, which is over its tool-call limit. Both need fixing before I can push anything.

---

## Board structure

Five sections, left to right:

1. **Brief** — one sentence, the three audiences, the six requirement fields.
2. **Design system** — tokens, type, shapes, component inventory.
3. **Public site** — `01`, `02`, `03`, `04`, `05`, `06`.
4. **Dashboards** — `07`–`12`.
5. **Global layer + flows** — currency, visa, grade equivalence, mobile (`13`, `14`).

---

## Screens

| File | Screen | Notes |
|---|---|---|
| `01-home.png` | Home | Photo hero, arch frame, placement search, free offers strip |
| `02-placements.png` | Index | Region + work-authorisation filters, stipend with USD equivalent |
| `03-placement-detail.png` | Placement | Grade equivalence, visa rule, documents, apply-with-pack |
| `04-about.png` | About | Principles, verification, global standards, office |
| `05-plans.png` | Plans | Five buyer segments, three tiers, comparison table |
| `06-signin.png` | Sign in | Four role entries |
| `07-admin-overview.png` | University admin | KPIs, approval queue, coverage by organisation type |
| `08-admin-requirements.png` | Requirements | Folded-corner requirement cards per placement |
| `09-student-overview.png` | Student | Application ticket, eligibility checklist, deadlines |
| `10-student-pack.png` | Application pack | Statement, attachments, target roles |
| `11-employer.png` | Employer | Applicants, plan usage, premium tools |
| `12-jobseeker.png` | Job seeker | Graduate roles beyond internships |
| `13-mobile-home.png` | Mobile home | 500px viewport |
| `14-mobile-admin.png` | Mobile admin | Off-canvas sidebar |

---

## Design tokens

**Colour**

| Token | Hex | Use |
|---|---|---|
| Paper | `#F5F3ED` | Page background |
| Ink | `#0E1114` | Text, rules, primary buttons |
| Blue | `#17325B` | Institutional accent, active nav, links |
| Blue deep | `#0C1D35` | Dark bands, sign-in panel |
| Red | `#B23A20` | Seals, ribbons, missing-document flags |
| Green | `#1E6B4B` | Verified states, primary CTA on dark |
| Gold | `#A3801F` | Pending / review states |
| Rule | `#D9D4C5` | All hairlines |

**Type**

| Role | Family | Size / weight |
|---|---|---|
| Display | Instrument Serif 400 | 42–76px, line-height 0.98–1.05, tracking −0.025em |
| Headings | Instrument Serif 400 | 24–44px |
| UI | Inter Tight 400/500/600 | 12.5–16px |
| Labels | JetBrains Mono 500 | 9–10px, uppercase, tracking 0.16em |

**Geometry** — base radius 2px. Arch `190px 190px 3px 3px` for hero photography. Seal is a circle with 1px border, rotated −7°. Ticket uses punched side notches. Folded corner is `clip-path: polygon(0 0, 100% 0, 100% calc(100% - 26px), calc(100% - 26px) 100%, 0 100%)`.

**Spacing** — 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128. Section rhythm 66px, gutter 40px, max width 1300px.

---

## Components

Masthead (with hover dropdowns) · utility bar (currency switch) · search ticket · org-type card ×3 shapes · placement table row · requirement block (fold) · seal · ticket · KPI strip · data table · approval queue · document upload zone · chat drawer · plan tier · application pack document.

---

## Flows to draw on the board

**Student**
Sign in → Index → filter by region and work authorisation → placement → eligibility check → apply with pack → tracker → interview.

**University office**
Sign in → dashboard → new placement (organisation dropdown → courses → grade → documents → testimonial rule) → publish → students upload → verify → report.

**Employer**
Sign in → placement → applicants (only those meeting the stated bar) → shortlist → interview → offer.

**Government agency**
Same requirement fields → cohort report → M&E export.

---

## Copy rules

- State the requirement before the ask. No "strong preference", no "hidden filters".
- Numbers carry units and dates: `28 Feb 2026`, `UGX 1,200,000 / month`, `≈ $320`.
- Never promise outcomes ("get hired"); describe mechanism ("the office verifies within 48 hours").
- Free is stated plainly where it applies: students never pay.

---

## What is not in this pack

Language localisation, editable Figma variables/components (blocked by access), payment flows, and cross-border credential verification.
