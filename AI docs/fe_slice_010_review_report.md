# SAKODE Academic System — Review Report (FE-SLICE-010)

**Feature Slice:** FE-SLICE-010 — Admin Referral Program & Referrer Account Management  
**Role:** Admin  
**Visual Style:** Dynamic style presets (Default, Bento Grid, Neobrutalism, Claymorphism, Glassmorphism, Minimalism)

---

## 1. Scope & Accomplished Work

We have fully designed and implemented the frontend workspaces for Admin Referral Management under two main sub-routes:

### A. Referral Campaigns Dashboard (`/referrals`)
- **Split-Screen Workspace Layout**:
  - **Left column**: Filterable and searchable list of active/expired referral program campaigns.
  - **Right column**: Detailed campaign control panel showing target bootcamp metadata, active periods, status triggers, associated codes, canonical links, and registration attribution logs.
- **Program-Level Payout Date Windows**:
  - Added **Tanggal Mulai Payout** and **Tanggal Selesai Payout** settings to each campaign program configuration.
  - Admin can adjust this payout date range when creating a new program.
- **Form Shell Modals**:
  - **Tambah Program**: Configures program name, campaign context, target bootcamp, active period, and the monthly payout date range.
  - **Tambah Kode**: Generates alphanumeric codes, inputs referrers, and sets usage caps.
  - **Koreksi Atribusi**: Corrects student registration referral attribution in case of typos.

### B. Referrer Accounts Dashboard (`/referrals/accounts`)
- **Tab-Based Navigation**: Added a smooth horizontal tab header to switch instantly between *Kampanye Rujukan* (`/referrals`) and *Akun Pemilik Referral* (`/referrals/accounts`).
- **Sub-Tab Navigation**:
  - **Daftar Profil & Kode**: View and CRUD referrers profile info, bank account payout, and associate codes.
  - **Antrean Payout & Batch**: A consolidated table summarizing all pending payouts across all accounts in a single batch list.
- **Program-Wide Date-Restricted Constraints**:
  - All payouts are evaluated based on their source program campaign dates (instead of individual referrer settings).
  - Implemented boundary-crossing date checking logic (`checkIsDateAllowed`) that correctly handles ranges spanning across months (e.g. 30th to 1st, allowing day 30, 31, and 1).
  - Row checkboxes and "Proses" buttons are disabled automatically if the simulated date falls outside that specific program's designated window.
- **Interactive Calendar Simulator & Legend**:
  - Added a visual slider above the Payout batch queue: *"Simulator Sistem Tanggal Pencairan (Hari ke-1 s/d 31)"*.
  - Added a **Program Payout Legend** directly below the simulator slider displaying all active programs and their configured payout schedules for instant Admin reference.
  - Displays a program-by-program payout window status directly on the referrer profile details page under "Status Tanggal Payout per Program Terasosiasi".
- **Bulk Payout & Batch Processing (Opsi 2)**:
  - **Batch Payout Rule**: Configured to process payouts in a monthly batch (e.g. every 25th of the month) to prevent Admin overload.
  - **Bulk Accept checkboxes**: Includes a header select-all checkbox and row-level checkboxes.
  - **Setujui Terpilih (Bulk Accept Button)**: Triggers a confirmation modal to process all checked payouts in one batch action.
- **Program-Level Payout Filter**:
  - Added a dropdown selector above the batch payouts table to filter pending cashouts by specific campaign program.
  - Added program metadata directly on the queue row table.
- **Preset-Aware Non-Generic Tables**:
  - The batch queue table, headers, cell borders, cell alignment, and checkboxes dynamically change visual styles to match the active visual preset (Neobrutalism uses thick double black borders with sharp checkboxes, Claymorphism uses soft borderless rounded pills, Glassmorphism uses translucent backdrops, Bento Grid uses clean boxes, and Minimalism uses thin borders).
- **Claymorphism Dark Mode Contrast Adjustments**:
  - Restyled the table container in Claymorphism style from transparent/invalid gray to high-contrast opaque `dark:bg-zinc-900/95` background.
  - Increased header and cell font contrast to `text-zinc-700 dark:text-zinc-200` to prevent washed-out text overlapping in dark mode.
- **Action & Management Modals**:
  - **Tambah Akun Referrer**: Form to register new referrers with payout destination (supports Bank BCA, Mandiri, BNI, BRI, GoPay, OVO). Date range inputs are removed for a cleaner profiles interface.
  - **Ubah Akun (Edit Profile)**: Pre-fills and updates referrer profile and bank accounts.
  - **Hapus Akun**: Confirmative warning dialog to clean up referrer memberships safely.
  - **Asosiasi Kode Referral**: Lets Admin register a new referral code directly under this owner, mapping it to a target campaign program.
  - **Proses Payout**: Allows the Admin to approve/reject pending payout requests, log bank reference codes, and automatically deduct from pending balances.
  - **Bulk Approval Modal**: Confirms total amount and transaction counts before finalizing.
- **Contrast & Button Enhancements**:
  - Replaced low-contrast inline text link buttons ("Proses" button with light cyan color on light gray background) with solid preset primary buttons (`variant="primary"`). This ensures they render as solid colored buttons with high contrast text (e.g., black text on a cyan background, or white text on a blue background).
  - Upgraded "Hubungkan Kode Baru" to use preset `variant="secondary"` buttons for better visual balance.

---

## 2. Interactive Fixture Scenarios

1. **Default**: Populates referral programs, active codes, referrer profiles, and pending payouts.
2. **Loading**: Simulates list query delays via animated pulse skeletons.
3. **Empty**: Shows clear empty folder placeholders when query databases are cleared.
4. **Error**: Simulates connection failures with retry buttons.

---

## 3. Responsive Support

- **Desktop (>=1024px)**: Uses side-by-side double panels for quick visual context reading.
- **Mobile/Tablet (<1024px)**: Single column stacked layout. Tapping a card scrolls down to place the detail control panels below the search listing.

---

## 4. Verification & Build Results

- **Lint:** Checked `npm run lint` successfully with 0 errors in the workspace.
- **Build:** Checked `npm run build` successfully with Next.js Turbopack type checking passing.
- **Dynamic Theme Presets:** Checked light/dark modes and visual presets. The input fields, dropdown select pickers, headers, cards, and buttons dynamically morph according to the active theme context.
- **Accessibility Fixes:** Fixed Edge Tools Axe warnings by adding title and aria-labels to close buttons.
- **Tailwind Canonical Optimization:** Rewrote raw widths like `max-w-[120px]` into standard classes like `max-w-30` as recommended by Tailwind Intellisense.
- **Static Variable Optimization:** Extracted `MOCK_PROGRAMS` outside React component loop to fix dependency-tracking hook warning.
