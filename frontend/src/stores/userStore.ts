import { create } from 'zustand';

export type UserMode = 'renter' | 'buyer' | 'owner';

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
  emailNotifications: boolean;
}

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  setProfile: (profile: UserProfile | null) => void;
  switchMode: (mode: UserMode) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  clearProfile: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  isLoading: false,

  setProfile: (profile) => set({ profile, isLoading: false }),

  switchMode: (mode) => set((state) => {
    if (!state.profile) return state;
    return {
      profile: { ...state.profile, currentMode: mode }
    };
  }),

  updateProfile: (updates) => set((state) => {
    if (!state.profile) return state;
    return {
      profile: { ...state.profile, ...updates }
    };
  }),

  clearProfile: () => set({ profile: null, isLoading: false }),
}));
