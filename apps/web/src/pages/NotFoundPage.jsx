import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import GridBackgroundPattern from '@/components/GridBackgroundPattern';

export default function NotFoundPage() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="min-h-screen bg-[#0a0f0d] flex flex-col items-center justify-center relative overflow-hidden p-6">
      <GridBackgroundPattern useCycle={true} glowOpacity={0.05} />
      
      <div className="relative z-10 text-center flex flex-col items-center">
        <h1 className="font-serif text-[15vw] leading-none text-[#c4a850] drop-shadow-[0_0_40px_rgba(196,168,80,0.3)] mb-4 select-none">
          404
        </h1>
        
        <h2 className="font-serif text-3xl md:text-4xl text-[#e8e4df] mb-4">
          Diese Seite existiert nicht.
        </h2>
        
        <p className="font-sans text-[#a8b0c5] max-w-md mx-auto mb-10">
          Die gesuchte Seite wurde möglicherweise verschoben, gelöscht oder hat nie existiert.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link 
            to="/"
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#c4a850] text-[#0a0f0d] font-sans font-bold rounded-xl hover:brightness-110 transition-all shadow-[0_0_20px_rgba(196,168,80,0.2)] w-full sm:w-auto"
          >
            <ArrowLeft size={18} />
            Zurück zur Startseite
          </Link>
          
          {isLoggedIn && (
            <Link 
              to="/dashboard/overview"
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#141210] border border-[rgba(196,168,80,0.2)] text-[#e8e4df] font-sans font-medium rounded-xl hover:border-[#c4a850] hover:bg-[rgba(196,168,80,0.05)] transition-all w-full sm:w-auto"
            >
              <LayoutDashboard size={18} className="text-[#c4a850]" />
              Oder zum Dashboard &rarr;
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}