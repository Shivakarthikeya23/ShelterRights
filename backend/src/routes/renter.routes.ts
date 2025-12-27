import express from 'express';
import { authenticateUser } from '../middleware/auth.middleware';
import {
  calculateRentBurden,
  getCalculationHistory,
  chatTenantRights,
  getChatHistory,
  getCampaigns,
  createCampaign,
  signCampaign
} from '../controllers/renter.controller';

const router = express.Router();

// Rent calculator
router.post('/calculate-rent', calculateRentBurden);
router.get('/calculations', authenticateUser, getCalculationHistory);

// Tenant rights chat
router.post('/chat', chatTenantRights);
router.get('/chat-history', authenticateUser, getChatHistory);

// Community organizer
router.get('/campaigns', getCampaigns);
router.post('/campaigns', authenticateUser, createCampaign);
router.post('/campaigns/:campaignId/sign', authenticateUser, signCampaign);

export default router;
