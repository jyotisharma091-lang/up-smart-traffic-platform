import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, MoreVertical, Edit2, ShieldAlert, CheckCircle, X } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { pageVariants, modalVariants, backdropVariants } from '../../utils/animations';
import { ApiService } from '../../services/api';
import axiosInstance from '../../apis/axiosInstance'; // Using instance for fetching directly if not in ApiService
import type { User } from '../../types';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form State
  const [formData, setFormData] = useState({ fullName: '', username: '', mobileNumber: '', pnoNumber: '', password: '', role: 'DISTRICT_ADMIN', district: '', status: 'ACTIVE' });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/users');
      const districtAdmins = response.data.data.filter((u: any) => u.role === 'DISTRICT_ADMIN');
      setUsers(districtAdmins);
    } catch (err) {
      console.error('Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenAdd = () => {
    setFormData({ fullName: '', username: '', mobileNumber: '', pnoNumber: '', password: '', role: 'DISTRICT_ADMIN', district: '', status: 'ACTIVE' });
    setEditingUser(null);
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setFormData({ 
      fullName: user.fullName || '', 
      username: user.username || '', 
      mobileNumber: user.mobileNumber || '', 
      pnoNumber: user.pnoNumber || '', 
      password: '', 
      role: user.role || 'DISTRICT_ADMIN', 
      district: user.district || '', 
      status: user.status || 'ACTIVE' 
    });
    setEditingUser(user);
    setError('');
    setIsModalOpen(true);
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDelete = async () => {
    if (!editingUser) return;
    if (!window.confirm("Are you sure you want to permanently delete this user?")) return;
    
    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/users/${editingUser.id}`);
      await fetchUsers();
      setIsModalOpen(false);
      showSuccess("User deleted successfully!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete user.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.role === 'DISTRICT_ADMIN') {
      if (formData.mobileNumber.length !== 10) {
        setError("CUG Mobile Number must be exactly 10 digits.");
        return;
      }
      if (!formData.mobileNumber.startsWith('945440')) {
        setError("District CUG Mobile Number must start with 945440.");
        return;
      }
    }

    if (formData.role === 'TRAFFIC_OFFICER' && (!formData.pnoNumber || formData.pnoNumber.length > 10)) {
      setError("PNO Number must be up to 10 digits.");
      return;
    }

    setIsLoading(true);

    try {
      if (editingUser) {
        // Update User 
        await axiosInstance.put(`/users/${editingUser.id}`, formData);
        showSuccess("User updated successfully!");
      } else {
        // Create User
        // District Admin needs mobileNumber (CUG) for login
        const payload = {
          ...formData,
          username: formData.role === 'DISTRICT_ADMIN' ? formData.mobileNumber : formData.pnoNumber,
          pnoNumber: formData.role === 'DISTRICT_ADMIN' ? undefined : formData.pnoNumber,
          mobileNumber: formData.role === 'DISTRICT_ADMIN' ? formData.mobileNumber : undefined,
        };
        await ApiService.registerUser(payload);
        showSuccess("User created successfully!");
      }
      await fetchUsers();
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted">Manage system access and roles</p>
        </div>
        <Button onClick={handleOpenAdd}>
          <UserPlus size={18} className="mr-2" /> Add User
        </Button>
      </div>

      <AnimatePresence>
        {successMsg && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="text-sm text-success flex items-center gap-2 bg-success/10 p-3 rounded-md">
            <CheckCircle size={16} /> {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted uppercase bg-bg/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Name & Identifier</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">District</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-bg/50 transition-colors bg-surface group">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-text">{u.fullName}</p>
                    <p className="text-xs text-muted mt-0.5">{u.mobileNumber || u.pnoNumber || u.email}</p>
                  </td>
                  <td className="px-6 py-4 font-medium">{u.role}</td>
                  <td className="px-6 py-4">{u.district || 'All UP'}</td>
                  <td className="px-6 py-4">
                    <Badge variant={u.status === 'ACTIVE' ? 'success' : u.status === 'PENDING' ? 'warning' : 'destructive'}>{u.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleOpenEdit(u)}
                      className="text-primary-600 hover:text-primary-800 p-2 transition-opacity bg-primary-50 rounded-lg mr-2"
                    >
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              variants={backdropVariants} initial="hidden" animate="visible" exit="exit"
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              variants={modalVariants} initial="hidden" animate="visible" exit="exit"
              className="relative bg-surface rounded-xl shadow-2xl max-w-md w-full p-6 border border-border"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-bg text-muted transition-colors"
              >
                <X size={20} />
              </button>
              <h2 className="text-xl font-bold mb-6">{editingUser ? 'Edit User' : 'Add New User'}</h2>
              
              {error && <div className="text-sm text-danger mb-4 p-2 bg-danger/10 rounded">{error}</div>}

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name *</label>
                  <Input required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} placeholder="e.g. SP Amit Kumar" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Role *</label>
                    <select 
                      className="w-full flex h-10 rounded-md border border-border bg-bg px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                      value={formData.role} 
                      onChange={e => setFormData({...formData, role: e.target.value})}
                      disabled
                    >
                      <option value="DISTRICT_ADMIN">District Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status *</label>
                    <select 
                      className="w-full flex h-10 rounded-md border border-border bg-bg px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                      value={formData.status} 
                      onChange={e => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="DEACTIVATED">Deactivated</option>
                    </select>
                  </div>
                </div>

                {/* Only District Admin form fields since State Admin only creates them now */}
                <div>
                  <label className="block text-sm font-medium mb-1">CUG Mobile Number (10 digits) *</label>
                  <Input 
                    required 
                    value={formData.mobileNumber} 
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData({...formData, mobileNumber: val});
                      if (error && error.includes('CUG')) setError('');
                    }} 
                    onBlur={() => {
                      if (formData.mobileNumber && formData.mobileNumber.length !== 10) {
                        setError("CUG Mobile Number must be exactly 10 digits.");
                      } else if (formData.mobileNumber && !formData.mobileNumber.startsWith('945440')) {
                        setError("District CUG Mobile Number must start with 945440.");
                      }
                    }}
                    placeholder="e.g. 9454400000" 
                    maxLength={10}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">District *</label>
                  <Input required value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} placeholder="e.g. Lucknow" />
                </div>
                
                {!editingUser && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Initial Password *</label>
                    <Input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Set an initial password" />
                    <p className="text-xs text-muted mt-1">User will be forced to change this upon first login.</p>
                  </div>
                )}

                <div className="pt-4 flex justify-between">
                  {editingUser ? (
                    <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting || isLoading}>
                      {isDeleting ? 'Deleting...' : 'Delete User'}
                    </Button>
                  ) : <div></div>}
                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={isLoading || isDeleting}>{isLoading ? 'Saving...' : (editingUser ? 'Save Changes' : 'Create User')}</Button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
