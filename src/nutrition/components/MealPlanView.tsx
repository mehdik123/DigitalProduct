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
    <div className="min-h-screen relative z-10 w-full overflow-x-hidden">

      <div className="container mx-auto px-4 py-8 md:py-12 relative">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <Button
              variant="ghost"
              onClick={onBack}
              className="mb-6 hover:bg-white/5 text-zinc-400 hover:text-white transition-colors pl-0 hover:pl-2 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Plans
            </Button>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
                  <Zap className="w-3.5 h-3.5 text-red-500 fill-current" />
                  <span className="text-xs font-black uppercase tracking-widest text-red-400">Daily Protocol</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-2 text-white">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">{calorieTarget.toLocaleString()}</span>
                  <span className="text-zinc-600 font-black text-3xl md:text-5xl ml-2">kcal</span>
                </h1>
                <p className="text-zinc-400 text-base md:text-lg font-medium max-w-xl">{mealPlan.description}</p>
              </div>

              <div className="flex gap-2flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowMacros(!showMacros)}
                  className="border-white/5 bg-zinc-900/40 backdrop-blur-sm hover:bg-white/5 hover:border-white/10 text-zinc-300"
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
                  className="border-white/5 bg-zinc-900/40 backdrop-blur-sm hover:bg-white/5 hover:border-white/10 text-zinc-300"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Shop
                </Button>

                <Button
                  onClick={handleExportPDF}
                  className="bg-red-600 hover:bg-red-700 text-white border-0 shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] transition-all"
                >
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>
          </div>

          {/* Daily Totals */}
          {showMacros && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
              <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-4 text-center hover:border-red-500/30 transition-colors group">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Flame className="w-5 h-5 text-red-500 fill-current group-hover:scale-110 transition-transform" />
                  <span className="text-2xl md:text-3xl font-black italic text-white">{totalMacros.calories}</span>
                </div>
                <div className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Total Calories</div>
              </div>
              <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-4 text-center hover:border-blue-500/30 transition-colors">
                <div className="text-2xl md:text-3xl font-black italic text-blue-400">{totalMacros.protein}g</div>
                <div className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Protein</div>
              </div>
              <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-4 text-center hover:border-emerald-500/30 transition-colors">
                <div className="text-2xl md:text-3xl font-black italic text-emerald-400">{totalMacros.carbs}g</div>
                <div className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Carbs</div>
              </div>
              <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-4 text-center hover:border-amber-500/30 transition-colors">
                <div className="text-2xl md:text-3xl font-black italic text-amber-400">{totalMacros.fats}g</div>
                <div className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Fats</div>
              </div>
              {/* Fiber Tracker */}
              <div className="col-span-2 md:col-span-1">
                <FiberTracker fiber={totalMacros.fiber} />
              </div>
            </div>
          )}

          {/* Meals Grid */}
          <div className="space-y-6 md:space-y-8 pb-24">
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