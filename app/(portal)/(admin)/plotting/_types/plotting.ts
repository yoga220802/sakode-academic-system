export interface UnassignedStudent {
  id: string;
  name: string;
  email: string;
  phone: string;
  programName: string;
  programSlug: string;
  registrationDate: string;
  notes: string;
  
  // New offline branch location & payments
  address: string; // Cabang/lokasi offline
  paymentType: "lunas" | "trial" | "cicil";
  paymentConfirmed: boolean;
  
  // Trial Conversion Case
  isConversion?: boolean;
  previousTrialMentorId?: string | null;
  trialPricePaid?: number | null;
  normalPrice: number;
  
  // Group Learning Case
  isGroup: boolean;
  groupMembers?: string[] | null;
  pricePerParticipant?: number | null;
}
