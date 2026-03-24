import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useIntake } from '@/contexts/IntakeContext';
import { colorGroups } from '@/lib/categories';

export default function IntakeStep4() {
  const navigate = useNavigate();
  const { category, formData, updateFormData } = useIntake();

  if (!category) return <Navigate to="/intake" replace />;

  const { step4 } = formData;
  const config = category.step4;
  const isBlue = category.color === colorGroups.blue;

  const toggleContent = (value) => {
    const current = step4.contents || [];
    const updated = current.includes(value) 
      ? current.filter(item => item !== value)
      : [...current, value];
    updateFormData('step4', { contents: updated });
  };

  const inputClass = "w-full bg-[rgba(16,21,18,0.6)] border border-[rgba(255,255,255,0.1)] rounded-xl px-5 py-3 text-[#e8e4df] focus:outline-none focus:border-opacity-50 transition-colors appearance-none";

  return (
    <div className="max-w-3xl mx-auto px-6 py-20 flex-1 w-full">
      <h2 className="text-4xl font-serif mb-2 text-[#e8e4df]">Ziele & Struktur.</h2>
      <p className="text-[#888888] mb-10">
        {isBlue ? 'Was soll Ihre Website erreichen?' : 'Was soll deine Website erreichen?'}
      </p>

      {config.goals && config.goals.length > 0 && (
        <div className="mb-10">
          <label className="block text-lg font-serif text-[#e8e4df] mb-4">{config.goalLabel}</label>
          <div className="relative">
            <select 
              value={step4.goal} 
              onChange={(e) => updateFormData('step4', { goal: e.target.value })}
              className={inputClass}
            >
              <option value="" disabled>Bitte wählen...</option>
              {config.goals.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#888888]">▼</div>
          </div>
        </div>
      )}

      {config.contents && config.contents.length > 0 && (
        <div className="mb-10">
          <label className="block text-lg font-serif text-[#e8e4df] mb-4">{config.contentLabel}</label>
          <div className="flex flex-wrap gap-3">
            {config.contents.map(opt => {
              const isActive = (step4.contents || []).includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleContent(opt)}
                  className={`px-5 py-2 rounded-full border-[1.5px] text-sm transition-all duration-200 ${
                    isActive 
                      ? 'text-[#0a0f0d] border-transparent' 
                      : 'border-[rgba(255,255,255,0.1)] text-[#888888] hover:border-[rgba(255,255,255,0.3)] hover:text-[#e8e4df]'
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

      {config.selects && config.selects.map(sel => (
        <div key={sel.key} className="mb-10">
          <label className="block text-lg font-serif text-[#e8e4df] mb-4">{sel.label}</label>
          <div className="relative">
            <select 
              value={step4[sel.key] || ''} 
              onChange={(e) => updateFormData('step4', { [sel.key]: e.target.value })}
              className={inputClass}
            >
              <option value="" disabled>Bitte wählen...</option>
              {sel.options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#888888]">▼</div>
          </div>
        </div>
      ))}

      <div className="flex justify-between pt-8">
        <button onClick={() => navigate('/intake/step3')} className="px-6 py-3 rounded-full border border-[rgba(255,255,255,0.1)] text-[#888888] hover:text-white transition-colors">
          Zurück
        </button>
        <button onClick={() => navigate('/intake/step5')} className="px-8 py-3 rounded-full text-[#0a0f0d] font-medium transition-all hover:brightness-110" style={{ backgroundColor: category.color }}>
          Weiter
        </button>
      </div>
    </div>
  );
}