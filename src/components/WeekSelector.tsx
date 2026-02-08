import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

interface WeekSelectorProps {
    currentWeek: number;
    onWeekSelect: (week: number) => void;
    completedWeeks?: number[];
}

export default function WeekSelector({ currentWeek, onWeekSelect, completedWeeks = [] }: WeekSelectorProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const weeks = [1, 2, 3, 4, 5, 6, 7, 8];

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 120;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="relative w-full">
            {/* Left Arrow */}
            <button
                onClick={() => scroll('left')}
                className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center bg-black/40 backdrop-blur-xl hover:bg-red-600 rounded-full border border-white/10 hover:border-red-500 transition-all group shadow-2xl active:scale-90"
                aria-label="Scroll left"
            >
                <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            </button>

            {/* Swipeable Week Bar */}
            <div
                ref={scrollRef}
                className="flex gap-3 md:gap-5 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory py-6 px-4 md:px-0 mask-linear-fade"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {weeks.map((week) => {
                    const isActive = week === currentWeek;
                    const isCompleted = completedWeeks.includes(week);

                    return (
                        <button
                            key={week}
                            onClick={() => onWeekSelect(week)}
                            className={`
                                relative flex-shrink-0 snap-center
                                w-16 h-20 md:w-20 md:h-24
                                rounded-2xl
                                flex flex-col items-center justify-center
                                transition-all duration-500
                                ${isActive
                                    ? 'bg-gradient-to-b from-red-600 to-red-700 shadow-[0_0_30px_rgba(220,38,38,0.4)] scale-110 border border-white/20 z-10 translate-y-[-4px]'
                                    : isCompleted
                                        ? 'bg-emerald-900/20 border border-emerald-500/20 hover:bg-emerald-900/40'
                                        : 'bg-zinc-900/40 backdrop-blur-md border border-white/5 hover:bg-zinc-800/60 hover:border-white/10'
                                }
                                active:scale-95
                            `}
                        >
                            {/* Week Number */}
                            <span className={`
                                text-2xl md:text-3xl font-black italic mb-1
                                ${isActive ? 'text-white drop-shadow-md' : isCompleted ? 'text-emerald-500' : 'text-zinc-600'}
                            `}>
                                {week}
                            </span>

                            {/* Week Label */}
                            <span className={`
                                text-[8px] font-black uppercase tracking-[0.2em]
                                ${isActive ? 'text-white/90' : isCompleted ? 'text-emerald-500/80' : 'text-zinc-700'}
                            `}>
                                WEEK
                            </span>

                            {/* Active Indicator Glow */}
                            {isActive && (
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Right Arrow */}
            <button
                onClick={() => scroll('right')}
                className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center bg-black/40 backdrop-blur-xl hover:bg-red-600 rounded-full border border-white/10 hover:border-red-500 transition-all group shadow-2xl active:scale-90"
                aria-label="Scroll right"
            >
                <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            </button>
        </div>
    );
}
