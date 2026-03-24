
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useIntake } from '@/contexts/IntakeContext';
import { api } from '@/lib/api';

export default function IntakeConfirmationPage() {
  const [searchParams] = useSearchParams();
  const submissionId = searchParams.get('submissionId');
  const { user } = useAuth();
  const { category, formData } = useIntake();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && submissionId) {
      api.intake_submissions.update(submissionId, { user_id: user.id }).catch(console.error);
    }
  }, [user, submissionId]);

  if (!category && !submissionId) return <Navigate to="/intake" replace />;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-20 bg-[#08080a]">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-24 h-24 rounded-full bg-[rgba(196,168,80,0.1)] flex items-center justify-center mb-8"
      >
        <CheckCircle2 size={48} className="text-[#c4a850]" />
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-serif text-[#e8e4df] mb-4 text-center"
      >
        Briefing erfolgreich gespeichert!
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-[#a8b0c5] text-center max-w-xl mb-12"
      >
        Wir haben deine Projektanfrage erhalten. Um den Fortschritt zu verfolgen und mit uns zu kommunizieren, benötigst du einen Account.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-2xl bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-2xl p-8 mb-12 shadow-xl"
      >
        <h3 className="text-xl font-serif text-[#e8e4df] mb-6 border-b border-[rgba(255,255,255,0.05)] pb-4">Zusammenfassung</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <span className="block text-sm text-[#5e6680] mb-1">Branche</span>
            <span className="text-[#e8e4df] font-medium">{category?.title || 'Individuell'}</span>
          </div>
          <div>
            <span className="block text-sm text-[#5e6680] mb-1">Firma / Projekt</span>
            <span className="text-[#e8e4df] font-medium">{formData?.step1?.companyName || formData?.step1?.name || '-'}</span>
          </div>
          <div>
            <span className="block text-sm text-[#5e6680] mb-1">Design-Stil</span>
            <span className="text-[#e8e4df] font-medium">{formData?.step3?.styleId || 'Nicht angegeben'}</span>
          </div>
          <div>
            <span className="block text-sm text-[#5e6680] mb-1">Hauptziel</span>
            <span className="text-[#e8e4df] font-medium">{formData?.step4?.goal || 'Nicht angegeben'}</span>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl justify-center"
      >
        {user ? (
          <button 
            onClick={() => navigate('/dashboard/overview')}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-[#c4a850] text-[#0a0f0d] rounded-xl font-medium hover:bg-[#d4bc6a] transition-all active:scale-[0.98]"
          >
            Zum Dashboard <ArrowRight size={18} />
          </button>
        ) : (
          <>
            <button 
              onClick={() => navigate(`/signup?submissionId=${submissionId}`)}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-[#c4a850] text-[#0a0f0d] rounded-xl font-medium hover:bg-[#d4bc6a] transition-all active:scale-[0.98] flex-1"
            >
              <UserPlus size={18} />
              Account erstellen & Projekt starten
            </button>
            <button 
              onClick={() => navigate(`/login?submissionId=${submissionId}`)}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-[#0d0d0f] border border-[rgba(255,255,255,0.1)] text-[#e8e4df] rounded-xl font-medium hover:border-[rgba(196,168,80,0.5)] hover:text-[#c4a850] transition-all active:scale-[0.98] flex-1"
            >
              <LogIn size={18} />
              Bereits einen Account? Jetzt einloggen
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
