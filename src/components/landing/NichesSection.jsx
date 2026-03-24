import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Palette, Heart, Brain, Settings } from 'lucide-react';

export default function NichesSection() {
  const navigate = useNavigate();

  const niches = [
    {
      title: 'Kreative & Künstler',
      icon: Palette,
      color: '#3d6145',
      glow: 'rgba(61,97,69,0.3)',
      desc: 'Portfolios, Galerien, Kreativ-Websites',
      param: 'kreative'
    },
    {
      title: 'Gesundheit & Körper',
      icon: Heart,
      color: '#9b2020',
      glow: 'rgba(155,32,32,0.3)',
      desc: 'Fitness, Physiotherapie, Wellness',
      param: 'gesundheit'
    },
    {
      title: 'Psyche & Geist',
      icon: Brain,
      color: '#7040a0',
      glow: 'rgba(112,64,160,0.3)',
      desc: 'Coaching, Therapie, Beratung',
      param: 'psyche'
    },
    {
      title: 'Custom',
      icon: Settings,
      color: 'rgba(255,255,255,0.2)',
      glow: 'rgba(255,255,255,0.1)',
      desc: 'Etwas anderes? Wir finden eine Lösung.',
      param: 'custom'
    }
  ];

  return (
    <section id="nischen" className="py-24 px-6 bg-[#08090d] border-t border-[rgba(255,255,255,0.06)]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-[48px] font-serif text-[#edf0f7] mb-4">Für wen wir bauen</h2>
          <p className="text-[18px] text-[#a8b0c5]">Egal welche Branche — wir bauen Websites, die wachsen.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {niches.map((niche, index) => (
            <button
              key={index}
              onClick={() => navigate(`/intake?niche=${niche.param}`)}
              className="text-left p-8 rounded-[16px] bg-[rgba(12,14,20,0.7)] border border-[rgba(255,255,255,0.08)] transition-all duration-300 hover:scale-[1.02] group"
              style={{ borderTop: `4px solid ${niche.color}` }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 0 30px ${niche.glow}`}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
            >
              <div 
                className="inline-block p-4 rounded-full mb-6 transition-colors"
                style={{ backgroundColor: niche.color }}
              >
                <niche.icon size={28} className="text-white" />
              </div>
              <h3 className="text-2xl font-serif text-[#edf0f7] mb-2">{niche.title}</h3>
              <p className="text-[#a8b0c5] font-sans">{niche.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}