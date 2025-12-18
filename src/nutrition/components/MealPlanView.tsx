import { useState } from "react";
import { Button } from "@nutrition/components/ui/button";
import { MealCard } from "@nutrition/components/MealCard";
import { MealSwapDialog } from "@nutrition/components/MealSwapDialog";
import { FiberTracker } from "@nutrition/components/FiberTracker";
import { ShoppingList } from "@nutrition/components/ShoppingList";
import { ArrowLeft, Eye, EyeOff, Download, Flame, Zap, ShoppingCart } from "lucide-react";
import { getMealPlan } from "@nutrition/data/mealPlans";
import { exportMealPlanToPDF } from "@nutrition/utils/pdfExport";
import { toast } from "sonner";
import { Meal } from "@nutrition/types/meal";

interface MealPlanViewProps {
  calorieTarget: number;
  onBack: () => void;
}

export const MealPlanView = ({ calorieTarget, onBack }: MealPlanViewProps) => {
  const [showMacros, setShowMacros] = useState(true);
  const [swapDialogOpen, setSwapDialogOpen] = useState(false);
  const [shoppingListOpen, setShoppingListOpen] = useState(false);
  const [selectedMealForSwap, setSelectedMealForSwap] = useState<Meal | null>(null);
  const [selectedMealIndex, setSelectedMealIndex] = useState<number | null>(null);
  const [meals, setMeals] = useState<Meal[]>(() => getMealPlan(calorieTarget).meals);
  const mealPlan = { ...getMealPlan(calorieTarget), meals };

  const handleExportPDF = async () => {
    try {
      const toastId = toast.loading("Generating PDF...", {
        description: "Preparing high-quality layout with images...",
      });

      // Allow UI to update before freezing for PDF generation
      await new Promise(resolve => setTimeout(resolve, 100));

      await exportMealPlanToPDF(mealPlan);

      toast.dismiss(toastId);
      toast.success("PDF downloaded successfully!", {
        description: "Your meal plan has been saved to your downloads folder.",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to export PDF", {
        description: "Please try again or contact support if the issue persists.",
      });
    }
  };

  const handleSwapClick = (meal: Meal, index: number) => {
    setSelectedMealForSwap(meal);
    setSelectedMealIndex(index);
    setSwapDialogOpen(true);
  };

  const handleSwapMeal = (newMeal: Meal) => {
    if (selectedMealIndex !== null) {
      const updatedMeals = [...meals];
      updatedMeals[selectedMealIndex] = newMeal;
      setMeals(updatedMeals);
      toast.success("Meal swapped successfully!", {
        description: `Replaced with ${newMeal.name}`,
      });
    }
  };

  const totalMacros = mealPlan.meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fats: acc.fats + meal.fats,
      fiber: acc.fiber + (meal.fiber || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 }
  );

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Background Glow */}
      <div className="fixed inset-0 bg-gradient-glow pointer-events-none" />

      <div className="container mx-auto px-4 py-8 relative">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={onBack}
              className="mb-6 hover:bg-secondary/50 opacity-0 animate-fade-in"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Plans
            </Button>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
                  <Zap className="w-3.5 h-3.5 text-primary" />
                  <span className="text-sm font-medium text-primary">Daily Meal Plan</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
                  <span className="text-gradient">{calorieTarget.toLocaleString()}</span>
                  <span className="text-muted-foreground font-normal text-3xl md:text-4xl lg:text-5xl ml-2">kcal</span>
                </h1>
                <p className="text-muted-foreground text-lg">{mealPlan.description}</p>
              </div>

              <div className="flex gap-3 flex-wrap">
                <Button
                  variant="outline"
                  onClick={() => setShowMacros(!showMacros)}
                  className="border-border/50 hover:border-primary/50 hover:bg-primary/5"
                >
                  {showMacros ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      Hide Macros
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Show Macros
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setShoppingListOpen(true)}
                  className="border-border/50 hover:border-primary/50 hover:bg-primary/5"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Shopping List
                </Button>

                <Button
                  onClick={handleExportPDF}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow-sm hover:shadow-glow transition-shadow"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>
          </div>

          {/* Daily Totals */}
          {showMacros && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-10 opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="bg-card border border-border/50 rounded-xl p-4 md:p-5 text-center hover:border-primary/30 transition-colors group">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Flame className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-2xl md:text-3xl font-bold text-primary">{totalMacros.calories}</span>
                </div>
                <div className="text-sm text-muted-foreground">Total Calories</div>
              </div>
              <div className="bg-card border border-border/50 rounded-xl p-4 md:p-5 text-center hover:border-macro-protein/30 transition-colors">
                <div className="text-2xl md:text-3xl font-bold macro-protein">{totalMacros.protein}g</div>
                <div className="text-sm text-muted-foreground">Protein</div>
              </div>
              <div className="bg-card border border-border/50 rounded-xl p-4 md:p-5 text-center hover:border-macro-carbs/30 transition-colors">
                <div className="text-2xl md:text-3xl font-bold macro-carbs">{totalMacros.carbs}g</div>
                <div className="text-sm text-muted-foreground">Carbs</div>
              </div>
              <div className="bg-card border border-border/50 rounded-xl p-4 md:p-5 text-center hover:border-macro-fats/30 transition-colors">
                <div className="text-2xl md:text-3xl font-bold macro-fats">{totalMacros.fats}g</div>
                <div className="text-sm text-muted-foreground">Fats</div>
              </div>
              {/* Fiber Tracker */}
              <div className="col-span-2 md:col-span-1">
                <FiberTracker fiber={totalMacros.fiber} />
              </div>
            </div>
          )}

          {/* Meals Grid */}
          <div className="space-y-6">
            {meals.map((meal, index) => (
              <MealCard
                key={index}
                meal={meal}
                showMacros={showMacros}
                index={index}
                onSwapClick={(meal) => handleSwapClick(meal, index)}
              />
            ))}
          </div>

          {/* Swap Dialog */}
          <MealSwapDialog
            meal={selectedMealForSwap}
            open={swapDialogOpen}
            onClose={() => setSwapDialogOpen(false)}
            onSwap={handleSwapMeal}
          />

          {/* Shopping List Dialog */}
          <ShoppingList
            mealPlan={mealPlan}
            isOpen={shoppingListOpen}
            onClose={() => setShoppingListOpen(false)}
          />
        </div>
      </div>
    </div>
  );
};