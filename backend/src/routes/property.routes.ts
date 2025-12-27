import { Router } from 'express';
import { authenticateUser } from '../middleware/auth.middleware';
import { searchProperties } from '../controllers/property.controller';

const router = Router();

// Property search - requires authentication
router.post('/search', authenticateUser, searchProperties);

export default router;
