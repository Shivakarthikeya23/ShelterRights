import api from './api';

export const renterApi = {
  // Rent calculator
  calculateRent: async (data: {
    annualIncome: number;
    monthlyRent: number;
    locationCity: string;
    locationState: string;
  }) => {
    const response = await api.post('/api/renter/calculate-rent', data);
    return response.data;
  },

  getCalculations: async () => {
    const response = await api.get('/api/renter/calculations');
    return response.data;
  },

  // Tenant rights chat
  chat: async (message: string, state: string) => {
    const response = await api.post('/api/renter/chat', { message, state });
    return response.data;
  },

  getChatHistory: async (state?: string) => {
    const response = await api.get('/api/renter/chat-history', {
      params: { state }
    });
    return response.data;
  },

  // Campaigns
  getCampaigns: async (filters?: { city?: string; state?: string }) => {
    const response = await api.get('/api/renter/campaigns', {
      params: filters
    });
    return response.data;
  },

  createCampaign: async (data: any) => {
    const response = await api.post('/api/renter/campaigns', data);
    return response.data;
  },

  signCampaign: async (campaignId: string, data: { isAnonymous: boolean; fullName?: string }) => {
    const response = await api.post(`/api/renter/campaigns/${campaignId}/sign`, data);
    return response.data;
  }
};
