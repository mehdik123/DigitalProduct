import { Progress } from "@nutrition/components/ui/progress";
import { Info, Leaf } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@nutrition/components/ui/tooltip";

interface FiberTrackerProps {
    fiber: number;
}

export const FiberTracker = ({ fiber }: FiberTrackerProps) => {
    // Logic: < 25 (Poor), 25-35 (Moderate), 35-50 (Good), > 50 (Too Much)
    const getStatus = (value: number) => {
        if (value < 25) return { label: "Poor", color: "text-red-500", bg: "bg-red-500", track: "bg-red-500/20" };
        if (value <= 35) return { label: "Moderate", color: "text-orange-500", bg: "bg-orange-500", track: "bg-orange-500/20" };
        if (value <= 50) return { label: "Good", color: "text-green-500", bg: "bg-green-500", track: "bg-green-500/20" };
        return { label: "Excessive", color: "text-red-500", bg: "bg-red-500", track: "bg-red-500/20" };
    };

    const status = getStatus(fiber);

    // Cap progress at 100 for display, assuming 50 is "100%" or max target
    // Let's use 50 as the "full" bar reference for visualization
    const progressPercentage = Math.min((fiber / 50) * 100, 100);

    return (
        <div className={`bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-4 md:p-5 transition-all duration-300 hover:border-white/10 ${status.track} border-opacity-50 group`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 ${status.color} group-hover:scale-110 transition-transform duration-500`}>
                        <Leaf className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                        <span className={`text-3xl md:text-4xl font-black italic ${status.color} tracking-tighter`}>{fiber}</span>
                        <span className="text-xs font-bold text-zinc-500 uppercase ml-1">g</span>
                    </div>
                </div>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Info className="w-4 h-4 text-zinc-500 hover:text-white transition-colors" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-black/90 border-white/10 text-white backdrop-blur-xl">
                            <p className="font-bold">Target: 35-50g per day</p>
                            <p className="text-zinc-400">Current Status: <span className={status.color}>{status.label}</span></p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3">
                <span>Fiber Intake</span>
                <span className={`${status.color}`}>{status.label}</span>
            </div>

            <div className="h-3 w-full rounded-full bg-black/40 border border-white/5 overflow-hidden p-0.5">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.2)] ${status.bg}`}
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>
        </div>
    );
};
