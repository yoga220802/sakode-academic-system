/**
 * FE-SLICE-023 — Mentor Personal Schedule Mock Service
 */

export interface CourseModule {
  id: string;
  number: number;
  title: string;
  description?: string;
}

export interface Homework {
  title: string;
  description: string;
  submissionMethod: string;
  deadline: string;
}

export interface WeeklySchedule {
  id: string;
  studentName: string;
  course: string;
  mode: "1-on-1" | "Kelompok";
  branch: string;
  address: string;
  frequency: "1x seminggu" | "2x seminggu";
  days: string[];
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  totalSessions: number;
  completedSessions: number;
  status: "Aktif" | "Selesai" | "Dihentikan";
  modules: CourseModule[];
}

export interface PersonalSession {
  id: string;
  scheduleId: string;
  sessionNumber: number;
  studentName: string;
  course: string;
  topic: string;
  moduleId?: string;
  date: string;
  startTime: string;
  endTime: string;
  address: string;
  mode: "1-on-1" | "Kelompok";
  status: "Terjadwal" | "Berlangsung" | "Selesai" | "Rescheduled" | "Dibatalkan";
  startedAt?: string;
  completedAt?: string;
  statusNotes?: string;
  hasConflictNotice?: boolean;
  classType: "Offline" | "Online";
  devices?: string[];
  homework?: Homework;
}

export const DEVICE_OPTIONS: string[] = [
  "Laptop", "MacBook", "iPad / Tablet", "Monitor Eksternal",
  "VS Code", "Google Chrome", "Figma", "Postman",
  "Terminal / CMD", "Node.js", "Git", "Docker",
  "Whiteboard / Papan Tulis", "Spidol Whiteboard", "Buku Catatan",
];

export const SUBMISSION_METHODS: string[] = [
  "WhatsApp", "Email", "Google Drive",
  "GitHub Repository", "Google Classroom",
  "Link Eksternal", "Foto / Scan Langsung",
];

// ─── Mock Weekly Schedules ────────────────────────────────────────────────────

const MOCK_WEEKLY_SCHEDULES: WeeklySchedule[] = [
  {
    id: "ws-01", studentName: "Doni Pratama",
    course: "React & Next.js Professional (Private)", mode: "1-on-1",
    branch: "Yogyakarta (Kota)",
    address: "Jl. Kaliurang KM 5.2, No. 12, Sleman, D.I. Yogyakarta",
    frequency: "2x seminggu", days: ["Senin", "Kamis"],
    startTime: "16:00", endTime: "17:30",
    startDate: "2026-06-23", endDate: "2026-09-25",
    totalSessions: 24, completedSessions: 3, status: "Aktif",
    modules: [
      { id: "m1", number: 1, title: "Pengenalan HTML & CSS Modern", description: "HTML5, CSS Variables, Flexbox, dan Grid Layout" },
      { id: "m2", number: 2, title: "JavaScript ES6+ Fundamentals", description: "Arrow functions, destructuring, promises, async/await" },
      { id: "m3", number: 3, title: "React Core Concepts", description: "JSX, Components, Props, State, dan Hooks dasar" },
      { id: "m4", number: 4, title: "React State Management", description: "useState, useEffect, useContext, dan custom hooks" },
      { id: "m5", number: 5, title: "Next.js App Router", description: "File-based routing, layouts, dan loading states" },
      { id: "m6", number: 6, title: "Data Fetching & API Routes", description: "Server components, fetch, dan API route handlers" },
    ],
  },
  {
    id: "ws-02", studentName: "Siti Rahma",
    course: "TypeScript Advanced Coding (Private)", mode: "1-on-1",
    branch: "Surabaya (Gubeng)",
    address: "Jl. Dharmahusada Indah Barat VIII/15, Gubeng, Surabaya, Jawa Timur",
    frequency: "1x seminggu", days: ["Rabu"],
    startTime: "09:00", endTime: "10:30",
    startDate: "2026-07-02", endDate: "2026-09-24",
    totalSessions: 12, completedSessions: 1, status: "Aktif",
    modules: [
      { id: "ts1", number: 1, title: "TypeScript Basics & Compiler Config", description: "Setup TS, tsconfig.json, dan dasar type annotation" },
      { id: "ts2", number: 2, title: "Interfaces & Type Aliases", description: "Mendefinisikan bentuk data dengan interface dan type" },
      { id: "ts3", number: 3, title: "Generics & Utility Types", description: "Generic functions, Partial, Required, Pick, Omit" },
      { id: "ts4", number: 4, title: "Decorators & Advanced Patterns", description: "Class decorators, mixins, dan design patterns" },
    ],
  },
  {
    id: "ws-03", studentName: "Kelompok Sleman A",
    course: "React & Next.js Professional (Group)", mode: "Kelompok",
    branch: "Yogyakarta (Sleman)",
    address: "Jl. Kaliurang KM 10 (Basecamp Sleman), No. 45, Sleman, D.I. Yogyakarta",
    frequency: "2x seminggu", days: ["Selasa", "Jumat"],
    startTime: "19:00", endTime: "20:30",
    startDate: "2026-06-17", endDate: "2026-09-19",
    totalSessions: 24, completedSessions: 5, status: "Aktif",
    modules: [
      { id: "rg1", number: 1, title: "Pengenalan HTML & CSS Modern", description: "Dasar HTML5, Flexbox, dan CSS Grid" },
      { id: "rg2", number: 2, title: "JavaScript ES6+ Fundamentals", description: "ES6+, Promises, dan Async/Await" },
      { id: "rg3", number: 3, title: "React Core Concepts", description: "JSX, Components, Props, dan State" },
      { id: "rg4", number: 4, title: "React State Management", description: "Hooks, Context, dan Custom Hooks" },
      { id: "rg5", number: 5, title: "Next.js App Router", description: "Routing, Layouts, dan Loading States" },
      { id: "rg6", number: 6, title: "Project Final: Full Stack App", description: "Bangun aplikasi lengkap dari nol" },
    ],
  },
];

// ─── Mock Sessions ────────────────────────────────────────────────────────────

const MOCK_SESSIONS: PersonalSession[] = [
  // ── ws-01 · Doni Pratama · Senin & Kamis ──────────────────────────────────
  {
    id: "ps-01", scheduleId: "ws-01", sessionNumber: 1, mode: "1-on-1",
    studentName: "Doni Pratama", course: "React & Next.js Professional (Private)",
    topic: "Pengenalan HTML & CSS Modern", moduleId: "m1",
    date: "2026-06-23", startTime: "16:00", endTime: "17:30",
    address: "Jl. Kaliurang KM 5.2, No. 12, Sleman, D.I. Yogyakarta",
    status: "Selesai", classType: "Offline",
    startedAt: "2026-06-23T16:02:00", completedAt: "2026-06-23T17:35:00",
    devices: ["Laptop", "VS Code", "Google Chrome"],
    homework: { title: "Latihan Flexbox & Grid Layout", description: "Buat layout halaman landing page menggunakan CSS Flexbox dan Grid. Minimal 3 section.", submissionMethod: "GitHub Repository", deadline: "2026-06-26" },
  },
  {
    id: "ps-02", scheduleId: "ws-01", sessionNumber: 2, mode: "1-on-1",
    studentName: "Doni Pratama", course: "React & Next.js Professional (Private)",
    topic: "CSS Grid & Flexbox Deep Dive", moduleId: "m1",
    date: "2026-06-26", startTime: "16:00", endTime: "17:30",
    address: "Jl. Kaliurang KM 5.2, No. 12, Sleman, D.I. Yogyakarta",
    status: "Selesai", classType: "Offline",
    startedAt: "2026-06-26T16:05:00", completedAt: "2026-06-26T17:28:00",
    devices: ["Laptop", "VS Code", "Buku Catatan"],
  },
  {
    id: "ps-03", scheduleId: "ws-01", sessionNumber: 3, mode: "1-on-1",
    studentName: "Doni Pratama", course: "React & Next.js Professional (Private)",
    topic: "JavaScript ES6+ Fundamentals", moduleId: "m2",
    date: "2026-06-30", startTime: "16:00", endTime: "17:30",
    address: "Jl. Kaliurang KM 5.2, No. 12, Sleman, D.I. Yogyakarta",
    status: "Selesai", classType: "Offline",
    startedAt: "2026-06-30T16:01:00", completedAt: "2026-06-30T17:38:00",
    devices: ["Laptop", "VS Code", "Terminal / CMD", "Node.js"],
    homework: { title: "Implementasi ES6+ di Project", description: "Refactor kode JS lama menggunakan arrow functions, destructuring, dan async/await.", submissionMethod: "GitHub Repository", deadline: "2026-07-03" },
  },
  {
    id: "ps-04", scheduleId: "ws-01", sessionNumber: 4, mode: "1-on-1",
    studentName: "Doni Pratama", course: "React & Next.js Professional (Private)",
    topic: "React Core Concepts", moduleId: "m3",
    date: "2026-07-10", startTime: "16:00", endTime: "17:30",
    address: "Jl. Kaliurang KM 5.2, No. 12, Sleman, D.I. Yogyakarta",
    status: "Terjadwal", classType: "Offline",
  },
  {
    id: "ps-05", scheduleId: "ws-01", sessionNumber: 5, mode: "1-on-1",
    studentName: "Doni Pratama", course: "React & Next.js Professional (Private)",
    topic: "React State & Props Management", moduleId: "m4",
    date: "2026-07-14", startTime: "16:00", endTime: "17:30",
    address: "Jl. Kaliurang KM 5.2, No. 12, Sleman, D.I. Yogyakarta",
    status: "Terjadwal", classType: "Offline",
  },
  {
    id: "ps-06", scheduleId: "ws-01", sessionNumber: 6, mode: "1-on-1",
    studentName: "Doni Pratama", course: "React & Next.js Professional (Private)",
    topic: "React Hooks: useEffect & Custom Hooks", moduleId: "m4",
    date: "2026-07-17", startTime: "16:00", endTime: "17:30",
    address: "Jl. Kaliurang KM 5.2, No. 12, Sleman, D.I. Yogyakarta",
    status: "Terjadwal", classType: "Offline",
  },
  // ── ws-02 · Siti Rahma · Rabu ─────────────────────────────────────────────
  {
    id: "ps-07", scheduleId: "ws-02", sessionNumber: 1, mode: "1-on-1",
    studentName: "Siti Rahma", course: "TypeScript Advanced Coding (Private)",
    topic: "TypeScript Basics & Compiler Config", moduleId: "ts1",
    date: "2026-07-02", startTime: "09:00", endTime: "10:30",
    address: "Jl. Dharmahusada Indah Barat VIII/15, Gubeng, Surabaya, Jawa Timur",
    status: "Selesai", classType: "Offline",
    startedAt: "2026-07-02T09:03:00", completedAt: "2026-07-02T10:35:00",
    devices: ["Laptop", "VS Code", "Git"],
  },
  {
    id: "ps-08", scheduleId: "ws-02", sessionNumber: 2, mode: "1-on-1",
    studentName: "Siti Rahma", course: "TypeScript Advanced Coding (Private)",
    topic: "Interfaces & Type Aliases", moduleId: "ts2",
    date: "2026-07-09", startTime: "09:00", endTime: "10:30",
    address: "Jl. Dharmahusada Indah Barat VIII/15, Gubeng, Surabaya, Jawa Timur",
    status: "Rescheduled", classType: "Offline",
    statusNotes: "Dipindahkan ke 16 Juli atas permintaan murid. Tetap Offline.",
  },
  {
    id: "ps-09", scheduleId: "ws-02", sessionNumber: 2, mode: "1-on-1",
    studentName: "Siti Rahma", course: "TypeScript Advanced Coding (Private)",
    topic: "Interfaces & Type Aliases", moduleId: "ts2",
    date: "2026-07-16", startTime: "09:00", endTime: "10:30",
    address: "Jl. Dharmahusada Indah Barat VIII/15, Gubeng, Surabaya, Jawa Timur",
    status: "Terjadwal", classType: "Offline",
  },
  {
    id: "ps-10", scheduleId: "ws-02", sessionNumber: 3, mode: "1-on-1",
    studentName: "Siti Rahma", course: "TypeScript Advanced Coding (Private)",
    topic: "Generics & Utility Types", moduleId: "ts3",
    date: "2026-07-23", startTime: "09:00", endTime: "10:30",
    address: "Jl. Dharmahusada Indah Barat VIII/15, Gubeng, Surabaya, Jawa Timur",
    status: "Terjadwal", classType: "Offline",
  },
  // ── ws-03 · Kelompok Sleman A · Selasa & Jumat ────────────────────────────
  {
    id: "ps-11", scheduleId: "ws-03", sessionNumber: 1, mode: "Kelompok",
    studentName: "Kelompok Sleman A", course: "React & Next.js Professional (Group)",
    topic: "Pengenalan HTML & CSS Modern", moduleId: "rg1",
    date: "2026-06-17", startTime: "19:00", endTime: "20:30",
    address: "Jl. Kaliurang KM 10 (Basecamp Sleman), No. 45, Sleman, D.I. Yogyakarta",
    status: "Selesai", classType: "Offline",
    startedAt: "2026-06-17T19:04:00", completedAt: "2026-06-17T20:28:00",
    devices: ["Laptop", "VS Code", "Google Chrome", "Whiteboard / Papan Tulis"],
  },
  {
    id: "ps-12", scheduleId: "ws-03", sessionNumber: 2, mode: "Kelompok",
    studentName: "Kelompok Sleman A", course: "React & Next.js Professional (Group)",
    topic: "CSS Grid & Flexbox Workshop", moduleId: "rg1",
    date: "2026-06-20", startTime: "19:00", endTime: "20:30",
    address: "Jl. Kaliurang KM 10 (Basecamp Sleman), No. 45, Sleman, D.I. Yogyakarta",
    status: "Selesai", classType: "Offline",
    startedAt: "2026-06-20T19:02:00", completedAt: "2026-06-20T20:33:00",
    devices: ["Laptop", "VS Code", "Spidol Whiteboard"],
    homework: { title: "Replika Layout Tokopedia", description: "Buat ulang layout homepage Tokopedia menggunakan CSS Grid & Flexbox tanpa framework.", submissionMethod: "WhatsApp", deadline: "2026-06-24" },
  },
  {
    id: "ps-13", scheduleId: "ws-03", sessionNumber: 3, mode: "Kelompok",
    studentName: "Kelompok Sleman A", course: "React & Next.js Professional (Group)",
    topic: "JavaScript ES6+ Fundamentals", moduleId: "rg2",
    date: "2026-06-24", startTime: "19:00", endTime: "20:30",
    address: "Jl. Kaliurang KM 10 (Basecamp Sleman), No. 45, Sleman, D.I. Yogyakarta",
    status: "Selesai", classType: "Offline",
    startedAt: "2026-06-24T19:00:00", completedAt: "2026-06-24T20:30:00",
    devices: ["Laptop", "VS Code", "Terminal / CMD", "Node.js"],
  },
  {
    id: "ps-14", scheduleId: "ws-03", sessionNumber: 4, mode: "Kelompok",
    studentName: "Kelompok Sleman A", course: "React & Next.js Professional (Group)",
    topic: "Arrow Functions, Destructuring & Spread", moduleId: "rg2",
    date: "2026-06-27", startTime: "19:00", endTime: "20:30",
    address: "Jl. Kaliurang KM 10 (Basecamp Sleman), No. 45, Sleman, D.I. Yogyakarta",
    status: "Selesai", classType: "Offline",
    startedAt: "2026-06-27T19:05:00", completedAt: "2026-06-27T20:25:00",
    devices: ["Laptop", "VS Code", "Buku Catatan"],
  },
  {
    id: "ps-15", scheduleId: "ws-03", sessionNumber: 5, mode: "Kelompok",
    studentName: "Kelompok Sleman A", course: "React & Next.js Professional (Group)",
    topic: "Promises & Async/Await", moduleId: "rg2",
    date: "2026-07-01", startTime: "19:00", endTime: "20:30",
    address: "Jl. Kaliurang KM 10 (Basecamp Sleman), No. 45, Sleman, D.I. Yogyakarta",
    status: "Selesai", classType: "Offline",
    startedAt: "2026-07-01T19:02:00", completedAt: "2026-07-01T20:35:00",
    devices: ["Laptop", "VS Code", "Terminal / CMD"],
  },
  {
    id: "ps-16", scheduleId: "ws-03", sessionNumber: 6, mode: "Kelompok",
    studentName: "Kelompok Sleman A", course: "React & Next.js Professional (Group)",
    topic: "React Core Concepts — Intro", moduleId: "rg3",
    date: "2026-07-04", startTime: "19:00", endTime: "20:30",
    address: "Jl. Kaliurang KM 10 (Basecamp Sleman), No. 45, Sleman, D.I. Yogyakarta",
    status: "Dibatalkan", classType: "Offline",
    statusNotes: "Libur Nasional — kelas diliburkan oleh Lead Mentor.",
  },
  {
    id: "ps-17", scheduleId: "ws-03", sessionNumber: 7, mode: "Kelompok",
    studentName: "Kelompok Sleman A", course: "React & Next.js Professional (Group)",
    topic: "React Core Concepts", moduleId: "rg3",
    date: "2026-07-11", startTime: "19:00", endTime: "20:30",
    address: "Jl. Kaliurang KM 10 (Basecamp Sleman), No. 45, Sleman, D.I. Yogyakarta",
    status: "Terjadwal", classType: "Offline",
  },
  {
    id: "ps-18", scheduleId: "ws-03", sessionNumber: 8, mode: "Kelompok",
    studentName: "Kelompok Sleman A", course: "React & Next.js Professional (Group)",
    topic: "React State Management", moduleId: "rg4",
    date: "2026-07-15", startTime: "19:00", endTime: "20:30",
    address: "Jl. Kaliurang KM 10 (Basecamp Sleman), No. 45, Sleman, D.I. Yogyakarta",
    status: "Terjadwal", classType: "Offline",
  },
];

// ─── Export Functions ─────────────────────────────────────────────────────────

export function fetchWeeklySchedules(): Promise<WeeklySchedule[]> {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_WEEKLY_SCHEDULES), 200));
}

export function fetchPersonalSessions(): Promise<PersonalSession[]> {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_SESSIONS), 300));
}
