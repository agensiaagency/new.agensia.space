
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function IntakePage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleStart = (e) => {
    e.preventDefault();
    // In a real app, we might save the email to context or local storage here
    navigate('/intake/step1');
  };

  return (
    <div className="min-h-screen bg-[#08080a] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#c4a850] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#c4a850] opacity-[0.02] blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center z-10 relative"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(196,168,80,0.1)] border border-[rgba(196,168,80,0.2)] text-[#c4a850] text-xs font-bold uppercase tracking-wider mb-8">
            <span className="w-2 h-2 rounded-full bg-[#c4a850] animate-pulse" />
            Projekt starten
          </div>
          
          <h1 className="text-4xl md:text-6xl font-serif text-[#e8e4df] mb-6 leading-tight">
            Lass uns dein <br />
            <span className="text-[#c4a850]">Projekt starten.</span>
          </h1>
          
          <p className="text-lg text-[#a8b0c5] mb-12 max-w-xl mx-auto">
            In nur 5 Minuten erfassen wir die wichtigsten Details für deine neue Website. Kostenlos und unverbindlich.
          </p>

          <form onSubmit={handleStart} className="max-w-md mx-auto space-y-4">
            <div className="relative">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Deine E-Mail Adresse" 
                className="w-full bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl py-4 px-6 text-[#e8e4df] focus:outline-none focus:border-[#c4a850] transition-colors text-lg"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-[#c4a850] text-[#08080a] py-4 rounded-xl font-medium text-lg flex items-center justify-center gap-2 hover:bg-[#d4bc6a] transition-all active:scale-[0.98]"
            >
              Jetzt starten <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-[#888888]">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#c4a850]" />
              <span>Dauert nur 5 Minuten</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#c4a850]" />
              <span>100% Unverbindlich</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#c4a850]" />
              <span>Sofortige Preiseinschätzung</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
