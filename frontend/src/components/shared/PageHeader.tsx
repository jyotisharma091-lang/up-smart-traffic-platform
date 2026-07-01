import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  backTo?: string;
  action?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title, subtitle, showBack, backTo, action,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) navigate(backTo);
    else navigate(-1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6"
    >
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={handleBack}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </motion.div>
  );
};

export default PageHeader;
