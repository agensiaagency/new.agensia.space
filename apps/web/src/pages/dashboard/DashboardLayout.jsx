
import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, FileText, GitPullRequest, MessageSquare, Settings, LogOut, X, Menu, PenTool } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import GridBackgroundPattern from '@/components/GridBackgroundPattern.jsx';
import AgensiaLogo from '@/components/AgensiaLogo.jsx';

export default function DashboardLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard/overview', label: 'Übersicht', icon: LayoutDashboard },
    { path: '/dashboard/projects', label: 'Meine Projekte', icon: FolderKanban },
    { path: '/dashboard/forms', label: 'Formulare', icon: FileText },
    { path: '/dashboard/website-content', label: 'Website-Inhalte', icon: PenTool },
    { path: '/dashboard/revisions', label: 'Revisionen', icon: GitPullRequest },
    { path: '/dashboard/messages', label: 'Nachrichten', icon: MessageSquare },
    { path: '/dashboard/settings', label: 'Einstellungen', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f0d] flex flex-col md:flex-row text-[#e8e4df] font-sans overflow-hidden">
      
      {/* Mobile Header (Visible only on small screens) */}
      <header className="md:hidden flex items-center justify-between p-4 bg-[#141210] border-b border-[rgba(196,168,80,0.12)] z-30 relative">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-[#a8b0c5] hover:text-[#c4a850] transition-colors focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <Menu size={24} />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <AgensiaLogo size={20} gold />
            <span className="text-xl font-serif lowercase text-[#e8e4df] leading-none tracking-wide">
              agensia
            </span>
          </Link>
        </div>
      </header>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 bg-[#141210] border-r border-[rgba(196,168,80,0.12)] flex flex-col
        transform transition-transform duration-300 ease-in-out
        w-72 md:w-20 lg:w-64
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        md:relative
      `}>
        <div className="p-4 md:p-6 lg:p-8 mb-4 flex items-center justify-between md:justify-center lg:justify-start">
          <Link to="/" className="flex items-center gap-2 group">
            <AgensiaLogo size={24} gold className="flex-shrink-0" />
            <span className="text-2xl font-serif lowercase text-[#e8e4df] leading-none tracking-wide md:hidden lg:block">
              agensia
            </span>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 text-[#888888] hover:text-[#e8e4df] min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-3 lg:px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 lg:px-4 py-3 rounded-md transition-all duration-200 text-sm md:text-base font-medium min-h-[44px]
                ${isActive 
                  ? 'bg-[rgba(196,168,80,0.1)] text-[#c4a850] border-l-2 border-[#c4a850]' 
                  : 'text-[#888888] hover:text-[#e8e4df] hover:bg-[rgba(255,255,255,0.03)] border-l-2 border-transparent'}
                md:justify-center lg:justify-start
              `}
              title={item.label}
            >
              <item.icon size={20} className="flex-shrink-0" />
              <span className="md:hidden lg:inline whitespace-nowrap">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-3 lg:p-4 border-t border-[rgba(196,168,80,0.12)]">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 lg:px-4 py-3 w-full text-left text-sm md:text-base font-medium text-[#888888] hover:text-[#e8e4df] hover:bg-[rgba(255,255,255,0.03)] rounded-md transition-all min-h-[44px] md:justify-center lg:justify-start"
            title="Logout"
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span className="md:hidden lg:inline">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto h-[calc(100vh-76px)] md:h-screen">
        <GridBackgroundPattern useCycle={true} glowOpacity={0.04} />
        <div className="relative z-10 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet context={{ setSidebarOpen }} />
        </div>
      </main>
    </div>
  );
}
