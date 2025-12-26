import express from 'express';
import { authenticateUser } from '../middleware/auth.middleware';
import {
  getProfile,
  updateProfile,
  switchMode,
  setupProfile
} from '../controllers/user.controller';

const router = express.Router();

// All routes require authentication
router.use(authenticateUser);

// GET /api/users/profile - Get current user profile
router.get('/profile', getProfile);

// PUT /api/users/profile - Update user profile
router.put('/profile', updateProfile);

// POST /api/users/setup - First-time profile setup
router.post('/setup', setupProfile);

// POST /api/users/switch-mode - Switch between renter/buyer/owner
router.post('/switch-mode', switchMode);

export default router;
