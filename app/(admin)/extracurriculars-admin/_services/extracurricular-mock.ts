import { ExtracurricularOrganization, ExtracurricularRegistration } from "../_types/extracurricular";

const STORAGE_KEY_ORGS = "sakode_extracurricular_organizations_v3";
const STORAGE_KEY_REGS = "sakode_extracurricular_registrations_v3";

export const DEFAULT_ORGANIZATIONS: ExtracurricularOrganization[] = [
  {
    id: "ORG-001",
    name: "SMA Negeri 1 Yogyakarta",
    picName: "Drs. H. Mulyono, M.Pd.",
    picEmail: "mulyono@sman1yogyakarta.sch.id",
    picPhone: "+62 812-9900-1122",
    branch: "Yogyakarta",
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
    branch: "Jakarta Selatan",
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
    branch: "Jakarta Selatan",
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

export const getStoredOrganizations = (): ExtracurricularOrganization[] => {
  if (typeof window === "undefined") return DEFAULT_ORGANIZATIONS;
  const stored = localStorage.getItem(STORAGE_KEY_ORGS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY_ORGS, JSON.stringify(DEFAULT_ORGANIZATIONS));
    return DEFAULT_ORGANIZATIONS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_ORGANIZATIONS;
  }
};

export const saveStoredOrganizations = (orgs: ExtracurricularOrganization[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_ORGS, JSON.stringify(orgs));
};

export const getStoredRegistrations = (): ExtracurricularRegistration[] => {
  if (typeof window === "undefined") return DEFAULT_REGISTRATIONS;
  const stored = localStorage.getItem(STORAGE_KEY_REGS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY_REGS, JSON.stringify(DEFAULT_REGISTRATIONS));
    return DEFAULT_REGISTRATIONS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_REGISTRATIONS;
  }
};

export const saveStoredRegistrations = (regs: ExtracurricularRegistration[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_REGS, JSON.stringify(regs));
};
