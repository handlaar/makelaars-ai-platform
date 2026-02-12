import { API_URL } from '../config';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Mail, Phone, Building, Briefcase } from 'lucide-react';
import axios from 'axios';

export default function LeadDetail() {
  const { id } = useParams();
  const [lead, setLead] = useState<any>(null);

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/leads/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLead(response.data);
    } catch (error) {
      console.error('Failed to fetch lead', error);
    }
  };

  if (!lead) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{lead.name}</h1>
            <p className="text-gray-600 mt-1">{lead.jobTitle} bij {lead.company}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
            lead.temperature === 'hot' ? 'bg-red-100 text-red-700' :
            lead.temperature === 'warm' ? 'bg-yellow-100 text-yellow-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {lead.temperature.toUpperCase()} - Score: {lead.score}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900">{lead.email}</p>
              </div>
            </div>
            {lead.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Telefoon</p>
                  <p className="text-gray-900">{lead.phone}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Building className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Bedrijf</p>
                <p className="text-gray-900">{lead.company || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Industrie</p>
                <p className="text-gray-900">{lead.industry || '-'}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">AI Insights</h3>
            <p className="text-sm text-gray-700 mb-3">{lead.aiNotes || 'Geen notities beschikbaar'}</p>
            <div className="bg-white rounded p-3">
              <p className="text-xs text-gray-500 mb-1">Volgende Actie</p>
              <p className="text-sm font-medium text-gray-900">{lead.nextAction || 'Geen actie gepland'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Gesprekken</h2>
        {lead.conversations?.length > 0 ? (
          <div className="space-y-4">
            {lead.conversations.map((conv: any) => (
              <div key={conv.id} className="border-l-4 border-blue-500 pl-4">
                <p className="text-sm text-gray-500">{conv.channel} - {new Date(conv.createdAt).toLocaleDateString('nl-NL')}</p>
                <p className="text-gray-900 mt-1">{conv.messages?.length || 0} berichten</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Nog geen gesprekken</p>
        )}
      </div>
    </div>
  );
}
