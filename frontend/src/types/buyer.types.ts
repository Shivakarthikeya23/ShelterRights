export interface BuyerData {
  id: string;
  userId: string;
  downPaymentSaved?: number;
  creditScore?: number;
  debtAmount?: number;
  targetPurchaseDate?: string;
  createdAt: string;
}

export interface AffordabilityCalculation {
  income: number;
  downPayment: number;
  debtAmount: number;
  creditScore: number;
  bankApprovalAmount: number;
  realisticAffordableAmount: number;
  monthlyPayment: number;
  propertyTax: number;
  insurance: number;
  maintenance: number;
  totalMonthlyCost: number;
}
