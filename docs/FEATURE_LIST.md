# SAKODE Academic System — Feature List

**Versi:** 0.9  
**Tanggal baseline:** 9 Juli 2026  
**Fase aktif:** Frontend-first, one feature × one role × one review gate

## 1. Feature Status Legend

- **Planned** — masuk ruang lingkup, implementasi belum dimulai.
- **In Progress** — sudah ada bagian UI/prototipe, tetapi alur produksi belum lengkap.
- **Implemented** — selesai dan telah tervalidasi dengan backend/data nyata.
- **Blocked** — tidak dapat dilanjutkan karena ketergantungan atau keputusan yang belum tersedia.
- **Needs Clarification** — terdapat indikasi/prototipe, tetapi requirement bisnis belum dikonfirmasi.

> Penilaian status dibuat dari snapshot repository yang diunggah. Tidak ada fitur backend produksi yang dinyatakan **Implemented** karena autentikasi dan data dashboard masih berupa mock/client state.

### Frontend Review State

Status bisnis di tabel utama tetap memakai legend di atas. Pengembangan frontend dikontrol dengan status review terpisah:

- **Not Started** — slice belum dikerjakan.
- **In Development** — agent sedang mengerjakan satu slice yang disetujui.
- **Ready for Review** — lint/build selesai dan agent telah berhenti untuk review.
- **Changes Requested** — reviewer meminta revisi pada slice yang sama.
- **FE Approved** — tampilan dan interaction contract disetujui; backend belum otomatis dianggap selesai.

Tidak ada agent yang boleh memindahkan dirinya ke slice berikutnya tanpa perintah eksplisit.

## 2. Feature List

| ID | Feature | Module | Description | Roles | Priority | Status | Dependencies | Requirement IDs | Database entities | Acceptance summary |
|---|---|---|---|---|---|---|---|---|---|---|
| FEAT-001 | Account Registration & Authentication | Auth | Membuat akun, login, logout, dan sesi aman. | Calon Murid, semua role | Must | In Progress | Auth strategy, users schema | FR-001, FR-002 | `users`, `roles`, `user_roles` | Server-side auth; email unik; password hashed; route terlindungi. |
| FEAT-002 | Role-Based Access Control | Auth/Security | Membatasi menu, action, dan data berdasarkan role, permission, assignment, dan organisasi. | Semua role | Must | In Progress | FEAT-001 | FR-003, FR-028 | `roles`, `permissions`, `user_roles`, `role_permissions`, `user_organizations` | Server menolak akses tidak sah; principal scoped dan read-only. |
| FEAT-003 | Student Registration | Registration | Pendaftaran calon murid ke paket/program akademik dengan pilihan paket wajib, price snapshot, promo opsional, dan referral opsional. | Calon Murid, Admin | Must | Planned | FEAT-001, FEAT-023, FEAT-024 | FR-004–FR-006, FR-036, FR-038 | `programs`, `learning_modules`, `students`, `student_registrations` | Submit ditolak tanpa paket; paket/harga/referral terlihat pada summary dan status terlacak. |
| FEAT-004 | Promo Validation & Redemption | Registration/Promo | Memvalidasi promo dari database bersama dan mencatat redemption. | Calon Murid, Murid, Sistem | Must | Planned | FEAT-003, shared promo data | FR-007, FR-008 | `promos`, `promo_redemptions`, `student_registrations` | Promo divalidasi server-side dan redemption tidak ganda. |
| FEAT-005 | Trial Registration | Trial | Pengajuan, penjadwalan, dan status kelas trial. | Calon Murid, Murid, Admin | Must | Planned | FEAT-001, program/slot data | FR-009, FR-010 | `trial_registrations`, `programs` | Pengguna dapat submit dan melihat status; Admin mengelola jadwal/status. |
| FEAT-006 | Programs & Learning Modules | Learning | Admin mengelola paket/program, harga publik, dan susunan modul; calon murid melihat preview published, Murid mengakses modul sesuai hak. | Admin, Murid, Calon Murid | Must | Planned | FEAT-003 | FR-004, FR-011, FR-012, FR-037 | `programs`, `learning_modules`, `student_registrations` | Paket published mempunyai harga dan module outline; modul draft tersembunyi; akses belajar dibatasi. |
| FEAT-007 | Mentor Information | Mentor | Profil, keahlian, status, dan informasi mentor yang sesuai role. | Admin, Mentor Lead, Murid | Must | Planned | FEAT-001 | FR-013 | `mentors`, `users` | Data privat tidak terekspos; mentor nonaktif tidak dapat dipilih. |
| FEAT-008 | Mentor Plotting | Mentor | Penetapan mentor kepada murid/pendaftaran dan pengelolaan lifecycle assignment. | Admin, Mentor Lead | Must | In Progress | FEAT-003, FEAT-007 | FR-014, FR-015 | `mentor_assignments`, `mentors`, `students`, `student_registrations` | Assignment unik/valid, memiliki status/periode, riwayat terjaga. |
| FEAT-009 | Mentor Scheduling | Scheduling | Pembuatan dan tampilan jadwal mentoring berdasarkan assignment. | Admin, Mentor Lead, Mentor, Murid | Must | In Progress | FEAT-008 | FR-016, FR-017 | `mentor_schedules`, `mentor_assignments` | Jadwal scoped, waktu valid, aturan bentrok ditetapkan. |
| FEAT-010 | Admin Panel | Dashboard | Ringkasan operasional dan akses pengelolaan modul akademik. | Admin | Must | In Progress | FEAT-002, seluruh modul | FR-006, FR-010, FR-018, FR-023, FR-025, FR-026, FR-034 | Multiple | Data nyata menggantikan mock; shortcut tetap terotorisasi. |
| FEAT-011 | Mentor Lead Panel | Dashboard | Antrean plotting, beban mentor, dan jadwal pada lingkup Lead. | Mentor Lead | Must | In Progress | FEAT-002, FEAT-008, FEAT-009 | FR-019 | `mentor_assignments`, `mentors`, `mentor_schedules` | Hanya data lingkup Lead; aksi memakai permission. |
| FEAT-012 | Mentor Panel | Dashboard | Penugasan dan jadwal mentor sendiri. | Mentor | Must | In Progress | FEAT-002, FEAT-008, FEAT-009 | FR-017, FR-020 | `mentor_assignments`, `mentor_schedules` | Mentor tidak melihat data di luar penugasan. |
| FEAT-013 | Student Panel | Dashboard | Program aktif, modul, mentor, jadwal, dan status milik Murid. | Murid | Must | In Progress | FEAT-002–FEAT-009 | FR-012, FR-017, FR-021 | Multiple | Semua data discope ke student id milik sesi. |
| FEAT-014 | Extracurricular Organization Registration & Management | Extracurricular | Onboarding dan pengelolaan sekolah/organisasi ekskul. | Admin, perwakilan organisasi (TBD) | Must | Planned | FEAT-001, organization model | FR-022, FR-023 | `extracurricular_organizations`, `user_organizations` | Organisasi tersimpan dengan status; duplikasi dan ownership terkendali. |
| FEAT-015 | Student Extracurricular Registration | Extracurricular | Murid mendaftar ke ekskul dan statusnya ditinjau oleh aktor yang berwenang. | Murid, Admin/Approver TBD | Must | Planned | FEAT-014, FEAT-013 | FR-024, FR-025 | `extracurricular_registrations`, `extracurricular_organizations`, `students` | Tidak ada pendaftaran aktif duplikat; workflow approval/kuota dikonfirmasi. |
| FEAT-016 | School Principal Extracurricular Access | Extracurricular/Dashboard | Dashboard read-only untuk informasi dan laporan ekskul pada organisasi terkait. | Kepala Sekolah, Admin | Must | Planned | FEAT-002, FEAT-014, FEAT-015 | FR-026–FR-028 | `user_organizations`, `extracurricular_organizations`, `extracurricular_registrations` | Scoped per organisasi; tidak ada endpoint write bagi principal. |
| FEAT-017 | User Management & System Audit UI | Administration | Panel manajemen user (search, filter, edit, delete, default reset password) dan monitor log sistem terintegrasi. | Admin | Could | Implemented (FE) | FEAT-001, FEAT-002 | FR-040, FR-041 | `users`, `audit_logs` | Direktori pengguna dan log audit sistem interaktif fully functional di frontend mock. |
| FEAT-018 | Grading, Portfolio, Certificate & XP UI | Learning | Elemen penilaian, portofolio/sertifikat, dan XP muncul pada prototipe dashboard. | Mentor, Mentor Lead, Murid | Could | Needs Clarification | FEAT-006, FEAT-008 | Belum menjadi FR final | TBD | Konfirmasi scope dan business rules sebelum membuat schema/logic. |
| FEAT-019 | System Information Integration API | Integration | Route Handler versioned untuk pertukaran data terpilih dengan Sistem Informasi. | System client, Admin owner | Should | Planned | Final API contract, auth secret/scope, domain services | FR-029 | Domain entities sesuai endpoint; optional `integration_clients`, `integration_request_logs` | Terproteksi, versioned, DTO minimum; **bukan scope fase FE aktif**. |
| FEAT-020 | Development Style & Color Showcase | UI/Development | FAB mengganti visual style, palette, dan custom brand color dengan `sakode-modern` sebagai default. | Developer, stakeholder reviewer | Must during development | In Progress | Existing UI namespaces, `UIStyleProvider` | FR-030 | None | FAB tetap aktif; seluruh style usable; tidak memengaruhi business state. |
| FEAT-021 | Incremental Feature Review Workflow | Delivery | Implementasi dibagi menjadi satu feature-role slice dan berhenti di review gate. | Product owner, AI agent | Must | Planned | Prompt pack, frontend plan | FR-031 | None | Agent tidak memperluas scope atau lanjut otomatis setelah menyelesaikan slice. |
| FEAT-022 | Referral Registration Program Management | Registration/Referral | Admin mengelola program (tipe New Comers & Program, komisi), kode, pemilik, tautan share, dan atribusi; Pemilik memiliki portal khusus pantau payout. | Admin, Calon Murid, Murid, Referrer, Sistem | Must | Planned | FEAT-003, FEAT-001, program catalog | FR-032–FR-034a | `referral_programs`, `referral_codes`, `referral_attributions`, `student_registrations`, `users` | Admin membuat kode, set komisi, registrasi pemilik, dan memantau payout; Referrer memantau pencairan lewat Akun Khusus. |
| FEAT-023 | Referral Share Link & Automatic Prefill | Registration/Referral | Pemilik referral membagikan link; saat dibuka, referral diprefill secara transparan dan divalidasi ulang pada submit. | Pemilik Referral, Calon Murid, Sistem, Admin | Must | Planned | FEAT-022, FEAT-003 | FR-035, FR-036 | `referral_codes`, `referral_attributions`, `student_registrations` | Link tidak memuat PII; invalid link tidak merusak form; context bertahan melewati langkah pendaftaran. |
| FEAT-024 | Public Package Catalog, Pricing & Selection | Public Acquisition/Registration | Landing page menampilkan paket/program, harga, dan modul yang termasuk; calon murid wajib memilih paket sebelum submit. | Pengunjung, Calon Murid, Admin | Must | Planned | FEAT-006, FEAT-003 | FR-037, FR-038 | `programs`, `learning_modules`, `student_registrations` | Hanya paket published tampil; CTA memprefill paket; form tidak submit tanpa paket; harga disnapshot. |
| FEAT-025 | Referrer Partnership Portal | Referral/Auth | Landing page publik program kemitraan referrer dengan leaderboard, aturan pencairan, kode etik mitra, tata cara pendaftaran, dan formulir onboarding. Dashboard Referrer (ReferrerWidget) menampilkan statistik konversi, link rujukan kanonis siap salin, log konversi, dan riwayat transfer. Header portal menampilkan switcher peran dinamis: Daftar Referrer, Portal Referrer, Portal Utama, atau Ke Beranda tergantung peran aktif dan ketersediaan role lain. | Referrer, Calon Mitra, Semua Role Non-Admin | Must | Implemented (FE) | FEAT-022, FEAT-001 | — | `referral_codes`, `referral_attributions`, `users` | Referrer dapat memantau komisi dan riwayat payout; non-referrer dapat daftar menjadi mitra; header menyesuaikan kondisi peran. |

## 3. Role and Feature Matrix

Legenda: **Yes**, **No**, **Read-only**, **TBD**, dan **Own/Scoped**.

| Feature | Calon Murid | Murid | Admin | Mentor Lead | Mentor | Kepala Sekolah |
|---|---|---|---|---|---|---|
| Account registration | Yes | No | Create/manage users: TBD | No | No | Akun dibuat Admin/TBD |
| Login/logout | Yes | Yes | Yes | Yes | Yes | Yes |
| RBAC administration | No | No | Yes | No | No | No |
| View public package catalog, price, and module preview | Yes | Yes | Yes | Read-only | Read-only | No/TBD |
| Submit student registration | Yes | Own | Read-only/manage | No | No | No |
| Review student registration | No | Read-only own | Yes | Read-only/TBD | No | No |
| Validate promo | Yes | Yes | Read-only/TBD | No | No | No |
| Create/manage promo | No | No | **TBD; kemungkinan Sistem Informasi** | No | No | No |
| Open referral link / receive prefill | Yes | Own | Test/manage | No | No | No |
| Use referral code on registration | Yes | Own | View/manage | No | No | No |
| Generate/copy referral link | If eligible: Own/TBD | If eligible: Own/TBD | Yes/manage | If eligible: Own/TBD | If eligible: Own/TBD | If eligible: Own/TBD |
| Manage referral programs/codes | No | No | Yes | No | No | No |
| View referral attribution/conversion | Own status only/TBD | Own status only/TBD | Yes | No | No | No |
| Submit trial | Yes | Own | Read-only/manage | No | No | No |
| Manage modules | No | Read-only assigned | Yes | Read-only | Read-only | No |
| View mentor information | Public subset | Yes | Yes | Yes | Own | No/TBD |
| Plot mentor | No | Read-only own | Yes | Yes | No | No |
| Create/update schedule | No | Read-only own | Yes | Yes | TBD/Own | No |
| View schedule | No/TBD | Own | Yes | Scoped | Own | No/TBD |
| Manage organization ekskul | No | No | Yes | No | No | Read-only |
| Submit extracurricular registration | No/TBD | Own | No | No | No | No |
| Review extracurricular registration | No | Read-only own | Yes/TBD | No/TBD | No | Read-only |
| View extracurricular report | No | Own data | Yes | No/TBD | No/TBD | Read-only scoped |
| Modify extracurricular data | No | Own submission only/TBD | Yes | No/TBD | No | **No** |
| Use style/color showcase FAB | Yes (development) | Yes (development) | Yes (development) | Yes (development) | Yes (development) | Yes (development) |
| Call system integration API | No | No | Configuration only/TBD | No | No | No |

## 4. Permission Action Matrix

| Role | View | Create | Update | Approve | Schedule | Register | Manage |
|---|---|---|---|---|---|---|---|
| Calon Murid | Paket/harga/modul publik | Akun, application | Draft dan pilihan paket milik sendiri (TBD) | No | No | Program/trial | No |
| Murid | Data milik sendiri | Pendaftaran ekskul | Data milik sendiri yang diizinkan | No | No | Ekskul | No |
| Admin | Seluruh data sesuai admin scope | Yes | Yes | Yes/TBD by workflow | Yes | On behalf: TBD | Yes |
| Mentor Lead | Scoped operational data | Assignment/schedule | Assignment/schedule | No/TBD | Yes | No | Mentor operations |
| Mentor | Own assignments/students | Schedule only if allowed | Own schedule/status if allowed | No | TBD | No | Own operational data |
| Kepala Sekolah | Ekskul dan laporan organisasinya | No | No | No | No | No | No |
| Referrer | Dashboard komisi & konversi, riwayat payout | Formulir onboarding akun kemitraan | Info rekening payout | No | No | No | No |

> **Catatan role**: Prototipe saat ini menggunakan satu role per sesi (`admin`, `mentor`, `murid`, `school_principal`, `referrer`). Role `mentor_lead` digabung ke direktori `(mentor)`. Desain target mendukung satu pengguna memiliki lebih dari satu role — terutama kombinasi role akademik + `referrer`, dengan switcher header yang menyesuaikan kondisi.

## 5. Frontend-First Delivery Grouping

### Wave 0 — Foundation

1. FE-SLICE-001 — Shared dashboard shell and role navigation.
2. FE-SLICE-002 — Reusable application components and typed fixture conventions.
3. FE-SLICE-003 — Style switcher regression across existing routes.

### Wave 1 — Public Acquisition and Authentication

4. FE-SLICE-004 — Public landing package catalog and pricing.
5. FE-SLICE-005 — Login frontend.
6. FE-SLICE-006 — Account registration frontend with acquisition-context preservation.
7. FE-SLICE-007 — Public package enrollment and referral-link prefill flow.

### Wave 2 — Admin

8. FE-SLICE-008 — Admin overview.
9. FE-SLICE-009 — Admin student registration.
10. FE-SLICE-010 — Admin referral program/link management (recommended immediately after student registration).
11. FE-SLICE-011 — Admin trial registration.
12. FE-SLICE-012 — Admin programs, prices, and modules.
13. FE-SLICE-013 — Admin mentor directory.
14. FE-SLICE-014 — Admin mentor plotting.
15. FE-SLICE-015 — Admin mentor scheduling.
16. FE-SLICE-016 — Admin extracurricular organizations.
17. FE-SLICE-017 — Admin principal membership/read access setup.

### Wave 3 — Mentor Lead and Mentor

18. FE-SLICE-018 — Mentor Lead overview.
19. FE-SLICE-019 — Mentor Lead plotting queue.
20. FE-SLICE-020 — Mentor Lead schedule management.
21. FE-SLICE-021 — Mentor overview.
22. FE-SLICE-022 — Mentor assigned students.
23. FE-SLICE-023 — Mentor personal schedule.

### Wave 4 — Student

24. FE-SLICE-024 — Student overview.
25. FE-SLICE-025 — Student registration, package, promo, and referral status.
26. FE-SLICE-026 — Student trial registration/status.
27. FE-SLICE-027 — Student learning modules.
28. FE-SLICE-028 — Student mentor and schedule.
29. FE-SLICE-029 — Student extracurricular registration.

### Wave 5 — School Principal

30. FE-SLICE-030 — Principal overview.
31. FE-SLICE-031 — Principal extracurricular information and reports.

### Wave 6 — Cross-role Polish

32. FE-SLICE-032 — Responsive/accessibility regression.
33. FE-SLICE-033 — Stakeholder showcase and style comparison readiness.

Backend, Better Auth, Drizzle schema, migrations, and integration endpoints are intentionally deferred until the related frontend slices are reviewed.

## 6. Frontend Review Board

| Slice | Role | Feature area | Initial state | Review evidence required |
|---|---|---|---|---|
| FE-SLICE-001 | Shared | App shell/navigation | FE Approved | Desktop/mobile shell, sidebar states, role menu map |
| FE-SLICE-002 | Shared | Reusable components/fixtures | FE Approved | Component inventory, showcase, typed fixture adapter |
| FE-SLICE-003 | Shared | FAB/style regression | FE Approved | All styles render target routes without broken interaction |
| FE-SLICE-004 | Public | Landing package catalog/pricing | FE Approved | Published package cards, price/module comparison, CTA query context, responsive states |
| FE-SLICE-005 | Public | Login | FE Approved | Default/validation/loading/error/demo states |
| FE-SLICE-006 | Public | Account registration | FE Approved | Multi-section form, validation, success, and preservation of inbound program/ref context |
| FE-SLICE-007 | Public | Package enrollment + referral prefill | FE Approved | Required package selection, URL referral prefill, summary, invalid/changed-price states |
| FE-SLICE-008 | Admin | Overview | FE Approved | Operational metrics, activity, priority queue |
| FE-SLICE-009 | Admin | Student registration | Ready for Review | List/filter/detail/status interaction prototype |
| FE-SLICE-010 | Admin | Referral program management | FE Approved | Program/code list, URL-safe code generation, canonical share-link preview/copy, attribution detail, promo separation |
| FE-SLICE-011 | Admin | Trial registration | FE Approved | Booking list/calendar/detail states |
| FE-SLICE-012 | Admin | Programs/pricing/modules | FE Approved | Catalog, public price fields, module hierarchy, publish/preview editor shell |
| FE-SLICE-013 | Admin | Mentor directory | FE Approved | Directory, profile summary, availability/status filters |
| FE-SLICE-014 | Admin | Mentor plotting | FE Approved | Queue, recommendation/selection, confirmation UI |
| FE-SLICE-015 | Admin | Mentor scheduling | FE Approved | Calendar/agenda, conflict feedback, schedule form |
| FE-SLICE-016 | Admin | Extracurricular organizations | FE Approved | Organization list, onboarding detail, status UI |
| FE-SLICE-017 | Admin | Principal membership | Ready for Review | Principal account/membership/read-scope UI |
| FE-SLICE-018 | Mentor Lead | Overview | Ready for Review | Capacity, unassigned queue, upcoming schedule |
| FE-SLICE-019 | Mentor Lead | Plotting | Not Started | Scoped queue and assignment interaction |
| FE-SLICE-020 | Mentor Lead | Scheduling | Not Started | Scoped calendar and edit interaction |
| FE-SLICE-021 | Mentor | Overview | Not Started | Own workload, next session, notices |
| FE-SLICE-022 | Mentor | Assigned students | Not Started | Student list/detail scoped to mentor |
| FE-SLICE-023 | Mentor | Schedule | Not Started | Own agenda, detail and allowed status update UI |
| FE-SLICE-024 | Student | Overview | Not Started | Progress, next action, module/session summary |
| FE-SLICE-025 | Student | Registration/package/promo/referral | Not Started | Application progress, selected package and price snapshot, distinct promo/referral feedback |
| FE-SLICE-026 | Student | Trial | Not Started | Trial form/status and empty states |
| FE-SLICE-027 | Student | Learning modules | Not Started | Module catalog/progress/detail shell |
| FE-SLICE-028 | Student | Mentor/schedule | Not Started | Mentor profile and personal agenda |
| FE-SLICE-029 | Student | Extracurricular | Not Started | Catalog, registration status and rule notice |
| FE-SLICE-030 | Principal | Overview | Not Started | Read-only organization summary and scope notice |
| FE-SLICE-031 | Principal | Extracurricular reports | Not Started | Filters, metrics, roster privacy, no write affordance |
| FE-SLICE-032 | Shared | Responsive/accessibility | Not Started | Keyboard/focus, contrast, mobile/tablet/desktop review |
| FE-SLICE-033 | Shared | Stakeholder showcase | Not Started | Curated demo data, FAB presets, walkthrough readiness |

## 7. Scope Guardrails

- One prompt selects exactly one slice.
- A slice may modify shared components only when necessary for that slice.
- Shared changes must be regression-checked on existing screens.
- No real database, Better Auth, migration, Route Handler, or integration endpoint during the current FE-only phase.
- Mock data must live behind typed fixtures/adapters, not be scattered directly in page components.
- Every completed slice stops in **Ready for Review** and waits for product-owner approval.
- FEAT-017 and FEAT-018 remain **Needs Clarification** and must not be expanded implicitly.
