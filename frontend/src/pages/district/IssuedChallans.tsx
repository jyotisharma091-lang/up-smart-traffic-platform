import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Search, X, CheckCircle, Printer, Download, MapPin, Calendar, Car } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import PageHeader from '../../components/shared/PageHeader';
import { ApiService } from '../../services/api';
import type { Violation } from '../../types';
import { pageVariants } from '../../utils/animations';

export const IssuedChallans: React.FC = () => {
  const [challans, setChallans] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChallan, setSelectedChallan] = useState<Violation | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    ApiService.getViolations().then(data => {
      // Filter only those that are Challan Issued
      const issued = data.filter((c: any) => c.status === 'CHALLAN_ISSUED');
      setChallans(issued);
      setLoading(false);
    });
  }, []);

  const filteredChallans = challans.filter(c => {
    const vNum = c.vehicleDetails?.registrationNumber || (c as any).vehicleNumber || '';
    return vNum.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalPages = Math.ceil(filteredChallans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedChallans = filteredChallans.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6 h-full flex flex-col">
      {/* Hide header and controls during print */}
      <div className="print:hidden">
        <PageHeader 
          title="Issued Challans" 
          subtitle="View and print officially generated E-Challans" 
        />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6">
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <Input 
                placeholder="Search by Vehicle Number..." 
                className="pl-9 w-full bg-surface border-border/50"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Badge variant="destructive" className="bg-danger/10 text-danger border-danger/20 px-4 py-1.5 text-sm">
            Total Generated: {challans.length}
          </Badge>
        </div>
      </div>

      <Card className="flex-1 overflow-hidden border-border/50 shadow-sm flex flex-col print:hidden">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm text-text">
            <thead className="text-xs uppercase bg-bg/80 border-b border-border/50 sticky top-0 z-10 backdrop-blur-sm">
              <tr>
                <th className="px-6 py-4 font-semibold">Challan ID</th>
                <th className="px-6 py-4 font-semibold">Date & Time</th>
                <th className="px-6 py-4 font-semibold">Vehicle Number</th>
                <th className="px-6 py-4 font-semibold">Violation Type</th>
                <th className="px-6 py-4 font-semibold">Fine Amount</th>
                <th className="px-6 py-4 font-semibold text-right">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted">Loading records...</td>
                </tr>
              ) : paginatedChallans.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted">No challans generated yet.</td>
                </tr>
              ) : (
                paginatedChallans.map((c, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={c.id} 
                    onClick={() => setSelectedChallan(c)}
                    className="border-b border-border/50 hover:bg-primary-500/5 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-muted">
                      UP-{c.id.split('-')[0].toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(c.capturedAt || (c as any).timestamp || Date.now()).toLocaleString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', hour12: true
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-primary-400 font-plate">
                      {c.vehicleDetails?.registrationNumber || (c as any).vehicleNumber || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-danger font-medium">
                      {c.detectedViolations ? c.detectedViolations.join(', ') : (c as any).violationType || 'Traffic Violation'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold">
                      ₹1000
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="text-xs font-bold text-primary-400 bg-primary-500/10 hover:bg-primary-500/20 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1">
                        View Receipt
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {!loading && filteredChallans.length > 0 && (
          <div className="flex items-center justify-between px-6 py-3 bg-bg/50 border-t border-border/50">
            <span className="text-sm text-muted">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredChallans.length)} of {filteredChallans.length} entries
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

      {/* Official E-Challan Print View */}
      <AnimatePresence>
        {selectedChallan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 print:absolute print:inset-0 print:block print:p-0 print:bg-white print:z-[9999]">
            {/* Backdrop - hide in print */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setSelectedChallan(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm print:hidden"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden print:shadow-none print:h-auto print:block print:w-full print:rounded-none print:overflow-visible"
            >
              {/* Close Button - hide in print */}
              <button 
                onClick={() => setSelectedChallan(null)}
                className="absolute top-4 right-4 z-20 p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full transition-all print:hidden"
              >
                <X size={20} />
              </button>

              <div id="challan-printable-area" className="flex-1 overflow-y-auto p-8 sm:p-12 text-black bg-white print:overflow-visible print:p-8 print:block">
                {/* Official Government Header */}
                <div className="border-2 border-black p-1 mb-6">
                  <div className="border-2 border-black p-4 flex items-center justify-between">
                    <div className="w-24 h-24 flex items-center justify-center shrink-0">
                       <img src="/up-police-logo.png" alt="UP Police Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="text-center flex-1 px-4">
                      <h1 className="text-2xl sm:text-3xl font-serif font-black uppercase tracking-wider text-blue-900 leading-tight">Uttar Pradesh Traffic Police</h1>
                      <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide mt-1 text-red-700 leading-tight">Notice of Traffic Violation (E-Challan)</h2>
                      <p className="text-xs sm:text-sm font-semibold mt-2">Issued under Section 133 of Motor Vehicles Act, 1988</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div className="font-mono text-sm font-bold">
                    CHALLAN NO: <span className="text-lg text-red-600">UP-{selectedChallan.id.split('-')[0].toUpperCase()}</span>
                  </div>
                  <div className="font-mono text-sm font-bold">
                    DATE: {new Date(selectedChallan.capturedAt || (selectedChallan as any).timestamp || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </div>
                </div>

                {/* Details Table */}
                <table className="w-full mb-6 border-collapse border-2 border-black text-sm print:break-inside-avoid">
                  <tbody>
                    <tr className="border-b border-black">
                      <td className="p-3 border-r border-black font-bold bg-gray-100 w-1/4 uppercase">Vehicle Registration No.</td>
                      <td className="p-3 border-r border-black font-black text-xl font-plate w-1/4">
                        {selectedChallan.vehicleDetails?.registrationNumber || (selectedChallan as any).vehicleNumber || 'UNKNOWN'}
                      </td>
                      <td className="p-3 border-r border-black font-bold bg-gray-100 w-1/4 uppercase">Time of Offense</td>
                      <td className="p-3 font-semibold w-1/4">
                        {new Date(selectedChallan.capturedAt || (selectedChallan as any).timestamp || Date.now()).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                      </td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-3 border-r border-black font-bold bg-gray-100 uppercase">Owner's Name</td>
                      <td className="p-3 border-r border-black font-semibold" colSpan={3}>
                        {selectedChallan.vehicleDetails?.ownerName || 'Record Not Found in VAHAN Database'}
                      </td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-3 border-r border-black font-bold bg-gray-100 uppercase">Place of Violation</td>
                      <td className="p-3 border-r border-black font-semibold" colSpan={3}>
                        {selectedChallan.locationDescription || (selectedChallan as any).district || 'Location not recorded'}
                      </td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-3 border-r border-black font-bold bg-gray-100 uppercase text-red-700">Violation Details</td>
                      <td className="p-3 border-r border-black font-bold text-red-700 uppercase" colSpan={3}>
                        {selectedChallan.detectedViolations ? selectedChallan.detectedViolations.join(', ') : (selectedChallan as any).violationType || 'General Traffic Violation'}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 border-r border-black font-black bg-gray-200 uppercase text-lg text-center" colSpan={2}>
                        Total Fine Amount
                      </td>
                      <td className="p-3 font-black text-3xl text-center bg-gray-100" colSpan={2}>
                        ₹1000.00
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Evidence Image */}
                <div className="mb-6 border-2 border-black p-2 bg-gray-50 print:break-inside-avoid">
                  <p className="text-xs font-bold uppercase tracking-wider mb-2 border-b border-gray-300 pb-1">Photographic Evidence</p>
                  <div className="w-full h-[320px] print:h-[400px] bg-white border border-gray-300 relative flex justify-center items-center">
                    <img 
                      src={selectedChallan.imageUrl || (selectedChallan as any).evidenceUrl || 'https://via.placeholder.com/800x400'} 
                      alt="Evidence" 
                      className="max-w-full max-h-full object-contain"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-2 py-1 font-mono uppercase tracking-widest border border-white/20">
                      SYS_TS: {new Date(selectedChallan.capturedAt || (selectedChallan as any).timestamp || Date.now()).toISOString()}
                    </div>
                  </div>
                </div>

                {/* Footer terms */}
                <div className="border-t-2 border-black pt-4 text-[10px] text-justify font-medium leading-relaxed print:break-inside-avoid">
                  <p className="font-bold mb-1 uppercase">Important Instructions:</p>
                  <p>1. You are hereby directed to pay the compounding amount of ₹1000.00 within 15 days of the issuance of this notice.</p>
                  <p>2. Payment can be made online via the official portal <strong>echallan.parivahan.gov.in</strong> or deposited at the nearest Traffic Police Station / RTO.</p>
                  <p>3. Failure to pay the fine within the stipulated time will result in the forwarding of this case to the Virtual Traffic Court, which may lead to additional penalties or impounding of the vehicle.</p>
                  <p className="mt-4 text-center font-bold italic text-gray-500">This is a system generated document and does not require a physical signature.</p>
                </div>
              </div>

              {/* Action Buttons - Fixed at bottom outside scroll area */}
              <div className="shrink-0 p-5 bg-gray-100 border-t-2 border-gray-300 flex justify-end gap-4 print:hidden">
                <Button variant="outline" onClick={() => setSelectedChallan(null)} className="text-gray-800 bg-white border-gray-400 hover:bg-gray-200 font-bold text-base h-12 px-6">
                  Close Window
                </Button>
                <Button onClick={handlePrint} className="bg-blue-700 hover:bg-blue-800 text-white shadow-xl shadow-blue-700/30 font-bold text-lg h-12 px-8">
                  <Printer className="mr-3" size={22} /> Print Official Challan
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
