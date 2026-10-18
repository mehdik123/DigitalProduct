import { Variants, Transition } from 'framer-motion';
import { motion as tokens } from './tokens';

/** Calmer springs — less bounce, more fluid. */
export const spring = {
  snappy: { type: 'spring' as const, stiffness: 320, damping: 32 },
  smooth: { type: 'spring' as const, stiffness: 220, damping: 28 },
  gentle: { type: 'spring' as const, stiffness: 160, damping: 26 },
  ring: { type: 'spring' as const, stiffness: 120, damping: 22 },
};

export const easeBase: Transition = { duration: tokens.base, ease: tokens.ease };
export const easeFast: Transition = { duration: tokens.fast, ease: tokens.ease };

export const screenVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: spring.gentle },
  exit: { opacity: 0, y: -4, transition: { duration: 0.18, ease: tokens.ease } },
};

export const listVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.02 },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: spring.gentle },
};

export const tap = { scale: 0.97 };
export const tapSubtle = { scale: 0.985 };

export const celebrateVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: {
    opacity: 1,
    scale: 1,
    transition: spring.gentle,
  },
  exit: { opacity: 0, scale: 0.96, transition: easeFast },
};
