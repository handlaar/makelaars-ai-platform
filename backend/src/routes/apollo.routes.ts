import express from 'express';
import { generateLeads, searchApolloLeads } from '../controllers/apollo.controller';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Generate leads from Apollo.io
router.post('/generate', authenticateToken, generateLeads);

// Search Apollo.io (preview without creating leads)
router.post('/search', authenticateToken, searchApolloLeads);

export default router;
