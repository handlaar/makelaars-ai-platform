import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { scoreLeadWithAI } from '../services/ai.service';

const prisma = new PrismaClient();

export const createLead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { name, email, phone, company, jobTitle, companySize, industry } = req.body;
    
    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        company,
        jobTitle,
        companySize,
        industry,
        userId,
        status: 'new',
        score: 0,
        temperature: 'cold',
      },
    });
    
    // Auto-score the lead
    const scoredLead = await scoreLeadWithAI(lead);
    
    res.json(scoredLead);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create lead' });
  }
};

export const getLeads = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { status, temperature, search } = req.query;
    
    const where: any = { userId };
    
    if (status) where.status = status;
    if (temperature) where.temperature = temperature;
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { company: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    
    const leads = await prisma.lead.findMany({
      where,
      orderBy: { score: 'desc' },
      include: {
        conversations: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
    
    res.json(leads);
  } catch (error) {
    res.status(400).json({ error: 'Failed to get leads' });
  }
};

export const getLead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    
    const lead = await prisma.lead.findFirst({
      where: { id, userId },
      include: {
        conversations: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    
    res.json(lead);
  } catch (error) {
    res.status(400).json({ error: 'Failed to get lead' });
  }
};

export const updateLead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    
    const lead = await prisma.lead.updateMany({
      where: { id, userId },
      data: req.body,
    });
    
    res.json(lead);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update lead' });
  }
};

export const deleteLead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    
    await prisma.lead.deleteMany({
      where: { id, userId },
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete lead' });
  }
};

export const scoreLead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    
    const lead = await prisma.lead.findFirst({
      where: { id, userId },
    });
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    
    const scoredLead = await scoreLeadWithAI(lead);
    res.json(scoredLead);
  } catch (error) {
    res.status(400).json({ error: 'Failed to score lead' });
  }
};
