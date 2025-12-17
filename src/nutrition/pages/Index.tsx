import { useState } from "react";
import { CaloriePlanSelector } from "@nutrition/components/CaloriePlanSelector";
import { MealPlanView } from "@nutrition/components/MealPlanView";

const Index = () => {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-hero dark">
      {!selectedPlan ? (
        <CaloriePlanSelector onSelectPlan={setSelectedPlan} />
      ) : (
        <MealPlanView 
          calorieTarget={selectedPlan} 
          onBack={() => setSelectedPlan(null)}
        />
      )}
    </div>
  );
};

export default Index;
