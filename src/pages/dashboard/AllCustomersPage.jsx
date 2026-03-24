
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '@/lib/api.js';
import apiServerClient from '@/lib/apiServerClient';
import { Search, MessageSquare, Download, Filter, MoreVertical, GitPullRequest, ClipboardList } from 'lucide-react';

export default function AllCustomersPage() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Alle Status');
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => { 
    fetchData(); 
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchData = async () => {
    try {
      const [users, projects, revisions] = await Promise.all([
        api.users.getAll(),
        api.projects.getAllProjects(),
        api.revisions.getAll()
      ]);
      
      const enriched = users.filter(u => u.role === 'user').map(u => {
        const userProject = projects.find(p => p.userId === u.id);
        const userRevisions = revisions.filter(r => r.user_id === u.id && (r.status === 'offen' || r.status === 'in_bearbeitung'));
        
        return { 
          ...u, 
          projectTitle: userProject?.title || 'Kein Projekt',
          projectStatus: userProject?.status || 'Neu',
          openRevisions: userRevisions.length,
          package: userProject?.package || u.selected_package || '-'
        };
      });
      setCustomers(enriched);
    } catch (error) { 
      console.error(error); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleExport = async () => {
    try {
      await apiServerClient.fetch('/exports/customers?format=csv', { method: 'POST' });
      alert('CSV Export gestartet');
    } catch (e) { console.error(e); }
  };

  const getStatusColor = (status) => {
    const s = status.toLowerCase();
    if (s === 'launched' || s === 'live') return 'bg-green-500/10 text-green-500 border-green-500/20';
    if (s === 'review') return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    if (s === 'development' || s === 'entwicklung') return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    if (s === 'design') return 'bg-pink-500/10 text-pink-500 border-pink-500/20';
    if (s === 'planning' || s === 'briefing' || s === 'neu') return 'bg-[rgba(255,255,255,0.05)] text-[#a8b0c5] border-[rgba(255,255,255,0.1)]';
    if (s === 'pausiert') return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    return 'bg-[rgba(255,255,255,0.05)] text-[#a8b0c5] border-[rgba(255,255,255,0.1)]';
  };

  const getStatusLabel = (status) => {
    const s = status.toLowerCase();
    if (s === 'launched' || s === 'live') return 'Live';
    if (s === 'review') return 'Review';
    if (s === 'development') return 'Entwicklung';
    if (s === 'design') return 'Design';
    if (s === 'planning' || s === 'neu') return 'Briefing';
    return status;
  };

  const filtered = customers.filter(c => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (
      c.name?.toLowerCase().includes(searchLower) || 
      c.email?.toLowerCase().includes(searchLower) ||
      c.company_name?.toLowerCase().includes(searchLower)
    );
    
    const s = c.projectStatus.toLowerCase();
    const matchesStatus = statusFilter === 'Alle Status' || 
                          (statusFilter === 'Briefing' && (s === 'planning' || s === 'neu')) ||
                          (statusFilter === 'Design' && s === 'design') ||
                          (statusFilter === 'Entwicklung' && s === 'development') ||
                          (statusFilter === 'Review' && s === 'review') ||
                          (statusFilter === 'Live' && (s === 'launched' || s === 'live')) ||
                          (statusFilter === 'Pausiert' && s === 'pausiert');
                          
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="p-8 text-[#888888] animate-pulse">Lade Kunden...</div>;

  return (
    <div className="max-w-full overflow-x-hidden mx-auto p-8 space-y-8 bg-[#08080a] pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-4xl font-serif text-[#e8e4df] mb-2">Kundenübersicht</h1>
            <p className="text-[#a8b0c5] font-sans text-sm">Verwalte alle Kunden und Projekte.</p>
          </div>
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-[#0d0d0f] border border-[rgba(196,168,80,0.2)] text-[#e8e4df] rounded-md hover:border-[#c4a850] transition-colors text-sm">
            <Download size={16} /> CSV Export
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" size={18} />
            <input 
              type="text" 
              placeholder="Suchen nach Name, E-Mail oder Firma..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="w-full bg-[#0d0d0f] border border-[rgba(196,168,80,0.2)] rounded-md py-2 pl-10 pr-4 text-[#e8e4df] text-sm focus:outline-none focus:border-[#c4a850]" 
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-[#888888]" />
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)} 
              className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.2)] rounded-md py-2 px-4 text-[#e8e4df] text-sm focus:outline-none focus:border-[#c4a850]"
            >
              <option value="Alle Status">Alle Status</option>
              <option value="Briefing">Briefing</option>
              <option value="Design">Design</option>
              <option value="Entwicklung">Entwicklung</option>
              <option value="Review">Review</option>
              <option value="Live">Live</option>
              <option value="Pausiert">Pausiert</option>
            </select>
          </div>
        </div>

        <div className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[rgba(255,255,255,0.02)] border-b border-[rgba(196,168,80,0.12)]">
                  <th className="p-4 text-xs font-medium text-[#a8b0c5]">Name & Email</th>
                  <th className="p-4 text-xs font-medium text-[#a8b0c5]">Firma</th>
                  <th className="p-4 text-xs font-medium text-[#a8b0c5]">Projekt</th>
                  <th className="p-4 text-xs font-medium text-[#a8b0c5]">Status</th>
                  <th className="p-4 text-xs font-medium text-[#a8b0c5]">Offene Revisionen</th>
                  <th className="p-4 text-xs font-medium text-[#a8b0c5]">Paket</th>
                  <th className="p-4 text-xs font-medium text-[#a8b0c5] text-right">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(196,168,80,0.05)]">
                {filtered.map((c, i) => (
                  <motion.tr 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: i * 0.05 }}
                    key={c.id} 
                    onClick={() => navigate(`/dashboard/admin-user/${c.id}`)} 
                    className="hover:bg-[rgba(196,168,80,0.05)] cursor-pointer transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-medium text-[#e8e4df] text-sm">{c.name || '-'}</div>
                      <div className="text-xs text-[#888888] mt-0.5">{c.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-[#a8b0c5]">{c.company_name || '-'}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-[#e8e4df]">{c.projectTitle}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(c.projectStatus)}`}>
                        {getStatusLabel(c.projectStatus)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${c.openRevisions > 0 ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-500'}`}>
                        {c.openRevisions}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-[#a8b0c5] capitalize">{c.package}</span>
                    </td>
                    <td className="p-4 text-right relative">
                      <button 
                        onClick={e => { 
                          e.stopPropagation(); 
                          setOpenDropdownId(openDropdownId === c.id ? null : c.id); 
                        }} 
                        className="p-2 text-[#888888] hover:text-[#e8e4df] rounded-md hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                      >
                        <MoreVertical size={18} />
                      </button>
                      
                      {openDropdownId === c.id && (
                        <div ref={dropdownRef} className="absolute right-8 top-10 w-48 bg-[#0d0d0f] border border-[rgba(196,168,80,0.2)] rounded-md shadow-xl z-50 py-1 overflow-hidden">
                          <button 
                            onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/admin-user/${c.id}?tab=nachrichten`); }} 
                            className="w-full text-left px-4 py-2 text-sm text-[#e8e4df] hover:bg-[rgba(196,168,80,0.1)] hover:text-[#c4a850] flex items-center gap-2"
                          >
                            <MessageSquare size={14} /> Nachricht senden
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/admin-user/${c.id}?tab=revisionen`); }} 
                            className="w-full text-left px-4 py-2 text-sm text-[#e8e4df] hover:bg-[rgba(196,168,80,0.1)] hover:text-[#c4a850] flex items-center gap-2"
                          >
                            <GitPullRequest size={14} /> Revision erstellen
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); navigate('/dashboard/admin-content-forms'); }} 
                            className="w-full text-left px-4 py-2 text-sm text-[#e8e4df] hover:bg-[rgba(196,168,80,0.1)] hover:text-[#c4a850] flex items-center gap-2"
                          >
                            <ClipboardList size={14} /> Formular zuweisen
                          </button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-[#888888]">Keine Kunden gefunden.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
