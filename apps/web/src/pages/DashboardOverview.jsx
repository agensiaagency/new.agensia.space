import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext.jsx';

export default function DashboardOverview() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.tasks.getByProject(user.id)
        .then(setTasks)
        .finally(() => setLoading(false));
    }
  }, [user]);

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const timelineSteps = [
    { title: 'Briefing', status: progress > 0 ? 'completed' : 'current' },
    { title: 'Design', status: progress === 100 ? 'current' : 'pending' },
    { title: 'Entwicklung', status: 'pending' },
    { title: 'Review', status: 'pending' },
    { title: 'Launch', status: 'pending' }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Package Card */}
        <div className="bg-[rgba(12,14,20,0.55)] border border-[rgba(255,255,255,0.06)] rounded-[20px] p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-serif text-xl text-[#edf0f7]">Dein Paket</h3>
            <span className="px-3 py-1 bg-[#f59e0b]/20 text-[#f59e0b] text-xs rounded-full border border-[#f59e0b]/30">
              Aktiv
            </span>
          </div>
          <div className="text-3xl font-mono text-[#f59e0b] mb-1 capitalize">{user?.selected_package || 'Professional'}</div>
          <div className="text-[#a8b0c5] mb-6">
            {user?.selected_package === 'starter' ? '€490' : user?.selected_package === 'premium' ? '€1999' : '€999'}
          </div>
          <button 
            onClick={() => navigate('/dashboard/payment')}
            className="w-full py-2 border border-[rgba(255,255,255,0.1)] text-[#edf0f7] rounded-md hover:bg-[rgba(255,255,255,0.05)] transition-colors text-sm"
          >
            Zahlungen ansehen
          </button>
        </div>

        {/* Next Steps Card */}
        <div className="lg:col-span-2 bg-[rgba(12,14,20,0.55)] border border-[rgba(255,255,255,0.06)] rounded-[20px] p-6 flex flex-col justify-center">
          <h3 className="font-serif text-xl text-[#edf0f7] mb-3">Nächste Schritte</h3>
          {loading ? (
            <p className="text-[#a8b0c5] mb-6">Lade Aufgaben...</p>
          ) : (
            <>
              <p className="text-[#a8b0c5] mb-4 leading-relaxed">
                Du hast {completedTasks} von {tasks.length} Aufgaben erledigt. 
                {progress < 100 
                  ? ' Bitte schließe die restlichen Aufgaben ab, damit wir mit dem Design beginnen können.' 
                  : ' Super! Wir haben alle Infos und beginnen nun mit dem ersten Design-Entwurf.'}
              </p>
              <div className="w-full bg-[rgba(255,255,255,0.1)] rounded-full h-2 mb-6">
                <div className="bg-[#f59e0b] h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
              </div>
              <button 
                onClick={() => navigate('/dashboard/tasks')}
                className="self-start px-6 py-2 bg-[#f59e0b] text-[#08090d] rounded-md font-medium hover:brightness-110 transition-all"
              >
                Zu den Aufgaben
              </button>
            </>
          )}
        </div>
      </div>

      {/* Project Progress */}
      <div className="bg-[rgba(12,14,20,0.55)] border border-[rgba(255,255,255,0.06)] rounded-[20px] p-8">
        <h3 className="font-serif text-2xl text-[#edf0f7] mb-8">Projektfortschritt</h3>
        
        <div className="relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[rgba(255,255,255,0.1)] -translate-y-1/2 hidden md:block" />
          
          <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
            {timelineSteps.map((step, index) => (
              <div key={index} className="flex flex-row md:flex-col items-center gap-4 md:gap-3">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center bg-[#08090d]
                  ${step.status === 'completed' ? 'text-[#f59e0b] border-2 border-[#f59e0b]' : ''}
                  ${step.status === 'current' ? 'text-[#f59e0b] border-2 border-[#f59e0b] shadow-[0_0_15px_rgba(245,158,11,0.4)]' : ''}
                  ${step.status === 'pending' ? 'text-[#5e6680] border-2 border-[rgba(255,255,255,0.1)]' : ''}
                `}>
                  {step.status === 'completed' && <CheckCircle2 size={20} />}
                  {step.status === 'current' && <Clock size={20} />}
                  {step.status === 'pending' && <Circle size={20} />}
                </div>
                <div className={`font-medium ${step.status === 'pending' ? 'text-[#5e6680]' : 'text-[#edf0f7]'}`}>
                  {step.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}