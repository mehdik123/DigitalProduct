import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { TOTAL_WEEKS, getPhase } from '../data/programConfig';
import { WeekStatus } from '../services/workoutService';
import { useLanguage } from '../contexts/LanguageContext';
import { LockBadge } from './ui';
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
            left: direction === 'left' ? -160 : 160,
            behavior: 'smooth',
        });
    };

    const statusOf = (week: number): WeekStatus => weeks[week] ?? 'locked';

    return (
        <div className="relative w-full">
            <button
                onClick={() => scroll('left')}
                className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center bg-surface-1/70 backdrop-blur-xl hover:bg-brand rounded-full border border-hair transition-all active:scale-90 rtl:rotate-180"
                aria-label="Scroll left"
            >
                <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            <div
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth snap-x py-4 px-2 md:px-0"
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
                            whileTap={{ scale: 0.94 }}
                            onClick={() => (isLocked ? onLockedSelect?.(week) : onWeekSelect(week))}
                            aria-disabled={isLocked}
                            className={cn(
                                'relative flex-shrink-0 snap-center w-[72px] h-24 rounded-2xl border p-2 sm:w-[80px] sm:h-28 sm:rounded-3xl sm:p-2.5',
                                'flex flex-col items-center justify-between text-center transition-colors duration-300',
                                isSelected
                                    ? 'bg-brand border-white/20 shadow-[0_0_28px_rgba(255,45,85,0.4)]'
                                    : status === 'completed'
                                        ? 'bg-success/10 border-success/25'
                                        : isLocked
                                            ? 'bg-white/[0.03] border-hair cursor-not-allowed opacity-60'
                                            : 'bg-surface-2 border-hair hover:border-white/25'
                            )}
                        >
                            <div className="self-end rtl:self-start">
                                <LockBadge state={isSelected ? 'active' : status} size={12} />
                            </div>

                            <span
                                className={cn(
                                    'font-display tabular-nums text-2xl font-black italic leading-none sm:text-3xl',
                                    isSelected ? 'text-white' : status === 'completed' ? 'text-success' : isLocked ? 'text-txt-lo' : 'text-white'
                                )}
                            >
                                {week}
                            </span>

                            <span
                                className={cn(
                                    'text-[8px] font-bold uppercase tracking-wider leading-tight line-clamp-2',
                                    isSelected ? 'text-white/90' : 'text-txt-lo'
                                )}
                            >
                                {t(phase.phaseLabelKey)}
                            </span>
                        </motion.button>
                    );
                })}
            </div>

            <button
                onClick={() => scroll('right')}
                className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center bg-surface-1/70 backdrop-blur-xl hover:bg-brand rounded-full border border-hair transition-all active:scale-90 rtl:rotate-180"
                aria-label="Scroll right"
            >
                <ChevronRight className="w-5 h-5 text-white" />
            </button>
        </div>
    );
}
