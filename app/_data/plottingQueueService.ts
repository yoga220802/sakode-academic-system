/**
 * FE-SLICE-019 — Scoped Mentor Plotting Mock Service
 *
 * Provides scoped student queues, mentor matching, and persistent state simulation
 * for the Mentor Lead's specific domain: "Web Development (React & Next.js)".
 */

import { StudentPriority, MentorAvailability } from "@/app/_data/mentorLeadOverviewService";

export interface ScopedStudent {
  id: string;
  name: string;
  course: string;
  programSlug: "frontend" | "backend" | "uiux";
  registeredAt: string;
  priority: StudentPriority;
  priorityColor: "red" | "orange" | "blue" | "green";
  waitingHours: number;
  learningMode: "Private" | "Group" | "Trial";
  branch: string;
  paymentStatus: "Lunas" | "DP 40%" | "Belum Bayar";
  groupMembers?: string[];
  isConversion: boolean;
  previousTrialMentorId?: string;
  email: string;
  phone: string;
  preferredSchedule: string;
  address: string;
}

export interface ScopedMentor {
  id: string;
  name: string;
  skills: string[];
  activeStudents: number;
  slotLimit: number;
  availability: MentorAvailability;
  rating: number;
  trialStudentsTaught: number;
}

// ─── Scoped Raw Mock Data ───────────────────────────────────────────────────

const SCOPED_STUDENTS: ScopedStudent[] = [
  {
    id: "std-101",
    name: "Doni Pratama",
    course: "React & Next.js Professional (Private)",
    programSlug: "frontend",
    registeredAt: "2 jam lalu",
    priority: "Tinggi",
    priorityColor: "orange",
    waitingHours: 2,
    learningMode: "Private",
    branch: "Yogyakarta (Kota)",
    paymentStatus: "Lunas",
    isConversion: false,
    email: "doni.pratama@gmail.com",
    phone: "0812-3456-7890",
    preferredSchedule: "Sore (16:00 - 18:00 WIB)",
    address: "Jl. Kaliurang KM 5.2, No. 12, Sleman, D.I. Yogyakarta",
  },
  {
    id: "std-102",
    name: "Siti Rahma",
    course: "TypeScript Advanced Coding (Trial)",
    programSlug: "frontend",
    registeredAt: "5 jam lalu",
    priority: "Sedang",
    priorityColor: "blue",
    waitingHours: 5,
    learningMode: "Trial",
    branch: "Surabaya (Gubeng)",
    paymentStatus: "Lunas",
    isConversion: false,
    email: "siti.rahma@yahoo.com",
    phone: "0898-7654-3210",
    preferredSchedule: "Pagi (09:00 - 11:00 WIB)",
    address: "Jl. Dharmahusada Indah Barat VIII/15, Gubeng, Surabaya, Jawa Timur",
  },
  {
    id: "std-103",
    name: "Galih Prasetyo",
    course: "React & Next.js Professional (Group)",
    programSlug: "frontend",
    registeredAt: "1 hari lalu",
    priority: "Mendesak",
    priorityColor: "red",
    waitingHours: 26,
    learningMode: "Group",
    branch: "Yogyakarta (Sleman)",
    paymentStatus: "Lunas",
    groupMembers: ["Budi Santoso", "Andri Maulana"],
    isConversion: true,
    previousTrialMentorId: "mtr-202", // Rian Hidayat
    email: "galih.p@outlook.com",
    phone: "0852-1122-3344",
    preferredSchedule: "Malam (19:00 - 21:00 WIB)",
    address: "Jl. Kaliurang KM 10 (Basecamp Belajar Kelompok Sleman), No. 45, Sleman, D.I. Yogyakarta",
  },
];

const SCOPED_MENTORS: ScopedMentor[] = [
  {
    id: "mtr-201",
    name: "Akbar Syahputra",
    skills: ["React", "Next.js", "Tailwind CSS", "Zustand"],
    activeStudents: 10,
    slotLimit: 10,
    availability: "Sibuk (Penuh)",
    rating: 4.8,
    trialStudentsTaught: 14,
  },
  {
    id: "mtr-202",
    name: "Rian Hidayat",
    skills: ["React", "Next.js", "TypeScript", "Zustand", "Redux"],
    activeStudents: 3,
    slotLimit: 10,
    availability: "Tersedia",
    rating: 4.9,
    trialStudentsTaught: 28, // Matches Galih Prasetyo's trial mentor conversion priority
  },
  {
    id: "mtr-203",
    name: "Dewi Lestari",
    skills: ["React", "Tailwind CSS", "TypeScript", "Testing"],
    activeStudents: 8,
    slotLimit: 10,
    availability: "Hampir Penuh",
    rating: 4.7,
    trialStudentsTaught: 9,
  },
  {
    id: "mtr-204",
    name: "Fajar Nugraha",
    skills: ["TypeScript", "Zustand", "HTML5/CSS3"],
    activeStudents: 2,
    slotLimit: 10,
    availability: "Tersedia",
    rating: 4.5,
    trialStudentsTaught: 4,
  },
];

// Helper database mapping locally
const STORAGE_KEY_STUDENTS = "sakode-scoped-students";
const STORAGE_KEY_MENTORS = "sakode-scoped-mentors";

export function getScopedStudents(): ScopedStudent[] {
  if (typeof window === "undefined") return SCOPED_STUDENTS;
  const stored = localStorage.getItem(STORAGE_KEY_STUDENTS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(SCOPED_STUDENTS));
    return SCOPED_STUDENTS;
  }
  const parsed = JSON.parse(stored) as ScopedStudent[];
  // If the stored data is outdated (missing new keys), overwrite with fresh mock data
  if (parsed.length > 0 && !parsed[0].address) {
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(SCOPED_STUDENTS));
    return SCOPED_STUDENTS;
  }
  return parsed;
}

export function saveScopedStudents(data: ScopedStudent[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(data));
  }
}

export function getScopedMentors(): ScopedMentor[] {
  if (typeof window === "undefined") return SCOPED_MENTORS;
  const stored = localStorage.getItem(STORAGE_KEY_MENTORS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY_MENTORS, JSON.stringify(SCOPED_MENTORS));
    return SCOPED_MENTORS;
  }
  return JSON.parse(stored);
}

export function saveScopedMentors(data: ScopedMentor[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_MENTORS, JSON.stringify(data));
  }
}

export function resetScopedData() {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(SCOPED_STUDENTS));
    localStorage.setItem(STORAGE_KEY_MENTORS, JSON.stringify(SCOPED_MENTORS));
  }
}
