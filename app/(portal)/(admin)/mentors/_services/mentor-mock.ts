import { Mentor } from "../_types/mentor";
import { getStoredData, saveStoredData } from "../../_shared";

const STORAGE_KEY = "sakode_mentors_data";

export const DEFAULT_MENTORS: Mentor[] = [
  {
    id: "MTR-001",
    name: "Akbar Ramadhan",
    email: "akbar.ramadhan@sakode.org",
    phone: "+62 812-3456-7890",
    status: "active",
    skills: ["React", "Next.js", "TypeScript", "Zustand"],
    maxCapacity: 8,
    currentAllocatedStudents: 5,
    joinedDate: "12 Jan 2025",
    bio: "Senior Frontend Engineer di TechCorp. Senang berbagi ilmu seputar arsitektur modern web frontend.",
    rating: 4.9,
  },
  {
    id: "MTR-002",
    name: "Budi Santoso",
    email: "budi.santoso@sakode.org",
    phone: "+62 813-9876-5432",
    status: "active",
    skills: ["Laravel", "PHP", "MySQL", "Docker"],
    maxCapacity: 6,
    currentAllocatedStudents: 6,
    joinedDate: "20 Feb 2025",
    bio: "Backend Lead dengan 8 tahun pengalaman. Fokus pada pembuatan API yang scalable dan performa database.",
    rating: 4.8,
  },
  {
    id: "MTR-003",
    name: "Citra Amelia",
    email: "citra.amelia@sakode.org",
    phone: "+62 856-4321-8765",
    status: "busy",
    skills: ["Figma", "UI/UX Design", "Wireframing", "Tailwind CSS"],
    maxCapacity: 5,
    currentAllocatedStudents: 5,
    joinedDate: "05 Mar 2025",
    bio: "Product Designer antusias yang berdedikasi mengajarkan fundamental UI/UX dari riset hingga visual design.",
    rating: 4.7,
  },
  {
    id: "MTR-004",
    name: "Dedi Wijaya",
    email: "dedi.wijaya@sakode.org",
    phone: "+62 877-5555-4444",
    status: "inactive",
    skills: ["Python", "Flask", "Machine Learning", "Pandas"],
    maxCapacity: 4,
    currentAllocatedStudents: 0,
    joinedDate: "18 Apr 2025",
    bio: "Data Scientist dan pengajar paruh waktu. Senang membantu pemula memahami dunia machine learning.",
    rating: 4.6,
  },
  {
    id: "MTR-005",
    name: "Elisa Fitri",
    email: "elisa.fitri@sakode.org",
    phone: "+62 811-2222-3333",
    status: "active",
    skills: ["Node.js", "Express", "MongoDB", "Redis"],
    maxCapacity: 10,
    currentAllocatedStudents: 3,
    joinedDate: "01 Mei 2025",
    bio: "Software Architect di startup fintech. Fokus mengajar optimasi backend, caching, dan integrasi API.",
    rating: 4.9,
  },
  {
    id: "MTR-006",
    name: "Fahri Hamzah",
    email: "fahri.hamzah@sakode.org",
    phone: "+62 899-8888-7777",
    status: "active",
    skills: ["Flutter", "Dart", "Firebase", "State Management"],
    maxCapacity: 8,
    currentAllocatedStudents: 2,
    joinedDate: "15 Jun 2025",
    bio: "Mobile Developer spesialis Flutter. Suka berbagi trik coding aplikasi multiplatform dengan performa tinggi.",
    rating: 4.5,
  }
];

export const getStoredMentors = (): Mentor[] =>
  getStoredData(STORAGE_KEY, DEFAULT_MENTORS);

export const saveStoredMentors = (mentors: Mentor[]) =>
  saveStoredData(STORAGE_KEY, mentors);
