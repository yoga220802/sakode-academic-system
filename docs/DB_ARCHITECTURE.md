# SAKODE Academic System — Database Architecture

**Versi:** 0.5  
**Target DBMS:** MySQL 8-compatible  
**Status:** Logical design; tipe/constraint final mengikuti ORM dan keputusan bisnis

## 1. Architecture Overview

SAKODE Academic System menggunakan database relasional **MySQL** dengan target **Drizzle ORM** dan driver **`mysql2`**. **Better Auth** dipilih untuk authentication dengan database-backed session, sedangkan role, permission, organization membership, dan domain scoping tetap dikelola sebagai authorization domain SAKODE.

Data dibagi ke domain identity/access, public package catalog and pricing, academic registration, promo, referral-link attribution, trial, learning, mentor, scheduling, extracurricular, dan system integration. Transaksi diperlukan pada operasi yang menggabungkan beberapa write, seperti pendaftaran + redemption promo, plotting mentor, serta validasi kuota/duplikasi.

> **Current delivery note:** fase aktif tetap frontend-only. Blueprint koneksi Aiven, migration, dan seeding sudah ditetapkan di `DATABASE_CONNECTION_AND_MIGRATION.md`, tetapi implementasinya hanya boleh dimulai melalui backend database slice yang disetujui secara eksplisit.

### 1.1 Batas sistem dan shared database

- Sistem Akademik dan Sistem Informasi dapat terhubung ke database MySQL yang sama.
- Dokumen ini hanya mendesain data yang diperlukan Sistem Akademik.
- Tabel katalog seperti `programs` dan `promos` berpotensi dibaca/ditulis lintas sistem. **Ownership migrasi harus ditetapkan sebelum implementasi.**
- Sistem Akademik sebaiknya memakai akun database tersendiri dengan least privilege.
- Database development dan production harus terpisah; migrasi yang sama dipromosikan secara terkontrol.

### 1.2 Domain utama

1. Identity and access.
2. Public program/package catalog, pricing, and student registration.
3. Promo and redemption.
4. Referral programs, share links, codes, and attribution.
5. Trial registration.
6. Learning modules.
7. Mentor assignment and scheduling.
8. Organizations and extracurricular registration.

### 1.3 Konvensi umum

- Primary key disarankan `BIGINT UNSIGNED` atau UUID/ULID yang konsisten di seluruh sistem; pilihan final **TBD**.
- Semua tabel operasional memakai `created_at` dan `updated_at`.
- Gunakan `deleted_at` hanya pada entity yang membutuhkan soft deletion; jangan menambahkannya otomatis ke semua tabel.
- Status disimpan sebagai string terbatas/check constraint atau enum ORM; daftar status di bawah masih **proposed**.
- Timestamp disimpan dalam UTC dan dikonversi ke timezone pengguna saat ditampilkan.

### 1.4 Selected Persistence Stack

| Concern | Decision |
|---|---|
| ORM | Drizzle ORM |
| Driver | `mysql2` |
| Managed database | Aiven for MySQL; environment dev/prod terisolasi dan TLS CA verification wajib |
| Schema workflow | Code-first untuk tabel milik Sistem Akademik; `drizzle-kit pull`/manual mapping untuk tabel bersama yang sudah ada |
| Authentication | Better Auth Drizzle adapter, mapped to agreed plural table names |
| Validation | Zod at request/action boundary; database constraints remain authoritative for integrity |
| Runtime | Node.js runtime for MySQL access |
| Migration ownership | Satu owner per table; Drizzle tidak boleh membuat migration tandingan untuk tabel yang dimiliki Laravel |
| Migration promotion | File migration yang sama diuji di dev lalu diterapkan ke prod; schema bukan disalin langsung dari database dev |
| Seeding | Reference seed idempotent dipisah dari deterministic dummy seed; dummy seed hanya untuk dev |


## 2. Data Ownership Recommendation

| Table/domain | Suggested owner | Academic access | Notes |
|---|---|---|---|
| `users`, RBAC, student/mentor profiles | Sistem Akademik | Read/write | Identity tunggal untuk panel akademik. |
| `programs` | TBD/shared | Read; write bila ownership diberikan | Menjadi katalog paket jual, harga publik, dan sumber pilihan pendaftaran; juga dapat muncul pada Sistem Informasi publik. |
| `promos` | Kemungkinan Sistem Informasi/Admin publik | Read | Sistem Akademik memvalidasi, tidak harus membuat promo. |
| `promo_redemptions` | Sistem Akademik | Read/write | Dibuat ketika pendaftaran berhasil. |
| `referral_programs`, `referral_codes`, `referral_attributions` | Sistem Akademik | Read/write | Dikelola Admin; reward/komisi belum termasuk scope terkonfirmasi. |
| Pendaftaran, trial, modul, plotting, schedule | Sistem Akademik | Read/write | Domain inti akademik. |
| Organisasi dan pendaftaran ekskul | Sistem Akademik | Read/write | Principal hanya membaca pada application layer. |

## 3. Entity List

### 3.1 Identity and Access

Better Auth handles identity/session records. SAKODE domain tables extend the identity with roles, permissions, and organization memberships. Exact Drizzle field types must be generated/reconciled from the selected Better Auth configuration before the first migration.

#### `users`

- **Purpose:** Canonical identity record mapped to the Better Auth user model and referenced by SAKODE domain profiles.
- **PK:** `id`.
- **Important columns:** `name`, `email`, `email_verified`, `image`, `status`, timestamps required by auth configuration.
- **Unique:** `email`.
- **Indexes:** unique email; optional (`status`, `created_at`).
- **Ownership:** Sistem Akademik/Better Auth migration owner.
- **Rule:** Password credential material must not be stored directly in this table unless generated schema explicitly requires it.

#### `sessions`

- **Purpose:** Database-backed user sessions managed by Better Auth.
- **PK:** `id`.
- **Important columns:** user reference, token, expiry, IP/user-agent fields supported by generated schema, timestamps.
- **FK:** user reference → `users.id`.
- **Unique/index:** token unique; user and expiry indexes as generated/recommended.
- **Ownership:** Better Auth; application code must not mutate sessions with ad-hoc SQL.

#### `accounts`

- **Purpose:** Authentication accounts/credentials and future provider linkage managed by Better Auth.
- **PK:** `id`.
- **Important columns:** user reference, provider/account identifier, credential/provider fields generated by Better Auth, timestamps.
- **FK:** user reference → `users.id`.
- **Unique:** provider/account pair according to generated schema.
- **Ownership:** Better Auth.

#### `verifications`

- **Purpose:** Time-limited verification/reset records used by authentication flows when enabled.
- **PK:** generated/auth-configured identifier.
- **Important columns:** identifier/value, expiry, timestamps according to Better Auth generated schema.
- **Indexes:** identifier and expiry.
- **Ownership:** Better Auth.

#### `roles`

- **Purpose:** Daftar role aplikasi.
- **PK:** `id`.
- **Important columns:** `code`, `name`, `description`, timestamps.
- **Unique:** `code`.
- **Seed baseline:** `admin`, `mentor_lead`, `mentor`, `student`, `school_principal`; `prospective_student` dapat direpresentasikan oleh state/profile sebelum menjadi student aktif.

#### `permissions`

- **Purpose:** Permission granular yang dapat dipetakan ke role.
- **PK:** `id`.
- **Important columns:** `code`, `description`, timestamps.
- **Unique:** `code`.
- **Examples:** `student_registration.review`, `referral_program.manage`, `referral_attribution.read`, `mentor_assignment.manage`, `mentor_schedule.manage`, `extracurricular.read`, `extracurricular.manage`.

#### `user_roles`

- **Purpose:** Relasi many-to-many antara user dan role.
- **PK:** `id` atau composite (`user_id`, `role_id`).
- **FK:** `user_id → users.id`, `role_id → roles.id`.
- **Unique:** (`user_id`, `role_id`).
- **Indexes:** `role_id`, `user_id`.

#### `role_permissions`

- **Purpose:** Relasi many-to-many antara role dan permission.
- **PK:** composite (`role_id`, `permission_id`).
- **FK:** `role_id → roles.id`, `permission_id → permissions.id`.
- **Unique:** (`role_id`, `permission_id`).

### 3.2 Organization Scoping

#### `user_organizations`

- **Purpose:** Menghubungkan pengguna—terutama Kepala Sekolah—ke organisasi yang boleh diakses.
- **PK:** `id`.
- **Important columns:** `user_id`, `extracurricular_organization_id`, `membership_type`, `status`, `assigned_by`, timestamps.
- **FK:** `user_id → users.id`, `extracurricular_organization_id → extracurricular_organizations.id`, `assigned_by → users.id` nullable.
- **Unique:** (`user_id`, `extracurricular_organization_id`, `membership_type`).
- **Indexes:** `user_id`, `extracurricular_organization_id`, (`user_id`, `status`).
- **Status proposed:** `active`, `inactive`.

### 3.3 Academic Programs and Students

#### `programs`

- **Purpose:** Katalog program/paket belajar yang dijual, ditampilkan pada landing page, dapat dipilih saat pendaftaran, dan mempunyai modul.
- **PK:** `id`.
- **Important columns:** `code`, `slug`, `name`, `short_description`, `description`, `price_amount`, `currency_code`, `price_note` nullable, `thumbnail_url` nullable, `is_featured`, `registration_open_at`, `registration_close_at`, `status`, timestamps.
- **Unique:** `code`, `slug`.
- **Indexes:** (`status`, `is_featured`), (`registration_open_at`, `registration_close_at`).
- **Status proposed:** `draft`, `published`, `inactive`.
- **Ownership:** Shared/TBD; migrasi harus dikoordinasikan.

#### `students`

- **Purpose:** Profil domain murid yang terhubung ke akun.
- **PK:** `id`.
- **Important columns:** `user_id`, `student_number` nullable, `full_name`, `phone` nullable, `status`, timestamps.
- **FK:** `user_id → users.id`.
- **Unique:** `user_id`; `student_number` bila digunakan.
- **Indexes:** `status`, `student_number`.
- **Status proposed:** `prospective`, `active`, `inactive`, `graduated`.

#### `student_registrations`

- **Purpose:** Pendaftaran murid/calon murid ke program akademik.
- **PK:** `id`.
- **Important columns:** `student_id`, `program_id`, `listed_price_amount`, `final_price_amount` nullable, `currency_code`, `status`, `submitted_at`, `reviewed_by`, `reviewed_at`, `rejection_reason`, timestamps.
- **FK:** `student_id → students.id`, `program_id → programs.id`, `reviewed_by → users.id` nullable.
- **Unique:** Aturan duplikasi aktif dapat memakai generated column/transaction atau unique key yang mempertimbangkan status; alternatif minimum (`student_id`, `program_id`, `submitted_at`).
- **Indexes:** (`student_id`, `status`), (`program_id`, `status`), `submitted_at`.
- **Status proposed:** `draft`, `submitted`, `verified`, `accepted`, `rejected`, `cancelled`.

### 3.4 Promo

#### `promos`

- **Purpose:** Master promo yang divalidasi saat pendaftaran.
- **PK:** `id`.
- **Important columns:** `code`, `name`, `description`, `discount_type`, `discount_value`, `valid_from`, `valid_until`, `status`, `usage_limit`, `per_user_limit`, timestamps.
- **FK:** Opsional ke `programs` melalui tabel relasi bila promo dapat berlaku ke banyak program.
- **Unique:** `code`.
- **Indexes:** `code` unique, (`status`, `valid_from`, `valid_until`).
- **Status proposed:** `draft`, `active`, `inactive`, `expired`.
- **Warning:** Tipe diskon dan limit belum dikonfirmasi. Kolom tersebut hanya dipakai jika requirement disetujui.

#### `promo_programs` *(optional, recommended if promo targeting is required)*

- **Purpose:** Relasi many-to-many promo dengan program.
- **PK:** Composite (`promo_id`, `program_id`).
- **FK:** `promo_id → promos.id`, `program_id → programs.id`.
- **Unique:** (`promo_id`, `program_id`).

#### `promo_redemptions`

- **Purpose:** Pencatatan penggunaan promo pada pendaftaran.
- **PK:** `id`.
- **Important columns:** `promo_id`, `user_id`, `student_registration_id`, `status`, `redeemed_at`, `voided_at`, timestamps.
- **FK:** `promo_id → promos.id`, `user_id → users.id`, `student_registration_id → student_registrations.id`.
- **Unique:** `student_registration_id`; atau (`promo_id`, `student_registration_id`).
- **Indexes:** (`promo_id`, `status`), (`user_id`, `promo_id`), `redeemed_at`.
- **Status proposed:** `reserved`, `redeemed`, `voided`.

### 3.5 Referral Programs and Attribution

#### `referral_programs`

- **Purpose:** Master program referral pendaftaran yang dikelola Admin.
- **PK:** `id`.
- **Important columns:** `code`, `name`, `description`, `starts_at`, `ends_at`, `status`, `created_by`, timestamps.
- **FK:** `created_by → users.id`; target program menggunakan `referral_program_targets` bila satu program referral dapat berlaku ke banyak program.
- **Unique:** `code`.
- **Indexes:** (`status`, `starts_at`, `ends_at`), `name`.
- **Status proposed:** `draft`, `scheduled`, `active`, `inactive`, `expired`.
- **Warning:** Reward, komisi, payout, eligibility, dan kriteria conversion belum dikonfirmasi dan tidak boleh disimpulkan dari keberadaan program referral.

#### `referral_program_targets` *(optional, recommended when referral is program-scoped)*

- **Purpose:** Relasi many-to-many antara program referral dan program akademik.
- **PK:** Composite (`referral_program_id`, `program_id`).
- **FK:** `referral_program_id → referral_programs.id`, `program_id → programs.id`.
- **Unique:** (`referral_program_id`, `program_id`).

#### `referral_codes`

- **Purpose:** Kode referral unik yang dapat diatribusikan ke referrer/sumber tertentu.
- **PK:** `id`.
- **Important columns:** `referral_program_id`, `code`, `referrer_user_id` nullable, `referrer_label` nullable, `status`, `max_uses` nullable, `valid_from` nullable, `valid_until` nullable, `created_by`, timestamps.
- **FK:** `referral_program_id → referral_programs.id`, `referrer_user_id → users.id` nullable, `created_by → users.id`.
- **Unique:** `code`.
- **Indexes:** (`referral_program_id`, `status`), (`referrer_user_id`, `status`), (`status`, `valid_from`, `valid_until`).
- **Status proposed:** `active`, `inactive`, `expired`.
- **Notes:** `referrer_label` hanya dipakai bila sumber referral eksternal diizinkan; model referrer final masih TBD. `code` harus URL-safe. Tautan kanonis sebaiknya diturunkan saat runtime dari `APP_PUBLIC_URL` + route pendaftaran + encoded code, bukan disimpan sebagai URL absolut agar domain dapat berubah tanpa migrasi.

#### `referral_attributions`

- **Purpose:** Menghubungkan satu pendaftaran murid dengan kode referral yang menjadi sumber atribusi.
- **PK:** `id`.
- **Important columns:** `referral_code_id`, `student_registration_id`, `referred_user_id`, `status`, `attributed_at`, `qualified_at` nullable, `corrected_by` nullable, `correction_reason` nullable, timestamps.
- **FK:** `referral_code_id → referral_codes.id`, `student_registration_id → student_registrations.id`, `referred_user_id → users.id`, `corrected_by → users.id` nullable.
- **Unique:** `student_registration_id` untuk satu atribusi aktif per pendaftaran pada baseline.
- **Indexes:** (`referral_code_id`, `status`), (`referred_user_id`, `status`), `attributed_at`.
- **Status proposed:** `attributed`, `qualified`, `rejected`, `cancelled`.
- **Warning:** Makna `qualified` harus ditetapkan oleh business rule. Tidak ada tabel reward/payout sampai requirement tersebut disetujui.

### 3.6 Trial Registration

#### `trial_registrations`

- **Purpose:** Permintaan kelas trial dan jadwalnya.
- **PK:** `id`.
- **Important columns:** `user_id`, `program_id` nullable, `status`, `preferred_at` nullable, `scheduled_start_at` nullable, `scheduled_end_at` nullable, `notes`, `handled_by`, timestamps.
- **FK:** `user_id → users.id`, `program_id → programs.id` nullable, `handled_by → users.id` nullable.
- **Unique:** Aturan duplikasi aktif per user/program perlu diputuskan.
- **Indexes:** (`user_id`, `status`), (`program_id`, `status`), `scheduled_start_at`.
- **Status proposed:** `submitted`, `scheduled`, `completed`, `cancelled`, `rejected`.

### 3.7 Learning Modules

#### `learning_modules`

- **Purpose:** Metadata modul pembelajaran pada program.
- **PK:** `id`.
- **Important columns:** `program_id`, `code`, `title`, `description`, `sequence_no`, `content_reference` nullable, `status`, `published_at`, timestamps.
- **FK:** `program_id → programs.id`.
- **Unique:** (`program_id`, `code`) dan/atau (`program_id`, `sequence_no`).
- **Indexes:** (`program_id`, `status`, `sequence_no`).
- **Status proposed:** `draft`, `published`, `archived`.
- **Notes:** Konten file/video dapat disimpan di object storage; DB menyimpan reference, bukan binary besar.

### 3.8 Mentors, Assignments, and Scheduling

#### `mentors`

- **Purpose:** Profil domain mentor.
- **PK:** `id`.
- **Important columns:** `user_id`, `display_name`, `bio`, `specialization_text`, `status`, `max_active_students` nullable, timestamps.
- **FK:** `user_id → users.id`.
- **Unique:** `user_id`.
- **Indexes:** `status`.
- **Status proposed:** `active`, `inactive`.
- **Warning:** Kapasitas mentor belum terkonfirmasi.

#### `mentor_assignments`

- **Purpose:** Plotting mentor ke murid atau pendaftaran program.
- **PK:** `id`.
- **Important columns:** `mentor_id`, `student_id`, `student_registration_id` nullable, `assigned_by`, `start_at`, `end_at` nullable, `status`, `ended_reason`, timestamps.
- **FK:** `mentor_id → mentors.id`, `student_id → students.id`, `student_registration_id → student_registrations.id` nullable, `assigned_by → users.id`.
- **Unique:** Satu assignment aktif per kombinasi mentor/student/registration; enforce melalui service + transaction atau strategi key yang sesuai MySQL.
- **Indexes:** (`mentor_id`, `status`), (`student_id`, `status`), `student_registration_id`.
- **Status proposed:** `active`, `completed`, `reassigned`, `cancelled`.

#### `mentor_schedules`

- **Purpose:** Jadwal sesi mentoring berdasarkan assignment.
- **PK:** `id`.
- **Important columns:** `mentor_assignment_id`, `start_at`, `end_at`, `mode`, `location_or_link`, `status`, `created_by`, `notes`, timestamps.
- **FK:** `mentor_assignment_id → mentor_assignments.id`, `created_by → users.id`.
- **Unique:** Tidak wajib; gunakan transaction/locking untuk conflict check.
- **Indexes:** (`mentor_assignment_id`, `start_at`), (`start_at`, `status`). Untuk lookup mentor, join ke assignment; denormalisasi `mentor_id` hanya bila profiling membuktikan perlu.
- **Status proposed:** `scheduled`, `completed`, `cancelled`, `rescheduled`.

### 3.9 Extracurricular

#### `extracurricular_organizations`

- **Purpose:** Mewakili sekolah/organisasi yang mengajukan atau menjalankan program ekskul bersama SAKODE.
- **PK:** `id`.
- **Important columns:** `code`, `name`, `organization_type`, `address`, `contact_name`, `contact_email`, `contact_phone`, `registration_open_at` nullable, `registration_close_at` nullable, `capacity` nullable, `status`, `created_by`, timestamps.
- **FK:** `created_by → users.id` nullable.
- **Unique:** `code`; aturan unik nama/alamat perlu validasi manual agar tidak terlalu ketat.
- **Indexes:** `status`, (`registration_open_at`, `registration_close_at`), `name`.
- **Status proposed:** `submitted`, `approved`, `active`, `inactive`, `rejected`.
- **Warning:** Approval, kuota, dan periode belum terkonfirmasi.

#### `extracurricular_registrations`

- **Purpose:** Pendaftaran murid ke organisasi/program ekskul.
- **PK:** `id`.
- **Important columns:** `extracurricular_organization_id`, `student_id`, `status`, `submitted_at`, `reviewed_by`, `reviewed_at`, `rejection_reason`, timestamps.
- **FK:** `extracurricular_organization_id → extracurricular_organizations.id`, `student_id → students.id`, `reviewed_by → users.id` nullable.
- **Unique:** Prinsip target: tidak ada lebih dari satu pendaftaran **aktif** per (`extracurricular_organization_id`, `student_id`). Karena MySQL tidak memiliki partial unique index generik, terapkan dengan salah satu strategi: (a) lifecycle satu row dan update status; (b) generated `active_key`; atau (c) transaction + locking dan index biasa.
- **Indexes:** (`student_id`, `status`), (`extracurricular_organization_id`, `status`), `submitted_at`.
- **Status proposed:** `submitted`, `approved`, `rejected`, `cancelled`.

### 3.10 System Integration

#### `integration_clients` *(optional after API contract is confirmed)*

- **Purpose:** Registry for system-to-system clients when a single environment secret is no longer sufficient.
- **PK:** `id`.
- **Important columns:** `name`, `client_key`, `secret_hash` or external secret reference, `scopes`, `status`, `last_used_at`, timestamps.
- **Unique:** `client_key`.
- **Indexes:** (`status`, `client_key`).
- **Security:** Store a hash or secret-manager reference, never a plaintext reusable secret.
- **Phase:** Backend/integration phase, not current FE phase.

#### `integration_request_logs` *(optional, recommended for write endpoints)*

- **Purpose:** Minimal trace of integration access without storing sensitive payloads.
- **PK:** `id`.
- **Important columns:** `integration_client_id`, `request_id`, `method`, `path`, `response_status`, `occurred_at`, optional safe metadata.
- **FK:** `integration_client_id → integration_clients.id`.
- **Unique:** `request_id` when replay prevention uses a unique request identifier.
- **Indexes:** (`integration_client_id`, `occurred_at`), (`path`, `occurred_at`).

### 3.11 Optional Audit Entity

#### `audit_logs` *(optional; pending confirmation)*

- **Purpose:** Mencatat aksi administratif kritis.
- **PK:** `id`.
- **Important columns:** `actor_user_id`, `action`, `entity_type`, `entity_id`, `metadata_json`, `created_at`.
- **FK:** `actor_user_id → users.id` nullable.
- **Indexes:** (`entity_type`, `entity_id`), (`actor_user_id`, `created_at`), `created_at`.
- **Notes:** Jangan menyimpan password, token, atau payload PII lengkap pada metadata.

## 4. Relationship Rules

1. Satu `user` dapat mempunyai banyak `roles` melalui `user_roles`.
2. Satu role mempunyai banyak permission melalui `role_permissions`.
3. Satu akun murid mempunyai paling banyak satu profil `students` aktif, kecuali kebutuhan multi-profile muncul.
4. Satu program merupakan baseline paket jual: mempunyai satu harga publik aktif, banyak pendaftaran, dan banyak modul. Model bundle lintas-program ditambahkan hanya bila requirement mengharuskannya.
5. Pilihan program/paket dan snapshot harga disimpan pada pendaftaran agar perubahan katalog tidak mengubah histori.
6. Satu promo dapat mempunyai banyak redemption; satu pendaftaran hanya mempunyai maksimal satu redemption aktif kecuali stacking promo diizinkan.
7. Satu program referral mempunyai banyak kode; satu kode dapat mempunyai banyak atribusi; satu pendaftaran mempunyai maksimal satu atribusi referral aktif pada baseline.
8. Referral dan promo disimpan pada entity terpisah dan tidak saling mengimplikasikan diskon/reward.
9. Satu mentor dapat mempunyai banyak assignment; satu murid dapat mempunyai riwayat banyak assignment.
10. Satu assignment dapat mempunyai banyak jadwal.
11. Satu organisasi ekskul mempunyai banyak pendaftaran murid.
12. Satu murid dapat mendaftar ke banyak organisasi ekskul sesuai business rule.
13. Kepala Sekolah memperoleh scope dari `user_organizations`, bukan dari role saja.
14. Akses read-only Kepala Sekolah ditegakkan pada service/action layer; database schema tidak mengandalkan nama role untuk constraint.

## 5. Suggested Status Lifecycles

Semua lifecycle berikut **proposed** dan harus dikonfirmasi.

### 5.1 Student registration

```text
draft → submitted → verified → accepted
                    ↘ rejected
submitted/verified → cancelled
```

### 5.2 Referral program and code

```text
draft → scheduled → active → expired
draft/scheduled/active → inactive
```

Referral attribution status is proposed as:

```text
attributed → qualified
attributed → rejected
attributed/qualified → cancelled
```

### 5.3 Trial registration

```text
submitted → scheduled → completed
submitted/scheduled → cancelled
submitted → rejected
```

### 5.4 Mentor assignment

```text
active → completed
active → reassigned
active → cancelled
```

### 5.5 Mentor schedule

```text
scheduled → completed
scheduled → cancelled
scheduled → rescheduled (atau membuat jadwal pengganti dengan referensi)
```

### 5.6 Extracurricular organization

```text
submitted → approved → active → inactive
submitted → rejected
```

### 5.7 Extracurricular registration

```text
submitted → approved
submitted → rejected
submitted/approved → cancelled
```

## 6. ER Diagram

```mermaid
erDiagram
    USERS ||--o{ SESSIONS : has
    USERS ||--o{ ACCOUNTS : authenticates_with
    USERS ||--o{ USER_ROLES : assigned
    ROLES ||--o{ USER_ROLES : contains
    ROLES ||--o{ ROLE_PERMISSIONS : grants
    PERMISSIONS ||--o{ ROLE_PERMISSIONS : included
    USERS ||--o{ USER_ORGANIZATIONS : member_of
    EXTRACURRICULAR_ORGANIZATIONS ||--o{ USER_ORGANIZATIONS : scopes

    USERS ||--o| STUDENTS : student_profile
    USERS ||--o| MENTORS : mentor_profile
    PROGRAMS ||--o{ STUDENT_REGISTRATIONS : receives
    STUDENTS ||--o{ STUDENT_REGISTRATIONS : submits
    PROMOS ||--o{ PROMO_REDEMPTIONS : redeemed
    STUDENT_REGISTRATIONS ||--o| PROMO_REDEMPTIONS : applies
    REFERRAL_PROGRAMS ||--o{ REFERRAL_PROGRAM_TARGETS : targets
    PROGRAMS ||--o{ REFERRAL_PROGRAM_TARGETS : included_in
    REFERRAL_PROGRAMS ||--o{ REFERRAL_CODES : issues
    USERS ||--o{ REFERRAL_CODES : may_own
    REFERRAL_CODES ||--o{ REFERRAL_ATTRIBUTIONS : attributes
    STUDENT_REGISTRATIONS ||--o| REFERRAL_ATTRIBUTIONS : has
    USERS ||--o{ REFERRAL_ATTRIBUTIONS : referred_user
    PROGRAMS ||--o{ TRIAL_REGISTRATIONS : offers
    USERS ||--o{ TRIAL_REGISTRATIONS : requests
    PROGRAMS ||--o{ LEARNING_MODULES : contains

    MENTORS ||--o{ MENTOR_ASSIGNMENTS : receives
    STUDENTS ||--o{ MENTOR_ASSIGNMENTS : assigned
    STUDENT_REGISTRATIONS ||--o{ MENTOR_ASSIGNMENTS : source
    MENTOR_ASSIGNMENTS ||--o{ MENTOR_SCHEDULES : schedules

    EXTRACURRICULAR_ORGANIZATIONS ||--o{ EXTRACURRICULAR_REGISTRATIONS : receives
    STUDENTS ||--o{ EXTRACURRICULAR_REGISTRATIONS : submits

    INTEGRATION_CLIENTS ||--o{ INTEGRATION_REQUEST_LOGS : makes

    USERS {
      string id PK
      string email UK
      string name
      boolean email_verified
      string status
    }
    SESSIONS {
      string id PK
      string user_id FK
      string token UK
      datetime expires_at
    }
    ACCOUNTS {
      string id PK
      string user_id FK
      string provider_id
      string account_id
    }
    VERIFICATIONS {
      string id PK
      string identifier
      string value
      datetime expires_at
    }
    ROLES {
      string id PK
      string code UK
      string name
    }
    PERMISSIONS {
      string id PK
      string code UK
    }
    USER_ROLES {
      string user_id FK
      string role_id FK
    }
    ROLE_PERMISSIONS {
      string role_id FK
      string permission_id FK
    }
    USER_ORGANIZATIONS {
      string id PK
      string user_id FK
      string extracurricular_organization_id FK
      string membership_role
      string status
    }
    PROGRAMS {
      string id PK
      string code UK
      string slug UK
      string name
      decimal price_amount
      string currency_code
      boolean is_featured
      string status
    }
    STUDENTS {
      string id PK
      string user_id FK_UK
      string student_number UK
      string status
    }
    STUDENT_REGISTRATIONS {
      string id PK
      string student_id FK
      string program_id FK
      decimal listed_price_amount
      decimal final_price_amount
      string currency_code
      string status
    }
    PROMOS {
      string id PK
      string code UK
      string status
      datetime valid_from
      datetime valid_until
    }
    PROMO_REDEMPTIONS {
      string id PK
      string promo_id FK
      string student_registration_id FK_UK
      datetime redeemed_at
    }
    REFERRAL_PROGRAMS {
      string id PK
      string code UK
      string name
      string status
      datetime starts_at
      datetime ends_at
    }
    REFERRAL_PROGRAM_TARGETS {
      string referral_program_id FK
      string program_id FK
    }
    REFERRAL_CODES {
      string id PK
      string referral_program_id FK
      string referrer_user_id FK
      string code UK_URL_SAFE
      string status
    }
    REFERRAL_ATTRIBUTIONS {
      string id PK
      string referral_code_id FK
      string student_registration_id FK_UK
      string referred_user_id FK
      string status
      datetime attributed_at
    }
    TRIAL_REGISTRATIONS {
      string id PK
      string user_id FK
      string program_id FK
      datetime scheduled_at
      string status
    }
    LEARNING_MODULES {
      string id PK
      string program_id FK
      string title
      int sequence_no
      string status
    }
    MENTORS {
      string id PK
      string user_id FK_UK
      string expertise
      string status
    }
    MENTOR_ASSIGNMENTS {
      string id PK
      string mentor_id FK
      string student_id FK
      string student_registration_id FK
      string status
    }
    MENTOR_SCHEDULES {
      string id PK
      string mentor_assignment_id FK
      datetime start_at
      datetime end_at
      string status
    }
    EXTRACURRICULAR_ORGANIZATIONS {
      string id PK
      string code UK
      string name
      string status
    }
    EXTRACURRICULAR_REGISTRATIONS {
      string id PK
      string extracurricular_organization_id FK
      string student_id FK
      string status
    }
    INTEGRATION_CLIENTS {
      string id PK
      string client_key UK
      string secret_hash
      string status
    }
    INTEGRATION_REQUEST_LOGS {
      string id PK
      string integration_client_id FK
      string request_id UK
      string path
      int response_status
    }
```

`VERIFICATIONS` is managed independently by Better Auth and therefore has no mandatory application-domain relationship in the diagram. Referral relationships are modeled separately from promo redemption. Optional integration tables are shown to make the target architecture explicit; they must not be migrated until the API contract is approved.

## 7. Data Integrity Rules

1. `users.email` unik dan dinormalisasi sebelum penyimpanan/lookup.
2. Password hanya disimpan sebagai hash; token sesi/reset dipisahkan dari tabel utama bila diperlukan.
3. Semua FK aktif dengan strategi `ON DELETE` yang konservatif (`RESTRICT` atau `SET NULL` untuk actor optional).
4. Program/paket, harga, promo, referral, mentor, organisasi, dan status pendaftaran diverifikasi di dalam transaction sebelum write penting.
5. Promo divalidasi kembali pada submit; reservation/redemption harus atomic terhadap usage limit jika limit digunakan.
6. Kode referral divalidasi ulang saat submit; program/kode harus aktif, berada dalam periode valid, cocok dengan target program, dan belum melampaui limit bila digunakan.
7. `referral_attributions.student_registration_id` unik pada baseline; koreksi manual Admin mencatat actor dan alasan.
8. Promo dan referral disimpan terpisah; tidak ada reward/komisi/payout tanpa schema dan requirement yang disetujui.
9. Referral link tidak menyimpan PII atau secret; query parameter hanya membawa kode/token publik dan selalu divalidasi ulang pada submit.
10. `student_registrations.program_id`, `listed_price_amount`, dan `currency_code` wajib terisi saat submit; `final_price_amount` ditentukan setelah promo/aturan harga tervalidasi.
11. Hanya program dan modul berstatus published yang boleh masuk public catalog/preview.
12. Duplikasi pendaftaran ekskul aktif dicegah dengan transaction dan index pendukung.
13. Konflik jadwal diperiksa pada service layer menggunakan transaction/locking; index waktu mendukung pencarian konflik.
14. `reviewed_by`, `assigned_by`, dan `created_by` menyimpan actor untuk audit minimum.
15. Kepala Sekolah hanya mendapatkan data melalui membership organisasi aktif.
16. Hard delete dilarang untuk pendaftaran, redemption, assignment, dan jadwal yang telah menjadi histori bisnis.
17. Kolom `created_at` dan `updated_at` menggunakan presisi dan timezone policy yang konsisten.
18. Migration pada tabel shared tidak dijalankan sepihak oleh satu aplikasi.

## 8. Index Recommendations

| Table | Recommended index | Query supported |
|---|---|---|
| `users` | unique (`email`) | Login dan pengecekan duplikat. |
| `user_roles` | (`user_id`, `role_id`) unique | Resolusi role user. |
| `role_permissions` | (`role_id`, `permission_id`) unique | Resolusi permission. |
| `programs` | unique (`slug`), (`status`, `is_featured`), (`registration_open_at`, `registration_close_at`) | Public landing catalog, package detail, dan CTA selection. |
| `student_registrations` | (`student_id`, `status`), (`program_id`, `status`) | Dashboard murid, antrean Admin, dan laporan paket. |
| `promos` | unique (`code`), (`status`, `valid_from`, `valid_until`) | Validasi promo. |
| `promo_redemptions` | unique (`student_registration_id`), (`user_id`, `promo_id`) | Anti-duplikasi dan limit pengguna. |
| `referral_programs` | unique (`code`), (`status`, `starts_at`, `ends_at`) | Daftar program aktif/terjadwal. |
| `referral_codes` | unique (`code`), (`referral_program_id`, `status`), (`referrer_user_id`, `status`) | Validasi kode dan administrasi referrer. |
| `referral_attributions` | unique (`student_registration_id`), (`referral_code_id`, `status`), (`attributed_at`) | Anti-duplikasi dan ringkasan konversi. |
| `trial_registrations` | (`status`, `scheduled_start_at`), (`user_id`, `status`) | Antrean dan jadwal trial. |
| `learning_modules` | (`program_id`, `status`, `sequence_no`) | Daftar modul terurut. |
| `mentor_assignments` | (`mentor_id`, `status`), (`student_id`, `status`) | Beban mentor dan mentor murid. |
| `mentor_schedules` | (`mentor_assignment_id`, `start_at`), (`start_at`, `status`) | Kalender dan conflict check. |
| `extracurricular_organizations` | (`status`), (`name`) | Daftar organisasi aktif dan pencarian. |
| `extracurricular_registrations` | (`extracurricular_organization_id`, `status`), (`student_id`, `status`) | Rekap principal dan dashboard murid. |
| `user_organizations` | (`user_id`, `status`), (`extracurricular_organization_id`, `status`) | Organization scoping. |

## 9. Frontend-Only Data Contract

Selama fase FE, schema target di dokumen ini diterjemahkan menjadi TypeScript view models dan typed fixtures, bukan database code. Aturan:

- Page/component mengonsumsi `view model`, bukan row database mentah.
- Fixture disediakan per feature melalui adapter/service mock yang dapat diganti oleh server service nanti.
- ID, status, timestamp, nullable fields, pagination, dan permission flags harus merepresentasikan contract realistis.
- Loading, empty, validation error, permission denied, and success states harus dapat dipicu dari fixture scenario.
- Public catalog fixtures harus mempunyai package slug, listed price/currency, module preview, availability, dan CTA context.
- Registration fixtures harus memisahkan package selection, price snapshot, promo result, dan referral prefill/attribution state.
- Jangan menambahkan Drizzle schema, migration, Better Auth endpoint, atau MySQL connection hanya untuk membuat UI terlihat hidup.

## 10. Migration Notes

### 10.1 Dari snapshot kode saat ini

Snapshot repository belum memiliki ORM/database production. **Jangan menjalankan tahapan berikut pada fase frontend-only.** Saat backend phase disetujui, urutan aman adalah:

1. Install dan konfigurasi Better Auth, Drizzle ORM, Drizzle Kit, `mysql2`, dan Zod.
2. Konfirmasi database dev terpisah dan privilege user Sistem Akademik.
3. Introspeksi tabel bersama yang sudah ada; jangan generate destructive migration terhadap tabel milik Laravel.
4. Generate/reconcile Better Auth Drizzle schema dan map ke naming convention yang disepakati.
5. Buat schema domain secara modular dan migration additive, termasuk `programs.slug/price_*`, registration price snapshot, dan constraint kode referral URL-safe setelah data existing diaudit.
6. Seed role/permission baseline.
7. Jalankan migration hanya pada dev, verifikasi diff SQL, kemudian uji auth/session dan integrity.
8. Buat script terpisah untuk verification, migration, reference seed, dummy seed, dan reset-dev sesuai `DATABASE_CONNECTION_AND_MIGRATION.md`.
9. Terapkan migration artifact yang sama ke production dengan backup, explicit confirmation, dan rollback/forward-fix plan.
10. Jangan memindahkan dummy data dev ke production; production hanya menerima reference seed yang disetujui.


### 10.2 Shared database safeguards

- Buat inventaris tabel yang sudah ada sebelum migration pertama.
- Jangan rename/drop kolom shared tanpa backup, compatibility window, dan koordinasi kedua aplikasi.
- Gunakan migration additive lebih dulu: tambah tabel/kolom nullable, backfill, ubah application code, baru enforce constraint.
- Jangan menjalankan migration otomatis pada `next build`, `next start`, module import, atau request pertama.
- Gunakan migration runner manual/CI-approved dengan single MySQL connection dan explicit production confirmation.
- Catat aplikasi pemilik setiap migration dan tabel.

### 10.3 Destructive changes

Setiap `DROP TABLE`, `DROP COLUMN`, perubahan tipe yang menyempit, atau penambahan `NOT NULL` pada data existing harus mempunyai:

1. Analisis jumlah data terdampak.
2. Backup/restore plan.
3. Backfill script.
4. Rollback atau forward-fix plan.
5. Persetujuan pemilik data.


## 11. Connection, Migration, and Seed Runbook

Implementasi Aiven, environment variables, TLS CA, package scripts, dev-to-prod workflow, seed guard, dan Vercel release procedure mengikuti [`DATABASE_CONNECTION_AND_MIGRATION.md`](DATABASE_CONNECTION_AND_MIGRATION.md). Dokumen tersebut menjadi acuan operasional; dokumen arsitektur ini tetap menjadi acuan entity dan ownership.

## 12. Technical References

- [Better Auth — Drizzle Adapter](https://better-auth.com/docs/adapters/drizzle): map the generated auth models to the agreed Drizzle schema/table names.
- [Better Auth — Database and Schema Generation](https://www.better-auth.com/docs/concepts/database): generate/reconcile the schema from the selected auth configuration before migration.
- [Drizzle ORM — MySQL](https://orm.drizzle.team/docs/get-started/mysql-new): use the `mysql2` driver for MySQL.
- [Drizzle Kit Overview](https://orm.drizzle.team/docs/kit-overview): generate, migrate, and pull/introspect workflows.

- [SAKODE Aiven Database Connection, Migration, and Seeding](DATABASE_CONNECTION_AND_MIGRATION.md): operational connection and release runbook.
