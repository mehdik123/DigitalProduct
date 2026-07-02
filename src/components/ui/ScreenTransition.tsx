import { ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { screenVariants } from '../../design/motion';

interface ScreenTransitionProps {
  screenKey: string;
  children: ReactNode;
  className?: string;
}

/** premium-motion skill — cross-fade + lift between screens. */
export function ScreenTransition({ screenKey, children, className }: ScreenTransitionProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={screenKey}
        variants={screenVariants}
        initial="hidden"
        animate="show"
        exit="exit"
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
