# FE-SLICE-016 — Admin Extracurricular Organization Management Review Report (New Page, Proxy, & Dropdown Stacking Fix)

## 1. Scope and Accomplishments
Refactored the **Admin Extracurricular Organization Management Workspace** to replace dense modals with dedicated spacious pages, integrate a secure server-side regional address proxy API, and implement a searchable country code phone input:

- **Dedicated Form Pages**:
  - Replaced the dense add/edit modals with dedicated routes `/extracurriculars-admin/new` (for registering a new partnership) and `/extracurriculars-admin/[id]/edit` (for updating details).
  - Designed spacious form layouts containing separate card panels for basic school details, Indonesian administrative addresses, Guru Pendamping contacts, and MoU uploads.
- **Server-Side API Proxy (`/api/wilayah`)**:
  - Implemented a server-side route `app/api/wilayah/route.ts` that proxies queries to `emsifa.github.io` on the server-side.
  - Bypasses browser CORS blocks and Referrer Policy blocks completely.
- **Searchable Country Code Phone Input (`PhoneInput`)**:
  - Created a custom reusable component featuring a searchable country code dropdown (fetched from `restcountries.com` with robust local fallback for stability).
  - Normalizes user phone inputs by stripping leading `0` or `62` automatically when pasted/typed (e.g. `0812...` becomes `812...`).
- **Stacking Order Fix (Z-Index blocking)**:
  - Resolved the bug where the WhatsApp dropdown list was painted behind the subsequent "MoU Dokumen Kerja Sama" card section.
  - Applied `relative focus-within:z-30 transition-all` to the form cards, so that the card currently containing active user interaction is promoted to the top of the stacking order dynamically.
- **Compile & Lint Verification**: Completed build (`npm run build`) and lint (`npm run lint`) checks successfully with **0 errors and 0 warnings** in modified workspace paths.

---

## 2. Files Modified / Created
*   [SearchableSelect.tsx](file:///C:/Users/yogaa/Document%20Local/SAKODE/WEB%20DEVELOP/sakode-academy/app/%28admin%29/extracurriculars-admin/_components/SearchableSelect.tsx) — Custom select dropdown.
*   [PhoneInput.tsx](file:///C:/Users/yogaa/Document%20Local/SAKODE/WEB%20DEVELOP/sakode-academy/app/%28admin%29/extracurriculars-admin/_components/PhoneInput.tsx) — Reusable phone input with country code dropdown.
*   [route.ts](file:///C:/Users/yogaa/Document%20Local/SAKODE/WEB%20DEVELOP/sakode-academy/app/api/wilayah/route.ts) — Server-side API proxy endpoint.
*   [page.tsx](file:///C:/Users/yogaa/Document%20Local/SAKODE/WEB%20DEVELOP/sakode-academy/app/%28admin%29/extracurriculars-admin/page.tsx) — Main dashboard.
*   [page.tsx](file:///C:/Users/yogaa/Document%20Local/SAKODE/WEB%20DEVELOP/sakode-academy/app/%28admin%29/extracurriculars-admin/new/page.tsx) — Dedicated page for registering new partnerships.
*   [page.tsx](file:///C:/Users/yogaa/Document%20Local/SAKODE/WEB%20DEVELOP/sakode-academy/app/%28admin%29/extracurriculars-admin/%5Bid%5D/page.tsx) — Details page.
*   [page.tsx](file:///C:/Users/yogaa/Document%20Local/SAKODE/WEB%20DEVELOP/sakode-academy/app/%28admin%29/extracurriculars-admin/%5Bid%5D/edit/page.tsx) — Dedicated page for editing partnerships.

---

## 3. Reviewer Checklist
1. [ ] Navigate to **Organisasi Ekskul** on the sidebar (or visit `/extracurriculars-admin`).
2. [ ] Click **Daftar Ekskul Baru**:
   * Observe the redirect to the new page `/extracurriculars-admin/new`.
   * Click **No WhatsApp Guru** country selector. Search for a country (e.g. Malaysia) and verify it filters.
   * Type a local number with leading `0` and verify it strips the `0` automatically.
   * Click the dropdown and verify that the country dropdown paints on top of the "MoU" card below it (no clipping or occlusion).
   * Fill out the form and submit.
3. [ ] Click on the newly registered school to view details:
   * Verify redirect to `/extracurriculars-admin/[id]`.
   * Click **Ubah Detail Ekskul** to go to edit page, verify fields prefill and save works.
