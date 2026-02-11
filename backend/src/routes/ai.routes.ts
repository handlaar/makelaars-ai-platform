import { Router } from 'express';
import { generateDraft, analyzeConversation } from '../controllers/ai.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/generate-draft', generateDraft);
router.post('/analyze-conversation', analyzeConversation);

export default router;
