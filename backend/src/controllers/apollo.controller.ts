import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { searchPeople, transformApolloLeadToLead } from '../services/apollo.service';
import { scoreLeadWithAI } from '../services/ai.service';

const prisma = new PrismaClient();

export const generateLeads = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { count = 15 } = req.body;
    
    // Search for leads using Apollo.io
    const apolloResults = await searchPeople({
      perPage: count,
    });
    
    if (!apolloResults.people || apolloResults.people.length === 0) {
      return res.json({ 
        message: 'No leads found',
        leads: [],
        creditsUsed: apolloResults.pagination?.total_entries || 0
      });
    }
    
    const createdLeads = [];
    
    for (const apolloLead of apolloResults.people) {
      // Transform Apollo lead to our lead format
      const leadData = transformApolloLeadToLead(apolloLead);
      
      // Skip if email is missing
      if (!leadData.email) continue;
      
      // Check if lead already exists
      const existingLead = await prisma.lead.findFirst({
        where: { 
          email: leadData.email,
          userId 
        },
      });
      
      if (existingLead) {
        console.log(`Lead ${leadData.email} already exists, skipping`);
        continue;
      }
      
      // Create lead
      const lead = await prisma.lead.create({
        data: {
          name: `${leadData.firstName} ${leadData.lastName}`.trim(),
          email: leadData.email,
          company: leadData.company,
          jobTitle: leadData.jobTitle,
          companySize: leadData.companySize,
          industry: leadData.industry,
          linkedinUrl: leadData.linkedinUrl,
          userId,
          status: 'new',
          score: 0,
          temperature: 'cold',
        },
      });
      
      // Auto-score the lead
      const scoredLead = await scoreLeadWithAI(lead);
      createdLeads.push(scoredLead);
    }
    
    res.json({
      message: `Generated ${createdLeads.length} new leads`,
      leads: createdLeads,
      creditsUsed: apolloResults.people.length,
      totalFound: apolloResults.pagination?.total_entries || 0,
    });
  } catch (error: any) {
    console.error('Generate leads error:', error);
    res.status(400).json({ 
      error: 'Failed to generate leads',
      details: error.message 
    });
  }
};

export const searchApolloLeads = async (req: Request, res: Response) => {
  try {
    const { 
      personTitles,
      organizationNumEmployeesRanges,
      organizationIndustryTagIds,
      organizationLocations,
      page = 1,
      perPage = 15
    } = req.body;
    
    const results = await searchPeople({
      personTitles,
      organizationNumEmployeesRanges,
      organizationIndustryTagIds,
      organizationLocations,
      page,
      perPage,
    });
    
    res.json(results);
  } catch (error: any) {
    console.error('Search Apollo leads error:', error);
    res.status(400).json({ 
      error: 'Failed to search leads',
      details: error.message 
    });
  }
};
