export type UserRole = "admin" | "mentor" | "mentor_lead" | "murid" | "school_principal";

export interface UserSession {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
}
