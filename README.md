# Sistem Akademik Sakode Academy

Selamat datang di repositori **Sistem Akademik Sakode Academy**. Proyek ini adalah portal pembelajaran kursus IT terintegrasi yang dirancang untuk mempermudah pendaftaran murid baru, kelas trial, penyediaan modul pembelajaran, serta penjadwalan mentoring sesi 1-on-1 secara cerdas dan efisien.

Saat ini proyek sedang berada dalam fase pra-peluncuran dengan persentase pengembangan **18%** berupa halaman landing page interaktif dengan penghitung waktu mundur (*countdown*) menuju tanggal **10 Juli 2026**, pustaka komponen visual kustom lokal (`@/UI`), dan contoh visual gaya UI (`/ui`).

---

## 🚀 Fitur Utama (Roadmap Pengembangan)
Portal akademik ini dirancang dengan 5 modul utama yang akan dikembangkan secara modular:
1. **Pendaftaran Murid Baru (Student Registration)**: Alur registrasi online yang cepat bagi calon siswa untuk mendaftar kelas pemrograman intensif.
2. **Pendaftaran Trial Gratis (Trial Registration)**: Sistem pemesanan kelas percobaan (*trial class*) secara gratis untuk menguji kurikulum pembelajaran.
3. **Modul Pembelajaran IT (Learning Modules)**: Akses materi kurikulum IT yang terstruktur dari tingkat dasar hingga standar industri.
4. **Plotting & Profil Mentor (Mentor Management)**: Manajemen portofolio mentor industri dengan sistem alokasi/pemasangan mentor ke siswa secara otomatis berdasarkan spesialisasi.
5. **Penjadwalan Mentoring Sesi (Mentor Scheduling)**: Penjadwalan kalender interaktif untuk konsultasi privat 1-on-1 langsung bersama mentor praktisi.

---

## 🛠️ Spesifikasi Teknologi (Tech Stack)
Proyek ini mengadopsi tumpukan teknologi modern fullstack (*Single Repository*):
* **Framework**: Next.js 16.2.9 (App Router & compiler Turbopack)
* **Library**: React 19.2.4
* **Penataan Gaya (CSS)**: Tailwind CSS v4 (Sistem CSS-first dengan variabel terintegrasi)
* **Library Komponen**: HeroUI v3 (Compound components React Aria) & Custom Namespace-Based Local UI Engine (`@/UI`)
* **Animasi**: Framer Motion
* **Tema**: `next-themes` (Mendukung Dark/Light Mode dinamis melalui kelas pada tag `<html>`)
* **Penyimpanan Awal**: Database lokal berbasis berkas JSON (`data/subscribers.json`) untuk menangkap antrean pendaftar email (*early-adopters*).

---

## 📂 Panduan Arsitektur & Struktur Folder
Proyek ini menerapkan **Feature-Based Colocation Architecture** (Arsitektur Berbasis Fitur) secara terpusat langsung di dalam direktori `app/`. Berkas pendukung seperti komponen UI, aksi server, logika bisnis, dan hooks diletakkan sedekat mungkin dengan halaman rute terkait menggunakan konvensi **Private Folders Next.js** (folder yang diawali garis bawah `_`).

Untuk komponen dengan gaya visual khusus (seperti Claymorphism, Neobrutalism, dll.), kodenya dipusahkan ke dalam folder root **`UI/`** yang aman dari deteksi route Next.js dan diimpor menggunakan path alias `@/UI`.

### Struktur Folder Utama:
```
app/
├── _actions/          # Aksi Server global / API Endpoint internal (BE)
│   └── subscribe.ts   # Aksi Server untuk mendaftarkan newsletter
├── _components/       # Komponen UI global / Shared Components (FE)
│   └── WelcomePage.tsx # Implementasi halaman utama "Coming Soon"
├── page.tsx           # Halaman utama di root (mengimpor WelcomePage)
├── layout.tsx         # Tata letak global (pengaturan suppressHydrationWarning)
├── providers.tsx      # Provider next-themes & HeroUI untuk Light/Dark Mode
└── globals.css        # Penyesuaian variabel warna, tema, dan transisi CSS

UI/                    # Custom Visual Component Library (FE/Design System)
├── index.ts           # Pintu masuk utama ekspor (@/UI)
├── shared/            # Berkas pembantu warna dan ikon
├── claymorphism/      # Namespace gaya Claymorphism
├── neobrutalism/      # Namespace gaya Neobrutalism
└── ... gaya lainnya (glassmorphism, bento-grid, dll.)
```

Setiap modul fitur baru (misalnya `/register` untuk pendaftaran siswa) harus mengikuti pola ini:
```
app/register/
├── _actions/          # Aksi Server lokal khusus pendaftaran
├── _components/       # Komponen UI lokal khusus formulir registrasi
├── _services/         # Logika bisnis lokal (validasi database, dll.)
└── page.tsx           # Entry-point rute /register
```

> [!NOTE]
> Panduan arsitektur dan instruksi teknis pengembangan yang sangat mendalam bagi AI Agent atau pengembang baru dapat dibaca secara lengkap di **[AI docs/CONTEXT.md](AI%20docs/CONTEXT.md)**.

---

## 🎨 Token & Warna Merek
Warna merek disesuaikan secara presisi dari berkas desain orisinal `Palette.svg` yang telah dipetakan ke dalam tema Tailwind CSS v4 di `app/globals.css`:
* 🟥 **sakode-pink**: `#FF409F`
* 🟧 **sakode-orange**: `#F9723B`
* 🟨 **sakode-yellow** (Gold/Primary): `#EDAC1C`
* 🟦 **sakode-blue**: `#54A5E4`
* 🟩 **sakode-green**: `#009670`
* 🪼 **sakode-cyan**: `#71CFFE`
* ⬛ **sakode-charcoal**: `#383838`

---

## 💻 Memulai Pengembangan Lokal

### 1. Prasyarat
Pastikan Anda telah menginstal [Node.js](https://nodejs.org) (rekomendasi versi LTS 18 ke atas atau 20+).

### 2. Instalasi Dependensi
Jalankan perintah berikut di terminal root proyek:
```bash
npm install
```

### 3. Menjalankan Server Pengembangan
Nyalakan server lokal untuk memulai aktivitas koding:
```bash
npm run dev
```
Buka peramban dan akses **[http://localhost:3000](http://localhost:3000)**.

### 4. Melakukan Kompilasi Produksi (Build)
Untuk memverifikasi tipe data TypeScript, validasi linter, dan menguji build produksi Next.js:
```bash
npm run build
```

---

## 🔑 Akses Demo & Uji Coba (Sandbox RBAC)
Untuk mempermudah demonstrasi visual kepada klien, portal ini dilengkapi dengan **Aesthetics Configurator (FAB)** dan **Quick Login Sandbox** di halaman login.

### 👥 Kredensial Akun Percobaan (Dummy Data):
Anda dapat mengklik tombol *Quick Login* di halaman `/login` untuk masuk secara otomatis, atau mengetikkan email percobaan berikut (password bebas):

| Peran (Role) | Nama Pengguna | E-mail Uji Coba | Deskripsi Tampilan Widget Dasbor |
| :--- | :--- | :--- | :--- |
| **Admin** | Super Admin Sakode | `admin@sakode.com` | Ringkasan stats server, tindakan cepat sistem, log audit aktivitas. |
| **Mentor Lead** | Hamzah Mentor Lead | `hamzah@sakode.com` | Antrean siswa baru belum di-plot, kapasitas kapasitas mentor bimbingan. |
| **Mentor** | Udin Mentor React | `udin@sakode.com` | Jadwal bimbingan harian, antrean penilaian tugas coding, jam mengajar. |
| **Murid** | Panjul Siswa Baru | `panjul@gmail.com` | Progres kurikulum IT, jadwal mentoring terdekat, modul belajar aktif. |

### 🛠️ Aesthetics Configurator (FAB):
* Terletak di kanan bawah layar (dapat digeser/di-drag secara bebas).
* Memungkinkan pengubahan **Gaya Visual UI** (Claymorphism, Neobrutalism, Glassmorphism, dll.) secara instan untuk seluruh website.
* Memungkinkan pengujian **Kustom Warna Branding**: Anda dapat memasukkan kode Hex (misal: `#BC71FE`) atau memilih dari roda warna untuk mengubah warna *Primer*, *Sekunder*, dan *Aksen* secara global pada seluruh elemen dasbor saat itu juga.

---

## 💾 Penyimpanan Data Subs
Pendaftaran email melalui formulir "Dapatkan Notifikasi" saat ini diproses secara aman di sisi server menggunakan *Server Action* Next.js, dan data email akan disimpan ke dalam berkas JSON lokal pada path **`data/subscribers.json`**. 

Format penyimpanan berkas:
```json
[
  "user1@example.com",
  "user2@example.com"
]
```

Ke depan, database akan dimigrasikan menggunakan ORM modern seperti Drizzle atau Prisma setelah skema disepakati dan diimplementasikan.

