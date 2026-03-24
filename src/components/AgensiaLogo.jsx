
import React from 'react';

export default function AgensiaLogo({ size = 24, className = '', gold = false }) {
  const logoUrl = "https://horizons-cdn.hostinger.com/67357552-8853-48d7-8923-da429bc58e11/89b0de19132db8b665801f5e770f907a.png";
  
  return (
    <img 
      src={logoUrl} 
      alt="Agensia Logo"
      width={size}
      height={size}
      className={`transition-all duration-300 ${gold ? 'filter-gold' : 'filter-white group-hover:filter-gold'} ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
