import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useMode } from '../../context/ModeContext';
import { TransparentLogo } from '../ui/TransparentLogo';
import { LogOut, Bell, Menu, Sun, Moon } from 'lucide-react';

export const AppShell: React.FC = () => {
  const { user, logout, role } = useAuth();
  const { mode, toggleMode } = useMode();
  const navigate = useNavigate();
  const isDark = mode === 'dark';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Global Top Bar */}
        <header className={`h-[72px] backdrop-blur-xl border-b z-20 shrink-0 sticky top-0 flex items-center justify-between px-4 sm:px-8 transition-colors duration-300 ${
          isDark 
            ? 'bg-[#0f172a]/80 border-slate-800 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' 
            : 'bg-gradient-to-r from-blue-50/95 via-indigo-50/95 to-slate-50/95 border-indigo-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
        }`}>
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
             <TransparentLogo 
               src="/up-police-logo.png" 
               className={`w-12 h-12 object-contain ${isDark ? 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' : 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]'}`} 
             />
             <h2 className={`text-xl sm:text-2xl font-black tracking-tight hidden sm:block bg-clip-text text-transparent ${
               isDark ? 'bg-gradient-to-r from-blue-400 to-indigo-300 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-gradient-to-r from-blue-700 to-indigo-700 drop-shadow-sm'
             }`}>
               UP Smart Traffic Platform
             </h2>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3 sm:space-x-5">
             
             {/* Theme Toggle */}
             <button 
               onClick={toggleMode}
               className={`relative p-2.5 rounded-xl transition-all ${
                 isDark ? 'bg-slate-800/50 text-yellow-400 hover:bg-slate-700 hover:shadow-inner' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:shadow-inner'
               }`}
             >
               {isDark ? <Sun size={18} /> : <Moon size={18} />}
             </button>

             {/* Notifications */}
             <button className={`relative p-2.5 rounded-xl transition-all ${
                 isDark ? 'bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:shadow-inner' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:shadow-inner'
               }`}>
               <Bell size={18} />
               <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-slate-800 rounded-full animate-pulse"></span>
             </button>

             {/* Divider */}
             <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1 sm:mx-2 hidden md:block"></div>

             {/* User Profile */}
             <div className="hidden md:flex items-center gap-3">
               <div className="flex flex-col text-right">
                 <span className={`text-sm font-black leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                   {user?.fullName || 'User'}
                 </span>
                 <span className={`text-[10px] uppercase font-bold tracking-widest ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                   {role?.replace('_', ' ')}
                 </span>
               </div>
               <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-[0_4px_10px_rgba(59,130,246,0.4)] border-2 border-white dark:border-slate-800 relative">
                 {user?.fullName?.charAt(0) || 'U'}
                 <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
               </div>
             </div>

             {/* Divider */}
             <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1 sm:mx-2"></div>

             {/* Logout Button */}
             <button 
               onClick={handleLogout}
               className={`flex items-center text-sm font-bold transition-all gap-2 px-3 py-2 rounded-xl group ${
                 isDark ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300' : 'text-red-600 hover:bg-red-50 hover:text-red-700'
               }`}
             >
               <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
               <span className="hidden sm:inline">Logout</span>
             </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
