import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Camera } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import PageHeader from '../../components/shared/PageHeader';
import { ApiService } from '../../services/api';
import type { Violation } from '../../types';
import { pageVariants, staggerContainer, staggerItem } from '../../utils/animations';

export const VerificationQueue: React.FC = () => {
  const [queue, setQueue] = useState<Violation[]>([]);
  const [selectedCase, setSelectedCase] = useState<Violation | null>(null);

  useEffect(() => {
    ApiService.getVerificationQueue().then(setQueue);
  }, []);

  const handleDecision = async (decision: string) => {
    if (!selectedCase) return;
    
    try {
      const status = decision === 'challan' ? 'APPROVED' : decision === 'reject' ? 'REJECTED' : 'CLOSED';
      await ApiService.updateViolationStatus(selectedCase.id, status);
      
      // Update queue
      setQueue(q => q.filter(c => c.id !== selectedCase.id));
      setSelectedCase(null);

      if (decision === 'challan') {
        alert('Case Approved! Forwarded for Challan Generation.');
      } else if (decision === 'reject') {
        alert('Case Rejected and Closed.');
      } else {
        alert('Case Closed.');
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
      <PageHeader 
        title="Verification Queue" 
        subtitle="Review and verify AI-flagged violations (3rd warning reached)" 
        showBack={true} 
        backTo="/district/dashboard" 
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2 space-y-4">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            {queue.map(c => (
              <motion.div variants={staggerItem} key={c.id} className="mb-4">
                <div 
                  className={`glass-card cursor-pointer transition-all duration-300 ${selectedCase?.id === c.id ? 'border-primary-500 shadow-xl shadow-primary-500/20 scale-[1.02]' : 'hover:border-primary-400/50 hover:shadow-lg'}`}
                  onClick={() => setSelectedCase(c)}
                >
                  <div className="flex p-5 gap-5">
                    <div className="w-28 h-28 rounded-xl overflow-hidden shrink-0 shadow-inner">
                      <img src={c.imageUrl || (c as any).evidenceUrl || 'https://via.placeholder.com/150'} alt="Violation" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-extrabold text-xl font-plate text-text">{c.vehicleDetails?.registrationNumber || (c as any).vehicleNumber || 'UNKNOWN'}</h3>
                        <span className="text-xs font-semibold text-muted bg-surface/50 px-2 py-1 rounded-md">
                          {new Date(c.capturedAt || (c as any).timestamp || Date.now()).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-danger font-bold flex items-center gap-1.5 mb-2 bg-danger/10 w-fit px-2 py-1 rounded-md">
                        <AlertTriangle size={14} /> {(c as any).warningCount || 3} Warnings — {c.detectedViolations ? c.detectedViolations[0] : (c as any).violationType || 'Unknown'}
                      </p>
                      <p className="text-xs text-muted font-medium">Officer ID: {c.officerId}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {queue.length === 0 && (
              <div className="text-center p-16 glass-card">
                <CheckCircle size={48} className="mx-auto text-success/50 mb-4" />
                <h3 className="text-xl font-bold text-text">All Caught Up!</h3>
                <p className="text-muted mt-2">The verification queue is completely empty.</p>
              </div>
            )}
          </motion.div>
        </div>

        <div className="w-full lg:w-1/2">
          <AnimatePresence mode="wait">
            {selectedCase ? (
              <motion.div 
                key="details"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="sticky top-24"
              >
                <div className="glass-card shadow-2xl">
                  <div className="p-5 border-b border-border/50 bg-surface/30 flex justify-between items-center">
                    <h2 className="font-bold text-xl">Case Review</h2>
                    <span className="text-xs font-mono text-muted bg-bg/50 px-2 py-1 rounded">ID: {selectedCase.id.split('-')[0]}</span>
                  </div>
                  <div className="p-6">
                    <div className="relative rounded-xl overflow-hidden mb-6 shadow-md border border-border/50">
                      <img src={selectedCase.imageUrl || (selectedCase as any).evidenceUrl || 'https://via.placeholder.com/400'} alt="Evidence" className="w-full h-72 object-cover" />
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-semibold">
                        <Camera size={16} /> AI Captured
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 text-sm mb-8 bg-surface/30 p-4 rounded-xl border border-border/50">
                      <div>
                        <p className="text-muted text-xs font-bold uppercase tracking-wider mb-1">Registration</p>
                        <p className="font-black font-plate text-2xl text-text">{selectedCase.vehicleDetails?.registrationNumber || (selectedCase as any).vehicleNumber || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-muted text-xs font-bold uppercase tracking-wider mb-1">AI Confidence</p>
                        <p className="font-black text-2xl text-success">{selectedCase.confidenceScore}%</p>
                      </div>
                      <div className="col-span-2 border-t border-border/50 pt-4 mt-2">
                        <p className="text-muted text-xs font-bold uppercase tracking-wider mb-1">Detected Violations</p>
                        <div className="flex gap-2 flex-wrap mt-2">
                           {selectedCase.detectedViolations ? selectedCase.detectedViolations.map((v, i) => (
                             <span key={i} className="bg-danger/10 text-danger border border-danger/20 px-3 py-1.5 rounded-lg font-bold text-xs uppercase">{v}</span>
                           )) : (
                             <span className="bg-danger/10 text-danger border border-danger/20 px-3 py-1.5 rounded-lg font-bold text-xs uppercase">
                               {(selectedCase as any).violationType || 'Unknown'}
                             </span>
                           )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <Button onClick={() => handleDecision('challan')} className="w-full h-14 text-lg font-bold bg-danger hover:bg-danger/90 shadow-lg shadow-danger/20">
                        <CheckCircle className="mr-2" size={20} /> Approve Case
                      </Button>
                      <div className="flex gap-4">
                        <Button variant="outline" onClick={() => handleDecision('reject')} className="w-full h-12 text-danger border-danger/20 hover:bg-danger/10 font-semibold">
                          <XCircle className="mr-2" size={18} /> Reject
                        </Button>
                        <Button variant="secondary" onClick={() => handleDecision('close')} className="w-full h-12 font-semibold">
                          Close Case
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="hidden lg:flex items-center justify-center h-[600px] glass-card border-dashed border-2 text-muted font-medium text-lg">
                <div className="text-center">
                  <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-muted/50" />
                  </div>
                  Select a case from the queue to review
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
