export interface Conversation {
    id: string;
    channel: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    leadId: string;
}

export interface Lead {
    id: string;
    name: string;
    email: string;
    companyName: string;
    jobTitle: string;
    companySize?: string;
    industry?: string;
    linkedinUrl?: string;
    score: number;
    temperature: 'hot' | 'warm' | 'cold';
    status: string;
    aiNotes?: string;
    nextAction?: string;
    createdAt?: string;
    updatedAt?: string;
    conversations?: Conversation[];
}

export interface User {
    id: string;
    email: string;
    name?: string;
}
