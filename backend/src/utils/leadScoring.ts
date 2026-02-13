interface LeadData {
  jobTitle?: string;
  companySize?: string;
  industry?: string;
}

interface ScoringResult {
  score: number;
  temperature: 'Hot' | 'Warm' | 'Cold';
  nextAction: string;
  aiNotes: string;
}

export function calculateLeadScore(lead: LeadData): ScoringResult {
  let score = 0;
  const notes: string[] = [];

  // Job Title Scoring
  const jobTitle = lead.jobTitle?.toLowerCase() || '';
  
  if (jobTitle.includes('ceo') || jobTitle.includes('founder') || jobTitle.includes('coo')) {
    score += 30;
    notes.push('+30: C-level executive (CEO/Founder/COO)');
  } else if (jobTitle.includes('vp sales') || jobTitle.includes('head of sales') || jobTitle.includes('sales director')) {
    score += 25;
    notes.push('+25: Senior sales leadership');
  } else if (jobTitle.includes('vp') || jobTitle.includes('head of') || jobTitle.includes('director')) {
    score += 20;
    notes.push('+20: VP/Director level');
  } else if (jobTitle.includes('manager')) {
    score += 10;
    notes.push('+10: Manager level');
  }

  // Company Size Scoring
  const companySize = lead.companySize || '';
  const companySizeNum = extractCompanySize(companySize);
  
  if (companySizeNum < 10) {
    score -= 30;
    notes.push('-30: Company too small (<10 employees)');
  } else if (companySizeNum >= 50 && companySizeNum <= 500) {
    score += 30;
    notes.push('+30: Ideal company size (50-500 employees)');
  } else if (companySizeNum >= 11 && companySizeNum <= 49) {
    score += 15;
    notes.push('+15: Small but viable company size');
  } else if (companySizeNum > 500) {
    score += 10;
    notes.push('+10: Large enterprise');
  }

  // Industry Scoring
  const industry = lead.industry?.toLowerCase() || '';
  
  if (industry.includes('saas') || industry.includes('software')) {
    score += 20;
    notes.push('+20: SaaS/Software industry');
  } else if (industry.includes('tech') || industry.includes('technology')) {
    score += 20;
    notes.push('+20: Technology industry');
  } else if (industry.includes('marketing') || industry.includes('agency')) {
    score += 20;
    notes.push('+20: Marketing/Agency industry');
  } else if (industry.includes('professional services') || industry.includes('consulting')) {
    score += 20;
    notes.push('+20: Professional services');
  } else if (industry.includes('retail') || industry.includes('horeca')) {
    score -= 20;
    notes.push('-20: Retail/Horeca sector (not ideal fit)');
  }

  // Determine temperature
  let temperature: 'Hot' | 'Warm' | 'Cold';
  if (score >= 70) {
    temperature = 'Hot';
  } else if (score >= 40) {
    temperature = 'Warm';
  } else {
    temperature = 'Cold';
  }

  // Determine next action based on temperature
  let nextAction: string;
  if (temperature === 'Hot') {
    nextAction = 'Immediate outreach - High priority prospect';
  } else if (temperature === 'Warm') {
    nextAction = 'Schedule follow-up within 48 hours';
  } else {
    nextAction = 'Add to nurture sequence';
  }

  return {
    score,
    temperature,
    nextAction,
    aiNotes: notes.join(' | ')
  };
}

function extractCompanySize(companySize: string): number {
  if (!companySize) return 0;
  
  // Handle ranges like "50-200", "1-10", etc.
  const match = companySize.match(/(\d+)/);
  if (match) {
    return parseInt(match[1], 10);
  }
  
  // Handle "500+"
  if (companySize.includes('500+')) {
    return 501;
  }
  
  return 0;
}
