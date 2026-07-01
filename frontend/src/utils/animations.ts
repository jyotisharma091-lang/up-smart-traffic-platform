import type { Variants } from 'framer-motion';

export const pageVariants: Variants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } }
};

export const staggerContainer: Variants = {
  visible: { transition: { staggerChildren: 0.05 } }
};

export const staggerItem: Variants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } }
};

export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", bounce: 0, duration: 0.3 } },
  exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.2 } }
};

export const drawerVariants: Variants = {
  hidden: { x: "100%" },
  visible: { x: 0, transition: { type: "spring", bounce: 0, duration: 0.4 } },
  exit: { x: "100%", transition: { type: "spring", bounce: 0, duration: 0.3 } }
};
