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
    <div className="min-h-screen bg-black dark p-4 md:p-8 pb-32">
      <div className="max-w-7xl mx-auto">
        {!selectedPlan && (
          <button
            onClick={() => navigate("/")}
            className="mb-8 flex items-center gap-2 text-neutral-500 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>{t('nutrition.backToPortal') || 'Back to Portal'}</span>
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
