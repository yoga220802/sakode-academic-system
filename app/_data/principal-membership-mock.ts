import { PrincipalMembership } from "@/app/(portal)/(admin)/principal-membership/_types/membership";
import { getStoredData, saveStoredData } from "@/app/_lib/storage";

const STORAGE_KEY_MEMBERSHIPS = "sakode_principal_memberships_v1";

export const DEFAULT_MEMBERSHIPS: PrincipalMembership[] = [
  {
    id: "PR-001",
    principalName: "Kepsek Sudarsono",
    principalEmail: "sudarsono@sekolah.sch.id",
    assignedOrgs: ["ORG-001"], // SMA Negeri 1 Yogyakarta
    status: "active",
    joinedDate: "2026-01-20"
  },
  {
    id: "PR-002",
    principalName: "Bambang Mulyono, S.Pd.",
    principalEmail: "bambang@smktelkom-jkt.sch.id",
    assignedOrgs: ["ORG-002"], // SMK Telkom Jakarta
    status: "active",
    joinedDate: "2026-02-15"
  },
  {
    id: "PR-003",
    principalName: "Dr. Maria Ulfa",
    principalEmail: "maria.ulfa@labschool.sch.id",
    assignedOrgs: ["ORG-003"], // SMA Labschool Jakarta
    status: "inactive",
    joinedDate: "2026-03-10"
  }
];

export const getStoredMemberships = (): PrincipalMembership[] =>
  getStoredData(STORAGE_KEY_MEMBERSHIPS, DEFAULT_MEMBERSHIPS);

export const saveStoredMemberships = (memberships: PrincipalMembership[]) =>
  saveStoredData(STORAGE_KEY_MEMBERSHIPS, memberships);
