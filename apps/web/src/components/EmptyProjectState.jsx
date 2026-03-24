
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MessageSquare, Paperclip, ArrowLeft } from 'lucide-react';

export default function EmptyProjectState() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-[#141210]/80 backdrop-blur-md border border-[rgba(196,168,80,0.12)] rounded-2xl p-10 md:p-16 relative overflow-hidden"
      >
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#c4a850] opacity-[0.03] blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-[#0a0f0d] border border-[rgba(196,168,80,0.2)] flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(196,168,80,0.15)]">
            <Briefcase size={40} className="text-[#c4a850]" />
          </div>

          <h2 className="font-serif text-3xl md:text-4xl text-[#e8e4df] mb-4">
            Dein Projekt wird vorbereitet...
          </h2>
          
          <p className="font-sans text-[#a8b0c5] max-w-md mx-auto mb-10 leading-relaxed">
            Sobald wir dein Briefing bearbeitet haben, findest du hier alle Details zu deinem Projekt.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg mb-10">
            <button 
              onClick={() => navigate('/dashboard/briefing')}
              className="flex items-center justify-center gap-3 p-4 rounded-xl bg-[#c4a850] text-[#0a0f0d] hover:bg-[#d4bc6a] transition-all font-sans font-medium text-sm sm:col-span-2"
            >
              <Briefcase size={18} />
              Briefing starten
            </button>

            <button 
              onClick={() => navigate('/dashboard/messages')}
              className="flex items-center justify-center gap-3 p-4 rounded-xl bg-[#0a0f0d] border border-[rgba(196,168,80,0.1)] hover:border-[#c4a850]/50 hover:bg-[rgba(196,168,80,0.05)] transition-all text-[#e8e4df] font-sans text-sm"
            >
              <MessageSquare size={18} className="text-[#c4a850]" />
              💬 Schreib uns eine Nachricht
            </button>
            
            <button 
              onClick={() => navigate('/dashboard/files')}
              className="flex items-center justify-center gap-3 p-4 rounded-xl bg-[#0a0f0d] border border-[rgba(196,168,80,0.1)] hover:border-[#c4a850]/50 hover:bg-[rgba(196,168,80,0.05)] transition-all text-[#e8e4df] font-sans text-sm"
            >
              <Paperclip size={18} className="text-[#c4a850]" />
              📎 Lade Dateien hoch
            </button>
          </div>

          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[#888888] hover:text-[#c4a850] transition-colors font-sans text-sm"
          >
            <ArrowLeft size={16} />
            Zurück zur Startseite
          </button>
        </div>
      </motion.div>
    </div>
  );
}
