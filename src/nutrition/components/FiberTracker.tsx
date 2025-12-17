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
        <div className={`bg-card border border-border/50 rounded-xl p-4 md:p-5 hover:border-primary/30 transition-colors ${status.track} border-opacity-50`}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Leaf className={`w-5 h-5 ${status.color}`} />
                    <span className={`text-2xl md:text-3xl font-bold ${status.color}`}>{fiber}g</span>
                </div>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Info className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Target: 35-50g per day</p>
                            <p>Current: {status.label}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span>Fiber Intake</span>
                <span className={`font-medium ${status.color}`}>{status.label}</span>
            </div>

            <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                <div
                    className={`h-full transition-all duration-500 ease-out ${status.bg}`}
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>
        </div>
    );
};
