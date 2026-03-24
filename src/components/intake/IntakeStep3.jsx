
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Check, Zap } from 'lucide-react';

const PACKAGES = [
  {
    id: 'starter',
    name: 'Starter',
    price: 'ab 10€ / Monat',
    revisions: '1 Revision / Monat',
    features: ['Bis zu 5 Unterseiten', 'Responsive Design', 'Kontaktformular', 'Basis SEO']
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 'ab 15€ / Monat',
    revisions: '3 Revisionen / Monat',
    recommended: true,
    features: ['Bis zu 15 Unterseiten', 'Individuelles Design', 'Erweiterte SEO', 'Blog / News Bereich']
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 'ab 20€ / Monat',
    revisions: '5 Revisionen / Monat',
    features: ['Unbegrenzte Unterseiten', 'Premium Custom Design', 'E-Commerce Integration', 'Mehrsprachigkeit']
  },
  {
    id: 'custom',
    name: 'Individuell',
    price: 'Auf Anfrage',
    revisions: 'Nach Absprache',
    features: ['Spezifische Anforderungen', 'Komplexe Integrationen', 'Sonderfunktionen', 'Dedizierter Projektmanager']
  }
];

export default function IntakeStep3({ formData, updateFormData }) {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const pkgFromUrl = searchParams.get('package');
    if (pkgFromUrl && !formData.package) {
      updateFormData({ package: pkgFromUrl });
    }
  }, [searchParams, formData.package, updateFormData]);

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-serif text-[#e8e4df] mb-4">Welches Paket passt zu dir?</h2>
        <p className="text-[#a8b0c5]">
          Wähle das Leistungspaket, das deine Anforderungen am besten abdeckt. Du kannst dies später noch anpassen.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PACKAGES.map((pkg, idx) => (
          <motion.button
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => updateFormData({ package: pkg.id })}
            className={`relative text-left p-6 rounded-2xl border transition-all duration-300 ${
              formData.package === pkg.id
                ? 'bg-[rgba(196,168,80,0.05)] border-[#c4a850] shadow-[0_0_20px_rgba(196,168,80,0.1)]'
                : 'bg-[#141210] border-[rgba(196,168,80,0.12)] hover:border-[rgba(196,168,80,0.3)]'
            }`}
          >
            {pkg.recommended && (
              <div className="absolute -top-3 right-6 bg-[#c4a850] text-[#0a0f0d] px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Empfohlen
              </div>
            )}
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className={`text-xl font-serif mb-1 ${formData.package === pkg.id ? 'text-[#c4a850]' : 'text-[#e8e4df]'}`}>
                  {pkg.name}
                </h3>
                <p className="text-sm text-[#888888]">{pkg.price}</p>
              </div>
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${
                formData.package === pkg.id ? 'border-[#c4a850] bg-[#c4a850]' : 'border-[rgba(255,255,255,0.2)]'
              }`}>
                {formData.package === pkg.id && <Check size={14} className="text-[#0a0f0d]" />}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6 p-3 rounded-lg bg-[#0a0f0d] border border-[rgba(255,255,255,0.05)]">
              <Zap size={16} className="text-[#c4a850]" />
              <span className="text-sm text-[#e8e4df]">{pkg.revisions}</span>
            </div>

            <ul className="space-y-3">
              {pkg.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#a8b0c5]">
                  <Check size={16} className="text-[#c4a850] shrink-0 mt-0.5 opacity-70" />
                  {feature}
                </li>
              ))}
            </ul>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
