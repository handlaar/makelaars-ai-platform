import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const prisma = new PrismaClient();

export const scoreLeadWithAI = async (lead: any) => {
  let score = 0;
  let notes = [];
  
  // Boom Sales Machine Scoring Rules
  if (['CEO', 'Founder', 'COO'].some(title => lead.jobTitle?.includes(title))) {
    if (lead.companySize >= 50 && lead.companySize <= 500) {
      score += 30;
      notes.push('🔥 C-level bij ideale bedrijfsgrootte');
    }
  }
  
  if (['VP Sales', 'Head of Sales'].some(title => lead.jobTitle?.includes(title))) {
    if (lead.companySize >= 100) {
      score += 25;
      notes.push('💼 Sales leadership bij schaalbaar bedrijf');
    }
  }
  
  if (['SaaS', 'Tech', 'Professional Services', 'Marketing'].some(ind => lead.industry?.includes(ind))) {
    score += 20;
    notes.push('✅ Target industrie');
  }
  
  if (lead.companySize < 10) {
    score -= 30;
    notes.push('⚠️ Te klein bedrijf');
  }
  
  if (['Retail', 'Horeca'].some(ind => lead.industry?.includes(ind))) {
    score -= 20;
    notes.push('❌ Non-target sector');
  }
  
  // Determine temperature
  let temperature = 'cold';
  if (score >= 70) temperature = 'hot';
  else if (score >= 40) temperature = 'warm';
  
  // Determine next action
  let nextAction = 'Kwalificeren via LinkedIn';
  if (temperature === 'hot') nextAction = 'Direct bellen voor demo';
  else if (temperature === 'warm') nextAction = 'Gepersonaliseerde email sturen';
  
  // Update lead in database
  const updatedLead = await prisma.lead.update({
    where: { id: lead.id },
    data: {
      score,
      temperature,
      nextAction,
      aiNotes: notes.join(' | '),
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
