import React from 'react';
import { motion } from 'framer-motion';
import { staggerItem } from '@/utils/animations';
import AnimatedCounter from './AnimatedCounter';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  iconBg?: string;
  value: number;
  label: string;
  trend?: number;   // positive = up, negative = down, 0 = flat
  trendLabel?: string;
  danger?: boolean; // invert trend color (rising = bad)
}

const StatCard: React.FC<StatCardProps> = ({
  icon, iconBg = 'bg-indigo-100 text-indigo-600',
  value, label, trend, trendLabel, danger = false,
}) => {
  const trendPositive = danger ? (trend ?? 0) < 0 : (trend ?? 0) > 0;
  const trendNeutral  = (trend ?? 0) === 0;

  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -2, boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm cursor-default select-none"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center', iconBg)}>
          {icon}
        </div>
        {trend !== undefined && (
          <div className={clsx(
            'flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full',
            trendNeutral  ? 'bg-slate-100 text-slate-500' :
            trendPositive ? 'bg-green-50 text-green-700' :
                            'bg-red-50 text-red-700'
          )}>
            {trendNeutral ? <Minus size={12} /> :
             trendPositive ? <TrendingUp size={12} /> :
             <TrendingDown size={12} />}
            {Math.abs(trend ?? 0)}%
          </div>
        )}
      </div>
      <AnimatedCounter
        target={value}
        className="block text-3xl font-bold text-slate-900 dark:text-slate-100 leading-none mb-1"
      />
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</p>
      {trendLabel && (
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{trendLabel}</p>
      )}
    </motion.div>
  );
};

export default StatCard;
