import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function PortfolioCarousel() {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('portfolio_entries');
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    } else {
      setEntries([
        { id: 1, title: 'Kreativ Studio', imageUrl: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=800&q=80' },
        { id: 2, title: 'Praxis Dr. Schmidt', imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80' }
      ]);
    }
  }, []);

  const scroll = (dir) => {
    if (scrollRef.current) {
      const amount = dir === 'left' ? -500 : 500;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <section id="portfolio" className="py-24 px-6 bg-[#08090d] border-y border-[rgba(255,255,255,0.06)] overflow-hidden max-w-[1600px] mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl md:text-5xl font-serif text-[#edf0f7] mb-2">Unsere Arbeiten</h2>
          <p className="text-[#a8b0c5]">Echte Projekte. Echte Ergebnisse.</p>
        </div>
        <div className="hidden md:flex gap-4">
          <button onClick={() => scroll('left')} className="w-12 h-12 rounded-full border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[#edf0f7] hover:bg-[rgba(255,255,255,0.05)] transition-colors">
            <ChevronLeft size={24} />
          </button>
          <button onClick={() => scroll('right')} className="w-12 h-12 rounded-full border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[#edf0f7] hover:bg-[rgba(255,255,255,0.05)] transition-colors">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {entries.map((entry) => (
          <div 
            key={entry.id}
            className="snap-center shrink-0 w-[85vw] md:w-[400px] lg:w-[500px] h-[400px] relative bg-[rgba(12,14,20,0.7)] border border-[rgba(255,255,255,0.08)] rounded-[20px] overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:border-[#d4a850] hover:shadow-[0_0_30px_rgba(212,168,80,0.2)]"
          >
            {entry.websiteUrl ? (
              <div className="w-full h-full overflow-hidden relative">
                <iframe 
                  src={entry.websiteUrl} 
                  className="absolute top-0 left-0 w-[285%] h-[285%] origin-top-left scale-[0.35] pointer-events-none border-none"
                  title={entry.title}
                />
              </div>
            ) : (
              <img src={entry.imageUrl} alt={entry.title} className="w-full h-full object-cover" />
            )}
            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#08090d] to-transparent">
              <h3 className="text-xl font-serif text-[#edf0f7]">{entry.title}</h3>
            </div>
          </div>
        ))}

        {/* CTA Card */}
        <div className="snap-center shrink-0 w-[85vw] md:w-[400px] lg:w-[500px] h-[400px] relative border-2 border-[#d4a850] rounded-[20px] flex flex-col items-center justify-center p-8 text-center bg-[rgba(212,168,80,0.05)] shadow-[0_0_30px_rgba(212,168,80,0.1)]">
          <h3 className="text-3xl font-serif text-[#edf0f7] mb-2">Deine Website?</h3>
          <p className="text-[#a8b0c5] mb-8">Starte jetzt dein Projekt</p>
          <button 
            onClick={() => navigate('/intake')}
            className="px-8 py-3 bg-[#d4a850] text-[#08090d] rounded-md font-medium hover:brightness-110 transition-all"
          >
            Jetzt starten
          </button>
        </div>
      </div>
    </section>
  );
}