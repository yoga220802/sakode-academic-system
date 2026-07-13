import { MentoringSchedule, OverlapValidationResult } from "../_types/schedule";
import { getStoredData, saveStoredData } from "../../_shared";

const STORAGE_KEY = "sakode_mentoring_schedules";

export const DEFAULT_SCHEDULES: MentoringSchedule[] = [
  {
    id: "SCH-101",
    studentId: "STD-101",
    studentName: "Dzulkifli Putra",
    isGroup: false,
    programName: "React & Next.js Professional",
    programSlug: "frontend",
    mentorId: "MTR-001",
    mentorName: "Akbar Ramadhan",
    address: "Cabang Jakarta Selatan - Jl. Kemang Raya No. 12",
    roomName: "Ruang Kreatif A",
    date: "2026-07-08",
    startTime: "10:00",
    endTime: "12:00",
    moduleChapter: "Modul 3: Next.js Routing & RSC",
    status: "completed",
    notes: "Pembahasan mengenai nested layout dan dynamic metadata. Murid sangat antusias."
  },
  {
    id: "SCH-102",
    studentId: "STD-101",
    studentName: "Dzulkifli Putra",
    isGroup: false,
    programName: "React & Next.js Professional",
    programSlug: "frontend",
    mentorId: "MTR-001",
    mentorName: "Akbar Ramadhan",
    address: "Cabang Jakarta Selatan - Jl. Kemang Raya No. 12",
    roomName: "Ruang Kreatif A",
    date: "2026-07-15",
    startTime: "10:00",
    endTime: "12:00",
    moduleChapter: "Modul 4: State Management & TailwindCSS",
    status: "scheduled",
    notes: "Rencana membahas Integrasi Zustand untuk cart simulation."
  },
  {
    id: "SCH-103",
    studentId: "STD-102",
    studentName: "Siti Aminah",
    isGroup: false,
    programName: "React & Next.js Professional",
    programSlug: "frontend",
    address: "Cabang Yogyakarta - Jl. Kaliurang KM 5",
    mentorId: "MTR-002",
    mentorName: "Budi Santoso",
    roomName: "Meja Lab 2",
    date: "2026-07-09",
    startTime: "13:30",
    endTime: "15:30",
    moduleChapter: "Modul 5: Deployment, SEO & Optimization",
    status: "scheduled",
    notes: "Pembahasan persiapan build check and lighthouse audit."
  },
  {
    id: "SCH-104",
    studentId: "STD-104",
    studentName: "Kelompok Belajar Figma",
    isGroup: true,
    programName: "UI/UX Design Bootcamp",
    programSlug: "uiux",
    mentorId: "MTR-004",
    mentorName: "Dedi Cahyadi",
    address: "Cabang Surabaya - Jl. Gubeng Masjid No. 20",
    roomName: "Lab Figma Utama",
    date: "2026-07-10",
    startTime: "15:00",
    endTime: "17:00",
    moduleChapter: "Modul 1: User Research & Persona",
    status: "scheduled",
    notes: "Diskusi kelompok offline mengenai perumusan empathy map studi kasus E-Commerce."
  },
  {
    id: "SCH-105",
    studentId: "STD-103",
    studentName: "Joko Susilo",
    isGroup: false,
    programName: "Backend Dev Go/Docker",
    programSlug: "backend",
    mentorId: "MTR-003",
    mentorName: "Citra Kirana",
    address: "Cabang Semarang - Jl. Pandanaran No. 10",
    roomName: "Meja Pendamping C",
    date: "2026-07-08",
    startTime: "14:00",
    endTime: "16:00",
    moduleChapter: "Modul 2: Database & SQL with PostgreSQL",
    status: "completed",
    notes: "Berhasil merumuskan ERD dasar dan mempraktikkan SQL Join."
  },
  {
    id: "SCH-106",
    studentId: "STD-103",
    studentName: "Joko Susilo",
    isGroup: false,
    programName: "Backend Dev Go/Docker",
    programSlug: "backend",
    mentorId: "MTR-003",
    mentorName: "Citra Kirana",
    address: "Cabang Semarang - Jl. Pandanaran No. 10",
    roomName: "Meja Pendamping C",
    date: "2026-07-16",
    startTime: "14:00",
    endTime: "16:00",
    moduleChapter: "Modul 3: RESTful API & gRPC Development",
    status: "scheduled",
    notes: "Mempersiapkan routing HTTP router dan validasi struct."
  }
];

export const getStoredSchedules = (): MentoringSchedule[] =>
  getStoredData(STORAGE_KEY, DEFAULT_SCHEDULES);

export const saveStoredSchedules = (schedules: MentoringSchedule[]) =>
  saveStoredData(STORAGE_KEY, schedules);

// Helper: Check if two time slots overlap
export const checkTimeOverlap = (
  date1: string,
  start1: string,
  end1: string,
  date2: string,
  start2: string,
  end2: string
): boolean => {
  if (date1 !== date2) return false;

  const [hStart1, mStart1] = start1.split(":").map(Number);
  const [hEnd1, mEnd1] = end1.split(":").map(Number);
  const [hStart2, mStart2] = start2.split(":").map(Number);
  const [hEnd2, mEnd2] = end2.split(":").map(Number);

  const tStart1 = hStart1 * 60 + mStart1;
  const tEnd1 = hEnd1 * 60 + mEnd1;
  const tStart2 = hStart2 * 60 + mStart2;
  const tEnd2 = hEnd2 * 60 + mEnd2;

  // Overlap condition: start1 < end2 AND start2 < end1
  return tStart1 < tEnd2 && tStart2 < tEnd1;
};

// Main schedule conflict validator
export const validateScheduleConflicts = (
  newSession: Omit<MentoringSchedule, "id" | "status">,
  excludeSessionId?: string,
  allSchedules: MentoringSchedule[] = getStoredSchedules()
): OverlapValidationResult => {
  // Filter active schedules and exclude the one we are editing
  const activeSchedules = allSchedules.filter(
    (s) => s.id !== excludeSessionId && s.status !== "cancelled"
  );

  for (const session of activeSchedules) {
    const isOverlap = checkTimeOverlap(
      newSession.date,
      newSession.startTime,
      newSession.endTime,
      session.date,
      session.startTime,
      session.endTime
    );

    if (isOverlap) {
      // 1. Check if mentor has a conflict
      if (session.mentorId === newSession.mentorId) {
        return {
          isConflict: true,
          conflictType: "mentor",
          conflictingSession: session,
          message: `Jadwal bentrok! Kak ${session.mentorName} sudah memiliki jadwal bimbingan offline pada tanggal ${session.date} pukul ${session.startTime} - ${session.endTime} WIB di ${session.roomName}.`
        };
      }

      // 2. Check if student has a conflict
      if (session.studentId === newSession.studentId) {
        return {
          isConflict: true,
          conflictType: "student",
          conflictingSession: session,
          message: `Jadwal bentrok! Murid ${session.studentName} sudah memiliki jadwal bimbingan lain pada tanggal ${session.date} pukul ${session.startTime} - ${session.endTime} WIB.`
        };
      }
    }
  }

  return { isConflict: false };
};
