import { Info, Leaf } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@nutrition/components/ui/tooltip";
import { useLanguage } from "../../contexts/LanguageContext";

interface FiberTrackerProps {
    fiber: number;
}

export const FiberTracker = ({ fiber }: FiberTrackerProps) => {
    const { t } = useLanguage();

    // Logic: < 25 (Poor), 25-35 (Moderate), 35-50 (Good), > 50 (Too Much)
    const getStatus = (value: number) => {
        if (value < 25) return { labelKey: "nutrition.fiber.poor", color: "text-brand", bg: "bg-brand" };
        if (value <= 35) return { labelKey: "nutrition.fiber.moderate", color: "text-coral", bg: "bg-coral" };
        if (value <= 50) return { labelKey: "nutrition.fiber.good", color: "text-emerald", bg: "bg-emerald" };
        return { labelKey: "nutrition.fiber.excessive", color: "text-brand", bg: "bg-brand" };
    };

    const status = getStatus(fiber);
    const statusLabel = t(status.labelKey);

    // Use 50 as the "full" bar reference for visualization
    const progressPercentage = Math.min((fiber / 50) * 100, 100);

    return (
        <div className="bg-surface-2 border border-hair rounded-2xl p-4 md:p-5 transition-all duration-300 hover:border-hair-strong group">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-surface-3 flex items-center justify-center border border-hair ${status.color} group-hover:scale-110 transition-transform duration-500`}>
                        <Leaf className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                        <span className={`stat text-3xl md:text-4xl font-black ${status.color}`}>{fiber}</span>
                        <span className="text-xs font-bold text-txt-lo uppercase ml-1">g</span>
                    </div>
                </div>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Info className="w-4 h-4 text-txt-lo hover:text-txt-hi transition-colors" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-surface-1 border-hair text-txt-hi backdrop-blur-xl">
                            <p className="font-bold">{t('nutrition.fiberTarget')}</p>
                            <p className="text-txt-mid">{t('nutrition.currentStatus')} <span className={status.color}>{statusLabel}</span></p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-txt-lo mb-3">
                <span>{t('nutrition.fiberIntake')}</span>
                <span className={`${status.color}`}>{statusLabel}</span>
            </div>

            <div className="h-3 w-full rounded-full bg-surface-1 border border-hair overflow-hidden p-0.5">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${status.bg}`}
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>
        </div>
    );
};
