import { UnassignedStudent } from "@/app/(portal)/(admin)/plotting/_types/plotting";
import { getStoredData, saveStoredData } from "@/app/_lib/storage";

const STORAGE_KEY = "sakode_unassigned_students";

export const DEFAULT_UNASSIGNED_STUDENTS: UnassignedStudent[] = [
  {
    id: "STD-801",
    name: "Akbar Alkatiri",
    email: "akbar.alkatiri@gmail.com",
    phone: "+62 812-1111-2222",
    programName: "Frontend Bootcamp (React)",
    programSlug: "frontend",
    registrationDate: "05 Jul 2026",
    notes: "Ingin fokus belajar Next.js dan State Management (Zustand/Redux). Punya background HTML/CSS dasar.",
    address: "Cabang Jakarta Selatan - Jl. Kemang Raya No. 12",
    paymentType: "lunas",
    paymentConfirmed: true,
    normalPrice: 850000,
    isGroup: false
  },
  {
    id: "STD-802",
    name: "Bella Safira",
    email: "bella.safira@yahoo.com",
    phone: "+62 813-2222-3333",
    programName: "Backend Bootcamp (Laravel)",
    programSlug: "backend",
    registrationDate: "06 Jul 2026",
    notes: "Melanjutkan dari kelas trial sebelumnya. Sangat tertarik dengan cara penyampaian Kak Akbar.",
    address: "Cabang Bandung - Jl. Dago No. 45",
    paymentType: "lunas",
    paymentConfirmed: true,
    isConversion: true,
    previousTrialMentorId: "MTR-001", // Akbar Ramadhan
    trialPricePaid: 50000,
    normalPrice: 850000,
    isGroup: false
  },
  {
    id: "STD-803",
    name: "Kelompok Belajar Figma (3 Anak)",
    email: "charles.go@outlook.com",
    phone: "+62 856-3333-4444",
    programName: "UI/UX Design Bootcamp (Belajar Kelompok)",
    programSlug: "uiux",
    registrationDate: "06 Jul 2026",
    notes: "Pendaftaran belajar kelompok bersama teman kampus. Ingin dibimbing langsung di lab komputer cabang.",
    address: "Cabang Surabaya - Jl. Gubeng Masjid No. 20",
    paymentType: "lunas",
    paymentConfirmed: true,
    normalPrice: 750000,
    isGroup: true,
    groupMembers: ["Charles Go", "Dendi Kurniawan", "Eka Prasetya"],
    pricePerParticipant: 250000
  },
  {
    id: "STD-804",
    name: "Diana Prince",
    email: "diana.prince@gmail.com",
    phone: "+62 877-4444-5555",
    programName: "Data Science Bootcamp (Python)",
    programSlug: "datascience",
    registrationDate: "07 Jul 2026",
    notes: "Mengajukan opsi pembayaran cicilan bulanan (3x cicil) karena keterbatasan biaya di awal.",
    address: "Cabang Yogyakarta - Jl. Kaliurang KM 5",
    paymentType: "cicil",
    paymentConfirmed: false, // Pending Admin Confirmation!
    normalPrice: 900000,
    isGroup: false
  },
  {
    id: "STD-805",
    name: "Evan Dimas",
    email: "evan.dimas@gmail.com",
    phone: "+62 811-5555-6666",
    programName: "Mobile Developer Bootcamp (Flutter)",
    programSlug: "mobile",
    registrationDate: "07 Jul 2026",
    notes: "Pilih opsi Trial Dulu untuk mencoba 1 sesi pendampingan offline sebelum komitmen lunas.",
    address: "Cabang Semarang - Jl. Pandanaran No. 10",
    paymentType: "trial",
    paymentConfirmed: true,
    normalPrice: 800000,
    trialPricePaid: 50000,
    isGroup: false
  },
  {
    id: "STD-806",
    name: "Fani Rahma",
    email: "fani.rahma@mail.com",
    phone: "+62 899-6666-7777",
    programName: "Frontend Bootcamp (React)",
    programSlug: "frontend",
    registrationDate: "07 Jul 2026",
    notes: "Pembayaran cicilan pertama terkonfirmasi masuk. Siap diplotting ke mentor terdekat.",
    address: "Cabang Jakarta Selatan - Jl. Kemang Raya No. 12",
    paymentType: "cicil",
    paymentConfirmed: true,
    normalPrice: 850000,
    isGroup: false
  }
];

export const getStoredStudents = (): UnassignedStudent[] =>
  getStoredData(STORAGE_KEY, DEFAULT_UNASSIGNED_STUDENTS);

export const saveStoredStudents = (students: UnassignedStudent[]) =>
  saveStoredData(STORAGE_KEY, students);
