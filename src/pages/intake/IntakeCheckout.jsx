
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { PACKAGES } from '@/components/landing/PricingSection';

// TODO: Diese Seite wird im neuen Flow nicht mehr als Pflicht-Schritt genutzt. 
// Der neue Flow: IntakeStep5 → IntakeConfirmationPage → Signup → Dashboard. 
// IntakeCheckout wird später als Basis für die Dashboard-Paket-Auswahl im Onboarding-Prozess wiederverwendet. 
// Bis dahin bleibt die Route /intake/checkout als eigenständige Seite erreichbar.

export default function IntakeCheckout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const { toast } = useToast();
  
  const category = searchParams.get('category') || 'general';
  const recommendedPackageId = searchParams.get('package') || 'professional';

  const [term, setTerm] = useState('2J');
  const [selectedPkgId, setSelectedPkgId] = useState(recommendedPackageId);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedPkg = PACKAGES.find(p => p.id === selectedPkgId) || PACKAGES[1];

  const handleBook = async () => {
    setIsProcessing(true);
    const monthlyPrice = selectedPkg.monthlyPrices[term];
    const basePrice = selectedPkg.basePrice;
    
    if (isLoggedIn && user) {
      try {
        await api.updateUser(user.id, {
          selected_package: selectedPkg.id,
          selected_term: term,
          monthly_price: monthlyPrice,
          base_price: basePrice
        });
        toast({ title: "Paket ausgewählt", className: "bg-[#10b981] text-white border-none" });
        navigate('/dashboard/overview');
      } catch (error) {
        toast({ title: "Fehler", variant: "destructive" });
        setIsProcessing(false);
      }
    } else {
      navigate(`/signup?package=${selectedPkg.id}&term=${term}&monthly=${monthlyPrice}&base=${basePrice}&category=${category}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080a] py-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Sparkles className="w-12 h-12 text-[#c4a850] mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-serif text-[#e8e4df] mb-6">
              Dein Briefing ist fertig!
            </h1>
            <p className="text-lg text-[#a8b0c5]">
              Wähle nun das passende Paket für deine neue Website. Basierend auf deinen Angaben empfehlen wir dir das <span className="text-[#c4a850] font-medium capitalize">{recommendedPackageId}</span> Paket.
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Main Content: Packages */}
          <div className="flex-1 w-full">
            {/* Term Selector */}
            <div className="flex justify-center mb-10">
              <div className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] p-1.5 rounded-xl inline-flex">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PACKAGES.map((pkg, idx) => {
                const isSelected = pkg.id === selectedPkgId;
                return (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => setSelectedPkgId(pkg.id)}
                    className={`relative bg-[#0d0d0f] rounded-2xl p-6 flex flex-col cursor-pointer transition-all duration-300 ${
                      isSelected 
                        ? 'border-2 border-[#c4a850] shadow-[0_0_30px_rgba(196,168,80,0.15)] md:-translate-y-2' 
                        : 'border border-[rgba(196,168,80,0.12)] hover:border-[rgba(196,168,80,0.3)]'
                    }`}
                  >
                    {pkg.id === recommendedPackageId && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c4a850] text-[#08080a] px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Empfehlung
                      </div>
                    )}
                    
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

                    <ul className="space-y-3 flex-1">
                      {pkg.features.slice(0, 4).map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[#a8b0c5]">
                          <Check size={16} className="text-[#c4a850] shrink-0 mt-0.5 opacity-70" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Sidebar: Order Summary */}
          <div className="w-full lg:w-80 shrink-0 lg:sticky lg:top-24">
            <div className="bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-2xl p-6">
              <h3 className="text-lg font-serif text-[#e8e4df] mb-6">Zusammenfassung</h3>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-[rgba(255,255,255,0.05)]">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#888888]">Paket</span>
                  <span className="text-sm font-medium text-[#e8e4df]">{selectedPkg.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#888888]">Laufzeit</span>
                  <span className="text-sm font-medium text-[#e8e4df]">{term === '1J' ? '1 Jahr' : term === '2J' ? '2 Jahre' : '3 Jahre'}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#e8e4df]">Einmalige Setup-Gebühr</span>
                  <span className="text-sm font-medium text-[#e8e4df]">€{selectedPkg.basePrice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#e8e4df]">Hosting & Wartung (mtl.)</span>
                  <span className="text-sm font-medium text-[#c4a850]">€{selectedPkg.monthlyPrices[term]}</span>
                </div>
              </div>

              <button
                onClick={handleBook}
                disabled={isProcessing}
                className="w-full py-3.5 bg-[#c4a850] text-[#08080a] rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#d4bc6a] transition-all duration-300 disabled:opacity-50"
              >
                {isProcessing ? 'Wird verarbeitet...' : 'Jetzt buchen'} <ArrowRight size={18} />
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#888888]">
                <ShieldCheck size={14} /> Sichere SSL-Verschlüsselung
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
