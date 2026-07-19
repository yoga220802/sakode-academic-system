# SAKODE Academic System — Frontend Implementation Plan

**Version:** 0.9  
**Active mode:** Frontend-only, incremental review  
**Default visual style:** `sakode-modern`

## 1. Goal

Build the frontend as a sequence of small, reviewable slices. Each slice covers one feature for one role, provides realistic interaction states through typed fixtures, and stops before another slice begins.

This phase does not implement Better Auth, Drizzle ORM, MySQL migrations, real Server Actions, Route Handlers, or integration APIs.

## 2. Product Experience Direction

The base layout may take inspiration from TailAdmin’s dashboard information architecture: persistent/collapsible navigation, a clear header, compact metrics, data panels, filters, and responsive content. The result must still feel like SAKODE, not a copied admin template.

### Required qualities

- Comfortable information density.
- Clear hierarchy between page title, primary actions, summary, filters, and detailed content.
- Distinct role identity without creating a completely different design system per role.
- Responsive behavior that preserves task completion, not merely visual shrinkage.
- Useful motion only for state change and orientation.
- Human, specific Indonesian copy instead of generic dashboard filler.

### Avoid

- Excessive gradient, glow, glass, and floating decorations.
- Every section using the same rounded card size.
- Decorative 3D objects unrelated to the task.
- Generic “Welcome back, manage everything” copy.
- Huge hero blocks inside operational dashboards.
- Unnecessary charts where a number, list, or progress indicator is clearer.
- Hiding critical actions in hover-only interactions.

## 3. App Shell Direction

### Desktop

- Collapsible sidebar with grouped navigation and clear active state.
- Header with page context, optional search, notifications placeholder, theme control, and user menu.
- Content container that can support full-width data tables and narrower form/detail pages.
- Page header composed of breadcrumbs, title, supporting text, and one clear primary action.

### Tablet

- Narrow/collapsed sidebar or overlay drawer.
- Filters may move into a drawer/sheet.
- Summary cards can become a horizontal scroll or two-column grid.

### Mobile

- Drawer navigation.
- Primary action remains reachable.
- Tables transform into horizontal scroll with pinned identity column or task-specific cards.
- Long forms use sections/stepper and persistent progress, not one dense screen.

## 4. UI Style and Showcase Rules

- `sakode-modern` is the default and receives the most polished treatment.
- `StyleSwitcherFAB` remains active throughout development and stakeholder showcase.
- Switching style or palette must not change data, permission, navigation, or feature state.
- All new reusable primitives must support light/dark mode and all seven visual namespaces.
- A style may be visually expressive, but information hierarchy and accessibility must remain stable.
- Production visibility of the FAB is a later product decision.
- **Typography & Font Weight Guidelines**: Nunito is the default sans-serif font family. General `h1` headings default to Nunito, whereas the Kalam font is strictly limited to elements using the `.font-kalam` class. To prevent visual fatigue, do not overuse `font-black` or `font-extrabold`; represent active sidebar navigation menu links in `font-bold` and inactive items in `font-medium`.
- **Admin Dashboard Spacing**: Use `gap-10` spacing between major layout panels to maintain clean, airy margins. No header icons are present on KPI metrics cards.
- **Quick Action Row**: "Aksi Cepat Admin" is located directly below the top KPI card grid. First quick action is "Tambah Referral" using the `Gift` icon.
- **Pending review cards**: Align with `admin_review_card.png` format (Name next to purple referral badge, program title subtext, horizontal divider line, and outlined Review button next to date).
- **Dark Mode Palette**: Keep background value as `--background: #1c253b` (slate-blue). Do not use low-contrast grays (such as `dark:text-zinc-550` or `dark:text-zinc-500`) for text overlays; instead, use highly readable colors (like `dark:text-zinc-400`, `dark:text-zinc-350`, and `dark:text-zinc-200`).

## 5. Component Strategy

### Layer A — Cross-style primitives in `UI/`

Use for visual primitives reused across multiple modules. Existing primitives should be preferred. Candidate additions, only when demanded by a slice:

- `Tabs`
- `PageHeader`
- `StatCard`
- `EmptyState`
- `Skeleton`
- `Pagination`
- `Drawer`
- `Dialog` / `ConfirmDialog`
- `Stepper`
- `Tooltip`
- `Progress`
- `DateField` or schedule-specific input primitive

A primitive addition requires:

1. Implementation in all seven namespaces.
2. Export update.
3. Dynamic type update.
4. `/ui` showcase update.
5. Accessibility labels and keyboard behavior.
6. Regression check with FAB and light/dark mode.

### Layer B — Shared application composites

Composed from primitives and reused across role screens:

- `DashboardPageHeader`
- `MetricSummaryGrid`
- `FilterToolbar`
- `DataStateBoundary`
- `ResponsiveDataList`
- `StatusTimeline`
- `ActivityFeed`
- `ScheduleAgenda`
- `ProfileSummary`
- `ReadOnlyScopeNotice`

### Layer C — Feature/domain components

Colocated with the route and specific to one workflow:

- `StudentRegistrationReviewPanel`
- `PromoValidationSummary`
- `ReferralProgramWorkspace`
- `ReferralLinkSharePanel`
- `ReferralAttributionSummary`
- `PublicPackageCatalog`
- `PackageEnrollmentSummary`
- `MentorPlottingWorkspace`
- `ExtracurricularOrganizationProfile`
- `PrincipalExtracurricularReport`

Domain components are not duplicated across all style namespaces. They resolve and compose active primitives.

## 6. Typed Fixture Architecture

Recommended frontend-only structure:

```text
app/
├── _mocks/
├── _types/                    # auth.ts berisi UserRole termasuk 'referrer'
├── _components/               # AuthContext, UIStyleContext, global shared
├── (auth)/                    # Login, register (khusus murid)
│   ├── login/
│   └── register/
├── (portal)/                  # Layout bersama: sidebar + header untuk semua role
│   ├── _components/           # Header.tsx (role switcher), Sidebar.tsx, ReferrerWidget.tsx
│   ├── dashboard/             # Dashboard utama (menampilkan widget sesuai role)
│   ├── (admin)/               # Fitur-fitur Admin
│   ├── (mentor)/              # Fitur Mentor & Mentor Lead (digabung)
│   │   ├── my-students/
│   │   ├── grading/
│   │   ├── schedules/
│   │   ├── plotting-queue/    # Mentor Lead only
│   │   └── schedules-lead/   # Mentor Lead only
│   ├── (student)/             # Fitur Murid
│   ├── (school)/              # Fitur Kepala Sekolah
│   └── (referrer)/            # Fitur Mitra Referrer (riwayat konversi, pencairan)
├── referral/                  # Landing page publik program kemitraan referrer
└── (public)/                  # Katalog paket, enrollment publik
```

The exact folder may be adjusted to existing conventions. Rules:

- Fixtures represent view models, not database rows.
- A mock service exposes asynchronous functions so loading/error behavior can be demonstrated.
- Scenario selection can be controlled locally for development but should not clutter production-facing UI.
- Page components do not own large hardcoded datasets.
- Future server services should be able to replace mock services with minimal component changes.
- `app/(portal)/_components/Header.tsx` mengelola role switcher dinamis: **Daftar Referrer** & **Portal Referrer** untuk role non-referrer, **Portal Utama** (jika `sakode-original-role` di localStorage ada) atau **Ke Beranda** (jika pure referrer) saat mode referrer aktif. Admin tidak melihat tombol ini.

## 7. Review Workflow

1. Owner chooses one `FE-SLICE-*`.
2. Agent restates the selected scope in its work report, not as a new question unless ambiguous.
3. Agent inspects existing components/routes.
4. Agent implements only the selected slice.
5. Agent checks default modern style, FAB variants, light/dark mode, and responsive behavior.
6. Agent runs lint and build.
7. Agent reports:
   - files changed;
   - reusable components added;
   - fixture scenarios;
   - interaction states;
   - responsive behavior;
   - lint/build result;
   - known limitations;
   - manual review checklist.
8. Agent stops at **Ready for Review**.
9. Owner either requests revision or approves and selects the next slice.

## 8. Slice Catalog

| Slice | Role | Deliverable |
|---|---|---|
| FE-SLICE-001 | Shared | Responsive app shell and role navigation |
| FE-SLICE-002 | Shared | Reusable application components and fixture conventions |
| FE-SLICE-003 | Shared | FAB/style/light-dark regression |
| FE-SLICE-004 | Public | Landing package catalog, pricing, and module preview |
| FE-SLICE-005 | Public | Login UI |
| FE-SLICE-006 | Public | Account registration and acquisition-context preservation |
| FE-SLICE-007 | Public | Required package enrollment and referral-link prefill |
| FE-SLICE-008 | Admin | Overview dashboard |
| FE-SLICE-009 | Admin | Student registration review |
| FE-SLICE-010 | Admin | Referral program, URL-safe code, share link, and attribution management |
| FE-SLICE-011 | Admin | Trial management |
| FE-SLICE-012 | Admin | Programs, public pricing, and modules |
| FE-SLICE-013 | Admin | Mentor directory |
| FE-SLICE-014 | Admin | Mentor plotting |
| FE-SLICE-015 | Admin | Mentor scheduling |
| FE-SLICE-016 | Admin | Extracurricular organization management |
| FE-SLICE-017 | Admin | Principal membership/read scope setup |
| FE-SLICE-018 | Mentor Lead | Overview dashboard |
| FE-SLICE-019 | Mentor Lead | Plotting queue |
| FE-SLICE-020 | Mentor Lead | Schedule management |
| FE-SLICE-021 | Mentor | Overview dashboard |
| FE-SLICE-022 | Mentor | Assigned students |
| FE-SLICE-023 | Mentor | Personal schedule |
| FE-SLICE-024 | Student | Overview dashboard |
| FE-SLICE-025 | Student | Registration, selected package/price, promo, and referral status |
| FE-SLICE-026 | Student | Trial registration/status |
| FE-SLICE-027 | Student | Learning modules |
| FE-SLICE-028 | Student | Mentor and schedule |
| FE-SLICE-029 | Student | Extracurricular registration |
| FE-SLICE-030 | School Principal | Read-only overview |
| FE-SLICE-031 | School Principal | Extracurricular information and reports |
| FE-SLICE-032 | Shared | Responsive and accessibility regression |
| FE-SLICE-033 | Shared | Stakeholder showcase readiness |


### Sequential numbering note

The 33 frontend slices are numbered sequentially according to their recommended execution order. Run them from `FE-SLICE-001` through `FE-SLICE-033`, one slice per agent session and one review gate at a time.

### v0.5 → v0.6 renumbering reference

The feature scope did not change. Only the identifiers and prompt order were normalized.

| Previous ID | Current ID | Slice |
|---|---|---|
| FE-SLICE-032 | FE-SLICE-004 | Public package catalog and pricing |
| FE-SLICE-004 | FE-SLICE-005 | Login frontend |
| FE-SLICE-005 | FE-SLICE-006 | Account registration and acquisition-context preservation |
| FE-SLICE-033 | FE-SLICE-007 | Package enrollment and referral-link prefill |
| FE-SLICE-006 | FE-SLICE-008 | Admin overview |
| FE-SLICE-007 | FE-SLICE-009 | Admin student registration review |
| FE-SLICE-031 | FE-SLICE-010 | Admin referral program management |
| FE-SLICE-008–014 | FE-SLICE-011–017 | Remaining Admin slices |
| FE-SLICE-015–017 | FE-SLICE-018–020 | Mentor Lead slices |
| FE-SLICE-018–020 | FE-SLICE-021–023 | Mentor slices |
| FE-SLICE-021–026 | FE-SLICE-024–029 | Student slices |
| FE-SLICE-027–028 | FE-SLICE-030–031 | School Principal slices |
| FE-SLICE-029–030 | FE-SLICE-032–033 | Final regression and showcase |

## 9. Definition of Ready for Review

- Only the selected slice changed, except necessary shared component work.
- The feature can be demonstrated without a real backend.
- For public acquisition slices, package price/module data, URL query context, referral prefill, invalid link, missing package, and changed-price scenarios are demonstrable through typed fixtures.
- Normal, loading, empty, and error states are available where relevant.
- Read-only/permission boundaries are visible in the UI where relevant.
- The modern default looks finished and intentional.
- FAB style and color switching does not break task completion.
- Desktop, tablet, and mobile are usable.
- Lint/build results are included.
- The agent has stopped and has not started the next slice.
