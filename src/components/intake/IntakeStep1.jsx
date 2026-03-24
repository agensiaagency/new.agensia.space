import React, { useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { Palette, Heart, Brain, Settings } from 'lucide-react';

export default function IntakeStep1({ formData, updateFormData }) {
  const [searchParams] = useSearchParams();
  const { niche: urlNiche } = useParams();

  const niches = [
    { id: 'kreative', title: 'Kreative & Künstler', icon: Palette, color: '#3d6145', glow: 'rgba(61,97,69,0.3)' },
    { id: 'gesundheit', title: 'Gesundheit & Körper', icon: Heart, color: '#9b2020', glow: 'rgba(155,32,32,0.3)' },
    { id: 'psyche', title: 'Psyche & Geist', icon: Brain, color: '#7040a0', glow: 'rgba(112,64,160,0.3)' },
    { id: 'custom', title: 'Custom', icon: Settings, color: 'rgba(255,255,255,0.2)', glow: 'rgba(255,255,255,0.1)' }
  ];

  useEffect(() => {
    const nicheParam = searchParams.get('niche') || urlNiche;
    if (nicheParam && !formData.niche) {
      const found = niches.find(n => n.id === nicheParam);
      if (found) {
        updateFormData('niche', found.id);
      }
    }
  }, [searchParams, urlNiche, formData.niche, updateFormData]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-[28px] font-serif text-center text-[#edf0f7] mb-8">Wähle deine Branche</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {niches.map((niche) => {
          const isSelected = formData.niche === niche.id;
          const Icon = niche.icon;
          
          return (
            <button
              key={niche.id}
              onClick={() => updateFormData('niche', niche.id)}
              className={`p-6 rounded-[16px] bg-[rgba(12,14,20,0.7)] border text-left transition-all duration-300 group ${
                isSelected 
                  ? 'scale-[1.02]' 
                  : 'border-[rgba(255,255,255,0.08)] hover:scale-[1.02]'
              }`}
              style={{
                borderColor: isSelected ? niche.color : undefined,
                boxShadow: isSelected ? `0 0 20px ${niche.glow}` : undefined,
              }}
              onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.boxShadow = `0 0 20px ${niche.glow}`;
              }}
              onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div 
                className="inline-block p-4 rounded-full mb-4 text-white transition-colors"
                style={{ backgroundColor: niche.color }}
              >
                <Icon size={24} />
              </div>
              <h3 className="text-lg font-sans font-medium text-[#edf0f7]">{niche.title}</h3>
            </button>
          );
        })}
      </div>
    </div>
  );
}