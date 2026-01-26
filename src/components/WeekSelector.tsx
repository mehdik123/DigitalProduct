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
        <div className="relative w-full overflow-hidden">
            {/* Left Arrow */}
            <button
                onClick={() => scroll('left')}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center bg-black/60 backdrop-blur-md hover:bg-red-600 rounded-xl border border-white/10 hover:border-red-500 transition-all group shadow-2xl"
                aria-label="Scroll left"
            >
                <ChevronLeft className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </button>

            {/* Swipeable Week Bar */}
            <div
                ref={scrollRef}
                className="flex gap-2 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory py-4 px-4 md:px-12"
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
                                w-16 h-16 md:w-20 md:h-20
                                rounded-2xl md:rounded-[1.5rem]
                                flex flex-col items-center justify-center
                                transition-all duration-500
                                ${isActive
                                    ? 'bg-red-600 shadow-[0_10px_40px_rgba(220,30,58,0.4)] scale-110 border-2 border-red-400 z-10'
                                    : isCompleted
                                        ? 'bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20'
                                        : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-red-500/30'
                                }
                                active:scale-95
                            `}
                        >
                            {/* Week Number */}
                            <span className={`
                                text-xl md:text-3xl font-black italic
                                ${isActive ? 'text-white' : isCompleted ? 'text-emerald-400' : 'text-neutral-500'}
                            `}>
                                {week}
                            </span>

                            {/* Week Label */}
                            <span className={`
                                text-[7px] md:text-[9px] font-black uppercase tracking-[0.2em]
                                ${isActive ? 'text-white/80' : isCompleted ? 'text-emerald-400/80' : 'text-neutral-700'}
                            `}>
                                WEEK
                            </span>

                            {/* Active Indicator Bar */}
                            {isActive && (
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-full" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Right Arrow */}
            <button
                onClick={() => scroll('right')}
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center bg-black/60 backdrop-blur-md hover:bg-red-600 rounded-xl border border-white/10 hover:border-red-500 transition-all group shadow-2xl"
                aria-label="Scroll right"
            >
                <ChevronRight className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </button>

            {/* Scroll Fades */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black to-transparent pointer-events-none z-10 md:hidden" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black to-transparent pointer-events-none z-10 md:hidden" />
        </div>
    );
}
