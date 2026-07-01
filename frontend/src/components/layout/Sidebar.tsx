import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Camera, Search, FileText, 
  Map, Users, Settings, LogOut, ChevronLeft, ChevronRight,
  Menu, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMode } from '../../context/ModeContext';
import { cn } from '../../utils/cn';

export const Sidebar: React.FC = () => {
  const { role, logout, user } = useAuth();
  const { mode } = useMode();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (role === 'traffic_officer') return '/officer/dashboard';
    if (role === 'district_admin') return '/district/dashboard';
    if (role === 'state_admin') return '/state/dashboard';
    return '/';
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: getDashboardPath(), roles: ['traffic_officer', 'district_admin', 'state_admin'] },
    { name: 'Capture Violation', icon: Camera, path: '/officer/capture', roles: ['traffic_officer'] },
    { name: 'My Cases', icon: FileText, path: '/officer/cases', roles: ['traffic_officer'] },
    { name: 'Vehicle Search', icon: Search, path: '/officer/search', roles: ['traffic_officer', 'district_admin', 'state_admin'] },
    { name: 'Verification Queue', icon: FileText, path: '/district/queue', roles: ['district_admin'] },
    { name: 'Issued Challans', icon: FileText, path: '/district/challans', roles: ['district_admin'] },
    { name: 'Officer Management', icon: Users, path: '/district/officers', roles: ['district_admin'] },
    { name: 'Reports', icon: FileText, path: '/shared/reports', roles: ['district_admin', 'state_admin'] },
    { name: 'Map & Hotspots', icon: Map, path: '/shared/map', roles: ['district_admin', 'state_admin'] },
    { name: 'User Management', icon: Users, path: '/state/users', roles: ['state_admin'] },
    { name: 'System Config', icon: Settings, path: '/shared/settings', roles: ['state_admin'] },
    { name: 'Profile & Security', icon: Users, path: '/shared/profile', roles: ['traffic_officer', 'district_admin', 'state_admin'] },
  ].filter(item => role && item.roles.includes(role));

  const sidebarContent = (
    <>
      <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
        {!collapsed && <span className="text-white font-bold tracking-wider truncate">UP TRAFFIC</span>}
        <button onClick={() => setCollapsed(!collapsed)} className="p-1 text-white/70 hover:text-white hidden md:block">
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => cn(
              "flex items-center space-x-3 px-3 py-2.5 rounded-md transition-colors",
              isActive ? "bg-primary-600 text-white border-l-4 border-accent-400" : "text-white/70 hover:bg-white/10 hover:text-white",
              collapsed ? "justify-center border-l-0" : ""
            )}
            title={collapsed ? item.name : undefined}
          >
            <item.icon size={20} className="shrink-0" />
            {!collapsed && <span className="truncate">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-3 hidden">
        {/* Removed redundant user info and logout, now in Top Bar */}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Hamburger Header (visible only on small screens) */}
      <div className="md:hidden fixed top-0 left-0 w-full h-[60px] bg-primary-800 text-white z-40 flex items-center px-4 shadow-sm" style={{ marginTop: mode === 'demo' ? '40px' : '0' }}>
        <button onClick={() => setMobileOpen(true)} className="p-2 -ml-2">
          <Menu size={24} />
        </button>
        <span className="font-bold ml-2">UP Traffic</span>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-50" 
          onClick={() => setMobileOpen(false)} 
        />
      )}

      {/* Sidebar Desktop & Mobile drawer */}
      <motion.aside
        initial={false}
        animate={{ 
          width: collapsed ? 64 : 260,
          x: mobileOpen ? 0 : (window.innerWidth < 768 ? -260 : 0)
        }}
        className={cn(
          "bg-primary-800 text-white flex flex-col h-screen z-50",
          "fixed md:sticky top-0 left-0 transition-transform duration-300 shadow-xl md:shadow-none print:hidden"
        )}
      >
        {/* Mobile close button inside drawer */}
        {mobileOpen && (
          <button 
            onClick={() => setMobileOpen(false)}
            className="md:hidden absolute top-4 right-4 text-white p-1"
          >
            <X size={24} />
          </button>
        )}
        
        {sidebarContent}
      </motion.aside>
    </>
  );
};
