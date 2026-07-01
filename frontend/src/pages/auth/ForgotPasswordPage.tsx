// @ts-nocheck
import React, { useState, useEffect, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle, ArrowRight, Lock, User, Activity, Sun, Moon, ArrowLeft, Key } from 'lucide-react';
import axiosInstance from '../../apis/axiosInstance';
import { useMode } from '../../context/ModeContext';
import { TransparentLogo } from '../../components/ui/TransparentLogo';

const UP_IMAGES = [
  '/up_smart_highway.png', // Expressway Night Traffic AI
  '/up_police_control_room.png', // Smart Security Camera AI
  '/up_anpr_camera.png', // Control Room / Data Center AI
  '/up_city_traffic_ai.png', // Indian City Traffic AI
];

export const ForgotPasswordPage: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const navigate = useNavigate();
  const { mode, toggleMode } = useMode();
  const isDark = mode === 'dark';

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % UP_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await axiosInstance.post('/auth/forgot-password', { username });
      const data = response.data;
      
      if (data.success) {
        setSuccess(data.message);
        setStep(2);
      } else {
        setError(data.message || 'Failed to request OTP');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !newPassword) return;
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await axiosInstance.post('/auth/reset-password', { username, otp, newPassword });
      const data = response.data;
      
      if (data.success) {
        setSuccess(data.message);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 sm:p-8 relative overflow-hidden font-sans transition-colors duration-500 ${isDark ? 'bg-[#020510]' : 'bg-[#e2e8f0]'}`}>
      
      {/* Theme Toggle Button - 3D Pill */}
      <button 
        onClick={toggleMode}
        className={`absolute top-6 right-6 z-50 p-3 rounded-full backdrop-blur-md transition-all shadow-[0_8px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.25)] hover:-translate-y-1 active:translate-y-0 active:shadow-inner ${
          isDark 
            ? 'bg-gradient-to-b from-slate-700 to-slate-900 border-t border-slate-600 text-white' 
            : 'bg-gradient-to-b from-white to-slate-100 border-b border-slate-300 text-slate-800'
        }`}
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Dynamic Background Mesh */}
      <div className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000 ${isDark ? 'opacity-40' : 'opacity-80'}`}>
        <div className={`absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full blur-[100px] animate-pulse ${isDark ? 'bg-blue-900/50' : 'bg-blue-400/30'}`} style={{ animationDuration: '8s' }} />
        <div className={`absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full blur-[100px] animate-pulse ${isDark ? 'bg-indigo-900/50' : 'bg-indigo-400/30'}`} style={{ animationDuration: '10s' }} />
        <div className={`absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] ${isDark ? 'opacity-30 mix-blend-screen' : 'opacity-[0.03] mix-blend-multiply'}`} />
      </div>

      <div className="w-full max-w-[1100px] z-10 relative">
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`w-full rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col md:flex-row relative transition-colors duration-500 ${
            isDark 
              ? 'bg-slate-900 border border-slate-700/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' 
              : 'bg-white border border-white shadow-[inset_0_1px_0_rgba(255,255,255,1),0_30px_60px_rgba(0,0,0,0.1)]'
          }`}
        >
          {/* Subtle Glossy Overlay for Main Card */}
          <div className="absolute inset-0 pointer-events-none rounded-[3rem] bg-gradient-to-br from-white/10 to-transparent opacity-50 z-20 mix-blend-overlay" />

          {/* Left Side: Password Reset Form */}
          <div className="w-full md:w-[50%] p-10 lg:p-14 flex flex-col justify-center relative z-30">
            
            <div className="mb-10 flex flex-col items-start">
              <button 
                onClick={() => navigate('/login')}
                className={`flex items-center text-sm font-bold uppercase tracking-wider mb-6 transition-colors ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
              >
                <ArrowLeft size={16} className="mr-1" /> Back to Login
              </button>

              <div className="flex items-center gap-4 mb-6">
                <TransparentLogo 
                  src="/up-police-logo.png" 
                  className={`w-[72px] h-[72px] flex-shrink-0 object-contain drop-shadow-md ${isDark ? 'drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]' : ''}`}
                />
                <div className="flex flex-col">
                  <h1 className={`text-4xl font-black tracking-tight leading-tight drop-shadow-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Recovery
                  </h1>
                  <p className={`font-medium text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {step === 1 ? 'Enter username to receive OTP' : 'Enter OTP to reset password'}
                  </p>
                </div>
              </div>
            </div>

            {step === 1 ? (
              <form onSubmit={handleRequestOtp} className="space-y-6">
                <div className="space-y-2">
                  <label className={`text-xs font-bold uppercase tracking-wider ml-1 drop-shadow-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Username
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <User size={18} className={`transition-colors ${isDark ? 'text-indigo-400 group-focus-within:text-indigo-300' : 'text-indigo-500 group-focus-within:text-indigo-600'}`} />
                    </div>
                    <input
                      type="text"
                      autoFocus
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={`w-full pl-12 pr-4 py-4 rounded-2xl outline-none transition-all duration-300 font-medium ${
                        isDark 
                          ? 'bg-[#0f172a] border-t border-black border-b border-indigo-900/50 text-white focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-600 shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)]' 
                          : 'bg-indigo-50/70 border border-indigo-100 text-slate-900 focus:ring-2 focus:ring-indigo-500/40 focus:bg-white focus:border-indigo-300 placeholder:text-indigo-300 shadow-[inset_0_2px_5px_rgba(79,70,229,0.05)]'
                      }`}
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, y: -10, rotateX: 90 }}
                      animate={{ opacity: 1, height: 'auto', y: 0, rotateX: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10, rotateX: 90 }}
                      className="overflow-hidden perspective-1000"
                    >
                      <div className={`flex items-center space-x-3 text-sm font-bold p-4 rounded-2xl shadow-inner ${isDark ? 'text-red-400 bg-red-950/50 border-t border-red-900/50' : 'text-red-600 bg-red-50 border-t border-red-200'}`}>
                        <AlertCircle size={18} className="shrink-0" />
                        <span>{error}</span>
                      </div>
                    </motion.div>
                  )}
                  {success && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, y: -10, rotateX: 90 }}
                      animate={{ opacity: 1, height: 'auto', y: 0, rotateX: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10, rotateX: 90 }}
                      className="overflow-hidden perspective-1000"
                    >
                      <div className={`flex items-center space-x-3 text-sm font-bold p-4 rounded-2xl shadow-inner ${isDark ? 'text-green-400 bg-green-950/50 border-t border-green-900/50' : 'text-green-600 bg-green-50 border-t border-green-200'}`}>
                        <CheckCircle size={18} className="shrink-0" />
                        <span>{success}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button 
                  type="submit" 
                  disabled={isLoading || !username}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className={`relative w-full py-4 font-bold rounded-2xl overflow-hidden transition-all duration-300 disabled:opacity-70 group mt-4 flex items-center justify-center gap-2 text-base ${
                    isDark 
                      ? 'bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0_10px_20px_rgba(37,99,235,0.3),inset_0_1px_0_rgba(255,255,255,0.3)] hover:shadow-[0_15px_30px_rgba(37,99,235,0.5),inset_0_1px_0_rgba(255,255,255,0.4)] border border-blue-600 hover:-translate-y-1 active:translate-y-0 active:shadow-inner' 
                      : 'bg-gradient-to-b from-slate-800 to-slate-900 text-white shadow-[0_10px_20px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] border border-slate-800 hover:-translate-y-1 active:translate-y-0 active:shadow-inner'
                  }`}
                >
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-2xl pointer-events-none" />
                  <span className="relative z-10 drop-shadow-md">{isLoading ? 'Requesting OTP...' : 'Request OTP'}</span>
                  {!isLoading && (
                    <motion.div animate={{ x: isHovered ? 5 : 0 }} transition={{ duration: 0.2 }} className="relative z-10">
                      <ArrowRight size={18} />
                    </motion.div>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-2">
                  <label className={`text-xs font-bold uppercase tracking-wider ml-1 drop-shadow-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Enter OTP
                  </label>
                  <div className="relative group">
                    <div className={`absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-600'}`}>
                      <Key size={18} />
                    </div>
                    <input
                      type="text"
                      autoFocus
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className={`w-full pl-12 pr-4 py-4 rounded-2xl transition-all outline-none font-medium ${
                        isDark 
                          ? 'bg-[#0f172a] border-t border-black border-b border-slate-700 text-white focus:ring-2 focus:ring-blue-500/50 placeholder:text-slate-600 shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)]' 
                          : 'bg-slate-100 border-t border-slate-300 border-b border-white text-slate-900 focus:ring-2 focus:ring-blue-500/30 placeholder:text-slate-400 shadow-[inset_0_3px_6px_rgba(0,0,0,0.06)]'
                      }`}
                      placeholder="Enter 6-digit OTP"
                    />
                  </div>
                  <p className={`text-[10px] uppercase font-bold tracking-widest ml-1 mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    For demo purposes, OTP is 123456
                  </p>
                </div>

                <div className="space-y-2">
                  <label className={`text-xs font-bold uppercase tracking-wider ml-1 drop-shadow-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    New Password
                  </label>
                  <div className="relative group">
                    <div className={`absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-600'}`}>
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`w-full pl-12 pr-12 py-4 rounded-2xl transition-all outline-none font-medium ${
                        isDark 
                          ? 'bg-[#0f172a] border-t border-black border-b border-slate-700 text-white focus:ring-2 focus:ring-blue-500/50 placeholder:text-slate-600 shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)]' 
                          : 'bg-slate-100 border-t border-slate-300 border-b border-white text-slate-900 focus:ring-2 focus:ring-blue-500/30 placeholder:text-slate-400 shadow-[inset_0_3px_6px_rgba(0,0,0,0.06)]'
                      }`}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute inset-y-0 right-0 pr-5 flex items-center transition-colors ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, y: -10, rotateX: 90 }}
                      animate={{ opacity: 1, height: 'auto', y: 0, rotateX: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10, rotateX: 90 }}
                      className="overflow-hidden perspective-1000"
                    >
                      <div className={`flex items-center space-x-3 text-sm font-bold p-4 rounded-2xl shadow-inner ${isDark ? 'text-red-400 bg-red-950/50 border-t border-red-900/50' : 'text-red-600 bg-red-50 border-t border-red-200'}`}>
                        <AlertCircle size={18} className="shrink-0" />
                        <span>{error}</span>
                      </div>
                    </motion.div>
                  )}
                  {success && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, y: -10, rotateX: 90 }}
                      animate={{ opacity: 1, height: 'auto', y: 0, rotateX: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10, rotateX: 90 }}
                      className="overflow-hidden perspective-1000"
                    >
                      <div className={`flex items-center space-x-3 text-sm font-bold p-4 rounded-2xl shadow-inner ${isDark ? 'text-green-400 bg-green-950/50 border-t border-green-900/50' : 'text-green-600 bg-green-50 border-t border-green-200'}`}>
                        <CheckCircle size={18} className="shrink-0" />
                        <span>{success}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button 
                  type="submit" 
                  disabled={isLoading || !otp || !newPassword}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className={`relative w-full py-4 font-bold rounded-2xl overflow-hidden transition-all duration-300 disabled:opacity-70 group mt-4 flex items-center justify-center gap-2 text-base ${
                    isDark 
                      ? 'bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0_10px_20px_rgba(37,99,235,0.3),inset_0_1px_0_rgba(255,255,255,0.3)] hover:shadow-[0_15px_30px_rgba(37,99,235,0.5),inset_0_1px_0_rgba(255,255,255,0.4)] border border-blue-600 hover:-translate-y-1 active:translate-y-0 active:shadow-inner' 
                      : 'bg-gradient-to-b from-slate-800 to-slate-900 text-white shadow-[0_10px_20px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] border border-slate-800 hover:-translate-y-1 active:translate-y-0 active:shadow-inner'
                  }`}
                >
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-2xl pointer-events-none" />
                  <span className="relative z-10 drop-shadow-md">{isLoading ? 'Resetting Password...' : 'Reset Password'}</span>
                  {!isLoading && (
                    <motion.div animate={{ x: isHovered ? 5 : 0 }} transition={{ duration: 0.2 }} className="relative z-10">
                      <ArrowRight size={18} />
                    </motion.div>
                  )}
                </button>
              </form>
            )}
            
          </div>

          {/* Right Side: Visual Showcase (Parallax Area) */}
          <div className="hidden md:block w-[50%] relative p-3 z-20">
            <div className={`w-full h-full relative rounded-[2.5rem] overflow-hidden ${isDark ? 'bg-slate-950 shadow-inner' : 'bg-slate-200 shadow-inner'}`}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={UP_IMAGES[currentImageIndex]}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: currentImageIndex === 1 ? 0.6 : 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-cover"
                  alt=""
                />
              </AnimatePresence>
              
              {/* 3D Glass overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t mix-blend-multiply ${isDark ? 'from-[#020510] via-transparent' : 'from-slate-600 via-transparent'}`} />
              
              {/* Floating Data Cards */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                <motion.div 
                  className={`backdrop-blur-xl border p-6 rounded-3xl mb-4 shadow-[0_20px_40px_rgba(0,0,0,0.3)] ${
                    isDark ? 'bg-black/50 border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' : 'bg-white/30 border-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                      <Lock size={20} className="text-blue-400 animate-pulse" />
                    </div>
                    <span className={`font-bold tracking-wide text-lg drop-shadow-md ${isDark ? 'text-white' : 'text-slate-900'}`}>Secure Reset</span>
                  </div>
                  <p className={`text-sm font-medium leading-relaxed drop-shadow-sm ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                    Military-grade encryption securing all officer accounts across the UP Traffic Command Center.
                  </p>
                </motion.div>
                
                <div className="flex gap-4">
                  <motion.div 
                    className={`flex-1 backdrop-blur-xl border p-5 rounded-3xl flex flex-col justify-center items-center shadow-[0_20px_40px_rgba(0,0,0,0.3)] ${
                      isDark ? 'bg-indigo-600/30 border-indigo-400/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' : 'bg-indigo-500/20 border-indigo-400/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]'
                    }`}
                  >
                    <span className={`text-3xl font-black drop-shadow-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>2FA</span>
                    <span className={`text-[10px] uppercase font-bold tracking-widest mt-2 drop-shadow-sm ${isDark ? 'text-indigo-200' : 'text-indigo-900'}`}>Security</span>
                  </motion.div>

                  <motion.div 
                    className={`flex-1 backdrop-blur-xl border p-5 rounded-3xl flex flex-col justify-center items-center shadow-[0_20px_40px_rgba(0,0,0,0.3)] ${
                      isDark ? 'bg-green-600/30 border-green-400/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' : 'bg-green-500/20 border-green-400/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]'
                    }`}
                  >
                    <span className={`text-3xl font-black drop-shadow-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>100%</span>
                    <span className={`text-[10px] uppercase font-bold tracking-widest mt-2 drop-shadow-sm ${isDark ? 'text-green-200' : 'text-green-900'}`}>Protected</span>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-6 w-full text-center z-10">
        <p className={`text-xs font-bold tracking-wide drop-shadow-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Uttar Pradesh Police Department &copy; 2026. All rights reserved.
        </p>
      </div>
    </div>
  );
};
