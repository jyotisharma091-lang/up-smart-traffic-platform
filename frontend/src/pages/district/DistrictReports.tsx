import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Filter, Calendar, Users, FileWarning, MapPin, BarChart3, AlertTriangle, ShieldCheck } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/shared/StatCard';
import DataTable, { Column } from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import { clsx } from 'clsx';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '@/context/AuthContext';
import { MOCK_DISTRICT_STATS } from '@/mock/analytics.mock';

const TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'violations', label: 'Violations', icon: FileWarning },
  { id: 'officers', label: 'Officers', icon: Users },
  { id: 'vehicles', label: 'Vehicles', icon: ShieldCheck },
  { id: 'hotspots', label: 'Hotspots', icon: MapPin },
];

const mockLineData = [
  { name: 'Mon', violations: 120, warnings: 80, challans: 20 },
  { name: 'Tue', violations: 150, warnings: 90, challans: 30 },
  { name: 'Wed', violations: 180, warnings: 110, challans: 40 },
  { name: 'Thu', violations: 140, warnings: 85, challans: 25 },
  { name: 'Fri', violations: 200, warnings: 130, challans: 50 },
  { name: 'Sat', violations: 250, warnings: 160, challans: 80 },
  { name: 'Sun', violations: 220, warnings: 140, challans: 60 },
];

const mockPieData = [
  { name: 'No Helmet', value: 400, color: '#3B82F6' },
  { name: 'Wrong Parking', value: 300, color: '#EF4444' },
  { name: 'Triple Riding', value: 200, color: '#F59E0B' },
  { name: 'No Seatbelt', value: 100, color: '#10B981' },
];

const mockOfficerPerformance = [
  { id: '1', name: 'Ramesh Singh', pno: 'UP-12345', casesToday: 15, totalCases: 450, challanRate: 18, status: 'active' },
  { id: '2', name: 'Priya Sharma', pno: 'UP-23456', casesToday: 12, totalCases: 380, challanRate: 22, status: 'active' },
  { id: '3', name: 'Mohan Verma', pno: 'UP-34567', casesToday: 20, totalCases: 610, challanRate: 15, status: 'active' },
  { id: '4', name: 'Sanjay Kumar', pno: 'UP-45678', casesToday: 8, totalCases: 210, challanRate: 12, status: 'active' },
  { id: '5', name: 'Anita Desai', pno: 'UP-56789', casesToday: 18, totalCases: 540, challanRate: 25, status: 'active' },
];

export default function DistrictReports() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const stats = MOCK_DISTRICT_STATS;

  const officerColumns: Column<typeof mockOfficerPerformance[0]>[] = [
    {
      header: 'Officer Name & PNO',
      cell: (o) => (
        <div>
          <div className="font-semibold text-slate-800">{o.name}</div>
          <div className="text-xs text-slate-500 font-mono">{o.pno}</div>
        </div>
      )
    },
    { accessorKey: 'casesToday', header: 'Cases Today', className: 'text-center' },
    { accessorKey: 'totalCases', header: 'Total Cases', className: 'text-center' },
    { 
      header: 'Challan Conv. Rate', 
      className: 'text-center',
      cell: (o) => (
        <span className="font-medium text-slate-700">{o.challanRate}%</span>
      )
    },
    {
      header: 'Status',
      className: 'text-right',
      cell: (o) => <StatusBadge status={o.status} label="Active" size="sm" />
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <PageHeader 
        title="Reports & Analytics" 
        subtitle={`${user?.districtName ?? ''} District`}
        action={
          <div className="flex space-x-2">
            <button className="flex items-center px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 font-medium text-sm transition-colors shadow-sm">
              <Calendar size={16} className="mr-2" /> Last 7 Days
            </button>
            <button className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium text-sm transition-colors shadow-sm">
              <Download size={16} className="mr-2" /> Export
            </button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar space-x-2 border-b border-slate-200 pb-2">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                activeTab === tab.id 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              <Icon size={16} className="mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* KPIs */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<FileWarning size={22}/>} iconBg="bg-blue-50 text-blue-600" value={stats.violationsToday} label="Total Violations Today" />
                <StatCard icon={<AlertTriangle size={22}/>} iconBg="bg-amber-50 text-amber-600" value={stats.pendingQueue} label="Cases in Queue" danger />
                <StatCard icon={<ShieldCheck size={22}/>} iconBg="bg-green-50 text-green-600" value={stats.closedCases} label="Resolved Cases" />
                <StatCard icon={<MapPin size={22}/>} iconBg="bg-purple-50 text-purple-600" value={23} label="Active Hotspots" />
              </div>

              {/* Charts */}
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5">
                  <h3 className="text-base font-semibold text-slate-800 mb-4">Violations Over Time</h3>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockLineData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Line type="monotone" dataKey="violations" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="warnings" stroke="#f59e0b" strokeWidth={3} dot={false} />
                        <Line type="monotone" dataKey="challans" stroke="#ef4444" strokeWidth={3} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <h3 className="text-base font-semibold text-slate-800 mb-4">Violation Types</h3>
                  <div className="h-72 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mockPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {mockPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {mockPieData.map(item => (
                      <div key={item.name} className="flex items-center text-xs text-slate-600">
                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                        {item.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'officers' && (
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-slate-800">Officer Performance</h3>
                <button className="text-sm text-indigo-600 font-medium hover:underline flex items-center">
                  <Filter size={14} className="mr-1"/> Filter
                </button>
              </div>
              <DataTable 
                columns={officerColumns}
                data={mockOfficerPerformance}
                keyExtractor={o => o.id}
              />
            </div>
          )}

          {/* Placeholders for other tabs */}
          {['violations', 'vehicles', 'hotspots'].includes(activeTab) && (
            <div className="bg-white border border-slate-200 rounded-xl p-16 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                {activeTab === 'violations' && <FileWarning size={32} />}
                {activeTab === 'vehicles' && <ShieldCheck size={32} />}
                {activeTab === 'hotspots' && <MapPin size={32} />}
              </div>
              <h3 className="text-lg font-semibold text-slate-800 capitalize">{activeTab} Report</h3>
              <p className="text-slate-500 max-w-sm mt-2">
                Detailed reporting and analytics for {activeTab} will appear here. Filter by date, type, and location.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
