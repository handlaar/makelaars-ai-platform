import axios from 'axios';

const APOLLO_API_KEY = process.env.APOLLO_API_KEY;
const APOLLO_API_URL = 'https://api.apollo.io/v1';

interface ApolloSearchParams {
  personTitles?: string[];
  organizationNumEmployeesRanges?: string[];
  organizationIndustryTagIds?: string[];
  organizationLocations?: string[];
  page?: number;
  perPage?: number;
}

export const searchPeople = async (params: ApolloSearchParams) => {
  try {
    const response = await axios.post(
      `${APOLLO_API_URL}/mixed_people/search`,
      {
        api_key: APOLLO_API_KEY,
        person_titles: params.personTitles || [
          'CEO', 'Founder', 'Co-Founder', 'Chief Executive Officer',
          'VP Sales', 'Head of Sales', 'Chief Operating Officer', 'COO'
        ],
        organization_num_employees_ranges: params.organizationNumEmployeesRanges || ['51-200', '201-500'],
        organization_locations: params.organizationLocations || ['Netherlands', 'Belgium'],
        page: params.page || 1,
        per_page: params.perPage || 15,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      }
    );
    
    return response.data;
  } catch (error: any) {
    console.error('Apollo API Error:', error.response?.data || error.message);
    throw new Error(`Failed to search people: ${error.message}`);
  }
};

export const enrichPerson = async (email: string) => {
  try {
    const response = await axios.post(
      `${APOLLO_API_URL}/people/match`,
      {
        api_key: APOLLO_API_KEY,
        email,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data;
  } catch (error: any) {
    console.error('Apollo Enrich Error:', error.response?.data || error.message);
    throw new Error(`Failed to enrich person: ${error.message}`);
  }
};

export const transformApolloLeadToLead = (apolloLead: any) => {
  return {
    firstName: apolloLead.first_name || '',
    lastName: apolloLead.last_name || '',
    email: apolloLead.email || '',
    company: apolloLead.organization?.name || '',
    jobTitle: apolloLead.title || '',
    companySize: apolloLead.organization?.estimated_num_employees?.toString() || '',
    industry: apolloLead.organization?.industry || '',
    linkedinUrl: apolloLead.linkedin_url || '',
  };
};
