import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Sun, Moon, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/cn';

export const Topbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showProfile, setShowProfile] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  return (
    <header className="h-[60px] bg-surface border-b border-border flex items-center justify-end md:justify-between px-4 md:px-6 sticky top-0 z-30 shadow-xs print:hidden">
      
      {/* Desktop Search */}
      <div className="hidden md:flex items-center w-full max-w-md relative">
        <Search className="absolute left-3 text-muted" size={18} />
        <Input 
          type="text" 
          placeholder="Global search (⌘K)..." 
          className="pl-10 bg-bg border-transparent focus:border-primary-500 rounded-full"
        />
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Notifications */}
        <button className="p-2 relative text-text-sub hover:text-text transition-colors">
          <Bell size={20} />
          {unreadCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger"
            />
          )}
        </button>

        {/* Theme Toggle */}
        <button onClick={toggleTheme} className="p-2 text-text-sub hover:text-text transition-colors">
          <motion.div
            initial={false}
            animate={{ rotate: theme === 'dark' ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          >
            {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
          </motion.div>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center space-x-2 p-1 rounded-full hover:bg-bg transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
              {user?.fullName.charAt(0) || 'U'}
            </div>
          </button>

          <AnimatePresence>
            {showProfile && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowProfile(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-md shadow-lg z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-border bg-bg">
                    <p className="font-medium text-text truncate">{user?.fullName}</p>
                    <p className="text-xs text-muted mt-1">{user?.designation}</p>
                    <Badge variant="secondary" className="mt-2 text-[10px] uppercase">
                      {user?.role.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="p-2">
                    <button className="flex w-full items-center space-x-2 px-3 py-2 text-sm text-text-sub hover:bg-bg hover:text-text rounded-md transition-colors">
                      <UserIcon size={16} />
                      <span>My Profile</span>
                    </button>
                    <button 
                      onClick={() => logout()}
                      className="flex w-full items-center space-x-2 px-3 py-2 text-sm text-danger hover:bg-danger/10 rounded-md transition-colors mt-1"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
