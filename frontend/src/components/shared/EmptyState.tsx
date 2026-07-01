import React from 'react';
import { motion } from 'framer-motion';
import { InboxIcon } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data Found',
  message = 'Try adjusting your search or filters.',
  icon,
  action,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="flex flex-col items-center justify-center py-16 px-6 text-center"
  >
    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4 text-slate-400">
      {icon ?? <InboxIcon size={32} />}
    </div>
    <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-1">{title}</h3>
    <p className="text-sm text-slate-400 dark:text-slate-500 max-w-xs">{message}</p>
    {action && <div className="mt-4">{action}</div>}
  </motion.div>
);

export default EmptyState;
