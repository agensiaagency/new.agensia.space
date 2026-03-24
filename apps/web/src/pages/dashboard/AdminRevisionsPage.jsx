
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GitPullRequest, Search, Filter, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminRevisionsPage() {
  const navigate = useNavigate();
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchRevisions();
  }, []);

  const fetchRevisions = async () => {
    try {
      const data = await api.revisions.getAll();
      setRevisions(data);
    } catch (error) {
      console.error('Error fetching revisions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRevisions = revisions.filter(rev => {
    const matchesSearch = 
      rev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rev.expand?.user_id?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || rev.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    offen: revisions.filter(r => r.status === 'offen').length,
    in_bearbeitung: revisions.filter(r => r.status === 'in_bearbeitung').length,
    erledigt: revisions.filter(r => r.status === 'erledigt').length,
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-full overflow-x-hidden mx-auto p-8 space-y-8 bg-[#08080a] pb-20">
      <DashboardHeader />
      
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-serif text-[#e8e4df] mb-2">Revisionen verwalten</h1>
          <p className="text-[#888888]">Übersicht aller Kunden-Änderungsanfragen.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl p-6 flex items-center justify-between">
            <div>
              <p className="text-[#888888] text-sm mb-1">Offen</p>
              <p className="text-3xl font-serif text-[#e8e4df]">{stats.offen}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-500/10 text-yellow-500">
              <AlertCircle size={24} />
            </div>
          </div>
          <div className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl p-6 flex items-center justify-between">
            <div>
              <p className="text-[#888888] text-sm mb-1">In Bearbeitung</p>
              <p className="text-3xl font-serif text-[#e8e4df]">{stats.in_bearbeitung}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-500/10 text-blue-500">
              <Clock size={24} />
            </div>
          </div>
          <div className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl p-6 flex items-center justify-between">
            <div>
              <p className="text-[#888888] text-sm mb-1">Erledigt</p>
              <p className="text-3xl font-serif text-[#e8e4df]">{stats.erledigt}</p>
            </div>
            <div className="p-3 rounded-full bg-green-500/10 text-green-500">
              <CheckCircle size={24} />
            </div>
          </div>
        </div>

        {/* Filters & Table */}
        <div className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[rgba(255,255,255,0.05)] flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" size={18} />
              <input 
                type="text" 
                placeholder="Suchen..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-lg py-2 pl-10 pr-4 text-sm text-[#e8e4df] focus:outline-none focus:border-[#c4a850]"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-[#888888]" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-lg py-2 px-3 text-sm text-[#e8e4df] focus:outline-none focus:border-[#c4a850]"
              >
                <option value="all">Alle Status</option>
                <option value="offen">Offen</option>
                <option value="in_bearbeitung">In Bearbeitung</option>
                <option value="feedback">Feedback</option>
                <option value="erledigt">Erledigt</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#08080a] text-[#888888]">
                <tr>
                  <th className="px-6 py-4 font-medium">Kunde</th>
                  <th className="px-6 py-4 font-medium">Titel</th>
                  <th className="px-6 py-4 font-medium">Priorität</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Datum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
                {filteredRevisions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-[#888888]">
                      Keine Revisionen gefunden.
                    </td>
                  </tr>
                ) : (
                  filteredRevisions.map(rev => (
                    <tr 
                      key={rev.id} 
                      onClick={() => navigate(`/dashboard/revisions/${rev.id}`)}
                      className="hover:bg-[rgba(255,255,255,0.02)] transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-[#e8e4df]">{rev.expand?.user_id?.name || 'Unbekannt'}</div>
                        <div className="text-xs text-[#888888]">{rev.expand?.project_id?.title || '-'}</div>
                      </td>
                      <td className="px-6 py-4 text-[#e8e4df] group-hover:text-[#c4a850] transition-colors">
                        {rev.title}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                          rev.priority === 'hoch' || rev.priority === 'dringend' ? 'bg-red-500/10 text-red-500' :
                          rev.priority === 'mittel' ? 'bg-blue-500/10 text-blue-500' :
                          'bg-[rgba(255,255,255,0.05)] text-[#888888]'
                        }`}>
                          {rev.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                          rev.status === 'offen' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                          rev.status === 'in_bearbeitung' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                          rev.status === 'erledigt' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                          'bg-[rgba(255,255,255,0.05)] text-[#a8b0c5] border-[rgba(255,255,255,0.1)]'
                        }`}>
                          {rev.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#888888]">
                        {new Date(rev.created).toLocaleDateString('de-DE')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
