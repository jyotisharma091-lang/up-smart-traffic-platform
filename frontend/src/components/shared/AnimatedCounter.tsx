import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

interface AnimatedCounterProps {
  target: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  target, className, prefix = '', suffix = '',
}) => {
  const prefersReduced = useReducedMotion();
  const count = useMotionValue(0);
  const spring = useSpring(count, { stiffness: 80, damping: 20 });
  const [display, setDisplay] = React.useState(0);

  useEffect(() => {
    if (prefersReduced) { setDisplay(target); return; }
    count.set(target);
    const unsub = spring.on('change', v => setDisplay(Math.round(v)));
    return unsub;
  }, [target, count, spring, prefersReduced]);

  return (
    <span className={className}>
      {prefix}{new Intl.NumberFormat('en-IN').format(display)}{suffix}
    </span>
  );
};

export default AnimatedCounter;
