import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import { staggerContainer, staggerItem } from '@/utils/animations';
import { MOCK_HOTSPOTS } from '@/mock/analytics.mock';
import HotspotMap, { HotspotData } from '@/components/map/HotspotMap';

const UP_CENTER: [number, number] = [26.8467, 80.9462]; // Centered on Lucknow for UP mapping

const StateMap: React.FC = () => {
  const [districtFilter, setDistrictFilter] = useState('All');

  const filteredMockHotspots = districtFilter === 'All' 
    ? MOCK_HOTSPOTS 
    : MOCK_HOTSPOTS.filter(h => h.districtName === districtFilter);

  const mappedHotspots: HotspotData[] = filteredMockHotspots.map(h => ({
    id: h.id,
    name: h.name || 'Unknown',
    lat: h.centerLatitude,
    lng: h.centerLongitude,
    violations: h.violationCount,
    severity: h.severity,
    type: h.dominantViolationType || 'Unknown',
    district: h.districtName
  }));

  const districts = ['All', ...Array.from(new Set(MOCK_HOTSPOTS.map(h => h.districtName)))];

  return (
    <div className="pb-8 h-full flex flex-col min-h-[calc(100vh-140px)]">
      <PageHeader 
        title="State Hotspot Map" 
        subtitle="Geospatial visualization of violation hotspots across Uttar Pradesh"
        action={
          <div className="flex gap-2">
            <select 
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {districts.map(d => <option key={d} value={d}>{d === 'All' ? 'All Districts' : d}</option>)}
            </select>
            <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold transition-colors">
              <Layers size={16} /> Layers
            </button>
          </div>
        }
      />

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Map Container */}
        <motion.div variants={staggerItem} className="lg:col-span-3 h-full min-h-[500px]">
          <HotspotMap hotspots={mappedHotspots} center={UP_CENTER} zoom={7} />
        </motion.div>

        {/* Sidebar */}
        <motion.div variants={staggerItem} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col max-h-[600px]">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-white">Top Hotspots</h3>
            <p className="text-xs text-slate-500">Highest violation density areas</p>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              {[...filteredMockHotspots].sort((a,b) => b.violationCount - a.violationCount).slice(0, 10).map((h, i) => (
                <div key={h.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-xl transition-colors cursor-pointer group">
                  <div className="flex items-start gap-3">
                    <div className="w-6 text-center text-sm font-bold text-slate-400 group-hover:text-indigo-600">{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{h.name}</h4>
                      <p className="text-xs text-slate-500 truncate">{h.districtName}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                        h.severity === 'critical' ? 'bg-red-100 text-red-700' :
                        h.severity === 'high' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {h.violationCount}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default StateMap;
