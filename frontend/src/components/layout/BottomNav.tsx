import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, Camera, Search, ClipboardList, Bell } from 'lucide-react';
import { clsx } from 'clsx';

interface BottomTab {
  to: string;
  icon: React.ReactNode;
  label: string;
  roles: string[];
}

const OFFICER_TABS: BottomTab[] = [
  { to: '/officer/dashboard', icon: <LayoutDashboard size={20}/>, label: 'Home',    roles: ['traffic_officer'] },
  { to: '/officer/capture',   icon: <Camera size={20}/>,          label: 'Capture', roles: ['traffic_officer'] },
  { to: '/officer/vehicles',  icon: <Search size={20}/>,          label: 'Search',  roles: ['traffic_officer'] },
  { to: '/officer/cases',     icon: <ClipboardList size={20}/>,   label: 'Cases',   roles: ['traffic_officer'] },
  { to: '/notifications',     icon: <Bell size={20}/>,            label: 'Alerts',  roles: ['traffic_officer'] },
];

const BottomNav: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || user.role !== 'traffic_officer') return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 lg:hidden safe-bottom"
      style={{ height: 56 }}
      aria-label="Bottom navigation"
    >
      <div className="flex h-full">
        {OFFICER_TABS.map(tab => {
          const isActive = location.pathname === tab.to || location.pathname.startsWith(tab.to + '/');
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 relative"
            >
              <div className={clsx(
                'flex flex-col items-center gap-0.5 transition-colors',
                isActive ? 'text-indigo-600' : 'text-slate-400'
              )}>
                {isActive && (
                  <motion.div
                    layoutId="bottom-tab-indicator"
                    className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-indigo-600 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                {tab.icon}
                <span className="text-xs font-medium">{tab.label}</span>
              </div>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
