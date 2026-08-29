import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CaloriePlanSelector } from "@nutrition/components/CaloriePlanSelector";
import { MealPlanView } from "@nutrition/components/MealPlanView";
import { useLanguage } from '../../contexts/LanguageContext';
import BottomNav from '../../components/BottomNav';

const Index = () => {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="bg-app min-h-dvh text-txt-hi relative overflow-x-hidden selection:bg-brand-soft">
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-4 md:px-8 md:pt-8 pb-nav-space">
        {!selectedPlan && (
          <button
            onClick={() => navigate("/")}
            className="mb-8 flex items-center gap-2 rounded-full border border-hair bg-surface-2 px-4 py-2 text-txt-mid transition-colors hover:text-txt-hi active:scale-95 rtl:flex-row-reverse w-fit group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 rtl:rotate-180" />
            <span className="font-bold text-xs uppercase tracking-widest">{t('nutrition.backToPortal')}</span>
          </button>
        )}

        {!selectedPlan ? (
          <CaloriePlanSelector onSelectPlan={setSelectedPlan} />
        ) : (
          <MealPlanView
            calorieTarget={selectedPlan}
            onBack={() => setSelectedPlan(null)}
          />
        )}
      </div>

      {/* Persistent Bottom Navigation */}
      <BottomNav activeView="nutrition" />
    </div>
  );
};

export default Index;
