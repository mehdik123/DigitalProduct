import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { TOTAL_WEEKS, getPhase } from '../data/programConfig';
import { WeekStatus } from '../services/workoutService';
import { useLanguage } from '../contexts/LanguageContext';
import { LockBadge } from './ui';
import { haptic } from '../lib/haptics';
import { spring, tapSubtle } from '../design/motion';
import { cn } from '../lib/utils';

interface WeekSelectorProps {
    currentWeek: number;
    weeks: Record<number, WeekStatus>;
    onWeekSelect: (week: number) => void;
    onLockedSelect?: (week: number) => void;
}

export default function WeekSelector({ currentWeek, weeks, onWeekSelect, onLockedSelect }: WeekSelectorProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { t } = useLanguage();
    const list = Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1);

    const scroll = (direction: 'left' | 'right') => {
        scrollRef.current?.scrollBy({
            left: direction === 'left' ? -120 : 120,
            behavior: 'smooth',
        });
    };

    const statusOf = (week: number): WeekStatus => weeks[week] ?? 'locked';

    return (
        <div className="relative w-full">
            <button
                type="button"
                onClick={() => scroll('left')}
                className="absolute -left-1 top-1/2 z-20 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-hair bg-surface-1/80 backdrop-blur-xl transition-all hover:border-brand/40 hover:bg-brand active:scale-90 md:flex rtl:rotate-180"
                aria-label="Scroll left"
            >
                <ChevronLeft className="h-4 w-4 text-txt-hi" />
            </button>

            <div
                ref={scrollRef}
                className="scrollbar-hide flex snap-x gap-2 overflow-x-auto scroll-smooth px-0.5 py-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {list.map((week) => {
                    const status = statusOf(week);
                    const isSelected = week === currentWeek;
                    const isLocked = status === 'locked';
                    const phase = getPhase(week);

                    return (
                        <motion.button
                            key={week}
                            type="button"
                            whileHover={!isLocked ? { y: -2, scale: 1.04 } : undefined}
                            whileTap={isLocked ? { scale: 0.96 } : tapSubtle}
                            transition={spring.snappy}
                            onClick={() => {
                                haptic.light();
                                if (isLocked) onLockedSelect?.(week);
                                else onWeekSelect(week);
                            }}
                            aria-disabled={isLocked}
                            aria-current={isSelected ? 'true' : undefined}
                            className={cn(
                                'relative flex h-[4.5rem] w-[3.4rem] shrink-0 snap-center flex-col items-center justify-between rounded-[1.1rem] border p-1.5 text-center transition-colors duration-300 sm:h-[4.75rem] sm:w-[3.6rem]',
                                isSelected
                                    ? 'border-white/25 bg-grad-red shadow-[0_6px_24px_rgba(255,45,85,0.35)]'
                                    : status === 'completed'
                                        ? 'border-success/30 bg-success/[0.08]'
                                        : isLocked
                                            ? 'cursor-not-allowed border-hair bg-white/[0.02] opacity-55'
                                            : 'border-white/10 bg-surface-2/80 hover:border-brand/30'
                            )}
                        >
                            {isSelected && (
                                <motion.span
                                    layoutId="week-pill"
                                    className="pointer-events-none absolute inset-0 rounded-[1.1rem] ring-1 ring-white/20"
                                    transition={spring.smooth}
                                />
                            )}

                            <div className="self-end rtl:self-start">
                                <LockBadge state={isSelected ? 'active' : status} size={10} />
                            </div>

                            <span
                                className={cn(
                                    'font-display text-xl font-black italic leading-none tabular-nums sm:text-2xl',
                                    isSelected
                                        ? 'text-white'
                                        : status === 'completed'
                                            ? 'text-success'
                                            : isLocked
                                                ? 'text-txt-lo'
                                                : 'text-txt-hi'
                                )}
                            >
                                {week}
                            </span>

                            <span
                                className={cn(
                                    'line-clamp-2 text-[6.5px] font-bold uppercase leading-tight tracking-wide sm:text-[7px]',
                                    isSelected ? 'text-white/85' : 'text-txt-lo'
                                )}
                            >
                                {t(phase.phaseLabelKey)}
                            </span>
                        </motion.button>
                    );
                })}
            </div>

            <button
                type="button"
                onClick={() => scroll('right')}
                className="absolute -right-1 top-1/2 z-20 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-hair bg-surface-1/80 backdrop-blur-xl transition-all hover:border-brand/40 hover:bg-brand active:scale-90 md:flex rtl:rotate-180"
                aria-label="Scroll right"
            >
                <ChevronRight className="h-4 w-4 text-txt-hi" />
            </button>
        </div>
    );
}
