
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PACKAGES = [
  {
    id: 'starter',
    name: 'Starter',
    basePrice: 490,
    monthlyPrices: { '1J': 15, '2J': 14, '3J': 13 },
    description: 'Perfekt für kleine Unternehmen und den schnellen Start.',
    features: [
      'Bis zu 5 Unterseiten',
      'Responsive Design',
      'Kontaktformular',
      'Basis SEO-Optimierung',
      '1 Revision / Monat'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    basePrice: 790,
    monthlyPrices: { '1J': 17, '2J': 16, '3J': 15 },
    description: 'Die ideale Lösung für wachstumsorientierte Unternehmen.',
    popular: true,
    features: [
      'Bis zu 15 Unterseiten',
      'Individuelles Design',
      'Erweiterte SEO-Optimierung',
      'Performance-Optimierung',
      '3 Revisionen / Monat',
      'Priority Support'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    basePrice: 1590,
    monthlyPrices: { '1J': 20, '2J': 19, '3J': 18 },
    description: 'Maximale Leistung und unbegrenzte Möglichkeiten.',
    features: [
      'Unbegrenzte Unterseiten',
      'Premium Custom Design',
      'Komplexe Animationen',
      'E-Commerce Integration möglich',
      '5 Revisionen / Monat',
      '24/7 VIP Support'
    ]
  }
];

export default function PricingSection() {
  const [term, setTerm] = useState('2J');
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-[#08080a] relative overflow-hidden" id="pricing">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#c4a850] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-[#e8e4df] mb-6">
            Transparente Preise. <br />
            <span className="text-[#c4a850]">Keine versteckten Kosten.</span>
          </h2>
          <p className="text-lg text-[#a8b0c5]">
            Wähle das Paket, das am besten zu deinen Zielen passt. Alle Pakete beinhalten Hosting, Wartung und regelmäßige Updates.
          </p>
        </div>

        <div className="flex justify-center mb-12">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {PACKAGES.map((pkg, idx) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative rounded-2xl p-8 flex flex-col h-full ${
                pkg.popular 
                  ? 'bg-gradient-to-b from-[#1a1814] to-[#0d0d0f] border-2 border-[#c4a850] shadow-[0_0_30px_rgba(196,168,80,0.15)] scale-105 z-10' 
                  : 'bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)]'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#c4a850] text-[#08080a] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Beliebt
                </div>
              )}
              
              <h3 className="text-2xl font-serif text-[#e8e4df] mb-2">{pkg.name}</h3>
              <p className="text-sm text-[#888888] mb-6 min-h-[40px]">{pkg.description}</p>
              
              <div className="mb-8 pb-8 border-b border-[rgba(255,255,255,0.05)]">
                <div className="text-sm text-[#a8b0c5] mb-1">Einmalig ab</div>
                <div className="text-4xl font-bold text-[#e8e4df] mb-4">€{pkg.basePrice}</div>
                
                <div className="text-sm text-[#a8b0c5] mb-1">Plus Hosting & Wartung</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-[#c4a850]">€{pkg.monthlyPrices[term]}</span>
                  <span className="text-sm text-[#888888]">/ Monat</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check size={18} className="text-[#c4a850] shrink-0 mt-0.5" />
                    <span className="text-sm text-[#e8e4df]">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate(`/intake?package=${pkg.id}`)}
                className={`w-full py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 mt-auto ${
                  pkg.popular
                    ? 'bg-[#c4a850] text-[#08080a] hover:bg-[#d4bc6a]'
                    : 'bg-[rgba(255,255,255,0.05)] text-[#e8e4df] hover:bg-[rgba(255,255,255,0.1)]'
                }`}
              >
                Projekt starten <ArrowRight size={18} />
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-[#888888] mb-6">Noch unsicher, welches Paket das richtige ist?</p>
          <button 
            onClick={() => navigate('/intake')}
            className="inline-flex items-center gap-2 text-[#c4a850] font-medium hover:text-[#d4bc6a] transition-colors"
          >
            Kostenloses Briefing starten <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
