
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import AgensiaLogo from '@/components/AgensiaLogo.jsx';

export default function StickyNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const { isLoggedIn, logout } = useAuth();

  const navLinks = [
    { id: 'how-it-works', label: 'Ablauf' },
    { id: 'nischen', label: 'Branchen' },
    { id: 'preise', label: 'Preise' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, id) => {
    if (isHome) {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
      }
    } else {
      navigate(`/#${id}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "bg-[rgba(10,15,13,0.95)] backdrop-blur-lg py-4 shadow-[0_1px_0_rgba(255,255,255,0.05)]" : "bg-[rgba(10,15,13,0)] py-6"
      }`}
      style={{ willChange: 'background-color, padding' }}
    >
      <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <AgensiaLogo size={24} />
          <span className="text-2xl font-serif lowercase text-[#e8e4df] leading-none tracking-wide">
            agensia
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`/#${link.id}`}
              onClick={(e) => handleNavClick(e, link.id)}
              className="text-sm font-medium text-[#e8e4df] hover:text-white transition-colors opacity-80 hover:opacity-100"
            >
              {link.label}
            </a>
          ))}
          
          <div className="w-px h-5 bg-[rgba(255,255,255,0.1)] mx-2"></div>

          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="px-5 py-2 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#e8e4df] text-sm font-medium hover:bg-[rgba(255,255,255,0.1)] transition-all">
                Dashboard
              </Link>
              <button onClick={() => { logout(); navigate('/'); }} className="text-sm font-medium text-[#888888] hover:text-[#e8e4df] transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/auth" className="px-5 py-2 rounded-full bg-[#e8e4df] text-[#0a0f0d] text-sm font-medium hover:brightness-90 transition-all">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-[#e8e4df]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#0a0f0d] border-b border-[rgba(255,255,255,0.05)] p-6 flex flex-col gap-4 md:hidden shadow-2xl">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`/#${link.id}`}
              onClick={(e) => handleNavClick(e, link.id)}
              className="py-2 text-lg text-[#e8e4df] opacity-80 hover:opacity-100"
            >
              {link.label}
            </a>
          ))}
          
          <div className="h-px w-full bg-[rgba(255,255,255,0.1)] my-2"></div>
          
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-[#e8e4df] py-2 text-lg font-medium">
                Dashboard
              </Link>
              <button onClick={() => { logout(); setMobileMenuOpen(false); navigate('/'); }} className="text-left text-[#888888] py-2 text-lg font-medium">
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="text-[#e8e4df] py-2 text-lg font-medium">
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
