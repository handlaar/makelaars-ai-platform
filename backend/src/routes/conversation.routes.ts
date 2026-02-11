import { Router } from 'express';
import { createConversation, getConversations, sendMessage } from '../controllers/conversation.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', createConversation);
router.get('/', getConversations);
router.post('/:id/messages', sendMessage);

export default router;
