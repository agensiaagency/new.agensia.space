
import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart3, Folder, FileText, MessageSquare, 
  Paperclip, GitPullRequest, ClipboardList, Settings, LogOut, 
  Users, Mail, Bell, User, Calendar, Clock, PieChart, PenTool
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import AgensiaLogo from '@/components/AgensiaLogo.jsx';

export default function DashboardSidebar() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard/overview', label: 'Übersicht', icon: BarChart3 },
    { path: '/dashboard/projects', label: 'Meine Projekte', icon: Folder },
    { path: '/dashboard/forms', label: 'Formulare', icon: FileText },
    { path: '/dashboard/website-content', label: 'Website-Inhalte', icon: PenTool },
    { path: '/dashboard/revisions', label: 'Revisionen', icon: GitPullRequest },
    { path: '/dashboard/messages', label: 'Nachrichten', icon: MessageSquare },
    { path: '/dashboard/files', label: 'Dateien', icon: Paperclip },
    { path: '/dashboard/calendar', label: 'Kalender', icon: Calendar },
    { path: '/dashboard/notifications', label: 'Benachrichtigungen', icon: Bell, badge: 2 },
    { path: '/dashboard/profile', label: 'Profil', icon: User },
  ];

  const adminItems = [
    { path: '/dashboard/customers', label: 'Alle Kunden', icon: Users },
    { path: '/dashboard/intake-forms', label: 'Formulare', icon: Mail },
    { path: '/dashboard/admin-revisions', label: 'Revisionen', icon: GitPullRequest },
    { path: '/dashboard/admin-content-forms', label: 'Content-Formulare', icon: ClipboardList },
    { path: '/dashboard/analytics', label: 'Analytics', icon: PieChart },
    { path: '/dashboard/time-tracking', label: 'Zeiterfassung', icon: Clock },
    { path: '/dashboard/settings', label: 'Einstellungen', icon: Settings },
  ];

  const NavItem = ({ item }) => {
    const isActive = location.pathname.startsWith(item.path);
    
    return (
      <NavLink
        to={item.path}
        className={`
          flex items-center justify-between px-4 py-3 mb-1 rounded-r-lg transition-all duration-200
          font-sans text-sm
          ${isActive 
            ? 'border-l-2 border-[#c4a850] text-[#c4a850] bg-[rgba(196,168,80,0.08)]' 
            : 'border-l-2 border-transparent text-[#a8b0c5] hover:bg-[rgba(196,168,80,0.04)] hover:text-[#e8e4df]'
          }
        `}
      >
        <div className="flex items-center gap-3">
          <item.icon size={18} className={isActive ? 'text-[#c4a850]' : 'text-[#888888]'} />
          <span className="font-medium">{item.label}</span>
        </div>
        {item.badge > 0 && (
          <span className="bg-[#c4a850] text-[#08080a] text-[10px] font-bold px-2 py-0.5 rounded-full">
            {item.badge}
          </span>
        )}
      </NavLink>
    );
  };

  return (
    <aside className="hidden md:flex fixed top-0 left-0 h-screen w-[260px] bg-[#0d0d0f] border-r border-[rgba(196,168,80,0.12)] flex-col z-40">
      {/* Top Section */}
      <div className="p-6 border-b border-[rgba(196,168,80,0.12)] bg-[#08080a]">
        <div className="flex items-center gap-2 mb-6">
          <AgensiaLogo size={24} gold />
          <span className="font-serif text-2xl text-[#e8e4df] lowercase tracking-wide">agensia</span>
        </div>
        <div className="flex flex-col">
          <span className="font-sans font-medium text-[#e8e4df] truncate">{user?.name || 'Kunde'}</span>
          <span className="font-sans text-xs text-[#e8e4df] opacity-60 truncate">{user?.email}</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 pr-4 scrollbar-hide">
        <nav className="flex flex-col">
          {navItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}

          {/* Admin Section */}
          {isAdmin && (
            <div className="mt-8">
              <div className="px-6 mb-2 flex items-center gap-4">
                <div className="h-px flex-1 bg-[rgba(196,168,80,0.12)]"></div>
                <span className="text-[10px] uppercase tracking-wider text-[#c4a850] font-bold">Admin</span>
                <div className="h-px flex-1 bg-[rgba(196,168,80,0.12)]"></div>
              </div>
              {adminItems.map((item) => (
                <NavItem key={item.path} item={item} />
              ))}
            </div>
          )}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-[rgba(196,168,80,0.12)] bg-[#08080a]">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-sans font-medium text-[#888888] hover:text-[#e8e4df] hover:bg-[rgba(255,255,255,0.05)] rounded-md transition-colors"
        >
          <LogOut size={18} />
          <span>Abmelden</span>
        </button>
      </div>
    </aside>
  );
}
