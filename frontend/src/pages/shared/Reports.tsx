import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, Map, Users, ShieldAlert } from 'lucide-react';
import { pageVariants, staggerContainer, staggerItem } from '../../utils/animations';
import { ApiService } from '../../services/api';

export const Reports: React.FC = () => {
  const [totalViolations, setTotalViolations] = useState(0);

  useEffect(() => {
    ApiService.getViolations().then(data => setTotalViolations(data.length));
  }, []);

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gradient">Reports & Analytics</h1>
          <p className="text-muted mt-1 font-medium">Generate and download official UP Police system reports</p>
        </div>
        <div className="glass px-6 py-3 rounded-xl border border-primary-500/20 shadow-lg shadow-primary-500/10 flex items-center gap-3">
          <ShieldAlert className="text-primary-500" size={24} />
          <div>
            <p className="text-xs text-muted uppercase font-bold tracking-wider">System Total</p>
            <p className="text-xl font-black text-text leading-none">{totalViolations} Violations</p>
          </div>
        </div>
      </div>

      <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { title: 'Daily Summary', desc: 'Violations and warnings for the day.', icon: <Calendar size={28} />, color: 'text-info', bg: 'bg-info/10' },
          { title: 'Hotspot Analysis', desc: 'Geographic clustering of violations.', icon: <Map size={28} />, color: 'text-danger', bg: 'bg-danger/10' },
          { title: 'Officer Activity', desc: 'Performance and submission counts.', icon: <Users size={28} />, color: 'text-primary-500', bg: 'bg-primary-500/10' },
          { title: 'Vehicle History', desc: 'Full audit of specific vehicles.', icon: <FileText size={28} />, color: 'text-warning', bg: 'bg-warning/10' }
        ].map((r, i) => (
          <motion.div variants={staggerItem} key={i}>
            <div className="glass-card h-full flex flex-col hover:border-primary-400/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="p-8 flex-1 flex flex-col">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner ${r.bg} ${r.color} group-hover:scale-110 transition-transform duration-300`}>
                  {r.icon}
                </div>
                <h3 className="font-bold text-xl mb-2 text-text">{r.title}</h3>
                <p className="text-sm text-muted font-medium flex-1">{r.desc}</p>
                
                <button className="w-full mt-8 bg-surface/50 hover:bg-primary-600 hover:text-white border border-border/50 transition-colors py-3 rounded-lg font-semibold flex items-center justify-center gap-2">
                  <Download size={18} /> Generate PDF
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};
