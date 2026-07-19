export interface PrincipalMembership {
  id: string;
  principalName: string;
  principalEmail: string;
  assignedOrgs: string[]; // IDs of mapped extracurricular organizations
  status: "active" | "inactive";
  joinedDate: string;
}
