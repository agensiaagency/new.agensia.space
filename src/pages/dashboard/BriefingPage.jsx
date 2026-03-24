
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';
import { categories, colorGroups } from '@/lib/categories.js';

const groupNames = {
  [colorGroups.green]: 'Kreativ & Kunst',
  [colorGroups.red]: 'Gesundheit & Körper',
  [colorGroups.violet]: 'Psyche & Beratung',
  [colorGroups.yellow]: 'Premium & Business',
  [colorGroups.blue]: 'Medizin & Ärzte'
};

export default function BriefingPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAndGroupedCategories = useMemo(() => {
    const filtered = categories.filter(cat => 
      cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const grouped = {};
    filtered.forEach(cat => {
      const groupColor = cat.color || '#888888';
      if (!grouped[groupColor]) {
        grouped[groupColor] = [];
      }
      grouped[groupColor].push(cat);
    });

    return grouped;
  }, [searchQuery]);

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 bg-[#08080a] min-h-screen">
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-[#a8b0c5] hover:text-[#c4a850] transition-colors mb-8 text-sm font-medium"
      >
        <ArrowLeft size={16} />
        Zurück zum Dashboard
      </button>

      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-serif text-[#e8e4df] mb-4">Neues Projekt starten</h1>
        <p className="text-[#a8b0c5] mb-8 max-w-2xl">
          Wähle deine Branche aus, um ein maßgeschneidertes Briefing zu starten. Wir haben spezifische Fragen für jede Nische vorbereitet.
        </p>

        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-[#a8b0c5]" />
          </div>
          <input
            type="text"
            placeholder="Branche suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0d0d0f] border border-[rgba(196,168,80,0.2)] rounded-xl py-3 pl-11 pr-4 text-[#e8e4df] placeholder:text-[#5e6680] focus:outline-none focus:border-[#c4a850] focus:ring-1 focus:ring-[#c4a850] transition-all"
          />
        </div>
      </div>

      <div className="space-y-12 pb-20">
        {Object.entries(filteredAndGroupedCategories).map(([color, cats], groupIndex) => (
          <motion.div 
            key={color}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-xl font-serif text-[#e8e4df]">
                {groupNames[color] || 'Weitere Branchen'}
              </h2>
              <div className="flex-1 h-px bg-[rgba(255,255,255,0.05)]"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {cats.map((category, index) => (
                <motion.div
                  key={category.id}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/intake/step1?niche=${category.id}&from=dashboard`)}
                  className="bg-[#0d0d0f] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(196,168,80,0.3)] rounded-xl p-6 cursor-pointer transition-all relative overflow-hidden group shadow-sm hover:shadow-lg hover:shadow-[#c4a850]/5"
                >
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 group-hover:w-2"
                    style={{ backgroundColor: category.color }}
                  />
                  <div className="pl-4">
                    <h3 className="text-lg font-medium text-[#e8e4df] mb-2 group-hover:text-[#c4a850] transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-sm text-[#a8b0c5] line-clamp-2">
                      {category.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        {Object.keys(filteredAndGroupedCategories).length === 0 && (
          <div className="text-center py-20 bg-[#0d0d0f] rounded-xl border border-[rgba(255,255,255,0.05)]">
            <p className="text-[#a8b0c5]">Keine Branchen für "{searchQuery}" gefunden.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-4 text-[#c4a850] hover:underline text-sm"
            >
              Suche zurücksetzen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
