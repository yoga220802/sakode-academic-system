/**
 * FE-SLICE-018 — Mentor Lead Overview Mock Service
 *
 * Typed view models and async mock service for the Mentor Lead Overview page.
 * Replace these async functions with real API/server-action calls when BE is ready.
 */

// ─── View Model Types ────────────────────────────────────────────────────────

export type WorkloadAlertLevel = "warning" | "danger" | "info";
export type StudentPriority = "Mendesak" | "Tinggi" | "Sedang" | "Rendah";
export type MentorAvailability = "Tersedia" | "Hampir Penuh" | "Sibuk (Penuh)";

export interface MentorLeadScope {
  leadName: string;
  domainName: string;
  totalStudents: number;
  maxCapacity: number;
  pendingQueueCount: number;
  activeSessionsToday: number;
}

export interface WorkloadAlert {
  id: number;
  level: WorkloadAlertLevel;
  title: string;
  message: string;
  actionLabel: string;
  actionHref: string;
}

export interface UnassignedStudent {
  id: string;
  name: string;
  course: string;
  registeredAt: string;
  priority: StudentPriority;
  priorityColor: "red" | "orange" | "blue" | "green";
  waitingHours: number;
}

export interface MentorCapacity {
  id: string;
  name: string;
  expertise: string;
  activeStudents: number;
  slotLimit: number;
  availability: MentorAvailability;
  nextSession?: string;
}

export interface UpcomingSession {
  id: string;
  scheduledAt: string;
  studentName: string;
  mentorName: string;
  topic: string;
  mode: "1-on-1" | "Kelompok";
  isToday: boolean;
}

export interface PlottingActivity {
  id: string;
  relativeTime: string;
  description: string;
  actor: "Sistem" | "Lead" | "Admin";
  success: boolean;
}

export interface MentorLeadOverviewData {
  scope: MentorLeadScope;
  alerts: WorkloadAlert[];
  unassignedQueue: UnassignedStudent[];
  mentorCapacities: MentorCapacity[];
  upcomingSessions: UpcomingSession[];
  recentActivities: PlottingActivity[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_SCOPE: MentorLeadScope = {
  leadName: "Yogi Saputra",
  domainName: "Web Development (React & Next.js)",
  totalStudents: 23,
  maxCapacity: 32,
  pendingQueueCount: 3,
  activeSessionsToday: 5,
};

const MOCK_ALERTS: WorkloadAlert[] = [
  {
    id: 1,
    level: "danger",
    title: "Antrean Mendesak",
    message:
      "Siswa Galih Prasetyo belum dialokasikan mentor selama lebih dari 24 jam. Segera lakukan plotting.",
    actionLabel: "Plot Sekarang",
    actionHref: "/plotting-queue",
  },
  {
    id: 2,
    level: "warning",
    title: "Kapasitas Mentor Penuh",
    message:
      "Mentor Akbar Syahputra telah mencapai batas maksimal kuota bimbingan (10/10 siswa). Pertimbangkan re-alokasi.",
    actionLabel: "Lihat Kapasitas",
    actionHref: "/plotting-queue",
  },
];

const MOCK_QUEUE: UnassignedStudent[] = [
  {
    id: "std-001",
    name: "Doni Pratama",
    course: "React & Next.js Professional",
    registeredAt: "2 jam lalu",
    priority: "Tinggi",
    priorityColor: "orange",
    waitingHours: 2,
  },
  {
    id: "std-002",
    name: "Siti Rahma",
    course: "TypeScript Advanced Coding",
    registeredAt: "5 jam lalu",
    priority: "Sedang",
    priorityColor: "blue",
    waitingHours: 5,
  },
  {
    id: "std-003",
    name: "Galih Prasetyo",
    course: "React & Next.js Professional",
    registeredAt: "1 hari lalu",
    priority: "Mendesak",
    priorityColor: "red",
    waitingHours: 26,
  },
];

const MOCK_MENTORS: MentorCapacity[] = [
  {
    id: "mtr-001",
    name: "Akbar Syahputra",
    expertise: "React, Tailwind CSS",
    activeStudents: 10,
    slotLimit: 10,
    availability: "Sibuk (Penuh)",
    nextSession: "Hari Ini, 16:00 WIB",
  },
  {
    id: "mtr-002",
    name: "Rian Hidayat",
    expertise: "Next.js, TypeScript",
    activeStudents: 3,
    slotLimit: 10,
    availability: "Tersedia",
    nextSession: "Besok, 10:00 WIB",
  },
  {
    id: "mtr-003",
    name: "Dewi Lestari",
    expertise: "React, Redux, Testing",
    activeStudents: 8,
    slotLimit: 10,
    availability: "Hampir Penuh",
    nextSession: "Hari Ini, 19:30 WIB",
  },
  {
    id: "mtr-004",
    name: "Fajar Nugraha",
    expertise: "TypeScript, Node.js",
    activeStudents: 2,
    slotLimit: 10,
    availability: "Tersedia",
    nextSession: undefined,
  },
];

const MOCK_SESSIONS: UpcomingSession[] = [
  {
    id: "ses-001",
    scheduledAt: "Hari Ini, 16:00 – 17:30 WIB",
    studentName: "Budi Santoso",
    mentorName: "Akbar Syahputra",
    topic: "CSS Variables & Grid Layout",
    mode: "1-on-1",
    isToday: true,
  },
  {
    id: "ses-002",
    scheduledAt: "Hari Ini, 19:30 – 21:00 WIB",
    studentName: "Rina Wulandari",
    mentorName: "Dewi Lestari",
    topic: "State Management dengan Zustand",
    mode: "1-on-1",
    isToday: true,
  },
  {
    id: "ses-003",
    scheduledAt: "Hari Ini, 20:00 – 21:30 WIB",
    studentName: "Kelompok Batch A (3 Siswa)",
    mentorName: "Rian Hidayat",
    topic: "Next.js App Router & Server Components",
    mode: "Kelompok",
    isToday: true,
  },
  {
    id: "ses-004",
    scheduledAt: "Besok, 10:00 – 11:30 WIB",
    studentName: "Doni Pratama",
    mentorName: "Rian Hidayat",
    topic: "React Hooks & Custom Hook Patterns",
    mode: "1-on-1",
    isToday: false,
  },
  {
    id: "ses-005",
    scheduledAt: "Besok, 14:00 – 15:30 WIB",
    studentName: "Maya Kusuma",
    mentorName: "Dewi Lestari",
    topic: "TypeScript Generics & Utility Types",
    mode: "1-on-1",
    isToday: false,
  },
];

const MOCK_ACTIVITIES: PlottingActivity[] = [
  {
    id: "act-001",
    relativeTime: "3 jam lalu",
    description:
      "Siswa Budi Santoso dialokasikan ke Mentor Akbar Syahputra (kapasitas: 10/10).",
    actor: "Lead",
    success: true,
  },
  {
    id: "act-002",
    relativeTime: "5 jam lalu",
    description:
      "Siswa Rina Wulandari dialokasikan ke Mentor Dewi Lestari (kapasitas: 8/10).",
    actor: "Lead",
    success: true,
  },
  {
    id: "act-003",
    relativeTime: "1 hari lalu",
    description: "Siswa Galih Prasetyo masuk antrean — belum ada mentor tersedia dengan slot cukup.",
    actor: "Sistem",
    success: false,
  },
  {
    id: "act-004",
    relativeTime: "1 hari lalu",
    description:
      "Siswa Siti Rahma dialokasikan ke Mentor Fajar Nugraha oleh Sistem (Autopilot).",
    actor: "Sistem",
    success: true,
  },
  {
    id: "act-005",
    relativeTime: "2 hari lalu",
    description:
      "Penugasan Mentor Akbar Syahputra untuk Siswa Andri Maulana diperbarui oleh Admin.",
    actor: "Admin",
    success: true,
  },
];

// ─── Mock Service ─────────────────────────────────────────────────────────────

const SIMULATED_DELAY = 400; // ms — realistic async feel

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export type MentorLeadOverviewScenario = "default" | "loading" | "empty" | "no-alerts";

/**
 * Returns the full Mentor Lead overview data.
 * Scenario "empty" returns zero queue and no alerts to test empty state.
 * Scenario "no-alerts" returns full data but without urgent alerts.
 */
export async function fetchMentorLeadOverview(
  scenario: MentorLeadOverviewScenario = "default"
): Promise<MentorLeadOverviewData> {
  await delay(SIMULATED_DELAY);

  if (scenario === "empty") {
    return {
      scope: { ...MOCK_SCOPE, totalStudents: 0, pendingQueueCount: 0, activeSessionsToday: 0 },
      alerts: [],
      unassignedQueue: [],
      mentorCapacities: MOCK_MENTORS,
      upcomingSessions: [],
      recentActivities: [],
    };
  }

  if (scenario === "no-alerts") {
    return {
      scope: MOCK_SCOPE,
      alerts: [],
      unassignedQueue: MOCK_QUEUE,
      mentorCapacities: MOCK_MENTORS,
      upcomingSessions: MOCK_SESSIONS,
      recentActivities: MOCK_ACTIVITIES,
    };
  }

  // default
  return {
    scope: MOCK_SCOPE,
    alerts: MOCK_ALERTS,
    unassignedQueue: MOCK_QUEUE,
    mentorCapacities: MOCK_MENTORS,
    upcomingSessions: MOCK_SESSIONS,
    recentActivities: MOCK_ACTIVITIES,
  };
}
