import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Check,
  Unlock,
  Flame,
  Target,
  Trophy,
  Star,
  Shield,
  Flag,
  Crown,
  X,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button, IconButton } from './ui';
import { celebrateVariants, spring } from '../design/motion';
import { celebratePR } from '../lib/celebration';
import type { MilestoneDef } from '../lib/milestones';
import { cn } from '../lib/utils';

const ICONS = {
  zap: Zap,
  check: Check,
  unlock: Unlock,
  flame: Flame,
  target: Target,
  trophy: Trophy,
  star: Star,
  shield: Shield,
  flag: Flag,
  crown: Crown,
} as const;

interface MilestoneModalProps {
  milestone: MilestoneDef | null;
  onClose: () => void;
  progress?: { done: number; total: number };
}

export default function MilestoneModal({ milestone, onClose, progress }: MilestoneModalProps) {
  const { t } = useLanguage();

  useEffect(() => {
    if (milestone) celebratePR();
  }, [milestone?.id]);

  const Icon = milestone ? ICONS[milestone.icon] : Zap;

  return (
    <AnimatePresence>
      {milestone && (
        <motion.div
          key={milestone.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[280] flex items-end justify-center bg-black/80 p-3 backdrop-blur-xl sm:items-center sm:p-6"
          onClick={onClose}
        >
          <motion.div
            variants={celebrateVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm overflow-hidden rounded-[1.75rem] border border-white/12 bg-surface-1 p-6 shadow-soft"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand/25 blur-3xl" />
            <div className="pointer-events-none absolute -left-10 bottom-0 h-28 w-28 rounded-full bg-coral/15 blur-3xl" />

            <div className="absolute right-3 top-3">
              <IconButton aria-label="close" onClick={onClose}>
                <X className="h-4 w-4" />
              </IconButton>
            </div>

            <div className="relative flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0.6, rotate: -12 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={spring.gentle}
                className={cn(
                  'mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-grad-red text-white shadow-red'
                )}
              >
                <Icon className="h-8 w-8" strokeWidth={2.25} />
              </motion.div>

              <p className="text-[9px] font-black uppercase tracking-[0.28em] text-brand">
                {t('milestone.badge')}
              </p>
              <h2 className="mt-2 font-display text-2xl font-black uppercase italic leading-none tracking-tight text-txt-hi">
                {t(milestone.titleKey)}
              </h2>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-txt-mid">
                {t(milestone.bodyKey)}
              </p>

              {progress && (
                <div className="mt-5 w-full">
                  <div className="mb-1.5 flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-txt-lo">
                    <span>{t('milestone.progress')}</span>
                    <span className="stat text-brand">
                      {progress.done}/{progress.total}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-3">
                    <motion.div
                      className="h-full rounded-full bg-grad-red"
                      initial={{ width: 0 }}
                      animate={{ width: `${(progress.done / progress.total) * 100}%` }}
                      transition={spring.smooth}
                    />
                  </div>
                </div>
              )}

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={onClose}
                className="mt-6 tracking-[0.18em]"
              >
                {t('milestone.continue')}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
