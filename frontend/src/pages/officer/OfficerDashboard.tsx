import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent } from '../../components/ui/Card';
import { Camera, Search, FileText, Bell, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../utils/cn';
import { staggerContainer, staggerItem } from '../../utils/animations';
import { ApiService } from '../../services/api';

export const OfficerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { notifications } = useNotifications();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const [metrics, setMetrics] = useState({ todaysViolations: 0, pendingReviews: 0, activeOfficers: 0, approvedCases: 0 });
  const [recentCases, setRecentCases] = useState<any[]>([]);
  const recentNotifications = notifications.slice(0, 3);

  useEffect(() => {
    ApiService.getDashboardMetrics().then(res => {
      if (res) setMetrics(res);
    });
    
    ApiService.getViolations().then(data => {
      // Get the most recent 3 cases
      if (data && Array.isArray(data)) {
        setRecentCases(data.slice(0, 3));
      }
    }).catch(err => console.error("Failed to fetch cases for dashboard", err));
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
          <h1 className="text-2xl font-bold tracking-tight">Good Morning, {user?.fullName?.split(' ')[0] || 'Officer'} 👋</h1>
          <p className="text-muted">Today: {today}</p>
        </div>
      </motion.div>

      {/* Status Card (Mobile full width) */}
      <motion.div variants={staggerItem}>
        <Card className="bg-primary-900 text-white border-none overflow-hidden relative">
          <div className="absolute inset-0 bg-primary-800 opacity-50" style={{ backgroundImage: 'radial-gradient(circle at 100% 0%, var(--color-primary-600) 0%, transparent 50%)' }} />
          <CardContent className="p-6 relative z-10">
            <h3 className="text-primary-100 font-medium mb-4">Your Activity Today</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold">{metrics.todaysViolations}</p>
                <p className="text-xs text-primary-200 mt-1 uppercase tracking-wider">Cases</p>
              </div>
              <div className="text-center border-l border-primary-700">
                <p className="text-3xl font-bold">{metrics.pendingReviews}</p>
                <p className="text-xs text-primary-200 mt-1 uppercase tracking-wider">Pending</p>
              </div>
              <div className="text-center border-l border-primary-700">
                <p className="text-3xl font-bold">{metrics.approvedCases || 0}</p>
                <p className="text-xs text-primary-200 mt-1 uppercase tracking-wider">Challans</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={staggerItem}>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ActionCard 
            icon={<Camera size={28} className="text-white" />} 
            title="Capture Violation" 
            desc="Take a photo or upload"
            onClick={() => navigate('/officer/capture')}
            primary
          />
          <ActionCard 
            icon={<Search size={24} className="text-primary-600" />} 
            title="Search Vehicle" 
            desc="Check history & warnings"
            onClick={() => navigate('/officer/search')}
          />
          <ActionCard 
            icon={<FileText size={24} className="text-primary-600" />} 
            title="My Cases" 
            desc="View submitted violations"
            onClick={() => navigate('/officer/cases')}
          />
          <ActionCard 
            icon={<Bell size={24} className="text-primary-600" />} 
            title="Notifications" 
            desc="View alerts"
            onClick={() => {}}
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Cases */}
        <motion.div variants={staggerItem}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">My Recent Cases</h2>
            <button onClick={() => navigate('/officer/cases')} className="text-sm text-primary-600 hover:underline">View All →</button>
          </div>
          <Card>
            <div className="divide-y divide-border">
              {recentCases.length > 0 ? (
                recentCases.map((c, i) => {
                  const reg = c.vehicleDetails?.registrationNumber || c.vehicleNumber || 'Pending AI';
                  const type = c.detectedViolations ? c.detectedViolations[0] : c.violationType || 'Unknown';
                  const time = new Date(c.capturedAt || c.timestamp || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                  
                  let icon = Clock;
                  let color = 'text-info';
                  if (['APPROVED', 'CHALLAN_ISSUED'].includes(c.status)) {
                    icon = CheckCircle;
                    color = 'text-success';
                  } else if (c.status === 'VERIFICATION_QUEUE') {
                    icon = AlertCircle;
                    color = 'text-warning';
                  } else if (c.status === 'REJECTED') {
                    icon = AlertCircle;
                    color = 'text-danger';
                  }

                  return (
                    <div key={i} className="p-4 flex items-center justify-between hover:bg-bg/50 transition-colors cursor-pointer" onClick={() => navigate('/officer/cases')}>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-bg flex items-center justify-center font-mono font-bold text-xs">
                          {reg.substring(0,6)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{reg}</p>
                          <p className="text-xs text-muted">{type}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-semibold ${color}`}>{c.status.replace(/_/g, ' ')}</span>
                          {React.createElement(icon, { size: 16, className: color })}
                        </div>
                        <span className="text-[10px] text-muted mt-1">{time}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-sm text-muted">No cases found</div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Recent Notifications */}
        <motion.div variants={staggerItem}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Notifications</h2>
          </div>
          <Card>
            <div className="divide-y divide-border">
              {recentNotifications.map(n => (
                <div key={n.id} className="p-4 flex gap-3">
                  <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${n.isRead ? 'bg-muted' : 'bg-danger'}`} />
                  <div>
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-xs text-muted mt-0.5">{n.message}</p>
                    <p className="text-[10px] text-muted mt-2">{new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                </div>
              ))}
              {recentNotifications.length === 0 && (
                <div className="p-6 text-center text-sm text-muted">No new notifications</div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

const ActionCard = ({ icon, title, desc, onClick, primary = false }: any) => (
  <motion.button
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={cn(
      "p-4 md:p-5 rounded-xl text-left shadow-sm border flex flex-col justify-center transition-all",
      primary 
        ? "bg-gradient-to-br from-primary-600 to-primary-800 border-transparent text-white shadow-md" 
        : "bg-surface border-border hover:shadow-md"
    )}
  >
    <div className={cn("h-12 w-12 rounded-full flex items-center justify-center mb-3", primary ? "bg-white/20" : "bg-primary-50")}>
      {icon}
    </div>
    <p className={cn("font-semibold text-sm md:text-base leading-tight", primary ? "text-white" : "text-text")}>{title}</p>
    <p className={cn("text-xs mt-1 hidden md:block", primary ? "text-primary-100" : "text-muted")}>{desc}</p>
  </motion.button>
);
