import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Car, AlertTriangle, ShieldAlert, History, User as UserIcon } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ApiService } from '../../services/api';
import type { Vehicle } from '../../types';
import { pageVariants, staggerContainer, staggerItem } from '../../utils/animations';

export const VehicleSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<Vehicle | null | 'not_found'>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    
    setIsSearching(true);
    setResult(null);
    
    try {
      const res = await ApiService.searchVehicle(query.toUpperCase());
      setResult(res || 'not_found');
    } catch {
      setResult('not_found');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" exit="exit" className="max-w-2xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-2">Vehicle Lookup</h1>
        <p className="text-muted">Search by registration number to check history and warnings.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 relative">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={20} />
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. UP32AB1234" 
            className="pl-10 h-12 text-lg uppercase font-mono tracking-wider font-semibold"
          />
        </div>
        <Button type="submit" className="h-12 px-6" disabled={isSearching}>
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </form>

      {result === 'not_found' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 text-center p-8 bg-surface border border-border rounded-lg">
          <Car className="mx-auto text-muted mb-3" size={48} />
          <h3 className="text-lg font-semibold">No Vehicle Found</h3>
          <p className="text-muted text-sm mt-1">Registration number {query.toUpperCase()} is not registered in the system or has no prior records.</p>
        </motion.div>
      )}

      {result && result !== 'not_found' && (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mt-8 space-y-6">
          <motion.div variants={staggerItem}>
            <Card className="overflow-hidden border-2 border-primary-100">
              <div className="bg-primary-50 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary-100">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-lg shadow-sm flex items-center justify-center font-bold text-lg border border-border font-mono">
                    UP
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold font-mono tracking-widest">{(result as any).vehicleNumber || result.registrationNumber}</h2>
                    <p className="text-sm font-medium text-primary-700 capitalize mt-1">{(result.vehicleType || 'Unknown Type').replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <Badge variant={result.warningCount >= 3 ? 'destructive' : result.warningCount === 2 ? 'warning' : 'default'} className="text-sm py-1 px-3">
                    {result.warningCount} Warnings Issued
                  </Badge>
                  {result.warningCount >= 3 && <p className="text-xs text-danger font-semibold mt-2">Active Case in Queue</p>}
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Owner Details (Masked)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-bg flex items-center justify-center text-muted">
                      <UserIcon size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-muted">Registered Owner</p>
                      <p className="font-medium text-sm">{result.ownerName || 'Unknown Owner'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-bg flex items-center justify-center text-muted">
                      <ShieldAlert size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-muted">Status</p>
                      <p className="font-medium text-sm text-success">Active Registration</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={staggerItem}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <History size={20} /> Violation History
            </h3>
            <Card>
              <div className="divide-y divide-border">
                {((result as any).history && (result as any).history.length > 0) ? (
                  (result as any).history.map((hist: any, i: number) => (
                    <div key={i} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{hist.violationType || 'Traffic Violation'}</span>
                          <Badge variant="secondary" className="text-[10px]">Case: {hist.caseNumber}</Badge>
                        </div>
                        <p className="text-xs text-muted mt-1">Status: {hist.status} • {hist.district}</p>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-xs font-medium text-danger">Recorded</p>
                        <p className="text-[10px] text-muted mt-0.5">{new Date(hist.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted text-sm">No violation history recorded for this vehicle.</div>
                )}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};
