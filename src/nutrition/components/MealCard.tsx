import { useState } from "react";
import { Card } from "@nutrition/components/ui/card";
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
    <Card
      className="overflow-hidden bg-card border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-card opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Header with Image */}
      <div className="relative h-52 md:h-64 overflow-hidden group">
        <img
          src={meal.image}
          alt={meal.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />

        {/* Meal Type Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1.5 bg-card/90 backdrop-blur-sm border border-border/50 rounded-full text-sm font-semibold text-primary flex items-center gap-1.5">
            <Utensils className="w-3.5 h-3.5" />
            {meal.type}
          </span>
        </div>

        {/* Swap Button */}
        <div className="absolute top-4 right-4">
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onSwapClick(meal);
            }}
            className="bg-card/90 backdrop-blur-sm border-border/50 hover:border-primary hover:bg-primary/20 transition-all duration-300"
            title="Swap this meal"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* Meal Name */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl md:text-3xl font-bold leading-tight">{meal.name}</h3>
          {meal.prepTime && (
            <div className="flex items-center gap-1.5 mt-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{meal.prepTime}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 md:p-6">
        {/* Macros Row */}
        {showMacros && (
          <div className="grid grid-cols-5 gap-2 mb-5 p-4 bg-secondary/30 rounded-xl">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <Flame className="w-4 h-4 text-primary" />
                <span className="text-lg md:text-xl font-bold text-primary">{meal.calories}</span>
              </div>
              <span className="text-xs text-muted-foreground">Calories</span>
            </div>
            <div className="text-center">
              <div className="text-lg md:text-xl font-bold macro-protein">{meal.protein}g</div>
              <span className="text-xs text-muted-foreground">Protein</span>
            </div>
            <div className="text-center">
              <div className="text-lg md:text-xl font-bold macro-carbs">{meal.carbs}g</div>
              <span className="text-xs text-muted-foreground">Carbs</span>
            </div>
            <div className="text-center">
              <div className="text-lg md:text-xl font-bold macro-fats">{meal.fats}g</div>
              <span className="text-xs text-muted-foreground">Fats</span>
            </div>
            <div className="text-center">
              <div className="text-lg md:text-xl font-bold text-green-500">{meal.fiber || 0}g</div>
              <span className="text-xs text-muted-foreground">Fiber</span>
            </div>
          </div>
        )}

        {/* Expand/Collapse Button */}
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4 mr-2" />
              Hide Details
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-2" />
              View Ingredients & Instructions
            </>
          )}
        </Button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-6 mt-6 pt-6 border-t border-border/50 animate-fade-in">
            {/* Ingredients */}
            <div>
              <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full" />
                Ingredients
              </h4>
              <div className="grid gap-2">
                {meal.ingredients.map((ingredient, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-secondary/40 hover:bg-secondary/60 rounded-lg px-4 py-2.5 transition-colors duration-200"
                  >
                    <span className="text-foreground">{ingredient.name}</span>
                    <span className="text-sm font-semibold text-primary">{ingredient.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div>
              <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full" />
                Cooking Instructions
              </h4>
              <ol className="space-y-3">
                {meal.instructions.map((instruction, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center text-sm font-bold text-primary">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground flex-1 pt-0.5">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};