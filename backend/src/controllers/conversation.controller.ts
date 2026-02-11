import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const createConversation = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { leadId, channel } = req.body;
    
    const conversation = await prisma.conversation.create({
      data: {
        leadId,
        userId,
        channel,
        status: 'active',
      },
    });
    
    res.json(conversation);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create conversation' });
  }
};

export const getConversations = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { leadId } = req.query;
    
    const where: any = { userId };
    if (leadId) where.leadId = leadId;
    
    const conversations = await prisma.conversation.findMany({
      where,
      include: {
        lead: true,
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
    
    res.json(conversations);
  } catch (error) {
    res.status(400).json({ error: 'Failed to get conversations' });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const { content, sender } = req.body;
    
    const message = await prisma.message.create({
      data: {
        conversationId: id,
        content,
        sender,
      },
    });
    
    // If message is from lead, generate AI response
    if (sender === 'lead') {
      const conversation = await prisma.conversation.findUnique({
        where: { id },
        include: {
          lead: true,
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });
      
      const aiResponse = await generateAIResponse(conversation);
      
      const aiMessage = await prisma.message.create({
        data: {
          conversationId: id,
          content: aiResponse,
          sender: 'ai',
        },
      });
      
      return res.json({ userMessage: message, aiMessage });
    }
    
    res.json(message);
  } catch (error) {
    res.status(400).json({ error: 'Failed to send message' });
  }
};

const generateAIResponse = async (conversation: any) => {
  const messages = conversation.messages.map((m: any) => ({
    role: m.sender === 'lead' ? 'user' : 'assistant',
    content: m.content,
  }));
  
  const systemPrompt = `Je bent een behulpzame Nederlandse makelaar assistent. 
Je helpt ${conversation.lead.name} met hun vastgoedvragen.
Wees vriendelijk, professioneel en to-the-point.`;
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
  });
  
  return completion.choices[0].message.content || 'Sorry, ik kon geen antwoord genereren.';
};
