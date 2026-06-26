import { Variants, Transition } from 'framer-motion';
import { motion as tokens } from './tokens';

export const easeBase: Transition = { duration: tokens.base, ease: tokens.ease };
export const easeFast: Transition = { duration: tokens.fast, ease: tokens.ease };

/** Page / screen entrance. */
export const screenVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: easeBase },
  exit: { opacity: 0, y: -8, transition: easeFast },
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
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: easeBase },
};

/** Tap feedback for interactive surfaces. */
export const tap = { scale: 0.97 };
export const tapSubtle = { scale: 0.985 };

/** Celebration pop used on week unlock. */
export const celebrateVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: tokens.celebrate, ease: tokens.easeOut },
  },
  exit: { opacity: 0, scale: 0.9, transition: easeFast },
};
