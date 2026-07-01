import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Filter, Calendar, MapPin, Activity, CheckCircle2, AlertTriangle, Users } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import PageHeader from '@/components/shared/PageHeader';
import { staggerContainer, staggerItem } from '@/utils/animations';
import { 
  MOCK_DISTRICT_PERFORMANCE, MOCK_VIOLATION_TREND_7D, MOCK_VIOLATION_TREND_30D, 
  MOCK_VIOLATION_TREND_90D, MOCK_VIOLATION_TYPE_BREAKDOWN 
} from '@/mock/analytics.mock';

const COLORS = ['#6366F1', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#64748B'];

const TABS = ['Overview', 'Violations', 'Officers', 'Vehicles', 'Hotspots'];

const StateReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [trendRange, setTrendRange] = useState<'7d' | '30d' | '90d'>('7d');
  
  const trendData = trendRange === '7d' ? MOCK_VIOLATION_TREND_7D 
                  : trendRange === '30d' ? MOCK_VIOLATION_TREND_30D 
                  : MOCK_VIOLATION_TREND_90D;

  const kpis = [
    { label: 'Total Violations', value: '8,421', icon: <Activity />, color: 'bg-indigo-100 text-indigo-600' },
    { label: 'Challans Recommended', value: '89', icon: <CheckCircle2 />, color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Active Officers', value: '412', icon: <Users />, color: 'bg-blue-100 text-blue-600' },
    { label: 'Pending Verification', value: '124', icon: <AlertTriangle />, color: 'bg-amber-100 text-amber-600' },
  ];

  return (
    <div className="pb-8">
      <PageHeader 
        title="Reports & Analytics" 
        subtitle="Global analytics and district-wise monitoring"
        action={
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold transition-colors">
              <Filter size={16} /> Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors">
              <Download size={16} /> Export
            </button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border ${
              activeTab === tab
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
        
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => (
            <motion.div key={i} variants={staggerItem} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
              <div className={`p-3 rounded-xl ${kpi.color}`}>
                {kpi.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{kpi.value}</p>
                <p className="text-xs text-slate-500 font-medium">{kpi.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={staggerItem} className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white">Violations Over Time</h3>
              <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1">
                {['7d', '30d', '90d'].map(range => (
                  <button
                    key={range}
                    onClick={() => setTrendRange(range as any)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                      trendRange === range ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    {range.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} tickLine={false} axisLine={false} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
                  <YAxis tick={{fontSize: 12, fill: '#64748b'}} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                  />
                  <Line type="monotone" dataKey="count" stroke="#6366F1" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#6366F1', stroke: '#fff', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div variants={staggerItem} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6">AI Detection Breakdown</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOCK_VIOLATION_TYPE_BREAKDOWN}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={80}
                    paddingAngle={2}
                    dataKey="count"
                  >
                    {MOCK_VIOLATION_TYPE_BREAKDOWN.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value: any, name: any, props: any) => [`${value} (${props.payload.percentage}%)`, props.payload.label]}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* District Rankings Table */}
        <motion.div variants={staggerItem} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">District Rankings</h3>
              <p className="text-xs text-slate-500 mt-1">Performance and active monitoring by district</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-6 py-4">District</th>
                  <th className="px-6 py-4">Total Violations</th>
                  <th className="px-6 py-4">Verification Queue</th>
                  <th className="px-6 py-4">Challans Issued</th>
                  <th className="px-6 py-4">Performance Bar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {MOCK_DISTRICT_PERFORMANCE.map((d) => (
                  <tr key={d.districtId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">#{d.rank}</td>
                    <td className="px-6 py-4 font-medium flex items-center gap-2">
                      <MapPin size={14} className="text-slate-400"/> {d.districtName}
                    </td>
                    <td className="px-6 py-4">{d.violationsCount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${d.pendingQueue > 20 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {d.pendingQueue}
                      </span>
                    </td>
                    <td className="px-6 py-4">{d.challans}</td>
                    <td className="px-6 py-4 w-48">
                      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-indigo-500 h-full rounded-full" 
                          style={{ width: `${(d.violationsCount / MOCK_DISTRICT_PERFORMANCE[0].violationsCount) * 100}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default StateReports;
