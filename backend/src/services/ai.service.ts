import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';
import { calculateLeadScore } from '../utils/leadScoring';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const prisma = new PrismaClient();

export const scoreLeadWithAI = async (lead: any) => {
  // Use the deterministic scoring function
  const scoringResult = calculateLeadScore({
    jobTitle: lead.jobTitle,
    companySize: lead.companySize,
    industry: lead.industry
  });
  
  // Update lead in database
  const updatedLead = await prisma.lead.update({
    where: { id: lead.id },
    data: {
      score: scoringResult.score,
      temperature: scoringResult.temperature.toLowerCase(),
      nextAction: scoringResult.nextAction,
      aiNotes: scoringResult.aiNotes,
    },
  });
  
  return updatedLead;
};

export const generateEmailDraft = async (lead: any, flow: 'warm' | 'hot') => {
  const prompt = flow === 'hot' 
    ? `Schrijf een directe, zakelijke email voor ${lead.name} (${lead.jobTitle} bij ${lead.company}). Ze zijn een HOT lead. Bied direct een demo aan van onze Boom Sales Machine. Tone: professioneel, resultaatgericht, geen hype.`
    : `Schrijf een warme, gepersonaliseerde email voor ${lead.name} (${lead.jobTitle} bij ${lead.company}). Ze zijn een WARM lead. Introduceer de Boom Sales Machine en vraag naar hun huidige sales challenges. Tone: vriendelijk maar professioneel.`;
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'Je bent een Nederlandse B2B sales expert. Schrijf altijd in het Nederlands.' },
      { role: 'user', content: prompt }
    ],
  });
  
  return completion.choices[0].message.content;
};
