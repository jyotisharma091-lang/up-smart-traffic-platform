import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Filter, Search, X, ImageIcon, CheckCircle, AlertTriangle, AlertCircle, XCircle } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { ApiService } from '../../services/api';
import type { Violation } from '../../types';
import { pageVariants, staggerContainer, staggerItem } from '../../utils/animations';

export const MyCases: React.FC = () => {
  const [cases, setCases] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState<Violation | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Show 6 records per page for a clean look
  const [reviewViolationType, setReviewViolationType] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    ApiService.getViolations().then(data => {
      setCases(data);
      setLoading(false);
    });
  }, []);

  const filteredCases = cases.filter(c => {
    const vNum = c.vehicleDetails?.registrationNumber || (c as any).vehicleNumber || '';
    return vNum.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Calculate Pagination
  const totalPages = Math.ceil(filteredCases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCases = filteredCases.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page if search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const getStatusBadge = (status: string) => {
    const s = status || 'UNKNOWN';
    switch(s) {
      case 'WARNING_ISSUED': return <Badge variant="info" className="shadow-sm bg-blue-500"><AlertCircle size={12} className="mr-1"/> Warning Sent</Badge>;
      case 'VERIFICATION_QUEUE': return <Badge variant="warning" className="shadow-sm"><AlertTriangle size={12} className="mr-1"/> Pending District Action</Badge>;
      case 'APPROVED':
      case 'CHALLAN_ISSUED': return <Badge variant="destructive" className="shadow-sm bg-red-600 text-white"><CheckCircle size={12} className="mr-1"/> Challan Generated</Badge>;
      case 'REJECTED': return <Badge variant="destructive" className="shadow-sm"><XCircle size={12} className="mr-1"/> Rejected</Badge>;
      case 'OFFICER_REVIEW': return <Badge variant="default" className="shadow-sm bg-purple-500 text-white"><AlertCircle size={12} className="mr-1"/> Needs Review</Badge>;
      case 'DISMISSED': return <Badge variant="default" className="shadow-sm bg-gray-500 text-white"><XCircle size={12} className="mr-1"/> Dismissed</Badge>;
      default: return <Badge variant="default" className="shadow-sm">{s.replace(/_/g, ' ')}</Badge>;
    }
  };

  const handleProcessForward = async () => {
    if (!selectedCase) return;
    if (!reviewViolationType || reviewViolationType === 'none') {
      alert('Please select a valid violation type before forwarding.');
      return;
    }
    
    setIsProcessing(true);
    try {
      await ApiService.updateViolationStatus(selectedCase.id, 'FORWARD_REVIEW', reviewViolationType);
      
      // Update local state to reflect changes
      setCases(prev => prev.map(c => 
        c.id === selectedCase.id ? { ...c, status: 'WARNING_ISSUED', violationType: reviewViolationType } : c
      )); // Optimistic UI update
      setSelectedCase(null);
      alert('Case successfully processed and forwarded.');
    } catch (err) {
      console.error(err);
      alert('Failed to process the case.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDiscard = async () => {
    if (!selectedCase) return;
    setIsProcessing(true);
    try {
      await ApiService.updateViolationStatus(selectedCase.id, 'DISMISSED');
      setCases(prev => prev.map(c => 
        c.id === selectedCase.id ? { ...c, status: 'DISMISSED' } : c
      ));
      setSelectedCase(null);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to discard the case.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Traffic Violation Records</h1>
          <p className="text-muted text-sm">Manage and track vehicle violations efficiently</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
            <Input 
              placeholder="Search Vehicle No..." 
              className="pl-9 w-full md:w-64 bg-bg border-border"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="p-2 border border-border rounded-md hover:bg-bg transition-colors flex items-center gap-2 text-sm text-text-sub">
            <Filter size={16} /> <span className="hidden md:inline">Filter</span>
          </button>
        </div>
      </div>

      <Card className="flex-1 overflow-hidden border-border/50 shadow-sm flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm text-text">
            <thead className="text-xs uppercase bg-bg/80 border-b border-border/50 sticky top-0 z-10 backdrop-blur-sm">
              <tr>
                <th className="px-6 py-4 font-semibold">S.No.</th>
                <th className="px-6 py-4 font-semibold">Case Seq.</th>
                <th className="px-6 py-4 font-semibold">Date & Time</th>
                <th className="px-6 py-4 font-semibold">Vehicle Number</th>
                <th className="px-6 py-4 font-semibold">Total Offenses</th>
                <th className="px-6 py-4 font-semibold">Violation Type</th>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold">Current Status</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-muted">Loading records...</td>
                </tr>
              ) : paginatedCases.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-muted">No vehicle records found</td>
                </tr>
              ) : (
                paginatedCases.map((c, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={c.id} 
                    onClick={() => setSelectedCase(c)}
                    className="border-b border-border/50 hover:bg-primary-500/5 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-muted font-mono text-xs">
                      {startIndex + idx + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-primary-400 font-mono text-xs">
                      {c.caseNumber || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-muted">
                      {new Date(c.capturedAt || (c as any).timestamp || Date.now()).toLocaleString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', hour12: true
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-primary-400">
                      {c.vehicleDetails?.registrationNumber || (c as any).vehicleNumber || 'Pending AI'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(c as any).warningCount !== undefined ? (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-danger bg-danger/10 rounded-full">
                          {(c as any).warningCount}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {c.detectedViolations ? c.detectedViolations.join(', ') : (c as any).violationType || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-muted truncate max-w-[200px]">
                      {c.locationDescription || (c as any).district || 'No location provided'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(c.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="text-xs font-bold text-primary-400 bg-primary-500/10 hover:bg-primary-500/20 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1">
                        View Details
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {!loading && filteredCases.length > 0 && (
          <div className="flex items-center justify-between px-6 py-3 bg-bg/50 border-t border-border/50">
            <span className="text-sm text-muted">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCases.length)} of {filteredCases.length} entries
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-bg/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-bg/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Premium Detail Modal */}
      <AnimatePresence>
        {selectedCase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedCase(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-6xl max-h-[90vh] bg-surface rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row ring-1 ring-border/50"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedCase(null)}
                className="absolute top-4 right-4 z-20 p-2.5 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-all hover:scale-110"
              >
                <X size={20} />
              </button>

              {/* Left Side - Image with Premium Overlay */}
              <div className="w-full md:w-[55%] bg-[#0a0a0a] relative flex items-center justify-center min-h-[300px] md:min-h-0 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none" />
                
                {selectedCase.imageUrl || (selectedCase as any).evidenceUrl ? (
                  <img 
                    src={selectedCase.imageUrl || (selectedCase as any).evidenceUrl} 
                    alt="Violation Evidence" 
                    className="w-full h-full object-contain z-0 transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center text-white/50 z-0">
                    <ImageIcon size={64} className="mb-4 opacity-50 drop-shadow-lg" />
                    <p className="text-lg font-medium tracking-wide">No Evidence Available</p>
                  </div>
                )}
                
                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <div className="bg-white/10 backdrop-blur-md text-white p-4 rounded-xl border border-white/20 shadow-lg inline-block">
                    <p className="text-[10px] text-white/70 uppercase tracking-widest font-bold mb-1">Detected Vehicle</p>
                    <p className="text-2xl font-black tracking-widest drop-shadow-md text-yellow-400">
                      {selectedCase.vehicleDetails?.registrationNumber || (selectedCase as any).vehicleNumber || 'Pending AI'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side - Details & Tracking */}
              <div className="w-full md:w-[45%] flex flex-col bg-surface overflow-y-auto">
                <div className="p-8 flex-1 space-y-8">
                  
                  {/* Header Section */}
                  <div>
                    <h2 className="text-2xl font-extrabold mb-1 bg-gradient-to-r from-primary-500 to-primary-300 bg-clip-text text-transparent">
                      Case Overview
                    </h2>
                    <p className="text-sm font-medium text-muted flex items-center gap-1.5">
                      <FileText size={14} className="text-primary-400" />
                      {new Date(selectedCase.capturedAt || (selectedCase as any).timestamp || Date.now()).toLocaleString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', hour12: true
                      })}
                    </p>
                  </div>

                  {/* Info Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 p-4 bg-bg/80 rounded-2xl border border-border/60 hover:border-primary-500/30 transition-colors">
                      <p className="text-[11px] text-muted uppercase font-bold tracking-wider mb-2 flex items-center gap-1">
                        <AlertTriangle size={12} className="text-warning"/> Current Status
                      </p>
                      {getStatusBadge(selectedCase.status)}
                    </div>
                    
                    <div className="p-4 bg-bg/80 rounded-2xl border border-border/60 hover:border-primary-500/30 transition-colors">
                      <p className="text-[11px] text-muted uppercase font-bold tracking-wider mb-1">Offense Type</p>
                      <p className="font-bold text-danger text-sm">{selectedCase.detectedViolations ? selectedCase.detectedViolations.join(', ') : (selectedCase as any).violationType || 'Unknown'}</p>
                    </div>

                    <div className="p-4 bg-bg/80 rounded-2xl border border-border/60 hover:border-primary-500/30 transition-colors">
                      <p className="text-[11px] text-muted uppercase font-bold tracking-wider mb-1">Total Offenses</p>
                      <p className="font-bold text-lg text-primary-500">
                        {(selectedCase as any).warningCount !== undefined ? `${(selectedCase as any).warningCount} Times` : 'N/A'}
                      </p>
                    </div>
                    
                    <div className="col-span-2 p-4 bg-bg/80 rounded-2xl border border-border/60 hover:border-primary-500/30 transition-colors">
                      <p className="text-[11px] text-muted uppercase font-bold tracking-wider mb-1">Location details</p>
                      <p className="font-medium text-sm text-text-sub">{selectedCase.locationDescription || (selectedCase as any).district || 'No location provided'}</p>
                    </div>
                  </div>
                  
                  {/* Officer Review Actions */}
                  {selectedCase.status === 'OFFICER_REVIEW' && (
                    <div className="p-5 bg-purple-500/10 rounded-2xl border border-purple-500/30">
                      <h3 className="text-sm font-bold text-purple-600 mb-3 flex items-center gap-2">
                        <AlertCircle size={16} /> Officer Manual Review
                      </h3>
                      <p className="text-xs text-muted mb-4">The AI did not detect a clear violation. Please review the evidence and assign a violation type if applicable.</p>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-muted mb-1">Select True Violation Type</label>
                          <select 
                            value={reviewViolationType} 
                            onChange={e => setReviewViolationType(e.target.value)}
                            className="w-full h-10 rounded-lg border border-border/50 bg-bg px-3 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                          >
                            <option value="">-- Select Violation --</option>
                            <option value="no_helmet">No Helmet</option>
                            <option value="triple_riding">Triple Riding</option>
                            <option value="wrong_parking">Wrong Parking</option>
                            <option value="overspeeding">Overspeeding</option>
                            <option value="red_light">Red Light Jump</option>
                          </select>
                        </div>
                        
                        <div className="flex gap-2">
                          <button 
                            onClick={handleProcessForward}
                            disabled={isProcessing}
                            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white text-sm font-bold py-2 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {isProcessing ? 'Processing...' : 'Process Forward'}
                          </button>
                          <button 
                            onClick={handleDiscard}
                            disabled={isProcessing}
                            className="px-4 bg-bg hover:bg-danger/10 text-danger border border-danger/20 text-sm font-bold py-2 rounded-lg transition-colors disabled:opacity-50"
                          >
                            Discard
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Modern Horizontal Activity Timeline */}
                  <div className="pt-4 mt-auto border-t border-border/50">
                    <h3 className="text-[11px] text-muted uppercase font-bold tracking-wider mb-5">Workflow Progress</h3>
                    <div className="flex items-center justify-between w-full relative before:absolute before:top-4 before:left-[10%] before:right-[10%] before:h-0.5 before:bg-border/50 before:-z-10">
                      
                      {/* Step 1 */}
                      <div className="flex flex-col items-center flex-1 z-10 text-center">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full border-[3px] border-surface bg-primary-500 text-white shadow-lg shadow-primary-500/30 mb-3">
                           <CheckCircle size={14} />
                        </div>
                        <p className="font-bold text-xs text-text whitespace-nowrap">Violation Captured</p>
                        <p className="text-[10px] text-muted mt-1 leading-tight">Submitted<br/>by Officer</p>
                      </div>
                      
                      {/* Step 2 */}
                      <div className={`flex flex-col items-center flex-1 z-10 text-center ${['VERIFICATION_QUEUE', 'APPROVED', 'CHALLAN_ISSUED', 'REJECTED'].includes(selectedCase.status) ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-[3px] border-surface mb-3 ${['VERIFICATION_QUEUE', 'APPROVED', 'CHALLAN_ISSUED', 'REJECTED'].includes(selectedCase.status) ? 'bg-warning text-white shadow-lg shadow-warning/30' : 'bg-bg text-transparent'}`}>
                          <AlertTriangle size={14} />
                        </div>
                        <p className="font-bold text-xs text-text whitespace-nowrap">District Admin Queue</p>
                        <p className="text-[10px] text-muted mt-1 leading-tight">Pending<br/>Verification</p>
                      </div>

                      {/* Step 3 */}
                      <div className={`flex flex-col items-center flex-1 z-10 text-center ${['APPROVED', 'CHALLAN_ISSUED', 'REJECTED'].includes(selectedCase.status) ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-[3px] border-surface mb-3 ${['APPROVED', 'CHALLAN_ISSUED'].includes(selectedCase.status) ? 'bg-danger text-white shadow-lg shadow-danger/30' : selectedCase.status === 'REJECTED' ? 'bg-danger text-white shadow-lg shadow-danger/30' : 'bg-bg text-transparent'}`}>
                          {selectedCase.status === 'REJECTED' ? <XCircle size={14} /> : <CheckCircle size={14} />}
                        </div>
                        <p className="font-bold text-xs text-text whitespace-nowrap">Final Decision</p>
                        <p className="text-[10px] text-muted mt-1 leading-tight">Challan<br/>Generated</p>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
