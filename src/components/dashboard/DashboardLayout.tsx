import { useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  LayoutDashboard, FolderOpen, CheckSquare, DollarSign,
  Users, Bell, LogOut, Menu, X, ChevronRight,
  Clock, FileText, BarChart2, Camera,
} from 'lucide-react';
import { getMe, logout, hasToken } from '../../lib/auth';
import type { AuthUser } from '../../lib/auth';

const NAV = [
  { label: 'Overview',   icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Projects',   icon: FolderOpen,       path: '/dashboard/projects' },
  { label: 'Tasks',      icon: CheckSquare,      path: '/dashboard/tasks' },
  { label: 'Financials', icon: DollarSign,       path: '/dashboard/financials' },
  { label: 'Team',       icon: Users,            path: '/dashboard/team' },
  { label: 'Attendance', icon: Clock,            path: '/dashboard/attendance' },
  { label: 'Reports',    icon: FileText,         path: '/dashboard/reports' },
  { label: 'Analytics',  icon: BarChart2,        path: '/dashboard/analytics' },
  { label: 'Media',      icon: Camera,           path: '/dashboard/media' },
];

export function DashboardLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!hasToken()) { navigate('/login'); return; }
    getMe().then(setUser).catch(() => { navigate('/login'); });
  }, [navigate]);

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : '..';

  return (
    <div className="flex h-screen bg-[#0D0D0D] text-white overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-[#111111] border-r border-[#1E1E1E]
        flex flex-col transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-[#1E1E1E]">
          <img src="/logo-primary.png" alt="Buildafr" style={{ height: 44, objectFit: "contain" }} />
          <button className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map(({ label, icon: Icon, path }) => {
            const active = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => { navigate(path); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-[#F59E0B]/10 text-[#F59E0B]'
                    : 'text-gray-400 hover:bg-[#1A1A1A] hover:text-white'
                }`}
              >
                <Icon size={18} />
                {label}
                {active && <ChevronRight size={14} className="ml-auto" />}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-[#1E1E1E] space-y-1">
          <button
            onClick={() => navigate('/dashboard/notifications')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-[#1A1A1A] hover:text-white transition-colors"
          >
            <Bell size={18} />
            Notifications
          </button>
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="w-8 h-8 bg-[#F59E0B] rounded-full flex items-center justify-center text-black font-bold text-xs shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user ? `${user.firstName} ${user.lastName}` : '…'}</p>
              <p className="text-xs text-gray-500 truncate capitalize">{user?.role?.toLowerCase() ?? ''}</p>
            </div>
            <button onClick={handleLogout} className="text-gray-500 hover:text-red-400 transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-[#1E1E1E] bg-[#111111]">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={22} className="text-gray-400" />
          </button>
          <span className="font-bold">Buildafr</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
