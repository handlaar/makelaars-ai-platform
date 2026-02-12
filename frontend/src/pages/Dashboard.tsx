import { API_URL } from '../config';
import { useEffect, useState } from 'react';
import { Users, MessageSquare, TrendingUp, Flame } from 'lucide-react';
import axios from 'axios';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    activeConversations: 0,
    hotLeads: 0,
    pipelineValue: 0,
  });
  const [recentLeads, setRecentLeads] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/leads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const leads = response.data;
      setStats({
        totalLeads: leads.length,
        activeConversations: leads.filter((l: any) => l.conversations?.length > 0).length,
        hotLeads: leads.filter((l: any) => l.temperature === 'hot').length,
        pipelineValue: leads.reduce((sum: number, l: any) => sum + (l.score * 1000), 0),
      });
      
      setRecentLeads(leads.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welkom terug! Hier is je overzicht.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Totaal Leads"
          value={stats.totalLeads}
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
        <StatCard
          title="Actieve Gesprekken"
          value={stats.activeConversations}
          icon={<MessageSquare className="w-6 h-6" />}
          color="green"
        />
        <StatCard
          title="Hot Leads"
          value={stats.hotLeads}
          icon={<Flame className="w-6 h-6" />}
          color="red"
        />
        <StatCard
          title="Pipeline Waarde"
          value={`€${(stats.pipelineValue / 1000).toFixed(1)}K`}
          icon={<TrendingUp className="w-6 h-6" />}
          color="purple"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recente Leads</h2>
        <div className="space-y-3">
          {recentLeads.map((lead: any) => (
            <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">{lead.name[0]}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{lead.name}</p>
                  <p className="text-sm text-gray-500">{lead.company || 'Geen bedrijf'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  lead.temperature === 'hot' ? 'bg-red-100 text-red-700' :
                  lead.temperature === 'warm' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {lead.temperature}
                </span>
                <span className="text-sm font-semibold text-gray-700">Score: {lead.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colors[color as keyof typeof colors]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
