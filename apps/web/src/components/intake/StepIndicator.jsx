import React, { memo } from 'react';
import { Check } from 'lucide-react';

const StepIcon = memo(({ stepNumber, isCompleted, isCurrent }) => {
  const isActive = isCompleted || isCurrent;
  
  return (
    <div 
      className={`step-icon w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${
        isActive 
          ? 'bg-[#d4a850] text-[#08090d]' 
          : 'bg-[#12151e] border border-[rgba(255,255,255,0.08)] text-[#5e6680]'
      }`}
      style={{ '--step-color-rgb': isActive ? '212, 168, 80' : '255, 255, 255' }}
    >
      {isCompleted ? (
        <Check size={16} className="sm:w-5 sm:h-5 relative z-10" />
      ) : (
        <span className="font-serif text-sm sm:text-base relative z-10">{stepNumber}</span>
      )}
    </div>
  );
});

StepIcon.displayName = 'StepIcon';

export default function StepIndicator({ currentStep, totalSteps = 7 }) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center w-full mb-8">
      {steps.map((stepNumber, index) => {
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <React.Fragment key={stepNumber}>
            <StepIcon stepNumber={stepNumber} isCompleted={isCompleted} isCurrent={isCurrent} />
            {index < steps.length - 1 && (
              <div 
                className={`flex-1 h-[2px] mx-2 sm:mx-3 transition-colors duration-300 ${
                  isCompleted ? 'bg-[#d4a850]' : 'bg-[rgba(255,255,255,0.08)]'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}