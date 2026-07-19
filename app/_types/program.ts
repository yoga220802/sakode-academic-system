export interface ModuleViewModel {
  id: string;
  title: string;
  description: string;
  durationHours: number;
  order: number;
}

export interface ProgramViewModel {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number | null; // Nullable to test missing-price validation
  currency: string; // e.g. "IDR", "USD"
  status: "draft" | "published";
  isFeatured: boolean;
  modules: ModuleViewModel[];
  registrationStartDate?: string;
  registrationEndDate?: string;
  
  // Group Learning Option fields
  hasGroupOption?: boolean;
  minGroupSize?: number;
  maxGroupSize?: number;
  pricePerParticipant?: number | null;
  trialPrice?: number | null;
}
