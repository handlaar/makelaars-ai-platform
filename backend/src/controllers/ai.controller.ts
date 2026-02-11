import { Request, Response } from 'express';
import { generateEmailDraft } from '../services/ai.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const generateDraft = async (req: Request, res: Response) => {
  try {
    const { leadId, flow } = req.body;
    
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    
    const draft = await generateEmailDraft(lead, flow);
    res.json({ draft });
  } catch (error) {
    res.status(400).json({ error: 'Failed to generate draft' });
  }
};

export const analyzeConversation = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.body;
    
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { messages: true, lead: true },
    });
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    // Simple sentiment analysis
    const totalMessages = conversation.messages.length;
    const leadMessages = conversation.messages.filter(m => m.sender === 'lead');
    
    const analysis = {
      totalMessages,
      leadEngagement: leadMessages.length,
      avgResponseTime: '2.3 min', // Placeholder
      sentiment: 'positive', // Placeholder
      nextAction: 'Follow up binnen 24 uur',
    };
    
    res.json(analysis);
  } catch (error) {
    res.status(400).json({ error: 'Failed to analyze conversation' });
  }
};
