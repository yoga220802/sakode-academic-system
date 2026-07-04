export interface LearningModuleViewModel {
  title: string;
  sessionCount: number;
  durationWeeks: number;
  topics: string[];
}

export interface PackageViewModel {
  id: string;
  slug: string;
  name: string;
  outcome: string;
  price: number | null; // null represents missing price
  currency: string; // e.g. "IDR"
  featured?: boolean;
  registrationStart: string; // YYYY-MM-DD
  registrationEnd: string; // YYYY-MM-DD
  modules: LearningModuleViewModel[];
  status: "draft" | "published";
}
