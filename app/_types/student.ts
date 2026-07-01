export interface StudentViewModel {
  id: string;
  name: string;
  email: string;
  program: string;
  registrationDate: string;
  status: "aktif" | "pending" | "lulus" | "batal";
  referralCode?: string;
}
