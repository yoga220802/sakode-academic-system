import { UserRole } from "@/app/_types/auth";

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "inactive";
  joinedDate: string;
  phone?: string;
}
