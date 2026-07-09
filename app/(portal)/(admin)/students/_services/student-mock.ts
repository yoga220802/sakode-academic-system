import { ActiveStudent } from "../_types/student";

const STORAGE_KEY = "sakode_active_students";

export const DEFAULT_ACTIVE_STUDENTS: ActiveStudent[] = [
  {
    id: "STD-101",
    name: "Dzulkifli Putra",
    email: "dzulkifli.putra@gmail.com",
    phone: "+62 812-3456-7890",
    programName: "React & Next.js Professional",
    programSlug: "frontend",
    address: "Cabang Jakarta Selatan - Jl. Kemang Raya No. 12",
    paymentType: "lunas",
    paymentConfirmed: true,
    assignedMentorId: "MTR-001",
    assignedMentorName: "Akbar Ramadhan",
    isGroup: false,
    completedModulesCount: 2,
    totalModulesCount: 5,
    status: "active",
    registrationDate: "13 Mar 2026",
    notes: "Belajar Next.js App Router. Punya ketertarikan tinggi pada performa SEO."
  },
  {
    id: "STD-102",
    name: "Siti Aminah",
    email: "siti.aminah@gmail.com",
    phone: "+62 855-4433-2211",
    programName: "React & Next.js Professional",
    programSlug: "frontend",
    address: "Cabang Yogyakarta - Jl. Kaliurang KM 5",
    paymentType: "lunas",
    paymentConfirmed: true,
    assignedMentorId: "MTR-002",
    assignedMentorName: "Budi Santoso",
    isGroup: false,
    completedModulesCount: 4,
    totalModulesCount: 5,
    status: "active",
    registrationDate: "11 Mar 2026",
    notes: "Sudah memahami Hooks dasar, sedang fokus penyusunan tugas akhir CRUD API."
  },
  {
    id: "STD-103",
    name: "Joko Susilo",
    email: "joko.susilo@hotmail.com",
    phone: "+62 899-7788-9900",
    programName: "Backend Dev Go/Docker",
    programSlug: "backend",
    address: "Cabang Semarang - Jl. Pandanaran No. 10",
    paymentType: "cicil",
    paymentConfirmed: true,
    assignedMentorId: "MTR-003",
    assignedMentorName: "Citra Kirana",
    isGroup: false,
    completedModulesCount: 1,
    totalModulesCount: 4,
    status: "active",
    registrationDate: "10 Mar 2026",
    notes: "Baru menyelesaikan modul Go Fundamentals. Masih menyesuaikan dengan pointer."
  },
  {
    id: "STD-104",
    name: "Kelompok Belajar Figma",
    email: "charles.go@outlook.com",
    phone: "+62 856-3333-4444",
    programName: "UI/UX Design Bootcamp",
    programSlug: "uiux",
    address: "Cabang Surabaya - Jl. Gubeng Masjid No. 20",
    paymentType: "lunas",
    paymentConfirmed: true,
    assignedMentorId: "MTR-004",
    assignedMentorName: "Dedi Cahyadi",
    isGroup: true,
    groupMembers: ["Charles Go", "Dendi Kurniawan", "Eka Prasetya"],
    completedModulesCount: 0,
    totalModulesCount: 4,
    status: "active",
    registrationDate: "06 Mar 2026",
    notes: "Belajar kelompok di lab offline Surabaya. Butuh pendampingan intensif Figma prototyping."
  },
  {
    id: "STD-105",
    name: "Endah Lestari",
    email: "endah.lestari@yahoo.com",
    phone: "+62 821-9876-5432",
    programName: "TypeScript & Data Structures",
    programSlug: "frontend",
    address: "Cabang Bandung - Jl. Dago No. 45",
    paymentType: "cicil",
    paymentConfirmed: true,
    assignedMentorId: null, // Belum diploting mentor!
    assignedMentorName: null,
    isGroup: false,
    completedModulesCount: 0,
    totalModulesCount: 3,
    status: "active",
    registrationDate: "13 Mar 2026",
    notes: "Pembayaran cicilan awal terverifikasi. Sedang menunggu plotting jadwal mentor lead."
  }
];

export const getStoredActiveStudents = (): ActiveStudent[] => {
  if (typeof window === "undefined") return DEFAULT_ACTIVE_STUDENTS;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ACTIVE_STUDENTS));
    return DEFAULT_ACTIVE_STUDENTS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_ACTIVE_STUDENTS;
  }
};

export const saveStoredActiveStudents = (students: ActiveStudent[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
};
