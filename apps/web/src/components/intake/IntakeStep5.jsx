import React from 'react';

export default function IntakeStep5({ formData, updateFormData }) {
  const colorOptions = ['Dunkel', 'Hell', 'Bunt', 'Pastell', 'Monochrom'];
  const styleOptions = ['Modern', 'Klassisch', 'Minimalistisch', 'Verspielt'];

  const toggleColor = (color) => {
    const current = formData.colors ? formData.colors.split(',') : [];
    if (current.includes(color)) {
      updateFormData('colors', current.filter(c => c !== color).join(','));
    } else {
      updateFormData('colors', [...current, color].join(','));
    }
  };

  const selectedColors = formData.colors ? formData.colors.split(',') : [];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-[28px] font-serif text-center text-[#edf0f7] mb-8">Design & Ästhetik</h2>
      
      <div className="max-w-xl mx-auto space-y-8">
        {/* Colors */}
        <div>
          <label className="block text-[#a8b0c5] font-sans text-[14px] mb-3">
            Farbwelt (Mehrfachauswahl möglich)
          </label>
          <div className="flex flex-wrap gap-3">
            {colorOptions.map(color => {
              const isSelected = selectedColors.includes(color);
              return (
                <button
                  key={color}
                  onClick={() => toggleColor(color)}
                  className={`px-4 py-2 rounded-full border text-sm font-sans transition-all ${
                    isSelected 
                      ? 'border-[#d4a850] bg-[rgba(212,168,80,0.1)] text-[#d4a850]' 
                      : 'border-[rgba(255,255,255,0.2)] text-[#a8b0c5] hover:border-[rgba(255,255,255,0.3)]'
                  }`}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>

        {/* Style */}
        <div>
          <label className="block text-[#a8b0c5] font-sans text-[14px] mb-3">
            Stilrichtung
          </label>
          <div className="grid grid-cols-2 gap-3">
            {styleOptions.map(style => {
              const isSelected = formData.style === style;
              return (
                <label 
                  key={style}
                  className={`p-3 rounded-[12px] border text-center cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-[#d4a850] bg-[rgba(212,168,80,0.1)] text-[#d4a850]' 
                      : 'border-[rgba(255,255,255,0.1)] text-[#a8b0c5] hover:border-[rgba(255,255,255,0.2)]'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="style" 
                    value={style} 
                    checked={isSelected}
                    onChange={(e) => updateFormData('style', e.target.value)}
                    className="hidden"
                  />
                  <span className="text-sm font-sans">{style}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* References */}
        <div>
          <label className="block text-[#a8b0c5] font-sans text-[14px] mb-2">
            Referenz-Websites (optional)
          </label>
          <input 
            type="text" 
            value={formData.references || ''}
            onChange={(e) => updateFormData('references', e.target.value)}
            placeholder="Links zu Websites, die dir gefallen..."
            className="w-full bg-[#12151e] border border-[rgba(255,255,255,0.06)] text-[#edf0f7] rounded-[8px] px-[12px] py-[12px] focus:outline-none focus:border-[#d4a850] focus:shadow-[0_0_0_3px_rgba(212,168,80,0.12)] font-sans text-[14px] placeholder-[#5e6680] transition-all"
          />
        </div>
      </div>
    </div>
  );
}