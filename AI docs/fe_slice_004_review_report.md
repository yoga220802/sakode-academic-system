# SAKODE Academic System — Review Report (FE-SLICE-004)

**Feature Slice:** FE-SLICE-004 — Public Landing Package Catalog and Pricing  
**Scope:** Public  
**Visual Style:** `sakode-modern` (default) with style switcher support

---

## 1. Summary of Changes

We replaced the static landing page countdown block with a fully interactive public package catalog experience. This catalog presents published academic program fixtures, detailed outcomes, prices/currencies, registration periods, and collapsible module curriculums.

### Files Created & Changed
- **Created:**
  - [app/_types/package.ts](file:///C:/Users/yogaa/Document%20Local/SAKODE/WEB%20DEVELOP/sakode-academy/app/_types/package.ts): Type definitions for `PackageViewModel` and `LearningModuleViewModel`.
  - [app/_services/package-mock.ts](file:///C:/Users/yogaa/Document%20Local/SAKODE/WEB%20DEVELOP/sakode-academy/app/_services/package-mock.ts): Simulated asynchronous mock service supporting 6 development review scenarios.
  - [app/_components/ModulePreviewList.tsx](file:///C:/Users/yogaa/Document%20Local/SAKODE/WEB%20DEVELOP/sakode-academy/app/_components/ModulePreviewList.tsx): Collapsible layout for module topics and session/duration info.
  - [app/_components/PackageCard.tsx](file:///C:/Users/yogaa/Document%20Local/SAKODE/WEB%20DEVELOP/sakode-academy/app/_components/PackageCard.tsx): Styled card displaying program details, pricing, registration timing, and CTA.
  - [app/_components/PublicPackageCatalog.tsx](file:///C:/Users/yogaa/Document%20Local/SAKODE/WEB%20DEVELOP/sakode-academy/app/_components/PublicPackageCatalog.tsx): Parent catalog orchestrating fetching, comparison table view, and scenario selection.
- **Modified:**
  - [app/_components/WelcomePage.tsx](file:///C:/Users/yogaa/Document%20Local/SAKODE/WEB%20DEVELOP/sakode-academy/app/_components/WelcomePage.tsx): Replaced the countdown widget with the `<PublicPackageCatalog />` and cleaned up unused timer code.

---

## 2. Reusable & Domain Components Added

1. **`PublicPackageCatalog`**:
   - Orchestrates the state machine for the catalog.
   - Embeds a **Reviewer Control Panel** to let stakeholders easily switch between visual fixture states.
   - Includes a collapsible **Program Comparison Table** showing side-by-side details (outcome, price, duration, live mentoring sessions, and core topics).
2. **`PackageCard`**:
   - Adapts styling for *Featured* packages.
   - Formats prices in IDR.
   - Handles inactive states for closed registration and missing prices.
3. **`ModulePreviewList`**:
   - Provides a clean accordion layout showing sessions, duration, and key curriculum topics.

---

## 3. Demo Fixture Scenarios

To enable stakeholder reviews, the **Reviewer Control Panel** dropdown offers these instant scenario presets:
- **`normal` (Normal)**: Shows all published academic packages with prices and active registration periods.
- **`loading` (Loading)**: Displays skeleton loading cards using `DataStateBoundary` & `SkeletonCard`.
- **`empty` (Empty)**: Displays the standard custom empty state illustration.
- **`partial-error` (Error)**: Simulates an API network failure with a visual warning banner.
- **`missing-price` (Price TBD)**: Demonstrates a package with `price: null` (TypeScript & Data Structures) where price displays as TBD and CTA points to contact admin.
- **`closed-registration` (Expired)**: Demonstrates an expired registration period (React & Next.js Professional) with badge and disabled CTA.

---

## 4. UI Style Presets Support (FAB Regression Check)

When switching UI styles via the `StyleSwitcherFAB`:
- **`sakode-modern`**: Clean layouts, high-contrast borders, rounded cards.
- **`neobrutalism`**: Flat backgrounds, thick borders, sharp shadows, and monospace fonts.
- **`claymorphism`**: Glassy reflections, soft inset shadows, and rounded container rings.
- **`glassmorphism` & `liquid-glass`**: Semi-transparent card styling with backdrop blur.
- All styles adapt perfectly and do not reset the selected mock/scenario state.

---

## 5. Responsive Behavior

- **Mobile (<768px)**: 
  - Cards stack vertically in 1 column.
  - The comparison table scrolls horizontally with a clear visual helper.
  - Interactive accordion trigger areas expand for touch ease.
- **Tablet (768px - 1024px)**: 
  - Catalog adapts into 2 columns.
- **Desktop (>1024px)**: 
  - Grid extends to 3 columns.

---

## 6. Verification & Build Results

- **Lint:** Ran `npm run lint` successfully with 0 errors.
- **Build:** Ran `npm run build` successfully with Next.js Turbopack compiling page data and routes cleanly.

---

## 7. Known Limitations & Next Steps
- The CTA passes the slug in query format `?program=<slug>` to `/register` but does not initiate signup or persist data yet (this is deferred to `FE-SLICE-006` / `FE-SLICE-007`).

---

## 8. Manual Review Checklist
- [x] Check default `sakode-modern` visual style on landing page.
- [x] Switch style presets using Style Switcher FAB.
- [x] Toggle different scenarios in the Reviewer Control Panel.
- [x] Click **Bandingkan Program** to test comparison layout.
- [x] Click **Daftar Sekarang** to verify redirection query parameter structure.
