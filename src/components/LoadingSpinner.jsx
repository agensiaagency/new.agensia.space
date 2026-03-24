
import React from 'react';
import AgensiaLogo from '@/components/AgensiaLogo.jsx';

export default function LoadingSpinner({ fullScreen = false }) {
  const containerClasses = fullScreen 
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0f0d]"
    : "flex flex-col items-center justify-center w-full h-full min-h-[200px] p-8";

  return (
    <div className={containerClasses}>
      <div className="relative flex items-center justify-center w-16 h-16 mb-4">
        {/* Outer spinning ring */}
        <div className="absolute inset-0 rounded-full border-t-2 border-[#c4a850] opacity-20 animate-spin" style={{ animationDuration: '3s' }}></div>
        {/* Inner pulsing icon */}
        <AgensiaLogo size={32} gold className="animate-pulse drop-shadow-[0_0_15px_rgba(196,168,80,0.5)]" />
      </div>
      <span className="font-sans text-sm text-[#888888] tracking-widest uppercase">laden...</span>
    </div>
  );
}
