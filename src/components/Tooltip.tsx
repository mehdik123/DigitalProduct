import { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
    content: string;
    title?: string;
}

export default function Tooltip({ content, title }: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
                setIsVisible(false);
            }
        };

        if (isVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isVisible]);

    return (
        <div className="relative inline-block" ref={tooltipRef}>
            <button
                type="button"
                onClick={() => setIsVisible(!isVisible)}
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                className="group inline-flex items-center justify-center w-4 h-4 md:w-5 md:h-5 rounded-full bg-red-600/20 hover:bg-red-600/30 transition-all"
                aria-label="Help"
            >
                <HelpCircle className="w-3 h-3 md:w-3.5 md:h-3.5 text-red-500 group-hover:text-red-400 transition-colors" />
            </button>

            {isVisible && (
                <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 md:w-72 pointer-events-none">
                    <div className="bg-slate-900 border border-red-600/30 rounded-xl p-4 shadow-2xl shadow-red-900/20 backdrop-blur-xl">
                        {title && (
                            <h4 className="text-xs font-black text-red-500 uppercase tracking-wider mb-2">
                                {title}
                            </h4>
                        )}
                        <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                            {content}
                        </p>
                        {/* Arrow */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-slate-900" />
                    </div>
                </div>
            )}
        </div>
    );
}
