import React from 'react';
import { LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import NotificationBell from '../NotificationBell';

export default function DashboardHeader({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.name ? user.name.substring(0, 2).toUpperCase() : 'U';
  const firstName = user?.name ? user.name.split(' ')[0] : 'User';

  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 lg:gap-8 mb-6 md:mb-8 lg:mb-10 w-full">
      <div className="flex items-center gap-4 w-full md:w-auto">
        {onMenuClick && (
          <button 
            onClick={onMenuClick} 
            className="md:hidden p-2 -ml-2 text-[#a8b0c5] hover:text-[#c4a850] min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
            aria-label="Menü öffnen"
          >
            <Menu size={24} />
          </button>
        )}
        <div>
          <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl text-[#edf0f7] mb-1 md:mb-2">
            Hallo {firstName}
          </h1>
          <p className="text-sm md:text-base text-[#a8b0c5] font-sans">
            Willkommen in deinem Projekt-Dashboard.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 self-end md:self-auto">
        <NotificationBell />
        
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 px-4 py-2.5 md:py-3 min-h-[44px] border border-[#d4a850]/50 text-[#d4a850] rounded-md hover:bg-[#d4a850] hover:text-[#08090d] transition-colors text-sm md:text-base font-medium"
        >
          <LogOut size={20} />
          <span className="hidden sm:inline">Abmelden</span>
        </button>
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#d4a850] flex items-center justify-center text-[#08090d] font-serif text-lg md:text-xl font-bold shadow-lg shrink-0">
          {initials}
        </div>
      </div>
    </header>
  );
}