# SAKODE Academic System — AI Agent Frontend Prompt Pack

**Version:** 0.9  
**Usage:** Run one prompt at a time. Never combine prompts unless the product owner explicitly requests it.

## Global Execution Contract

Every prompt below inherits these non-negotiable rules:

1. Read `AGENTS.md`, `AI docs/CONTEXT.md`, `AI docs/CUSTOM_UI_BUILDING.md`, `docs/SRS.md`, `docs/FEATURE_LIST.md`, `docs/AI_AGENT_BRIEF.md`, and `docs/FRONTEND_IMPLEMENTATION_PLAN.md` before editing.
2. Work only on the named `FE-SLICE-*` and role.
3. Current scope is frontend only. Do not install/implement Better Auth, Drizzle, MySQL, migrations, Server Actions, Route Handlers, or integration APIs.
4. Use typed view models, fixtures, and mock adapters/services. Do not scatter hardcoded datasets through page components.
5. Default style is `sakode-modern`; keep `StyleSwitcherFAB` functional and test the selected screen across visual styles/colors and light/dark mode.
6. Use a modern, comfortable, data-oriented layout inspired by TailAdmin’s information architecture, without cloning it.
7. Avoid AI-slope visual patterns: excessive gradients/glows, decorative blobs, arbitrary 3D elements, huge dashboard hero blocks, and identical rounded cards everywhere.
8. Always use the visual style system by importing primitives directly from the `@/UI` directory (e.g. `UI.Button`, `UI.Card`, `UI.Badge`, `UI.Input`, `UI.Select`). Do not build custom CSS components or inline styled elements if equivalent primitives exist. If a required element is not yet implemented in the `@/UI` directory, first implement that primitive across all visual style presets inside the `@/UI` library before using it on the page.
9. Provide relevant loading, empty, error, disabled, confirmation, success, and read-only states.
10. Preserve accessibility: labels, keyboard navigation, focus visibility, semantic structure, and contrast.
11. Run `cmd.exe /c npm run lint` and `cmd.exe /c npm run build`.
12. End with a review report: scope, files changed, components added, fixture scenarios, responsive behavior, validation results, limitations, and manual checklist.
13. Stop after the report. Do not begin another slice.

---
## FE-SLICE-001 — Responsive Application Shell and Role Navigation

**Role:** Shared

```text
You are working in the SAKODE Academic System repository.

Selected slice: FE-SLICE-001 — Responsive Application Shell and Role Navigation
Role scope: Shared

Follow the Global Execution Contract in `AI docs/FEATURE_IMPLEMENTATION_PROMPTS.md`.

Task:
Audit and refine the shared dashboard shell only. Build a responsive, comfortable application frame with
collapsible desktop sidebar, mobile navigation drawer, header, page content container, active route state, and
role-filtered navigation map for Admin, Mentor Lead, Mentor, Student, School Principal, and Referrer. The Header
must render the dynamic role-switcher buttons (Daftar Referrer, Portal Referrer, Portal Utama, Ke Beranda) per
the multi-role referrer spec in `docs/AI_AGENT_BRIEF.md` point 26. Keep existing quick-login demo behavior
usable. Do not build role feature pages beyond placeholder navigation targets. The modern default should be the
most polished. Keep the FAB accessible and unobstructed. Review evidence must include desktop/tablet/mobile
behavior and the final role-menu matrix.

Do not expand beyond this slice. At the end, run lint/build, provide the required review report, and STOP for product-owner review.
```
---
## FE-SLICE-002 — Reusable Application Components and Fixture Convention

**Role:** Shared

```text
You are working in the SAKODE Academic System repository.

Selected slice: FE-SLICE-002 — Reusable Application Components and Fixture Convention
Role scope: Shared

Follow the Global Execution Contract in `AI docs/FEATURE_IMPLEMENTATION_PROMPTS.md`.

Task:
Create or refine the shared frontend foundation needed by upcoming role screens. Inventory existing `@/UI`
primitives, then add only the minimum reusable primitives/composites needed for page header, metrics, filter
toolbar, data state boundary, responsive data list, empty state, skeleton/loading, pagination, and read-only
scope notice. New primitives must be implemented across all seven UI styles and added to `/ui`; domain-neutral
composites may live in shared app components. Establish typed view-model and mock-service conventions with one
small demonstration fixture. Do not redesign a business feature page.

Do not expand beyond this slice. At the end, run lint/build, provide the required review report, and STOP for product-owner review.
```
---
## FE-SLICE-003 — Style Switcher and Theme Regression

**Role:** Shared

```text
You are working in the SAKODE Academic System repository.

Selected slice: FE-SLICE-003 — Style Switcher and Theme Regression
Role scope: Shared

Follow the Global Execution Contract in `AI docs/FEATURE_IMPLEMENTATION_PROMPTS.md`.

Task:
Focus only on regression-hardening the existing `StyleSwitcherFAB`, `UIStyleContext`, and style showcase
behavior. Preserve `sakode-modern` as default. Verify style switching, preset colors, custom
primary/secondary/accent hex colors, light/dark mode, keyboard labels, and mobile positioning. Ensure
switching visual style does not reset route/business mock state. Fix only issues found in this area and
document remaining style-specific gaps. Do not implement dashboard business features.

Do not expand beyond this slice. At the end, run lint/build, provide the required review report, and STOP for product-owner review.
```
---
## FE-SLICE-004 — Public Landing Package Catalog and Pricing

**Role:** Public

```text
You are working in the SAKODE Academic System repository.

Selected slice: FE-SLICE-004 — Public Landing Package Catalog and Pricing
Role scope: Public

Follow the Global Execution Contract in `AI docs/FEATURE_IMPLEMENTATION_PROMPTS.md`.

Task:
Build only the public-facing SAKODE Academic landing/catalog experience. Keep broader company-profile/news CMS
outside scope. Replace or extend the current welcome page with a focused, modern section that presents only
published package/program fixtures: package name, concise outcome, listed price and currency, included-module
preview, availability/registration period, optional featured state, and a clear registration CTA. The CTA must
carry a stable package slug as query context (for example `?program=<slug>`) to the existing account/enrollment
flow, but must not create a registration. Provide package comparison that is useful without becoming a generic
pricing-table template. Include loading, empty, partial-error, missing-price, closed-registration, and mobile
states. Keep `sakode-modern` most polished and preserve the FAB.

Use domain composites such as `PublicPackageCatalog`, `PackageCard`, and `ModulePreviewList`, composed from
existing `@/UI` primitives. Do not implement admin editing, payment, checkout, database fetching, promo logic,
or referral validation.

Do not expand beyond this slice. At the end, run lint/build, provide the required review report, and STOP for product-owner review.
```
---
## FE-SLICE-005 — Login Frontend

**Role:** Public

```text
You are working in the SAKODE Academic System repository.

Selected slice: FE-SLICE-005 — Login Frontend
Role scope: Public

Follow the Global Execution Contract in `AI docs/FEATURE_IMPLEMENTATION_PROMPTS.md`.

Task:
Improve only the `/login` frontend. Create a polished modern login experience with clear hierarchy,
email/password fields, show-password control, remember-me presentation if appropriate, forgot-password
affordance, validation feedback, loading state, invalid-credential mock state, disabled state, and quick-login
demo roles. Keep the page visually connected to SAKODE without a generic split-screen template or excessive
decoration. Do not implement Better Auth or real credential verification.

Do not expand beyond this slice. At the end, run lint/build, provide the required review report, and STOP for product-owner review.
```
---
## FE-SLICE-006 — Account Registration Frontend

**Role:** Public

```text
You are working in the SAKODE Academic System repository.

Selected slice: FE-SLICE-006 — Account Registration Frontend
Role scope: Public

Follow the Global Execution Contract in `AI docs/FEATURE_IMPLEMENTATION_PROMPTS.md`.

Task:
Improve only the `/register` frontend for prospective students. Build a comfortable responsive registration
form with logical sections, password guidance, consent, validation, submitting, error, and success/next-step
mock states. Preserve a route back to login. When inbound `program` and/or `ref` query context exists, show a
small transparent acquisition summary and preserve those values in the mocked next-step navigation without
validating or enrolling yet. Use typed form/view models and do not implement database persistence, Better Auth
signup, promo validation, or program enrollment in this slice.

Do not expand beyond this slice. At the end, run lint/build, provide the required review report, and STOP for product-owner review.
```
---
## FE-SLICE-007 — Public Package Enrollment and Referral-Link Prefill

**Role:** Public / Prospective Student

```text
You are working in the SAKODE Academic System repository.

Selected slice: FE-SLICE-007 — Public Package Enrollment and Referral-Link Prefill
Role scope: Public / Prospective Student

Follow the Global Execution Contract in `AI docs/FEATURE_IMPLEMENTATION_PROMPTS.md`.

Task:
Build only the frontend enrollment step that follows account creation or a landing CTA. Inspect existing routing
and choose a route consistent with the project; document the final URL contract. Accept typed mock query/context
for `program` and `ref`. Prefill the selected package from a valid slug and visibly prefill the referral field
from a referral link. Package selection is mandatory: show price, currency, included modules, availability, and
a clear change-package interaction before submit. Keep promo and referral as separate inputs/summaries. Preserve
context across mocked multi-step navigation, and demonstrate valid referral, invalid/expired referral, no
referral, unknown package, missing package, closed package, and changed-price/reconfirmation scenarios. The
summary before submit must show package, listed price, mock final price when promo exists, and referral source
without implying referral discount/reward.

Do not implement Better Auth, persistence, real URL-token security, server validation, payment, promo/referral
redemption, or Admin screens. Use a typed acquisition/enrollment view model and mock adapter so backend services
can replace it later.

Do not expand beyond this slice. At the end, run lint/build, provide the required review report, and STOP for product-owner review.
```
---
## FE-SLICE-008 — Admin Overview Dashboard

**Role:** Admin

```text
You are working in the SAKODE Academic System repository.

Selected slice: FE-SLICE-008 — Admin Overview Dashboard
Role scope: Admin

Follow the Global Execution Contract in `AI docs/FEATURE_IMPLEMENTATION_PROMPTS.md`.

Task:
Build only the Admin overview screen. Use realistic typed fixtures to show operational summary,
registration/trial priorities, referral program/conversion snapshot, mentor capacity snapshot, upcoming sessions, extracurricular status, and recent
activity. Prioritize actionable information instead of decorative charts. Include loading, empty, and partial-
error scenarios. Quick actions may navigate to placeholders but must not implement their destination features.
Do not alter other role dashboards except shared regressions required by this screen.

Do not expand beyond this slice. At the end, run lint/build, provide the required review report, and STOP for product-owner review.
```
---
## FE-SLICE-009 — Student Registration Review

**Role:** Admin

```text
You are working in the SAKODE Academic System repository.

Selected slice: FE-SLICE-009 — Student Registration Review
Role scope: Admin

Follow the Global Execution Contract in `AI docs/FEATURE_IMPLEMENTATION_PROMPTS.md`.

Task:
Build only the Admin student-registration frontend. Provide a responsive list/table, search, status/program
filters, compact summary, registration detail drawer/page, applicant timeline, selected package/module summary, listed/final price snapshot, separate promo and referral indicators, and mock
status-review interaction with confirmation and feedback. Include empty/loading/error and no-selection states.
Do not implement persistence, real approval, promo validation, or student screens.

Do not expand beyond this slice. At the end, run lint/build, provide the required review report, and STOP for product-owner review.
```
---
## FE-SLICE-010 — Admin Referral Program Management

**Role:** Admin

```text
You are working in the SAKODE Academic System repository.

Selected slice: FE-SLICE-010 — Admin Referral Program Management
Role scope: Admin

Follow the Global Execution Contract in `AI docs/FEATURE_IMPLEMENTATION_PROMPTS.md`.

Task:
Build only the Admin frontend for referral registration programs. Provide a responsive program list with
status, active period, target-program context, code count, usage/attribution summary, search and filters; a
program detail workspace; create/edit interaction shells; referral-code inventory with referrer/source, status,
validity, optional usage-limit presentation, URL-safe code state, canonical registration-link preview, copy
feedback, and native-share fallback; and an attribution/conversion list linked to student registration status. Include confirmation for activate/deactivate actions plus loading, empty, partial-error,
expired, code-exhausted, no-attribution, and corrected-attribution fixture scenarios. Keep promo and referral
visually and semantically separate. Do not imply that referral produces a discount, commission, reward, or
payout unless the product owner later confirms those rules. Mock link generation from a configured public base
URL and code; do not store PII in the link. Do not implement persistence, cryptographic token issuance, real
validation, reward settlement, or student registration screens.

Prefer domain composites such as `ReferralProgramWorkspace`, `ReferralCodeInventory`,
`ReferralLinkSharePanel`, and `ReferralAttributionSummary`, built from existing `@/UI` primitives. Any new cross-style primitive must satisfy
the shared UI rules. Add navigation/quick action only for this Admin feature and do not implement other role
features.

Do not expand beyond this slice. At the end, run lint/build, provide the required review report, and STOP for product-owner review.
```
---
## FE-SLICE-011 — Trial Registration Management

**Role:** Admin

```text
You are working in the SAKODE Academic System repository.

Selected slice: FE-SLICE-011 — Trial Registration Management
Role scope: Admin

Follow the Global Execution Contract in `AI docs/FEATURE_IMPLEMENTATION_PROMPTS.md`.

Task:
Build only the Admin trial-management frontend. Provide list/calendar or agenda views as appropriate, filters,
booking detail, reschedule/status interaction prototype, contact summary, and conflict/invalid-state feedback
using fixtures. Avoid building the full mentor schedule module. No real scheduling mutation or backend.

Do not expand beyond this slice. At the end, run lint/build, provide the required review report, and STOP for product-owner review.
```
---
## FE-SLICE-012 — Programs and Learning Modules

**Role:** Admin

```text
You are working in the SAKODE Academic System repository.

Selected slice: FE-SLICE-012 — Programs and Learning Modules
Role scope: Admin

Follow the Global Execution Contract in `AI docs/FEATURE_IMPLEMENTATION_PROMPTS.md`.

Task:
Build only the Admin programs/pricing/modules frontend. Provide program catalog/list, status filters, selected
program summary, public slug, listed price and currency fields, featured/published state, ordered module outline,
public-card preview, and create/edit interaction shells using mock state. Support draft/published visual
distinction, missing-price validation, empty program/module states, and responsive detail layout. Do not implement actual content
editor persistence or student module access.

Do not expand beyond this slice. At the end, run lint/build, provide the required review report, and STOP for product-owner review.
```
---
## FE-SLICE-013 — Mentor Directory

**Role:** Admin

```text
You are working in the SAKODE Academic System repository.

Selected slice: FE-SLICE-013 — Mentor Directory
Role scope: Admin

Follow the Global Execution Contract in `AI docs/FEATURE_IMPLEMENTATION_PROMPTS.md`.

Task:
Build only the Admin mentor-directory frontend. Provide mentor cards or responsive data list,
expertise/status/availability filters, profile detail, capacity summary, and clear inactive/unavailable
states. Use realistic fixtures. Do not implement plotting or schedule editing in this slice; link/CTA may lead
to placeholders only.

Do not expand beyond this slice. At the end, run lint/build, provide the required review report, and STOP for product-owner review.
```
---
## FE-SLICE-014 — Mentor Plotting Workspace

**Role:** Admin

```text
You are working in the SAKODE Academic System repository.

Selected slice: FE-SLICE-014 — Mentor Plotting Workspace
Role scope: Admin

Follow the Global Execution Contract in `AI docs/FEATURE_IMPLEMENTATION_PROMPTS.md`.

Task:
Build only the Admin mentor-plotting frontend. Create an unassigned-student queue, student context panel,
eligible mentor comparison, workload/capacity cues, selection, confirmation, and mock success/error states.
Ensure the layout remains usable on smaller screens, potentially using drawers/steps. Do not implement mentor
directory editing, schedule creation, or backend assignment.

Do not expand beyond this slice. At the end, run lint/build, provide the required review report, and STOP for product-owner review.
```
---
## FE-SLICE-015 — Mentor Scheduling

**Role:** Admin

```text
You are working in the SAKODE Academic System repository.

Selected slice: FE-SLICE-015 — Mentor Scheduling
Role scope: Admin

Follow the Global Execution Contract in `AI docs/FEATURE_IMPLEMENTATION_PROMPTS.md`.

Task:
Build only the Admin mentor-scheduling frontend. Provide calendar/agenda navigation, filters, session detail,
create/edit form shell, participant summary, and mock conflict feedback. Include loading, empty, and
cancelled/rescheduled states. Do not implement real overlap checks, database writes, or Mentor/Mentor Lead
versions.

Do not expand beyond this slice. At the end, run lint/build, provide the required review report, and STOP for product-owner review.
```
---
## FE-SLICE-016 — Extracurricular Organization Management

**Role:** Admin

```text
You are working in the SAKODE Academic System repository.

Selected slice: FE-SLICE-016 — Extracurricular Organization Management
Role scope: Admin

Follow the Global Execution Contract in `AI docs/FEATURE_IMPLEMENTATION_PROMPTS.md`.

Task:
Build only the Admin extracurricular-organization frontend. Provide organization list, onboarding/status
summary, profile/detail view, contact information, registration period/capacity placeholders clearly labeled
when business rules are TBD, and mock status action flow. Do not implement student extracurricular
registration or Principal dashboard.

Do not expand beyond this slice. At the end, run lint/build, provide the required review report, and STOP for product-owner review.
```
---
## FE-SLICE-017 — School Principal Membership and Read Scope Setup

**Role:** Admin

```text
You are working in the SAKODE Academic System repository.

Selected slice: FE-SLICE-017 — School Principal Membership and Read Scope Setup
Role scope: Admin

Follow the Global Execution Contract in `AI docs/FEATURE_IMPLEMENTATION_PROMPTS.md`.

Task:
Build only the Admin frontend for managing School Principal accounts/membership scope. Provide principal list,
organization association, read-only permission summary, add/edit membership interaction prototype, and warning
against unscoped access. Use typed fixtures. Do not implement authentication, database roles, or Principal
report screens.

Do not expand beyond this slice. At the end, run lint/build, provide the required review report, and STOP for product-owner review.
```
---
## FE-SLICE-018 — Mentor Lead Overview

**Role:** Mentor Lead

```text
You are working in the SAKODE Academic System repository.

Selected slice: FE-SLICE-018 — Mentor Lead Overview
Role scope: Mentor Lead

Follow the Global Execution Contract in `AI docs/FEATURE_IMPLEMENTATION_PROMPTS.md`.

Task:
Build only the Mentor Lead overview. Show scoped unassigned queue, mentor capacity, upcoming schedules,
workload alerts, and recent plotting activity using fixtures. The screen must clearly communicate that data is
limited to the Lead’s scope. Do not implement plotting or schedule mutation here; route CTAs can remain
placeholders.

Do not expand beyond this slice. At the end, run lint/build, provide the required review report, and STOP for product-owner review.
```
---
## FE-SLICE-019 — Scoped Mentor Plotting Queue

**Role:** Mentor Lead

```text
You are working in the SAKODE Academic System repository.

Selected slice: FE-SLICE-019 — Scoped Mentor Plotting Queue
Role scope: Mentor Lead

Follow the Global Execution Contract in `AI docs/FEATURE_IMPLEMENTATION_PROMPTS.md`.

Task:
Build only the Mentor Lead plotting frontend. Reuse shared/domain components where appropriate but present
only scoped students and mentors. Provide queue filters, student context, mentor capacity comparison,
confirmation, and mock success/error feedback. Do not implement Admin-specific controls or scheduling.

Do not expand beyond this slice. At the end, run lint/build, provide the required review report, and STOP for product-owner review.
```
---
## FE-SLICE-020 — Scoped Schedule Management

**Role:** Mentor Lead

```text
You are working in the SAKODE Academic System repository.

Selected slice: FE-SLICE-020 — Scoped Schedule Management
Role scope: Mentor Lead

Follow the Global Execution Contract in `AI docs/FEATURE_IMPLEMENTATION_PROMPTS.md`.

Task:
Build only the Mentor Lead schedule-management frontend. Provide scoped calendar/agenda, mentor/student
filters, session detail, create/edit prototype within allowed scope, and conflict feedback. Distinguish
actions unavailable to the Lead. No backend or Admin/Mentor screen implementation.

Do not expand beyond this slice. At the end, run lint/build, provide the required review report, and STOP for product-owner review.
```
---
## FE-SLICE-021 — Mentor Overview

**Role:** Mentor

```text
You are working in the SAKODE Academic System repository.

Selected slice: FE-SLICE-021 — Mentor Overview
Role scope: Mentor

Follow the Global Execution Contract in `AI docs/FEATURE_IMPLEMENTATION_PROMPTS.md`.

Task:
Build only the Mentor overview. Show next session, today’s agenda, assigned-student summary, pending follow-up
placeholders only if already in scope, and workload/availability information. Keep the screen task-oriented
and personal. Do not implement assigned-student detail or schedule management beyond navigation/summary.

Do not expand beyond this slice. At the end, run lint/build, provide the required review report, and STOP for product-owner review.
```
---
## FE-SLICE-022 — Assigned Students

**Role:** Mentor

```text
You are working in the SAKODE Academic System repository.

Selected slice: FE-SLICE-022 — Assigned Students
Role scope: Mentor

Follow the Global Execution Contract in `AI docs/FEATURE_IMPLEMENTATION_PROMPTS.md`.

Task:
Build only the Mentor assigned-students frontend. Provide searchable assigned-student list, compact
status/progress cues limited to confirmed scope, student detail summary, mentor-assignment context, and
empty/loading/error states. Enforce the visual concept of “only my assignments.” Do not add grading,
certificate, portfolio, or XP workflows.

Do not expand beyond this slice. At the end, run lint/build, provide the required review report, and STOP for product-owner review.
```
---
## FE-SLICE-023 — Personal Schedule

**Role:** Mentor

```text
You are working in the SAKODE Academic System repository.

Selected slice: FE-SLICE-023 — Personal Schedule
Role scope: Mentor

Follow the Global Execution Contract in `AI docs/FEATURE_IMPLEMENTATION_PROMPTS.md`.

Task:
Build only the Mentor personal-schedule frontend. Provide agenda/calendar, session detail, join/location
information, and allowed mock status actions clearly separated from actions requiring Lead/Admin approval.
Include empty, cancelled, rescheduled, and conflict-notice scenarios. No backend.

Do not expand beyond this slice. At the end, run lint/build, provide the required review report, and STOP for product-owner review.
```
---
## FE-SLICE-024 — Student Overview

**Role:** Student

```text
You are working in the SAKODE Academic System repository.

Selected slice: FE-SLICE-024 — Student Overview
Role scope: Student

Follow the Global Execution Contract in `AI docs/FEATURE_IMPLEMENTATION_PROMPTS.md`.

Task:
Build only the Student overview. Show current program, learning progress summary, next mentoring session,
mentor snapshot, registration/trial/extracurricular alerts only when relevant, and a clear next action. Use
human Indonesian copy and avoid excessive gamification because XP/certificates are not confirmed. Do not
implement destination pages.

Do not expand beyond this slice. At the end, run lint/build, provide the required review report, and STOP for product-owner review.
```
---
## FE-SLICE-025 — Registration and Promo Status

**Role:** Student

```text
You are working in the SAKODE Academic System repository.

Selected slice: FE-SLICE-025 — Registration and Promo Status
Role scope: Student

Follow the Global Execution Contract in `AI docs/FEATURE_IMPLEMENTATION_PROMPTS.md`.

Task:
Build only the Student/prospective-student registration-status frontend. Provide application summary, status
timeline, selected package and included-module context, listed/final price snapshot, distinct promo and referral
feedback, referral-source/attribution context without implying a discount, and clear invalid/expired mock states. Do not implement real promo/referral validation, submission persistence, reward
logic, or Admin review.

Do not expand beyond this slice. At the end, run lint/build, provide the required review report, and STOP for product-owner review.
```
---
## FE-SLICE-026 — Trial Registration and Status

**Role:** Student

```text
You are working in the SAKODE Academic System repository.

Selected slice: FE-SLICE-026 — Trial Registration and Status
Role scope: Student

Follow the Global Execution Contract in `AI docs/FEATURE_IMPLEMENTATION_PROMPTS.md`.

Task:
Build only the Student trial frontend. Provide available trial options/slots as fixtures, booking form
interaction, status/timeline, reschedule/cancel affordances marked according to mock permissions, and
empty/error/success states. Do not implement Admin management or backend booking.

Do not expand beyond this slice. At the end, run lint/build, provide the required review report, and STOP for product-owner review.
```
---
## FE-SLICE-027 — Learning Modules

**Role:** Student

```text
You are working in the SAKODE Academic System repository.

Selected slice: FE-SLICE-027 — Learning Modules
Role scope: Student

Follow the Global Execution Contract in `AI docs/FEATURE_IMPLEMENTATION_PROMPTS.md`.

Task:
Build only the Student learning-modules frontend. Provide program/module navigation, module status/progress
view, locked/available/completed states, module detail shell, and responsive reading layout. Do not add
unconfirmed grading, certificate, XP, or content persistence.

Do not expand beyond this slice. At the end, run lint/build, provide the required review report, and STOP for product-owner review.
```
---
## FE-SLICE-028 — Mentor Profile and Personal Schedule

**Role:** Student

```text
You are working in the SAKODE Academic System repository.

Selected slice: FE-SLICE-028 — Mentor Profile and Personal Schedule
Role scope: Student

Follow the Global Execution Contract in `AI docs/FEATURE_IMPLEMENTATION_PROMPTS.md`.

Task:
Build only the Student mentor-and-schedule frontend. Provide assigned mentor profile, expertise/contact
boundaries, upcoming/past session agenda, session detail, and no-mentor/no-schedule states. Do not implement
mentor directory browsing beyond the assigned mentor or real scheduling mutations.

Do not expand beyond this slice. At the end, run lint/build, provide the required review report, and STOP for product-owner review.
```
---
## FE-SLICE-029 — Extracurricular Registration

**Role:** Student

```text
You are working in the SAKODE Academic System repository.

Selected slice: FE-SLICE-029 — Extracurricular Registration
Role scope: Student

Follow the Global Execution Contract in `AI docs/FEATURE_IMPLEMENTATION_PROMPTS.md`.

Task:
Build only the Student extracurricular frontend. Provide available organization/program cards, filters if
justified, detail view, registration interaction prototype, current registration status,
duplicate/closed/approval-pending mock states, and clear notices where quota/approval rules remain TBD. Do not
implement Admin or Principal screens.

Do not expand beyond this slice. At the end, run lint/build, provide the required review report, and STOP for product-owner review.
```
---
## FE-SLICE-030 — Read-Only Principal Overview

**Role:** School Principal

```text
You are working in the SAKODE Academic System repository.

Selected slice: FE-SLICE-030 — Read-Only Principal Overview
Role scope: School Principal

Follow the Global Execution Contract in `AI docs/FEATURE_IMPLEMENTATION_PROMPTS.md`.

Task:
Build only the School Principal overview. Clearly show organization scope, read-only status, extracurricular
summary, participant counts/aggregates, program health, and relevant notices. Do not expose
edit/approve/schedule controls. Use a prominent but non-intrusive `ReadOnlyScopeNotice`. Do not build detailed
reports yet.

Do not expand beyond this slice. At the end, run lint/build, provide the required review report, and STOP for product-owner review.
```
---
## FE-SLICE-031 — Extracurricular Information and Reports

**Role:** School Principal

```text
You are working in the SAKODE Academic System repository.

Selected slice: FE-SLICE-031 — Extracurricular Information and Reports
Role scope: School Principal

Follow the Global Execution Contract in `AI docs/FEATURE_IMPLEMENTATION_PROMPTS.md`.

Task:
Build only the School Principal extracurricular information/report frontend. Provide scoped
organization/program filters, aggregate metrics, participant list only to the privacy level represented by
fixtures, status breakdown, date filtering, export button as a nonfunctional prototype if useful, and clear
no-access/empty/loading/error states. There must be no write affordance or hidden edit route.

Do not expand beyond this slice. At the end, run lint/build, provide the required review report, and STOP for product-owner review.
```
---
## FE-SLICE-032 — Responsive and Accessibility Regression

**Role:** Shared

```text
You are working in the SAKODE Academic System repository.

Selected slice: FE-SLICE-032 — Responsive and Accessibility Regression
Role scope: Shared

Follow the Global Execution Contract in `AI docs/FEATURE_IMPLEMENTATION_PROMPTS.md`.

Task:
Perform a cross-role frontend regression only after the owner confirms the target set of approved slices. Fix
responsive layout, keyboard navigation, focus management, labels, contrast, table overflow, mobile drawers,
and reduced-motion issues. Do not redesign approved features or add new business functionality. Report every
route checked and any unresolved issue.

Do not expand beyond this slice. At the end, run lint/build, provide the required review report, and STOP for product-owner review.
```
---
## FE-SLICE-033 — Stakeholder Showcase Readiness

**Role:** Shared

```text
You are working in the SAKODE Academic System repository.

Selected slice: FE-SLICE-033 — Stakeholder Showcase Readiness
Role scope: Shared

Follow the Global Execution Contract in `AI docs/FEATURE_IMPLEMENTATION_PROMPTS.md`.

Task:
Prepare only the approved frontend slices for stakeholder showcase. Curate coherent demo fixtures, ensure
quick-login role switching, verify FAB style/palette presets, remove obvious placeholder copy while retaining
clear mock labels, and create a concise walkthrough order. Do not add features, backend, or unapproved
business rules. Report the final demo paths and talking points.

Do not expand beyond this slice. At the end, run lint/build, provide the required review report, and STOP for product-owner review.
```

---
## FE-SLICE-034 — Referrer Partnership Portal End-to-End Review

**Role:** Referrer / Cross-role

```text
You are working in the SAKODE Academic System repository.

Selected slice: FE-SLICE-034 — Referrer Partnership Portal End-to-End Review
Role scope: Referrer and all non-admin roles

Follow the Global Execution Contract in `AI docs/FEATURE_IMPLEMENTATION_PROMPTS.md`.

Context:
- Role `referrer` telah ditambahkan ke UserRole dan AuthContext mock.
- Landing page publik tersedia di `/referral` dengan leaderboard, aturan pencairan, kode etik mitra, tata cara, dan formulir pendaftaran mitra.
- Dashboard referrer menampilkan ReferrerWidget (statistik, link rujukan, log konversi, riwayat transfer).
- Header non-admin menampilkan switcher role dinamis: Daftar Referrer, Portal Referrer, Portal Utama, atau Ke Beranda.

Business rules confirmed:
1. Self-referral DIPERBOLEHKAN — komisi dihitung setelah pembayaran terverifikasi.
2. Tidak ada batas minimal pencairan (no threshold).
3. Jika tidak dicairkan, saldo akumulasi ke bulan berikutnya.
4. Tanggal pencairan bervariasi per program (umumnya 25-30/31 setiap bulan).
5. Komisi satuan per rujukan berbeda-beda di setiap program.
6. Biaya administrasi transfer ditanggung penerima.
7. Multi-role: dual-role (akademik + referrer) → masuk portal utama dahulu, header tampilkan Portal Referrer switcher. Pure referrer → langsung ke portal referrer, header tampilkan Ke Beranda.

Task:
Review dan polish semua komponen terkait Referrer Partnership Portal:
- Verifikasi `/referral` landing page: leaderboard, payout rules, ethics rules, how-to steps, registration form.
- Verifikasi ReferrerWidget di `/dashboard` saat role aktif adalah `referrer`.
- Verifikasi Header switcher logic untuk semua skenario role.
- Pastikan `/register` hanya untuk murid; banner mengarah ke `/referral`.
- Quick login pada `/login` menampilkan Referrer Account dan Kepala Sekolah berjejer.
- Uji semua visual styles/colors melalui FAB; tidak ada style yang merusak flow.
- Uji light/dark mode.

Do not expand beyond this slice. At the end, run lint/build, provide the required review report, and STOP for product-owner review.
```

---
