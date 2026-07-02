import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Clock, Flame, RefreshCw, Utensils } from "lucide-react";
import { Meal } from "@nutrition/types/meal";
import { useLanguage } from "../../contexts/LanguageContext";
import { itemVariants, tapSubtle } from "../../design/motion";

interface MealCardProps {
  meal: Meal;
  showMacros: boolean;
  index: number;
  onSwapClick: (meal: Meal) => void;
}

const mealTypeKey = (type: string): string => {
  const key = type.trim().toLowerCase();
  const map: Record<string, string> = {
    breakfast: "nutrition.mealType.breakfast",
    lunch: "nutrition.mealType.lunch",
    dinner: "nutrition.mealType.dinner",
    snack: "nutrition.mealType.snack",
  };
  return map[key] || "";
};

export const MealCard = ({ meal, showMacros, onSwapClick }: MealCardProps) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const typeKey = mealTypeKey(meal.type);
  const typeLabel = typeKey ? t(typeKey) : meal.type;

  return (
    <motion.div
      variants={itemVariants}
      className="overflow-hidden bg-surface-2 border border-hair rounded-3xl shadow-soft transition-all duration-500 hover:border-brand/30 group"
    >
      {/* Header with Image */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img
          src={meal.image}
          alt={meal.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />

        {/* Meal Type Badge */}
        <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4">
          <span className="px-3 py-1 bg-bg/60 backdrop-blur-xl border border-hair rounded-full text-[10px] font-bold uppercase tracking-widest text-txt-hi flex items-center gap-1.5">
            <Utensils className="w-3 h-3" />
            {typeLabel}
          </span>
        </div>

        {/* Swap Button */}
        <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSwapClick(meal);
            }}
            className="p-2 rounded-full bg-bg/60 backdrop-blur-xl border border-hair text-txt-mid hover:bg-brand hover:border-brand hover:text-white active:scale-95 transition-all duration-300"
            title={t('nutrition.swapMeal')}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Meal Name */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="font-display text-2xl md:text-3xl font-black italic uppercase leading-tight text-txt-hi mb-1">{meal.name}</h3>
          {meal.prepTime && (
            <div className="flex items-center gap-1.5 text-txt-mid">
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
            <div className="text-center p-2 rounded-xl bg-surface-3 border border-hair">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Flame className="w-3.5 h-3.5 text-brand fill-current" />
                <span className="stat text-lg md:text-xl font-black text-txt-hi">{meal.calories}</span>
              </div>
              <span className="text-[10px] font-bold text-txt-lo uppercase tracking-wider">{t('nutrition.kcalShort')}</span>
            </div>
            <div className="text-center p-2 rounded-xl bg-surface-3 border border-hair">
              <div className="stat text-lg md:text-xl font-black text-coral">{meal.protein}g</div>
              <span className="text-[10px] font-bold text-txt-lo uppercase tracking-wider">{t('nutrition.proShort')}</span>
            </div>
            <div className="text-center p-2 rounded-xl bg-surface-3 border border-hair">
              <div className="stat text-lg md:text-xl font-black text-emerald">{meal.carbs}g</div>
              <span className="text-[10px] font-bold text-txt-lo uppercase tracking-wider">{t('nutrition.carbShort')}</span>
            </div>
            <div className="text-center p-2 rounded-xl bg-surface-3 border border-hair">
              <div className="stat text-lg md:text-xl font-black text-txt-hi">{meal.fats}g</div>
              <span className="text-[10px] font-bold text-txt-lo uppercase tracking-wider">{t('nutrition.fatShort')}</span>
            </div>
            <div className="text-center p-2 rounded-xl bg-surface-3 border border-hair">
              <div className="stat text-lg md:text-xl font-black text-txt-mid">{meal.fiber || 0}g</div>
              <span className="text-[10px] font-bold text-txt-lo uppercase tracking-wider">{t('nutrition.fibShort')}</span>
            </div>
          </div>
        )}

        {/* Expand/Collapse Button */}
        <motion.button
          whileTap={tapSubtle}
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-surface-3 border border-hair text-txt-mid hover:text-txt-hi hover:border-hair-strong py-3 transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">{t('nutrition.hideDetails')}</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">{t('nutrition.viewRecipe')}</span>
            </>
          )}
        </motion.button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-6 mt-6 pt-6 border-t border-hair animate-fade-in">
            {/* Ingredients */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-brand mb-3 flex items-center gap-2">
                {t('nutrition.ingredients')}
              </h4>
              <div className="grid gap-2">
                {meal.ingredients.map((ingredient, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-surface-1 border border-hair rounded-lg px-4 py-3"
                  >
                    <span className="text-sm font-medium text-txt-mid">{ingredient.name}</span>
                    <span className="stat text-sm font-bold text-txt-hi">{ingredient.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-brand mb-3 flex items-center gap-2">
                {t('nutrition.instructions')}
              </h4>
              <ol className="space-y-4">
                {meal.instructions.map((instruction, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="stat flex-shrink-0 w-6 h-6 rounded-full bg-brand-soft border border-brand/30 flex items-center justify-center text-xs font-bold text-brand">
                      {i + 1}
                    </span>
                    <span className="text-sm text-txt-mid leading-relaxed font-medium pt-0.5">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
