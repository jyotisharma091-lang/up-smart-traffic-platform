// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import PageHeader from '../../components/shared/PageHeader';
import { ApiService } from '../../services/api';
import axiosInstance from '../../apis/axiosInstance';
import type { User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, CheckCircle, ShieldAlert, Edit2, MoreVertical, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants, modalVariants, backdropVariants } from '../../utils/animations';

export const OfficerManagement: React.FC = () => {
  const { user } = useAuth();

  const [officers, setOfficers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [pnoNumber, setPnoNumber] = useState('');
  const [policeStationId, setPoliceStationId] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('ACTIVE');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchOfficers = async () => {
    try {
      const response = await axiosInstance.get('/users');
      // For district admin, the backend already filters by their district.
      // We just need to filter by role if state admin is viewing this page (though state admin shouldn't normally).
      const fetchedOfficers = response.data.data.filter((u: any) => u.role === 'TRAFFIC_OFFICER');
      setOfficers(fetchedOfficers);
    } catch (err) {
      console.error('Failed to fetch officers', err);
    }
  };

  useEffect(() => {
    fetchOfficers();
  }, []);

  const handleOpenAdd = () => {
    setFullName('');
    setPnoNumber('');
    setPoliceStationId('');
    setPassword('');
    setStatus('ACTIVE');
    setEditingUser(null);
    setError('');
    setIsSubmitting(false);
    setIsModalOpen(true);
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleOpenEdit = (officer: User) => {
    setFullName(officer.fullName || '');
    setPnoNumber(officer.pnoNumber || '');
    setPoliceStationId(officer.policeStation || '');
    setStatus(officer.status || 'ACTIVE');
    setPassword(''); // Don't prefill password
    setEditingUser(officer);
    setError('');
    setIsSubmitting(false);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !pnoNumber || !policeStationId) {
      setError("Please fill all required fields.");
      return;
    }

    const cleanPno = pnoNumber.replace(/^0+/, '');

    if (cleanPno.length < 9 || cleanPno.length > 10) {
      setError("PNO Number must be 9 or 10 digits (excluding starting zeros).");
      return;
    }

    if (!editingUser && !password) {
      setError("Initial password is required for new officers.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (editingUser) {
        await axiosInstance.put(`/users/${editingUser.id}`, {
          fullName,
          pnoNumber: cleanPno,
          policeStation: policeStationId,
          status
        });
        showSuccess("Officer updated successfully!");
      } else {
        const newUser = {
          fullName,
          username: cleanPno, // Using PNO as username fallback
          role: 'TRAFFIC_OFFICER',
          pnoNumber: cleanPno,
          mobileNumber: 'N/A_' + Math.random(), // Mocking mobile since it's required in schema but not in form
          password,
          district: user?.district || 'Unknown',
          policeStation: policeStationId,
          designation: 'Traffic Officer',
          status: 'ACTIVE'
        };
        await ApiService.registerUser(newUser);
        showSuccess("Officer registered successfully!");
      }

      await fetchOfficers();
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save officer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!editingUser) return;
    if (!window.confirm("Are you sure you want to permanently delete this officer?")) return;

    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/users/${editingUser.id}`);
      showSuccess("Officer deleted successfully!");
      await fetchOfficers();
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete officer.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="Officer Management"
          subtitle="Register and manage traffic officers in your district."
          showBack={true}
          backTo="/district/dashboard"
        />
        <Button onClick={handleOpenAdd}>
          <UserPlus size={18} className="mr-2" /> Register Officer
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
                <th className="px-6 py-4 font-medium">Name & PNO</th>
                <th className="px-6 py-4 font-medium">Police Station</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {officers.map((o) => (
                <tr key={o.id} className="hover:bg-bg/50 transition-colors bg-surface group">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-text">{o.fullName}</p>
                    <p className="text-xs text-muted mt-0.5">{o.pnoNumber}</p>
                  </td>
                  <td className="px-6 py-4 font-medium">{o.policeStation || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <Badge variant={o.status === 'ACTIVE' ? 'success' : o.status === 'PENDING' ? 'warning' : 'destructive'}>{o.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleOpenEdit(o)}
                      className="text-primary-600 hover:text-primary-800 p-2 transition-opacity bg-primary-50 rounded-lg mr-2"
                    >
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {officers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted">
                    No traffic officers found in your district.
                  </td>
                </tr>
              )}
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
              <h2 className="text-xl font-bold mb-6">{editingUser ? 'Edit Officer' : 'Register New Officer'}</h2>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Full Name *</label>
                    <Input
                      placeholder="e.g. Ramesh Kumar"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">PNO Number *</label>
                    <Input
                      placeholder="e.g. 1234567890"
                      value={pnoNumber}
                      onChange={(e) => {
                        // Allow typing, but we'll strip leading zeros on save, 
                        // or just prevent leading zero from being typed as first char
                        let val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setPnoNumber(val);
                        if (error && error.includes('PNO')) setError(null);
                      }}
                      onBlur={() => {
                        const checkVal = pnoNumber.replace(/^0+/, '');
                        if (pnoNumber && (checkVal.length < 9 || checkVal.length > 10)) {
                          setError("PNO Number must be 9 or 10 valid digits (excluding starting zeros).");
                        } else if (pnoNumber !== checkVal) {
                          setPnoNumber(checkVal); // Auto-correct leading zeros on blur
                        }
                      }}
                      disabled={!!editingUser} // PNO shouldn't be easily changed once created
                      maxLength={10}
                    />
                    <p className="text-xs text-muted mt-1">Must be 9 to 10 numeric digits</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Police Station Name *</label>
                    <Input
                      placeholder="e.g. Hazratganj PS"
                      value={policeStationId}
                      onChange={(e) => setPoliceStationId(e.target.value)}
                    />
                  </div>

                  {!editingUser && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Initial Password *</label>
                      <Input
                        type="password"
                        placeholder="Set an initial password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  )}

                  {editingUser && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Status *</label>
                      <select
                        className="w-full flex h-10 rounded-md border border-border bg-bg px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="DEACTIVATED">Deactivated</option>
                      </select>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="text-sm text-danger flex items-center gap-2 bg-danger/10 p-3 rounded-md">
                    <ShieldAlert size={16} /> {error}
                  </div>
                )}

                <div className="pt-4 flex justify-between">
                  {editingUser ? (
                    <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting || isSubmitting}>
                      {isDeleting ? 'Deleting...' : 'Delete Officer'}
                    </Button>
                  ) : <div></div>}
                  <Button type="submit" disabled={isSubmitting || isDeleting}>
                    {isSubmitting ? 'Saving...' : (editingUser ? 'Save Changes' : 'Register Officer')}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
