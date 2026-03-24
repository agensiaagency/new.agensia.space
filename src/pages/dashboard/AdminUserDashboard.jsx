
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import pb from '@/lib/pocketbaseClient.js';
import { api } from '@/lib/api.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, MessageSquare, FileText, Activity, CreditCard, 
  GitPullRequest, PenTool, ClipboardList, StickyNote, 
  Send, Pin, Trash2, Plus, CheckCircle, Clock, AlertCircle, X, Globe,
  ShieldAlert, ChevronDown, ChevronUp
} from 'lucide-react';
import FilesPage from './FilesPage.jsx';

const ContentAccordion = ({ section, onMarkChecked }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'geprüft': return 'bg-[#c4a850]/10 text-[#c4a850] border-[#c4a850]/20';
      case 'fertig': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'entwurf': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-[rgba(255,255,255,0.05)] text-[#888888] border-[rgba(255,255,255,0.1)]';
    }
  };

  return (
    <div className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl overflow-hidden mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-[rgba(255,255,255,0.02)] transition-colors min-h-[60px]"
      >
        <div className="flex items-center gap-4">
          <h4 className="font-medium text-[#e8e4df]">{section.section_label}</h4>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(section.status)}`}>
            {section.status}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#5e6680] hidden sm:inline-block">
            {(section.content || '').length} Zeichen
          </span>
          {isOpen ? <ChevronUp size={20} className="text-[#888888]" /> : <ChevronDown size={20} className="text-[#888888]" />}
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-[rgba(255,255,255,0.05)]"
          >
            <div className="p-5 space-y-6">
              <div>
                <h5 className="text-xs font-medium text-[#888888] uppercase tracking-wider mb-2">Inhalt</h5>
                <div className="bg-[#08080a] border border-[rgba(255,255,255,0.05)] rounded-lg p-4 text-[#e8e4df] text-sm whitespace-pre-wrap font-sans leading-relaxed min-h-[100px]">
                  {section.content || <span className="text-[#5e6680] italic">Kein Inhalt vorhanden</span>}
                </div>
              </div>
              
              {section.notes && (
                <div>
                  <h5 className="text-xs font-medium text-[#888888] uppercase tracking-wider mb-2">Notizen</h5>
                  <div className="bg-[#08080a] border border-[rgba(255,255,255,0.05)] rounded-lg p-4 text-[#a8b0c5] text-sm whitespace-pre-wrap font-sans">
                    {section.notes}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end pt-2">
                {section.status !== 'geprüft' && (
                  <button 
                    onClick={() => onMarkChecked(section.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#c4a850] text-[#08080a] rounded-md text-sm font-medium hover:bg-[#d4bc6a] transition-colors min-h-[44px]"
                  >
                    <CheckCircle size={16} /> Als geprüft markieren
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function AdminUserDashboard() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const chatEndRef = useRef(null);

  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'übersicht';

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Data States
  const [userData, setUserData] = useState(null);
  const [project, setProject] = useState(null);
  const [revisions, setRevisions] = useState([]);
  const [designReviews, setDesignReviews] = useState([]);
  const [forms, setForms] = useState([]);
  const [websiteContent, setWebsiteContent] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notes, setNotes] = useState([]);
  const [activities, setActivities] = useState([]);
  const [payments, setPayments] = useState([]);

  // Form States
  const [newMessage, setNewMessage] = useState('');
  const [newNote, setNewNote] = useState({ content: '', category: 'allgemein' });
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [packageForm, setPackageForm] = useState({ name: 'Standard Paket', count: 3, price: 0 });
  const [projectForm, setProjectForm] = useState({});
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [domainInput, setDomainInput] = useState('');

  useEffect(() => {
    fetchData();
  }, [userId]);

  useEffect(() => {
    if (activeTab === 'nachrichten') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        userRes,
        projectRes,
        revisionsRes,
        reviewsRes,
        formsRes,
        contentRes,
        messagesRes,
        notesRes,
        activitiesRes,
        paymentsRes
      ] = await Promise.all([
        pb.collection('users').getOne(userId, { $autoCancel: false }),
        pb.collection('projects').getFullList({ filter: `userId = "${userId}"`, $autoCancel: false }),
        api.revisions.getByUser(userId),
        api.design_reviews.getByUser(userId),
        api.content_form_responses.getByUser(userId),
        api.website_content.getByUser(userId),
        pb.collection('messages').getFullList({ filter: `senderId = "${userId}" || projectId = "${userId}"`, sort: 'created', $autoCancel: false }),
        api.admin_notes.getByUser(userId),
        pb.collection('activity_log').getFullList({ filter: `user_id = "${userId}"`, sort: '-created', $autoCancel: false }),
        pb.collection('payments').getFullList({ filter: `userId = "${userId}"`, sort: '-created', $autoCancel: false })
      ]);

      setUserData(userRes);
      const proj = projectRes[0] || null;
      setProject(proj);
      if (proj) {
        setProjectForm({
          title: proj.title || '',
          niche: proj.nicheId || '',
          package: proj.packageId || '',
          status: proj.status || 'planning',
          phase: proj.phase || 1,
          url: proj.url || '',
          notes: proj.notes || ''
        });
      }
      setRevisions(revisionsRes);
      setDesignReviews(reviewsRes);
      setForms(formsRes);
      setWebsiteContent(contentRes);
      setMessages(messagesRes);
      setNotes(notesRes);
      setActivities(activitiesRes);
      setPayments(paymentsRes);
    } catch (error) {
      console.error('Error fetching user dashboard data:', error);
      toast({ title: "Fehler", description: "Daten konnten nicht geladen werden.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const msg = await api.messages.create({
        projectId: userId,
        senderId: currentUser.id,
        content: newMessage,
        read: false
      });
      setMessages([...messages, msg]);
      setNewMessage('');
    } catch (error) {
      toast({ title: "Fehler", description: "Nachricht konnte nicht gesendet werden.", variant: "destructive" });
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.content.trim()) return;
    try {
      const note = await api.admin_notes.create({
        user_id: userId,
        admin_id: currentUser.id,
        content: newNote.content,
        category: newNote.category,
        pinned: false
      });
      setNotes([note, ...notes]);
      setNewNote({ content: '', category: 'allgemein' });
      toast({ title: "Notiz hinzugefügt", className: "bg-[#10b981] text-white border-none" });
    } catch (error) {
      toast({ title: "Fehler", variant: "destructive" });
    }
  };

  const handleTogglePinNote = async (noteId, currentStatus) => {
    try {
      await api.admin_notes.togglePin(noteId, currentStatus);
      fetchData();
    } catch (error) {
      toast({ title: "Fehler", variant: "destructive" });
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Notiz wirklich löschen?')) return;
    try {
      await api.admin_notes.delete(noteId);
      setNotes(notes.filter(n => n.id !== noteId));
    } catch (error) {
      toast({ title: "Fehler", variant: "destructive" });
    }
  };

  const handleCreateRevisionPackage = async (e) => {
    e.preventDefault();
    try {
      await api.revision_packages.create({
        user_id: userId,
        project_id: project?.id || '',
        package_name: packageForm.name,
        total_revisions: packageForm.count,
        used_revisions: 0,
        price: packageForm.price,
        status: 'aktiv'
      });
      setIsPackageModalOpen(false);
      toast({ title: "Paket zugewiesen", className: "bg-[#10b981] text-white border-none" });
    } catch (error) {
      toast({ title: "Fehler", variant: "destructive" });
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    if (!project) return;
    setIsSavingProject(true);
    try {
      const updated = await pb.collection('projects').update(project.id, projectForm, { $autoCancel: false });
      setProject(updated);
      toast({ title: "Projekt aktualisiert", className: "bg-[#10b981] text-white border-none" });
    } catch (error) {
      toast({ title: "Fehler", variant: "destructive" });
    } finally {
      setIsSavingProject(false);
    }
  };

  const handleAssignDomain = async () => {
    if (!domainInput.trim()) return;
    try {
      await api.updateUser(userId, { 
        domain: domainInput, 
        domain_status: 'pending' 
      });
      toast({ title: "Domain zugewiesen", className: "bg-[#10b981] text-white border-none" });
      setDomainInput('');
      fetchData();
    } catch (error) {
      toast({ title: "Fehler", description: "Domain konnte nicht zugewiesen werden.", variant: "destructive" });
    }
  };

  const handleMarkContentChecked = async (sectionId) => {
    try {
      await api.website_content.update(sectionId, { status: 'geprüft' });
      setWebsiteContent(prev => prev.map(s => s.id === sectionId ? { ...s, status: 'geprüft' } : s));
      toast({ title: "Als geprüft markiert", className: "bg-[#10b981] text-white border-none" });
    } catch (error) {
      toast({ title: "Fehler beim Aktualisieren", variant: "destructive" });
    }
  };

  if (loading) return <div className="p-8 text-[#888888] animate-pulse">Lade Kundendaten...</div>;
  if (!userData) return <div className="p-8 text-red-400">Kunde nicht gefunden.</div>;

  const tabs = [
    { id: 'übersicht', label: 'Übersicht', icon: Activity },
    { id: 'projekt', label: 'Projekt', icon: FileText },
    { id: 'revisionen', label: 'Revisionen', icon: GitPullRequest },
    { id: 'design', label: 'Design-Reviews', icon: PenTool },
    { id: 'formulare', label: 'Formulare', icon: ClipboardList },
    { id: 'inhalte', label: 'Website-Inhalte', icon: PenTool },
    { id: 'dateien', label: 'Dateien', icon: FileText },
    { id: 'nachrichten', label: 'Nachrichten', icon: MessageSquare },
    { id: 'notizen', label: 'Notizen', icon: StickyNote },
    { id: 'rechnungen', label: 'Rechnungen', icon: CreditCard }
  ];

  const openRevisions = revisions.filter(r => r.status === 'offen' || r.status === 'in_bearbeitung').length;
  const unreadMessages = messages.filter(m => m.senderId === userId && !m.read).length;

  return (
    <div className="max-w-full overflow-x-hidden mx-auto p-8 space-y-6 bg-[#08080a] pb-20">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Golden Admin Banner */}
        <div className="bg-gradient-to-r from-[#c4a850]/20 to-transparent border border-[#c4a850]/30 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#c4a850] opacity-5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="relative z-10">
            <button onClick={() => navigate('/dashboard/customers')} className="flex items-center gap-2 text-[#888888] hover:text-[#c4a850] mb-2 text-sm transition-colors">
              <ArrowLeft size={16} /> Zurück zur Kundenliste
            </button>
            <h1 className="text-3xl font-serif text-[#e8e4df] flex items-center gap-3">
              {userData.name || 'Unbenannt'}
              <span className="px-2.5 py-1 rounded-full text-xs font-sans font-medium bg-[rgba(196,168,80,0.1)] text-[#c4a850] border border-[rgba(196,168,80,0.2)] flex items-center gap-1">
                <ShieldAlert size={12} /> Admin View
              </span>
            </h1>
          </div>
          <div className="flex flex-wrap gap-3 relative z-10">
            <button onClick={() => setActiveTab('nachrichten')} className="flex items-center gap-2 px-4 py-2 bg-[#0d0d0f] border border-[rgba(196,168,80,0.3)] text-[#e8e4df] rounded-md text-sm hover:border-[#c4a850] transition-colors">
              <MessageSquare size={16} /> Nachricht
            </button>
            <button onClick={() => setIsPackageModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-[#0d0d0f] border border-[rgba(196,168,80,0.3)] text-[#e8e4df] rounded-md text-sm hover:border-[#c4a850] transition-colors">
              <GitPullRequest size={16} /> Revisionen
            </button>
            <button onClick={() => navigate('/dashboard/admin-content-forms')} className="flex items-center gap-2 px-4 py-2 bg-[#c4a850] text-[#08080a] rounded-md text-sm font-medium hover:bg-[#d4bc6a] transition-colors">
              <ClipboardList size={16} /> Formular zuweisen
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[rgba(255,255,255,0.05)] custom-scrollbar">
          {tabs.map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-[#0d0d0f] text-[#c4a850] border-t border-l border-r border-[rgba(196,168,80,0.2)]' 
                  : 'bg-transparent text-[#888888] hover:text-[#e8e4df] hover:bg-[rgba(255,255,255,0.02)]'
              }`}
            >
              <tab.icon size={16} /> {tab.label}
              {tab.id === 'nachrichten' && unreadMessages > 0 && (
                <span className="bg-[#c4a850] text-[#08080a] text-[10px] px-1.5 py-0.5 rounded-full ml-1">{unreadMessages}</span>
              )}
              {tab.id === 'revisionen' && openRevisions > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">{openRevisions}</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              
              {/* TAB: ÜBERSICHT */}
              {activeTab === 'übersicht' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Offene Revisionen', value: openRevisions, icon: GitPullRequest, color: 'text-red-400' },
                        { label: 'Formulare', value: forms.length, icon: ClipboardList, color: 'text-blue-400' },
                        { label: 'Design Reviews', value: designReviews.length, icon: PenTool, color: 'text-purple-400' },
                        { label: 'Ungelesen', value: unreadMessages, icon: MessageSquare, color: 'text-yellow-400' }
                      ].map((stat, i) => (
                        <div key={i} className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl p-4 flex flex-col items-center justify-center text-center">
                          <stat.icon size={24} className={`${stat.color} mb-2`} />
                          <span className="text-2xl font-serif text-[#e8e4df]">{stat.value}</span>
                          <span className="text-xs text-[#888888] mt-1">{stat.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Project Status Card */}
                    <div className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl p-6">
                      <h3 className="text-lg font-medium text-[#e8e4df] mb-6">Projektfortschritt</h3>
                      {project ? (
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-[#888888]">Phase {project.phase || 1} von 5</span>
                            <span className="text-[#c4a850] font-medium capitalize">{project.status}</span>
                          </div>
                          <div className="w-full bg-[#08080a] rounded-full h-3 border border-[rgba(255,255,255,0.05)] overflow-hidden flex">
                            {[1, 2, 3, 4, 5].map(step => (
                              <div 
                                key={step} 
                                className={`h-full flex-1 border-r border-[#0d0d0f] last:border-0 transition-colors duration-500 ${
                                  step < (project.phase || 1) ? 'bg-[#c4a850]' : 
                                  step === (project.phase || 1) ? 'bg-[#c4a850]/50 animate-pulse' : 'bg-transparent'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="flex justify-between text-xs text-[#888888] mt-2 px-1">
                            <span>Briefing</span>
                            <span>Design</span>
                            <span>Dev</span>
                            <span>Review</span>
                            <span>Live</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[#888888] text-sm">Kein aktives Projekt vorhanden.</p>
                      )}
                    </div>

                    {/* Hosting Status Card */}
                    <div className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl p-6">
                      <h3 className="text-lg font-medium text-[#e8e4df] mb-4 flex items-center gap-2">
                        <Globe size={18} className="text-[#c4a850]" /> Hosting & Domain
                      </h3>
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-center pb-3 border-b border-[rgba(255,255,255,0.05)]">
                          <span className="text-sm text-[#888888]">Status</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            userData.hosting_status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                            userData.hosting_status === 'payment_failed' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                            userData.hosting_status === 'cancelled' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                            'bg-[rgba(255,255,255,0.05)] text-[#a8b0c5] border-[rgba(255,255,255,0.1)]'
                          }`}>
                            {userData.hosting_status || 'inactive'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-[rgba(255,255,255,0.05)]">
                          <span className="text-sm text-[#888888]">Paket</span>
                          <span className="text-sm text-[#e8e4df] capitalize">{userData.selected_package || '-'}</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-[rgba(255,255,255,0.05)]">
                          <span className="text-sm text-[#888888]">Monatlich</span>
                          <span className="text-sm text-[#c4a850] font-medium">{userData.monthly_price ? `${userData.monthly_price} €` : '-'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#888888]">Domain</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-[#e8e4df]">{userData.domain || 'Keine'}</span>
                            {userData.domain && (
                              <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                                userData.domain_status === 'active' ? 'text-green-400 bg-green-400/10' :
                                userData.domain_status === 'propagating' ? 'text-yellow-400 bg-yellow-400/10' :
                                'text-[#888888] bg-[rgba(255,255,255,0.05)]'
                              }`}>
                                {userData.domain_status}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[rgba(255,255,255,0.05)]">
                        <h4 className="text-sm font-medium text-[#e8e4df] mb-3">Domain zuweisen</h4>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={domainInput}
                            onChange={e => setDomainInput(e.target.value)}
                            placeholder="mein-kunde.de" 
                            className="flex-1 bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-md px-3 py-2 text-sm text-[#e8e4df] focus:outline-none focus:border-[#c4a850]"
                          />
                          <button 
                            onClick={handleAssignDomain}
                            disabled={!domainInput.trim()}
                            className="bg-[#c4a850] text-[#08080a] px-4 py-2 rounded-md text-sm font-medium hover:bg-[#d4bc6a] transition-colors disabled:opacity-50"
                          >
                            Speichern
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Recent Activities */}
                    <div className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl p-6">
                      <h3 className="text-lg font-medium text-[#e8e4df] mb-4">Letzte Aktivitäten</h3>
                      {activities.length > 0 ? (
                        <div className="space-y-4 border-l-2 border-[rgba(196,168,80,0.2)] ml-2 pl-4">
                          {activities.slice(0, 5).map(act => (
                            <div key={act.id} className="relative">
                              <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 bg-[#c4a850] rounded-full ring-4 ring-[#0d0d0f]" />
                              <p className="text-sm text-[#e8e4df]">{act.description || act.action}</p>
                              <p className="text-xs text-[#888888] mt-0.5">{new Date(act.created).toLocaleString('de-DE')}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[#888888] text-sm">Keine Aktivitäten gefunden.</p>
                      )}
                    </div>
                  </div>

                  {/* Profile Card */}
                  <div className="space-y-6">
                    <div className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl p-6">
                      <div className="w-20 h-20 rounded-2xl bg-[rgba(196,168,80,0.1)] text-[#c4a850] flex items-center justify-center text-3xl font-serif mb-4 mx-auto">
                        {userData.name?.charAt(0) || 'U'}
                      </div>
                      <h2 className="text-xl font-medium text-[#e8e4df] text-center mb-1">{userData.name}</h2>
                      <p className="text-[#888888] text-sm text-center mb-6">{userData.company_name || 'Keine Firma'}</p>
                      
                      <div className="space-y-4 text-sm">
                        <div className="flex flex-col">
                          <span className="text-[#5e6680] text-xs uppercase tracking-wider">E-Mail</span>
                          <a href={`mailto:${userData.email}`} className="text-[#e8e4df] hover:text-[#c4a850]">{userData.email}</a>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[#5e6680] text-xs uppercase tracking-wider">Telefon</span>
                          <span className="text-[#e8e4df]">{userData.phone || '-'}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[#5e6680] text-xs uppercase tracking-wider">Paket</span>
                          <span className="text-[#c4a850] font-medium">{userData.selected_package || '-'}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[#5e6680] text-xs uppercase tracking-wider">Registriert am</span>
                          <span className="text-[#e8e4df]">{new Date(userData.created).toLocaleDateString('de-DE')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: PROJEKT */}
              {activeTab === 'projekt' && (
                <div className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl p-6 max-w-3xl">
                  <h3 className="text-xl font-serif text-[#e8e4df] mb-6">Projektdetails</h3>
                  {project ? (
                    <form onSubmit={handleUpdateProject} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm text-[#888888] mb-1">Projekttitel</label>
                          <input type="text" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm text-[#888888] mb-1">Nische / Branche</label>
                          <input type="text" value={projectForm.niche} onChange={e => setProjectForm({...projectForm, niche: e.target.value})} className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm text-[#888888] mb-1">Status</label>
                          <select value={projectForm.status} onChange={e => setProjectForm({...projectForm, status: e.target.value})} className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none">
                            <option value="planning">Planung</option>
                            <option value="design">Design</option>
                            <option value="development">Entwicklung</option>
                            <option value="review">Review</option>
                            <option value="launched">Live</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-[#888888] mb-1">Phase (1-5)</label>
                          <input type="number" min="1" max="5" value={projectForm.phase} onChange={e => setProjectForm({...projectForm, phase: parseInt(e.target.value)})} className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-[#888888] mb-1">Live URL</label>
                        <input type="url" value={projectForm.url} onChange={e => setProjectForm({...projectForm, url: e.target.value})} className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none" placeholder="https://" />
                      </div>
                      <div>
                        <label className="block text-sm text-[#888888] mb-1">Interne Notizen zum Projekt</label>
                        <textarea rows={4} value={projectForm.notes} onChange={e => setProjectForm({...projectForm, notes: e.target.value})} className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none resize-none" />
                      </div>
                      <div className="flex justify-end pt-4">
                        <button type="submit" disabled={isSavingProject} className="bg-[#c4a850] text-[#08080a] px-6 py-2 rounded-md font-medium hover:bg-[#d4bc6a] transition-colors disabled:opacity-50">
                          {isSavingProject ? 'Speichert...' : 'Projekt speichern'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-[#888888] mb-4">Dieser Kunde hat noch kein Projekt.</p>
                      <button className="bg-[#0d0d0f] border border-[#c4a850] text-[#c4a850] px-4 py-2 rounded-md text-sm hover:bg-[rgba(196,168,80,0.1)] transition-colors">
                        Projekt anlegen
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: REVISIONEN */}
              {activeTab === 'revisionen' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-serif text-[#e8e4df]">Revisionsanfragen</h3>
                    <button onClick={() => setIsPackageModalOpen(true)} className="flex items-center gap-2 bg-[#0d0d0f] border border-[#c4a850] text-[#c4a850] px-4 py-2 rounded-md text-sm hover:bg-[rgba(196,168,80,0.1)] transition-colors">
                      <Plus size={16} /> Paket zuweisen
                    </button>
                  </div>
                  
                  <div className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl overflow-hidden">
                    {revisions.length === 0 ? (
                      <div className="p-12 text-center text-[#888888]">Keine Revisionen vorhanden.</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-[#08080a] text-[#888888]">
                            <tr>
                              <th className="px-6 py-4 font-medium">Titel</th>
                              <th className="px-6 py-4 font-medium">Priorität</th>
                              <th className="px-6 py-4 font-medium">Status</th>
                              <th className="px-6 py-4 font-medium">Datum</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
                            {revisions.map(rev => (
                              <tr key={rev.id} onClick={() => navigate(`/dashboard/revisions/${rev.id}`)} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors cursor-pointer">
                                <td className="px-6 py-4 text-[#e8e4df] font-medium">{rev.title}</td>
                                <td className="px-6 py-4"><span className="px-2 py-1 rounded bg-[rgba(255,255,255,0.05)] text-xs">{rev.priority}</span></td>
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
                                <td className="px-6 py-4 text-[#888888]">{new Date(rev.created).toLocaleDateString('de-DE')}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB: DESIGN-REVIEWS */}
              {activeTab === 'design' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-serif text-[#e8e4df]">Design-Reviews</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {designReviews.length === 0 ? (
                      <div className="col-span-full p-12 text-center text-[#888888] bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl">Keine Design-Reviews vorhanden.</div>
                    ) : (
                      designReviews.map(review => (
                        <Link key={review.id} to={`/dashboard/reviews/${review.id}`} className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl p-5 hover:border-[#c4a850] transition-colors block group">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="text-[#e8e4df] font-medium group-hover:text-[#c4a850] transition-colors">{review.title}</h4>
                            <span className="text-xs text-[#888888]">v{review.version}</span>
                          </div>
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${
                            review.status === 'wartend' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                            review.status === 'genehmigt' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                            'bg-blue-500/10 text-blue-500 border-blue-500/20'
                          }`}>
                            {review.status.replace('_', ' ')}
                          </span>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB: FORMULARE */}
              {activeTab === 'formulare' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-serif text-[#e8e4df]">Zugewiesene Formulare</h3>
                  <div className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl overflow-hidden">
                    {forms.length === 0 ? (
                      <div className="p-12 text-center text-[#888888]">Keine Formulare zugewiesen.</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-[#08080a] text-[#888888]">
                            <tr>
                              <th className="px-6 py-4 font-medium">Formular</th>
                              <th className="px-6 py-4 font-medium">Status</th>
                              <th className="px-6 py-4 font-medium">Zuletzt bearbeitet</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
                            {forms.map(form => (
                              <tr key={form.id} onClick={() => navigate(`/dashboard/content-forms/${form.form_id}`)} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors cursor-pointer">
                                <td className="px-6 py-4 text-[#e8e4df] font-medium">{form.expand?.form_id?.title || 'Unbekanntes Formular'}</td>
                                <td className="px-6 py-4">
                                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                                    form.status === 'eingereicht' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                    form.status === 'geprüft' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                    'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                  }`}>
                                    {form.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-[#888888]">{new Date(form.updated).toLocaleDateString('de-DE')}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB: INHALTE */}
              {activeTab === 'inhalte' && (
                <div className="space-y-6 max-w-4xl">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-serif text-[#e8e4df]">Website-Inhalte</h3>
                  </div>
                  
                  {websiteContent.length === 0 ? (
                    <div className="p-12 text-center text-[#888888] bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl">
                      Der Kunde hat noch keine Inhalte angelegt.
                    </div>
                  ) : (
                    <>
                      <div className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl p-5 mb-6">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-[#888888]">Fortschritt</span>
                          <span className="text-[#c4a850] font-medium">
                            {websiteContent.filter(s => s.status === 'fertig' || s.status === 'geprüft').length} von {websiteContent.length} fertig
                          </span>
                        </div>
                        <div className="w-full h-2 bg-[#141210] rounded-full overflow-hidden border border-[rgba(255,255,255,0.05)]">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(websiteContent.filter(s => s.status === 'fertig' || s.status === 'geprüft').length / websiteContent.length) * 100}%` }}
                            className="h-full bg-gradient-to-r from-[#c4a850] to-[#d4a860]"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        {websiteContent.map(section => (
                          <ContentAccordion 
                            key={section.id} 
                            section={section} 
                            onMarkChecked={handleMarkContentChecked} 
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* TAB: DATEIEN */}
              {activeTab === 'dateien' && (
                <div className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl p-6">
                  <FilesPage specificUserId={userId} />
                </div>
              )}

              {/* TAB: NACHRICHTEN */}
              {activeTab === 'nachrichten' && (
                <div className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl flex flex-col h-[600px]">
                  <div className="p-4 border-b border-[rgba(255,255,255,0.05)] bg-[#08080a] rounded-t-xl">
                    <h3 className="font-medium text-[#e8e4df] flex items-center gap-2">
                      <MessageSquare size={18} className="text-[#c4a850]" /> Chat mit {userData.name}
                    </h3>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {messages.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-[#888888]">Noch keine Nachrichten.</div>
                    ) : (
                      messages.map(msg => {
                        const isAdminMsg = msg.senderId === currentUser.id;
                        return (
                          <div key={msg.id} className={`flex flex-col ${isAdminMsg ? 'items-end' : 'items-start'}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-[#a8b0c5]">{isAdminMsg ? 'Du (Admin)' : userData.name}</span>
                              <span className="text-[10px] text-[#5e6680]">{new Date(msg.created).toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                            <div className={`max-w-[80%] p-4 rounded-2xl ${
                              isAdminMsg 
                                ? 'bg-[#c4a850] text-[#08080a] rounded-tr-sm' 
                                : 'bg-[#08080a] border border-[rgba(255,255,255,0.1)] text-[#e8e4df] rounded-tl-sm'
                            }`}>
                              <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  
                  <div className="p-4 border-t border-[rgba(255,255,255,0.05)] bg-[#08080a] rounded-b-xl">
                    <form onSubmit={handleSendMessage} className="relative">
                      <input 
                        type="text" 
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder="Nachricht schreiben..." 
                        className="w-full bg-[#0d0d0f] border border-[rgba(255,255,255,0.1)] rounded-full py-3 pl-4 pr-12 text-sm text-[#e8e4df] focus:outline-none focus:border-[#c4a850]"
                      />
                      <button type="submit" disabled={!newMessage.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#c4a850] text-[#08080a] rounded-full flex items-center justify-center hover:bg-[#d4bc6a] disabled:opacity-50 transition-colors">
                        <Send size={14} className="ml-0.5" />
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB: NOTIZEN */}
              {activeTab === 'notizen' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    {notes.filter(n => n.pinned).map(note => (
                      <div key={note.id} className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-5 relative group">
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleTogglePinNote(note.id, note.pinned)} className="text-yellow-500 hover:text-yellow-400"><Pin size={16} className="fill-current" /></button>
                          <button onClick={() => handleDeleteNote(note.id)} className="text-[#888888] hover:text-red-400"><Trash2 size={16} /></button>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-yellow-500/20 text-yellow-500">{note.category}</span>
                          <span className="text-xs text-[#888888]">{new Date(note.created).toLocaleDateString('de-DE')}</span>
                        </div>
                        <p className="text-[#e8e4df] text-sm whitespace-pre-wrap">{note.content}</p>
                      </div>
                    ))}
                    
                    {notes.filter(n => !n.pinned).map(note => (
                      <div key={note.id} className="bg-[#0d0d0f] border border-[rgba(255,255,255,0.05)] rounded-xl p-5 relative group">
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleTogglePinNote(note.id, note.pinned)} className="text-[#888888] hover:text-yellow-500"><Pin size={16} /></button>
                          <button onClick={() => handleDeleteNote(note.id)} className="text-[#888888] hover:text-red-400"><Trash2 size={16} /></button>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[rgba(255,255,255,0.05)] text-[#a8b0c5]">{note.category}</span>
                          <span className="text-xs text-[#888888]">{new Date(note.created).toLocaleDateString('de-DE')}</span>
                        </div>
                        <p className="text-[#a8b0c5] text-sm whitespace-pre-wrap">{note.content}</p>
                      </div>
                    ))}
                    
                    {notes.length === 0 && (
                      <div className="p-12 text-center text-[#888888] bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl">Keine Notizen vorhanden.</div>
                    )}
                  </div>
                  
                  <div>
                    <form onSubmit={handleAddNote} className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl p-5 sticky top-24">
                      <h4 className="font-medium text-[#e8e4df] mb-4">Neue Notiz</h4>
                      <select 
                        value={newNote.category} 
                        onChange={e => setNewNote({...newNote, category: e.target.value})}
                        className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-md px-3 py-2 text-sm text-[#e8e4df] focus:outline-none focus:border-[#c4a850] mb-3"
                      >
                        <option value="allgemein">Allgemein</option>
                        <option value="projekt">Projekt</option>
                        <option value="rechnung">Rechnung</option>
                        <option value="wichtig">Wichtig</option>
                      </select>
                      <textarea 
                        value={newNote.content}
                        onChange={e => setNewNote({...newNote, content: e.target.value})}
                        placeholder="Notiz eingeben..."
                        rows={4}
                        className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-md px-3 py-2 text-sm text-[#e8e4df] focus:outline-none focus:border-[#c4a850] resize-none mb-4"
                      />
                      <button type="submit" disabled={!newNote.content.trim()} className="w-full bg-[#c4a850] text-[#08080a] py-2 rounded-md text-sm font-medium hover:bg-[#d4bc6a] disabled:opacity-50 transition-colors">
                        Hinzufügen
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB: RECHNUNGEN */}
              {activeTab === 'rechnungen' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-serif text-[#e8e4df]">Zahlungshistorie</h3>
                  <div className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl overflow-hidden">
                    {payments.length === 0 ? (
                      <div className="p-12 text-center text-[#888888]">Keine Zahlungen vorhanden.</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-[#08080a] text-[#888888]">
                            <tr>
                              <th className="px-6 py-4 font-medium">Datum</th>
                              <th className="px-6 py-4 font-medium">Betrag</th>
                              <th className="px-6 py-4 font-medium">Paket</th>
                              <th className="px-6 py-4 font-medium">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
                            {payments.map(p => (
                              <tr key={p.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                                <td className="px-6 py-4 text-[#e8e4df]">{new Date(p.created).toLocaleDateString('de-DE')}</td>
                                <td className="px-6 py-4 text-[#e8e4df]">{p.amount} €</td>
                                <td className="px-6 py-4 text-[#a8b0c5] capitalize">{p.packageId || '-'}</td>
                                <td className="px-6 py-4">
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                    p.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                                    p.status === 'failed' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                    'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                  }`}>
                                    {p.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Modals */}
        {isPackageModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-serif text-[#e8e4df]">Revisionspaket zuweisen</h2>
                <button onClick={() => setIsPackageModalOpen(false)} className="text-[#888888] hover:text-[#e8e4df]"><X size={20} /></button>
              </div>
              <form onSubmit={handleCreateRevisionPackage} className="space-y-4">
                <div>
                  <label className="block text-sm text-[#888888] mb-1">Paketname</label>
                  <input type="text" required value={packageForm.name} onChange={e => setPackageForm({...packageForm, name: e.target.value})} className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#888888] mb-1">Anzahl Revisionen</label>
                    <input type="number" min="1" required value={packageForm.count} onChange={e => setPackageForm({...packageForm, count: parseInt(e.target.value)})} className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-[#888888] mb-1">Preis (€)</label>
                    <input type="number" min="0" required value={packageForm.price} onChange={e => setPackageForm({...packageForm, price: parseFloat(e.target.value)})} className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-md px-4 py-2 text-[#e8e4df] focus:border-[#c4a850] focus:outline-none" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[rgba(255,255,255,0.05)]">
                  <button type="button" onClick={() => setIsPackageModalOpen(false)} className="px-4 py-2 text-[#888888] hover:text-[#e8e4df] transition-colors text-sm">Abbrechen</button>
                  <button type="submit" className="bg-[#c4a850] text-[#08080a] px-6 py-2 rounded-md text-sm font-medium hover:bg-[#d4bc6a] transition-colors">Zuweisen</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
