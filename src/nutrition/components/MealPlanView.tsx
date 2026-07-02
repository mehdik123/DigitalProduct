import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui";
import { MealCard } from "@nutrition/components/MealCard";
import { MealSwapDialog } from "@nutrition/components/MealSwapDialog";
import { FiberTracker } from "@nutrition/components/FiberTracker";
import { ShoppingList } from "@nutrition/components/ShoppingList";
import { ArrowLeft, Eye, EyeOff, Download, Flame, Zap, ShoppingCart } from "lucide-react";
import { getMealPlan } from "@nutrition/data/mealPlans";
import { exportMealPlanToPDF } from "@nutrition/utils/pdfExport";
import { toast } from "sonner";
import { Meal } from "@nutrition/types/meal";
import { useLanguage } from "../../contexts/LanguageContext";
import { listVariants } from "../../design/motion";

interface MealPlanViewProps {
  calorieTarget: number;
  onBack: () => void;
}

export const MealPlanView = ({ calorieTarget, onBack }: MealPlanViewProps) => {
  const { t } = useLanguage();
  const [showMacros, setShowMacros] = useState(true);
  const [swapDialogOpen, setSwapDialogOpen] = useState(false);
  const [shoppingListOpen, setShoppingListOpen] = useState(false);
  const [selectedMealForSwap, setSelectedMealForSwap] = useState<Meal | null>(null);
  const [selectedMealIndex, setSelectedMealIndex] = useState<number | null>(null);
  const [meals, setMeals] = useState<Meal[]>(() => getMealPlan(calorieTarget).meals);
  const mealPlan = { ...getMealPlan(calorieTarget), meals };
  const planDescription = t(`nutrition.planDesc.${calorieTarget}`);

  const handleExportPDF = async () => {
    try {
      const toastId = toast.loading(t('nutrition.toast.generatingPdf'), {
        description: t('nutrition.toast.generatingPdfDesc'),
      });

      // Allow UI to update before freezing for PDF generation
      await new Promise(resolve => setTimeout(resolve, 100));

      await exportMealPlanToPDF(mealPlan);

      toast.dismiss(toastId);
      toast.success(t('nutrition.toast.pdfSuccess'), {
        description: t('nutrition.toast.pdfSuccessDesc'),
      });
    } catch (error) {
      console.error(error);
      toast.error(t('nutrition.toast.pdfError'), {
        description: t('nutrition.toast.pdfErrorDesc'),
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
      toast.success(t('nutrition.toast.swapSuccess'), {
        description: t('nutrition.toast.swapSuccessDesc', { name: newMeal.name }),
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
    <div className="relative z-10 w-full overflow-x-hidden">
      <div className="container mx-auto px-0 py-4 md:py-8 relative">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <button
              onClick={onBack}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-hair bg-surface-2 px-4 py-2 text-txt-mid transition-colors hover:text-txt-hi active:scale-95 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 rtl:rotate-180" />
              <span className="font-bold text-xs uppercase tracking-widest">{t('nutrition.backToPlans')}</span>
            </button>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-soft border border-brand/20 mb-4">
                  <Zap className="w-3.5 h-3.5 text-brand fill-current" />
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-brand">{t('nutrition.dailyProtocol')}</span>
                </div>
                <h1 className="font-display text-5xl md:text-7xl font-black italic uppercase tracking-tight mb-2 text-txt-hi">
                  <span className="stat not-italic">{calorieTarget.toLocaleString()}</span>
                  <span className="text-txt-lo font-black text-3xl md:text-5xl ml-2">{t('nutrition.kcal')}</span>
                </h1>
                <p className="text-txt-mid text-base md:text-lg font-medium max-w-xl">{planDescription}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowMacros(!showMacros)}
                  icon={showMacros ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                >
                  {showMacros ? t('nutrition.hideMacros') : t('nutrition.showMacros')}
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShoppingListOpen(true)}
                  icon={<ShoppingCart className="w-4 h-4" />}
                >
                  {t('nutrition.shop')}
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleExportPDF}
                  icon={<Download className="w-4 h-4" />}
                >
                  {t('nutrition.pdf')}
                </Button>
              </div>
            </div>
          </div>

          {/* Daily Totals */}
          {showMacros && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
              <div className="bg-surface-2 border border-hair rounded-2xl p-4 text-center hover:border-brand/30 transition-colors group">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Flame className="w-5 h-5 text-brand fill-current group-hover:scale-110 transition-transform" />
                  <span className="stat text-2xl md:text-3xl font-black text-txt-hi">{totalMacros.calories}</span>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-txt-lo">{t('nutrition.totalCalories')}</div>
              </div>
              <div className="bg-surface-2 border border-hair rounded-2xl p-4 text-center hover:border-coral/30 transition-colors">
                <div className="stat text-2xl md:text-3xl font-black text-coral">{totalMacros.protein}g</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-txt-lo">{t('nutrition.protein')}</div>
              </div>
              <div className="bg-surface-2 border border-hair rounded-2xl p-4 text-center hover:border-emerald/30 transition-colors">
                <div className="stat text-2xl md:text-3xl font-black text-emerald">{totalMacros.carbs}g</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-txt-lo">{t('nutrition.carbs')}</div>
              </div>
              <div className="bg-surface-2 border border-hair rounded-2xl p-4 text-center hover:border-hair-strong transition-colors">
                <div className="stat text-2xl md:text-3xl font-black text-txt-hi">{totalMacros.fats}g</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-txt-lo">{t('nutrition.fats')}</div>
              </div>
              {/* Fiber Tracker */}
              <div className="col-span-2 md:col-span-1">
                <FiberTracker fiber={totalMacros.fiber} />
              </div>
            </div>
          )}

          {/* Meals Grid */}
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="show"
            className="space-y-6 md:space-y-8 pb-nav-space"
          >
            {meals.map((meal, index) => (
              <MealCard
                key={index}
                meal={meal}
                showMacros={showMacros}
                index={index}
                onSwapClick={(meal) => handleSwapClick(meal, index)}
              />
            ))}
          </motion.div>

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
