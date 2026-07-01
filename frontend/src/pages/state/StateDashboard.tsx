import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../../components/ui/Card';
import { staggerContainer, staggerItem } from '../../utils/animations';
import { Camera, AlertTriangle, CheckCircle, Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { ApiService } from '../../services/api';
import type { Violation } from '../../types';

const lineData = [
  { name: 'Mon', violations: 1200 },
  { name: 'Tue', violations: 1350 },
  { name: 'Wed', violations: 1100 },
  { name: 'Thu', violations: 1450 },
  { name: 'Fri', violations: 1600 },
  { name: 'Sat', violations: 1900 },
  { name: 'Sun', violations: 1750 },
];

const barData = [
  { name: 'No Helmet', count: 420 },
  { name: 'Triple Riding', count: 310 },
  { name: 'Wrong Parking', count: 215 },
  { name: 'Seatbelt', count: 180 },
  { name: 'Mobile Use', count: 122 },
];

export const StateDashboard: React.FC = () => {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [metrics, setMetrics] = useState({ todaysViolations: 0, pendingReviews: 0, activeOfficers: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const data = await ApiService.getViolations();
      if (data) setViolations(data);
    };
    fetchData();
    ApiService.getDashboardMetrics().then(res => { if (res) setMetrics(res); });
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
          <h1 className="text-3xl font-bold tracking-tight text-gradient">State Overview</h1>
          <p className="text-muted mt-1 font-medium">Uttar Pradesh Traffic Command Center</p>
        </div>
        <div className="flex gap-3">
          <select className="glass border-border border rounded-md text-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium">
            <option>Today</option>
            <option>Last 7 Days</option>
            <option>This Month</option>
          </select>
          <button className="bg-primary-600 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20">
            Export Report
          </button>
        </div>
      </motion.div>

      <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Violations Today" value={metrics.todaysViolations} trend="Live Data" icon={<Camera size={24} />} color="text-danger" bg="bg-danger/10 border border-danger/20" />
        <KpiCard title="Verification Queue" value={metrics.pendingReviews} trend="Pending Review" icon={<AlertTriangle size={24} />} color="text-warning" bg="bg-warning/10 border border-warning/20" />
        <KpiCard title="Total Cases" value={violations.length} trend="This week" icon={<CheckCircle size={24} />} color="text-success" bg="bg-success/10 border border-success/20" />
        <KpiCard title="Active Officers" value={metrics.activeOfficers} trend="Online now" icon={<Users size={24} />} color="text-info" bg="bg-info/10 border border-info/20" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={staggerItem} className="lg:col-span-2">
          <div className="glass-card h-full">
            <div className="p-6 pb-2">
              <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-text to-muted">Violation Trend (Last 7 Days)</h2>
            </div>
            <div className="p-6 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 20, right: 20, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-base)" opacity={0.5} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--color-muted-base)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--color-muted-base)' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-surface-base)', borderColor: 'var(--color-border-base)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: 'var(--color-text-base)', fontWeight: 600 }}
                  />
                  <Line type="monotone" dataKey="violations" stroke="var(--color-primary-500)" strokeWidth={4} dot={{ r: 4, fill: 'var(--color-primary-500)', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        <motion.div variants={staggerItem}>
          <div className="glass-card h-full">
            <div className="p-6 pb-2">
              <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-text to-muted">AI Detection Breakdown</h2>
            </div>
            <div className="p-6 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--color-border-base)" opacity={0.5} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: 'var(--color-text-base)', fontWeight: 500 }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip cursor={{ fill: 'var(--color-bg-base)', opacity: 0.5 }} contentStyle={{ backgroundColor: 'var(--color-surface-base)', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={20}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--color-primary-500)' : 'var(--color-primary-400)'} opacity={1 - (index * 0.15)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
      
      <motion.div variants={staggerItem}>
         <div className="glass-card">
           <div className="p-6 border-b border-border/50 bg-surface/30">
             <h2 className="text-xl font-semibold">District Performance Overview</h2>
           </div>
           <div className="overflow-x-auto p-2">
             <table className="w-full text-sm text-left">
               <thead className="text-xs text-muted uppercase bg-bg/40 rounded-lg">
                 <tr>
                   <th className="px-6 py-4 font-semibold tracking-wider rounded-tl-lg rounded-bl-lg">Rank</th>
                   <th className="px-6 py-4 font-semibold tracking-wider">District</th>
                   <th className="px-6 py-4 font-semibold tracking-wider">Total Violations</th>
                   <th className="px-6 py-4 font-semibold tracking-wider">Verification Queue</th>
                   <th className="px-6 py-4 font-semibold tracking-wider rounded-tr-lg rounded-br-lg">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-border/30">
                 {[
                   { rank: 1, district: 'Lucknow', vio: 284, queue: 12, status: 'Active' },
                   { rank: 2, district: 'Kanpur', vio: 215, queue: 8, status: 'Active' },
                   { rank: 3, district: 'Agra', vio: 198, queue: 15, status: 'Active' },
                   { rank: 4, district: 'Varanasi', vio: 165, queue: 5, status: 'Active' },
                 ].map((row, i) => (
                   <tr key={i} className="hover:bg-primary-50/50 dark:hover:bg-primary-900/20 transition-colors group">
                     <td className="px-6 py-4 font-bold text-primary-600 dark:text-primary-400">#{row.rank}</td>
                     <td className="px-6 py-4 font-semibold text-text">{row.district}</td>
                     <td className="px-6 py-4 font-medium">{row.vio}</td>
                     <td className="px-6 py-4">
                       <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${row.queue > 10 ? 'bg-danger/10 text-danger border border-danger/20' : 'bg-warning/10 text-warning border border-warning/20'}`}>
                         {row.queue} Pending
                       </span>
                     </td>
                     <td className="px-6 py-4 text-success flex items-center gap-2 font-medium">
                       <span className="relative flex h-3 w-3">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
                       </span>
                       {row.status}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         </div>
      </motion.div>
    </motion.div>
  );
};

const KpiCard = ({ title, value, trend, icon, color, bg }: any) => (
  <div className="glass-card hover:-translate-y-1 transition-transform duration-300">
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bg} ${color} shadow-inner`}>
          {icon}
        </div>
        <span className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-sm backdrop-blur-md ${trend.includes('+') ? 'bg-danger/10 text-danger border border-danger/10' : 'bg-muted/10 text-muted border border-border/50'}`}>
          {trend}
        </span>
      </div>
      <div>
        <h3 className="text-4xl font-extrabold tracking-tight text-text mb-1">{value}</h3>
        <p className="text-sm text-muted font-semibold tracking-wide uppercase">{title}</p>
      </div>
    </div>
  </div>
);
