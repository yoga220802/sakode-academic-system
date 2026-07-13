# SAKODE Academic System — Review Report (FE-SLICE-011)

**Feature Slice:** FE-SLICE-011 — Trial Registration Management  
**Role:** Admin  
**Visual Style:** Dynamic style presets (Default, Bento Grid, Neobrutalism, Claymorphism, Glassmorphism, Minimalism)

---

## 1. Scope & Accomplished Work

We have fully designed and implemented the Admin Trial Registration Management dashboard under the new `/trials` route, customized for SAKODE's primary **offline onsite course structure (Mentor Datang ke Rumah)**:

### A. Core Workspace Features (`/trials`)
- **Responsive Workspace Layout**:
  - **Left column**: Contains the searchable trial bookings list. Toggleable tab filters let Admin view *Semua Sesi*, *Antrean Pendaftaran* (Pending), *Aktif / Terjadwal* (Scheduled), *Telah Selesai* (Completed), and *Dibatalkan* (Cancelled).
  - **Right column**: Context-aware detail inspector panel showing student contact card (email, WhatsApp number), chosen bootcamp program, trial status history, and notes.
- **Offline Home Mentoring Integration**:
  - Replaced online video links with **Alamat Rumah Lengkap** (Jl. Margonda Raya Depok, BSD Tangerang Selatan, Tebet Jakarta Selatan, Kalibata City, and Galaxy Bekasi) and **Patokan Lokasi** (e.g. *Masuk gang sebelah warung sate, pagar hitam*).
  - Added a **Metode Pembelajaran** indicator showing: *"Mentoring Offline (Mentor Datang ke Rumah)"* with a home icon.
  - **Google Maps Route Navigation**: Always makes the Google Maps route link (`https://maps.google.com/?q=<address>`) visible and openable for the Admin to inspect locations immediately, displaying a disclaimer if a mentor has not yet been assigned to the trial.
- **Agenda/Calendar Toggle**:
  - Switch between a compact card-based **Daftar Booking** and a chronological weekly **Agenda Kalender** highlighting trial dates, start times, and assigned mentors.
- **Interactive Rescheduling**:
  - Reschedule modal allows changing dates and time slots (supports 5 daily slots: 10:00, 14:00, 16:00, 19:00, and 20:00 WIB).
- **Dynamic Mentor Assignment**:
  - Allows assigning active SAKODE mentors (Akbar, Yoga, Rina, Budi) to trial sessions.
- **Status Workflows**:
  - Admin can mark scheduled trials as **Selesai** (complete) or **Batal** (cancel) directly from the inspector.

### B. Domicile Proximity advisor & Conflict State Simulator
- **Student Region Visibility**: Added `studentRegion` properties (Depok, Tangerang Selatan, Jakarta Selatan, Bekasi) to mock database entries, displayed directly on the booking list card items so the Admin sees locations at a glance before plotting.
- **Mentor Domicile Visibility**: Added `domicile` properties (Jakarta Selatan, Depok, Tangerang Selatan, Bekasi) to `MOCK_MENTORS`, which are displayed directly inside the mentor selection dropdown options.
- **Proximity Advisor Alert**: Added a regional advisor block inside the assignment dialog:
  - **Same Region Match (Success)**: *"Kecocokan Wilayah: Mentor Yoga Pratama berdomisili di wilayah yang sama (Depok) dengan lokasi rumah siswa."*
  - **Cross-Region Mismatch (Warning)**: *"Peringatan Jarak: Lokasi trial berada di Depok, sedangkan domisili Akbar Ramadhan adalah Jakarta Selatan (membutuhkan waktu perjalanan ekstra)."*
- **Conflict Simulator Control**: Added a toggle switch in the page header to turn on/off automatic conflict checking.
- **Conflict Warning Alerts**:
  - **Tutor Clash Warning**: Shows a warning banner if the assigned mentor already has another trial booked on that date.
  - **Out-of-Hours/Weekend Warning**: Triggers a warning if the Admin schedules a trial on a Saturday or Sunday.

---

## 2. Interactive Fixture Scenarios

1. **Default**: Pre-populates five realistic mock trial registrations with pending, scheduled, completed, and cancelled states with full Indonesian home addresses.
2. **Loading**: Simulates connection latency using structured skeleton pulse animations.
3. **Empty**: Shows empty box illustration when there are no trials pending.
4. **Error**: Simulates server exceptions with retry triggers.

---

## 3. Responsive Support

- **Desktop (>=1024px)**: Dual columns with list/agenda on the left and inspector workspace on the right.
- **Mobile/Tablet (<1024px)**: Stacked single column layout. Detail inspector opens below the list when a trial is selected.

---

## 4. Verification & Build Results

- **Lint:** Ran `npm run lint` successfully with **0 errors**.
- **Build:** Ran `npm run build` successfully with **clean Next.js compilation** outputting the static `/trials` page.
- **Dynamic Themes:** All UI elements adapt perfectly to claymorphic rounded corners, glassmorphic blurred backdrops, and neobrutalist thick borders.
- **Accessibility:** All dialog controls include `aria-label` properties for screen readers.
