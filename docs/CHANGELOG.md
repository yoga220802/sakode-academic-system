# Documentation Changelog

## v0.9 — 9 July 2026

- **Portal Multi-Role & Referrer Feature Set (Post FE-SLICE-018)**:
  - Memperkenalkan role baru `referrer` ke dalam tipe `UserRole` dan `AuthContext` mock.
  - Membuat **Landing Page Program Referral** (`/referral`) mandiri dengan: leaderboard standings rujukan (global & per-program), aturan pencairan dana, kode etik mitra referrer, tata cara pendaftaran, dan formulir pendaftaran mitra.
  - Memperbarui aturan pencairan dana pada landing page: tidak ada batas minimal (no threshold), saldo diakumulasikan jika tidak dicairkan, jadwal pencairan fleksibel tanggal 25–30/31 per program, komisi bervariasi per program, biaya transfer ditanggung penerima.
  - Menambahkan **Aturan & Kode Etik Mitra Referrer** pada landing page: self-referral diperbolehkan (komisi dihitung setelah pembayaran terverifikasi), promosi jujur, kepatuhan konten media, dan validitas data rekening.
  - Implementasi **Header Portal Multi-Role** (`app/(portal)/_components/Header.tsx`): role non-admin melihat tombol *Daftar Referrer* dan *Portal Referrer*; saat dalam mode referrer, tampil tombol *Portal Utama* (jika punya role lain tersimpan) atau *Ke Beranda* (jika pure referrer tanpa role akademik).
  - Logika switching role disimpan di `localStorage` key `sakode-original-role` untuk menjaga konteks sesi saat perpindahan portal.
  - Mendokumentasikan **Spesifikasi Redirection Login Multi-role** (poin 26 AI_AGENT_BRIEF): (a) dual-role → portal utama dahulu + switcher header; (b) pure referrer → otomatis ke portal referrer; (c) role non-referrer → tampil tombol Daftar Referrer.
  - Memisahkan routing group `(mentor-lead)` dihapus; mentor dan mentor lead menggunakan direktori `(mentor)` yang sama.
  - Menambahkan `ReferrerWidget.tsx` pada dashboard untuk mitra: statistik konversi, link rujukan siap salin, log konversi, dan riwayat transfer.
  - Merapikan layout Quick Login: tombol Referrer Account dan Kepala Sekolah berjejer di baris ketiga.
  - Halaman `/register` dibatasi untuk pendaftaran calon murid saja; banner `<strong>` mengarahkan calon mitra ke `/referral`.

## v0.8 — 9 July 2026

- **Visual Style Alignment & Switcher Synchronization**: Audited and refactored components across `FE-SLICE-003` to `FE-SLICE-017` to eliminate generic static styles.
- Updated all badges to style-aware `UI.Badge` primitives to support dynamic themes (Modern, Neobrutalism, Claymorphism, Glassmorphism, Minimalism).
- Unified action buttons across Direktori Pengguna, Review Pendaftaran, and Organisasi Ekskul to use the unified `UI.Button` component.
- Standardized dashboard cards, receipt containers, copy sections, and log items to utilize `getSubElementClass("inner-card")` or `getSubElementClass("card-item")`.
- Toned down weekly calendar cells (`/schedules-admin`) to `min-h-24` and mapped slot badges to prevent height conflicts and layout shifting.
- **Bugfixes**: Resolved TypeScript compilation errors (unimported helper functions, incorrect prop declarations on primitives) and fixed a runtime `TypeError` in `getBgClass` caused by unsupported color keys (`indigo`, `teal`).

## v0.7 — 8 July 2026

- Implemented **FE-SLICE-017: Admin User Directory & System Audit Logs**.
- Added User Account Directory (`/users`) with metric summaries, quick search, role/status filtering, and add/edit forms.
- Added **Reset Password Action** to safely reset any user credentials back to the default `academy@sakode`.
- Added System Audit Log screen (`/logs`) with dynamic log stream, filter categories, and a real-time log simulation injector.
- Enhanced **FE-SLICE-009: Admin Student Registration Review** to support manual bank transfer receipt verification.
- Added **Simulated Receipt Upload** to simulate students uploading BCA/Mandiri transfer receipt images post-checkout.
- Added **Installment Payment Tracing (Pembayaran Cicil)**: Split payments into termin schedules (DP 40%, etc.) with per-term receipt upload simulation and high-fidelity BCA e-receipt modal viewer.
- Added **Group Payment Modes (Opsi Pembayaran Kelompok)**: Tab switcher to choose between collective merged transfer (full price Rp 750.000) or individual transfer per member (Rp 250.000 per participant with separate verifications).

## v0.6 — 1 July 2026

- Renumbered all 33 frontend review slices into one continuous execution sequence from `FE-SLICE-001` through `FE-SLICE-033`.
- Moved the public package catalog to `FE-SLICE-004`, login to `FE-SLICE-005`, account registration to `FE-SLICE-006`, and package enrollment/referral prefill to `FE-SLICE-007`.
- Moved Admin referral management to `FE-SLICE-010` and shifted subsequent role slices without changing their scope.
- Reordered the AI prompt pack, implementation plan, feature review board, repository guidance, and all cross-references so the numbering matches the recommended execution order.
- No source-code, feature-scope, database, or business-rule changes were made in this revision.

## v0.5 — 30 June 2026

- Added `DATABASE_CONNECTION_AND_MIGRATION.md` for Aiven MySQL connection, TLS CA verification, environment separation, and Vercel secret mapping.
- Defined reproducible Drizzle migration promotion: generate once, review/test in dev, commit, and apply the same migration artifact to production.
- Separated migration, idempotent reference seed, deterministic development dummy seed, connection verification, and dev reset scripts.
- Added hard production guards: no dummy seed in prod, no automatic migration during Next.js build/start, and explicit confirmation for production migration/reference seed.
- Documented `owned` versus `external` Drizzle schema boundaries to protect Laravel-owned shared tables.
- Updated DB architecture, AI agent brief, project context, README, and agent guardrails.

## v0.4 — 30 June 2026

- Added canonical, copyable referral registration links derived from URL-safe referral codes.
- Added visible referral prefill from shared links, context preservation through account/enrollment steps, invalid-link states, and submit-time revalidation requirements.
- Added a focused Academic landing catalog for published packages/programs with price, currency, and included-module preview.
- Made package/program selection mandatory before student enrollment submission and added registration price snapshots.
- Extended `programs` with public slug/pricing metadata and `student_registrations` with listed/final price snapshot fields.
- Added `FEAT-023`, `FEAT-024`, `FR-035` through `FR-038`, `FE-SLICE-004`, and `FE-SLICE-007`.
- Updated Admin referral (`FE-SLICE-010`), Admin program (`FE-SLICE-012`), public account registration (`FE-SLICE-006`), Admin registration review (`FE-SLICE-009`), and Student registration status (`FE-SLICE-025`) UI contracts.
- Increased the frontend review catalog from 31 to 33 standalone slices.

## v0.3 — 30 June 2026

- Added Admin-managed referral registration programs, referral codes, and registration attribution.
- Added `FEAT-022` and functional requirements `FR-032` through `FR-034`.
- Added target entities `referral_programs`, optional `referral_program_targets`, `referral_codes`, and `referral_attributions`.
- Kept referral separate from promo discount/redemption and left reward, commission, payout, self-referral, and conversion qualification as open decisions.
- Added `FE-SLICE-010` and a dedicated AI-agent prompt for Admin referral management.
- Updated Admin overview, registration review, and Student registration-status UI contracts to display referral context separately from promo.

## v0.2 — 30 June 2026

- Locked Better Auth, Drizzle ORM, `mysql2`, and Zod as target stack.
- Defined one-project Next.js fullstack architecture and future protected integration APIs.
- Changed active delivery mode to frontend-only.
- Added default modern UI direction and TailAdmin-inspired information architecture guardrails.
- Preserved the style/color FAB for development and stakeholder showcase.
- Added custom component reuse/extension rules.
- Added 30 frontend feature-role review slices.
- Added ready-to-run AI agent prompt pack with mandatory stop/review gates.
- Updated SRS, feature list, DB architecture, AI agent brief, repository context, UI guide, AGENTS, and README.
