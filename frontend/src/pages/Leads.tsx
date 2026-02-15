import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import LeadCard from '../components/LeadCard';
import LeadModal from '../components/LeadModal';
import { Lead } from '../types';

const Leads = () => {
      const [leads, setLeads] = useState<Lead[]>([]);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [searchTerm, setSearchTerm] = useState('');
      const [filterStatus, setFilterStatus] = useState('all');
      const [filterTemperature, setFilterTemperature] = useState('all');

      useEffect(() => {
              fetchLeads();
      }, [filterStatus, filterTemperature]);

      const fetchLeads = async () => {
              try {
                        const token = localStorage.getItem('token');
                        if (!token) {
                                    console.error('No token found');
                                    return;
                        }

                let url = `${import.meta.env.VITE_API_URL}/api/leads?`;
                        if (filterStatus !== 'all') url += `status=${filterStatus}&`;
                        if (filterTemperature !== 'all') url += `temperature=${filterTemperature}&`;

                const response = await fetch(url, {
                            headers: { Authorization: `Bearer ${token}` },
                });

                // Defensive check: only set leads if response.data is an array
                if (Array.isArray(response.data)) {
                            setLeads(response.data);
                } else {
                            console.error('Unexpected response format:', response);
                            setLeads([]);
                }
              } catch (error) {
                        console.error('Failed to fetch leads:', error);
                        setLeads([]);
              }
      };

      const filteredLeads = leads.filter((lead) => {
              const matchesSearch =
                        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()));

                                             const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
              const matchesTemperature = filterTemperature === 'all' || lead.temperature === filterTemperature;

                                             return matchesSearch && matchesStatus && matchesTemperature;
      });

      return (
              <div className="space-y-6">
                    <div className="flex justify-between items-center">
                            <h1 className="text-3xl font-bold text-gray-900">Leads</h1>h1>
                            <button
                                          onClick={() => setIsModalOpen(true)}
                                          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                        >
                                      <Plus size={20} />
                                      Nieuwe Lead
                            </button>button>
                    </div>div>
              
                    <div className="bg-white p-4 rounded-lg shadow space-y-4">
                            <div className="flex gap-4">
                                      <div className="flex-1 relative">
                                                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                                  <input
                                                                    type="text"
                                                                    placeholder="Zoek leads..."
                                                                    value={searchTerm}
                                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                  />
                                      </div>div>
                            </div>div>
                    
                            <div className="flex gap-4">
                                      <select
                                                      value={filterStatus}
                                                      onChange={(e) => setFilterStatus(e.target.value)}
                                                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    >
                                                  <option value="all">Alle Statussen</option>option>
                                                  <option value="new">Nieuw</option>option>
                                                  <option value="contacted">Gecontacteerd</option>option>
                                                  <option value="qualified">Gekwalificeerd</option>option>
                                                  <option value="converted">Geconverteerd</option>option>
                                      </select>select>
                            
                                      <select
                                                      value={filterTemperature}
                                                      onChange={(e) => setFilterTemperature(e.target.value)
                                                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    1
                                  
                                                  <option value="all">Alle Temperaturen</option>option>
                                                  <option value="hot">Hot</option>option>
                                                  <option value="warm">Warm</option>option>
                                                  <option value="cold">Cold</option>option>
                                      </select>select>
                            </div>div>
                    </div>div>
              
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <LeadCard key={lead.id} lead={lead} onUpdate={fetchLeads} />
                          ))}
                    </div>div>
              
                  {filteredLeads.length === 0 && (
                          <div className="text-center py-
                                    <p className="text-gray-500">Geen leads gevonden</p>p>
                          </div>div>
                    )}
              
                  {isModalOpen && (
                          <Lead
                                        onClose={() => setIsModalOpen(false)}
                                        onSuccess={() => {
                                                        setIsModalOpen(false);
                                                        fetchLeads();
                                        }}
                                      />
                        )}
              </div>div>
            );
};

export default Leads;</div>
