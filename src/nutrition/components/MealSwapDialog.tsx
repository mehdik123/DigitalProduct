import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@nutrition/components/ui/dialog";
import { Button } from "@nutrition/components/ui/button";
import { Meal } from "@nutrition/types/meal";
import { getAlternativesForMeal } from "@nutrition/data/mealAlternatives";
import { Flame, RefreshCw, Check, Clock, ChefHat } from "lucide-react";

interface MealSwapDialogProps {
  meal: Meal | null;
  open: boolean;
  onClose: () => void;
  onSwap: (newMeal: Meal) => void;
}

export const MealSwapDialog = ({ meal, open, onClose, onSwap }: MealSwapDialogProps) => {
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
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden bg-card border-border/50 p-0">
        <DialogHeader className="p-6 pb-4 border-b border-border/50">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/15">
              <RefreshCw className="w-5 h-5 text-primary" />
            </div>
            Swap Meal
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Replace <span className="text-foreground font-medium">{meal.name}</span> with a similar alternative
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(85vh-200px)] p-6 pt-4 scrollbar-thin">
          {alternatives.length === 0 ? (
            <div className="text-center py-16">
              <ChefHat className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">
                No alternative meals available for this meal type yet.
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
                    className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? "ring-2 ring-primary shadow-glow-sm"
                        : "ring-1 ring-border/50 hover:ring-primary/50"
                    }`}
                  >
                    {/* Selected Indicator */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-primary text-primary-foreground">
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
                            <h3 className="text-lg font-bold leading-tight">{altMeal.name}</h3>
                            {altMeal.prepTime && (
                              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                <Clock className="w-3 h-3" />
                                {altMeal.prepTime}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Macros */}
                        <div className="grid grid-cols-4 gap-3 p-3 bg-secondary/40 rounded-lg mb-3">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Flame className="w-3 h-3 text-primary" />
                              <span className="text-sm font-bold text-primary">
                                {altMeal.calories}
                              </span>
                            </div>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">cal</span>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-bold macro-protein">
                              {altMeal.protein}g
                            </div>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">protein</span>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-bold macro-carbs">
                              {altMeal.carbs}g
                            </div>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">carbs</span>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-bold macro-fats">
                              {altMeal.fats}g
                            </div>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">fats</span>
                          </div>
                        </div>

                        {/* Ingredients preview */}
                        <p className="text-sm text-muted-foreground line-clamp-2">
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
        <div className="flex justify-end gap-3 p-6 pt-4 border-t border-border/50 bg-secondary/30">
          <Button variant="outline" onClick={handleClose} className="border-border/50">
            Cancel
          </Button>
          <Button
            onClick={handleSwap}
            disabled={!selectedMeal}
            className="bg-primary hover:bg-primary/90 shadow-glow-sm disabled:shadow-none"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Swap Meal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};