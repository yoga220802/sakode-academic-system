export interface TimeSlot {
  label: string;
  start: string;
  end: string;
}

export interface DayInfo {
  name: string;
  label: string;
  dateOffset: number;
}

export const TIME_SLOTS: TimeSlot[] = [
  { label: "08:00 - 10:00", start: "08:00", end: "10:00" },
  { label: "10:00 - 12:00", start: "10:00", end: "12:00" },
  { label: "13:00 - 15:00", start: "13:00", end: "15:00" },
  { label: "15:00 - 17:00", start: "15:00", end: "17:00" },
  { label: "17:00 - 19:00", start: "17:00", end: "19:00" },
];

export const DAYS: DayInfo[] = [
  { name: "Monday", label: "Senin", dateOffset: 0 },
  { name: "Tuesday", label: "Selasa", dateOffset: 1 },
  { name: "Wednesday", label: "Rabu", dateOffset: 2 },
  { name: "Thursday", label: "Kamis", dateOffset: 3 },
  { name: "Friday", label: "Jumat", dateOffset: 4 },
  { name: "Saturday", label: "Sabtu", dateOffset: 5 },
  { name: "Sunday", label: "Minggu", dateOffset: 6 },
];

export function getWeekDayDateString(offset: number, weekStart: Date = new Date("2026-07-06")): string {
  const d = new Date(weekStart);
  d.setDate(d.getDate() + offset);
  return d.toISOString().split("T")[0];
}

export function getWeekDayLabel(offset: number, weekStart: Date = new Date("2026-07-06")): string {
  const d = new Date(weekStart);
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}
