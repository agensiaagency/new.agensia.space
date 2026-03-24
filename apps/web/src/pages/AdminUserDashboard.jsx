import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { ArrowLeft } from 'lucide-react';
import MessagesPage from './MessagesPage';

export default function AdminUserDashboard() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.users.getOne(userId),
      api.tasks.getByProject(userId)
    ]).then(([u, t]) => {
      setUser(u);
      setTasks(t);
    }).catch(e => {
      console.error(e);
    }).finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div className="text-[#a8b0c5]">Lade Kundendaten...</div>;
  if (!user) return <div className="text-red-400">Kunde nicht gefunden.</div>;

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <div className="max-w-6xl space-y-8">
      <Link to="/dashboard/customers" className="inline-flex items-center gap-2 text-[#a8b0c5] hover:text-[#d4a850] transition-colors">
        <ArrowLeft size={20} /> Zurück zur Übersicht
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[rgba(12,14,20,0.7)] border border-[rgba(255,255,255,0.08)] rounded-[16px] p-6">
          <h3 className="text-xl font-serif text-[#edf0f7] mb-4">Kundenprofil</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-[#a8b0c5]">Name:</span> <span className="text-[#edf0f7]">{user.name || '-'}</span></div>
            <div className="flex justify-between"><span className="text-[#a8b0c5]">E-Mail:</span> <span className="text-[#edf0f7]">{user.email}</span></div>
            <div className="flex justify-between"><span className="text-[#a8b0c5]">Firma:</span> <span className="text-[#edf0f7]">{user.company_name || '-'}</span></div>
            <div className="flex justify-between"><span className="text-[#a8b0c5]">Paket:</span> <span className="text-[#edf0f7] capitalize">{user.selected_package || '-'}</span></div>
          </div>
        </div>

        <div className="bg-[rgba(12,14,20,0.7)] border border-[rgba(255,255,255,0.08)] rounded-[16px] p-6">
          <h3 className="text-xl font-serif text-[#edf0f7] mb-4">Aufgaben Fortschritt</h3>
          <div className="text-3xl font-mono text-[#d4a850] mb-2">{progress}%</div>
          <div className="text-[#a8b0c5] text-sm">{completedTasks} von {tasks.length} Aufgaben erledigt</div>
        </div>
      </div>

      <div className="bg-[rgba(12,14,20,0.7)] border border-[rgba(255,255,255,0.08)] rounded-[16px] p-6">
        <MessagesPage projectId={userId} />
      </div>
    </div>
  );
}