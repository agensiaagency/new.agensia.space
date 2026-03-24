import React from 'react';

export default function ProgressBar({ currentStep, totalSteps = 7 }) {
  const progress = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="mb-12 w-full">
      <div className="flex justify-between mb-2">
        <span className="font-mono text-sm text-[#5e6680]">
          Schritt {currentStep} von {totalSteps}
        </span>
        <span className="font-mono text-sm text-[#5e6680]">
          {progress}%
        </span>
      </div>
      <div className="w-full h-2 bg-[#12151e] rounded-[8px] overflow-hidden">
        <div 
          className="h-full rounded-[8px] bg-[#d4a850] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}