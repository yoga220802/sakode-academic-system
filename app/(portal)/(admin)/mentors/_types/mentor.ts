export interface Mentor {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "busy";
  skills: string[];
  maxCapacity: number;
  currentAllocatedStudents: number;
  joinedDate: string;
  bio: string;
  rating: number;
}
