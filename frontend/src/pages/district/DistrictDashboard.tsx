import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../../components/ui/Card';
import { staggerContainer, staggerItem } from '../../utils/animations';
import { Button } from '../../components/ui/Button';
import { ApiService } from '../../services/api';
import type { Violation } from '../../types';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DistrictDashboard: React.FC = () => {
  const [queue, setQueue] = useState<Violation[]>([]);
  const [metrics, setMetrics] = useState({ todaysViolations: 0, pendingReviews: 0, activeOfficers: 0 });
  const [officerActivity, setOfficerActivity] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    ApiService.getVerificationQueue().then(res => { if (res) setQueue(res); });
    ApiService.getDashboardMetrics().then(res => { if (res) setMetrics(res); });
    ApiService.getOfficerActivity().then(res => { if (res) setOfficerActivity(res); });
  }, []);

  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6 md:space-y-8"
    >
      <motion.div variants={staggerItem} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lucknow District Overview</h1>
          <p className="text-muted">Verification Queue and Local Stats</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-danger/10 text-danger px-3 py-1 rounded-full text-sm font-semibold">
            {queue.length} Pending Cases
          </span>
        </div>
      </motion.div>

      <motion.div variants={staggerItem} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox label="Queue" value={metrics.pendingReviews} color="text-danger" sub="pending" />
        <StatBox label="Officers" value={metrics.activeOfficers} color="text-text" sub="active" />
        <div onClick={() => navigate('/district/challans')} className="cursor-pointer transition-transform hover:scale-105">
          <StatBox label="Total Challans" value="View" color="text-danger" sub="Generated" />
        </div>
        <StatBox label="Violations Today" value={metrics.todaysViolations} color="text-primary-600" sub="total" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={staggerItem} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
             <h2 className="text-lg font-semibold">Verification Queue</h2>
             <button onClick={() => navigate('/district/queue')} className="text-sm text-primary-600 hover:underline">View All →</button>
          </div>
          
          <div className="space-y-4">
            {queue.map(caseItem => (
              <Card key={caseItem.id} className="overflow-hidden hover:border-primary-300 transition-colors cursor-pointer" onClick={() => navigate('/district/queue')}>
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-32 h-32 bg-bg shrink-0">
                    <img src={caseItem.imageUrl || (caseItem as any).evidenceUrl || 'https://via.placeholder.com/150'} alt="Violation" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{caseItem.vehicleDetails?.registrationNumber || (caseItem as any).vehicleNumber || 'Unknown'}</h3>
                        <p className="text-sm font-medium text-danger mt-1">
                          🚨 {(caseItem as any).warningCount !== undefined ? (caseItem as any).warningCount : 'Multiple'} Offenses — {caseItem.detectedViolations ? caseItem.detectedViolations.join(', ') : (caseItem as any).violationType || 'Unknown'}
                        </p>
                      </div>
                      <span className="text-xs text-muted">
                        {new Date(caseItem.capturedAt || (caseItem as any).timestamp || Date.now()).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="default" className="w-full md:w-auto">Review Case →</Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            {queue.length === 0 && (
              <div className="p-8 text-center text-muted bg-surface rounded-md border border-border">
                <CheckCircle className="mx-auto mb-2 text-success" size={32} />
                <p>Queue is empty. Great job!</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div variants={staggerItem} className="space-y-6">
          <Card>
            <div className="p-4 border-b border-border font-semibold">Officer Activity</div>
            <div className="p-0">
              <div className="divide-y divide-border">
                {officerActivity.length > 0 ? (
                  officerActivity.map((officer, i) => (
                    <div key={officer.id || i} className="p-4 flex justify-between items-center text-sm">
                      <div>
                        <p className="font-medium">{officer.name}</p>
                        <p className={`text-xs flex items-center gap-1 mt-0.5 ${officer.isOnline ? 'text-success' : 'text-muted'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${officer.isOnline ? 'bg-success' : 'bg-slate-400'}`}></span> 
                          {officer.isOnline ? 'Online' : 'Offline'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{officer.violations}</p>
                        <p className="text-xs text-muted">Violations</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-muted">No activity found.</div>
                )}
              </div>
            </div>
          </Card>
          
          <Card className="bg-accent-50 border-accent-200">
            <div className="p-4 flex gap-3">
              <AlertCircle className="text-accent-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-accent-800">Priority Alert</p>
                <p className="text-xs text-accent-700 mt-1">Gomti Nagar intersection is showing 40% higher violation rate than usual today.</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

    </motion.div>
  );
};

const StatBox = ({ label, value, color, sub }: any) => (
  <Card>
    <CardContent className="p-4 text-center">
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      <p className="text-sm font-medium mt-1">{label}</p>
      <p className="text-xs text-muted mt-0.5 uppercase tracking-wider">{sub}</p>
    </CardContent>
  </Card>
);

const CheckCircle = ({ className, size }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);
