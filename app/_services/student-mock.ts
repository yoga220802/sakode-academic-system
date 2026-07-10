import { StudentViewModel } from "../_types/student";

export class StudentMockService {
  private static mockData: StudentViewModel[] = [
    { id: "1", name: "Doni Pratama", email: "doni@gmail.com", program: "React & Next.js Professional", registrationDate: "2026-06-28", status: "pending", referralCode: "AKBAR-PROMO" },
    { id: "2", name: "Endah Lestari", email: "endah@gmail.com", program: "TypeScript & Data Structures", registrationDate: "2026-06-25", status: "aktif" },
    { id: "3", name: "Fahri Hamzah", email: "fahri@gmail.com", program: "Backend Dev Go/Docker", registrationDate: "2026-06-24", status: "aktif", referralCode: "MANDIRI" },
    { id: "4", name: "Gita Wirjawan", email: "gita@gmail.com", program: "Fullstack Product Engineer", registrationDate: "2026-06-20", status: "lulus" },
    { id: "5", name: "Heri Prasetyo", email: "heri@gmail.com", program: "React & Next.js Professional", registrationDate: "2026-06-18", status: "batal" },
    { id: "6", name: "Irfan Bachdim", email: "irfan@gmail.com", program: "TypeScript & Data Structures", registrationDate: "2026-06-15", status: "aktif" },
    { id: "7", name: "Joko Widodo", email: "joko@gmail.com", program: "Backend Dev Go/Docker", registrationDate: "2026-06-10", status: "lulus" }
  ];

  public static async getStudents(delayMs: number = 800): Promise<StudentViewModel[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.mockData]);
      }, delayMs);
    });
  }
}
