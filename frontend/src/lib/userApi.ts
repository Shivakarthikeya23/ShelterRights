import api from './api';
import { UserProfile } from '../types/user.types';

export const userApi = {
  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/api/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData: Partial<UserProfile>) => {
    const response = await api.put('/api/users/profile', profileData);
    return response.data;
  },

  // Setup profile (onboarding)
  setupProfile: async (setupData: any) => {
    const response = await api.post('/api/users/setup', setupData);
    return response.data;
  },

  // Switch mode
  switchMode: async (mode: 'renter' | 'buyer' | 'owner') => {
    const response = await api.post('/api/users/switch-mode', { mode });
    return response.data;
  }
};
