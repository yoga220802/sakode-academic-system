# Laporan Perubahan — Refactor Portal Pages

## Ringkasan

Refactoring struktural untuk middleware auth, shared utilities, service layer, dan page standardization. Build sukses, 53 pages + middleware compiled tanpa error.

## Perubahan

### 1. Middleware Auth + Role Guard
File baru: `middleware.ts`

- Proteksi 20+ route berdasarkan role via cookie `sakode-role`
- Rute publik: `/`, `/login`, `/register`
- Role mapping:
  - **Admin:** `/students`, `/programs`, `/plotting`, `/schedules-admin`, dll
  - **Mentor/Mentor Lead:** `/my-students`, `/schedules`, `/grading`, `/plotting-queue`
  - **Student:** `/my-classes`, `/modules`, `/my-mentor-schedule`, `/trial-registration`
  - **Principal:** `/principal-org`, `/principal-reports`
- Redirect: unauthenticated → `/login`, wrong role → `/dashboard`
- AuthContext otomatis set/clear `sakode-role` cookie saat login/logout

### 2. Route-Group Layouts (Client-side Guard)
| File | Role |
|------|------|
| `app/(portal)/(admin)/layout.tsx` | admin only |
| `app/(portal)/(mentor)/layout.tsx` | mentor / mentor_lead |
| `app/(portal)/(student)/layout.tsx` | murid only |

Defense-in-depth: middleware di edge + layout guard di client.

### 3. Shared Utilities — Pindah ke App Level
Semua sebelumnya terkunci di `(admin)/_shared/`, sekarang bisa dipakai semua portal.

| Old Path | New Path |
|----------|----------|
| `(admin)/_shared/localStorageService.ts` | `app/_lib/storage.ts` |
| `(admin)/_shared/styleUtils.ts` | `app/_utils/styleUtils.ts` |
| `(admin)/_shared/Toast.tsx` | `app/_components/Toast.tsx` |

`(admin)/_shared/index.ts` tetap ada sebagai re-export backward compat. File asli dihapus.

### 4. Service Layer — `app/_services/`
Pattern konsisten untuk data fetching, siap migrasi mock → real API.

| Service | Type | Konsumen |
|---------|------|----------|
| `student-service.ts` | `ActiveStudent` | admin/students, admin/schedules-admin |
| `mentor-student-service.ts` | `DetailedAssignedStudent` | mentor/my-students |

### 5. Page Refactor — Standardized Pattern
#### admin/students (771 → 410 baris)
- Inline `getSubElementClass` → shared `@/app/_utils/styleUtils`
- Inline loading/error/empty → `DataStateBoundary`
- Inline header + breadcrumb → `PageHeader`
- Inline simulator bar → `SimulationStateBar`
- Inline toast → `useToast` + `Toast`

#### mentor/my-students (415 → 290 baris)
- Inline skeleton → `DataStateBoundary`
- Inline `innerCard()` → shared `getSubElementClass`
- Inline header → `PageHeader`

### 6. Dead Code Dihapus
- `(admin)/students/_services/student-mock.ts`
- `(admin)/students/_types/student.ts`
- `(mentor)/my-students/_mocks/myStudentsService.ts`
- `(admin)/_shared/localStorageService.ts`
- `(admin)/_shared/styleUtils.ts`
- `(admin)/_shared/Toast.tsx`
- Empty directories

### 7. Catatan Next.js 16
Middleware terdeteksi sebagai `ƒ Proxy (Middleware)` — ada deprecation warning "middleware → proxy", masih berfungsi penuh.
