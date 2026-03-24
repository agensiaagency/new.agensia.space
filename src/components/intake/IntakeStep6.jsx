import React from 'react';

export default function IntakeStep6({ formData, updateFormData }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-[28px] font-serif text-center text-[#edf0f7] mb-8">Kontaktdaten</h2>
      
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <label className="block text-[#a8b0c5] font-sans text-[14px] mb-2">
            Dein Name *
          </label>
          <input 
            type="text" 
            value={formData.name || ''}
            onChange={(e) => updateFormData('name', e.target.value)}
            placeholder="Max Mustermann"
            className="w-full bg-[#12151e] border border-[rgba(255,255,255,0.06)] text-[#edf0f7] rounded-[8px] px-[12px] py-[12px] focus:outline-none focus:border-[#d4a850] focus:shadow-[0_0_0_3px_rgba(212,168,80,0.12)] font-sans text-[14px] placeholder-[#5e6680] transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-[#a8b0c5] font-sans text-[14px] mb-2">
            E-Mail Adresse *
          </label>
          <input 
            type="email" 
            value={formData.email || ''}
            onChange={(e) => updateFormData('email', e.target.value)}
            placeholder="max@beispiel.de"
            className="w-full bg-[#12151e] border border-[rgba(255,255,255,0.06)] text-[#edf0f7] rounded-[8px] px-[12px] py-[12px] focus:outline-none focus:border-[#d4a850] focus:shadow-[0_0_0_3px_rgba(212,168,80,0.12)] font-sans text-[14px] placeholder-[#5e6680] transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-[#a8b0c5] font-sans text-[14px] mb-2">
            Telefonnummer (optional)
          </label>
          <input 
            type="tel" 
            value={formData.phone || ''}
            onChange={(e) => updateFormData('phone', e.target.value)}
            placeholder="+43 664 1234567"
            className="w-full bg-[#12151e] border border-[rgba(255,255,255,0.06)] text-[#edf0f7] rounded-[8px] px-[12px] py-[12px] focus:outline-none focus:border-[#d4a850] focus:shadow-[0_0_0_3px_rgba(212,168,80,0.12)] font-sans text-[14px] placeholder-[#5e6680] transition-all"
          />
        </div>

        <div>
          <label className="block text-[#a8b0c5] font-sans text-[14px] mb-2">
            Zusätzliche Nachricht (optional)
          </label>
          <textarea 
            value={formData.message || ''}
            onChange={(e) => updateFormData('message', e.target.value)}
            rows={3}
            placeholder="Gibt es noch etwas, das wir wissen sollten?"
            className="w-full bg-[#12151e] border border-[rgba(255,255,255,0.06)] text-[#edf0f7] rounded-[8px] px-[12px] py-[12px] focus:outline-none focus:border-[#d4a850] focus:shadow-[0_0_0_3px_rgba(212,168,80,0.12)] font-sans text-[14px] placeholder-[#5e6680] resize-none transition-all"
          />
        </div>
      </div>
    </div>
  );
}