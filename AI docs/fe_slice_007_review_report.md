# SAKODE Academic System — Review Report (FE-SLICE-007)

**Feature Slice:** FE-SLICE-007 — Public Package Enrollment and Referral-Link Prefill  
**Role:** Public / Prospective Student  
**Visual Style:** `sakode-modern` (default) with style switcher support

---

## 1. Summary of Changes

We implemented the package selection and enrollment flow as a dedicated multi-step registration stage at the `/register/enroll` route. This route catches the preserved acquisition query params (`program` and `ref`), preselects the program details, visibly fills out referral code parameters, supports separate promo/discount calculations, and provides alerts for price adjustments or closed registration deadlines.

### Files Created
- **Created:**
  - [page.tsx](file:///C:/Users/yogaa/Document%20Local/SAKODE/WEB%20DEVELOP/sakode-academy/app/(auth)/register/enroll/page.tsx): Main enrollment step interface using Suspense, React State, and dynamic UI styling context.

---

## 2. Technical Features & Layout Structure

1. **Routing and URL Contract**:
   - Route path: `/register/enroll`
   - Accepts parameters: `?program=<slug>&ref=<code>`
2. **Accessibility & Semantics**:
   - Outfitted both `<select>` elements with explicit `title` and `aria-label` tags, guaranteeing Deque Axe accessibility compatibility.
3. **Mandatory Package Selector**:
   - The preselected package is resolved from the query parameters using `PackageMockService`.
   - Calon murid can change the package via a styled dropdown list. Changing the package automatically recalculates metrics (pricing, currency, mentoring sessions, and description).
4. **Separate Inputs & Mock Validators**:
   - **Referral Code Input**: Visibly prefilled from the URL parameter. Validated using `validateReferral`:
     - `MANDIRI` / `AKBAR-PROMO` / `SUDARSONO`: *Atribusi kemitraan aktif.*
     - `EXPIRED`: *Kode referral sudah kedaluwarsa.*
     - Any other input: *Kode referral tidak valid atau tidak ditemukan.*
   - **Promo Code Input**: Validated using `validatePromo`:
     - `DISKON10`: *Diskon 10%*
     - `PROMO50`: *Diskon 50%*
     - `POTONGAN100K`: *Potongan harga Rp 100.000*
5. **Billing Summary & Attribution Notice**:
   - Renders a clean receipt card showing:
     - Original price.
     - Discount subtraction line (in green) if a promo is valid.
     - Final price calculated and formatted.
     - Scoped referral notice: *"Atribusi: <CODE>"* with a clarification warning: *"Catatan: Kode kemitraan digunakan untuk pencatatan rujukan eksternal dan tidak memberikan potongan harga langsung pada paket ini."* (avoids implying discounts are tied to referral attribution).

---

## 3. Demo Scenario Triggers

Reviewers can use the **Reviewer Scenario Panel** dropdown at the top to test these edge cases:
- **`normal` (Normal)**: Preselects React & Next.js Professional and sets referral code to `MANDIRI`.
- **`promo_applied` (Promo)**: Auto-applies `PROMO50` giving a 50% discount on the total.
- **`invalid_referral` (Invalid Ref)**: Simulates an invalid referral link showing an error warning.
- **`expired_referral` (Expired Ref)**: Simulates an expired referral link showing a warning.
- **`unknown_package` (Unknown Pkg)**: Inbound slug is missing or not found. Prompt asks to choose a package.
- **`closed_package` (Closed Pkg)**: Selected package registration date is expired, disabling the CTA and showing a warning.
- **`changed_price` (Price Change)**: Triggers a warning: *"Terdapat penyesuaian biaya program ini..."* requiring reconfirmation from the user.

---

## 4. UI Style Presets Support (FAB Regression Check)

The layout uses a split grid (Form/Inputs left, receipt card right). Both columns, inputs, select boxes, alert wrappers, and toggles respond dynamically to the active `StyleSwitcherFAB` presets (Modern, Bento, Neobrutalism, Claymorphism, etc.).

---

## 5. Verification & Build Results

- **Lint:** Checked `npm run lint` successfully with 0 errors in the created directory.
- **Build:** Checked `npm run build` successfully with static page generation of `/register/enroll` complete.

---

## 6. Manual Review Checklist
- [x] Access `/register/enroll` on desktop/tablet/mobile.
- [x] Switch between test scenarios in the Reviewer Scenario Panel.
- [x] Apply a valid promo (e.g. `DISKON10` or `PROMO50`) and check final price calculations.
- [x] Try changing the selected package to update the curriculum metrics.
- [x] Verify that submitting redirect to `/login?registered=true`.
