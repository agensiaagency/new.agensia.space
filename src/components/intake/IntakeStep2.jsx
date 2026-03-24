import React from 'react';

export default function IntakeStep2({ formData, updateFormData }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-[28px] font-serif text-center text-[#edf0f7] mb-8">Dein Business</h2>
      
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <label className="block text-[#a8b0c5] font-sans text-[14px] mb-2">
            Firmenname / Projektname *
          </label>
          <input 
            type="text" 
            value={formData.company_name || ''}
            onChange={(e) => updateFormData('company_name', e.target.value)}
            placeholder="z.B. MOOS Studio"
            className="w-full bg-[#12151e] border border-[rgba(255,255,255,0.06)] text-[#edf0f7] rounded-[8px] px-[12px] py-[12px] focus:outline-none focus:border-[#d4a850] focus:shadow-[0_0_0_3px_rgba(212,168,80,0.12)] font-sans text-[14px] placeholder-[#5e6680] transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-[#a8b0c5] font-sans text-[14px] mb-2">
            Aktuelle Website (optional)
          </label>
          <input 
            type="url" 
            value={formData.website || ''}
            onChange={(e) => updateFormData('website', e.target.value)}
            placeholder="https://www.deinewebsite.de"
            className="w-full bg-[#12151e] border border-[rgba(255,255,255,0.06)] text-[#edf0f7] rounded-[8px] px-[12px] py-[12px] focus:outline-none focus:border-[#d4a850] focus:shadow-[0_0_0_3px_rgba(212,168,80,0.12)] font-sans text-[14px] placeholder-[#5e6680] transition-all"
          />
        </div>

        <div>
          <label className="block text-[#a8b0c5] font-sans text-[14px] mb-2">
            Genaue Branche / Spezialisierung *
          </label>
          <input 
            type="text" 
            value={formData.industry || ''}
            onChange={(e) => updateFormData('industry', e.target.value)}
            placeholder="z.B. Hochzeitsfotografie, Paartherapie..."
            className="w-full bg-[#12151e] border border-[rgba(255,255,255,0.06)] text-[#edf0f7] rounded-[8px] px-[12px] py-[12px] focus:outline-none focus:border-[#d4a850] focus:shadow-[0_0_0_3px_rgba(212,168,80,0.12)] font-sans text-[14px] placeholder-[#5e6680] transition-all"
            required
          />
        </div>
      </div>
    </div>
  );
}