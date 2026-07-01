import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { pageVariants } from '../utils/animations';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      variants={pageVariants} initial="hidden" animate="visible" exit="exit"
      className="flex flex-col items-center justify-center min-h-[70vh] text-center"
    >
      <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-6">
        <ShieldAlert size={48} className="text-primary-600" />
      </div>
      <h1 className="text-4xl font-bold text-text mb-2">404</h1>
      <h2 className="text-xl font-semibold text-text-sub mb-4">Page Not Found</h2>
      <p className="text-muted max-w-md mx-auto mb-8">
        The page you are looking for does not exist or you do not have permission to access it.
      </p>
      <Button onClick={() => navigate('/')} size="lg">
        Return to Dashboard
      </Button>
    </motion.div>
  );
};
