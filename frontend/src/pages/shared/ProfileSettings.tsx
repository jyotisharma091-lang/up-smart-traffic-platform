import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Save, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { pageVariants } from '../../utils/animations';
import { ApiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const ProfileSettings: React.FC = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      await ApiService.changePassword(currentPassword, newPassword);
      setMessage({ type: 'success', text: 'Password updated successfully' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update password' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Profile & Security</h1>
        <p className="text-muted">Manage your account settings and password</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield size={20} /> Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <Input value={user?.fullName || ''} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <Input value={user?.role || ''} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {user?.role === 'TRAFFIC_OFFICER' ? 'Police Station' : 'Identifier'}
              </label>
              <Input 
                value={user?.role === 'TRAFFIC_OFFICER' 
                  ? ((user as any)?.policeStation || 'N/A') 
                  : (user?.email || user?.mobileNumber || user?.pnoNumber || user?.username || '')} 
                disabled 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">District</label>
              <Input value={user?.district || 'State Level'} disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Lock size={20} /> Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure.</CardDescription>
        </CardHeader>
        <CardContent>
          {message.text && (
            <div className={`p-3 mb-4 rounded text-sm ${message.type === 'error' ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>
              {message.text}
            </div>
          )}
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Current Password</label>
              <Input 
                type="password" 
                required 
                value={currentPassword} 
                onChange={e => setCurrentPassword(e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <Input 
                type="password" 
                required 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirm New Password</label>
              <Input 
                type="password" 
                required 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : <><Save size={16} className="mr-2" /> Update Password</>}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
