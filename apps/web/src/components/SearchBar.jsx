import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

const niches = [
  "Grafiker", "Physiotherapie", "Zahnmedizin", "Webdesigner", "Fotograf", "Friseur", 
  "Rechtsanwalt", "Zahnarzt", "Arzt", "Therapeut", "Coach", "Berater", "Agentur", 
  "Startup", "E-Commerce", "Restaurant", "Hotel", "Fitness", "Yoga", "Meditation", 
  "Coaching", "Consulting", "Marketing", "SEO", "Social Media", "Content Creator", 
  "Influencer", "Blogger", "Podcast", "Musik", "Künstler", "Maler", "Bildhauer", 
  "Fotografie", "Videografie", "Animation", "3D Design", "Illustration", "Branding", 
  "Logo Design", "Packaging", "Print Design", "Web Design", "App Development", 
  "Software", "IT Consulting", "Cybersecurity", "Cloud Services", "Data Analytics", 
  "Machine Learning", "AI Services", "Blockchain", "Crypto", "NFT", "Gaming", 
  "Esports", "Streaming", "Virtual Reality", "Augmented Reality", "Metaverse", "Web3"
];

export default function SearchBar({ selectedColor, setSelectedColor, onSearch, allCategories }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textRef = useRef(null);

  // Optimized Typing animation using DOM mutation instead of React state
  useEffect(() => {
    if (isFocused || query !== '') {
      if (textRef.current) textRef.current.textContent = '';
      return;
    }

    let currentWordIdx = 0;
    let currentCharIdx = 0;
    let isDeleting = false;
    let timeoutId;

    const type = () => {
      const currentWord = niches[currentWordIdx];

      if (isDeleting) {
        currentCharIdx--;
        if (textRef.current) textRef.current.textContent = currentWord.substring(0, currentCharIdx);

        if (currentCharIdx === 0) {
          isDeleting = false;
          currentWordIdx = (currentWordIdx + 1) % niches.length;
          timeoutId = setTimeout(type, 500);
        } else {
          timeoutId = setTimeout(type, 40);
        }
      } else {
        currentCharIdx++;
        if (textRef.current) textRef.current.textContent = currentWord.substring(0, currentCharIdx);

        if (currentCharIdx === currentWord.length) {
          isDeleting = true;
          timeoutId = setTimeout(type, 2000); // Pause before deleting
        } else {
          timeoutId = setTimeout(type, 80); // Typing speed
        }
      }
    };

    timeoutId = setTimeout(type, 80);

    return () => clearTimeout(timeoutId);
  }, [isFocused, query]);

  // Filtering logic
  useEffect(() => {
    let filtered = allCategories || [];
    
    if (selectedColor && selectedColor !== 'Alle') {
      filtered = filtered.filter(c => c.group === selectedColor);
    }
    
    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(q) || 
        (c.desc && c.desc.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q))
      );
    }
    
    if (onSearch) {
      onSearch(filtered);
    }
  }, [query, selectedColor, allCategories, onSearch]);

  return (
    <div className="relative w-full max-w-[680px] mx-auto h-[64px] bg-[rgba(20,18,16,0.8)] rounded-[12px]">
      <div className="absolute inset-y-0 left-[20px] flex items-center pointer-events-none z-10">
        <Search size={20} className="text-[#888888]" />
      </div>
      
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={isFocused ? "Suche nach Branche..." : ""}
        className={`w-full h-full bg-transparent border-[1.5px] rounded-[12px] pl-[52px] pr-4 text-[#e8e4df] text-[18px] placeholder-[rgba(232,228,223,0.5)] focus:outline-none transition-all relative z-20 ${
          isFocused 
            ? 'border-[#c4a850] shadow-[0_0_20px_rgba(196,168,80,0.15)]' 
            : 'border-[rgba(196,168,80,0.2)]'
        }`}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      />

      {query === '' && !isFocused && (
        <div className="absolute inset-0 flex items-center pl-[52px] pointer-events-none z-0 overflow-hidden rounded-[12px]">
          <span className="text-[rgba(232,228,223,0.5)] text-[18px] whitespace-nowrap" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Suche nach <span ref={textRef}></span>
            <span className="animate-pulse">|</span>
          </span>
        </div>
      )}
    </div>
  );
}