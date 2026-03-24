import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useIntake } from '@/contexts/IntakeContext';
import { colorGroups } from '@/lib/categories';

export default function IntakeStep2() {
  const navigate = useNavigate();
  const { category, formData, updateFormData } = useIntake();

  if (!category) return <Navigate to="/intake" replace />;

  const { step2 } = formData;
  const config = category.step2;
  const isBlue = category.color === colorGroups.blue;

  const toggleChip = (listName, value) => {
    const current = step2[listName] || [];
    const updated = current.includes(value) 
      ? current.filter(item => item !== value)
      : [...current, value];
    updateFormData('step2', { [listName]: updated });
  };

  const ChipList = ({ label, options, listName }) => (
    <div className="mb-10">
      <label className="block text-lg font-serif text-[#e8e4df] mb-4">{label}</label>
      <div className="flex flex-wrap gap-3">
        {options.map(opt => {
          const isActive = (step2[listName] || []).includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggleChip(listName, opt)}
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
  );

  return (
    <div className="max-w-3xl mx-auto px-6 py-20 flex-1 w-full">
      <h2 className="text-4xl font-serif mb-2 text-[#e8e4df]">{isBlue ? 'Ihr Angebot.' : 'Dein Angebot.'}</h2>
      <p className="text-[#888888] mb-10">
        {isBlue ? 'Lassen Sie uns tiefer in Ihre Spezialisierung eintauchen.' : 'Lass uns tiefer in deine Nische eintauchen.'}
      </p>

      {config.chipGroups && config.chipGroups.map(group => (
        <ChipList key={group.key} label={group.label} options={group.options} listName={group.key} />
      ))}

      <div className="mb-10">
        <label className="block text-lg font-serif text-[#e8e4df] mb-4">{config.textareaLabel}</label>
        <textarea 
          value={step2.textarea} 
          onChange={(e) => updateFormData('step2', { textarea: e.target.value })} 
          rows={4} 
          className="w-full bg-[rgba(16,21,18,0.6)] border border-[rgba(255,255,255,0.1)] rounded-xl px-5 py-3 text-[#e8e4df] focus:outline-none focus:border-opacity-50 transition-colors resize-none" 
          placeholder={isBlue ? "Erzählen Sie uns mehr darüber..." : "Erzähl mir mehr darüber..."}
        />
      </div>

      <div className="flex justify-between pt-8">
        <button onClick={() => navigate('/intake/step1')} className="px-6 py-3 rounded-full border border-[rgba(255,255,255,0.1)] text-[#888888] hover:text-white transition-colors">
          Zurück
        </button>
        <button onClick={() => navigate('/intake/step3')} className="px-8 py-3 rounded-full text-[#0a0f0d] font-medium transition-all hover:brightness-110" style={{ backgroundColor: category.color }}>
          Weiter
        </button>
      </div>
    </div>
  );
}