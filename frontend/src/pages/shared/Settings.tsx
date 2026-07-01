import React from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useMode } from '../../context/ModeContext';
import { pageVariants } from '../../utils/animations';

export const Settings: React.FC = () => {
  const { mode, toggleMode } = useMode();

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">System Configuration</h1>
        <p className="text-muted">Manage global platform settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><SettingsIcon size={20} /> Operational Mode</CardTitle>
          <CardDescription>Switch the entire platform between Demo and Production datasets.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-bg">
            <div>
              <p className="font-semibold">Current Mode: <span className="uppercase text-primary-600">{mode}</span></p>
              <p className="text-sm text-muted mt-1">
                {mode === 'demo' ? 'Using synthetic data. Safe for training.' : 'Live data active. Actions have real consequences.'}
              </p>
            </div>
            <Button variant={mode === 'demo' ? 'default' : 'destructive'} onClick={toggleMode}>
              Switch to {mode === 'demo' ? 'Production' : 'Demo'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Model Configuration</CardTitle>
          <CardDescription>Manage endpoints for the violation detection engine.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Model Endpoint URL</label>
            <Input defaultValue="https://ai-engine.traffic.up.gov.in/v1/detect" disabled />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confidence Threshold (%)</label>
            <Input type="number" defaultValue="85" disabled />
          </div>
          <Button disabled><Save size={16} className="mr-2" /> Save AI Settings</Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
