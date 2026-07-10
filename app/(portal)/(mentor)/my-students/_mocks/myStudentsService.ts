/**
 * FE-SLICE-022 — Mentor Assigned Students Mock Service
 *
 * Provides a scoped database of students assigned to the logged-in mentor,
 * details of their curriculum progress, tasks, schedules, and maps-ready locations.
 */

export interface StudentTaskLog {
  id: string;
  title: string;
  status: "Lulus" | "Belum Dinilai" | "Belum Kumpul";
  grade?: number;
}

export interface DetailedAssignedStudent {
  id: string;
  name: string;
  course: string;
  branch: string;
  email: string;
  phone: string;
  preferredSchedule: string;
  address: string;
  progressPercent: number;
  learningMode: "Private" | "Group" | "Trial";
  status: "Lancar" | "Butuh Bimbingan Ekstra";
  registeredDate: string;
  groupMembers?: string[];
  tasks: StudentTaskLog[];
}

const MOCK_ASSIGNED_STUDENTS: DetailedAssignedStudent[] = [
  {
    id: "std-m-01",
    name: "Doni Pratama",
    course: "React & Next.js Professional (Private)",
    branch: "Yogyakarta (Kota)",
    email: "doni.pratama@gmail.com",
    phone: "0812-3456-7890",
    preferredSchedule: "Sore (16:00 - 18:00 WIB)",
    address: "Jl. Kaliurang KM 5.2, No. 12, Sleman, D.I. Yogyakarta",
    progressPercent: 65,
    learningMode: "Private",
    status: "Lancar",
    registeredDate: "20 Juni 2026",
    tasks: [
      { id: "t-01", title: "Modul 1: HTML5 Semantics & Basic CSS", status: "Lulus", grade: 90 },
      { id: "t-02", title: "Modul 2: Flexbox & Responsive Layouts", status: "Lulus", grade: 85 },
      { id: "t-03", title: "Modul 3: JavaScript ES6 Basic Logic", status: "Lulus", grade: 88 },
      { id: "t-04", title: "Modul 4: Integrasi Zustand State Store", status: "Belum Dinilai" },
      { id: "t-05", title: "Modul 5: Next.js App Router Setup", status: "Belum Kumpul" },
    ],
  },
  {
    id: "std-m-02",
    name: "Siti Rahma",
    course: "TypeScript Advanced Coding (Trial)",
    branch: "Surabaya (Gubeng)",
    email: "siti.rahma@yahoo.com",
    phone: "0898-7654-3210",
    preferredSchedule: "Pagi (09:00 - 11:00 WIB)",
    address: "Jl. Dharmahusada Indah Barat VIII/15, Gubeng, Surabaya, Jawa Timur",
    progressPercent: 40,
    learningMode: "Trial",
    status: "Lancar",
    registeredDate: "25 Juni 2026",
    tasks: [
      { id: "t-11", title: "Trial Modul 1: Intro to JavaScript", status: "Lulus", grade: 95 },
      { id: "t-12", title: "Trial Modul 2: TypeScript Types & Interfaces", status: "Lulus", grade: 92 },
      { id: "t-13", title: "Trial Modul 3: Fetching API in TypeScript", status: "Belum Kumpul" },
    ],
  },
  {
    id: "std-m-03",
    name: "Galih Prasetyo (Group)",
    course: "React & Next.js Professional (Group)",
    branch: "Yogyakarta (Sleman)",
    email: "galih.p@outlook.com",
    phone: "0852-1122-3344",
    preferredSchedule: "Malam (19:00 - 21:00 WIB)",
    address: "Jl. Kaliurang KM 10 (Basecamp Belajar Kelompok Sleman), Sleman, D.I. Yogyakarta",
    progressPercent: 80,
    learningMode: "Group",
    status: "Lancar",
    registeredDate: "15 Juni 2026",
    groupMembers: ["Budi Santoso", "Andri Maulana"],
    tasks: [
      { id: "t-21", title: "Modul 1: HTML & CSS layouts", status: "Lulus", grade: 95 },
      { id: "t-22", title: "Modul 2: JavaScript logic basic", status: "Lulus", grade: 90 },
      { id: "t-23", title: "Modul 3: React state & props", status: "Lulus", grade: 88 },
      { id: "t-24", title: "Modul 4: Next.js routing structures", status: "Lulus", grade: 85 },
      { id: "t-25", title: "Modul 5: Tailwind CSS Integration", status: "Belum Kumpul" },
    ],
  },
  {
    id: "std-m-04",
    name: "Budi Santoso",
    course: "React & Next.js Professional (Group)",
    branch: "Yogyakarta (Sleman)",
    email: "budi.s@outlook.com",
    phone: "0823-3344-5566",
    preferredSchedule: "Malam (19:00 - 21:00 WIB)",
    address: "Jl. Kaliurang KM 10 (Basecamp Belajar Kelompok Sleman), Sleman, D.I. Yogyakarta",
    progressPercent: 30,
    learningMode: "Group",
    status: "Butuh Bimbingan Ekstra",
    registeredDate: "15 Juni 2026",
    groupMembers: ["Galih Prasetyo", "Andri Maulana"],
    tasks: [
      { id: "t-31", title: "Modul 1: HTML & CSS layouts", status: "Lulus", grade: 75 },
      { id: "t-32", title: "Modul 2: JavaScript logic basic", status: "Belum Dinilai" },
      { id: "t-33", title: "Modul 3: React state & props", status: "Belum Kumpul" },
    ],
  },
];

export function fetchAssignedStudents(): Promise<DetailedAssignedStudent[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_ASSIGNED_STUDENTS);
    }, 300);
  });
}
