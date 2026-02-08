import { useState } from "react";

import { Button } from "@nutrition/components/ui/button";
import { ChevronDown, ChevronUp, Clock, Flame, RefreshCw, Utensils } from "lucide-react";
import { Meal } from "@nutrition/types/meal";

interface MealCardProps {
  meal: Meal;
  showMacros: boolean;
  index: number;
  onSwapClick: (meal: Meal) => void;
}

export const MealCard = ({ meal, showMacros, index, onSwapClick }: MealCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="overflow-hidden bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-3xl transition-all duration-500 hover:border-red-500/30 group"
    >
      {/* Header with Image */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img
          src={meal.image}
          alt={meal.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Meal Type Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-1.5">
            <Utensils className="w-3 h-3" />
            {meal.type}
          </span>
        </div>

        {/* Swap Button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSwapClick(meal);
            }}
            className="p-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 hover:bg-red-600 hover:border-red-500 hover:text-white text-zinc-300 transition-all duration-300"
            title="Swap this meal"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Meal Name */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl md:text-3xl font-black italic leading-tight text-white mb-1">{meal.name}</h3>
          {meal.prepTime && (
            <div className="flex items-center gap-1.5 text-zinc-300">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs font-bold uppercase tracking-wider">{meal.prepTime}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        {/* Macros Row */}
        {showMacros && (
          <div className="grid grid-cols-5 gap-2 mb-6">
            <div className="text-center p-2 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Flame className="w-3.5 h-3.5 text-red-500 fill-current" />
                <span className="text-lg md:text-xl font-black italic text-white">{meal.calories}</span>
              </div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Kcal</span>
            </div>
            <div className="text-center p-2 rounded-xl bg-white/5 border border-white/5">
              <div className="text-lg md:text-xl font-black italic text-blue-400">{meal.protein}g</div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Pro</span>
            </div>
            <div className="text-center p-2 rounded-xl bg-white/5 border border-white/5">
              <div className="text-lg md:text-xl font-black italic text-emerald-400">{meal.carbs}g</div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Carb</span>
            </div>
            <div className="text-center p-2 rounded-xl bg-white/5 border border-white/5">
              <div className="text-lg md:text-xl font-black italic text-amber-400">{meal.fats}g</div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Fat</span>
            </div>
            <div className="text-center p-2 rounded-xl bg-white/5 border border-white/5">
              <div className="text-lg md:text-xl font-black italic text-zinc-300">{meal.fiber || 0}g</div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Fib</span>
            </div>
          </div>
        )}

        {/* Expand/Collapse Button */}
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 text-zinc-300 h-auto py-3"
        >
          {isExpanded ? (
            <div className="flex items-center gap-2">
              <ChevronUp className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest">Hide Details</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <ChevronDown className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest">View Recipe</span>
            </div>
          )}
        </Button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-6 mt-6 pt-6 border-t border-white/5 animate-slide-down">
            {/* Ingredients */}
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest text-red-500 mb-3 flex items-center gap-2">
                Ingredients
              </h4>
              <div className="grid gap-2">
                {meal.ingredients.map((ingredient, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-black/20 rounded-lg px-4 py-3"
                  >
                    <span className="text-sm font-medium text-zinc-300">{ingredient.name}</span>
                    <span className="text-sm font-bold text-white">{ingredient.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest text-red-500 mb-3 flex items-center gap-2">
                Instructions
              </h4>
              <ol className="space-y-4">
                {meal.instructions.map((instruction, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center text-xs font-bold text-red-500">
                      {i + 1}
                    </span>
                    <span className="text-sm text-zinc-400 leading-relaxed font-medium pt-0.5">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};