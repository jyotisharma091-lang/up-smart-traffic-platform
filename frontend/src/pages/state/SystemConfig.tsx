import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, ShieldAlert, MonitorPlay, Server, Database, Globe, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import PageHeader from '@/components/shared/PageHeader';
import { staggerContainer, staggerItem } from '@/utils/animations';
import * as Switch from '@radix-ui/react-switch';

const SystemConfig: React.FC = () => {
  const { user, isDemoMode, setDemoMode } = useAuth();
  
  const [settings, setSettings] = useState({
    aiConfidenceThreshold: 85,
    autoAssignQueue: true,
    dataRetentionDays: 90,
    smsGatewayEnabled: true,
    maintenanceMode: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('System configurations saved successfully.');
    }, 800);
  };

  const handleDemoToggle = (checked: boolean) => {
    if (setDemoMode) {
      setDemoMode(checked);
    }
  };

  return (
    <div className="pb-8">
      <PageHeader 
        title="System Configuration" 
        subtitle="Manage global platform settings and operational modes"
        action={
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        }
      />

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-4xl space-y-6">
        
        {/* Environment Settings */}
        <motion.section variants={staggerItem} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
              <MonitorPlay size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Environment & Mode</h2>
              <p className="text-sm text-slate-500">Toggle demonstration capabilities</p>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  Demo Mode Active
                  {isDemoMode && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-bold">DEMO</span>}
                </h3>
                <p className="text-sm text-slate-500 mt-1 max-w-xl">
                  When active, the system uses mock data and prevents any real database modifications.
                  Essential for training and presentations.
                </p>
              </div>
              <Switch.Root
                checked={isDemoMode}
                onCheckedChange={handleDemoToggle}
                className="w-12 h-6 bg-slate-300 dark:bg-slate-600 rounded-full relative data-[state=checked]:bg-amber-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
              >
                <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 will-change-transform data-[state=checked]:translate-x-6 shadow-sm" />
              </Switch.Root>
            </div>
          </div>
        </motion.section>

        {/* AI & Verification */}
        <motion.section variants={staggerItem} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">AI Analysis & Verification</h2>
              <p className="text-sm text-slate-500">Configure machine learning thresholds</p>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-semibold text-slate-900 dark:text-white text-sm">AI Confidence Threshold: {settings.aiConfidenceThreshold}%</label>
              </div>
              <p className="text-xs text-slate-500 mb-3">Violations with AI confidence below this threshold will be flagged for mandatory manual verification.</p>
              <input 
                type="range" 
                min="50" max="99" 
                value={settings.aiConfidenceThreshold} 
                onChange={(e) => setSettings({...settings, aiConfidenceThreshold: parseInt(e.target.value)})}
                className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
                <span>50%</span>
                <span>75%</span>
                <span>99%</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Auto-Assign Verification Queue</h3>
                <p className="text-xs text-slate-500 mt-1">Automatically distribute pending verifications evenly among active district admins.</p>
              </div>
              <Switch.Root
                checked={settings.autoAssignQueue}
                onCheckedChange={(c) => setSettings({...settings, autoAssignQueue: c})}
                className="w-11 h-6 bg-slate-300 dark:bg-slate-600 rounded-full relative data-[state=checked]:bg-indigo-600 transition-colors focus:outline-none"
              >
                <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-5 shadow-sm" />
              </Switch.Root>
            </div>
          </div>
        </motion.section>

        {/* System Health & Data */}
        <motion.section variants={staggerItem} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <div className="p-2 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-lg">
              <Database size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Data & Integrations</h2>
              <p className="text-sm text-slate-500">Manage data lifecycle and external services</p>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Data Retention (Days)</label>
                <input 
                  type="number" 
                  value={settings.dataRetentionDays}
                  onChange={(e) => setSettings({...settings, dataRetentionDays: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <p className="text-xs text-slate-500 mt-1">Closed cases older than this will be archived.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">SMS Gateway Integration</h3>
                <p className="text-xs text-slate-500 mt-1">Send automatic SMS warnings to registered vehicle owners.</p>
              </div>
              <Switch.Root
                checked={settings.smsGatewayEnabled}
                onCheckedChange={(c) => setSettings({...settings, smsGatewayEnabled: c})}
                className="w-11 h-6 bg-slate-300 dark:bg-slate-600 rounded-full relative data-[state=checked]:bg-indigo-600 transition-colors focus:outline-none"
              >
                <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-5 shadow-sm" />
              </Switch.Root>
            </div>
          </div>
        </motion.section>

        {/* Danger Zone */}
        <motion.section variants={staggerItem} className="bg-white dark:bg-slate-800 rounded-2xl border border-red-200 dark:border-red-900/50 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-red-100 dark:border-red-900/30 flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-red-600 dark:text-red-400">Danger Zone</h2>
              <p className="text-sm text-red-500/80">Critical system operations</p>
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Maintenance Mode</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-lg">
                  Blocks all non-admin users from accessing the system. Used during database migrations or critical updates.
                </p>
              </div>
              <button 
                onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors border ${
                  settings.maintenanceMode 
                    ? 'bg-red-600 text-white border-red-600 hover:bg-red-700' 
                    : 'bg-white dark:bg-slate-800 text-red-600 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20'
                }`}
              >
                {settings.maintenanceMode ? 'Disable Maintenance Mode' : 'Enable Maintenance Mode'}
              </button>
            </div>
          </div>
        </motion.section>

      </motion.div>
    </div>
  );
};

export default SystemConfig;
