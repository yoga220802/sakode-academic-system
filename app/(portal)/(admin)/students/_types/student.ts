export interface ActiveStudent {
  id: string;
  name: string;
  email: string;
  phone: string;
  programName: string;
  programSlug: string;
  address: string;
  paymentType: "lunas" | "trial" | "cicil";
  paymentConfirmed: boolean;
  assignedMentorId: string | null;
  assignedMentorName: string | null;
  isGroup: boolean;
  groupMembers?: string[] | null;
  completedModulesCount: number;
  totalModulesCount: number;
  status: "active" | "completed" | "inactive";
  registrationDate: string;
  notes: string;
}
