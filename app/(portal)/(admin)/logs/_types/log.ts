export interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  category: "auth" | "registration" | "mentor" | "extracurricular" | "system";
  action: string;
  status: "success" | "warning" | "error";
  ipAddress: string;
}
