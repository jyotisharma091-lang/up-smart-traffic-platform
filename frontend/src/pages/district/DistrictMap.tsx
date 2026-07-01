import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import PageHeader from '@/components/shared/PageHeader';
import { clsx } from 'clsx';
import { MapPin } from 'lucide-react';
import HotspotMap, { HotspotData } from '@/components/map/HotspotMap';

const mockHotspots = [
  { id: 1, name: 'MG Road', lat: 26.8467, lng: 80.9462, violations: 47, type: 'No Helmet', severity: 'critical' },
  { id: 2, name: 'Hazratganj Crossing', lat: 26.8500, lng: 80.9499, violations: 38, type: 'Wrong Parking', severity: 'high' },
  { id: 3, name: 'Alambagh', lat: 26.8123, lng: 80.9012, violations: 29, type: 'Triple Riding', severity: 'medium' },
  { id: 4, name: 'Charbagh', lat: 26.8335, lng: 80.9167, violations: 22, type: 'No Seatbelt', severity: 'medium' },
  { id: 5, name: 'Gomti Nagar Extension', lat: 26.8589, lng: 81.0055, violations: 18, type: 'Mobile Usage', severity: 'low' },
];

export default function DistrictMap() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Helmet', 'Seatbelt', 'Triple', 'Parking', 'Mobile'];

  const filteredMockHotspots = activeFilter === 'All' 
    ? mockHotspots 
    : mockHotspots.filter(h => h.type.includes(activeFilter));

  const mappedHotspots: HotspotData[] = filteredMockHotspots.map(h => ({
    id: h.id,
    name: h.name,
    lat: h.lat,
    lng: h.lng,
    violations: h.violations,
    severity: h.severity,
    type: h.type
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 h-[calc(100vh-80px)] flex flex-col">
      <PageHeader 
        title="Hotspot Map & Violation Distribution" 
        subtitle={`${user?.districtName ?? ''} District`}
      />

      {/* Filters */}
      <div className="flex overflow-x-auto hide-scrollbar space-x-2 pb-2 flex-shrink-0">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={clsx(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap border',
              activeFilter === filter 
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-[500px]">
        {/* Map Area */}
        <div className="flex-1 min-h-[400px]">
          <HotspotMap hotspots={mappedHotspots} center={[26.8467, 80.9462]} zoom={12} />
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 flex flex-col gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 flex-1">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-base font-semibold text-slate-800 flex items-center">
                <MapPin size={18} className="mr-2 text-indigo-500"/> Top 5 Hotspots
              </h3>
            </div>
            
            <div className="space-y-4">
              {mockHotspots.map((hotspot, idx) => (
                <div key={hotspot.id} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{hotspot.name}</p>
                    <p className="text-xs text-slate-500 flex items-center justify-between mt-1">
                      <span>{hotspot.type}</span>
                      <span className="font-medium text-red-600">{hotspot.violations} cases</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-slate-100 pt-4">
              <p className="text-xs text-slate-500 mb-2 font-medium">AI Confidence Avg</p>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '84%' }}></div>
              </div>
              <p className="text-xs font-bold text-slate-700 text-right mt-1">84%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
