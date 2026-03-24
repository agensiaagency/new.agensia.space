
import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useIntake } from '@/contexts/IntakeContext';
import { colorGroups } from '@/lib/categories';
import { PACKAGES } from '@/components/landing/PricingSection';

export default function IntakeStep3() {
  const navigate = useNavigate();
  const { category, formData, updateFormData } = useIntake();

  if (!category) return <Navigate to="/intake" replace />;

  const { step3 } = formData;
  const config = category.step3;
  const isBlue = category.color === colorGroups.blue;

  // Determine recommended package based on budget (from step2)
  const budget = formData.step2?.budget || '';
  let recommendedPackage = PACKAGES[1]; // Default to Professional
  if (budget.includes('2.000') || budget.includes('3.000')) {
    recommendedPackage = PACKAGES[2]; // Premium
  } else if (budget.includes('500') || budget.includes('1.000')) {
    recommendedPackage = PACKAGES[0]; // Starter
  }

  const toggleAtmosphere = (value) => {
    const current = step3.atmosphere || [];
    const updated = current.includes(value) 
      ? current.filter(item => item !== value)
      : [...current, value];
    updateFormData('step3', { atmosphere: updated });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex-1 w-full">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-serif mb-2 text-[#e8e4df]">Design & Stil.</h2>
        <p className="text-[#888888] mb-10">
          {isBlue ? 'Welche visuelle Richtung spricht Sie am meisten an?' : 'Welche visuelle Richtung spricht dich am meisten an?'}
        </p>

        {/* Recommended Package Box */}
        <div className="mb-12 p-6 rounded-2xl border-2 border-[#c4a850] bg-[rgba(196,168,80,0.05)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-[#c4a850] text-xs font-bold uppercase tracking-wider mb-1">Empfohlenes Paket</div>
            <h3 className="text-2xl font-serif text-[#e8e4df]">{recommendedPackage.name}</h3>
            <p className="text-sm text-[#a8b0c5] mt-1">Basierend auf deinem angegebenen Budget.</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-sm text-[#888888]">Einmalig ab</div>
            <div className="text-3xl font-bold text-[#e8e4df]">€{recommendedPackage.basePrice}</div>
            <div className="text-sm text-[#c4a850] mt-1">+ {recommendedPackage.monthlyPrices['2J']}€ / Mo</div>
          </div>
        </div>

        {config.styles && config.styles.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {config.styles.map(style => {
              const isActive = step3.styleId === style.id;
              return (
                <button
                  key={style.id}
                  onClick={() => updateFormData('step3', { styleId: style.id })}
                  className={`p-4 rounded-[16px] border text-left transition-all duration-200 ${
                    isActive 
                      ? 'bg-[rgba(255,255,255,0.05)]' 
                      : 'bg-[#0d0d0f] border-[rgba(196,168,80,0.12)] hover:border-[rgba(255,255,255,0.1)]'
                  }`}
                  style={{ borderColor: isActive ? category.color : undefined }}
                >
                  <div className="w-full h-20 rounded-lg mb-4" style={{ background: style.gradient }} />
                  <div className={`font-medium text-sm ${isActive ? 'text-[#e8e4df]' : 'text-[#888888]'}`}>
                    {style.name}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {config.atmosphere && config.atmosphere.length > 0 && (
          <div className="mb-12">
            <label className="block text-lg font-serif text-[#e8e4df] mb-4">Atmosphäre & Tonalität</label>
            <div className="flex flex-wrap gap-3">
              {config.atmosphere.map(opt => {
                const isActive = (step3.atmosphere || []).includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleAtmosphere(opt)}
                    className={`px-5 py-2 rounded-full border-[1.5px] text-sm transition-all duration-200 ${
                      isActive 
                        ? 'text-[#08080a] border-transparent' 
                        : 'border-[rgba(196,168,80,0.12)] text-[#888888] hover:border-[rgba(255,255,255,0.3)] hover:text-[#e8e4df]'
                    }`}
                    style={{ backgroundColor: isActive ? category.color : 'transparent' }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mb-10">
          <label className="block text-lg font-serif text-[#e8e4df] mb-4">
            {isBlue ? 'Inspiration (Links zu Websites, die Ihnen gefallen)' : 'Inspiration (Links zu Websites, die dir gefallen)'}
          </label>
          <textarea 
            value={step3.inspiration} 
            onChange={(e) => updateFormData('step3', { inspiration: e.target.value })} 
            rows={3} 
            className="w-full bg-[#0d0d0f] border border-[rgba(196,168,80,0.12)] rounded-xl px-5 py-3 text-[#e8e4df] focus:outline-none focus:border-[#c4a850] transition-colors resize-none" 
            placeholder="https://..."
          />
        </div>

        <div className="p-5 rounded-xl bg-[rgba(255,255,255,0.02)] border-l-4 mb-10" style={{ borderLeftColor: category.color }}>
          <p className="text-sm text-[#888888]">
            {isBlue 
              ? 'Keine Sorge, wenn Sie sich noch nicht 100% sicher sind. Wir besprechen das Design im Detail beim Kickoff-Call.' 
              : 'Keine Sorge, wenn du dir noch nicht 100% sicher bist. Wir besprechen das Design im Detail beim Kickoff-Call.'}
          </p>
        </div>

        <div className="flex justify-between pt-8">
          <button onClick={() => navigate('/intake/step2')} className="px-6 py-3 rounded-full border border-[rgba(255,255,255,0.1)] text-[#888888] hover:text-white transition-colors">
            Zurück
          </button>
          <button onClick={() => navigate('/intake/step4')} className="px-8 py-3 rounded-full text-[#08080a] font-medium transition-all hover:brightness-110" style={{ backgroundColor: category.color }}>
            Weiter
          </button>
        </div>
      </div>
    </div>
  );
}
