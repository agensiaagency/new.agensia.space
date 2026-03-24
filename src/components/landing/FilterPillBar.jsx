import React from 'react';
import { motion } from 'framer-motion';

export default function FilterPillBar({ filters, activeFilter, onFilterChange }) {
  return (
    <div className="flex overflow-x-auto pb-4 mb-12 gap-3 scrollbar-hide snap-x w-full max-w-full">
      {filters.map(f => {
        const isActive = activeFilter === f.id;
        return (
          <button
            key={f.id}
            onClick={() => onFilterChange(f.id)}
            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-200 whitespace-nowrap snap-start ${
              isActive 
                ? 'border-transparent text-white' 
                : 'border-[rgba(255,255,255,0.1)] text-[#888888] hover:border-[rgba(255,255,255,0.2)] hover:text-[#e8e4df]'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeFilterPill"
                className="absolute inset-0 rounded-full z-0"
                style={{ backgroundColor: f.color }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span 
              className="relative z-10 w-2.5 h-2.5 rounded-full shadow-sm" 
              style={{ backgroundColor: isActive ? '#ffffff' : f.color }} 
            />
            <span className="relative z-10 text-sm font-medium">{f.label}</span>
          </button>
        );
      })}
    </div>
  );
}