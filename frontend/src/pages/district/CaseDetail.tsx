import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { demoService } from '@/services/demoService';
import type { Violation } from '@/types/violation.types';
import { useAuth } from '@/context/AuthContext';
import { formatDateTime, formatRelative } from '@/utils/formatDate';
import { formatViolationType } from '@/utils/formatRole';
import PageHeader from '@/components/shared/PageHeader';
import ConfirmModal from '@/components/shared/ConfirmModal';
import StatusBadge from '@/components/shared/StatusBadge';
import { drawerVariants, backdropVariants } from '@/utils/animations';
import {
  CheckCircle, XCircle, Archive, MapPin, User, Calendar,
  Brain, Percent, AlertTriangle, Loader2
} from 'lucide-react';

const CaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [violation, setViolation] = useState<Violation | null>(null);
  const [loading, setLoading] = useState(true);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [decisionType, setDecisionType] = useState<'challan' | 'reject' | 'close' | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchViolation = async () => {
      setLoading(true);
      const data = await demoService.mockGetViolationById(Number(id));
      setViolation(data);
      setLoading(false);
    };
    fetchViolation();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  if (!violation) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-400">Case not found.</p>
      </div>
    );
  }

  const openDecision = (type: 'challan' | 'reject' | 'close') => {
    setDecisionType(type);
    setNotes('');
    setDrawerOpen(true);
  };

  const handleSubmitDecision = async () => {
    if (!decisionType || !violation) return;
    setIsSubmitting(true);
    await demoService.mockControlRoomDecision(
      violation.id,
      decisionType,
      notes,
      user?.id ?? 1,
      user?.name ?? 'Admin'
    );
    setIsSubmitting(false);
    setDrawerOpen(false);
    setSubmitted(true);
    setConfirmOpen(false);
  };

  const decisionMeta = {
    challan: { label: 'Recommend Challan', color: 'bg-red-600 hover:bg-red-700', icon: <AlertTriangle size={16}/> },
    reject:  { label: 'Reject Case',       color: 'bg-slate-600 hover:bg-slate-700', icon: <XCircle size={16}/> },
    close:   { label: 'Close Case',         color: 'bg-green-600 hover:bg-green-700', icon: <Archive size={16}/> },
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
        </motion.div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Decision Recorded</h2>
        <p className="text-sm text-slate-500 mt-2">
          {decisionType === 'challan' ? 'Challan has been recommended.' :
           decisionType === 'reject'  ? 'Case has been rejected.' :
           'Case has been closed.'}
        </p>
        <button onClick={() => navigate('/district/queue')}
          className="mt-6 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
          Back to Queue
        </button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Case Detail" showBack backTo="/district/queue" />

      <div className="max-w-2xl mx-auto space-y-4">
        {/* Photo */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <img
            src={violation.imageUrl}
            alt="Violation evidence"
            className="w-full h-64 object-cover rounded-xl border border-slate-200 dark:border-slate-700"
          />
        </motion.div>

        {/* Basic info */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-plate text-xl font-bold text-slate-900 dark:text-slate-100">
                {violation.vehicleRegistration ?? 'Unknown Plate'}
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {violation.violationType ? formatViolationType(violation.violationType) : 'Pending AI Review'}
              </p>
            </div>
            <StatusBadge
              status={violation.status}
              label={violation.status.replace(/_/g, ' ')}
            />
          </div>

          <div className="space-y-2 text-sm">
            {[
              { icon: <Calendar size={14}/>, value: formatDateTime(violation.capturedAt) },
              { icon: <User size={14}/>,     value: violation.officerName },
              { icon: <MapPin size={14}/>,   value: violation.locationDescription ?? violation.districtName },
            ].map((row, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <span className="text-slate-400">{row.icon}</span>
                {row.value}
              </div>
            ))}
          </div>

          {violation.warningNumber && (
            <div className={`mt-4 p-2.5 rounded-xl text-sm font-semibold ${
              violation.warningNumber === 3 ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' :
              violation.warningNumber === 2 ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' :
              'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
            }`}>
              ⚠ This is warning #{violation.warningNumber} of 3 for this vehicle.
            </div>
          )}
        </motion.div>

        {/* AI Analysis */}
        {violation.aiAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 border border-blue-100 dark:border-blue-900/30 rounded-xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Brain size={18} className="text-blue-600" />
              <h3 className="font-semibold text-blue-700 dark:text-blue-400">AI Analysis Results</h3>
              <span className="ml-auto text-xs text-slate-400 font-mono">
                {violation.aiAnalysis.modelVersion}
              </span>
            </div>
            <div className="space-y-3">
              {Object.entries(violation.aiAnalysis.confidenceScores).map(([type, score]) => (
                <div key={type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700 dark:text-slate-200">{formatViolationType(type)}</span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Percent size={12}/> {Math.round(score * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score * 100}%` }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className={`h-full rounded-full ${score > 0.8 ? 'bg-blue-500' : 'bg-blue-300'}`}
                    />
                  </div>
                </div>
              ))}
            </div>
            {violation.aiAnalysis.plateNumberDetected && (
              <p className="mt-3 text-xs text-slate-500">
                Plate detected: <span className="font-plate font-semibold text-slate-700 dark:text-slate-200">{violation.aiAnalysis.plateNumberDetected}</span>
              </p>
            )}
            <p className="text-xs text-slate-400 mt-1">
              Processed in {violation.aiAnalysis.processingTimeMs}ms · {formatRelative(violation.aiAnalysis.analyzedAt)}
            </p>
          </motion.div>
        )}

        {/* Decision Buttons */}
        {violation.status === 'verification_queue' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="space-y-2"
          >
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Make a Decision:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => openDecision('challan')}
                className="flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                <AlertTriangle size={16}/> Recommend Challan
              </button>
              <button
                onClick={() => openDecision('close')}
                className="flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                <Archive size={16}/> Close Case
              </button>
              <button
                onClick={() => openDecision('reject')}
                className="flex items-center justify-center gap-2 py-3 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-sm font-semibold transition-colors"
              >
                <XCircle size={16}/> Reject
              </button>
            </div>
          </motion.div>
        )}

        {/* Already decided */}
        {violation.status !== 'verification_queue' && violation.adminDecision && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <p className="text-sm font-semibold text-green-700 dark:text-green-400">
              Decision: {violation.adminDecision.replace('_', ' ').toUpperCase()}
            </p>
            {violation.adminNotes && <p className="text-xs text-green-600 dark:text-green-500 mt-1">{violation.adminNotes}</p>}
            {violation.reviewedByName && <p className="text-xs text-green-500 mt-1">by {violation.reviewedByName}</p>}
          </div>
        )}
      </div>

      {/* Decision Drawer */}
      <AnimatePresence>
        {drawerOpen && decisionType && (
          <>
            <motion.div
              variants={backdropVariants} initial="hidden" animate="visible" exit="exit"
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              variants={drawerVariants} initial="hidden" animate="visible" exit="exit"
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-800 shadow-2xl z-50 flex flex-col"
            >
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {decisionMeta[decisionType].label}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Vehicle: <span className="font-plate">{violation.vehicleRegistration}</span>
                </p>
              </div>
              <div className="flex-1 p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Decision Notes {decisionType === 'challan' ? '(required)' : '(optional)'}
                  </label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={5}
                    placeholder="Add notes for the record…"
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-all"
                  />
                </div>

                {decisionType === 'challan' && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-400">
                    ⚠ This will recommend a challan to traffic court. This action is logged and cannot be undone.
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex gap-3">
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="flex-1 py-3 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => decisionType === 'challan' ? setConfirmOpen(true) : handleSubmitDecision()}
                  disabled={isSubmitting || (decisionType === 'challan' && !notes.trim())}
                  className={`flex-1 py-3 text-white font-semibold rounded-xl text-sm disabled:opacity-50 flex items-center justify-center gap-2 transition-colors ${decisionMeta[decisionType].color}`}
                >
                  {isSubmitting ? 'Submitting…' : decisionMeta[decisionType].label}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleSubmitDecision}
        title="Confirm Challan Recommendation"
        message="This will formally recommend a challan to the traffic court. This action is irreversible."
        confirmLabel="Yes, Recommend Challan"
        destructive
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default CaseDetail;
