import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, Phone } from 'lucide-react';

export default function FooterSection() {
  return (
    <footer className="bg-[#08090d] border-t border-[rgba(255,255,255,0.06)] pt-[60px] pb-[40px] px-6">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-[14px] text-[#5e6680]">
          © 2026 agensia · built to grow
        </div>
        
        <div className="flex items-center gap-6">
          <a href="https://instagram.com/agensia.space" target="_blank" rel="noopener noreferrer" className="text-[#a8b0c5] hover:text-[#d4a850] transition-colors">
            <Instagram size={20} />
          </a>
          <a href="mailto:team@agensia.space" className="text-[#a8b0c5] hover:text-[#d4a850] transition-colors">
            <Mail size={20} />
          </a>
          <a href="tel:+4367763062277" className="text-[#a8b0c5] hover:text-[#d4a850] transition-colors">
            <Phone size={20} />
          </a>
        </div>

        <div className="flex items-center gap-6 text-[14px]">
          <Link to="/impressum" className="text-[#a8b0c5] hover:text-[#d4a850] transition-colors">
            Impressum
          </Link>
          <Link to="/datenschutz" className="text-[#a8b0c5] hover:text-[#d4a850] transition-colors">
            Datenschutz
          </Link>
        </div>
      </div>
    </footer>
  );
}