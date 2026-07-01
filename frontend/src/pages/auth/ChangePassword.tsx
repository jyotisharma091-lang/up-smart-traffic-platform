import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ApiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { pageVariants } from '../../utils/animations';

export const ChangePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { user, setUser, setRole } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      const response = await ApiService.changePassword(currentPassword, newPassword);
      // Update context with the new user object and token
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setRole(response.user.role.toLowerCase() as any);
      
      // Navigate to dashboard
      const dashboardRoutes: Record<string, string> = {
        'STATE_ADMIN': '/state/dashboard',
        'DISTRICT_ADMIN': '/district/dashboard',
        'TRAFFIC_OFFICER': '/officer/dashboard'
      };
      navigate(dashboardRoutes[response.user.role] || '/');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <motion.div 
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full bg-surface p-8 rounded-2xl shadow-xl border border-border/50"
      >
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert className="text-warning w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-text mb-2">Change Your Password</h2>
          <p className="text-muted text-sm">
            For security reasons, you must change your auto-generated password before accessing your dashboard.
          </p>
        </div>

        {error && (
          <div className="bg-danger/10 text-danger p-3 rounded-lg text-sm mb-6 text-center font-medium border border-danger/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-muted">Current Password</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
                className="pl-10"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-5 h-5" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-muted">New Password</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className="pl-10"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-5 h-5" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-muted">Confirm New Password</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                className="pl-10"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-5 h-5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
              >
                {showPassword ? <EyeOff w-5 h-5 /> : <Eye w-5 h-5 />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-lg mt-4" disabled={isLoading}>
            {isLoading ? 'Updating Security...' : 'Update Password & Continue'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};
