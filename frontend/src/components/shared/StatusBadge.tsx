import React from 'react';
import { STATUS_COLORS } from '@/utils/constants';
import { clsx } from 'clsx';

interface StatusBadgeProps {
  status: string;
  label: string;
  size?: 'sm' | 'md';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, size = 'md' }) => {
  const colorClass = STATUS_COLORS[status] ?? 'bg-slate-100 text-slate-500 border-slate-200';

  return (
    <span
      className={clsx(
        'inline-flex items-center border rounded-full font-semibold',
        colorClass,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs',
      )}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
