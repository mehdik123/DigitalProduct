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
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden selection:bg-emerald-500/30">

      {/* Ambient Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-8 pb-40">
        {!selectedPlan && (
          <button
            onClick={() => navigate("/")}
            className="mb-8 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group px-4 py-2 rounded-full hover:bg-white/5 w-fit"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-xs uppercase tracking-widest">{t('nutrition.backToPortal') || 'Back to Portal'}</span>
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
