import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import pb from '@/lib/pocketbaseClient.js';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Send, ArrowLeft, MessageCircle, Paperclip, Search, Check, CheckCheck } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner.jsx';

export default function MessagesPage() {
  const { user, isAdmin } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMobileListVisible, setIsMobileListVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    
    pb.collection('messages').subscribe('*', (e) => {
      if (e.action === 'create') {
        const msg = e.record;
        if (activeConv && (msg.senderId === activeConv.id || msg.projectId === activeConv.id || (!isAdmin && msg.senderId !== user.id))) {
          setMessages(prev => [...prev, msg]);
          scrollToBottom();
        }
        fetchConversations();
      }
    });

    return () => pb.collection('messages').unsubscribe('*');
  }, [activeConv, isAdmin, user.id]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      if (isAdmin) {
        const users = await pb.collection('users').getFullList({ filter: 'role = "user"', $autoCancel: false });
        const allMsgs = await pb.collection('messages').getFullList({ sort: '-created', $autoCancel: false });
        
        const convs = users.map(u => {
          const userMsgs = allMsgs.filter(m => m.senderId === u.id || m.projectId === u.id);
          const lastMsg = userMsgs[0];
          const unreadCount = userMsgs.filter(m => m.senderId === u.id && !m.read).length;
          return {
            id: u.id, name: u.name || u.email, lastMessage: lastMsg ? lastMsg.content : 'Keine Nachrichten',
            timestamp: lastMsg ? lastMsg.created : u.created, unread: unreadCount
          };
        }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setConversations(convs);
      } else {
        const allMsgs = await pb.collection('messages').getFullList({ filter: `senderId = "${user.id}" || projectId = "${user.id}"`, sort: '-created', $autoCancel: false });
        const lastMsg = allMsgs[0];
        const unreadCount = allMsgs.filter(m => m.senderId !== user.id && !m.read).length;
        setConversations([{
          id: 'admin', name: 'agensia Team', lastMessage: lastMsg ? lastMsg.content : 'Starte eine Unterhaltung...',
          timestamp: lastMsg ? lastMsg.created : new Date().toISOString(), unread: unreadCount
        }]);
      }
    } catch (error) { 
      console.error(error); 
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (convId) => {
    try {
      let filter = isAdmin ? `senderId = "${convId}" || projectId = "${convId}"` : `senderId = "${user.id}" || projectId = "${user.id}"`;
      if (isAdmin) await api.messages.markMessagesRead(convId);
      else await api.messages.markMessagesRead('admin');
      
      const msgs = await pb.collection('messages').getFullList({ filter, sort: 'created', $autoCancel: false });
      setMessages(msgs);
      scrollToBottom();
      fetchConversations();
    } catch (error) { console.error(error); }
  };

  const handleSelectConversation = (conv) => {
    setActiveConv(conv);
    setIsMobileListVisible(false);
    loadMessages(conv.id);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await pb.collection('messages').create({
        content: newMessage.trim(), senderId: user.id, projectId: isAdmin ? activeConv.id : user.id, read: false
      }, { $autoCancel: false });
      setNewMessage('');
      scrollToBottom();
    } catch (error) { console.error(error); }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

  const filteredMessages = messages.filter(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading && conversations.length === 0) return <LoadingSpinner />;

  return (
    <div className="h-[calc(100vh-120px)] md:h-[calc(100vh-160px)] bg-[#0a0f0d] flex border border-[rgba(196,168,80,0.12)] rounded-xl overflow-hidden relative w-full">
      
      {/* Sidebar List */}
      <div className={`
        w-full md:w-[320px] lg:w-[380px] flex-shrink-0 border-r border-[rgba(196,168,80,0.12)] bg-[#141210] flex flex-col 
        absolute md:relative z-20 h-full transition-transform duration-300 ease-in-out
        ${isMobileListVisible ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-4 md:p-6 border-b border-[rgba(196,168,80,0.12)]">
          <h2 className="font-serif text-2xl md:text-3xl text-[#e8e4df] mb-4">Nachrichten</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" size={18} />
            <input type="text" placeholder="Suchen..." className="w-full bg-[#0a0f0d] border border-[rgba(196,168,80,0.2)] rounded-lg py-2.5 pl-10 pr-4 text-sm md:text-base text-[#e8e4df] focus:outline-none focus:border-[#c4a850] min-h-[44px]" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map(conv => (
            <div key={conv.id} onClick={() => handleSelectConversation(conv)} className={`p-4 md:p-5 border-b border-[rgba(196,168,80,0.05)] cursor-pointer transition-colors ${activeConv?.id === conv.id ? 'bg-[rgba(196,168,80,0.1)]' : 'hover:bg-[rgba(255,255,255,0.02)]'}`}>
              <div className="flex justify-between items-start mb-1.5">
                <h3 className="font-sans font-medium text-sm md:text-base text-[#e8e4df] truncate pr-2">{conv.name}</h3>
                <span className="text-xs text-[#888888] whitespace-nowrap">{new Date(conv.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs md:text-sm text-[#a8b0c5] truncate pr-2">{conv.lastMessage}</p>
                {conv.unread > 0 && <span className="bg-[#c4a850] text-[#0a0f0d] text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full">{conv.unread}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-[#0a0f0d] h-full w-full absolute md:relative z-10">
        {activeConv ? (
          <>
            <div className="p-4 md:p-6 border-b border-[rgba(196,168,80,0.12)] bg-[#141210] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  className="md:hidden p-2 -ml-2 text-[#a8b0c5] hover:text-[#c4a850] min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors" 
                  onClick={() => setIsMobileListVisible(true)}
                  aria-label="Zurück zur Liste"
                >
                  <ArrowLeft size={24} />
                </button>
                <div>
                  <h2 className="font-serif text-xl md:text-2xl text-[#e8e4df]">{activeConv.name}</h2>
                  <p className="text-xs md:text-sm text-[#c4a850]">Online</p>
                </div>
              </div>
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" size={16} />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Im Chat suchen..." className="bg-[#0a0f0d] border border-[rgba(196,168,80,0.2)] rounded-md py-2 pl-9 pr-3 text-sm text-[#e8e4df] focus:outline-none focus:border-[#c4a850] w-40 md:w-56 min-h-[44px]" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
              {filteredMessages.map((msg) => {
                const isOwn = msg.senderId === user.id;
                return (
                  <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}>
                    <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 md:px-5 py-3 relative ${isOwn ? 'bg-[rgba(196,168,80,0.15)] text-[#e8e4df] rounded-tr-sm' : 'bg-[#1a1815] text-[#e8e4df] rounded-tl-sm border border-[rgba(196,168,80,0.05)]'}`}>
                      <p className="font-sans text-sm md:text-base whitespace-pre-wrap break-words">{msg.content}</p>
                      <div className={`flex items-center gap-1.5 mt-2 justify-end opacity-60 ${isOwn ? 'text-[#c4a850]' : 'text-[#888888]'}`}>
                        <span className="text-[10px] md:text-xs">{new Date(msg.created).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        {isOwn && (msg.read ? <CheckCheck size={14} /> : <Check size={14} />)}
                      </div>
                    </div>
                  </div>
                );
              })}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#1a1815] rounded-2xl rounded-tl-sm px-5 py-3 text-[#888888] text-sm flex gap-1 items-center">
                    <span className="animate-bounce">.</span><span className="animate-bounce delay-100">.</span><span className="animate-bounce delay-200">.</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 md:p-6 bg-[#141210] border-t border-[rgba(196,168,80,0.12)]">
              <div className="flex items-end gap-3 bg-[#0a0f0d] border border-[rgba(196,168,80,0.2)] rounded-xl p-2 focus-within:border-[#c4a850] transition-colors">
                <button className="p-2 text-[#888888] hover:text-[#c4a850] transition-colors mb-1 hidden sm:flex min-h-[44px] min-w-[44px] items-center justify-center">
                  <Paperclip size={20} />
                </button>
                <textarea
                  value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={handleKeyDown}
                  placeholder="Nachricht schreiben..." className="flex-1 bg-transparent text-[#e8e4df] text-sm md:text-base resize-none outline-none max-h-32 min-h-[44px] py-3 px-2 font-sans" rows={1}
                />
                <button onClick={handleSendMessage} disabled={!newMessage.trim()} className="p-3 bg-[#c4a850] text-[#0a0f0d] rounded-lg hover:brightness-110 disabled:opacity-50 transition-all mb-0.5 min-h-[44px] min-w-[44px] flex items-center justify-center">
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-[#888888] p-6 text-center">
            <MessageCircle size={64} className="mb-6 opacity-20" />
            <p className="font-sans text-lg">Wähle eine Unterhaltung aus</p>
          </div>
        )}
      </div>
    </div>
  );
}