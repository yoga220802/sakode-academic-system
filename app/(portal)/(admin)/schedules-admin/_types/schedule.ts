export interface MentoringSchedule {
  id: string;
  studentId: string;
  studentName: string;
  isGroup: boolean;
  programName: string;
  programSlug: string;
  mentorId: string;
  mentorName: string;
  address: string; // Offline branch address
  roomName: string; // e.g. "Lab Utama - Meja A"
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  moduleChapter: string; // e.g. "Modul 2: React Hooks"
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  notes?: string;
}

export interface OverlapValidationResult {
  isConflict: boolean;
  conflictType?: "mentor" | "student";
  conflictingSession?: MentoringSchedule;
  message?: string;
}
