
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, GitPullRequest, Clock, CheckCircle, AlertCircle, X, ExternalLink, MessageSquare } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { useOutletContext } from 'react-router-dom';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function RevisionsPage() {
  const { user } = useAuth();
  const { setSidebarOpen } = useOutletContext() || {};
  const { toast } = useToast();
  
  const [revisions, setRevisions] = useState([]);
  const [activePackage, setActivePackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    page_url: '',
    priority: 'mittel'
  });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    try {
      const [revs, pkgs] = await Promise.all([
        api.revisions.getByUser(user.id),
        api.revision_packages.getActive(user.id)
      ]);
      setRevisions(revs);
      setActivePackage(pkgs[0] || null);
    } catch (error) {
      console.error('Error fetching revisions:', error);
      toast({ title: "Fehler", description: "Daten konnten nicht geladen werden.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activePackage || activePackage.used_revisions >= activePackage.total_revisions) {
      toast({ title: "Limit erreicht", description: "Du hast keine offenen Revisionen mehr in deinem Paket.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const project = await api.projects.getProject(user.id);
      if (!project) throw new Error("Kein aktives Projekt gefunden.");

      await api.revisions.create({
        ...formData,
        user_id: user.id,
        project_id: project.id,
        status: 'offen'
      });

      await api.revision_packages.incrementUsed(activePackage.id);
      
      toast({ title: "Revision eingereicht", className: "bg-[#10b981] text-white border-none" });
      setIsModalOpen(false);
      setFormData({ title: '', description: '', page_url: '', priority: 'mittel' });
      fetchData();
    } catch (error) {
      toast({ title: "Fehler", description: error.message || "Revision konnte nicht erstellt werden.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'offen': return <AlertCircle size={16} className="text-yellow-500" />;
      case 'in_bearbeitung': return <Clock size={16} className="text-blue-500" />;
      case 'erledigt': return <CheckCircle size={16} className="text-green-500" />;
      default: return <GitPullRequest size={16} className="text-[#888888]" />;
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-full overflow-x-hidden mx-auto p-8 space-y-8 bg-[#08080a] pb-20">
      <DashboardHeader onMenuClick={() => setSidebarOpen?.(true)} />
      
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif text-[#e8e4df] mb-2">Revisionen</h1>
            <p className="text-[#888888]">Verwalte deine Änderungs- und Anpassungswünsche.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#c4a850] text-[#08080a] px-5 py-2.5 rounded-lg font-medium hover:bg-[#d4bc6a] transition-colors"
          >
            <Plus size={18} /> Neue Revision
          </button>
        </div>

        {/* Active Package Status */}
        {activePackage ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#c4a850] opacity-5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
              <div>
                <h3 className="text-lg font-medium text-[#e8e4df] mb-1">Aktuelles Revisionspaket</h3>
                <p className="text-sm text-[#888888]">{activePackage.package_name}</p>
              </div>
              <div className="w-full md:w-1/2">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#888888]">Verbraucht: <strong className="text-[#e8e4df]">{activePackage.used_revisions}</strong></span>
                  <span className="text-[#888888]">Gesamt: <strong className="text-[#e8e4df]">{activePackage.total_revisions}</strong></span>
                </div>
                <div className="w-full bg-[#08080a] rounded-full h-2.5 border border-[rgba(255,255,255,0.05)] overflow-hidden">
                  <div 
                    className="h-full bg-[#c4a850] transition-all duration-500"
                    style={{ width: `${(activePackage.used_revisions / activePackage.total_revisions) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="bg-[#0d0d0f] border border-[rgba(255,255,255,0.05)] rounded-xl p-6 flex items-center justify-between">
            <p className="text-[#888888]">Du hast aktuell kein aktives Revisionspaket.</p>
            <button className="text-[#c4a850] text-sm hover:underline">Paket buchen</button>
          </div>
        )}

        {/* Revisions Grid */}
        {revisions.length === 0 ? (
          <div className="bg-[#0d0d0f] border border-[rgba(255,255,255,0.05)] rounded-xl p-12 text-center">
            <GitPullRequest size={48} className="text-[#888888] mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-[#e8e4df] mb-2">Keine Revisionen</h3>
            <p className="text-[#888888]">Du hast noch keine Änderungsanfragen gestellt.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {revisions.map((rev, index) => (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link 
                  to={`/dashboard/revisions/${rev.id}`}
                  className="block h-full bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl p-6 hover:border-[#c4a850]/50 transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(rev.status)}
                      <span className="text-xs font-medium text-[#a8b0c5] uppercase tracking-wider">
                        {rev.status.replace('_', ' ')}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      rev.priority === 'hoch' || rev.priority === 'dringend' ? 'bg-red-500/10 text-red-500' :
                      rev.priority === 'mittel' ? 'bg-blue-500/10 text-blue-500' :
                      'bg-[rgba(255,255,255,0.05)] text-[#888888]'
                    }`}>
                      {rev.priority}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-medium text-[#e8e4df] mb-2 group-hover:text-[#c4a850] transition-colors line-clamp-1">
                    {rev.title}
                  </h3>
                  <p className="text-sm text-[#888888] line-clamp-2 mb-4">
                    {rev.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-[rgba(255,255,255,0.05)]">
                    <span className="text-xs text-[#5e6680]">
                      {new Date(rev.created).toLocaleDateString('de-DE')}
                    </span>
                    <div className="flex items-center gap-1 text-[#c4a850] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Details <ExternalLink size={14} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Create Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl p-6 w-full max-w-lg shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-serif text-[#e8e4df]">Neue Revision anfragen</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-[#888888] hover:text-[#e8e4df] transition-colors">
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-[#888888] mb-1">Titel der Änderung</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.title} 
                      onChange={e => setFormData({...formData, title: e.target.value})} 
                      className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none" 
                      placeholder="z.B. Logo im Header austauschen"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-[#888888] mb-1">Beschreibung</label>
                    <textarea 
                      required 
                      rows={4}
                      value={formData.description} 
                      onChange={e => setFormData({...formData, description: e.target.value})} 
                      className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none resize-none" 
                      placeholder="Bitte beschreibe genau, was geändert werden soll..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[#888888] mb-1">Betroffene URL (Optional)</label>
                    <input 
                      type="url" 
                      value={formData.page_url} 
                      onChange={e => setFormData({...formData, page_url: e.target.value})} 
                      className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none" 
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[#888888] mb-1">Priorität</label>
                    <select 
                      value={formData.priority} 
                      onChange={e => setFormData({...formData, priority: e.target.value})} 
                      className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none"
                    >
                      <option value="niedrig">Niedrig</option>
                      <option value="mittel">Mittel</option>
                      <option value="hoch">Hoch</option>
                      <option value="dringend">Dringend</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-[rgba(255,255,255,0.05)]">
                    <button 
                      type="button" 
                      onClick={() => setIsModalOpen(false)} 
                      className="px-4 py-2 text-[#888888] hover:text-[#e8e4df] transition-colors text-sm"
                    >
                      Abbrechen
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-[#c4a850] text-[#08080a] px-6 py-2 rounded-md text-sm font-medium hover:bg-[#d4bc6a] transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? 'Wird gesendet...' : 'Einreichen'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
