/**
 * FE-SLICE-020 — Scoped Schedule Management Mock Service
 *
 * Provides scoped mentoring calendar schedules, mentor directories,
 * student lists, and conflict detection rules for the Web Development domain.
 */

export interface ScopedSession {
  id: string;
  mentorId: string;
  mentorName: string;
  studentId: string;
  studentName: string;
  topic: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  mode: "1-on-1" | "Kelompok";
  branch: string;
  address: string;
}

export interface CompactMentor {
  id: string;
  name: string;
  availableSchedules: string[]; // e.g. ["Senin", "Rabu", "Jumat"]
}

export interface CompactStudent {
  id: string;
  name: string;
  learningMode: "Private" | "Group" | "Trial";
}

// ─── Scoped Raw Mock Data ───────────────────────────────────────────────────

const INITIAL_SESSIONS: ScopedSession[] = [
  {
    id: "ses-101",
    mentorId: "mtr-201",
    mentorName: "Akbar Syahputra",
    studentId: "std-101",
    studentName: "Doni Pratama",
    topic: "React Hooks & Zustand State Management",
    date: "2026-07-10",
    startTime: "16:00",
    endTime: "17:30",
    mode: "1-on-1",
    branch: "Yogyakarta (Kota)",
    address: "Jl. Kaliurang KM 5.2, No. 12, Sleman",
  },
  {
    id: "ses-102",
    mentorId: "mtr-203",
    mentorName: "Dewi Lestari",
    studentId: "std-102",
    studentName: "Siti Rahma",
    topic: "TypeScript Advanced Generics & OOP",
    date: "2026-07-10",
    startTime: "09:00",
    endTime: "10:30",
    mode: "1-on-1",
    branch: "Surabaya (Gubeng)",
    address: "Jl. Dharmahusada Indah Barat VIII/15, Gubeng",
  },
  {
    id: "ses-103",
    mentorId: "mtr-202",
    mentorName: "Rian Hidayat",
    studentId: "std-103",
    studentName: "Galih Prasetyo (Group)",
    topic: "Next.js App Router: Dynamic Routing & Data Fetching",
    date: "2026-07-11",
    startTime: "19:00",
    endTime: "20:30",
    mode: "Kelompok",
    branch: "Yogyakarta (Sleman)",
    address: "Jl. Kaliurang KM 10, No. 45, Sleman",
  },
];

const COMPACT_MENTORS: CompactMentor[] = [
  { id: "mtr-201", name: "Akbar Syahputra", availableSchedules: ["Senin", "Rabu", "Jumat"] },
  { id: "mtr-202", name: "Rian Hidayat", availableSchedules: ["Selasa", "Kamis", "Sabtu"] },
  { id: "mtr-203", name: "Dewi Lestari", availableSchedules: ["Senin", "Selasa", "Kamis"] },
  { id: "mtr-204", name: "Fajar Nugraha", availableSchedules: ["Rabu", "Jumat", "Sabtu"] },
];

const COMPACT_STUDENTS: CompactStudent[] = [
  { id: "std-101", name: "Doni Pratama", learningMode: "Private" },
  { id: "std-102", name: "Siti Rahma", learningMode: "Trial" },
  { id: "std-103", name: "Galih Prasetyo (Group)", learningMode: "Group" },
];

const STORAGE_KEY_SESSIONS = "sakode-scoped-sessions";

export function getScopedSessions(): ScopedSession[] {
  if (typeof window === "undefined") return INITIAL_SESSIONS;
  const stored = localStorage.getItem(STORAGE_KEY_SESSIONS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(INITIAL_SESSIONS));
    return INITIAL_SESSIONS;
  }
  return JSON.parse(stored);
}

export function saveScopedSessions(data: ScopedSession[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(data));
  }
}

export function getCompactMentors(): CompactMentor[] {
  return COMPACT_MENTORS;
}

export function getCompactStudents(): CompactStudent[] {
  return COMPACT_STUDENTS;
}

export function resetSessionsData() {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(INITIAL_SESSIONS));
  }
}

/**
 * Validates scheduling conflicts
 * Returns conflict message if conflict found, otherwise null
 */
export function checkScheduleConflict(
  sessions: ScopedSession[],
  date: string,
  startTime: string,
  endTime: string,
  mentorId: string,
  studentId: string,
  excludeSessionId?: string
): { type: "mentor" | "student"; message: string } | null {
  
  const start = parseTimeToMinutes(startTime);
  const end = parseTimeToMinutes(endTime);

  for (const session of sessions) {
    if (excludeSessionId && session.id === excludeSessionId) continue;
    if (session.date !== date) continue;

    const sStart = parseTimeToMinutes(session.startTime);
    const sEnd = parseTimeToMinutes(session.endTime);

    // Overlap checks
    const hasOverlap = (start < sEnd && end > sStart);

    if (hasOverlap) {
      if (session.mentorId === mentorId) {
        return {
          type: "mentor",
          message: `Bentrok Jadwal Mentor: ${session.mentorName} sudah memiliki sesi '${session.topic}' pada pukul ${session.startTime} - ${session.endTime} WIB.`,
        };
      }
      if (session.studentId === studentId) {
        return {
          type: "student",
          message: `Bentrok Jadwal Murid: ${session.studentName} sudah memiliki sesi '${session.topic}' pada pukul ${session.startTime} - ${session.endTime} WIB.`,
        };
      }
    }
  }

  return null;
}

function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}
