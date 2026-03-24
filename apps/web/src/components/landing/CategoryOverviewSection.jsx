
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useColorCycle } from '@/hooks/useColorCycle';
import { useIntake } from '@/contexts/IntakeContext';
import CategoryCard from './CategoryCard';
import { 
  Palette, PenTool, Hammer, Flower2, Leaf, 
  Activity, Dumbbell, Apple, 
  Brain, Stethoscope, Waves, Compass, 
  Building2, Home, Scale, LineChart, Utensils, 
  HeartPulse, Smile, Sparkles, Eye, Bone, 
  Settings 
} from 'lucide-react';

export const defaultCategories = [
  // GREEN
  { id: 'bildende-kunst', title: 'Bildende Kunst', group: 'Kreativ & Kunst', color: '#3d6145', icon: Palette, desc: 'Portfolio & Galerie für Künstler' },
  { id: 'grafikdesign', title: 'Grafikdesign & Branding', group: 'Kreativ & Kunst', color: '#3d6145', icon: PenTool, desc: 'Agentur & Freelancer Präsenz' },
  { id: 'handwerk', title: 'Handwerk & Kunsthandwerk', group: 'Kreativ & Kunst', color: '#3d6145', icon: Hammer, desc: 'Manufaktur & Werkstatt' },
  { id: 'floristik', title: 'Floristik & Botanik', group: 'Kreativ & Kunst', color: '#3d6145', icon: Flower2, desc: 'Blumenstudios & Pflanzen' },
  { id: 'nachhaltige-brand', title: 'Nachhaltige Brand', group: 'Kreativ & Kunst', color: '#3d6145', icon: Leaf, desc: 'Eco-Friendly & Fairtrade' },
  // RED
  { id: 'physiotherapie', title: 'Physiotherapie', group: 'Gesundheit & Körper', color: '#9b2020', icon: Activity, desc: 'Praxis & Terminbuchung' },
  { id: 'personal-training', title: 'Personal Training', group: 'Gesundheit & Körper', color: '#9b2020', icon: Dumbbell, desc: 'Coaching & Fitness' },
  { id: 'ernaehrung', title: 'Ernährungsberatung', group: 'Gesundheit & Körper', color: '#9b2020', icon: Apple, desc: 'Health & Diet Coaching' },
  // PURPLE
  { id: 'psychotherapie', title: 'Psychotherapie', group: 'Psyche & Beratung', color: '#7040a0', icon: Brain, desc: 'Diskrete Praxispräsenz' },
  { id: 'psychiatrie', title: 'Psychiatrie', group: 'Psyche & Beratung', color: '#7040a0', icon: Stethoscope, desc: 'Medizinische Fachpraxis' },
  { id: 'hypnose', title: 'Hypnose & Hypnotherapie', group: 'Psyche & Beratung', color: '#7040a0', icon: Waves, desc: 'Spezialisierte Therapie' },
  { id: 'coaching', title: 'Beratung & Coaching', group: 'Psyche & Beratung', color: '#7040a0', icon: Compass, desc: 'Life & Business Coaching' },
  // YELLOW
  { id: 'architektur', title: 'Architektur & Innenarchitektur', group: 'Premium & Business', color: '#c4a850', icon: Building2, desc: 'Projektportfolio & Studio' },
  { id: 'immobilien', title: 'Immobilien & Luxury', group: 'Premium & Business', color: '#c4a850', icon: Home, desc: 'Makler & Real Estate' },
  { id: 'rechtsanwaelte', title: 'Rechtsanwälte & Kanzleien', group: 'Premium & Business', color: '#c4a850', icon: Scale, desc: 'Seriöse Kanzleipräsenz' },
  { id: 'finanzberatung', title: 'Finanzberatung & Vermögen', group: 'Premium & Business', color: '#c4a850', icon: LineChart, desc: 'Wealth Management' },
  { id: 'gastronomie', title: 'Premium Gastronomie', group: 'Premium & Business', color: '#c4a850', icon: Utensils, desc: 'Fine Dining & Hotellerie' },
  // BLUE
  { id: 'allgemeinmedizin', title: 'Allgemeinmedizin & Hausarzt', group: 'Medizin & Ärzte', color: '#2a6db5', icon: HeartPulse, desc: 'Moderne Arztpraxis' },
  { id: 'zahnmedizin', title: 'Zahnmedizin & Kieferorthopädie', group: 'Medizin & Ärzte', color: '#2a6db5', icon: Smile, desc: 'Dental Clinic & Ästhetik' },
  { id: 'dermatologie', title: 'Dermatologie & Ästhetik', group: 'Medizin & Ärzte', color: '#2a6db5', icon: Sparkles, desc: 'Hautarzt & Beauty' },
  { id: 'augenheilkunde', title: 'Augenheilkunde & Optik', group: 'Medizin & Ärzte', color: '#2a6db5', icon: Eye, desc: 'Ophthalmologie & Vision' },
  { id: 'orthopadie', title: 'Orthopädie & Sportmedizin', group: 'Medizin & Ärzte', color: '#2a6db5', icon: Bone, desc: 'Gelenk- & Sportpraxis' },
  // CUSTOM
  { id: 'custom', title: 'Andere Branche', group: 'Custom', color: '#888888', icon: Settings, desc: 'Maßgeschneiderte Lösung' }
];

export const groups = [
  { id: 'Alle', label: 'Alle', color: 'transparent' },
  { id: 'Kreativ & Kunst', label: 'Kreativ & Kunst', color: '#3d6145' },
  { id: 'Gesundheit & Körper', label: 'Gesundheit & Körper', color: '#9b2020' },
  { id: 'Psyche & Beratung', label: 'Psyche & Beratung', color: '#7040a0' },
  { id: 'Premium & Business', label: 'Premium & Business', color: '#c4a850' },
  { id: 'Medizin & Ärzte', label: 'Medizin & Ärzte', color: '#2a6db5' },
  { id: 'Custom', label: 'Custom', color: '#888888' }
];

const getRgb = (group) => {
  switch(group) {
    case 'Kreativ & Kunst': return 'var(--green-rgb)';
    case 'Gesundheit & Körper': return 'var(--red-rgb)';
    case 'Psyche & Beratung': return 'var(--purple-rgb)';
    case 'Premium & Business': return 'var(--yellow-rgb)';
    case 'Medizin & Ärzte': return 'var(--blue-rgb)';
    default: return 'var(--custom-rgb)';
  }
};

export default function CategoryOverviewSection({ 
  categories: externalCategories,
  activeGroup: externalActiveGroup,
  setActiveGroup: externalSetActiveGroup
}) {
  const [internalActiveGroup, setInternalActiveGroup] = useState('Alle');
  const navigate = useNavigate();
  const syncColor = useColorCycle(5000);
  const { setCategoryId } = useIntake();

  const activeGroup = externalActiveGroup !== undefined ? externalActiveGroup : internalActiveGroup;
  const setActiveGroup = externalSetActiveGroup || setInternalActiveGroup;

  const categoriesToRender = externalCategories || defaultCategories.filter(c => activeGroup === 'Alle' || c.group === activeGroup);
  const activeColor = activeGroup === 'Alle' ? syncColor : groups.find(g => g.id === activeGroup)?.color;

  const handleCategoryClick = (catId) => {
    setCategoryId(catId);
    navigate(`/intake/step1?niche=${catId}`);
  };

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const numCards = isMobile ? 3 : 6;
  const [visibleCards, setVisibleCards] = useState([]);

  // Initialize visible cards
  useEffect(() => {
    const shuffled = [...defaultCategories].sort(() => 0.5 - Math.random()).slice(0, numCards);
    setVisibleCards(shuffled);
  }, [numCards]);

  const isSearching = (externalCategories && externalCategories.length < defaultCategories.length) || activeGroup !== 'Alle';

  // Shuffle interval
  useEffect(() => {
    if (isSearching || visibleCards.length === 0) return;

    const interval = setInterval(() => {
      setVisibleCards(prev => {
        const newCards = [...prev];
        const numToSwap = 1; // Only swap 1 card per interval for smoother effect
        
        const available = defaultCategories.filter(c => !newCards.find(v => v.id === c.id));
        
        if (available.length > 0) {
          const idxToReplace = Math.floor(Math.random() * newCards.length);
          const randomAvailableIdx = Math.floor(Math.random() * available.length);
          newCards[idxToReplace] = available[randomAvailableIdx];
        }

        return newCards;
      });
    }, 5500); // Slower shuffle (5.5s)

    return () => clearInterval(interval);
  }, [isSearching, visibleCards.length]);

  const displayCards = isSearching ? categoriesToRender : (visibleCards.length > 0 ? visibleCards : defaultCategories.slice(0, numCards));

  return (
    <section id="nischen" className="relative py-16 px-6 bg-transparent overflow-visible">
      {/* Dynamic Grid Background */}
      <motion.div 
        className="absolute inset-0 grid-bg transition-colors duration-500 opacity-40" 
        style={{ '--grid-size': '40px' }}
        animate={{ '--grid-color': `${activeColor}20` }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full filter blur-[150px] pointer-events-none"
        animate={{ backgroundColor: activeColor, opacity: activeGroup === 'Alle' ? 0.03 : 0.06 }}
        transition={{ duration: 0.5 }}
      />

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Filter Pills */}
        <div className="flex overflow-x-auto pb-4 mb-12 gap-3 scrollbar-hide snap-x w-full max-w-full justify-start md:justify-center">
          {groups.map(g => {
            const isActive = activeGroup === g.id;
            const pillColor = g.id === 'Alle' ? syncColor : g.color;
            return (
              <button
                key={g.id}
                onClick={() => setActiveGroup(g.id)}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300 whitespace-nowrap snap-start ${
                  isActive 
                    ? 'border-transparent text-[#0a0f0d]' 
                    : 'border-[rgba(255,255,255,0.1)] text-[#888888] hover:border-[rgba(255,255,255,0.2)] hover:text-[#e8e4df]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFilterPill"
                    className="absolute inset-0 rounded-full z-0"
                    style={{ backgroundColor: pillColor }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <motion.span 
                  className="relative z-10 w-2 h-2 rounded-full shadow-sm" 
                  animate={{ backgroundColor: isActive ? '#0a0f0d' : pillColor }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10 text-sm font-medium">{g.label}</span>
              </button>
            );
          })}
        </div>

        {/* Grid Container */}
        <div className="relative max-w-[720px] mx-auto">
          <div 
            className={`cards-grid transition-[max-height] duration-[600ms] ease-in-out ${
              isSearching ? 'max-h-[2000px] overflow-visible' : 'max-h-[380px] overflow-hidden'
            }`}
          >
            {displayCards.map((cat, i) => {
              const rgb = getRgb(cat.group);
              
              return (
                <CategoryCard 
                  key={cat.id} 
                  cat={cat} 
                  onClick={() => handleCategoryClick(cat.id)} 
                  style={{ 
                    '--card-rgb': rgb,
                    animation: `cardSwapIn 0.6s ease-out ${i * 0.05}s both, glowPulse 4s ease-in-out infinite alternate`
                  }} 
                />
              );
            })}
          </div>

          {/* Gradient Overlay */}
          {!isSearching && (
            <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-b from-transparent to-[#0a0f0d] pointer-events-none z-10 transition-opacity duration-500" />
          )}
        </div>
      </div>
    </section>
  );
}
