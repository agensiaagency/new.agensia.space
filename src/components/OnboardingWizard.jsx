
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { X, Upload, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

export default function OnboardingWizard({ onComplete }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isCompleting, setIsCompleting] = useState(false);
  
  const [briefing, setBriefing] = useState('');
  const [questions, setQuestions] = useState('');

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      if (user?.id) {
        await api.updateUser(user.id, { onboarding_completed: true });
        // Optionally save briefing/questions to a note or project
        await api.admin_notes.create({
          user_id: user.id,
          admin_id: user.id, // Self note for now, or system
          content: `Onboarding Briefing:\n${briefing}\n\nFragen:\n${questions}`,
          category: 'projekt'
        });
      }
      if (onComplete) onComplete();
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      toast({ title: "Fehler", variant: "destructive" });
    } finally {
      setIsCompleting(false);
    }
  };

  const nextStep = () => setStep(s => Math.min(4, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center bg-[#08080a]">
          <div>
            <h2 className="text-xl font-serif text-[#e8e4df]">Willkommen, {user?.name || 'bei agensia'}!</h2>
            {user?.selected_package && (
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[rgba(196,168,80,0.1)] text-[#c4a850] border border-[rgba(196,168,80,0.2)]">
                Paket: {user.selected_package}
              </span>
            )}
          </div>
          <button onClick={handleComplete} className="p-2 text-[#888888] hover:text-[#e8e4df] transition-colors rounded-full hover:bg-[rgba(255,255,255,0.05)]">
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex h-1 bg-[#08080a]">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`flex-1 transition-colors duration-300 ${i <= step ? 'bg-[#c4a850]' : 'bg-transparent'}`} />
          ))}
        </div>

        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h3 className="text-2xl font-serif text-[#e8e4df]">Erzähl uns mehr über dein Projekt</h3>
                <p className="text-[#888888] text-sm">Was ist das Hauptziel deiner neuen Website? Gibt es bestimmte Funktionen, die dir besonders wichtig sind?</p>
                <textarea 
                  value={briefing}
                  onChange={e => setBriefing(e.target.value)}
                  rows={6}
                  placeholder="Mein Ziel ist es..."
                  className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-xl p-4 text-[#e8e4df] focus:outline-none focus:border-[#c4a850] resize-none"
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h3 className="text-2xl font-serif text-[#e8e4df]">Erste Dateien hochladen</h3>
                <p className="text-[#888888] text-sm">Hast du bereits ein Logo, Bilder oder Texte? Lade sie hier hoch, damit wir direkt starten können. (Du kannst dies auch später im Dashboard tun).</p>
                
                <div className="border-2 border-dashed border-[rgba(196,168,80,0.3)] rounded-xl p-10 flex flex-col items-center justify-center text-center bg-[rgba(196,168,80,0.02)] hover:bg-[rgba(196,168,80,0.05)] transition-colors cursor-pointer">
                  <Upload size={32} className="text-[#c4a850] mb-4" />
                  <p className="text-[#e8e4df] font-medium mb-1">Klicke oder ziehe Dateien hierher</p>
                  <p className="text-xs text-[#888888]">Max. 10MB pro Datei (Bilder, PDF, ZIP)</p>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h3 className="text-2xl font-serif text-[#e8e4df]">Hast du noch Fragen?</h3>
                <p className="text-[#888888] text-sm">Gibt es etwas, das dir unklar ist oder das wir vor dem Start besprechen sollten?</p>
                <textarea 
                  value={questions}
                  onChange={e => setQuestions(e.target.value)}
                  rows={6}
                  placeholder="Ich frage mich, ob..."
                  className="w-full bg-[#08080a] border border-[rgba(255,255,255,0.1)] rounded-xl p-4 text-[#e8e4df] focus:outline-none focus:border-[#c4a850] resize-none"
                />
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <div className="w-20 h-20 bg-[rgba(16,185,129,0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} className="text-[#10b981]" />
                </div>
                <h3 className="text-3xl font-serif text-[#e8e4df] mb-4">Alles bereit!</h3>
                <p className="text-[#a8b0c5] max-w-md mx-auto">
                  Vielen Dank für deine Angaben. Wir werden uns diese ansehen und uns in Kürze bei dir melden. Du kannst nun dein Dashboard erkunden.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-6 border-t border-[rgba(255,255,255,0.05)] bg-[#08080a] flex justify-between items-center">
          {step > 1 ? (
            <button onClick={prevStep} className="flex items-center gap-2 px-4 py-2 text-[#888888] hover:text-[#e8e4df] transition-colors">
              <ArrowLeft size={16} /> Zurück
            </button>
          ) : (
            <button onClick={handleComplete} className="px-4 py-2 text-[#888888] hover:text-[#e8e4df] transition-colors text-sm">
              Überspringen
            </button>
          )}
          
          {step < 4 ? (
            <button onClick={nextStep} className="flex items-center gap-2 bg-[#c4a850] text-[#08080a] px-6 py-2.5 rounded-lg font-medium hover:bg-[#d4bc6a] transition-all active:scale-[0.98]">
              Weiter <ArrowRight size={16} />
            </button>
          ) : (
            <button onClick={handleComplete} disabled={isCompleting} className="flex items-center gap-2 bg-[#10b981] text-white px-8 py-2.5 rounded-lg font-medium hover:bg-[#0ea5e9] transition-all active:scale-[0.98] disabled:opacity-50">
              {isCompleting ? 'Wird gespeichert...' : 'Dashboard öffnen'} <CheckCircle size={16} />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
