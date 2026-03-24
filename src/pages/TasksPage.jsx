import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext.jsx';

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    try {
      let fetchedTasks = await api.tasks.getByProject(user.id);
      
      if (fetchedTasks.length === 0) {
        const defaultTasks = [
          'Firmeninfos ausfüllen', 
          'Logo hochladen', 
          'Texte liefern', 
          'Farbwünsche angeben', 
          'Zielgruppe beschreiben'
        ];
        
        for (const title of defaultTasks) {
          await api.tasks.create({ projectId: user.id, title, status: 'open' });
        }
        fetchedTasks = await api.tasks.getByProject(user.id);
      }
      
      setTasks(fetchedTasks);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadTasks();
  }, [user]);

  const toggleTask = async (task) => {
    const newStatus = task.status === 'completed' ? 'open' : 'completed';
    
    // Optimistic update
    setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    
    try {
      await api.tasks.update(task.id, { status: newStatus });
    } catch (e) {
      // Revert on error
      setTasks(tasks.map(t => t.id === task.id ? { ...t, status: task.status } : t));
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl">
      <h2 className="font-serif text-3xl text-[#edf0f7] mb-2">Aufgaben</h2>
      <p className="text-[#a8b0c5] mb-8">Bitte erledige diese Aufgaben, damit wir mit deinem Projekt vorankommen.</p>

      {loading ? (
        <div className="text-[#a8b0c5]">Lade Aufgaben...</div>
      ) : (
        <div className="space-y-4">
          {tasks.map(task => (
            <div 
              key={task.id}
              onClick={() => toggleTask(task)}
              className={`
                flex items-center justify-between p-5 rounded-[12px] border cursor-pointer transition-all
                ${task.status === 'completed' 
                  ? 'bg-[rgba(12,14,20,0.3)] border-[rgba(255,255,255,0.05)] opacity-70' 
                  : 'bg-[rgba(12,14,20,0.7)] border-[rgba(255,255,255,0.1)] hover:border-[#d4a850]/50'
                }
              `}
            >
              <div className="flex items-center gap-4">
                {task.status === 'completed' ? (
                  <CheckCircle2 className="text-[#d4a850]" size={24} />
                ) : (
                  <Circle className="text-[#5e6680]" size={24} />
                )}
                <span className={`text-lg ${task.status === 'completed' ? 'text-[#a8b0c5] line-through' : 'text-[#edf0f7]'}`}>
                  {task.title}
                </span>
              </div>
              <div>
                {task.status === 'completed' ? (
                  <span className="px-3 py-1 bg-[#d4a850]/10 text-[#d4a850] text-xs rounded-full border border-[#d4a850]/20">
                    Erledigt
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-red-500/10 text-red-400 text-xs rounded-full border border-red-500/20">
                    Offen
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}