import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { api } from '@/lib/api';

export default function MessagesPage({ projectId }) {
  const { user } = useAuth();
  const activeProjectId = projectId || user?.id;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeProjectId) return;
    
    api.messages.getByProject(activeProjectId)
      .then(setMessages)
      .finally(() => setLoading(false));

    api.messages.subscribe((e) => {
      if (e.action === 'create' && e.record.projectId === activeProjectId) {
        setMessages(prev => [...prev, e.record]);
      }
    });

    return () => {
      api.messages.unsubscribe();
    };
  }, [activeProjectId]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    const content = newMessage;
    setNewMessage('');
    
    try {
      await api.messages.create({
        projectId: activeProjectId,
        senderId: user.id,
        content
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl h-[calc(100vh-200px)] flex flex-col">
      <h2 className="font-serif text-3xl text-[#edf0f7] mb-6">Nachrichten</h2>

      <div className="flex-1 overflow-y-auto space-y-6 mb-6 pr-2">
        {loading ? (
          <div className="text-[#a8b0c5]">Lade Nachrichten...</div>
        ) : messages.length === 0 ? (
          <div className="text-[#a8b0c5] text-center mt-10">Noch keine Nachrichten vorhanden.</div>
        ) : (
          messages.map(msg => {
            const isMe = msg.senderId === user.id;
            return (
              <div 
                key={msg.id} 
                className={`p-6 rounded-[16px] border ${
                  !isMe 
                    ? 'bg-[rgba(212,168,80,0.05)] border-[#d4a850]/20 ml-0 mr-12' 
                    : 'bg-[rgba(12,14,20,0.7)] border-[rgba(255,255,255,0.08)] ml-12 mr-0'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`font-medium ${!isMe ? 'text-[#d4a850]' : 'text-[#edf0f7]'}`}>
                    {isMe ? 'Du' : 'agensia Team'}
                  </div>
                  <div className="text-xs font-mono text-[#5e6680]">
                    {new Date(msg.created).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' })}
                  </div>
                </div>
                <p className="text-[#a8b0c5] whitespace-pre-wrap">{msg.content}</p>
              </div>
            );
          })
        )}
      </div>

      <div className="bg-[rgba(12,14,20,0.7)] border border-[rgba(255,255,255,0.1)] rounded-[16px] p-4 flex gap-4">
        <textarea 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Deine Nachricht..."
          className="flex-1 bg-transparent border-none resize-none text-[#edf0f7] focus:outline-none"
          rows={2}
        />
        <button 
          onClick={handleSend}
          className="self-end p-3 bg-[#d4a850] text-[#08090d] rounded-full hover:brightness-110 transition-all"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}