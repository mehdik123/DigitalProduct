import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@nutrition/components/ui/dialog";
import { Button } from "../../components/ui";
import { Meal } from "@nutrition/types/meal";
import { getAlternativesForMeal } from "@nutrition/data/mealAlternatives";
import { Flame, RefreshCw, Check, Clock, ChefHat } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

interface MealSwapDialogProps {
  meal: Meal | null;
  open: boolean;
  onClose: () => void;
  onSwap: (newMeal: Meal) => void;
}

export const MealSwapDialog = ({ meal, open, onClose, onSwap }: MealSwapDialogProps) => {
  const { t } = useLanguage();
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  if (!meal) return null;

  const alternatives = getAlternativesForMeal(meal);

  const handleSwap = () => {
    if (selectedMeal) {
      onSwap(selectedMeal);
      setSelectedMeal(null);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedMeal(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden bg-surface-1 border-hair text-txt-hi p-0">
        <DialogHeader className="p-6 pb-4 border-b border-hair">
          <DialogTitle className="font-display text-2xl font-black italic uppercase tracking-tight flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand-soft">
              <RefreshCw className="w-5 h-5 text-brand" />
            </div>
            {t('nutrition.swapMeal')}
          </DialogTitle>
          <DialogDescription className="text-txt-mid">
            {t('nutrition.swapReplace')} <span className="text-txt-hi font-medium">{meal.name}</span> {t('nutrition.swapWithAlt')}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(85vh-200px)] p-6 pt-4 scrollbar-hide">
          {alternatives.length === 0 ? (
            <div className="text-center py-16">
              <ChefHat className="w-12 h-12 text-txt-lo mx-auto mb-4" />
              <p className="text-txt-mid">
                {t('nutrition.noAlternatives')}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {alternatives.map((altMeal, index) => {
                const isSelected = selectedMeal?.name === altMeal.name;

                return (
                  <div
                    key={index}
                    onClick={() => setSelectedMeal(altMeal)}
                    className={`relative rounded-2xl overflow-hidden cursor-pointer border transition-all duration-300 active:scale-[0.99] ${
                      isSelected
                        ? "border-brand shadow-red bg-surface-2"
                        : "border-hair bg-surface-2 hover:border-brand/50"
                    }`}
                  >
                    {/* Selected Indicator */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-brand text-white">
                        <Check className="w-4 h-4" />
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row">
                      {/* Image */}
                      <div className="sm:w-40 h-40 sm:h-auto overflow-hidden flex-shrink-0">
                        <img
                          src={altMeal.image}
                          alt={altMeal.name}
                          className={`w-full h-full object-cover transition-transform duration-500 ${
                            isSelected ? "scale-105" : "hover:scale-105"
                          }`}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div>
                            <h3 className="text-lg font-black italic uppercase leading-tight text-txt-hi">{altMeal.name}</h3>
                            {altMeal.prepTime && (
                              <span className="inline-flex items-center gap-1 text-xs text-txt-lo mt-1">
                                <Clock className="w-3 h-3" />
                                {altMeal.prepTime}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Macros */}
                        <div className="grid grid-cols-4 gap-3 p-3 bg-surface-1 border border-hair rounded-xl mb-3">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Flame className="w-3 h-3 text-brand" />
                              <span className="stat text-sm font-bold text-brand">
                                {altMeal.calories}
                              </span>
                            </div>
                            <span className="text-[10px] text-txt-lo uppercase tracking-wide">{t('nutrition.cal')}</span>
                          </div>
                          <div className="text-center">
                            <div className="stat text-sm font-bold text-coral">
                              {altMeal.protein}g
                            </div>
                            <span className="text-[10px] text-txt-lo uppercase tracking-wide">{t('nutrition.proteinLower')}</span>
                          </div>
                          <div className="text-center">
                            <div className="stat text-sm font-bold text-emerald">
                              {altMeal.carbs}g
                            </div>
                            <span className="text-[10px] text-txt-lo uppercase tracking-wide">{t('nutrition.carbsLower')}</span>
                          </div>
                          <div className="text-center">
                            <div className="stat text-sm font-bold text-txt-hi">
                              {altMeal.fats}g
                            </div>
                            <span className="text-[10px] text-txt-lo uppercase tracking-wide">{t('nutrition.fatsLower')}</span>
                          </div>
                        </div>

                        {/* Ingredients preview */}
                        <p className="text-sm text-txt-mid line-clamp-2">
                          {altMeal.ingredients.map((ing) => ing.name).join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 p-6 pt-4 border-t border-hair bg-surface-2">
          <Button variant="secondary" size="sm" onClick={handleClose}>
            {t('nutrition.cancel')}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSwap}
            disabled={!selectedMeal}
            icon={<RefreshCw className="w-4 h-4" />}
          >
            {t('nutrition.swapMeal')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
