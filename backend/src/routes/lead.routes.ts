import { Router } from 'express';
import { createLead, getLeads, getLead, updateLead, deleteLead, scoreLead } from '../controllers/lead.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', createLead);
router.get('/', getLeads);
router.get('/:id', getLead);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);
router.post('/:id/score', scoreLead);

export default router;
