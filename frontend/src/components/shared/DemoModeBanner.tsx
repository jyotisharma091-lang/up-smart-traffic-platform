import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMode } from '../../context/ModeContext';
import { useAuth } from '../../context/AuthContext';

export const DemoModeBanner: React.FC = () => {
  const { mode, toggleMode } = useMode();
  const { role } = useAuth();

  return (
    <AnimatePresence>
      {mode === 'demo' && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-accent-400 h-[40px] w-full flex items-center justify-center px-4 text-sm font-medium text-gray-900 z-50 fixed top-0"
        >
          <span className="flex-1 text-center">
            ⚠️ DEMO MODE — No real data is being used or affected.
          </span>
          {role === 'state_admin' && (
            <button onClick={toggleMode} className="underline hover:text-black shrink-0">
              Switch to Production →
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
