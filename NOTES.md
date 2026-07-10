# Laporan Perubahan — Clean Code Segmen Admin

## Ringkasan

Refactoring fokus pada pengurangan duplikasi boilerplate dan pemakaian shared components yang sudah ada. Build sukses, tidak ada error.

## Perubahan

### 1. Shared Utilities Baru — `app/(portal)/(admin)/_shared/`

| File                     | Fungsi                                                                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `localStorageService.ts` | `getStoredData<T>(key, fallback)` dan `saveStoredData<T>(key, data)` — ganti 7 clones boilerplate SSR guard + JSON.parse + try/catch |
| `Toast.tsx`              | `useToast()` hook + `<Toast>` component — extract dari ~45 baris inline pattern di tiap page                                         |
| `SimulationStateBar.tsx` | Simulator state toggle buttons — extract dari 5+ page                                                                                |
| `styleUtils.ts`          | `getSubElementClass(style, type)` — data-driven map ganti switch 70+ baris                                                           |
| `index.ts`               | Barrel export                                                                                                                        |

### 2. 8 Mock Services — Pakai `localStorageService`

Mengganti boilerplate di:

- `extracurriculars-admin/_services/extracurricular-mock.ts`
- `logs/_services/logs-mock.ts`
- `mentors/_services/mentor-mock.ts`
- `students/_services/student-mock.ts`
- `plotting/_services/plotting-mock.ts`
- `principal-membership/_services/principal-membership-mock.ts`
- `users/_services/users-mock.ts`
- `schedules-admin/_services/schedule-mock.ts`

**Dampak:** ~10 baris/file dihapus, konsistensi pattern terjaga.

### 3. Refactor Halaman Contoh — `extracurriculars-admin/page.tsx`

| Inline pattern                                   | Diganti                                          |
| ------------------------------------------------ | ------------------------------------------------ |
| Breadcrumb + Header + tombol aksi (~30 baris)    | `PageHeader` dari `@/app/_components/PageHeader` |
| Metrics cards (~45 baris)                        | `StatCard` × 3 dari `@/app/_components/StatCard` |
| Simulator state bar (~50 baris)                  | `SimulationStateBar` dari `_shared`              |
| Toast + AnimatePresence + setTimeout (~45 baris) | `useToast` + `<Toast>` dari `_shared`            |
| `getSubElementClass` switch 70 baris             | `getSubElementClass` data-driven dari `_shared`  |

**Dampak:** Page size turun dari 755 → 555 baris (~27%), tanpa kehilangan fungsionalitas.

### 4. Bersihkan Dead Code

| File                      | Perubahan                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------- |
| `app/(portal)/layout.tsx` | Hapus import & komentar `DashboardLockSystem`                                         |
| 16 file admin             | Hapus `/* eslint-disable react-hooks/set-state-in-effect */` (no-op, rule name palsu) |
