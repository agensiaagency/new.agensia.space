
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SearchBar from '@/components/SearchBar';
import CategoryOverviewSection, { defaultCategories } from '@/components/landing/CategoryOverviewSection';
import PricingSection from '@/components/landing/PricingSection';

export default function IntakeLandingPage() {
  const [selectedColor, setSelectedColor] = useState('Alle');
  const [filteredCategories, setFilteredCategories] = useState(defaultCategories);

  return (
    <div className="flex-1 flex flex-col bg-[#08080a] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 pt-20 pb-10 w-full">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <motion.h1 
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-serif mb-6 text-[#edf0f7]"
          >
            Finde dein perfektes Setup.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl text-[#a8b0c5] mb-10"
          >
            Suche nach deiner Branche, um maßgeschneiderte Empfehlungen und Funktionen für deine neue Website zu erhalten.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-[48px]"
        >
          <SearchBar 
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            onSearch={setFilteredCategories}
            allCategories={defaultCategories}
          />
        </motion.div>
      </div>

      <CategoryOverviewSection 
        categories={filteredCategories}
        activeGroup={selectedColor}
        setActiveGroup={setSelectedColor}
      />

      <PricingSection />
    </div>
  );
}
