# SAKODE Academic System — AI Agent Brief

**Version:** 0.9  
**Updated:** 9 July 2026  
**Repository baseline:** `sakode-academic-system-feat-referrer-portal`


## Project Goal

Bangun portal akademik fullstack SAKODE Academy untuk menampilkan katalog paket belajar dan harga, mengelola pendaftaran murid dengan pilihan paket wajib, promo dan referral link, trial, program dan modul pembelajaran, mentor, plotting, jadwal mentoring, serta program ekstrakurikuler. Sistem harus aman, modular, dan mempertahankan identitas visual SAKODE.

## Current Scope

The product scope remains the complete SAKODE Academic System, but the **active implementation scope is frontend only**.

### Active phase

- Build one feature for one role at a time.
- Use `sakode-modern` as the default visual style.
- Keep `StyleSwitcherFAB` active for stakeholder showcase and color/style comparison.
- Use typed fixtures/mock adapters to make screens interactive.
- Build complete UI states: default, loading, empty, error, disabled, confirmation, and success feedback as relevant.
- Stop after each slice for product-owner review.

### Explicitly deferred

- Better Auth production setup.
- Drizzle schema, Aiven connection, migrations, and seed execution.
- MySQL queries and transactions.
- Real Server Actions/Route Handlers.
- System Information integration endpoints.
- Cross-role end-to-end completion in one run.

The public-purpose Sistem Informasi remains outside product scope. Only an eventual, protected, versioned integration contract may connect both systems.

## Repository Reality Check

Snapshot saat ini adalah prototipe frontend sekitar fase awal:

- Next.js App Router sudah berjalan.
- Halaman `/login`, `/register`, dan `/dashboard` sudah tersedia.
- Role demo saat ini: `admin`, `mentor_lead` (digabung ke `mentor`), `mentor`, `murid`, `school_principal`, `referrer`.
- `AuthContext` menyimpan sesi mock di `localStorage` dan quick login menggunakan akun dummy.
- Widget dashboard memakai data hardcoded.
- Belum ada database MySQL/ORM production di dependency.
- Folder arsitektur database/service yang didokumentasikan belum seluruhnya tersedia.

Jangan menyebut UI mock sebagai implementasi backend selesai.

## Confirmed Features

1. Registrasi peserta didik.
2. Validasi promo jika promo digunakan.
3. Program referral pendaftaran: Admin mengelola program/kode/link dan memantau atribusi pendaftaran.
4. Referral share link yang memprefill referral secara transparan pada pendaftaran.
5. Landing page katalog paket yang menampilkan harga dan modul yang termasuk.
6. Pemilihan paket wajib pada pendaftaran murid.
7. Pendaftaran trial.
8. Informasi modul pembelajaran.
9. Informasi mentor.
10. Plotting mentor.
11. Penjadwalan mentor.
12. Panel Admin.
13. Panel Mentor Lead.
14. Panel Mentor.
15. Panel Murid.
16. Pendaftaran/pengelolaan organisasi ekskul.
17. Role Kepala Sekolah untuk akses informasi ekskul.
18. Kepala Sekolah read-only secara default.
19. Manajemen Direktori Pengguna, Aksi Reset Kata Sandi cepat ke default, dan Log Audit Sistem yang interaktif.

## User Roles and Access Boundaries

### Calon Murid

- Melihat paket, harga, dan module preview; membuka referral link; membuat akun; memilih paket wajib; mendaftar program/trial; menggunakan promo; dan meninjau referral yang diprefill.
- Tidak memiliki akses panel internal.

### Murid

- Melihat data sendiri, program/modul aktif, mentor, jadwal, status pendaftaran termasuk promo/referral, dan pendaftaran ekskul miliknya.
- Tidak boleh membaca data murid lain.

### Admin

- Mengelola proses akademik, katalog paket/harga, role/membership organisasi, pendaftaran, program/kode/link referral, atribusi referral, mentor, jadwal, dan ekskul sesuai permission.
- Semua aksi sensitif harus tervalidasi dan dapat ditelusuri.

### Mentor Lead

- Mengelola antrean plotting dan jadwal pada lingkup yang diberikan.
- Tidak mengelola role atau konfigurasi sistem kecuali permission eksplisit.

### Mentor

- Melihat assignment, murid yang ditugaskan, dan jadwal sendiri.
- Tidak mengakses assignment mentor lain.

### School Principal / Kepala Sekolah

- Melihat informasi dan laporan ekskul hanya untuk organisasi yang terhubung.
- Read-only: tidak create, update, approve, schedule, atau delete.
- Role tidak boleh otomatis memberikan akses ke semua sekolah; gunakan organization membership.

## Latest Requirement Update

1. Use a single Next.js project for frontend and backend.
2. Target **Better Auth** for production authentication.
3. Target **Drizzle ORM + `mysql2`** for MySQL persistence.
4. Use Zod for request/form contracts.
5. Work on **frontend only** until the owner explicitly opens a backend slice.
6. Default to `sakode-modern`.
7. Keep the style/color FAB alive during development and showcase.
8. Design a comfortable, modern, data-oriented dashboard inspired by TailAdmin’s information architecture, without cloning its template or producing generic template-like screens.
9. Reuse the custom `@/UI` system aggressively. Add reusable primitives when justified; build domain composites from those primitives.
10. Deliver exactly one feature-role slice, run validation, provide a review report, and stop.
11. Preserve extracurricular organization registration and School Principal read-only scope.
12. Keep public-purpose Sistem Informasi outside the application scope; integration APIs come later.
13. Add an Admin-managed referral registration program with referral-code administration and registration-attribution monitoring.
14. Keep referral distinct from promo; do not assume discount, commission, reward, or payout behavior until confirmed.
15. Add a dedicated frontend review slice `FE-SLICE-010` for Admin referral management and expose referral context in registration review/status fixtures.
16. Generate a canonical, copyable referral registration link for each active URL-safe code; do not embed PII or secrets.
17. When a referral link is opened, visibly prefill and preserve referral context through account/enrollment steps, then revalidate it on submit.
18. Add a focused public landing catalog for published packages/programs with price, currency, module preview, and registration CTA.
19. Require a package/program choice before enrollment submission; preserve preselection from the landing CTA and store a price snapshot in the future backend.
20. Add `FE-SLICE-004` for the public catalog and `FE-SLICE-007` for public package-enrollment/referral-prefill flow. There are now 33 frontend review slices.
21. **Visual Spacing & Layout**: Sections on the admin dashboard must use a spacing of `gap-10` to maintain clean visual boundaries. The top metrics cards grid has no header icons (removed deliberately).
22. **Quick Admin Actions**: "Aksi Cepat Admin" grid is relocated to the top row immediately below the metric cards. The first item is renamed to "Tambah Referral" and uses the `Gift` icon.
23. **Outlined Student Cards**: Pending review tickets should match the layout in `admin_review_card.png` (displays Name next to purple referral badge, program title subtext, line divider, and outlined Review button next to date).
24. **Typography Guidelines**: Nunito is the default sans-serif font family. Standard `h1` headings must default to `Nunito`. The Kalam font is strictly restricted to elements marked with the `.font-kalam` class. To prevent visual fatigue, avoid using `font-black` or `font-extrabold` excessively; sidebar navigation menu items must represent inactive links in `font-medium` and active links in `font-bold` for a comfortable visual hierarchy.
25. **Dark Mode Palette**: In dark mode, the background uses a rich slate-blue (`#1c253b`). Avoid low-contrast dark grays (such as `dark:text-zinc-550` or `dark:text-zinc-500`) for text overlays; instead, use legible contrast text colors (like `dark:text-zinc-400`, `dark:text-zinc-350`, and `dark:text-zinc-200`).
26. **Multi-role & Referrer Login Redirection Specification**: Saat deployment/integrasi backend nanti: (a) Jika pengguna terdeteksi memiliki 2 role termasuk 'referrer' (misalnya murid/mentor sekaligus pemilik referral), saat login ia masuk ke portal role utamanya terlebih dahulu, dan disediakan tombol switcher di Header untuk berpindah secara manual antara portal utama dan portal kemitraan referrer. (b) Jika pengguna terdeteksi hanya memiliki 1 role yaitu 'referrer', setelah login ia otomatis diarahkan ke portal referrer — pada kondisi ini Header hanya menampilkan tombol *Ke Beranda* (tanpa tombol Portal Utama karena tidak ada role akademik). (c) Jika pengguna terdeteksi memiliki role selain 'referrer' (dan bukan admin), disediakan tombol 'Daftar Referrer' di Header.
27. **Self-Referral Diperbolehkan**: Mitra referrer diperbolehkan mendaftar program bootcamp sendiri menggunakan link atau kode rujukan miliknya sendiri. Komisi tetap dihitung dan dikreditkan setelah pembayaran kelas berhasil diverifikasi oleh Admin. Tidak ada penolakan otomatis untuk self-referral.
28. **Referral Payout Rules (Confirmed)**: (a) Tidak ada batas minimal pencairan — berapapun komisi akan diproses sebulan sekali. (b) Jika pencairan tidak diajukan, saldo akumulasi terbawa ke bulan berikutnya. (c) Tanggal pencairan bervariasi per program, umumnya antara tanggal 25–30/31; detail terdapat pada halaman informasi masing-masing program. (d) Komisi satuan per rujukan berbeda-beda di setiap program — bacalah info program sebelum promosi. (e) Transfer pencairan bisa ke rekening/e-wallet mana pun; seluruh biaya administrasi transfer ditanggung oleh penerima komisi.

## Technical Context

- **Framework:** Next.js 16.2.9, App Router, Turbopack.
- **Runtime/UI:** React 19.2.4.
- **Styling:** Tailwind CSS v4.
- **Components:** HeroUI v3 plus custom namespace UI library in root `UI/`.
- **Animation:** Framer Motion.
- **Theme:** `next-themes`.
- **Default UI style:** `sakode-modern`.
- **Development visual control:** `StyleSwitcherFAB` must remain functional.
- **Selected auth target:** Better Auth with email/password and database-backed sessions; not implemented in current FE phase.
- **Selected ORM target:** Drizzle ORM with `mysql2`; not implemented in current FE phase.
- **Validation target:** Zod.
- **Database target:** Aiven for MySQL, separated dev/prod, with per-system credentials, TLS CA verification, and one migration owner per table.
- **Migration target:** generated SQL migration artifacts are promoted unchanged from dev to prod; migration is separate from seeding.
- **Seed target:** idempotent reference seed may be approved for prod, while deterministic dummy seed is dev-only.
- **Integration target:** protected Route Handlers under `/api/integrations/v1/*`; not anonymous and not current FE scope.
- **Architecture:** Feature-Based Colocation with route-private folders and a root `UI/` design system.
- **Command environment:** use `cmd.exe /c npm ...` for build/lint commands on the Windows host.

### Frontend architecture for this phase

- Pages consume typed view models.
- Feature fixtures live behind mock adapters/services.
- Do not scatter hardcoded arrays across pages and widgets.
- Shared application composites belong in `app/_components` or an agreed shared private folder.
- Feature-specific components stay colocated under the route.
- A new cross-style primitive is justified only when it is reusable across at least two modules or central to the app shell.
- When a primitive is added, implement it across all seven UI namespaces, update dynamic typings, and add a showcase example.

## Domain Rules

### Confirmed

- Gunakan RBAC.
- Principal hanya read-only pada modul ekskul.
- Principal hanya melihat organisasi yang terhubung.
- Public Sistem Informasi tidak boleh ikut diubah.
- Promo harus divalidasi server-side saat digunakan.
- Admin memiliki modul untuk mengelola program/kode referral, memantau atribusi pendaftaran, registrasi pemilik kode, serta menentukan nominal payout per konversi rujukan.
- Pemilik kode memiliki Akun Referral Khusus untuk melihat statistik rujukan dari berbagai tipe program, mengisi informasi rekening tujuan payout, dan mengecek status pencairan komisi.
- Seluruh persetujuan, proses transfer, dan pembaruan status pencairan komisi (payout) dikelola secara manual dan eksklusif oleh Admin pusat.
- Tipe-tipe program referral meliputi:
  1. Referral New Comers: skema standar untuk mengundang murid baru.
  2. Referral Program: skema rujukan yang digabungkan dengan promo tertentu.
- Nominal komisi per referral (harga 1 referral) dapat diset secara fleksibel oleh Admin.
- Referral dan promo diperlakukan sebagai konsep berbeda.
- Referral link hanya membawa kode/token publik; referral harus terlihat pada form dan divalidasi ulang saat submit.
- Pendaftaran akademik memerlukan satu paket/program published yang dipilih.
- Public landing hanya menampilkan paket published, harga yang disetujui, dan module preview publik.
- **Offline Courses & Branch Address**: Kursus diadakan offline secara tatap muka, sehingga pendaftaran murid mencantumkan alamat cabang/tempat belajar fisik (misal: Jakarta Selatan, Surabaya, Yogyakarta, dll).
- **Payment & Pricing Confirmation**: Pembelian modul/program akademik memiliki 3 opsi: Bayar Lunas (Full Payment), Trial Dulu (Trial First), dan Bayar Cicil (Installments). Status pembayaran cicilan dan trial divalidasi dan dikonfirmasi secara manual oleh Admin.
- **Trial-to-Normal Conversion Upgrade**: Murid yang mengikuti trial dapat melanjutkan ke kelas normal. Sisa tagihan dihitung dari harga pendaftaran normal dikurangi biaya trial yang sudah dibayar. Saat di-plotting, mentor rekomendasi utama mereka adalah mentor yang membimbing mereka selama trial (selama kapasitas slot mentor tersebut tersedia / tidak overloaded).
- **Belajar Kelompok (Group Learning)**: Program belajar kelompok dibeli secara berkelompok (min 2 peserta, maks 5 peserta) dengan harga dihitung per anak (default Rp 250.000 per anak, namun dapat disesuaikan per program). **Alokasi Plotting Kelompok**: Untuk optimalisasi sesi offline terpusat, penugasan kelompok hanya memakan **1 slot kapasitas beban** pada mentor (bukan sejumlah anggota kelompok), karena bimbingan diadakan di waktu dan tempat yang sama.
- **Repositori & Database Murid**: Admin memiliki workspace terpusat (`/students`) untuk memantau profil kontak murid, cabang belajar, status pembayaran, progres centang bab kurikulum pembelajaran per murid, status lulus (`completed`), dan akses cepat tombol plot/ubah mentor pendamping.
- **Harga Trial & Pilihan Skema Pendaftaran**: Setiap program bootcamp mendukung harga trial khusus (`trialPrice`) yang dapat di-edit mandiri. Calon murid memilih salah satu skema pendaftaran (`/register/enroll`) yaitu Private (Individu), Trial (Coba Dulu), atau Belajar Kelompok (mengisi nama-nama anggota kelompok).
- **Global Mentor Lead (`is_global_lead`)**: Sistem mendukung Mentor Lead global yang dapat memantau dan mengelola seluruh mentor, murid, serta jadwal di semua domain/program pengajaran tanpa hak administratif Admin (seperti log audit system, integrasi API, keuangan/pendaftaran). Kolom `is_global_lead` (boolean) ditambahkan pada tabel profil pengguna/mentor untuk penentuan scope ini.

### Proposed — report before implementing as final

- Cegah pendaftaran aktif duplikat ke ekskul yang sama.
- Cegah promo nonaktif/kedaluwarsa.
- Cegah redemption ganda.
- Cegah atribusi referral ganda pada pendaftaran yang sama.
- Validasi status, periode, target program, dan limit kode referral saat submit.
- Self-referral **diperbolehkan** — komisi dikreditkan setelah pembayaran terverifikasi; tidak ada penolakan otomatis.
- Stacking referral + promo masih TBD.
- Apakah referral prefill dapat diubah/dihapus oleh calon murid masih TBD.
- Billing cadence, tax, dan model package/bundle terpisah masih TBD.
- Cegah overlap jadwal mentor/murid.
- Gunakan soft status untuk histori assignment/registration.
- Gunakan kuota dan approval hanya setelah dikonfirmasi.

## Database Impact

### Add or implement

- `users`
- `sessions`
- `accounts`
- `verifications`
- `roles`
- `permissions`
- `user_roles`
- `role_permissions`
- `students`
- `programs` *(add public slug, listed price/currency, featured/public metadata)*
- `student_registrations` *(add package and price snapshot fields)*
- `promos` *(shared ownership TBD)*
- `promo_redemptions`
- `referral_programs`
- `referral_program_targets` *(optional if program-scoped)*
- `referral_codes`
- `referral_attributions`
- `referral_payouts` *(payout requests & disbursement history per referrer)*
- `trial_registrations`
- `learning_modules`
- `mentors`
- `mentor_assignments`
- `mentor_schedules`
- `extracurricular_organizations`
- `extracurricular_registrations`
- `user_organizations`
- `integration_clients` *(optional; backend integration phase)*
- `integration_request_logs` *(optional; backend integration phase)*

Read `docs/DB_ARCHITECTURE.md` and `docs/DATABASE_CONNECTION_AND_MIGRATION.md` before designing database work. No database items above are implemented during the active frontend-only phase.

## Backend Implementation Checklist — Referrer Portal (Open when BE Phase begins)

> This section is a **forward-looking guide** for the backend implementation of the Referrer Portal (FEAT-025, FR-042, FR-043). It must be executed in a dedicated backend slice with full product-owner approval.

### 1. Database Schema

| Table | New / Alter | Key columns |
|---|---|---|
| `user_roles` | Alter (ensure M×N) | `user_id`, `role_id` — supports multi-role (e.g. `murid` + `referrer`) |
| `referral_codes` | New | `id`, `code` (unique, URL-safe), `owner_user_id`, `program_id?`, `is_active`, `commission_per_referral`, `payout_window_start_day`, `payout_window_end_day`, `created_at` |
| `referral_attributions` | New | `id`, `referral_code_id`, `registrant_user_id`, `registration_id`, `status` (`pending`/`converted`/`cancelled`), `commission_amount`, `converted_at` |
| `referral_payouts` | New | `id`, `referrer_user_id`, `amount`, `status` (`pending`/`processing`/`completed`/`rejected`), `bank_name`, `account_number`, `account_holder`, `requested_at`, `executed_at`, `admin_user_id`, `rejection_reason` |
| `referral_bank_info` | New/or inline in `users` | Bank/e-wallet name, account number, account holder name per referrer |

### 2. Better Auth Multi-Role Session

- Configure Better Auth to support a `roles` array in the session payload (not just a single `role` string).
- On login, if user has both `referrer` + academic role → include both in session; redirect to primary academic portal.
- If user has only `referrer` role → redirect to `/dashboard?mode=referrer` or referrer-specific landing.
- Store role context switch in a **server-side session flag** (replace current `localStorage` hack).

### 3. API Endpoints (Route Handlers)

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/referrer/onboard` | Create referrer account or add `referrer` role to existing user; auto-generate `referral_codes` entry |
| `GET` | `/api/referrer/stats` | Fetch conversion stats, accumulated commission, payout history for authenticated referrer |
| `PATCH` | `/api/referrer/bank-info` | Update bank/e-wallet payout info |
| `POST` | `/api/referrer/payout-request` | Submit payout request; validate period window and non-zero balance |
| `GET` | `/api/admin/payouts` | List all pending/processed payout requests (Admin only) |
| `PATCH` | `/api/admin/payouts/[id]` | Approve or reject a payout request; record `executed_at` and `admin_user_id` |
| `POST` | `/api/referral/validate` | Validate a referral code (used on registration form submit) |
| `POST` | `/api/referral/attribute` | Record attribution when a referral-linked registration is confirmed paid |

### 4. Business Rules to Enforce Server-Side

- **Self-referral**: allowed — do NOT block `owner_user_id === registrant_user_id`.
- **No threshold**: any balance ≥ 0 can be requested for payout.
- **Period window**: validate `requested_at` falls within `payout_window_start_day`–`payout_window_end_day` of the associated program. Requests outside window are queued for next cycle.
- **Commission calculation**: `commission_amount = referral_codes.commission_per_referral` at time of conversion (snapshot, not live recalculation).
- **Accumulated balance**: `SUM(referral_attributions.commission_amount WHERE status = converted) - SUM(referral_payouts.amount WHERE status = completed)`.
- **Transfer fee**: no deduction by system — amount transferred equals requested amount; fee is referrer’s responsibility.
- **Stacking referral + promo**: decision pending — validate and reject combination until business rule confirmed.

### 5. Zod Schemas (Contracts)

```ts
// Referrer onboarding
const ReferrerOnboardSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  platform: z.string().optional(),
  bankName: z.string(),
  accountNumber: z.string(),
  accountHolder: z.string(),
});

// Payout request
const PayoutRequestSchema = z.object({
  amount: z.number().positive(),
  bankName: z.string(),
  accountNumber: z.string(),
  accountHolder: z.string(),
});

// Admin payout action
const PayoutActionSchema = z.object({
  action: z.enum(["approve", "reject"]),
  rejectionReason: z.string().optional(),
});
```

### 6. FE → BE Migration Checklist

- [ ] Replace `AuthContext` mock `login(role)` with Better Auth session that includes `roles[]`.
- [ ] Replace `localStorage` key `sakode-original-role` with a server-side session flag (`primaryRole`).
- [ ] Replace `ReferrerWidget` mock data with real-time API calls to `/api/referrer/stats`.
- [ ] Replace referral landing page form with `POST /api/referrer/onboard` submission.
- [ ] Wire payout request button in `ReferrerWidget` to `POST /api/referrer/payout-request`.
- [ ] Wire admin payout panel (to be built) to `GET /api/admin/payouts` and `PATCH /api/admin/payouts/[id]`.
- [ ] Replace leaderboard standings mock data in `/referral` with real query from `referral_attributions`.
- [ ] Validate referral code on registration form submit via `POST /api/referral/validate`.
- [ ] Trigger `POST /api/referral/attribute` when Admin confirms payment on a referral-attributed registration.

## Implementation Guidance

1. Read `AGENTS.md`, `AI docs/CONTEXT.md`, `AI docs/CUSTOM_UI_BUILDING.md`, `docs/SRS.md`, `docs/FEATURE_LIST.md`, `docs/FRONTEND_IMPLEMENTATION_PLAN.md`, and this brief.
2. Confirm the requested `FE-SLICE-*` ID. If no single slice is specified, stop and ask the owner to select one.
3. Work only on the chosen feature and role.
4. Do not install or implement Better Auth, Drizzle, MySQL, migrations, real API endpoints, or backend mutations in the current phase.
5. Preserve existing demo access while improving UI; authorization remains mock-only and must be clearly labeled as such.
6. Default to `sakode-modern`, but ensure the selected screen remains usable when the FAB switches style/color.
7. Use TailAdmin only as a layout/information-density reference: collapsible navigation, clear page header, metrics, filters, data panels, and responsive content. Do not copy brand, exact composition, or generic template content.
8. Avoid “AI slope”: excessive gradients/glows, decorative blobs, every card floating, identical rounded boxes, meaningless hero copy, or over-animation.
9. Prefer existing custom UI primitives. Add a new primitive only when reusable; otherwise create a domain composite.
10. Provide loading, empty, error, permission/read-only, and success states relevant to the slice.
11. Meet WCAG keyboard/focus/label/contrast expectations.
12. Run `cmd.exe /c npm run lint` and `cmd.exe /c npm run build`.
13. Return a review report containing files changed, component additions, interaction states, mock scenarios, known limitations, and manual review checklist.
14. Mark the slice **Ready for Review** in the report only; do not edit the review board status without owner approval.
15. Stop. Do not continue to another feature or role.

## Review Gate Protocol

A feature slice is complete for review only when:

- Scope is limited to one `FE-SLICE-*`.
- Existing routes outside the slice still compile.
- Default modern style is polished.
- FAB switching does not break the feature.
- Desktop, tablet, and mobile behaviors are documented.
- Required UI states can be demonstrated with fixtures.
- Lint/build results are reported honestly.
- No backend implementation was smuggled into the change.

## Recommended Implementation Order

Follow the exact slice ordering in `docs/FRONTEND_IMPLEMENTATION_PLAN.md` and `AI docs/FEATURE_IMPLEMENTATION_PROMPTS.md`:

1. Shared application shell.
2. Reusable components and typed fixtures.
3. FAB/style regression.
4. `FE-SLICE-004` — public package catalog, price, and module preview.
5. Login frontend.
6. Account registration with preservation of `program` and `ref` context.
7. `FE-SLICE-007` — required package enrollment and referral-link prefill.
8. Admin features, one by one, including `FE-SLICE-010` referral program/link management after student-registration review.
9. Mentor Lead features, one by one.
10. Mentor features, one by one.
11. Student features, one by one.
12. School Principal read-only features.
13. Cross-role responsive/accessibility and stakeholder showcase polish.

The order may be changed by the owner, but each execution still handles only one slice.

## Acceptance Criteria for Latest Update

- [ ] Documentation names Better Auth, Drizzle ORM, `mysql2`, and Zod as selected target stack.
- [ ] Current development phase is explicitly frontend-only.
- [ ] `sakode-modern` is the default style.
- [ ] Style/color FAB remains enabled for development/showcase.
- [ ] Layout direction is modern, comfortable, role-aware, and non-template-like.
- [ ] Custom UI reuse and new-component rules are documented.
- [ ] Feature development is split by role and review slice.
- [ ] A prompt pack exists for each frontend slice.
- [ ] Every prompt tells the agent to stop after review evidence.
- [ ] Backend auth/database/API implementation is deferred.
- [ ] Principal remains read-only and organization-scoped.
- [ ] Integration API is documented as protected/versioned future work.
- [ ] Referral program management is documented for Admin.
- [ ] Referral codes and registration attribution remain separate from promo redemption.
- [ ] A dedicated Admin frontend prompt exists and stops at review gate.
- [ ] Reward/commission/payout behavior is marked TBD, not invented.
- [ ] Admin referral UI includes canonical link preview and copy/share state.
- [ ] Public referral links prefill a visible referral field and invalid-link state.
- [ ] Landing page package cards display published price/currency and included module preview.
- [ ] Package selection is mandatory and can be preselected from landing CTA.
- [ ] Package, price, promo, and referral remain distinct in registration summary.
- [ ] `FE-SLICE-004` and `FE-SLICE-007` have standalone prompts and stop gates.

## Open Questions That Can Block Implementation

1. Exact meaning of “pendaftaran organisasi ekskul”: organization onboarding, student enrollment, or both.
2. Actor that submits and approves an organization.
3. Actor that approves student extracurricular registration.
4. Whether quota, registration period, fees, and participant limits exist.
5. Report fields visible to Principal and whether student identities are included.
6. Whether a Principal can belong to multiple organizations.
7. Ownership and write privileges for shared `programs` and `promos` tables.
8. Official status values and allowed transitions.
9. Whether prototype features—grading, portfolio, certificate, XP, and audit logs—are in scope.
10. Which dashboard feature slice should be reviewed first after the shared shell.
11. Whether the FAB is hidden, admin-only, or retained as a preference in production.
12. Which integration endpoint is needed first by Sistem Informasi.
13. Who may become a referrer: student, alumni, mentor, school/partner, or external source?
14. Does referral create a reward, commission, payout, discount, or only attribution?
15. What qualifies a successful referral: submitted, verified, accepted, or paid registration?
16. Can a referral code coexist with a promo, have usage limits, or be restricted by program/period?
17. Can Admin manually correct attribution, and what audit fields are mandatory?
18. Is package price one-time, monthly, per level, or installment-based; what currency/tax rules apply?
19. Is `programs` sufficient as the sellable package entity, or is a separate bundle/package table needed?
20. Can the referral owner self-service/copy links outside Admin, and which roles are eligible?
21. Can a prefilled referral be changed/removed, and can a referral link preselect a specific package?
22. Which module fields are public on the landing page: title, duration, session count, outcome, or syllabus?

## Files Likely Affected

### Active frontend phase

- `app/(auth)/login/page.tsx`
- `app/(auth)/register/page.tsx`
- `app/dashboard/page.tsx`
- `app/dashboard/layout.tsx`
- `app/dashboard/_components/*`
- Public landing package catalog components/mocks created only by `FE-SLICE-004`
- Public enrollment, package selector, and referral-link prefill components/mocks created only by `FE-SLICE-007`
- Admin referral route/private components, mocks, and view models created only by `FE-SLICE-010`
- `app/_components/StyleSwitcherFAB.tsx` and `UIStyleContext.tsx` only when the selected slice requires it
- Root `UI/` namespaces when a justified reusable primitive is added
- New route-private `_components`, `_mocks`, `_services`, and view-model types for the selected slice

### Future backend phase — do not touch during FE-only prompts

- `app/_database/` Drizzle client/schema
- Better Auth server/client configuration and auth route
- Server Actions, domain services, and Route Handlers
- `scripts/db/` verification, migration, reference-seed, dummy-seed, and dev-reset scripts
- `drizzle/` generated migration artifacts
- `/api/integrations/v1/*`

Do not invent or create future-backend files during the current phase.

When a backend database slice is explicitly opened:

- Never run production migration or production reference seed without explicit user approval and confirmation guard.
- Never run dummy seed against production.
- Never run migration automatically from `next build`, `next start`, or application import.
- Generate migrations only from Sistem Akademik-owned schema files.
- Promote the same reviewed migration artifact from dev to prod; do not regenerate a different production migration.
- Keep Aiven credentials and CA data server-only and outside Git.


## Required Prompt Source

Use `AI docs/FEATURE_IMPLEMENTATION_PROMPTS.md`. Each prompt maps to exactly one of 33 `FE-SLICE-*` review slices and is designed to end at a manual review gate.
