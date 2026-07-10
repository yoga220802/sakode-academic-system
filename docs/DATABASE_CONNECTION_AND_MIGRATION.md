# SAKODE Academic System — Aiven Database Connection, Migration, and Seeding

**Version:** 0.5  
**Updated:** 30 Juni 2026  
**Target:** Aiven for MySQL, Drizzle ORM, `mysql2`, Next.js App Router  
**Status:** Backend implementation blueprint; belum diaktifkan pada fase frontend-only

## 1. Tujuan

Dokumen ini menjadi panduan teknis untuk:

- Menghubungkan project Next.js SAKODE Academic System ke Aiven for MySQL secara aman.
- Memisahkan koneksi database development dan production.
- Membuat dan menyimpan migration SQL menggunakan Drizzle Kit.
- Menjalankan migration yang sama dari development ke production.
- Memisahkan seed data referensi dari dummy data development.
- Mencegah migration atau dummy seed production berjalan tanpa persetujuan eksplisit.

> **Keputusan utama:** perubahan struktur database dipromosikan melalui file migration yang tersimpan di Git. Database development tidak disalin langsung ke production. Migration mengubah **schema**, sedangkan data referensi dan dummy data dijalankan melalui script seed yang terpisah.

## 2. Keputusan Arsitektur

| Concern | Decision |
|---|---|
| Database provider | Aiven for MySQL |
| Environment | Development dan production terisolasi |
| ORM | Drizzle ORM |
| Driver | `mysql2` |
| Schema source of truth | Drizzle schema untuk tabel milik Sistem Akademik |
| Migration method | `drizzle-kit generate` + migration runner |
| Production migration | Manual/CI-controlled, bukan otomatis saat aplikasi start/build |
| Development dummy data | Script `seed-dev` terpisah dan deterministic |
| Production seed | Hanya reference seed yang idempotent; dummy seed dilarang |
| Shared-table ownership | Satu migration owner per tabel |
| TLS | Wajib menggunakan koneksi terenkripsi dan verifikasi CA Aiven |

## 3. Topologi Database Aiven

### 3.1 Rekomendasi lingkungan

Gunakan resource dan credential berbeda untuk setiap environment:

| Environment | Database | User aplikasi | Penggunaan |
|---|---|---|---|
| Development | `sakode_academic_dev` | akun khusus Sistem Akademik dev | Local development dan Vercel Preview |
| Production | `sakode_academic_prod` | akun khusus Sistem Akademik prod | Vercel Production |

Isolasi paling kuat adalah menggunakan **Aiven service terpisah** untuk dev dan prod. Bila keterbatasan paket mengharuskan satu service, gunakan database/logical schema dan user yang berbeda, dengan privilege sesempit mungkin.

Bila Sistem Informasi Laravel ikut memakai service/database yang sama:

- Gunakan user database berbeda untuk Laravel dan Next.js.
- Tetapkan pemilik migration per tabel.
- Jangan memberi user Sistem Akademik hak mengubah tabel milik Sistem Informasi bila hanya membutuhkan read access.

### 3.2 Informasi koneksi dari Aiven

Dari halaman **Overview** service Aiven, ambil:

- Host.
- Port.
- Database name.
- Username.
- Password.
- Service URI bila tersedia.
- CA certificate (`ca.pem`).

CA certificate digunakan agar client memverifikasi sertifikat TLS service Aiven, bukan sekadar mengenkripsi koneksi tanpa validasi server.

## 4. Environment Variables

### 4.1 Variabel minimum

Gunakan secret server-only berikut:

```env
DATABASE_URL=mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
DATABASE_CA_CERT="-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----"
DATABASE_POOL_LIMIT=5
APP_ENV=development
```

Untuk production:

```env
APP_ENV=production
CONFIRM_PROD_MIGRATION=
CONFIRM_PROD_REFERENCE_SEED=
```

Aturan:

- Jangan memakai prefix `NEXT_PUBLIC_` untuk credential database.
- Jangan commit `.env*` yang berisi password atau URI production.
- Password yang mempunyai karakter khusus harus di-URL-encode bila disimpan dalam `DATABASE_URL`.
- Untuk local development, CA dapat disimpan sebagai file lokal yang diabaikan Git atau sebagai isi PEM di environment variable.
- Untuk Vercel, simpan `DATABASE_URL` dan `DATABASE_CA_CERT` di Environment Variables terpisah untuk Preview dan Production.

### 4.2 File environment lokal yang disarankan

```text
.env.database.dev       # ignored by Git
.env.database.prod      # optional for controlled local release; ignored by Git
.env.database.example   # committed, tanpa secret
```

Contoh `.env.database.example`:

```env
DATABASE_URL=mysql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
DATABASE_CA_CERT="-----BEGIN CERTIFICATE-----\nREPLACE_ME\n-----END CERTIFICATE-----"
DATABASE_POOL_LIMIT=5
APP_ENV=development
CONFIRM_PROD_MIGRATION=
CONFIRM_PROD_REFERENCE_SEED=
```

## 5. Struktur Folder Target

Struktur backend database yang disarankan ketika backend phase dibuka:

```text
src/
└── db/
    ├── client.ts
    ├── connection-options.ts
    ├── schema/
    │   ├── owned/
    │   │   ├── auth.ts
    │   │   ├── access.ts
    │   │   ├── registrations.ts
    │   │   ├── referrals.ts
    │   │   ├── mentors.ts
    │   │   └── extracurriculars.ts
    │   ├── external/
    │   │   ├── programs.ts
    │   │   └── promos.ts
    │   └── index.ts
    └── relations.ts

scripts/
└── db/
    ├── migrate.ts
    ├── seed-reference.ts
    ├── seed-dev.ts
    ├── reset-dev.ts
    └── verify-connection.ts

drizzle/
└── <timestamp>_<migration-name>/
    ├── migration.sql
    └── snapshot.json

drizzle.config.ts
```

### 5.1 Pemisahan `owned` dan `external`

- `schema/owned/**` berisi tabel yang migration-nya dimiliki Sistem Akademik.
- `schema/external/**` berisi mapping type-safe untuk tabel milik Laravel atau sistem lain.
- Drizzle Kit generation hanya diarahkan ke `schema/owned/**`.
- Tabel external boleh di-query, tetapi tidak boleh ikut menghasilkan migration dari project Next.js.

Ini mencegah Drizzle menghasilkan `ALTER` atau `DROP` terhadap tabel shared yang migration history-nya dikelola Laravel.

## 6. Koneksi Runtime Next.js

### 6.1 Prinsip

- Modul database harus server-only.
- Gunakan Node.js runtime untuk code yang mengakses MySQL.
- Gunakan pool untuk query aplikasi.
- Gunakan single connection untuk DDL migration.
- Jangan membuat koneksi baru pada setiap query.
- Jangan mengirim object database atau secret ke Client Component.

### 6.2 Contoh connection options dengan CA Aiven

Contoh target, bukan file yang sudah diimplementasikan:

```ts
// src/db/connection-options.ts
import "server-only";
import type { PoolOptions } from "mysql2/promise";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export function getDatabaseConnectionOptions(): PoolOptions {
  const url = new URL(required("DATABASE_URL"));
  const ca = required("DATABASE_CA_CERT").replace(/\\n/g, "\n");

  return {
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ""),
    ssl: {
      ca,
      rejectUnauthorized: true,
    },
    connectionLimit: Number(process.env.DATABASE_POOL_LIMIT || 5),
    enableKeepAlive: true,
  };
}
```

```ts
// src/db/client.ts
import "server-only";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { getDatabaseConnectionOptions } from "./connection-options";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  sakodePool?: mysql.Pool;
};

const pool =
  globalForDb.sakodePool ?? mysql.createPool(getDatabaseConnectionOptions());

if (process.env.NODE_ENV !== "production") {
  globalForDb.sakodePool = pool;
}

export const db = drizzle({ client: pool, schema });
```

Untuk Route Handler yang menggunakan database:

```ts
export const runtime = "nodejs";
```

## 7. Drizzle Configuration

### 7.1 Konfigurasi generation

Migration harus dihasilkan hanya dari schema yang dimiliki Sistem Akademik:

```ts
// drizzle.config.ts
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "mysql",
  schema: "./src/db/schema/owned/**/*.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  breakpoints: true,
});
```

Catatan:

- Untuk shared database, lakukan introspeksi ke folder sementara dan review hasilnya secara manual.
- Jangan menjadikan seluruh hasil introspeksi sebagai schema migration owner.
- `drizzle-kit push` tidak digunakan untuk production karena tidak menghasilkan migration artifact yang dapat dipromosikan dan direview.

## 8. Script yang Dipisahkan

### 8.1 Target `package.json`

Ketika backend phase dibuka, tambahkan script terpisah seperti berikut:

```json
{
  "scripts": {
    "db:verify:dev": "tsx scripts/db/verify-connection.ts dev",
    "db:verify:prod": "tsx scripts/db/verify-connection.ts prod",
    "db:generate": "drizzle-kit generate --config=drizzle.config.ts",
    "db:check": "drizzle-kit check --config=drizzle.config.ts",
    "db:migrate:dev": "tsx scripts/db/migrate.ts dev",
    "db:migrate:prod": "tsx scripts/db/migrate.ts prod",
    "db:seed:reference:dev": "tsx scripts/db/seed-reference.ts dev",
    "db:seed:reference:prod": "tsx scripts/db/seed-reference.ts prod",
    "db:seed:dev": "tsx scripts/db/seed-dev.ts",
    "db:reset:dev": "tsx scripts/db/reset-dev.ts"
  }
}
```

Tujuan pemisahan:

- `db:generate` hanya menghasilkan migration SQL.
- `db:migrate:*` hanya menerapkan migration yang belum dijalankan.
- `db:seed:reference:*` hanya memasukkan data master/reference yang aman dan idempotent.
- `db:seed:dev` hanya memasukkan dummy data development.
- `db:reset:dev` hanya menghapus dan membangun ulang database development.

### 8.2 Migration runner

`migrate.ts` harus:

1. Menerima target `dev` atau `prod`.
2. Memuat env sesuai target.
3. Memastikan database name sesuai environment.
4. Membuka single MySQL connection.
5. Menjalankan migration dari folder `drizzle/`.
6. Menutup connection pada success maupun failure.
7. Menolak production bila confirmation token tidak cocok.

Guard yang disarankan:

```ts
if (
  target === "prod" &&
  process.env.CONFIRM_PROD_MIGRATION !== "SAKODE_PROD_MIGRATE"
) {
  throw new Error("Production migration requires explicit confirmation.");
}
```

Tambahkan validasi kedua:

```ts
if (target === "prod" && !databaseName.endsWith("_prod")) {
  throw new Error("Production target does not point to a production database.");
}
```

### 8.3 Reference seed

`seed-reference.ts` berisi data yang memang dibutuhkan sistem, misalnya:

- Role: `admin`, `mentor_lead`, `mentor`, `student`, `school_principal`.
- Permission baseline.
- Status/master records yang benar-benar disepakati.

Reference seed harus:

- Idempotent menggunakan upsert/insert-ignore yang aman.
- Tidak membuat user dummy.
- Tidak menimpa perubahan admin tanpa aturan eksplisit.
- Boleh dijalankan di production hanya dengan confirmation token.

### 8.4 Development dummy seed

`seed-dev.ts` berisi data showcase dan testing, misalnya:

- Akun role dummy.
- Paket dan modul contoh.
- Pendaftaran murid berbagai status.
- Referral program dan referral link contoh.
- Trial registration.
- Mentor assignment dan schedule.
- Ekskul serta registration contoh.

Aturan:

- Gunakan seed deterministic agar hasil konsisten antardeveloper.
- Hanya boleh berjalan bila `APP_ENV=development` dan database name berakhiran `_dev`.
- Password dummy tidak disimpan plaintext; pembuatan account mengikuti API/schema Better Auth yang aktif.
- Script harus gagal keras bila diarahkan ke production.

Drizzle menyediakan `drizzle-seed` untuk data deterministic, tetapi domain seed manual tetap dapat digunakan bila relasi bisnis membutuhkan kontrol lebih rinci.

### 8.5 Reset development

`reset-dev.ts` bersifat destructive dan harus:

- Menolak semua database yang tidak berakhiran `_dev`.
- Memerlukan confirmation argument, misalnya `RESET_SAKODE_DEV`.
- Membersihkan tabel dalam urutan foreign key yang aman atau membuat ulang database development.
- Menjalankan migration, reference seed, lalu dummy seed.

Tidak boleh ada script `db:reset:prod`.

## 9. Workflow Development ke Production

### 9.1 Membuat perubahan schema

1. Ubah file Drizzle schema di `src/db/schema/owned/**`.
2. Jalankan:

```bash
npm run db:generate -- --name=add_referral_attribution
```

3. Review `migration.sql` secara manual.
4. Jalankan migration check.
5. Commit schema, snapshot, dan migration SQL dalam commit yang sama.

### 9.2 Menerapkan pada development

```bash
npm run db:verify:dev
npm run db:migrate:dev
npm run db:seed:reference:dev
npm run db:seed:dev
```

Kemudian jalankan test aplikasi dan integrity checks.

### 9.3 Mempromosikan ke production

1. Pastikan commit migration sudah melewati dev/staging.
2. Pastikan migration folder pada release sama persis dengan yang diuji di dev.
3. Buat atau verifikasi backup production.
4. Review query destructive, lock risk, dan estimasi dampak.
5. Set confirmation token hanya untuk release tersebut.
6. Jalankan:

```bash
npm run db:verify:prod
npm run db:migrate:prod
npm run db:seed:reference:prod
```

7. Jalankan smoke test.
8. Hapus/rotate confirmation token setelah selesai.

> Jangan menjalankan `db:seed:dev` pada production. Jangan menyalin seluruh data dummy development ke production.

## 10. Deployment Vercel

### 10.1 Environment mapping

| Vercel environment | Database target |
|---|---|
| Local Development | Aiven development |
| Preview | Aiven development atau staging |
| Production | Aiven production |

Jangan mengarahkan Preview deployment ke production database.

### 10.2 Migration execution

Migration production tidak dijalankan dari:

- `next build`.
- `next start`.
- Module import aplikasi.
- Request pertama setelah deployment.

Alasannya: build/deployment dapat berjalan lebih dari sekali atau paralel. Gunakan salah satu:

- Manual release command dari workstation/admin runner.
- CI job khusus yang memerlukan approval.
- Dedicated migration job sebelum traffic dialihkan.

## 11. Shared Database dengan Laravel

Aturan wajib:

1. Setiap tabel mempunyai satu migration owner.
2. Migration Next.js hanya mencakup tabel Sistem Akademik.
3. Mapping Drizzle untuk tabel Laravel ditempatkan sebagai `external` dan tidak masuk schema generation.
4. Laravel tidak membuat migration tandingan untuk tabel milik Next.js.
5. Perubahan kontrak shared table harus direview kedua aplikasi.
6. Rename/drop dilakukan setelah compatibility window dan backfill.

Contoh ownership:

| Table | Owner migration |
|---|---|
| `programs` | Ditentukan bersama; satu owner saja |
| `promos` | Sistem Informasi bila dikelola Laravel |
| `student_registrations` | Sistem Akademik Next.js |
| `referral_*` | Sistem Akademik Next.js |
| `mentor_*` | Sistem Akademik Next.js |
| `extracurricular_*` | Sistem Akademik Next.js |

## 12. Security Checklist

- [ ] Credential dev dan prod berbeda.
- [ ] User database memakai least privilege.
- [ ] TLS aktif dan CA Aiven diverifikasi.
- [ ] Secret tidak memakai prefix `NEXT_PUBLIC_`.
- [ ] Secret tidak berada di Git, log, screenshot, atau client bundle.
- [ ] Production migration membutuhkan explicit confirmation.
- [ ] Dummy seed mempunyai hard guard terhadap production.
- [ ] Migration SQL direview sebelum diterapkan.
- [ ] Backup production diverifikasi sebelum perubahan berisiko.
- [ ] Shared-table ownership terdokumentasi.
- [ ] Connection pool limit disesuaikan dengan limit Aiven dan pola deployment serverless.

## 13. Acceptance Criteria untuk Backend Database Slice

Backend database foundation dinyatakan siap direview bila:

- Aiven dev dapat dihubungi melalui script verify tanpa membocorkan secret.
- TLS CA verification aktif.
- Drizzle schema modular dan hanya mencakup owned tables untuk migration generation.
- Migration pertama dapat di-generate dan diterapkan ke database development kosong.
- Menjalankan migration dua kali tidak mengulang migration yang sama.
- Reference seed dapat dijalankan ulang tanpa duplicate/error.
- Dummy seed menghasilkan dataset development yang konsisten.
- Dummy seed menolak database production.
- Production migration menolak berjalan tanpa confirmation token.
- Tidak ada migration atau seed production yang berjalan otomatis pada Next.js build/start.

## 14. Open Decisions

1. Apakah dev dan prod menggunakan service Aiven terpisah atau satu service dengan database terpisah?
2. Siapa migration owner final untuk `programs` dan `promos`?
3. Apakah Vercel Preview memakai dev database yang sama atau staging database tersendiri?
4. Apakah production migration dijalankan manual atau melalui CI approval job?
5. Berapa connection pool limit aman berdasarkan plan Aiven yang dipilih?
6. Apakah primary key final menggunakan `BIGINT`, UUID, atau ULID?

## 15. Referensi Teknis

- Aiven MySQL connection information and CLI: https://aiven.io/docs/products/mysql/howto/connect-from-cli
- Aiven TLS/SSL certificates: https://aiven.io/docs/platform/concepts/tls-ssl-certificates
- Drizzle MySQL connection with `mysql2`: https://orm.drizzle.team/docs/get-started-mysql
- Drizzle Kit generation: https://orm.drizzle.team/docs/drizzle-kit-generate
- Drizzle Kit migration: https://orm.drizzle.team/docs/drizzle-kit-migrate
- Drizzle Seed: https://orm.drizzle.team/docs/seed-overview
- Next.js data security and server-only secrets: https://nextjs.org/docs/app/guides/data-security
