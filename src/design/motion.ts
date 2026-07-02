import { Variants, Transition } from 'framer-motion';
import { motion as tokens } from './tokens';

/** Spring presets — premium-motion skill standard. */
export const spring = {
  snappy: { type: 'spring' as const, stiffness: 400, damping: 30 },
  smooth: { type: 'spring' as const, stiffness: 260, damping: 26 },
  gentle: { type: 'spring' as const, stiffness: 180, damping: 24 },
  ring: { type: 'spring' as const, stiffness: 120, damping: 20 },
};

export const easeBase: Transition = { duration: tokens.base, ease: tokens.ease };
export const easeFast: Transition = { duration: tokens.fast, ease: tokens.ease };

/** Page / screen entrance — spring-based cross-fade + lift. */
export const screenVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: spring.smooth },
  exit: { opacity: 0, y: -8, transition: { duration: tokens.fast, ease: tokens.ease } },
};

/** Staggered list container. */
export const listVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.04 },
  },
};

/** List item. */
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: spring.smooth },
};

/** Tap feedback for interactive surfaces. */
export const tap = { scale: 0.96 };
export const tapSubtle = { scale: 0.985 };

/** Celebration pop used on week unlock. */
export const celebrateVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: spring.gentle,
  },
  exit: { opacity: 0, scale: 0.9, transition: easeFast },
};
