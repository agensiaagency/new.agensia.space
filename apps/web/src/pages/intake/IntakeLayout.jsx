import React, { useEffect } from 'react';
import { Outlet, useLocation, Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useIntake } from '@/contexts/IntakeContext';
import GridBackgroundPattern from '@/components/GridBackgroundPattern';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
};

export default function IntakeLayout() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const nicheParam = searchParams.get('niche');
  const { category, categoryId, setCategoryId } = useIntake();
  
  useEffect(() => {
    if (nicheParam && nicheParam !== categoryId) {
      setCategoryId(nicheParam);
    }
  }, [nicheParam, categoryId, setCategoryId]);

  const stepMatch = location.pathname.match(/step(\d)/);
  const currentStep = stepMatch ? parseInt(stepMatch[1]) : (location.pathname.includes('confirmation') ? 6 : 0);
  const totalSteps = 5;
  const progress = currentStep > 0 && currentStep <= totalSteps ? (currentStep / totalSteps) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-[#e8e4df] font-sans flex flex-col relative">
      <GridBackgroundPattern opacity={0.04} useCycle={true} glowOpacity={0.06} />
      
      {/* Progress Bar */}
      {currentStep > 0 && currentStep <= totalSteps && (
        <div className="fixed top-0 left-0 w-full h-1.5 bg-[rgba(255,255,255,0.1)] z-50">
          <div 
            className="h-full transition-all duration-500 ease-out"
            style={{ 
              width: `${progress}%`, 
              backgroundColor: category?.color || '#888888' 
            }}
          />
        </div>
      )}

      <main className="flex-1 flex flex-col relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="flex-1 flex flex-col"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="py-8 border-t border-[rgba(255,255,255,0.05)] text-center text-sm text-[#888888] relative z-10">
        <div className="mb-2">
          agensia webdesign · Projekt-Briefing {category ? `[${category.title}]` : ''}
        </div>
        <div className="flex justify-center gap-4">
          <Link to="/impressum" className="hover:text-[#e8e4df] transition-colors">Impressum</Link>
          <span>|</span>
          <Link to="/datenschutz" className="hover:text-[#e8e4df] transition-colors">Datenschutz</Link>
        </div>
      </footer>
    </div>
  );
}