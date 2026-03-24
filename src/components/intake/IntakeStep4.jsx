import React from 'react';

export default function IntakeStep4({ formData, updateFormData }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-[28px] font-serif text-center text-[#edf0f7] mb-8">Ziele & Wünsche</h2>
      
      <div className="max-w-xl mx-auto">
        <label className="block text-[#a8b0c5] font-sans text-[14px] mb-2">
          Was soll die Website können?
        </label>
        <textarea 
          value={formData.goals || ''}
          onChange={(e) => updateFormData('goals', e.target.value)}
          rows={4}
          placeholder="z.B. Kundengewinnung, Portfolio, Online-Shop..."
          className="w-full bg-[#12151e] border border-[rgba(255,255,255,0.06)] text-[#edf0f7] rounded-[8px] px-[12px] py-[12px] focus:outline-none focus:border-[#d4a850] focus:shadow-[0_0_0_3px_rgba(212,168,80,0.12)] font-sans text-[14px] placeholder-[#5e6680] resize-none transition-all"
        />
      </div>
    </div>
  );
}