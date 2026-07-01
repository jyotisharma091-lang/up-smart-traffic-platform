import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { backdropVariants, modalVariants } from '@/utils/animations';
import { AlertTriangle, X } from 'lucide-react';
import { clsx } from 'clsx';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  isLoading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen, onClose, onConfirm, title, message,
  confirmLabel = 'Confirm', cancelLabel = 'Cancel',
  destructive = false, isLoading = false,
}) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          variants={backdropVariants} initial="hidden" animate="visible" exit="exit"
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          variants={modalVariants} initial="hidden" animate="visible" exit="exit"
          className="relative bg-white dark:bg-slate-800 rounded-xl shadow-lg max-w-sm w-full p-6"
          role="dialog" aria-modal="true" aria-labelledby="modal-title"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors"
          >
            <X size={16} />
          </button>
          <div className={clsx(
            'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
            destructive ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
          )}>
            <AlertTriangle size={24} />
          </div>
          <h2 id="modal-title" className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            {title}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{message}</p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={clsx(
                'px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors',
                destructive ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700',
                isLoading && 'opacity-70 cursor-not-allowed'
              )}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing…
                </span>
              ) : confirmLabel}
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default ConfirmModal;
