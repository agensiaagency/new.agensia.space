
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Check, CreditCard, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { PACKAGES } from '@/components/landing/PricingSection';

export default function PaymentModal({ isOpen, onClose, currentPackage }) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [term, setTerm] = useState(user?.selected_term || '2J');
  const [selectedPkg, setSelectedPkg] = useState(currentPackage || user?.selected_package || 'professional');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = async () => {
    setIsProcessing(true);
    try {
      const response = await api.hosting.createCheckoutSession({
        packageKey: selectedPkg,
        term: term,
        userId: user.id,
        email: user.email
      });
      
      toast({ title: "Weiterleitung", description: "Du wirst zu Stripe weitergeleitet...", className: "bg-[#10b981] text-white border-none" });
      
      // Redirect to Stripe Checkout
      window.location.href = response.url;

    } catch (error) {
      console.error('Subscription error:', error);
      toast({ title: "Fehler", description: "Weiterleitung zu Stripe fehlgeschlagen.", variant: "destructive" });
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col"
      >
        <div className="p-6 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center bg-[#08080a]">
          <h2 className="text-2xl font-serif text-[#e8e4df] flex items-center gap-2">
            <CreditCard className="text-[#c4a850]" /> Paket wählen
          </h2>
          <button onClick={onClose} className="p-2 text-[#888888] hover:text-[#e8e4df] transition-colors rounded-full hover:bg-[rgba(255,255,255,0.05)]">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
          
          {/* Term Selector */}
          <div className="flex justify-center mb-8">
            <div className="bg-[#08080a] border border-[rgba(196,168,80,0.12)] p-1.5 rounded-xl inline-flex">
              {['1J', '2J', '3J'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTerm(t)}
                  className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    term === t 
                      ? 'bg-[#c4a850] text-[#08080a] shadow-lg' 
                      : 'text-[#888888] hover:text-[#e8e4df]'
                  }`}
                >
                  {t === '1J' ? '1 Jahr' : t === '2J' ? '2 Jahre' : '3 Jahre'}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {PACKAGES.map((pkg) => {
              const isSelected = selectedPkg === pkg.id;
              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPkg(pkg.id)}
                  className={`relative p-6 rounded-xl border cursor-pointer transition-all duration-300 ${
                    isSelected 
                      ? 'bg-[rgba(196,168,80,0.05)] border-[#c4a850] shadow-[0_0_20px_rgba(196,168,80,0.1)]' 
                      : 'bg-[#08080a] border-[rgba(255,255,255,0.05)] hover:border-[rgba(196,168,80,0.3)]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className={`text-xl font-serif ${isSelected ? 'text-[#c4a850]' : 'text-[#e8e4df]'}`}>{pkg.name}</h3>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#c4a850] bg-[#c4a850]' : 'border-[rgba(255,255,255,0.2)]'}`}>
                      {isSelected && <Check size={12} className="text-[#08080a]" />}
                    </div>
                  </div>
                  
                  <div className="mb-6 pb-6 border-b border-[rgba(255,255,255,0.05)]">
                    <div className="text-xs text-[#888888] mb-1">Einmalig</div>
                    <div className="text-2xl font-bold text-[#e8e4df] mb-3">€{pkg.basePrice}</div>
                    
                    <div className="text-xs text-[#888888] mb-1">Monatlich</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold text-[#c4a850]">€{pkg.monthlyPrices[term]}</span>
                      <span className="text-xs text-[#888888]">/ Mo</span>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {pkg.features.slice(0, 4).map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#a8b0c5]">
                        <Check size={16} className="text-[#c4a850] shrink-0 mt-0.5 opacity-70" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

        </div>

        <div className="p-6 border-t border-[rgba(255,255,255,0.05)] bg-[#08080a] flex justify-between items-center">
          <div className="text-sm text-[#888888]">
            Aktuell gewählt: <span className="text-[#e8e4df] font-medium capitalize">{user?.selected_package || 'Keines'}</span>
          </div>
          <div className="flex gap-4">
            <button onClick={onClose} className="px-6 py-2.5 text-[#888888] hover:text-[#e8e4df] transition-colors font-medium">
              Abbrechen
            </button>
            <button 
              onClick={handleSubscribe}
              disabled={isProcessing}
              className="flex items-center gap-2 bg-[#c4a850] text-[#08080a] px-8 py-2.5 rounded-xl font-medium hover:bg-[#d4bc6a] transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isProcessing ? 'Wird verarbeitet...' : 'Zur Zahlung'} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
