import React, { useState, useEffect, useRef } from 'react';
import { Bell, MessageSquare, CheckSquare, RefreshCw, CreditCard, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const getRelativeTime = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'gerade eben';
  if (min < 60) return `vor ${min} Min`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `vor ${hr} Std`;
  const days = Math.floor(hr / 24);
  return `vor ${days} Tag${days > 1 ? 'en' : ''}`;
};

const getNotificationIcon = (type) => {
  switch (type) {
    case 'message': return <MessageSquare size={16} className="text-[#3b82f6]" />;
    case 'task': return <CheckSquare size={16} className="text-[#10b981]" />;
    case 'status_update': return <RefreshCw size={16} className="text-[#c4a850]" />;
    case 'payment': return <CreditCard size={16} className="text-[#10b981]" />;
    case 'system':
    default: return <Bell size={16} className="text-[#c4a850]" />;
  }
};

export default function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    // Request browser notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const fetchInitialData = async () => {
      try {
        const notifs = await api.notifications.getNotifications(user.id);
        setNotifications(notifs.items || []);
        const count = await api.notifications.getUnreadCount(user.id);
        setUnreadCount(count);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchInitialData();

    let unsubscribe;
    const setupSubscription = async () => {
      try {
        unsubscribe = await api.notifications.subscribeToNotifications(user.id, (e) => {
          if (e.action === 'create') {
            const newNotif = e.record;
            setNotifications(prev => [newNotif, ...prev].slice(0, 10));
            setUnreadCount(prev => prev + 1);
            
            // Show browser notification
            if ('Notification' in window && Notification.permission === 'granted') {
              const browserNotif = new Notification(newNotif.title, {
                body: newNotif.content,
                icon: '/logo.png'
              });
              browserNotif.onclick = () => {
                window.focus();
                if (newNotif.link) navigate(newNotif.link);
              };
            }
            
            // Show toast
            toast({
              title: newNotif.title,
              description: newNotif.content,
              duration: 5000,
            });
          } else if (e.action === 'update') {
            setNotifications(prev => prev.map(n => n.id === e.record.id ? e.record : n));
            // Re-calculate unread count
            api.notifications.getUnreadCount(user.id).then(setUnreadCount);
          } else if (e.action === 'delete') {
            setNotifications(prev => prev.filter(n => n.id !== e.record.id));
            api.notifications.getUnreadCount(user.id).then(setUnreadCount);
          }
        });
      } catch (error) {
        console.error('Error subscribing to notifications:', error);
      }
    };

    setupSubscription();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, navigate, toast]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification) => {
    if (!notification.is_read) {
      try {
        await api.notifications.markNotificationRead(notification.id);
        setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
    
    setIsOpen(false);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const handleMarkAllAsRead = async (e) => {
    e.stopPropagation();
    if (unreadCount === 0) return;
    
    try {
      await api.notifications.markAllNotificationsRead(user.id);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
      toast({
        title: "Erledigt",
        description: "Alle Benachrichtigungen als gelesen markiert.",
      });
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[#a8b0c5] hover:text-[#c4a850] transition-all duration-300 hover:scale-105 focus:outline-none"
        aria-label="Benachrichtigungen"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-[0_0_8px_rgba(239,68,68,0.6)]">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-[350px] max-h-[500px] flex flex-col bg-[#0a0f0d] border border-[rgba(196,168,80,0.12)] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-[rgba(196,168,80,0.12)] flex justify-between items-center bg-[#141210]">
              <h3 className="font-serif text-lg text-[#e8e4df]">Benachrichtigungen</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-[#c4a850] hover:text-[#e8e4df] flex items-center gap-1 transition-colors"
                >
                  <Check size={14} /> Alle gelesen
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-[#888888] font-sans text-sm">
                  Keine neuen Benachrichtigungen.
                </div>
              ) : (
                <div className="flex flex-col">
                  {notifications.map((notif) => (
                    <button
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`w-full text-left p-4 border-b border-[rgba(196,168,80,0.05)] flex items-start gap-3 transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(196,168,80,0.05)] ${
                        !notif.is_read ? 'bg-[rgba(196,168,80,0.1)]' : 'bg-transparent hover:bg-[rgba(255,255,255,0.02)]'
                      }`}
                    >
                      <div className="mt-1 p-2 bg-[#141210] rounded-full border border-[rgba(196,168,80,0.1)] shrink-0">
                        {getNotificationIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`font-serif text-base truncate pr-2 ${!notif.is_read ? 'text-[#e8e4df] font-medium' : 'text-[#a8b0c5]'}`}>
                            {notif.title}
                          </h4>
                        </div>
                        {notif.content && (
                          <p className="text-sm text-[#888888] font-sans line-clamp-2 mb-1">
                            {notif.content}
                          </p>
                        )}
                        <span className="text-[10px] text-[#5e6680] font-sans">
                          {getRelativeTime(notif.created)}
                        </span>
                      </div>
                      {!notif.is_read && (
                        <div className="w-2 h-2 rounded-full bg-[#c4a850] shrink-0 mt-2 shadow-[0_0_5px_rgba(196,168,80,0.5)]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-[rgba(196,168,80,0.12)] bg-[#141210] text-center">
              <button 
                onClick={() => {
                  setIsOpen(false);
                  navigate('/dashboard/notifications');
                }}
                className="text-sm font-sans text-[#888888] hover:text-[#c4a850] transition-colors"
              >
                Alle Benachrichtigungen ansehen &rarr;
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}