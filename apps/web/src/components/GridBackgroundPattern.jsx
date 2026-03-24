import React from 'react';

export default function GridBackgroundPattern({ opacity = 0.04, lineColor = '#1a1f1c', useCycle = false }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Optimized CSS Linear Gradient Grid */}
      <div 
        className="absolute inset-0" 
        style={{ 
          backgroundImage: `linear-gradient(${lineColor} 1px, transparent 1px), linear-gradient(90deg, ${lineColor} 1px, transparent 1px)`, 
          backgroundSize: '60px 60px',
          opacity: opacity
        }} 
      />
      
      {/* Cursor Glow using CSS Variables updated by useCursorGlow */}
      <div 
        className="absolute inset-0 opacity-30 mix-blend-screen transition-opacity duration-300"
        style={{ 
          background: `radial-gradient(600px circle at var(--cursor-x, 50%) var(--cursor-y, 50%), rgba(196,168,80,0.12), transparent 40%)` 
        }}
      />
    </div>
  );
}