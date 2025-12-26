export interface RenterData {
  id: string;
  userId: string;
  currentRent?: number;
  leaseEndDate?: string;
  landlordName?: string;
  propertyAddress?: string;
  createdAt: string;
}

export interface RentCalculation {
  income: number;
  rent: number;
  burdenPercentage: number;
  monthlyOverpayment: number;
  annualOverpayment: number;
  recommendedRent: number;
}
