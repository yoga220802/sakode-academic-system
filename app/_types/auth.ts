export type UserRole = "admin" | "mentor" | "mentor_lead" | "murid";

export interface UserSession {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
}
