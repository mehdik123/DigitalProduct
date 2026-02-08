
import { Flame, TrendingDown, Minus, TrendingUp, Dumbbell, Zap, ChevronRight } from "lucide-react";

// Import meal images
import breakfastPancakes from "@nutrition/assets/breakfast-pancakes.jpg";
import lunchChicken from "@nutrition/assets/lunch-chicken-rice.jpg";
import dinnerSteak from "@nutrition/assets/dinner-steak-rice.jpg";
import snackShake from "@nutrition/assets/snack-shake.jpg";

interface CaloriePlan {
  calories: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  meals: string;
  gradient: string;
  images: string[];
}

const plans: CaloriePlan[] = [
  {
    calories: 2000,
    title: "Aggressive Fat Loss",
    description: "Maximum deficit for rapid results",
    icon: <TrendingDown className="w-6 h-6" />,
    meals: "3 meals",
    gradient: "from-red-500/20 via-orange-500/10 to-transparent",
    images: [breakfastPancakes, lunchChicken, dinnerSteak],
  },
  {
    calories: 2500,
    title: "Moderate Deficit",
    description: "Sustainable fat loss / maintenance",
    icon: <Minus className="w-6 h-6" />,
    meals: "3 meals + 1 snack",
    gradient: "from-orange-500/20 via-yellow-500/10 to-transparent",
    images: [breakfastPancakes, lunchChicken, dinnerSteak, snackShake],
  },
  {
    calories: 3000,
    title: "Maintenance / Lean Bulk",
    description: "Maintain or grow lean muscle",
    icon: <Flame className="w-6 h-6" />,
    meals: "3 meals + 1 snack",
    gradient: "from-blue-500/20 via-cyan-500/10 to-transparent",
    images: [breakfastPancakes, lunchChicken, dinnerSteak, snackShake],
  },
  {
    calories: 3500,
    title: "Lean Bulk",
    description: "Optimal muscle growth for larger athletes",
    icon: <TrendingUp className="w-6 h-6" />,
    meals: "4 meals + 1 snack",
    gradient: "from-green-500/20 via-emerald-500/10 to-transparent",
    images: [breakfastPancakes, lunchChicken, dinnerSteak, snackShake],
  },
];

interface CaloriePlanSelectorProps {
  onSelectPlan: (calories: number) => void;
}

export const CaloriePlanSelector = ({ onSelectPlan }: CaloriePlanSelectorProps) => {
  return (
    <div className="min-h-screen relative z-10">

      <div className="container mx-auto px-4 py-8 md:py-16 relative">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 md:mb-16 space-y-4 md:space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/60 border border-white/10 backdrop-blur-md mb-2">
              <Zap className="w-3 md:w-4 h-3 md:h-4 text-red-500 fill-current" />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-zinc-300">Nutrition Plans</span>
            </div>

            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-red-600 to-red-900 rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(220,38,38,0.4)] rotate-6 mb-4">
                <Dumbbell className="w-8 h-8 md:w-10 md:h-10 text-white fill-current" />
              </div>
              <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter text-white drop-shadow-2xl">
                Hybrid <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Fuel</span>
              </h1>
            </div>

            <p className="text-sm md:text-lg text-zinc-400 max-w-2xl mx-auto font-medium px-4">
              Select your calorie target to unlock your personalized meal plan.
            </p>
          </div>

          {/* Plan Cards Grid */}
          <div className="grid md:grid-cols-2 gap-4 md:gap-8 pb-20">
            {plans.map((plan) => (
              <div
                key={plan.calories}
                onClick={() => onSelectPlan(plan.calories)}
                className="group relative rounded-[2rem] overflow-hidden cursor-pointer active:scale-[0.98] transition-all duration-500"
              >
                {/* Glass Background */}
                <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-md border border-white/5 group-hover:bg-zinc-900/60 group-hover:border-red-500/30 transition-all duration-500" />

                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="relative z-10 p-6 md:p-10">
                  <div className="flex items-start justify-between mb-6 md:mb-8">
                    {/* Icon */}
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-red-500 group-hover:bg-white/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      {plan.icon}
                    </div>

                    {/* Calories Badge */}
                    <div className="text-right">
                      <div className="text-3xl md:text-5xl font-black italic text-white group-hover:text-red-500 transition-colors duration-300 tracking-tighter">
                        {plan.calories.toLocaleString()}
                      </div>
                      <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-zinc-400">kcal/day</div>
                    </div>
                  </div>

                  <div className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                    <h3 className="text-xl md:text-3xl font-black italic uppercase tracking-tighter text-white group-hover:text-red-100 transition-colors duration-300">
                      {plan.title}
                    </h3>
                    <p className="text-zinc-400 font-medium leading-relaxed text-sm md:text-base">{plan.description}</p>
                  </div>

                  {/* Meal Preview Images */}
                  <div className="flex items-center gap-3 mb-6 md:mb-8 pl-2">
                    {plan.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl overflow-hidden border-2 border-zinc-900 bg-zinc-800 shadow-xl group-hover:scale-110 transition-transform duration-500"
                        style={{
                          marginLeft: idx === 0 ? 0 : '-12px',
                          zIndex: plan.images.length - idx
                        }}
                      >
                        <img
                          src={img}
                          alt={`Meal preview ${idx + 1}`}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                    ))}
                    <div className="ml-2 px-2 py-1 md:px-3 md:py-1 rounded-full bg-white/5 border border-white/10 text-[9px] md:text-[10px] font-black uppercase tracking-wider text-zinc-500 group-hover:text-white transition-colors">
                      {plan.meals}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 md:pt-6 border-t border-white/5">
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-zinc-600 group-hover:text-zinc-400 transition-colors">
                      View Blueprint
                    </span>

                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 group-hover:bg-red-600 group-hover:text-white transition-all duration-500">
                      <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-16 text-center opacity-70">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
              Designed for Hybrid Athlete Performance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};