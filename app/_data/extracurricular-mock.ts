import { ExtracurricularOrganization, ExtracurricularRegistration } from "@/app/(portal)/(admin)/extracurriculars-admin/_types/extracurricular";
import { getStoredData, saveStoredData } from "@/app/_lib/storage";

const STORAGE_KEY_ORGS = "sakode_extracurricular_organizations_v5";
const STORAGE_KEY_REGS = "sakode_extracurricular_registrations_v5";

export const DEFAULT_ORGANIZATIONS: ExtracurricularOrganization[] = [
  {
    id: "ORG-001",
    name: "SMA Negeri 1 Yogyakarta",
    picName: "Drs. H. Mulyono, M.Pd.",
    picEmail: "mulyono@sman1yogyakarta.sch.id",
    picPhone: "+62 812-9900-1122",
    provinsi: "DAERAH ISTIMEWA YOGYAKARTA",
    kabupaten: "KOTA YOGYAKARTA",
    kecamatan: "Danurejan",
    kelurahan: "Bausasran",
    rtRw: "RT 02 / RW 08",
    streetAddress: "Jl. Cik Di Tiro No. 1",
    status: "active",
    mentorId: "MTR-002",
    mentorName: "Budi Santoso",
    mouFileName: "MoU_SMA_N_1_Yogyakarta_Signed.pdf",
    mouSignedDate: "2026-01-15",
    members: [
      { id: "MEM-101", name: "Siti Aminah", grade: "XII IPA 2" },
      { id: "MEM-102", name: "Joko Susilo", grade: "X IPS 1" }
    ]
  },
  {
    id: "ORG-002",
    name: "SMK Telkom Jakarta",
    picName: "Ir. Hermawan Baskoro",
    picEmail: "hermawan@smktelkom-jkt.sch.id",
    picPhone: "+62 813-7788-9900",
    provinsi: "DKI JAKARTA",
    kabupaten: "KOTA JAKARTA SELATAN",
    kecamatan: "Tebet",
    kelurahan: "Tebet Barat",
    rtRw: "RT 05 / RW 03",
    streetAddress: "Jl. Tebet Barat Dalam Raya No. 4",
    status: "active",
    mentorId: "MTR-001",
    mentorName: "Akbar Ramadhan",
    mouFileName: "MoU_SMK_Telkom_Jakarta_Signed.pdf",
    mouSignedDate: "2026-02-10",
    members: [
      { id: "MEM-201", name: "Dzulkifli Putra", grade: "XI RPL 1" },
      { id: "MEM-202", name: "Charles Go", grade: "XII TKJ 2" }
    ]
  },
  {
    id: "ORG-003",
    name: "SMA Labschool Jakarta",
    picName: "Dra. Sri Wahyuni, M.Si.",
    picEmail: "sri.wahyuni@labschool.sch.id",
    picPhone: "+62 899-1122-3344",
    provinsi: "DKI JAKARTA",
    kabupaten: "KOTA JAKARTA SELATAN",
    kecamatan: "Kebayoran Baru",
    kelurahan: "Kramat Pela",
    rtRw: "RT 03 / RW 01",
    streetAddress: "Jl. KH. Ahmad Dahlan No. 14",
    status: "inactive",
    mentorId: "MTR-003",
    mentorName: "Citra Kirana",
    mouFileName: "MoU_SMA_Labschool_Draft.pdf",
    mouSignedDate: "2026-03-01",
    members: []
  }
];

export const DEFAULT_REGISTRATIONS: ExtracurricularRegistration[] = [
  {
    id: "REG-EX-001",
    studentId: "STD-101",
    studentName: "Dzulkifli Putra",
    schoolId: "ORG-002",
    schoolName: "SMK Telkom Jakarta",
    extracurricularName: "Coding Club Next.js",
    date: "2026-07-05",
    status: "pending"
  },
  {
    id: "REG-EX-002",
    studentId: "STD-102",
    studentName: "Siti Aminah",
    schoolId: "ORG-001",
    schoolName: "SMA Negeri 1 Yogyakarta",
    extracurricularName: "Robotics Arduino Lab",
    date: "2026-07-06",
    status: "approved"
  },
  {
    id: "REG-EX-003",
    studentId: "STD-103",
    studentName: "Joko Susilo",
    schoolId: "ORG-001",
    schoolName: "SMA Negeri 1 Yogyakarta",
    extracurricularName: "Coding Club Go",
    date: "2026-07-04",
    status: "rejected",
    rejectionReason: "Kuota peserta club untuk batch ini sudah penuh."
  },
  {
    id: "REG-EX-004",
    studentId: "STD-105",
    studentName: "Endah Lestari",
    schoolId: "ORG-003",
    schoolName: "SMA Labschool Jakarta",
    extracurricularName: "UI/UX Design Club",
    date: "2026-07-07",
    status: "pending"
  }
];

export const getStoredOrganizations = (): ExtracurricularOrganization[] =>
  getStoredData(STORAGE_KEY_ORGS, DEFAULT_ORGANIZATIONS);

export const saveStoredOrganizations = (orgs: ExtracurricularOrganization[]) =>
  saveStoredData(STORAGE_KEY_ORGS, orgs);

export const getStoredRegistrations = (): ExtracurricularRegistration[] =>
  getStoredData(STORAGE_KEY_REGS, DEFAULT_REGISTRATIONS);

export const saveStoredRegistrations = (regs: ExtracurricularRegistration[]) =>
  saveStoredData(STORAGE_KEY_REGS, regs);
