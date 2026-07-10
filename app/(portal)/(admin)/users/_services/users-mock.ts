import { UserAccount } from "../_types/user";
import { getStoredData, saveStoredData } from "../../_shared";

const STORAGE_KEY_USERS = "sakode_users_directory_v1";

export const DEFAULT_USERS: UserAccount[] = [
  {
    id: "USR-001",
    name: "Super Admin Sakode",
    email: "admin@sakode.com",
    role: "admin",
    status: "active",
    joinedDate: "2025-10-01"
  },
  {
    id: "USR-002",
    name: "Hamzah Mentor Lead",
    email: "hamzah@sakode.com",
    role: "mentor_lead",
    status: "active",
    joinedDate: "2025-11-15"
  },
  {
    id: "USR-003",
    name: "Udin Mentor React",
    email: "udin@sakode.com",
    role: "mentor",
    status: "active",
    joinedDate: "2025-12-01"
  },
  {
    id: "USR-004",
    name: "Citra Kirana",
    email: "citra@sakode.com",
    role: "mentor",
    status: "active",
    joinedDate: "2026-01-10"
  },
  {
    id: "USR-005",
    name: "Akbar Ramadhan",
    email: "akbar@sakode.com",
    role: "mentor",
    status: "active",
    joinedDate: "2026-02-01"
  },
  {
    id: "USR-006",
    name: "Kepsek Sudarsono",
    email: "sudarsono@sekolah.sch.id",
    role: "school_principal",
    status: "active",
    joinedDate: "2026-01-20"
  },
  {
    id: "USR-007",
    name: "Bambang Mulyono, S.Pd.",
    email: "bambang@smktelkom-jkt.sch.id",
    role: "school_principal",
    status: "active",
    joinedDate: "2026-02-15"
  },
  {
    id: "USR-008",
    name: "Dr. Maria Ulfa",
    email: "maria.ulfa@labschool.sch.id",
    role: "school_principal",
    status: "inactive",
    joinedDate: "2026-03-10"
  },
  {
    id: "USR-009",
    name: "Dzulkifli Putra",
    email: "dzulkifli@gmail.com",
    role: "murid",
    status: "active",
    joinedDate: "2026-07-01"
  },
  {
    id: "USR-010",
    name: "Siti Aminah",
    email: "siti.aminah@gmail.com",
    role: "murid",
    status: "active",
    joinedDate: "2026-07-02"
  },
  {
    id: "USR-011",
    name: "Joko Susilo",
    email: "joko@gmail.com",
    role: "murid",
    status: "active",
    joinedDate: "2026-07-03"
  },
  {
    id: "USR-012",
    name: "Endah Lestari",
    email: "endah.lestari@gmail.com",
    role: "murid",
    status: "active",
    joinedDate: "2026-07-04"
  }
];

export const getStoredUsers = (): UserAccount[] =>
  getStoredData(STORAGE_KEY_USERS, DEFAULT_USERS);

export const saveStoredUsers = (users: UserAccount[]) =>
  saveStoredData(STORAGE_KEY_USERS, users);
