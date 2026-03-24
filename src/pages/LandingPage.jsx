import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import StickyNav from '../components/StickyNav';
import HeroSection from '../components/landing/HeroSection';
import HowItWorks from '../components/landing/HowItWorks';
import CategoryOverviewSection, { defaultCategories } from '../components/landing/CategoryOverviewSection';
import PricingSection from '../components/landing/PricingSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import CTABannerSection from '../components/landing/CTABannerSection';
import FooterSection from '../components/landing/FooterSection';
import SearchBar from '../components/SearchBar';

export default function LandingPage() {
  const [selectedColor, setSelectedColor] = useState('Alle');
  const [filteredCategories, setFilteredCategories] = useState(defaultCategories);

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-[#e8e4df] relative selection:bg-[#f59e0b] selection:text-[#0a0f0d]">
      <Helmet>
        <title>agensia · Webdesign für Kreative, Therapeuten & Coaches</title>
      </Helmet>

      <StickyNav />
      <HeroSection />
      <HowItWorks />
      
      <div className="max-w-[1400px] mx-auto px-6 mb-12 mt-12">
        <SearchBar 
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          onSearch={setFilteredCategories}
          allCategories={defaultCategories}
        />
      </div>
      
      <CategoryOverviewSection 
        categories={filteredCategories}
        activeGroup={selectedColor}
        setActiveGroup={setSelectedColor}
      />
      
      <PricingSection />
      <TestimonialsSection />
      <CTABannerSection />
      <FooterSection />
    </div>
  );
}