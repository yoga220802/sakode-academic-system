/**
 * FE-SLICE-Grading — Mentor Grading Mock Service (v3)
 *
 * Untuk jalur Kelompok: setiap tugas dikumpulkan oleh masing-masing anggota.
 * Setiap submission = satu GradingTask dengan memberName terisi.
 * Untuk jalur 1-on-1: memberName kosong (hanya ada satu submisi per tugas).
 */

export type GradingStatus = "Belum Dinilai" | "Sudah Dinilai" | "Revisi Diperlukan";

export interface GradeResult {
  score: number;
  feedback: string;
  status: GradingStatus;
  gradedAt: string;
}

export interface GradingTask {
  id: string;
  pathId: string;
  /** Nama anggota yang mengumpulkan (hanya untuk mode Kelompok) */
  memberName?: string;
  studentName: string;   // nama murid / nama kelompok
  course: string;
  moduleTitle: string;
  taskTitle: string;
  taskDescription: string;
  submissionMethod: string;
  submissionLink?: string;
  submittedAt: string;
  deadline: string;
  isLate: boolean;
  status: GradingStatus;
  result?: GradeResult;
}

export interface GradingPath {
  id: string;
  studentName: string;
  course: string;
  mode: "1-on-1" | "Kelompok";
  members?: string[];     // hanya untuk Kelompok
  totalTasks: number;     // total submissions
  gradedCount: number;
  pendingCount: number;
  revisionCount: number;
  lastSubmittedAt: string;
}

export const GRADE_STATUSES: GradingStatus[] = ["Sudah Dinilai", "Revisi Diperlukan"];

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_TASKS: GradingTask[] = [

  // ══════════════════════════════════════════════════════════════════════════
  // path-01 · Doni Pratama · 1-on-1
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "t01-01", pathId: "path-01",
    studentName: "Doni Pratama", course: "React & Next.js Professional (Private)",
    moduleTitle: "Modul 1 — HTML & CSS Modern",
    taskTitle: "Latihan Flexbox & Grid Layout",
    taskDescription: "Buat layout landing page menggunakan CSS Flexbox dan Grid. Minimal 3 section: Hero, About, dan Contact.",
    submissionMethod: "GitHub Repository",
    submissionLink: "https://github.com/donipratama/latihan-flexbox-grid",
    submittedAt: "2026-06-28T14:22:00", deadline: "2026-06-29", isLate: false,
    status: "Sudah Dinilai",
    result: { score: 88, feedback: "Layout sudah bagus dan responsive. Perlu perbaikan pada spacing section Hero dan penambahan hover effect di tombol CTA.", status: "Sudah Dinilai", gradedAt: "2026-06-29T10:15:00" },
  },
  {
    id: "t01-02", pathId: "path-01",
    studentName: "Doni Pratama", course: "React & Next.js Professional (Private)",
    moduleTitle: "Modul 2 — JavaScript ES6+",
    taskTitle: "Implementasi ES6+ di Project",
    taskDescription: "Refactor kode JavaScript lama menggunakan arrow functions, destructuring, dan async/await. Pastikan tidak ada var.",
    submissionMethod: "GitHub Repository",
    submissionLink: "https://github.com/donipratama/refactor-es6",
    submittedAt: "2026-07-05T09:10:00", deadline: "2026-07-06", isLate: false,
    status: "Belum Dinilai",
  },
  {
    id: "t01-03", pathId: "path-01",
    studentName: "Doni Pratama", course: "React & Next.js Professional (Private)",
    moduleTitle: "Modul 3 — React Core",
    taskTitle: "Komponen Reusable Button & Input",
    taskDescription: "Buat komponen Button dan Input reusable dengan TypeScript props, variant (primary/secondary/ghost), dan size (sm/md/lg).",
    submissionMethod: "GitHub Repository",
    submissionLink: "https://github.com/donipratama/react-components",
    submittedAt: "2026-07-09T20:30:00", deadline: "2026-07-10", isLate: false,
    status: "Belum Dinilai",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // path-02 · Siti Rahma · 1-on-1
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "t02-01", pathId: "path-02",
    studentName: "Siti Rahma", course: "TypeScript Advanced Coding (Private)",
    moduleTitle: "Modul 1 — TypeScript Basics",
    taskTitle: "Setup TypeScript Project & Type Annotation",
    taskDescription: "Inisialisasi proyek TypeScript dengan tsconfig.json optimal. Buat 5 fungsi dengan type annotation lengkap untuk input dan output-nya.",
    submissionMethod: "Email", submissionLink: "siti.rahma@example.com",
    submittedAt: "2026-07-04T11:30:00", deadline: "2026-07-06", isLate: false,
    status: "Sudah Dinilai",
    result: { score: 95, feedback: "Sangat baik! Semua type annotation benar dan tsconfig.json dikonfigurasi dengan strict mode. Bonus: sudah menggunakan union types di 2 fungsi.", status: "Sudah Dinilai", gradedAt: "2026-07-05T09:00:00" },
  },
  {
    id: "t02-02", pathId: "path-02",
    studentName: "Siti Rahma", course: "TypeScript Advanced Coding (Private)",
    moduleTitle: "Modul 2 — Interfaces & Type Aliases",
    taskTitle: "Type System untuk E-Commerce API",
    taskDescription: "Definisikan interfaces dan type aliases untuk model Product, User, Order, dan Cart. Gunakan intersection types dan optional properties.",
    submissionMethod: "GitHub Repository",
    submissionLink: "https://github.com/sitirahma/ts-ecommerce-types",
    submittedAt: "2026-07-10T08:45:00", deadline: "2026-07-11", isLate: false,
    status: "Belum Dinilai",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // path-03 · Kelompok Sleman A · Kelompok — submission per anggota
  //   Anggota: Andi Setiawan, Budi Santoso, Citra Dewi
  // ══════════════════════════════════════════════════════════════════════════

  // ── Tugas 1: Replika Layout Tokopedia ──────────────────────────────────
  {
    id: "t03-a1", pathId: "path-03", memberName: "Andi Setiawan",
    studentName: "Kelompok Sleman A", course: "React & Next.js Professional (Group)",
    moduleTitle: "Modul 1 — HTML & CSS Modern",
    taskTitle: "Replika Layout Tokopedia",
    taskDescription: "Buat ulang layout homepage Tokopedia menggunakan CSS Grid & Flexbox tanpa framework CSS apapun.",
    submissionMethod: "GitHub Repository",
    submissionLink: "https://github.com/andisetiawan/tokopedia-replika",
    submittedAt: "2026-06-25T19:30:00", deadline: "2026-06-27", isLate: false,
    status: "Sudah Dinilai",
    result: { score: 85, feedback: "Struktur grid Andi sudah solid, navbar sticky sudah benar. Footer perlu sedikit adjustment alignment.", status: "Sudah Dinilai", gradedAt: "2026-06-27T14:00:00" },
  },
  {
    id: "t03-b1", pathId: "path-03", memberName: "Budi Santoso",
    studentName: "Kelompok Sleman A", course: "React & Next.js Professional (Group)",
    moduleTitle: "Modul 1 — HTML & CSS Modern",
    taskTitle: "Replika Layout Tokopedia",
    taskDescription: "Buat ulang layout homepage Tokopedia menggunakan CSS Grid & Flexbox tanpa framework CSS apapun.",
    submissionMethod: "WhatsApp", submissionLink: "+62 813-1111-2222",
    submittedAt: "2026-06-25T20:45:00", deadline: "2026-06-27", isLate: false,
    status: "Revisi Diperlukan",
    result: { score: 65, feedback: "Navbar belum sticky dan footer alignment perlu diperbaiki. Bagian hero section masih menggunakan float—tolong ganti ke flexbox/grid.", status: "Revisi Diperlukan", gradedAt: "2026-06-27T14:30:00" },
  },
  {
    id: "t03-c1", pathId: "path-03", memberName: "Citra Dewi",
    studentName: "Kelompok Sleman A", course: "React & Next.js Professional (Group)",
    moduleTitle: "Modul 1 — HTML & CSS Modern",
    taskTitle: "Replika Layout Tokopedia",
    taskDescription: "Buat ulang layout homepage Tokopedia menggunakan CSS Grid & Flexbox tanpa framework CSS apapun.",
    submissionMethod: "Google Drive",
    submissionLink: "https://drive.google.com/file/d/citradewi-tokopedia",
    submittedAt: "2026-06-26T10:00:00", deadline: "2026-06-27", isLate: false,
    status: "Sudah Dinilai",
    result: { score: 90, feedback: "Luar biasa! Layout paling rapi di kelompok ini. Responsivitas sudah sangat baik. Hanya perlu tambahkan transition pada hover state banner promo.", status: "Sudah Dinilai", gradedAt: "2026-06-27T15:00:00" },
  },

  // ── Tugas 2: Mini Project To-Do App ───────────────────────────────────
  {
    id: "t03-a2", pathId: "path-03", memberName: "Andi Setiawan",
    studentName: "Kelompok Sleman A", course: "React & Next.js Professional (Group)",
    moduleTitle: "Modul 2 — JavaScript ES6+",
    taskTitle: "Mini Project: To-Do App ES6+",
    taskDescription: "Buat To-Do App menggunakan vanilla JS ES6+: classes, modules, localStorage, dan async fetch ke JSONPlaceholder API.",
    submissionMethod: "GitHub Repository",
    submissionLink: "https://github.com/andisetiawan/todo-es6",
    submittedAt: "2026-07-08T21:00:00", deadline: "2026-07-07", isLate: true,
    status: "Belum Dinilai",
  },
  {
    id: "t03-b2", pathId: "path-03", memberName: "Budi Santoso",
    studentName: "Kelompok Sleman A", course: "React & Next.js Professional (Group)",
    moduleTitle: "Modul 2 — JavaScript ES6+",
    taskTitle: "Mini Project: To-Do App ES6+",
    taskDescription: "Buat To-Do App menggunakan vanilla JS ES6+: classes, modules, localStorage, dan async fetch ke JSONPlaceholder API.",
    submissionMethod: "GitHub Repository",
    submissionLink: "https://github.com/budisantoso/todo-es6",
    submittedAt: "2026-07-08T22:15:00", deadline: "2026-07-07", isLate: true,
    status: "Belum Dinilai",
  },
  {
    id: "t03-c2", pathId: "path-03", memberName: "Citra Dewi",
    studentName: "Kelompok Sleman A", course: "React & Next.js Professional (Group)",
    moduleTitle: "Modul 2 — JavaScript ES6+",
    taskTitle: "Mini Project: To-Do App ES6+",
    taskDescription: "Buat To-Do App menggunakan vanilla JS ES6+: classes, modules, localStorage, dan async fetch ke JSONPlaceholder API.",
    submissionMethod: "GitHub Repository",
    submissionLink: "https://github.com/citradewi/todo-es6",
    submittedAt: "2026-07-06T19:30:00", deadline: "2026-07-07", isLate: false,
    status: "Sudah Dinilai",
    result: { score: 92, feedback: "Implementasi sangat baik. Penggunaan async/await sudah benar dan localStorage terintegrasi dengan mulus. Class design sudah OOP.", status: "Sudah Dinilai", gradedAt: "2026-07-07T09:00:00" },
  },
];

// ─── Path metadata ────────────────────────────────────────────────────────────

const PATH_META: Record<string, { mode: GradingPath["mode"]; members?: string[] }> = {
  "path-01": { mode: "1-on-1" },
  "path-02": { mode: "1-on-1" },
  "path-03": { mode: "Kelompok", members: ["Andi Setiawan", "Budi Santoso", "Citra Dewi"] },
};

function derivePaths(tasks: GradingTask[]): GradingPath[] {
  const map = new Map<string, GradingPath>();
  for (const t of tasks) {
    if (!map.has(t.pathId)) {
      const meta = PATH_META[t.pathId] ?? { mode: "1-on-1" };
      map.set(t.pathId, {
        id: t.pathId,
        studentName: t.studentName,
        course: t.course,
        mode: meta.mode,
        members: meta.members,
        totalTasks: 0, gradedCount: 0, pendingCount: 0, revisionCount: 0,
        lastSubmittedAt: t.submittedAt,
      });
    }
    const p = map.get(t.pathId)!;
    p.totalTasks++;
    if (t.status === "Belum Dinilai") p.pendingCount++;
    else if (t.status === "Sudah Dinilai") p.gradedCount++;
    else if (t.status === "Revisi Diperlukan") p.revisionCount++;
    if (t.submittedAt > p.lastSubmittedAt) p.lastSubmittedAt = t.submittedAt;
  }
  return [...map.values()].sort((a, b) => b.pendingCount - a.pendingCount);
}

export function fetchGradingData(): Promise<{ paths: GradingPath[]; tasks: GradingTask[] }> {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ paths: derivePaths(MOCK_TASKS), tasks: MOCK_TASKS }), 250)
  );
}
