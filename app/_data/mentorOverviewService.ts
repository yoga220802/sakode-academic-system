/**
 * FE-SLICE-021 — Mentor Overview Mock Service
 *
 * Provides personal schedules, student progress metrics, grading queue,
 * and workload statistics specifically tailored for the Mentor's personal panel.
 */

export interface MentorSession {
  id: string;
  studentName: string;
  course: string;
  topic: string;
  date: string;
  time: string;
  type: "1-on-1" | "Kelompok";
  meetingLink: string;
  address?: string;
}

export interface MentorAssignedStudent {
  id: string;
  name: string;
  course: string;
  progressPercent: number;
  completedTasks: number;
  totalTasks: number;
  status: "Lancar" | "Butuh Bimbingan Ekstra" | "Terlambat";
}

export interface MentorGradingItem {
  id: string;
  studentName: string;
  taskTitle: string;
  submittedAt: string;
  timeLeft: string;
}

export interface MentorWorkload {
  mentorName: string;
  activeCount: number;
  limitCount: number;
  satisfactionRating: number;
  totalHoursTaught: number;
}

// ─── Scoped Raw Mock Data ───────────────────────────────────────────────────

const MOCK_WORKLOAD: MentorWorkload = {
  mentorName: "Rian Hidayat",
  activeCount: 6,
  limitCount: 10,
  satisfactionRating: 4.92,
  totalHoursTaught: 128,
};

const MOCK_SESSIONS: MentorSession[] = [
  {
    id: "ses-mentor-01",
    studentName: "Doni Pratama",
    course: "React & Next.js Professional",
    topic: "Intro to CSS Variables & Grid Layout",
    date: "Hari Ini",
    time: "16:00 - 17:30",
    type: "1-on-1",
    meetingLink: "https://zoom.us/j/1234567890",
    address: "Jl. Kaliurang KM 5.2, Sleman",
  },
  {
    id: "ses-mentor-02",
    studentName: "Galih Prasetyo (Group)",
    course: "React & Next.js Professional",
    topic: "Next.js App Router: Dynamic Routing & Data Fetching",
    date: "Hari Ini",
    time: "19:30 - 21:00",
    type: "Kelompok",
    meetingLink: "https://zoom.us/j/9876543210",
    address: "Jl. Kaliurang KM 10, Sleman",
  },
];

const MOCK_ASSIGNED_STUDENTS: MentorAssignedStudent[] = [
  {
    id: "std-m-01",
    name: "Doni Pratama",
    course: "React & Next.js Professional (Private)",
    progressPercent: 65,
    completedTasks: 13,
    totalTasks: 20,
    status: "Lancar",
  },
  {
    id: "std-m-02",
    name: "Siti Rahma",
    course: "TypeScript Advanced Coding (Trial)",
    progressPercent: 40,
    completedTasks: 4,
    totalTasks: 10,
    status: "Lancar",
  },
  {
    id: "std-m-03",
    name: "Galih Prasetyo (Group)",
    course: "React & Next.js Professional (Group)",
    progressPercent: 80,
    completedTasks: 16,
    totalTasks: 20,
    status: "Lancar",
  },
  {
    id: "std-m-04",
    name: "Budi Santoso",
    course: "React & Next.js Professional (Group)",
    progressPercent: 30,
    completedTasks: 6,
    totalTasks: 20,
    status: "Butuh Bimbingan Ekstra",
  },
];

const MOCK_GRADING_QUEUE: MentorGradingItem[] = [
  {
    id: "grd-01",
    studentName: "Budi Santoso",
    taskTitle: "Tugas Modul 3: Routing & APIs di Next.js",
    submittedAt: "3 jam lalu",
    timeLeft: "2 jam lagi",
  },
  {
    id: "grd-02",
    studentName: "Doni Pratama",
    taskTitle: "Tugas Modul 4: Integrasi Zustand State Store",
    submittedAt: "1 hari lalu",
    timeLeft: "1 hari lagi",
  },
];

export interface MentorOverviewData {
  workload: MentorWorkload;
  sessions: MentorSession[];
  students: MentorAssignedStudent[];
  gradings: MentorGradingItem[];
}

export function getMentorOverviewData(): Promise<MentorOverviewData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        workload: MOCK_WORKLOAD,
        sessions: MOCK_SESSIONS,
        students: MOCK_ASSIGNED_STUDENTS,
        gradings: MOCK_GRADING_QUEUE,
      });
    }, 300);
  });
}
