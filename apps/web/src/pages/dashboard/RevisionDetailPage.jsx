
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, CheckCircle, AlertCircle, Send, ExternalLink, User, ShieldAlert, MessageSquare } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function RevisionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  const [revision, setRevision] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Admin states
  const [adminStatus, setAdminStatus] = useState('');
  const [adminHours, setAdminHours] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [isSavingAdmin, setIsSavingAdmin] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [revData, commentsData] = await Promise.all([
        api.revisions.getOne(id),
        api.revision_comments.getByRevision(id)
      ]);
      setRevision(revData);
      setComments(commentsData);
      
      if (isAdmin) {
        setAdminStatus(revData.status);
        setAdminHours(revData.estimated_hours || '');
        setAdminNotes(revData.admin_notes || '');
      }
    } catch (error) {
      console.error('Error fetching revision:', error);
      toast({ title: "Fehler", description: "Revision nicht gefunden.", variant: "destructive" });
      navigate('/dashboard/revisions');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    try {
      const comment = await api.revision_comments.create({
        revision_id: id,
        user_id: user.id,
        content: newComment
      });
      
      // Optimistic update with expanded user data
      const commentWithUser = { ...comment, expand: { user_id: user } };
      setComments([...comments, commentWithUser]);
      setNewComment('');
    } catch (error) {
      toast({ title: "Fehler", description: "Kommentar konnte nicht gesendet werden.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminSave = async () => {
    setIsSavingAdmin(true);
    try {
      const updated = await api.revisions.update(id, {
        status: adminStatus,
        estimated_hours: parseFloat(adminHours) || 0,
        admin_notes: adminNotes
      });
      setRevision(updated);
      toast({ title: "Gespeichert", className: "bg-[#10b981] text-white border-none" });
    } catch (error) {
      toast({ title: "Fehler", description: "Konnte nicht gespeichert werden.", variant: "destructive" });
    } finally {
      setIsSavingAdmin(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'offen': return <AlertCircle size={20} className="text-yellow-500" />;
      case 'in_bearbeitung': return <Clock size={20} className="text-blue-500" />;
      case 'erledigt': return <CheckCircle size={20} className="text-green-500" />;
      default: return <AlertCircle size={20} className="text-[#888888]" />;
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!revision) return null;

  return (
    <div className="max-w-full overflow-x-hidden mx-auto p-8 space-y-6 bg-[#08080a] pb-20">
      <DashboardHeader />
      
      <div className="max-w-5xl mx-auto space-y-6">
        <button 
          onClick={() => navigate(isAdmin ? '/dashboard/admin-revisions' : '/dashboard/revisions')} 
          className="flex items-center gap-2 text-[#888888] hover:text-[#c4a850] transition-colors text-sm"
        >
          <ArrowLeft size={16} /> Zurück zur Übersicht
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.05)] px-3 py-1.5 rounded-full border border-[rgba(255,255,255,0.1)]">
                  {getStatusIcon(revision.status)}
                  <span className="text-sm font-medium text-[#e8e4df] capitalize">{revision.status.replace('_', ' ')}</span>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  revision.priority === 'hoch' || revision.priority === 'dringend' ? 'bg-red-500/10 text-red-500' :
                  revision.priority === 'mittel' ? 'bg-blue-500/10 text-blue-500' :
                  'bg-[rgba(255,255,255,0.05)] text-[#888888]'
                }`}>
                  Priorität: {revision.priority}
                </span>
                <span className="text-sm text-[#888888] ml-auto">
                  {new Date(revision.created).toLocaleDateString('de-DE')}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-serif text-[#e8e4df] mb-6">{revision.title}</h1>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-[#a8b0c5] whitespace-pre-wrap leading-relaxed">{revision.description}</p>
              </div>

              {revision.page_url && (
                <div className="mt-8 p-4 bg-[#08080a] border border-[rgba(255,255,255,0.05)] rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <ExternalLink size={18} className="text-[#888888] shrink-0" />
                    <span className="text-sm text-[#888888] truncate">{revision.page_url}</span>
                  </div>
                  <a 
                    href={revision.page_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#c4a850] text-sm font-medium hover:underline shrink-0 ml-4"
                  >
                    Öffnen
                  </a>
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl flex flex-col h-[500px]">
              <div className="p-4 border-b border-[rgba(255,255,255,0.05)] bg-[#08080a] rounded-t-xl">
                <h3 className="font-medium text-[#e8e4df] flex items-center gap-2">
                  <MessageSquare size={18} className="text-[#c4a850]" /> Diskussion
                </h3>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {comments.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-[#888888]">Noch keine Kommentare.</div>
                ) : (
                  comments.map(comment => {
                    const isOwn = comment.user_id === user.id;
                    const authorName = comment.expand?.user_id?.name || 'Benutzer';
                    const authorRole = comment.expand?.user_id?.role;
                    
                    return (
                      <div key={comment.id} className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-[#a8b0c5]">
                            {isOwn ? 'Du' : authorName}
                            {authorRole === 'admin' && !isOwn && <span className="ml-2 text-[#c4a850]">(Admin)</span>}
                          </span>
                          <span className="text-[10px] text-[#5e6680]">{new Date(comment.created).toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <div className={`max-w-[85%] p-4 rounded-2xl ${
                          isOwn 
                            ? 'bg-[#c4a850] text-[#08080a] rounded-tr-sm' 
                            : authorRole === 'admin'
                              ? 'bg-[rgba(196,168,80,0.1)] border border-[rgba(196,168,80,0.2)] text-[#e8e4df] rounded-tl-sm'
                              : 'bg-[#08080a] border border-[rgba(255,255,255,0.1)] text-[#e8e4df] rounded-tl-sm'
                        }`}>
                          <p className="whitespace-pre-wrap text-sm">{comment.content}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              
              <div className="p-4 border-t border-[rgba(255,255,255,0.05)] bg-[#08080a] rounded-b-xl">
                <form onSubmit={handleAddComment} className="relative">
                  <input 
                    type="text" 
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Kommentar schreiben..." 
                    className="w-full bg-[#0d0d0f] border border-[rgba(255,255,255,0.1)] rounded-full py-3 pl-4 pr-12 text-sm text-[#e8e4df] focus:outline-none focus:border-[#c4a850]"
                  />
                  <button 
                    type="submit" 
                    disabled={!newComment.trim() || isSubmitting} 
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#c4a850] text-[#08080a] rounded-full flex items-center justify-center hover:bg-[#d4bc6a] disabled:opacity-50 transition-colors"
                  >
                    <Send size={14} className="ml-0.5" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info Card */}
            <div className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl p-6">
              <h3 className="text-lg font-medium text-[#e8e4df] mb-4">Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-[#888888] mb-1">Kunde</p>
                  <div className="flex items-center gap-2 text-sm text-[#e8e4df]">
                    <User size={14} className="text-[#c4a850]" />
                    {revision.expand?.user_id?.name || 'Unbekannt'}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[#888888] mb-1">Projekt</p>
                  <p className="text-sm text-[#e8e4df]">{revision.expand?.project_id?.title || 'Unbekannt'}</p>
                </div>
                {revision.estimated_hours > 0 && (
                  <div>
                    <p className="text-xs text-[#888888] mb-1">Geschätzter Aufwand</p>
                    <p className="text-sm text-[#e8e4df]">{revision.estimated_hours} Stunden</p>
                  </div>
                )}
              </div>
            </div>

            {/* Admin Controls */}
            {isAdmin && (
              <div className="bg-[#08080a] border border-[#c4a850]/30 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#c4a850] to-transparent" />
                <h3 className="text-lg font-medium text-[#c4a850] mb-4 flex items-center gap-2">
                  <ShieldAlert size={18} /> Admin Steuerung
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-[#888888] mb-1">Status ändern</label>
                    <select 
                      value={adminStatus} 
                      onChange={e => setAdminStatus(e.target.value)}
                      className="w-full bg-[#0d0d0f] border border-[rgba(255,255,255,0.1)] rounded-md px-3 py-2 text-sm text-[#e8e4df] focus:outline-none focus:border-[#c4a850]"
                    >
                      <option value="offen">Offen</option>
                      <option value="in_bearbeitung">In Bearbeitung</option>
                      <option value="feedback">Wartet auf Feedback</option>
                      <option value="erledigt">Erledigt</option>
                      <option value="abgelehnt">Abgelehnt</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-[#888888] mb-1">Geschätzte Stunden</label>
                    <input 
                      type="number" 
                      step="0.5"
                      value={adminHours} 
                      onChange={e => setAdminHours(e.target.value)}
                      className="w-full bg-[#0d0d0f] border border-[rgba(255,255,255,0.1)] rounded-md px-3 py-2 text-sm text-[#e8e4df] focus:outline-none focus:border-[#c4a850]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#888888] mb-1">Interne Notizen (nur Admin)</label>
                    <textarea 
                      rows={3}
                      value={adminNotes} 
                      onChange={e => setAdminNotes(e.target.value)}
                      className="w-full bg-[#0d0d0f] border border-[rgba(255,255,255,0.1)] rounded-md px-3 py-2 text-sm text-[#e8e4df] focus:outline-none focus:border-[#c4a850] resize-none"
                    />
                  </div>

                  <button 
                    onClick={handleAdminSave}
                    disabled={isSavingAdmin}
                    className="w-full bg-[#c4a850] text-[#08080a] py-2 rounded-md text-sm font-medium hover:bg-[#d4bc6a] transition-colors disabled:opacity-50 mt-2"
                  >
                    {isSavingAdmin ? 'Speichert...' : 'Änderungen speichern'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
