# SAKODE Academic System — Software Requirements Specification

**Versi:** 0.5  
**Tanggal baseline:** 9 Juli 2026  
**Status:** Baseline aktif — fase implementasi Frontend dan review per feature-role

## 1. Document Overview

### 1.1 Tujuan

Dokumen ini mendefinisikan kebutuhan fungsional dan nonfungsional untuk **Sistem Akademik SAKODE Academy**. Dokumen menjadi acuan bersama bagi pemilik produk, pengembang, penguji, administrator, mentor, dan AI coding agent selama implementasi.

### 1.2 Ruang lingkup produk

Sistem Akademik mendukung siklus operasional peserta didik, mulai dari katalog publik paket belajar dan harga, pembuatan akun, pemilihan paket saat pendaftaran, validasi promo, atribusi referral melalui kode maupun tautan berbagi, pendaftaran trial, akses modul pembelajaran, plotting mentor, penjadwalan mentoring, hingga pengelolaan dan pemantauan program ekstrakurikuler.

Sistem menggunakan **MySQL**, **Drizzle ORM**, dan **Better Auth** sebagai target autentikasi produksi, serta dirancang dengan **role-based access control (RBAC)**. Frontend dan backend disimpan dalam satu project Next.js App Router. Berdasarkan arsitektur saat ini, Sistem Akademik dan Sistem Informasi dapat memakai basis data yang sama. Fitur publik milik Sistem Informasi tidak dibahas dalam dokumen ini, tetapi batas kepemilikan data bersama—terutama data program dan promo—tetap harus dijaga.

Implementasi berjalan secara bertahap. Fase aktif saat dokumen ini diperbarui adalah **Frontend-first**: satu feature untuk satu role dikerjakan sebagai satu review slice, lalu dihentikan untuk review pemilik produk sebelum agent melanjutkan ke slice berikutnya.

### 1.3 Audiens

- Product owner dan manajemen SAKODE.
- Pengembang frontend, backend, dan database.
- QA atau penguji.
- Admin, Mentor Lead, Mentor, dan Kepala Sekolah.
- AI coding agent yang membantu implementasi.

### 1.4 Istilah

| Istilah | Definisi |
|---|---|
| Calon Murid | Pengguna yang belum memiliki status murid aktif dan dapat melakukan pendaftaran program atau trial. |
| Murid | Pengguna yang telah diterima atau diaktifkan pada program pembelajaran. |
| Plotting Mentor | Proses penetapan mentor kepada murid atau pendaftaran program tertentu. |
| Organisasi Ekskul | Sekolah atau organisasi yang menjalankan program ekstrakurikuler bersama SAKODE. |
| Pendaftaran Ekskul | Pendaftaran murid ke organisasi/program ekstrakurikuler yang tersedia. |
| Program/Paket Belajar | Produk akademik yang dijual kepada calon murid. Satu paket mempunyai harga dan dapat memuat beberapa modul pembelajaran. |
| Referral Link | Tautan publik yang membawa kode referral, misalnya `/register?ref=KODE`, agar konteks referral dapat diprefill pada alur pendaftaran. |
| Kepala Sekolah | Pengguna yang terhubung ke sekolah/organisasi tertentu dan memperoleh akses baca terhadap informasi ekskul pada lingkup organisasinya. |
| RBAC | Pengendalian akses berdasarkan role dan permission. |

### 1.5 Keputusan Teknis dan Delivery yang Dikunci

| Area | Keputusan |
|---|---|
| Fullstack architecture | Frontend dan backend berada dalam satu project Next.js App Router. |
| Authentication target | Better Auth dengan email/password dan database-backed session. Implementasi backend belum menjadi scope fase FE aktif. |
| ORM target | Drizzle ORM dengan driver MySQL `mysql2`. |
| Validation target | Zod untuk kontrak form, action, dan integration endpoint. |
| UI default | `sakode-modern`. |
| Development showcase | `StyleSwitcherFAB` tetap aktif selama development agar style, preset warna, dan custom brand color dapat dibandingkan dengan stakeholder. |
| Layout direction | Dashboard modern yang nyaman dan data-oriented, mengambil inspirasi struktur dari TailAdmin tanpa menyalin template secara literal. |
| Delivery control | Satu feature × satu role per review slice. Agent wajib berhenti setelah lint/build dan laporan review. |
| Current phase | Frontend only: UI, interaction, state, responsive behavior, accessibility, typed fixture/mock contract. Tidak membuat migration, database query, auth produksi, atau public API kecuali diminta eksplisit. |

## 2. System Scope

### 2.1 Termasuk dalam ruang lingkup

- Registrasi akun dan autentikasi pengguna.
- Otorisasi berbasis role dan pembatasan data berdasarkan organisasi.
- Landing page akademik yang menampilkan paket/program yang dijual, harga, dan ringkasan modul yang termasuk.
- Pendaftaran murid ke program akademik dengan pemilihan paket wajib.
- Validasi promo pada pendaftaran.
- Program referral pendaftaran yang dikelola Admin, termasuk kode, tautan berbagi, prefill referral, dan pemantauan atribusi pendaftaran.
- Pendaftaran kelas trial.
- Informasi program dan modul pembelajaran.
- Informasi mentor, plotting mentor, dan jadwal mentoring.
- Panel Admin, Mentor Lead, Mentor, Murid, dan Kepala Sekolah.
- Pendaftaran/pengelolaan organisasi ekskul.
- Pendaftaran murid ke ekskul.
- Informasi dan laporan ekskul untuk Kepala Sekolah secara read-only.
- Dashboard shell responsif, role navigation, UI states, dan komponen reusable untuk seluruh role.
- Development-only style/color showcase melalui FAB.
- Integration API terproteksi dan versioned untuk kebutuhan pertukaran data dengan Sistem Informasi pada fase backend berikutnya.

### 2.2 Di luar ruang lingkup

- Company profile, berita/kegiatan publik, dan halaman informasi publik umum milik Sistem Informasi. Landing page katalog paket dan entry pendaftaran Sistem Akademik tetap termasuk scope.
- Implementasi CMS publik.
- Pembuatan promo dari sisi Sistem Informasi, kecuali kontrak data yang diperlukan untuk validasi promo.
- Sistem pembayaran, invoice, dan akuntansi, sampai ada requirement eksplisit.
- Detail presensi, penilaian, sertifikat, portofolio, atau gamifikasi sebagai kebutuhan final. Elemen tersebut sudah muncul pada prototipe UI, tetapi status bisnisnya masih perlu dikonfirmasi.

## 3. Actors and Roles

| Role | Tanggung jawab dan tindakan yang diizinkan | Pembatasan utama |
|---|---|---|
| **Calon Murid** | Melihat katalog paket dan harga, membuka tautan referral, membuat akun, memilih paket yang akan dibeli/diikuti, mendaftar program, memakai kode promo, dan mendaftar trial. | Tidak dapat mengakses data murid lain, pengelolaan mentor, atau panel internal. |
| **Murid** | Melihat data dirinya, program aktif, modul yang diberikan, mentor, jadwal, status pendaftaran, serta mendaftar ekskul yang tersedia. | Hanya dapat membaca atau mengubah data miliknya sesuai periode yang diizinkan. |
| **Admin** | Mengelola pengguna, pendaftaran, katalog paket/harga, program referral, kode dan tautan referral, program/modul, mentor, plotting, jadwal, organisasi ekskul, dan status pendaftaran. | Aksi sensitif harus tervalidasi dan dapat diaudit. Hak lintas organisasi hanya diberikan bila memang menjadi admin pusat. |
| **Mentor Lead** | Melihat antrean murid, data mentor, beban mentor, melakukan atau membantu plotting, dan mengelola jadwal pada lingkup yang diberikan. Secara default dibatasi per domain pengajaran, namun jika memiliki flag `is_global_lead` aktif, ia dapat mengelola semua mentor & domain tanpa hak akses administrative Admin. | Tidak dapat mengubah konfigurasi sistem, melihat data keuangan/audit log, atau mengubah role pengguna kecuali diberi permission khusus. |
| **Mentor** | Melihat profil dan penugasan sendiri, murid yang ditugaskan, serta jadwal mentoring sendiri. | Tidak dapat melihat data mentor/murid di luar penugasannya atau mengubah role. |
| **Kepala Sekolah** | Melihat organisasi/sekolah yang terhubung, informasi ekskul, daftar/rekap peserta, status program, dan laporan pada lingkup sekolahnya. | **Read-only secara default**; tidak dapat membuat, mengubah, menyetujui, atau menghapus data ekskul sampai ada requirement baru. |
| **Referrer (Mitra Kemitraan)** | Mendaftar sebagai mitra melalui landing page `/referral`; mendapatkan link rujukan kanonis; memantau statistik konversi, komisi, dan riwayat payout melalui dashboard portal referrer. Self-referral diperbolehkan. | Tidak mengakses data murid lain, panel admin, atau fitur akademik internal. Jika memiliki role akademik lain (murid/mentor), dapat berpindah portal melalui switcher di Header. |

> **Catatan role**: Prototipe saat ini menggunakan satu role per sesi (`admin`, `mentor`, `murid`, `school_principal`, `referrer`). Role `mentor_lead` digabung ke direktori `(mentor)`. Desain target mendukung satu pengguna memiliki **lebih dari satu role** — terutama kombinasi role akademik + `referrer`. Saat login dengan dual-role, pengguna masuk ke portal utama terlebih dahulu; switcher Header menyediakan akses ke Portal Referrer.

## 4. Functional Requirements

### 4.1 Authentication and Authorization

#### FR-001 — Registrasi Akun

- **Fitur terkait:** FEAT-001
- **Aktor utama:** Calon Murid
- **Deskripsi:** Pengguna dapat membuat akun menggunakan nama, email, kata sandi, dan persetujuan syarat.
- **Prasyarat:** Email belum digunakan; halaman registrasi tersedia.
- **Alur utama:** Pengguna mengisi formulir → sistem memvalidasi input → kata sandi disimpan secara aman → akun dibuat → pengguna diarahkan ke login atau proses verifikasi.
- **Alur alternatif/gagal:** Field kosong, format email salah, email duplikat, atau kata sandi tidak memenuhi kebijakan; sistem menolak dan menampilkan pesan yang aman.
- **Pascakondisi:** Akun tercatat dengan status yang sesuai, tanpa otomatis memperoleh hak internal.
- **Kriteria penerimaan:** Data wajib tervalidasi di server; email unik; kata sandi tidak tersimpan dalam bentuk plaintext; role default tidak dapat dimanipulasi dari client.

#### FR-002 — Login dan Logout

- **Fitur terkait:** FEAT-001
- **Aktor utama:** Semua pengguna terdaftar
- **Deskripsi:** Pengguna dapat masuk dengan kredensial valid dan keluar dari sesi.
- **Prasyarat:** Akun aktif dan tidak diblokir.
- **Alur utama:** Pengguna mengirim kredensial → sistem memverifikasi → sistem membuat sesi aman → pengguna diarahkan ke panel sesuai hak akses.
- **Alur alternatif/gagal:** Kredensial salah atau akun tidak aktif; sistem menolak tanpa mengungkap detail sensitif.
- **Pascakondisi:** Sesi aktif saat login atau dihentikan saat logout.
- **Kriteria penerimaan:** Otorisasi tidak bergantung pada `localStorage`; sesi dapat dicabut; route internal terlindungi di server.

#### FR-003 — RBAC dan Data Scoping

- **Fitur terkait:** FEAT-002
- **Aktor utama:** Sistem/Admin
- **Deskripsi:** Sistem harus membatasi menu, operasi, dan data berdasarkan role, permission, penugasan, dan organisasi pengguna.
- **Prasyarat:** Pengguna terautentikasi dan memiliki role aktif.
- **Alur utama:** Setiap request diperiksa di server → permission dan lingkup data dihitung → request diizinkan atau ditolak.
- **Alur alternatif/gagal:** Pengguna mencoba akses di luar izin; sistem mengembalikan status terlarang dan tidak membocorkan data.
- **Pascakondisi:** Hanya data yang diotorisasi yang dikembalikan.
- **Kriteria penerimaan:** Menyembunyikan menu di UI tidak dianggap cukup; semua operasi write dan query sensitif mempunyai pemeriksaan server-side.

### 4.2 Student Registration

#### FR-004 — Melihat Program yang Dapat Didaftarkan

- **Fitur terkait:** FEAT-003, FEAT-006, FEAT-024
- **Aktor utama:** Calon Murid/Murid
- **Deskripsi:** Pengguna dapat melihat paket/program yang aktif, harga publik, dan ringkasan modul yang termasuk sebelum memulai pendaftaran.
- **Prasyarat:** Program telah tersedia, mempunyai informasi harga yang dapat ditampilkan, dan berstatus published/aktif.
- **Alur utama:** Sistem menampilkan nama paket, ringkasan, harga dan mata uang, periode pendaftaran, daftar/ringkasan modul, serta CTA untuk memilih paket dan mendaftar.
- **Alur alternatif/gagal:** Tidak ada program aktif atau harga belum dapat dipublikasikan; sistem menampilkan keadaan kosong/TBD yang jelas dan tidak menawarkan CTA yang menyesatkan.
- **Pascakondisi:** Pilihan paket dapat dibawa sebagai konteks awal ke alur pendaftaran tanpa langsung membuat transaksi.
- **Kriteria penerimaan:** Program nonaktif atau belum dipublikasikan tidak dapat dipilih; harga tidak dihitung dari nilai buatan client; CTA membawa identifier/slug paket yang valid.

#### FR-005 — Mengajukan Pendaftaran Murid

- **Fitur terkait:** FEAT-003, FEAT-023, FEAT-024
- **Aktor utama:** Calon Murid
- **Deskripsi:** Calon murid dapat mengirim pendaftaran ke satu paket/program akademik yang dipilih. Pemilihan paket merupakan field wajib.
- **Prasyarat:** Akun valid; paket/program terbuka; harga dan modul paket dapat ditinjau; persyaratan wajib terpenuhi.
- **Alur utama:** Pengguna membuka pendaftaran dari landing page atau tautan referral → sistem memprefill paket dan/atau kode referral bila tersedia → pengguna meninjau atau memilih paket → mengisi data pendaftaran → opsional memasukkan promo → sistem memvalidasi paket, harga, promo, dan referral secara terpisah → pendaftaran disimpan.
- **Alur alternatif/gagal:** Paket belum dipilih, periode ditutup, data wajib tidak lengkap, pendaftaran duplikat aktif, harga/program berubah, promo tidak valid, atau referral tidak valid; sistem meminta koreksi dengan pesan spesifik tanpa menyamakan referral dengan promo.
- **Pascakondisi:** Pendaftaran memiliki paket terpilih, snapshot harga yang berlaku, status awal yang terdefinisi, dan atribusi referral bila valid.
- **Kriteria penerimaan:** Submit ditolak tanpa paket; request idempotent atau terlindung dari submit ganda; pengguna dapat melihat paket, harga, referral, nomor, dan status pendaftaran.

#### FR-006 — Meninjau dan Memperbarui Status Pendaftaran

- **Fitur terkait:** FEAT-003, FEAT-010
- **Aktor utama:** Admin
- **Deskripsi:** Admin dapat melihat daftar pendaftaran dan mengubah status sesuai alur yang disetujui.
- **Prasyarat:** Admin terautentikasi dan memiliki permission pendaftaran.
- **Alur utama:** Admin memfilter pendaftaran → membuka detail → melakukan verifikasi/keputusan → sistem mencatat perubahan.
- **Alur alternatif/gagal:** Transisi status tidak valid atau data berubah bersamaan; sistem menolak dan meminta refresh.
- **Pascakondisi:** Status, waktu, dan aktor perubahan tercatat.
- **Kriteria penerimaan:** Hanya transisi status yang diizinkan; riwayat atau audit perubahan tersedia minimal untuk aksi penting.

### 4.3 Promo Validation

#### FR-007 — Validasi Promo

- **Fitur terkait:** FEAT-004
- **Aktor utama:** Calon Murid/Murid
- **Deskripsi:** Sistem memvalidasi kode promo ketika pengguna memilih menggunakannya pada pendaftaran.
- **Prasyarat:** Promo tersedia di database bersama dan dapat dibaca Sistem Akademik.
- **Alur utama:** Pengguna memasukkan kode → sistem memeriksa status, periode berlaku, target program, dan aturan yang terkonfigurasi → hasil validasi ditampilkan.
- **Alur alternatif/gagal:** Kode tidak ditemukan, belum aktif, kedaluwarsa, tidak berlaku untuk program, atau batas penggunaan tercapai; sistem menolak tanpa mengubah sumber promo.
- **Pascakondisi:** Promo valid dapat diasosiasikan dengan pendaftaran; belum dianggap terpakai sampai transaksi pendaftaran berhasil sesuai aturan.
- **Kriteria penerimaan:** Validasi dilakukan kembali di server saat submit; nilai promo tidak dihitung hanya dari client.

#### FR-008 — Pencatatan Penukaran Promo

- **Fitur terkait:** FEAT-004
- **Aktor utama:** Sistem
- **Deskripsi:** Sistem mencatat penggunaan promo yang berhasil agar dapat ditelusuri dan mencegah penggunaan melampaui aturan.
- **Prasyarat:** Pendaftaran berhasil dan promo tervalidasi.
- **Alur utama:** Dalam transaksi yang sama atau konsisten, sistem membuat catatan redemption yang terkait ke pengguna dan pendaftaran.
- **Alur alternatif/gagal:** Terjadi konflik kuota atau penggunaan ganda; transaksi ditolak/diulang dengan aman.
- **Pascakondisi:** Redemption tercatat tepat satu kali untuk pendaftaran terkait.
- **Kriteria penerimaan:** Ada unique constraint yang sesuai; pembatalan pendaftaran mengikuti kebijakan pemulihan promo yang masih TBD.

### 4.4 Trial Registration

#### FR-009 — Mengajukan Trial

- **Fitur terkait:** FEAT-005
- **Aktor utama:** Calon Murid/Murid
- **Deskripsi:** Pengguna dapat mendaftar kelas trial yang tersedia.
- **Prasyarat:** Slot/periode trial tersedia.
- **Alur utama:** Pengguna memilih program atau slot → mengisi data yang diperlukan → sistem memvalidasi → permintaan trial disimpan.
- **Alur alternatif/gagal:** Slot penuh, periode tutup, atau permintaan duplikat; sistem menolak dengan alasan yang jelas.
- **Pascakondisi:** Permintaan trial memiliki status awal.
- **Kriteria penerimaan:** Pengguna dapat melihat status dan jadwal bila sudah ditetapkan.

#### FR-010 — Mengelola Trial

- **Fitur terkait:** FEAT-005, FEAT-010
- **Aktor utama:** Admin
- **Deskripsi:** Admin dapat meninjau, menjadwalkan, menyelesaikan, atau membatalkan permintaan trial.
- **Prasyarat:** Permintaan trial tersedia.
- **Alur utama:** Admin membuka antrean → memilih permintaan → menetapkan jadwal/status → sistem menyimpan perubahan.
- **Alur alternatif/gagal:** Jadwal tidak valid atau bentrok; sistem menolak sesuai aturan penjadwalan.
- **Pascakondisi:** Status trial dan jadwal terbaru dapat dilihat pengguna terkait.
- **Kriteria penerimaan:** Perubahan hanya oleh role berizin; waktu disimpan dengan timezone yang konsisten.

### 4.5 Learning Modules

#### FR-011 — Mengelola Informasi Modul

- **Fitur terkait:** FEAT-006
- **Aktor utama:** Admin
- **Deskripsi:** Admin dapat membuat, memperbarui, mengurutkan, menerbitkan, atau menonaktifkan metadata modul pembelajaran.
- **Prasyarat:** Program terkait tersedia.
- **Alur utama:** Admin mengisi metadata → sistem memvalidasi relasi program dan urutan → modul disimpan.
- **Alur alternatif/gagal:** Program tidak valid atau urutan bentrok; sistem menolak.
- **Pascakondisi:** Modul tersedia sesuai status publikasi.
- **Kriteria penerimaan:** Modul draft tidak terlihat oleh murid; perubahan tidak memutus relasi program yang aktif.

#### FR-012 — Mengakses Modul yang Berhak Dilihat

- **Fitur terkait:** FEAT-006, FEAT-013
- **Aktor utama:** Murid
- **Deskripsi:** Murid dapat melihat modul pada program yang aktif untuk dirinya.
- **Prasyarat:** Murid memiliki pendaftaran/program aktif.
- **Alur utama:** Sistem menentukan program aktif → mengambil modul terbit → menampilkan sesuai urutan/aturan akses.
- **Alur alternatif/gagal:** Murid tidak memiliki akses; sistem menolak.
- **Pascakondisi:** Tidak ada perubahan data kecuali pencatatan aktivitas bila nanti diaktifkan.
- **Kriteria penerimaan:** Query dibatasi pada kepemilikan murid; URL langsung tidak dapat membuka modul tanpa hak.

### 4.6 Mentor Information and Plotting

#### FR-013 — Melihat Informasi Mentor

- **Fitur terkait:** FEAT-007
- **Aktor utama:** Admin, Mentor Lead, Murid sesuai kebijakan
- **Deskripsi:** Sistem menyediakan profil mentor yang relevan, seperti nama, keahlian, status, dan kapasitas yang boleh ditampilkan.
- **Prasyarat:** Mentor aktif.
- **Alur utama:** Pengguna membuka daftar/detail mentor → sistem menampilkan data sesuai role.
- **Alur alternatif/gagal:** Mentor tidak aktif atau pengguna tidak berhak; data tidak ditampilkan.
- **Pascakondisi:** Tidak ada perubahan data.
- **Kriteria penerimaan:** Data privat mentor tidak tampil ke murid; daftar dapat difilter berdasarkan status/keahlian bila tersedia.

#### FR-014 — Melakukan Plotting Mentor

- **Fitur terkait:** FEAT-008
- **Aktor utama:** Mentor Lead/Admin
- **Deskripsi:** Pengguna berizin dapat menetapkan mentor kepada murid atau pendaftaran program.
- **Prasyarat:** Murid/pengajuan valid; mentor aktif; assignment belum duplikat.
- **Alur utama:** Aktor memilih murid → memilih mentor → sistem memeriksa aturan → assignment dibuat.
- **Alur alternatif/gagal:** Mentor tidak aktif, assignment tumpang tindih, atau kapasitas melebihi konfigurasi; sistem menolak atau memperingatkan sesuai aturan final.
- **Pascakondisi:** Mentor dan murid dapat melihat penugasan yang relevan.
- **Kriteria penerimaan:** Assignment memiliki periode/status; perubahan aktor dan waktu tercatat.

#### FR-015 — Mengubah atau Mengakhiri Assignment

- **Fitur terkait:** FEAT-008
- **Aktor utama:** Mentor Lead/Admin
- **Deskripsi:** Assignment mentor dapat dipindahkan, dihentikan, atau diselesaikan tanpa menghilangkan riwayat.
- **Prasyarat:** Assignment tersedia dan aktif.
- **Alur utama:** Aktor memilih assignment → memberi status/alasan → sistem memperbarui assignment.
- **Alur alternatif/gagal:** Assignment telah selesai atau perubahan melanggar aturan; sistem menolak.
- **Pascakondisi:** Riwayat assignment tetap dapat ditelusuri.
- **Kriteria penerimaan:** Tidak menggunakan hard delete untuk assignment yang pernah aktif.

### 4.7 Mentor Scheduling

#### FR-016 — Membuat dan Mengubah Jadwal Mentoring

- **Fitur terkait:** FEAT-009
- **Aktor utama:** Mentor Lead/Admin; Mentor bila diberi permission
- **Deskripsi:** Pengguna berizin dapat membuat atau mengubah jadwal mentoring untuk assignment tertentu.
- **Prasyarat:** Assignment aktif; waktu valid.
- **Alur utama:** Aktor memilih assignment → menentukan waktu, mode, dan informasi sesi → sistem memvalidasi → jadwal disimpan.
- **Alur alternatif/gagal:** Waktu berakhir sebelum mulai, assignment tidak aktif, atau terjadi bentrok; sistem menolak sesuai aturan final.
- **Pascakondisi:** Jadwal dapat dilihat mentor dan murid terkait.
- **Kriteria penerimaan:** Waktu disimpan konsisten; perubahan jadwal tidak menghasilkan duplikasi; overlap prevention masih berstatus aturan usulan sampai dikonfirmasi.

#### FR-017 — Melihat Jadwal Sesuai Role

- **Fitur terkait:** FEAT-009, FEAT-012, FEAT-013
- **Aktor utama:** Mentor, Mentor Lead, Murid, Admin
- **Deskripsi:** Setiap role dapat melihat jadwal yang berada dalam lingkupnya.
- **Prasyarat:** Pengguna terautentikasi.
- **Alur utama:** Sistem memfilter jadwal berdasarkan role, assignment, dan organisasi → daftar/kalender ditampilkan.
- **Alur alternatif/gagal:** Tidak ada jadwal; tampilkan empty state.
- **Pascakondisi:** Tidak ada perubahan data.
- **Kriteria penerimaan:** Mentor hanya melihat jadwal sendiri; murid hanya melihat jadwalnya; admin/lead mengikuti permission.

### 4.8 Role Dashboards

#### FR-018 — Panel Admin

- **Fitur terkait:** FEAT-010
- **Aktor utama:** Admin
- **Deskripsi:** Panel Admin menampilkan ringkasan operasional dan tautan ke modul yang boleh dikelola.
- **Prasyarat:** Admin terautentikasi.
- **Alur utama:** Sistem mengambil metrik dan antrean yang diizinkan → dashboard ditampilkan.
- **Alur alternatif/gagal:** Sebagian data gagal; dashboard menampilkan status kesalahan tanpa menampilkan data stale sebagai fakta.
- **Pascakondisi:** Tidak ada perubahan kecuali aksi eksplisit admin.
- **Kriteria penerimaan:** Semua shortcut tetap melewati otorisasi server; data mock diganti dengan query nyata sebelum produksi.

#### FR-019 — Panel Mentor Lead

- **Fitur terkait:** FEAT-011
- **Aktor utama:** Mentor Lead
- **Deskripsi:** Panel menampilkan antrean plotting, beban mentor, dan jadwal pada lingkup lead.
- **Prasyarat:** Mentor Lead terautentikasi.
- **Alur utama:** Sistem mengambil data sesuai permission → dashboard ditampilkan.
- **Alur alternatif/gagal:** Tidak ada antrean; tampilkan keadaan kosong.
- **Pascakondisi:** Tidak ada perubahan kecuali aksi eksplisit.
- **Kriteria penerimaan:** Tidak menampilkan data di luar lingkup yang diberikan.

#### FR-020 — Panel Mentor

- **Fitur terkait:** FEAT-012
- **Aktor utama:** Mentor
- **Deskripsi:** Panel menampilkan penugasan dan jadwal mentor sendiri.
- **Prasyarat:** Mentor terautentikasi dan profil mentor aktif.
- **Alur utama:** Sistem memfilter assignment/jadwal berdasarkan mentor → dashboard ditampilkan.
- **Alur alternatif/gagal:** Belum ada assignment; tampilkan keadaan kosong.
- **Pascakondisi:** Tidak ada perubahan kecuali aksi eksplisit.
- **Kriteria penerimaan:** Mentor tidak dapat mengubah data assignment tanpa permission.

#### FR-021 — Panel Murid

- **Fitur terkait:** FEAT-013
- **Aktor utama:** Murid
- **Deskripsi:** Panel menampilkan program aktif, modul, mentor, jadwal, dan status pendaftaran milik murid.
- **Prasyarat:** Murid terautentikasi.
- **Alur utama:** Sistem mengambil data milik murid → dashboard ditampilkan.
- **Alur alternatif/gagal:** Belum ada program; tampilkan onboarding/status pendaftaran.
- **Pascakondisi:** Tidak ada perubahan kecuali aksi eksplisit.
- **Kriteria penerimaan:** Tidak ada data murid lain pada response atau UI.

### 4.9 Extracurricular Organizations and Registration

#### FR-022 — Mendaftarkan Organisasi Ekskul

- **Fitur terkait:** FEAT-014
- **Aktor utama:** Admin atau perwakilan organisasi sesuai keputusan bisnis
- **Deskripsi:** Sistem mencatat sekolah/organisasi yang mengajukan atau menjalankan program ekskul bersama SAKODE.
- **Prasyarat:** Data minimum organisasi tersedia.
- **Alur utama:** Aktor mengisi identitas organisasi, kontak/PIC, dan informasi program → sistem memvalidasi → data organisasi disimpan dengan status awal.
- **Alur alternatif/gagal:** Organisasi duplikat atau data wajib tidak lengkap; sistem menolak/menandai kemungkinan duplikat.
- **Pascakondisi:** Organisasi tercatat dan dapat dikelola Admin.
- **Kriteria penerimaan:** Nama/identitas unik mengikuti aturan yang disepakati; status approval organisasi masih TBD dan harus dikonfigurasi, bukan diasumsikan.

#### FR-023 — Mengelola Informasi Organisasi Ekskul

- **Fitur terkait:** FEAT-014
- **Aktor utama:** Admin
- **Deskripsi:** Admin dapat melihat, memperbarui, mengaktifkan, atau menonaktifkan organisasi ekskul.
- **Prasyarat:** Organisasi tersedia.
- **Alur utama:** Admin membuka organisasi → memperbarui field yang diizinkan/status → sistem menyimpan dan mencatat perubahan.
- **Alur alternatif/gagal:** Organisasi mempunyai relasi aktif yang mencegah penghapusan; sistem menolak hard delete.
- **Pascakondisi:** Informasi terbaru tersedia bagi role berizin.
- **Kriteria penerimaan:** Organisasi yang memiliki histori tidak dihapus secara destruktif; status dan scope Kepala Sekolah tetap konsisten.

#### FR-024 — Mendaftar ke Ekskul

- **Fitur terkait:** FEAT-015
- **Aktor utama:** Murid
- **Deskripsi:** Murid dapat mendaftar ke organisasi/program ekskul yang tersedia.
- **Prasyarat:** Murid aktif; ekskul aktif; periode pendaftaran terbuka jika periode digunakan.
- **Alur utama:** Murid memilih ekskul → sistem menampilkan syarat → murid mengirim pendaftaran → sistem memvalidasi duplikasi dan menyimpan.
- **Alur alternatif/gagal:** Pendaftaran aktif duplikat, periode tutup, atau kapasitas habis bila kuota diterapkan; sistem menolak.
- **Pascakondisi:** Pendaftaran ekskul memiliki status awal dan terlihat oleh murid serta Admin.
- **Kriteria penerimaan:** Unique constraint mencegah duplikasi aktif; approval, kuota, dan jumlah ekskul per murid masih TBD.

#### FR-025 — Meninjau Pendaftaran Ekskul

- **Fitur terkait:** FEAT-015
- **Aktor utama:** Admin atau aktor persetujuan yang kelak ditetapkan
- **Deskripsi:** Pengguna berizin dapat melihat dan, bila workflow approval digunakan, menerima atau menolak pendaftaran ekskul.
- **Prasyarat:** Pendaftaran ekskul tersedia.
- **Alur utama:** Aktor membuka antrean → memeriksa detail → menetapkan keputusan/alasan → sistem menyimpan.
- **Alur alternatif/gagal:** Aktor tidak berwenang atau transisi status tidak valid; sistem menolak.
- **Pascakondisi:** Status pendaftaran diperbarui dan dapat dilihat murid.
- **Kriteria penerimaan:** Kepala Sekolah tidak otomatis menjadi approver; responsibility approval harus dikonfirmasi.

### 4.10 School Principal Access

#### FR-026 — Menghubungkan Kepala Sekolah ke Organisasi

- **Fitur terkait:** FEAT-016
- **Aktor utama:** Admin
- **Deskripsi:** Admin dapat mengaitkan akun Kepala Sekolah ke satu atau lebih organisasi yang boleh dilihat.
- **Prasyarat:** Akun dan organisasi tersedia.
- **Alur utama:** Admin memilih pengguna → menetapkan role Kepala Sekolah dan organisasi → sistem menyimpan membership.
- **Alur alternatif/gagal:** Organisasi tidak aktif atau assignment duplikat; sistem menolak.
- **Pascakondisi:** Scope data Kepala Sekolah dapat dihitung dari membership aktif.
- **Kriteria penerimaan:** Role saja tidak memberi akses ke seluruh organisasi; relasi organisasi wajib untuk data scoped.

#### FR-027 — Melihat Informasi dan Laporan Ekskul

- **Fitur terkait:** FEAT-016
- **Aktor utama:** Kepala Sekolah
- **Deskripsi:** Kepala Sekolah dapat melihat informasi ekskul dan laporan ringkas pada organisasi yang terhubung.
- **Prasyarat:** Pengguna mempunyai role Kepala Sekolah dan membership organisasi aktif.
- **Alur utama:** Sistem menentukan organisasi yang diizinkan → mengambil informasi ekskul, status, dan rekap peserta → menampilkan dashboard read-only.
- **Alur alternatif/gagal:** Tidak ada membership atau mencoba organisasi lain; sistem menolak/menampilkan empty state.
- **Pascakondisi:** Tidak ada perubahan data.
- **Kriteria penerimaan:** Query selalu memakai organization scope; data pribadi yang ditampilkan dibatasi pada kebutuhan laporan.

#### FR-028 — Menegakkan Akses Read-only Kepala Sekolah

- **Fitur terkait:** FEAT-016, FEAT-002
- **Aktor utama:** Sistem
- **Deskripsi:** Sistem mencegah Kepala Sekolah melakukan operasi create, update, approve, atau delete pada modul ekskul.
- **Prasyarat:** Request berasal dari akun Kepala Sekolah tanpa permission tambahan.
- **Alur utama:** Server memeriksa permission → operasi baca diizinkan → operasi write ditolak.
- **Alur alternatif/gagal:** Client mencoba memanggil action/API secara langsung; server tetap menolak.
- **Pascakondisi:** Data tidak berubah.
- **Kriteria penerimaan:** Tidak ada server action write yang hanya bergantung pada hidden button; pengujian negatif tersedia.


### 4.11 System Integration API

#### FR-029 — Menyediakan Integration API untuk Sistem Informasi

- **Fitur terkait:** FEAT-019
- **Aktor utama:** Sistem Informasi sebagai system client
- **Deskripsi:** Sistem Akademik menyediakan sejumlah Route Handler versioned untuk pertukaran data yang telah disetujui dengan Sistem Informasi.
- **Prasyarat:** Kontrak endpoint, ownership data, kredensial client, dan field response telah disepakati.
- **Alur utama:** System client mengirim request terautentikasi → server memvalidasi client, scope, input, dan rate limit → service menjalankan use case → response DTO dikembalikan.
- **Alur alternatif/gagal:** Credential tidak valid, scope tidak cukup, request kedaluwarsa, validasi gagal, atau resource tidak ditemukan; server menolak tanpa membocorkan data internal.
- **Pascakondisi:** Data hanya berubah untuk endpoint write yang memang disetujui; request penting dapat ditelusuri.
- **Kriteria penerimaan:** Endpoint berada di namespace `/api/integrations/v1/*`; tidak mengembalikan object database mentah; autentikasi system-to-system terpisah dari session pengguna; endpoint ini tidak dikerjakan pada fase FE aktif.

### 4.12 Frontend Experience and Development Showcase

#### FR-030 — Default Modern UI dan Style/Color Switcher

- **Fitur terkait:** FEAT-020
- **Aktor utama:** Tim pengembang dan stakeholder reviewer
- **Deskripsi:** Aplikasi menggunakan `sakode-modern` sebagai style default dan mempertahankan FAB untuk mengganti style, preset warna, serta warna branding selama fase development/showcase.
- **Prasyarat:** `UIStyleProvider` dan custom UI namespaces tersedia.
- **Alur utama:** Pengguna membuka FAB → memilih style atau warna → halaman aktif menyesuaikan tampilan tanpa kehilangan fungsi atau keterbacaan.
- **Alur alternatif/gagal:** Style tertentu belum mendukung komponen baru; aplikasi menggunakan fallback yang terkontrol dan agent melaporkan gap, bukan merusak halaman.
- **Pascakondisi:** Pilihan visual bersifat kosmetik dan tidak memengaruhi permission atau data.
- **Kriteria penerimaan:** Default tetap modern; FAB tidak dihapus atau dinonaktifkan pada development; seluruh interactive controls mempunyai label aksesibel; light/dark mode tetap terbaca.

#### FR-031 — Incremental Feature-by-Role Frontend Delivery

- **Fitur terkait:** FEAT-021
- **Aktor utama:** Product owner dan AI coding agent
- **Deskripsi:** Implementasi frontend dibagi menjadi review slice kecil berdasarkan satu feature untuk satu role agar setiap perubahan dapat diperiksa sebelum melanjutkan.
- **Prasyarat:** Slice ID dan acceptance criteria dipilih dari frontend implementation plan.
- **Alur utama:** Agent membaca dokumen → mengerjakan hanya slice terpilih → memvalidasi responsive/loading/empty/error state → menjalankan lint/build → melaporkan perubahan dan berhenti.
- **Alur alternatif/gagal:** Requirement ambigu atau membutuhkan backend; agent membuat assumption report dan berhenti sebelum memperluas scope.
- **Pascakondisi:** Hanya slice terpilih yang berubah dan siap direview.
- **Kriteria penerimaan:** Tidak ada implementasi lintas-role/lintas-feature tanpa persetujuan; agent tidak melanjutkan otomatis ke slice selanjutnya.

### 4.13 Referral Registration Program

#### FR-032 — Mengelola Program Referral

- **Fitur terkait:** FEAT-022
- **Aktor utama:** Admin
- **Deskripsi:** Admin dapat membuat, memperbarui, mengaktifkan, menonaktifkan, dan meninjau program referral yang digunakan untuk mengatribusikan pendaftaran murid. Admin dapat menentukan nominal payout per konversi dan memilih tipe referral (Referral New Comers atau Referral Program).
- **Prasyarat:** Admin terautentikasi dan memiliki permission pengelolaan referral; program akademik target tersedia bila referral dibatasi ke program tertentu.
- **Alur utama:** Admin membuka modul referral → membuat atau memilih program referral → mengatur nama, tipe program, nominal komisi (harga 1 referral), periode, status, target program, dan aturan penggunaan → sistem menyimpan perubahan.
- **Alur alternatif/gagal:** Periode tidak valid, target program tidak tersedia, atau konfigurasi bertentangan; sistem menolak dengan pesan yang dapat ditindaklanjuti.
- **Pascakondisi:** Program referral tersimpan dan siap digunakan untuk pelacakan atribusi dan komisi payout.
- **Kriteria penerimaan:** Admin dapat memfilter berdasarkan status/periode/program; perubahan status memerlukan konfirmasi; nominal komisi tercatat secara tepat.

#### FR-033 — Mengelola Kode dan Pemilik Referral

- **Fitur terkait:** FEAT-022
- **Aktor utama:** Admin
- **Deskripsi:** Admin dapat mendaftarkan pemilik kode (referrer) baru, membuat atau menghasilkan kode referral URL-safe, mengaitkannya ke program rujukan, serta memantau status aktif/nonaktif. Pendaftaran pemilik kode ditujukan untuk penentuan payout pencairan komisi.
- **Prasyarat:** Program referral tersedia; identitas pemilik kode (referrer) dapat didaftarkan.
- **Alur utama:** Admin memilih program referral → mendaftarkan pemilik kode baru → membuat/menghasilkan kode URL-safe → mengatur status dan batas penggunaan → sistem menyimpan → sistem menghasilkan link kanonis rujukan.
- **Alur alternatif/gagal:** Kode duplikat/tidak URL-safe, program tidak aktif, atau pemilik kode tidak terdaftar; sistem menolak.
- **Pascakondisi:** Kode rujukan aktif dikaitkan dengan profil pemilik kode untuk perhitungan pencairan komisi.
- **Kriteria penerimaan:** Kode rujukan harus unik; Admin dapat melihat pemilik, batas penggunaan, tautan kanonis, dan status aktif.

#### FR-034 — Mencatat dan Meninjau Atribusi Referral

- **Fitur terkait:** FEAT-022, FEAT-003, FEAT-010
- **Aktor utama:** Sistem dan Admin
- **Deskripsi:** Sistem mengaitkan kode referral valid ke pendaftaran murid baru untuk perhitungan komisi payout, sedangkan Admin dapat melihat atribusi konversi dan status pendaftaran.
- **Prasyarat:** Pendaftaran murid masuk; kode referral valid dan aktif.
- **Alur utama:** Calon murid mendaftar dengan kode referral → sistem memvalidasi tipe program → setelah pendaftaran disetujui, sistem mencatat atribusi konversi sukses dan menghitung potensi komisi payout untuk pemilik kode.
- **Alur alternatif/gagal:** Kode kedaluwarsa atau limit habis; sistem tidak mencatat komisi.
- **Pascakondisi:** Potensi payout ditambahkan ke log transaksi pemilik kode terkait.
- **Kriteria penerimaan:** Perhitungan komisi didasarkan pada harga per referral yang diset pada program terkait; koreksi manual Admin dicatat.

#### FR-034a — Akun Referral Khusus (Referrer Portal)

- **Fitur terkait:** FEAT-022, FEAT-023
- **Aktor utama:** Pemilik Referral (Referrer)
- **Deskripsi:** Pemilik rujukan terdaftar memiliki akses ke portal khusus untuk melihat status performa kode miliknya, menginput data payout, dan memantau pencairan dana.
- **Prasyarat:** Akun pemilik referral aktif dan terautentikasi.
- **Alur utama:** Pemilik masuk ke portal → melihat statistik jumlah pendaftaran yang menggunakan kodenya dari berbagai tipe program → mengisi/memperbarui informasi rekening payout → melihat status proses pencairan (pencairan komisi diproses dan disetujui secara manual oleh Admin, pemilik hanya melihat pembaruan status Sukses/Pending/Ditolak).
- **Alur alternatif/gagal:** Informasi rekening tidak lengkap; pengajuan pencairan ditahan.
- **Pascakondisi:** Pengajuan pencairan tercatat dalam antrean untuk diverifikasi dan dieksekusi oleh Admin.
- **Kriteria penerimaan:** Pemilik rujukan hanya dapat melihat data miliknya sendiri; data rekening tersimpan aman.

### 4.14 Public Package Catalog and Referral Link Flow

#### FR-035 — Membuat dan Membagikan Tautan Referral

- **Fitur terkait:** FEAT-023
- **Aktor utama:** Admin/Pemilik Referral yang memenuhi syarat
- **Deskripsi:** Sistem menyediakan tautan pendaftaran kanonis untuk setiap kode referral aktif agar pemilik referral cukup membagikan link, bukan meminta calon murid mengetik kode secara manual.
- **Prasyarat:** Kode referral tersedia, aktif, URL-safe, dan terhubung ke pemilik/sumber yang valid.
- **Alur utama:** Admin/pemilik membuka detail referral → sistem membentuk URL publik dari base URL + route pendaftaran + parameter/token referral → pengguna menyalin atau memakai native share bila tersedia.
- **Alur alternatif/gagal:** Kode tidak aktif/kedaluwarsa atau konfigurasi domain tidak tersedia; sistem menonaktifkan aksi share dan menjelaskan penyebabnya.
- **Pascakondisi:** Link dapat dibagikan tanpa memuat nama, email, atau data pribadi referrer/calon murid.
- **Kriteria penerimaan:** Link konsisten, dapat disalin, dapat dibuka di perangkat lain, dan tidak menggunakan internal database ID sebagai credential.

#### FR-036 — Prefill Referral dari Tautan Pendaftaran

- **Fitur terkait:** FEAT-023, FEAT-003
- **Aktor utama:** Calon Murid/Sistem
- **Deskripsi:** Ketika calon murid membuka tautan referral, sistem membaca referral context dan mengisi kolom referral secara otomatis pada alur pendaftaran.
- **Prasyarat:** URL memiliki parameter/token referral; halaman pendaftaran tersedia.
- **Alur utama:** Sistem membaca referral dari URL → menampilkan kode/sumber referral secara transparan pada field atau summary → mempertahankan context melalui langkah pembuatan akun dan pemilihan paket → memvalidasi ulang pada submit.
- **Alur alternatif/gagal:** Link tidak valid/kedaluwarsa; formulir tetap dapat digunakan, tetapi field menampilkan status invalid dan atribusi tidak dibuat sampai pengguna memperbaikinya.
- **Pascakondisi:** Referral valid terhubung ke pendaftaran setelah submit berhasil.
- **Kriteria penerimaan:** Prefill terlihat oleh pengguna, tidak diam-diam mengatribusikan referral, bertahan selama alur multi-step, dan tidak dianggap valid hanya karena ada di query string.

#### FR-037 — Menampilkan Katalog Paket dan Harga di Landing Page

- **Fitur terkait:** FEAT-024, FEAT-006
- **Aktor utama:** Pengunjung/Calon Murid
- **Deskripsi:** Landing page Sistem Akademik menampilkan paket belajar yang dijual beserta harga, ringkasan manfaat, dan modul yang termasuk.
- **Prasyarat:** Paket berstatus published/aktif dan mempunyai konfigurasi harga publik.
- **Alur utama:** Pengunjung membuka landing page → melihat card/list paket → membandingkan harga dan cakupan modul → membuka detail atau memilih paket → CTA membawa pilihan ke alur pendaftaran.
- **Alur alternatif/gagal:** Paket kosong, harga belum ditentukan, atau sebagian data gagal dimuat; UI menampilkan state yang jujur tanpa harga palsu.
- **Pascakondisi:** Tidak ada pendaftaran dibuat sampai pengguna mengirim form.
- **Kriteria penerimaan:** Setiap paket menampilkan nama, harga/mata uang, ringkasan modul, status ketersediaan, dan CTA; hanya paket published yang muncul.

#### FR-038 — Memilih Paket Wajib pada Pendaftaran

- **Fitur terkait:** FEAT-024, FEAT-003
- **Aktor utama:** Calon Murid
- **Deskripsi:** Pengguna wajib menentukan paket/program yang ingin diikuti sebelum pendaftaran akademik dapat dikirim.
- **Prasyarat:** Minimal satu paket published dan terbuka untuk pendaftaran.
- **Alur utama:** Pilihan dari landing page diprefill bila ada → pengguna meninjau paket, harga, dan modul → pengguna dapat mengganti paket yang masih tersedia → sistem memvalidasi pilihan dan harga terkini saat submit.
- **Alur alternatif/gagal:** Tidak ada pilihan, paket sudah tidak tersedia, atau harga berubah; submit ditahan dan pengguna diminta mengonfirmasi ulang.
- **Pascakondisi:** Pendaftaran menyimpan `program_id` dan snapshot harga yang disetujui pengguna.
- **Kriteria penerimaan:** Form tidak dapat submit tanpa paket; summary sebelum submit memperlihatkan paket, harga dasar, promo bila ada, dan referral sebagai konsep terpisah.

### 4.15 User Management and System Security Audit

#### FR-039 — Manajemen Direktori Pengguna

- **Fitur terkait:** FEAT-017
- **Aktor utama:** Admin
- **Deskripsi:** Admin dapat mengelola direktori seluruh pengguna terpusat, melakukan pencarian nama/email, memfilter berdasarkan role/status, serta menambahkan atau mengedit akun pengguna.
- **Kriteria penerimaan:** Panel list tabel pengguna, pencarian, filter role/status, form penambahan/edit pengguna baru fully functional secara visual dan mock state.

#### FR-040 — Reset Kata Sandi Default

- **Fitur terkait:** FEAT-017
- **Aktor utama:** Admin
- **Deskripsi:** Admin dapat melakukan reset sandi cepat untuk akun pengguna apa saja kembali ke password default `academy@sakode` melalui konfirmasi modal dialog.
- **Kriteria penerimaan:** Aksi "Reset Sandi" memicu konfirmasi dialog detail password default dan mengirim notifikasi sukses setelah konfirmasi disetujui.

#### FR-041 — Log Audit dan Simulator

- **Fitur terkait:** FEAT-017
- **Aktor utama:** Admin
- **Deskripsi:** Admin dapat memantau log audit aktivitas operasional sistem secara real-time, menyaring berdasarkan kategori log (auth, registration, mentor, extracurricular, system), status (success, warning, error), serta menyimulasikan injeksi log baru ke stream.
- **Kriteria penerimaan:** Tampilan log audit stream dengan kategori ikonik, filter pencarian & filter drop-down, simulator controller (Default, Loading, Empty), dan tombol simulasi log baru yang memperbarui UI secara real-time.

#### FR-042 — Onboarding Akun Referrer

- **Fitur terkait:** FEAT-025
- **Aktor utama:** Calon Mitra Referrer
- **Deskripsi:** Calon mitra dapat mengisi formulir pendaftaran kemitraan referrer melalui landing page `/referral` (nama lengkap, email, nomor HP, platform promosi, info rekening/e-wallet). Setelah submit, akun referrer dibuat dan role `referrer` ditambahkan ke user record.
- **Prasyarat:** Email belum terdaftar sebagai mitra; atau email sudah ada sebagai murid/mentor dan role `referrer` belum dimiliki.
- **Alur utama:** Calon mitra mengisi form → sistem memvalidasi email uniqueness untuk role referrer → jika email sudah ada (akun akademik), role `referrer` ditambahkan; jika belum ada, akun baru dibuat dengan role `referrer` → link rujukan kanonis dibuat otomatis.
- **Alur alternatif/gagal:** Email sudah terdaftar sebagai mitra aktif → sistem menolak duplikasi dan meminta login.
- **Pascakondisi:** Akun referrer aktif dengan link rujukan unik dan saldo komisi = 0.
- **Kriteria penerimaan:** Multi-role (akademik + referrer) didukung pada level database `user_roles`; onboarding tidak menghapus role lama.
- **⚠ Backend implementation note:** Saat BE phase dibuka, implementasikan endpoint `POST /api/referrer/onboard` dengan validasi Zod, insert ke `users` atau update `user_roles`, dan generate `referral_codes` entry. Gunakan Better Auth multi-role session.

#### FR-043 — Payout Komisi Referrer

- **Fitur terkait:** FEAT-025, FEAT-022
- **Aktor utama:** Admin, Referrer
- **Deskripsi:** Sistem mencatat akumulasi komisi per referrer berdasarkan atribusi yang terverifikasi. Referrer dapat mengajukan pencairan; Admin memvalidasi dan mengeksekusi transfer secara manual.
- **Prasyarat:** Atribusi referral sudah berstatus `converted` (pembayaran murid terverifikasi oleh Admin). Referrer memiliki data rekening lengkap.
- **Alur utama:** Sistem mengakumulasikan komisi dari `referral_attributions` berstatus `converted` → Referrer melihat saldo di dashboard → mengajukan pencairan (jika saldo > 0) → Admin menerima antrean payout → memverifikasi rekening → mengeksekusi transfer secara manual → memperbarui status payout ke `completed` atau `rejected`.
- **Aturan pencairan yang terkonfirmasi:**
  - Tidak ada batas minimal (no threshold).
  - Pencairan dibuka 1x per bulan, tanggal 25–30/31 (bervariasi per program).
  - Jika tidak diajukan, saldo terbawa ke periode berikutnya.
  - Biaya admin transfer ditanggung penerima.
  - Transfer dapat ke rekening/e-wallet mana pun.
- **Alur alternatif/gagal:** Rekening tidak valid atau saldo 0 → pengajuan ditolak dengan alasan jelas.
- **Pascakondisi:** Riwayat payout tersimpan dan dapat diaudit.
- **Kriteria penerimaan:** Saldo komisi dihitung real-time dari `referral_attributions`; riwayat payout tercatat dengan timestamp dan actor Admin.
- **⚠ Backend implementation note:** Saat BE phase dibuka, implementasikan: tabel `referral_payouts` (referrer_id, amount, status, bank_info, executed_at, admin_id); endpoint `POST /api/referrer/payout-request` dan `PATCH /api/admin/payouts/[id]`; cron atau trigger untuk period-lock validation per program.

## 5. Business Rules

### 5.1 Aturan terkonfirmasi

| ID | Aturan |
|---|---|
| BR-001 | Company profile, berita, kegiatan, dan CMS publik umum milik Sistem Informasi tidak termasuk ruang lingkup; katalog paket dan entry pendaftaran Sistem Akademik tetap termasuk. |
| BR-002 | Sistem Akademik menggunakan MySQL sebagai database target. |
| BR-003 | Akses aplikasi harus dibedakan berdasarkan role. |
| BR-004 | Kepala Sekolah hanya mempunyai akses baca terhadap informasi ekskul sampai ada perubahan requirement eksplisit. |
| BR-005 | Data Kepala Sekolah harus dibatasi pada organisasi/sekolah yang terhubung, bukan seluruh data ekskul. |
| BR-006 | Promo harus divalidasi saat digunakan pada pendaftaran; pembuatan/publikasi promo dapat berasal dari sistem lain yang memakai database bersama. |
| BR-007 | Target autentikasi produksi adalah Better Auth dengan database-backed session. |
| BR-008 | Target ORM adalah Drizzle ORM untuk MySQL melalui driver `mysql2`. |
| BR-009 | Fase aktif hanya mengerjakan frontend; perubahan backend, database, migration, dan integration API memerlukan prompt/approval terpisah. |
| BR-010 | Style default aplikasi adalah `sakode-modern`. |
| BR-011 | `StyleSwitcherFAB` harus tetap aktif selama development/showcase dan tidak boleh digunakan sebagai sumber authorization atau business state. |
| BR-012 | Implementasi dilakukan satu feature untuk satu role per review slice dan agent harus berhenti setelah menyerahkan hasil review. |
| BR-013 | Program referral, kode referral, dan atribusi pendaftaran dikelola dalam Sistem Akademik oleh Admin yang memiliki permission. |
| BR-014 | Referral dan promo adalah konsep berbeda; kode referral tidak otomatis memberi diskon atau reward kecuali aturan tersebut dikonfirmasi. |
| BR-015 | Setiap kode referral aktif dapat mempunyai tautan pendaftaran kanonis yang diturunkan dari domain publik dan kode URL-safe. |
| BR-016 | Referral dari link harus terlihat/prefilled pada form dan divalidasi ulang saat submit; query string saja bukan bukti validitas. |
| BR-017 | Pendaftaran akademik tidak dapat dikirim sebelum calon murid memilih satu paket/program yang published dan tersedia. |
| BR-018 | Landing page Sistem Akademik menampilkan hanya paket published beserta harga dan ringkasan modul yang telah disetujui untuk publik. |
| BR-019 | Referral link tidak boleh memuat PII; harga dan paket pada pendaftaran harus diverifikasi server-side dan disimpan sebagai snapshot transaksi/registrasi. |
| BR-020 | Self-referral **diperbolehkan** — mitra referrer boleh mendaftar kelas menggunakan kode rujukan miliknya sendiri; komisi tetap dihitung setelah pembayaran terverifikasi oleh Admin. |
| BR-021 | Tidak ada batas minimal pencairan (no threshold). Berapapun saldo komisi yang terakumulasi dapat dicairkan satu kali sebulan. Jika tidak diajukan, saldo terbawa ke periode berikutnya. |
| BR-022 | Tanggal pencairan komisi bervariasi per program dan biasanya dibuka antara tanggal 25–30/31. Detail tanggal tercantum pada konfigurasi masing-masing program referral yang dikelola Admin. |
| BR-023 | Komisi per rujukan (harga 1 referral) bersifat fleksibel dan berbeda-beda antar program. Admin menetapkan nilai ini per program pada saat konfigurasi program referral. |
| BR-024 | Pencairan dapat ditransfer ke rekening bank atau e-wallet mana pun. Seluruh biaya administrasi transfer ditanggung oleh penerima komisi (referrer), bukan SAKODE. |
| BR-025 | Akun referrer tidak selalu memiliki role akademik (murid/mentor). Saat BE diimplementasikan: jika user memiliki dual-role (akademik + referrer), login ke portal utama terlebih dahulu dan Header menampilkan tombol Portal Referrer. Jika hanya memiliki role referrer, otomatis diarahkan ke portal referrer dan Header hanya menampilkan tombol Ke Beranda. |
| BR-026 | Sistem mendukung peran **Global Mentor Lead** menggunakan flag `is_global_lead` pada record pengguna. Mentor Lead dengan flag ini aktif dapat mengelola dan memantau seluruh mentor, siswa, dan jadwal di semua domain pengajaran (akses global), namun tetap terisolasi dari menu administratif Super Admin (seperti log audit sistem, konfigurasi integrasi, dan review billing). |

### 5.2 Aturan usulan yang perlu validasi

| ID | Aturan usulan | Status |
|---|---|---|
| BR-P01 | Satu murid tidak boleh mempunyai lebih dari satu pendaftaran aktif pada ekskul yang sama. | Proposed |
| BR-P02 | Promo yang nonaktif, belum berlaku, atau kedaluwarsa tidak dapat digunakan. | Proposed; sangat direkomendasikan |
| BR-P03 | Satu redemption promo tidak boleh tercatat lebih dari sekali untuk pendaftaran yang sama. | Proposed; sangat direkomendasikan |
| BR-P04 | Satu pendaftaran hanya memiliki satu atribusi referral aktif dan kode harus divalidasi ulang pada submit. | Proposed; sangat direkomendasikan |
| BR-P05 | Stacking referral + promo (penggunaan keduanya bersamaan) perlu keputusan bisnis. | Proposed; perlu keputusan bisnis |
| BR-P06 | Jadwal mentor tidak boleh overlap dengan jadwal mentor lain miliknya pada waktu yang sama. | Proposed |
| BR-P07 | Jadwal murid tidak boleh overlap pada waktu yang sama. | Proposed |
| BR-P08 | Penghapusan organisasi, assignment, dan pendaftaran yang sudah mempunyai histori dilakukan dengan status/soft delete, bukan hard delete. | Proposed |
| BR-P09 | Kuota ekskul dihitung dari pendaftaran berstatus approved/active, bukan seluruh submission. | Proposed bila kuota digunakan |
| BR-P10 | Kepala Sekolah tidak menjadi approver pendaftaran ekskul kecuali requirement diperluas. | Proposed default |
| BR-P11 | Pengguna boleh mengganti atau menghapus referral yang diprefill sebelum submit, selama perubahan ditampilkan secara transparan. | Proposed; perlu keputusan bisnis |

## 6. Non-Functional Requirements

| ID | Area | Requirement |
|---|---|---|
| NFR-001 | Security | Password harus di-hash dengan algoritma yang sesuai, secret tidak dikirim ke client, dan semua write action memeriksa autentikasi serta authorization di server. |
| NFR-002 | Least privilege | Database user Sistem Akademik hanya memiliki privilege yang diperlukan. Database dev dan prod serta kredensialnya dipisahkan. |
| NFR-003 | Data integrity | Foreign key, unique constraint, transaction, dan validasi status digunakan untuk menjaga konsistensi data. |
| NFR-004 | Privacy | Data murid hanya dapat diakses role yang mempunyai kebutuhan bisnis; laporan Kepala Sekolah harus meminimalkan data pribadi. |
| NFR-005 | Auditability | Perubahan status pendaftaran, plotting mentor, jadwal, role, dan organisasi harus dapat ditelusuri minimal melalui timestamp dan actor; bentuk audit log final masih TBD. |
| NFR-006 | Performance | Target waktu respons, jumlah pengguna bersamaan, dan volume data masih **TBD**. Query daftar harus mendukung pagination dan index yang relevan. |
| NFR-007 | Availability | Target uptime dan recovery time masih **TBD**. Sistem harus memiliki strategi backup dan restore MySQL yang diuji. |
| NFR-008 | Maintainability | Implementasi mengikuti Feature-Based Colocation Architecture, server action tipis, service layer untuk logika bisnis, dan database access terisolasi. |
| NFR-009 | Accessibility | Antarmuka harus mempertahankan praktik WCAG pada input, label, keyboard navigation, fokus, dan kontras. |
| NFR-010 | Compatibility | Aplikasi menggunakan Next.js App Router dan harus lolos TypeScript, lint, dan production build pada environment target. |
| NFR-011 | Shared DB safety | Migrasi tidak boleh merusak tabel yang dipakai Sistem Informasi. Perubahan tabel bersama harus mempunyai ownership dan deployment coordination yang jelas. |
| NFR-012 | Observability | Error penting dicatat secara aman tanpa password/token/PII sensitif; kebutuhan monitoring produksi masih TBD. |
| NFR-013 | UI design language | Layout harus modern, nyaman, data-oriented, dan tidak terlihat seperti template generik. Hindari gradient/glow berlebihan, floating decoration acak, card yang seluruhnya seragam, serta visual 3D yang tidak membantu hierarki. |
| NFR-014 | Reusability | Gunakan custom UI yang sudah tersedia sebelum menambah dependency. Primitive baru dibuat lintas-style hanya bila reusable; domain composite ditempatkan pada shared/feature component layer. |
| NFR-015 | Frontend contracts | Pada fase FE, data berasal dari typed fixtures/mock adapters yang meniru kontrak service masa depan. Jangan mengikat UI langsung ke object dummy tersebar di banyak komponen. |
| NFR-016 | Responsive dashboard | App shell, sidebar, header, table, filter, card, drawer, dan forms harus usable pada mobile, tablet, serta desktop. Data table wajib memiliki strategi overflow atau card transformation. |
| NFR-017 | UI states | Setiap screen data-driven harus mempunyai loading, empty, error, success/feedback, dan disabled state yang konsisten. |
| NFR-018 | Review isolation | Perubahan satu slice tidak boleh mengubah behavior role lain kecuali shared component yang memang dibutuhkan dan telah diuji regresinya. |
| NFR-019 | Integration API security | Endpoint system-to-system harus versioned, memakai credential/scope terpisah dari user session, divalidasi, rate-limited, dan mengembalikan DTO minimum. |
| NFR-020 | Public acquisition integrity | Landing catalog, package selection, price, promo, and referral context must use typed contracts; displayed values are revalidated before creating registration. |
| NFR-021 | Referral-link privacy | Referral URLs must not contain PII or secrets, must use safe canonical encoding, and invalid links must degrade gracefully without blocking normal registration. |

## 7. Assumptions

1. MySQL dipisahkan antara lingkungan development dan production, dengan akun database terpisah untuk Sistem Akademik dan Sistem Informasi.
2. Tabel `programs` dan `promos` berpotensi menjadi tabel bersama. Pemilik migrasi dan batas write access belum ditetapkan.
3. Referral digunakan untuk atribusi sumber pendaftaran. Bentuk reward, komisi, payout, dan kriteria referral “berhasil” belum dianggap sebagai requirement terkonfirmasi.
4. Kode referral dapat dimiliki akun internal atau sumber eksternal; model referrer final masih TBD.
5. Kepala Sekolah dapat terhubung ke satu atau lebih organisasi melalui tabel membership, bukan tabel profil kepala sekolah khusus.
6. Pendaftaran ekskul oleh murid dipertahankan sebagai kebutuhan karena baseline dokumentasi menyebutkannya; arti tepat “pendaftaran organisasi ekskul” masih perlu dikonfirmasi apakah juga mencakup onboarding sekolah.
7. Status lifecycle pada dokumen database bersifat **proposed** sampai disetujui.
8. Data dummy pada dashboard dan autentikasi berbasis `localStorage` adalah prototipe, bukan implementasi produksi.
9. Better Auth, Drizzle ORM, `mysql2`, dan Zod telah dipilih sebagai target stack produksi; paket dan schema belum diimplementasikan pada fase FE aktif.
10. Untuk baseline ini, satu `program` diperlakukan sebagai paket belajar yang dijual dan mempunyai banyak `learning_modules`; model bundle yang lebih kompleks belum dibutuhkan.
11. Harga pada landing page adalah harga dasar/listed price. Skema cicilan, periode pembayaran, pajak, dan biaya tambahan belum dikonfirmasi.
12. Landing page yang masuk scope adalah katalog paket dan entry pendaftaran Sistem Akademik, bukan pengganti seluruh company profile/CMS Sistem Informasi.
13. URL referral kanonis menggunakan kode/token publik yang aman dan mempertahankan context melalui alur account-to-enrollment; implementasi penyimpanannya diputuskan pada backend phase.
14. Akun referrer tidak harus memiliki role akademik. Database harus mendukung `user_roles` many-to-many agar satu user dapat memiliki role `murid` + `referrer` secara bersamaan.
15. Saldo komisi referrer diakumulasikan dari `referral_attributions` berstatus `converted`. Pencairan diproses manual oleh Admin melalui panel khusus; tidak ada auto-disbursement.
16. Tanggal window pencairan komisi disimpan pada konfigurasi masing-masing program referral, bukan hardcoded global.

## 8. Open Questions

1. Apakah “pendaftaran organisasi ekskul” berarti sekolah mendaftarkan kerja sama ekskul, murid mendaftar ke ekskul, atau keduanya?
2. Siapa yang membuat dan menyetujui organisasi ekskul: Admin SAKODE, perwakilan sekolah, atau role lain?
3. Siapa yang menyetujui pendaftaran murid ke ekskul? Apakah approval diperlukan?
4. Apakah setiap ekskul memiliki kuota, periode pendaftaran, biaya, tingkatan kelas, dan batas jumlah ekskul per murid?
5. Apakah Kepala Sekolah hanya melihat agregat jumlah murid atau juga identitas/detail murid?
6. Dapatkah satu Kepala Sekolah terhubung ke lebih dari satu sekolah/organisasi?
7. Apakah program akademik reguler dan program ekskul memakai katalog program/modul yang sama?
8. Siapa pemilik tabel `programs` dan `promos` pada database bersama, serta sistem mana yang boleh melakukan write?
9. Apa status resmi untuk pendaftaran murid, trial, organisasi ekskul, pendaftaran ekskul, assignment mentor, dan jadwal?
10. Apakah mentor boleh membuat/mengubah jadwal sendiri atau hanya Mentor Lead/Admin?
11. Siapa yang dapat menjadi referrer: murid aktif, alumni, mentor, mitra/sekolah, atau semuanya?
12. Apakah referral memiliki reward/komisi/payout, siapa penerimanya, dan kapan atribusi dianggap conversion yang valid?
13. Apakah kode referral dapat digabung dengan promo, mempunyai batas penggunaan, atau dibatasi ke program/periode tertentu?
14. Apakah Admin boleh mengoreksi atribusi referral setelah pendaftaran dibuat dan audit apa yang wajib disimpan?
15. Apakah fitur penilaian, portofolio, sertifikat, XP, dan system log pada prototipe masuk roadmap resmi?
16. Apakah verifikasi email dan reset password masuk MVP autentikasi pertama atau follow-up setelah login/register dasar?
17. Apakah FAB akan disembunyikan pada production, dibatasi ke role tertentu, atau tetap tersedia sebagai user preference?
18. Endpoint integrasi mana yang pertama dibutuhkan Sistem Informasi, serta apakah masing-masing read-only atau write?
19. Harga paket bersifat sekali bayar, bulanan, per level, atau mempunyai beberapa opsi pembayaran? Mata uang dan aturan pajak apa yang dipakai?
20. Apakah setiap program selalu merupakan satu paket jual, atau diperlukan entity paket/bundle terpisah yang dapat memuat program/modul lintas kurikulum?
21. Siapa yang dapat membuat atau mengambil link referral sendiri: hanya Admin, atau setiap pemilik referral melalui halaman khusus?
22. Apakah referral yang diprefill boleh diubah/dihapus oleh calon murid, dan apakah link dapat sekaligus mengunci/preselect paket tertentu?
23. Informasi modul apa yang boleh tampil publik: judul saja, jumlah pertemuan, durasi, outcome, atau detail silabus?

## 9. Traceability

| Requirement | Feature | Database entities utama | Role utama |
|---|---|---|---|
| FR-001–FR-002 | FEAT-001 | `users`, `sessions`, `accounts`, `verifications`, `roles`, `user_roles` | Semua pengguna |
| FR-003 | FEAT-002 | `roles`, `permissions`, `user_roles`, `role_permissions`, `user_organizations` | Sistem/Admin |
| FR-004–FR-006 | FEAT-003 | `programs`, `learning_modules`, `students`, `student_registrations` | Calon Murid, Admin |
| FR-007–FR-008 | FEAT-004 | `promos`, `promo_redemptions`, `student_registrations` | Calon Murid, Sistem |
| FR-009–FR-010 | FEAT-005 | `trial_registrations`, `programs` | Calon Murid, Admin |
| FR-011–FR-012 | FEAT-006 | `learning_modules`, `programs`, `student_registrations` | Admin, Murid |
| FR-013 | FEAT-007 | `mentors`, `users` | Admin, Lead, Murid |
| FR-014–FR-015 | FEAT-008 | `mentor_assignments`, `mentors`, `students`, `student_registrations` | Mentor Lead, Admin |
| FR-016–FR-017 | FEAT-009 | `mentor_schedules`, `mentor_assignments` | Admin, Lead, Mentor, Murid |
| FR-018 | FEAT-010 | Seluruh entity operasional sesuai widget | Admin |
| FR-019 | FEAT-011 | `mentor_assignments`, `mentors`, `students`, `mentor_schedules` | Mentor Lead |
| FR-020 | FEAT-012 | `mentor_assignments`, `mentor_schedules` | Mentor |
| FR-021 | FEAT-013 | `student_registrations`, `learning_modules`, `mentor_assignments`, `mentor_schedules` | Murid |
| FR-022–FR-023 | FEAT-014 | `extracurricular_organizations`, `user_organizations` | Admin/perwakilan organisasi |
| FR-024–FR-025 | FEAT-015 | `extracurricular_registrations`, `extracurricular_organizations`, `students` | Murid, Admin/TBD |
| FR-026–FR-028 | FEAT-016 | `users`, `user_roles`, `user_organizations`, entity ekskul | Admin, Kepala Sekolah |
| FR-029 | FEAT-019 | `integration_clients`/secret config, domain entities sesuai endpoint | System client |
| FR-030 | FEAT-020 | Tidak menyimpan business data; optional preference storage | Developer/stakeholder |
| FR-031 | FEAT-021 | Tidak ada entity database | Product owner, AI agent |
| FR-032–FR-034 | FEAT-022 | `referral_programs`, `referral_program_targets`, `referral_codes`, `referral_attributions`, `student_registrations`, `users` | Admin, Sistem, Calon Murid/Murid |
| FR-035–FR-036 | FEAT-023 | `referral_codes`, `referral_attributions`, `student_registrations`, `users` | Admin/Pemilik Referral, Sistem, Calon Murid |
| FR-037–FR-038 | FEAT-024 | `programs`, `learning_modules`, `student_registrations` | Pengunjung, Calon Murid, Admin |
| FR-039–FR-041 | FEAT-017 | `users`, `audit_logs` | Admin |
| FR-042–FR-043 | FEAT-025 | `users`, `user_roles`, `referral_codes`, `referral_attributions`, `referral_payouts` | Referrer, Admin |
