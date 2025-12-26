export type UserMode = 'renter' | 'buyer' | 'owner';

export interface User {
  id: string;
  email: string;
  fullName?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  isRenter: boolean;
  isBuyer: boolean;
  isOwner: boolean;
  isAdvocate: boolean;
  currentMode: UserMode;
  fullName?: string;
  annualIncome?: number;
  locationCity?: string;
  locationState?: string;
  locationZip?: string;
  savedSearches?: Record<string, any>;
  emailNotifications: boolean;
  createdAt: string;
  updatedAt: string;
}
