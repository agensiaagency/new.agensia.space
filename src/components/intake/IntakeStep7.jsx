import React from 'react';

export default function IntakeStep7({ formData }) {
  const renderRow = (label, value) => (
    <div className="flex flex-col sm:flex-row sm:gap-4 mb-2">
      <span className="text-[#5e6680] font-sans text-sm sm:w-1/3">{label}:</span>
      <span className="text-[#edf0f7] font-sans text-sm sm:w-2/3">{value || '-'}</span>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-[28px] font-serif text-center text-[#edf0f7] mb-8">Zusammenfassung</h2>
      
      <div className="bg-[#12151e] border border-[rgba(255,255,255,0.06)] rounded-[16px] p-6 md:p-8 max-w-2xl mx-auto">
        
        {/* Section 1 */}
        <div className="border-b border-[rgba(255,255,255,0.06)] pb-6 mb-6">
          <h3 className="text-[#d4a850] font-sans font-medium text-sm uppercase tracking-wider mb-4">Branche & Business</h3>
          {renderRow('Branche', formData.niche)}
          {renderRow('Firmenname', formData.company_name)}
          {renderRow('Website', formData.website)}
          {renderRow('Spezialisierung', formData.industry)}
        </div>

        {/* Section 2 */}
        <div className="border-b border-[rgba(255,255,255,0.06)] pb-6 mb-6">
          <h3 className="text-[#d4a850] font-sans font-medium text-sm uppercase tracking-wider mb-4">Paket & Budget</h3>
          {renderRow('Gewähltes Paket', formData.package)}
          {formData.package === 'custom' && renderRow('Budget', formData.budget)}
        </div>

        {/* Section 3 */}
        <div className="border-b border-[rgba(255,255,255,0.06)] pb-6 mb-6">
          <h3 className="text-[#d4a850] font-sans font-medium text-sm uppercase tracking-wider mb-4">Ziele & Design</h3>
          {renderRow('Ziele', formData.goals)}
          {renderRow('Farben', formData.colors)}
          {renderRow('Stil', formData.style)}
          {renderRow('Referenzen', formData.references)}
        </div>

        {/* Section 4 */}
        <div>
          <h3 className="text-[#d4a850] font-sans font-medium text-sm uppercase tracking-wider mb-4">Kontaktdaten</h3>
          {renderRow('Name', formData.name)}
          {renderRow('E-Mail', formData.email)}
          {renderRow('Telefon', formData.phone)}
          {renderRow('Nachricht', formData.message)}
        </div>

      </div>
    </div>
  );
}