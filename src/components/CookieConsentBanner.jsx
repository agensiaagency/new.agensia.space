import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookie_consent', 'rejected');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 pointer-events-none">
      <div className="max-w-4xl mx-auto bg-[rgba(12,14,20,0.95)] border border-[rgba(255,255,255,0.1)] rounded-[16px] p-6 shadow-2xl backdrop-blur-md pointer-events-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-sm text-[#a8b0c5] flex-1">
          <p className="mb-2">
            Wir verwenden Cookies, um unsere Website und unseren Service zu optimieren. 
            Einige sind essenziell, während andere uns helfen, diese Website und Ihre Erfahrung zu verbessern.
          </p>
          <div className="flex gap-4 text-xs">
            <Link to="/datenschutz" className="text-[#d4a850] hover:underline">Datenschutzerklärung</Link>
            <Link to="/impressum" className="text-[#d4a850] hover:underline">Impressum</Link>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
          <button 
            onClick={handleReject}
            className="px-6 py-2.5 rounded-md border border-[rgba(255,255,255,0.1)] text-[#edf0f7] hover:bg-[rgba(255,255,255,0.05)] transition-colors text-sm font-medium"
          >
            Ablehnen
          </button>
          <button 
            onClick={handleAccept}
            className="px-6 py-2.5 rounded-md bg-[#d4a850] text-[#08090d] hover:brightness-110 transition-colors text-sm font-medium"
          >
            Akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}