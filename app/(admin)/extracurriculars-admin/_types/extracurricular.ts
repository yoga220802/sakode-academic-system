export interface ExtracurricularMember {
  id: string;
  name: string;
  grade: string; // e.g. "X IPA 1", "XII RPL 2"
}

export interface ExtracurricularOrganization {
  id: string;
  name: string;
  picName: string; // Guru Pendamping name
  picEmail: string; // Guru Pendamping email
  picPhone: string; // Guru Pendamping phone
  branch: string; // Offline branch context
  status: "active" | "inactive";
  mentorId: string;
  mentorName: string;
  mouFileName?: string;
  mouSignedDate?: string;
  members: ExtracurricularMember[];
}

export interface ExtracurricularRegistration {
  id: string;
  studentId: string;
  studentName: string;
  schoolId: string;
  schoolName: string;
  extracurricularName: string;
  date: string; // YYYY-MM-DD
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
}
