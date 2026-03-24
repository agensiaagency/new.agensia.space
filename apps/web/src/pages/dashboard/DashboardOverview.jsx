
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useOutletContext, Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import { api } from '@/lib/api.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { 
  MessageSquare, CreditCard, FileText, 
  CheckCircle, Circle, MessageCircle, Send,
  Users, AlertCircle, DollarSign, Settings, GitPullRequest,
  Globe, History, Plus, Zap, ArrowRight
} from 'lucide-react';
import { categories } from '@/lib/categories.js';
import LoadingSpinner from '@/components/LoadingSpinner.jsx';
import DashboardHeader from '@/components/dashboard/DashboardHeader.jsx';
import OnboardingWizard from '@/components/OnboardingWizard.jsx';
import PaymentModal from '@/components/dashboard/PaymentModal.jsx';

export default function DashboardOverview() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { setSidebarOpen } = useOutletContext() || {};
  
  // User States
  const [project, setProject] = useState(null);
  const [intakes, setIntakes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({ unread: 0, files: 0, forms: 0 });
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [hasProjects, setHasProjects] = useState(false);
  
  // Admin States
  const [adminStats, setAdminStats] = useState({ totalCustomers: 0, openRevisions: 0, unreadMessages: 0, revenue: 0 });
  const [recentRevisions, setRecentRevisions] = useState([]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    if (isAdmin) {
      fetchAdminData();
    } else {
      fetchUserData();
    }
  }, [user, isAdmin]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [users, revs, msgs, payments] = await Promise.all([
        api.users.getAll(),
        api.revisions.getAll(),
        pb.collection('messages').getFullList({ $autoCancel: false }),
        pb.collection('payments').getFullList({ filter: 'status="completed"', $autoCancel: false })
      ]);

      const customerCount = users.filter(u => u.role === 'user').length;
      const openRevs = revs.filter(r => r.status === 'offen' || r.status === 'in_bearbeitung');
      const unread = msgs.filter(m => m.senderId !== user.id && !m.read).length;
      const revenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

      setAdminStats({
        totalCustomers: customerCount,
        openRevisions: openRevs.length,
        unreadMessages: unread,
        revenue: revenue
      });

      setRecentRevisions(openRevs.slice(0, 5));
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userIntakes = await api.intake_submissions.getByUser(user.id);
      const projects = await api.projects.getProject(user.id);
      
      setIntakes(userIntakes || []);
      
      if (user.onboarding_completed === false) {
        setShowOnboarding(true);
      }

      if (!projects) {
        setHasProjects(false);
        setLoading(false);
        return;
      }

      setHasProjects(true);
      setProject(projects);

      const userTasks = await api.tasks.getByProject(projects.id);
      if (userTasks && userTasks.length > 0) {
        setTasks(userTasks);
      } else {
        setTasks([
          { id: 1, title: 'Briefing ausfüllen', description: 'Alle Details zum Projekt angeben', completed: true },
          { id: 2, title: 'Inhalte hochladen', description: 'Texte und Bilder in der Cloud ablegen', completed: false },
          { id: 3, title: 'Design freigeben', description: 'Ersten Entwurf prüfen und Feedback geben', completed: false }
        ]);
      }

      const userMessages = await api.messages.getByProject(projects.id);
      if (userMessages && userMessages.length > 0) {
        setMessages(userMessages.slice(0, 3));
      } else {
        setMessages([
          { id: 1, sender: 'agensia Team', content: 'Willkommen! Wir haben dein Briefing erhalten.', date: new Date().toISOString(), unread: true }
        ]);
      }

      const unreadCount = await api.messages.getUnreadMessageCount();
      const userFiles = await api.files.getByUser(user.id);
      
      setStats({ 
        unread: unreadCount || 0, 
        files: userFiles?.length || 0, 
        forms: userIntakes?.length || 0 
      });

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const newStatus = task.completed ? 'open' : 'completed';
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed, status: newStatus } : t));
    try {
      if (typeof id === 'string') await api.tasks.updateStatus(id, newStatus);
    } catch (e) {
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: task.completed, status: task.status } : t));
    }
  };

  if (loading) return <LoadingSpinner />;

  // ADMIN VIEW
  if (isAdmin) {
    return (
      <div className="p-8 space-y-8 bg-[#08080a] max-w-full overflow-x-hidden pb-20">
        <DashboardHeader onMenuClick={() => setSidebarOpen?.(true)} />
        
        <div>
          <h1 className="text-3xl font-serif text-[#e8e4df] mb-2">Admin Dashboard</h1>
          <p className="text-[#888888]">Willkommen zurück. Hier ist der aktuelle Status der Plattform.</p>
        </div>

        {/* Admin Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Gesamtkunden', value: adminStats.totalCustomers, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
            { label: 'Offene Revisionen', value: adminStats.openRevisions, icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-400/10' },
            { label: 'Ungelesene Nachrichten', value: adminStats.unreadMessages, icon: MessageSquare, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
            { label: 'Umsatz', value: `${adminStats.revenue} €`, icon: DollarSign, color: 'text-green-400', bg: 'bg-green-400/10' }
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl p-6 flex items-center justify-between">
              <div>
                <p className="text-[#888888] text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-serif text-[#e8e4df]">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Revisions */}
          <div className="lg:col-span-2 bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-serif text-[#e8e4df] flex items-center gap-2">
                <GitPullRequest size={20} className="text-[#c4a850]" /> Offene Revisionen
              </h3>
              <Link to="/dashboard/admin-revisions" className="text-sm text-[#c4a850] hover:underline">Alle anzeigen &rarr;</Link>
            </div>
            <div className="space-y-3">
              {recentRevisions.length === 0 ? (
                <p className="text-[#888888] text-sm py-4">Keine offenen Revisionen.</p>
              ) : (
                recentRevisions.map((rev, i) => (
                  <motion.div key={rev.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <Link to={`/dashboard/revisions/${rev.id}`} className="flex items-center justify-between p-4 rounded-lg bg-[#08080a] border border-[rgba(255,255,255,0.05)] hover:border-[#c4a850]/50 transition-colors group">
                      <div>
                        <h4 className="text-[#e8e4df] font-medium text-sm group-hover:text-[#c4a850] transition-colors">{rev.title}</h4>
                        <p className="text-[#888888] text-xs mt-1">{rev.expand?.user_id?.name || 'Unbekannter Kunde'}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          rev.priority === 'hoch' || rev.priority === 'dringend' ? 'bg-red-500/10 text-red-500' :
                          rev.priority === 'mittel' ? 'bg-blue-500/10 text-blue-500' :
                          'bg-[rgba(255,255,255,0.05)] text-[#888888]'
                        }`}>
                          {rev.priority}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          rev.status === 'offen' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                        }`}>
                          {rev.status}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl p-6">
            <h3 className="text-xl font-serif text-[#e8e4df] mb-6">Quick Access</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Kunden', icon: Users, path: '/dashboard/customers' },
                { label: 'Revisionen', icon: GitPullRequest, path: '/dashboard/admin-revisions' },
                { label: 'Nachrichten', icon: MessageSquare, path: '/dashboard/messages' },
                { label: 'Einstellungen', icon: Settings, path: '/dashboard/settings' }
              ].map((action, i) => (
                <Link key={i} to={action.path} className="flex flex-col items-center justify-center p-4 rounded-lg bg-[#08080a] border border-[rgba(255,255,255,0.05)] hover:border-[#c4a850] hover:bg-[rgba(196,168,80,0.05)] transition-all text-center group">
                  <action.icon size={24} className="text-[#888888] group-hover:text-[#c4a850] mb-2 transition-colors" />
                  <span className="text-xs font-medium text-[#e8e4df]">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // USER VIEW
  const getCategoryColor = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.color : '#c4a850';
  };

  const projectColor = project ? getCategoryColor(project.niche || project.industry) : '#c4a850';
  const steps = ['Briefing', 'Design', 'Entwicklung', 'Review', 'Live'];
  const currentStepIndex = project?.status === 'In Bearbeitung' || project?.status === 'design' ? 1 : project?.status === 'Bezahlt' ? 0 : 0;

  const hostingStatus = user?.hosting_status || 'inactive';
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'active': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'payment_failed': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'cancelled': return 'bg-[rgba(255,255,255,0.05)] text-[#888888] border-[rgba(255,255,255,0.1)]';
      default: return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    }
  };

  return (
    <div className="p-8 space-y-8 bg-[#08080a] max-w-full overflow-x-hidden pb-20">
      <DashboardHeader onMenuClick={() => setSidebarOpen?.(true)} />

      {showOnboarding && <OnboardingWizard onComplete={handleOnboardingComplete} />}
      <PaymentModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} currentPackage={user?.selected_package} />

      {/* Package Info Card (if user has selected a package but hasn't paid/started yet) */}
      {user?.selected_package && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#141210] border border-[rgba(196,168,80,0.12)] rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[rgba(196,168,80,0.1)] flex items-center justify-center text-[#c4a850] shrink-0">
              <CreditCard size={24} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-serif text-[#e8e4df] capitalize">Paket: {user.selected_package}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                  Nicht bezahlt
                </span>
              </div>
              <p className="text-sm text-[#888888]">
                {user.monthly_price ? `€${user.monthly_price} / Monat` : 'Preis auf Anfrage'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowPaymentModal(true)}
            className="w-full md:w-auto px-6 py-2.5 bg-[#c4a850] text-[#0a0f0d] rounded-lg text-sm font-medium hover:bg-[#d4bc6a] transition-colors shrink-0"
          >
            Jetzt bezahlen
          </button>
        </motion.div>
      )}

      {!hasProjects ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0d0d0f] rounded-2xl p-8 md:p-12 border border-[rgba(196,168,80,0.12)]"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-[rgba(196,168,80,0.1)] flex items-center justify-center text-[#c4a850]">
              <Zap size={24} />
            </div>
            <h2 className="text-3xl font-serif text-[#e8e4df]">Willkommen bei agensia!</h2>
          </div>
          <p className="text-[#a8b0c5] mb-8 max-w-2xl leading-relaxed">
            Schön, dass du da bist. Um dein Projekt erfolgreich zu starten, benötigen wir noch ein paar Informationen von dir. Fülle das Briefing aus oder lade direkt deine Website-Inhalte hoch.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-12">
            <button 
              onClick={() => navigate('/dashboard/briefing')} 
              className="bg-[#c4a850] text-[#0a0f0d] px-6 py-3 rounded-lg font-medium hover:bg-[#d4bc6a] transition-colors flex items-center gap-2"
            >
              Briefing starten <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => navigate('/dashboard/website-content')} 
              className="bg-transparent border border-[#c4a850] text-[#c4a850] px-6 py-3 rounded-lg font-medium hover:bg-[rgba(196,168,80,0.1)] transition-colors"
            >
              Website-Inhalte eingeben
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: '1. Briefing ausfüllen', desc: 'Teile uns deine Wünsche und Ziele für die neue Website mit.' },
              { title: '2. Inhalte hochladen', desc: 'Lade Texte, Bilder und dein Logo bequem über das Dashboard hoch.' },
              { title: '3. Website online', desc: 'Wir setzen dein Projekt um und bringen deine Website live.' }
            ].map((tip, i) => (
              <div key={i} className="bg-[#141210] p-6 rounded-xl border border-[rgba(255,255,255,0.05)]">
                <h4 className="text-[#e8e4df] font-medium mb-2">{tip.title}</h4>
                <p className="text-sm text-[#888888]">{tip.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        <>
          {/* Website-Fortschritt Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl p-6 md:p-8 relative overflow-hidden"
          >
            <div className="absolute left-0 top-0 bottom-0 w-[4px]" style={{ backgroundColor: projectColor }} />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-serif text-[#e8e4df] mb-2">
                  {project?.company_name || project?.title || 'Dein Website-Projekt'}
                </h2>
                <p className="text-[#a8b0c5] font-sans text-sm">
                  Status: <span className="text-[#c4a850] font-medium capitalize">{project?.status || 'Neu'}</span>
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-serif text-[#e8e4df]">{(currentStepIndex / (steps.length - 1) * 100).toFixed(0)}%</div>
                <div className="text-xs text-[#888888]">Abgeschlossen</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-[#08080a] rounded-full overflow-hidden mb-8 border border-[rgba(255,255,255,0.05)]">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-[#c4a850]"
              />
            </div>

            <div className="relative pt-2 pb-2">
              <div className="hidden md:block absolute top-6 left-0 right-0 h-[2px] bg-[rgba(196,168,80,0.1)] z-0" />
              <div className="md:hidden absolute top-0 bottom-0 left-[15px] w-[2px] bg-[rgba(196,168,80,0.1)] z-0" />
              <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8 md:gap-4 lg:gap-6">
                {steps.map((step, index) => {
                  const isCompleted = index < currentStepIndex;
                  const isActive = index === currentStepIndex;
                  return (
                    <div key={step} className="flex flex-row md:flex-col items-center gap-4 md:gap-3 md:flex-1">
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center relative shrink-0 ${isCompleted ? 'bg-[#0d0d0f] border-2' : isActive ? 'bg-[#c4a850]' : 'bg-[#0d0d0f] border-2 border-[rgba(196,168,80,0.2)]'}`} style={{ borderColor: isCompleted ? projectColor : undefined }}>
                        {isCompleted && <CheckCircle size={20} color={projectColor} />}
                        {isActive && <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 rounded-full bg-[#c4a850]" />}
                      </div>
                      <span className={`font-sans text-sm md:text-base md:text-center ${isActive ? 'text-[#c4a850] font-medium' : isCompleted ? 'text-[#e8e4df]' : 'text-[#5e6680]'}`}>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Abo Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
          >
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-full bg-[rgba(196,168,80,0.1)] flex items-center justify-center text-[#c4a850] shrink-0">
                <CreditCard size={24} />
              </div>
              <div className="w-full">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-serif text-[#e8e4df]">Abonnement & Paket</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(hostingStatus)}`}>
                    {hostingStatus.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-x-8 gap-y-4 mt-4">
                  <div>
                    <p className="text-xs text-[#888888] mb-0.5">Aktuelles Paket</p>
                    <p className="text-sm text-[#e8e4df] font-medium capitalize">{user?.selected_package || 'Keines'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#888888] mb-0.5">Preis</p>
                    <p className="text-sm text-[#e8e4df]">
                      {user?.base_price ? `€${user.base_price}` : '-'} <span className="text-[#c4a850]">+ €{user?.monthly_price || '-'}/Mo</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#888888] mb-0.5">Laufzeit</p>
                    <p className="text-sm text-[#e8e4df]">
                      {user?.selected_term === '1J' ? '1 Jahr' : user?.selected_term === '2J' ? '2 Jahre' : user?.selected_term === '3J' ? '3 Jahre' : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#888888] mb-0.5">Domain</p>
                    <p className="text-sm text-[#e8e4df]">{user?.domain || 'Keine'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setShowPaymentModal(true)}
              className="w-full md:w-auto px-6 py-2.5 bg-[#0d0d0f] border border-[#c4a850] text-[#c4a850] rounded-lg text-sm font-medium hover:bg-[rgba(196,168,80,0.1)] transition-colors shrink-0"
            >
              Paket ändern
            </button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Tasks */}
            <section className="bg-[#0d0d0f]/90 backdrop-blur-sm border border-[rgba(196,168,80,0.12)] rounded-xl p-4 md:p-6 lg:p-8">
              <h3 className="text-xl md:text-2xl font-serif text-[#e8e4df] mb-4 md:mb-6 flex items-center gap-3">
                <CheckCircle size={24} className="text-[#c4a850]" /> Deine Aufgaben
              </h3>
              <div className="space-y-4">
                {tasks.map(task => (
                  <div key={task.id} onClick={() => toggleTask(task.id)} className={`flex items-start gap-4 p-4 md:p-5 rounded-lg border cursor-pointer transition-all duration-200 min-h-[44px] ${task.completed || task.status === 'completed' ? 'bg-[rgba(196,168,80,0.02)] border-[rgba(196,168,80,0.1)] opacity-60' : 'bg-[#08080a] border-[rgba(196,168,80,0.2)] hover:border-[#c4a850]'}`}>
                    <div className="mt-0.5 shrink-0">
                      {task.completed || task.status === 'completed' ? <CheckCircle size={20} className="text-green-500" /> : <Circle size={20} className="text-[#c4a850]" />}
                    </div>
                    <div>
                      <h4 className={`font-sans font-medium text-sm md:text-base mb-1 ${task.completed || task.status === 'completed' ? 'text-[#a8b0c5] line-through' : 'text-[#e8e4df]'}`}>{task.title}</h4>
                      <p className="font-sans text-xs md:text-sm text-[#888888]">{task.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Messages */}
            <section className="bg-[#0d0d0f]/90 backdrop-blur-sm border border-[rgba(196,168,80,0.12)] rounded-xl p-4 md:p-6 lg:p-8 flex flex-col">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h3 className="text-xl md:text-2xl font-serif text-[#e8e4df] flex items-center gap-3">
                  <MessageCircle size={24} className="text-[#c4a850]" /> Von agensia
                  {stats.unread > 0 && <span className="bg-[#c4a850] text-[#08080a] text-xs font-bold px-2.5 py-0.5 rounded-full ml-2">{stats.unread} neu</span>}
                </h3>
                <button onClick={() => navigate('/dashboard/messages')} className="text-[#c4a850] text-sm md:text-base font-sans hover:underline min-h-[44px] px-2">Alle ansehen &rarr;</button>
              </div>
              <div className="space-y-4 flex-1">
                {messages.map(msg => (
                  <div key={msg.id} className={`p-4 rounded-lg border ${msg.unread || !msg.read ? 'bg-[rgba(196,168,80,0.05)] border-[#c4a850]/30' : 'bg-[#08080a] border-[rgba(196,168,80,0.1)]'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-sans text-sm font-medium text-[#c4a850]">{msg.sender || 'agensia Team'}</span>
                      <span className="font-sans text-xs text-[#5e6680]">{new Date(msg.date || msg.created).toLocaleDateString('de-DE')}</span>
                    </div>
                    <p className="font-sans text-sm md:text-base text-[#e8e4df] line-clamp-2">{msg.content}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-[rgba(196,168,80,0.1)]">
                <div className="relative">
                  <input type="text" placeholder="Schnelle Antwort..." className="w-full bg-[#08080a] border border-[rgba(196,168,80,0.2)] rounded-lg py-3 pl-4 pr-12 text-sm md:text-base text-[#e8e4df] focus:outline-none focus:border-[#c4a850] font-sans min-h-[44px]" onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      api.messages.sendMessage({ content: e.target.value.trim(), projectId: project.id, senderId: user.id, read: false });
                      e.target.value = '';
                      navigate('/dashboard/messages');
                    }
                  }} />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 text-[#c4a850] hover:brightness-125 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"><Send size={20} /></button>
                </div>
              </div>
            </section>
          </div>

          {/* Quick Access Grid */}
          <section className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
            {[
              { title: 'Dateien', icon: FileText, path: '/dashboard/files' },
              { title: 'Nachrichten', icon: MessageSquare, path: '/dashboard/messages' },
              { title: 'Abo & Rechnungen', icon: CreditCard, action: () => setShowPaymentModal(true) },
              { title: 'Hosting-Logs', icon: History, path: '/dashboard/hosting-logs' },
              { title: 'Einstellungen', icon: Settings, path: '/dashboard/profile' }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(196,168,80,0.15)' }} 
                onClick={item.action ? item.action : () => navigate(item.path)} 
                className="bg-[#0d0d0f]/90 backdrop-blur-sm border border-[rgba(196,168,80,0.12)] rounded-xl p-6 cursor-pointer transition-colors hover:border-[#c4a850]/50 flex flex-col items-center text-center group min-h-[120px] justify-center"
              >
                <item.icon size={24} className="text-[#c4a850] mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-sans font-medium text-sm md:text-base text-[#e8e4df]">{item.title}</h4>
              </motion.div>
            ))}
          </section>
        </>
      )}
    </div>
  );
}
