import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Trash2, Settings, MessageSquare, CheckSquare, CreditCard, Info } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient';
import { useAuth } from '@/contexts/AuthContext';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const data = await apiServerClient.fetch(`/notifications?user_id=${user.id}`).then(r => r.json());
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await apiServerClient.fetch(`/notifications/${id}/read`, { method: 'POST' });
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
    // In a real app, call delete endpoint
  };

  const getIcon = (category) => {
    switch (category) {
      case 'Messages': return <MessageSquare size={16} className="text-blue-400" />;
      case 'Tasks': return <CheckSquare size={16} className="text-green-400" />;
      case 'Payments': return <CreditCard size={16} className="text-yellow-400" />;
      default: return <Info size={16} className="text-gray-400" />;
    }
  };

  const filtered = notifications.filter(n => filter === 'All' || n.category === filter);

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-serif text-[#e8e4df] mb-2 flex items-center gap-3">
            <Bell className="text-[#c4a850]" /> Benachrichtigungen
          </h1>
          <p className="text-[#a8b0c5] font-sans text-sm">Bleibe auf dem Laufenden über deine Projekte.</p>
        </div>
        <button className="flex items-center gap-2 text-[#888888] hover:text-[#e8e4df] transition-colors text-sm">
          <Settings size={16} /> Einstellungen
        </button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['All', 'Messages', 'Tasks', 'Payments', 'System'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === cat ? 'bg-[#c4a850] text-[#0a0f0d]' : 'bg-[#141210] text-[#888888] hover:text-[#e8e4df] border border-[rgba(196,168,80,0.2)]'
            }`}
          >
            {cat === 'All' ? 'Alle' : cat}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-[#888888] p-4">Lade Benachrichtigungen...</div>
        ) : filtered.length === 0 ? (
          <div className="text-[#888888] p-8 text-center bg-[#141210] rounded-xl border border-[rgba(196,168,80,0.12)]">
            Keine Benachrichtigungen vorhanden.
          </div>
        ) : (
          filtered.map(notif => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border flex items-start gap-4 transition-colors ${
                notif.read ? 'bg-[#0a0f0d] border-[rgba(196,168,80,0.1)] opacity-70' : 'bg-[#141210] border-[rgba(196,168,80,0.3)] shadow-[0_0_15px_rgba(196,168,80,0.05)]'
              }`}
            >
              <div className="mt-1 p-2 bg-[#0a0f0d] rounded-full border border-[rgba(196,168,80,0.1)]">
                {getIcon(notif.category)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`font-medium text-sm ${notif.read ? 'text-[#a8b0c5]' : 'text-[#e8e4df]'}`}>{notif.title}</h4>
                  <span className="text-xs text-[#5e6680]">{new Date(notif.created || Date.now()).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-[#888888]">{notif.message}</p>
              </div>
              <div className="flex gap-2">
                {!notif.read && (
                  <button onClick={() => markAsRead(notif.id)} className="p-1.5 text-[#c4a850] hover:bg-[rgba(196,168,80,0.1)] rounded-md transition-colors" title="Als gelesen markieren">
                    <Check size={16} />
                  </button>
                )}
                <button onClick={() => deleteNotification(notif.id)} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-md transition-colors" title="Löschen">
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}