import { Card } from "@nutrition/components/ui/card";
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
    <div className="min-h-screen bg-gradient-hero">
      {/* Background Glow Effect */}
      <div className="fixed inset-0 bg-gradient-glow pointer-events-none" />
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 opacity-0 animate-fade-in-down">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Nutrition Plans</span>
            </div>
            
            <div className="flex items-center justify-center gap-4 mb-4">
              <Dumbbell className="w-10 h-10 md:w-12 md:h-12 text-primary" />
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gradient">
                Hybrid Athlete Blueprint
              </h1>
            </div>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Select your calorie target to unlock your personalized meal plan designed for peak performance
            </p>
          </div>

          {/* Plan Cards Grid */}
          <div className="grid md:grid-cols-2 gap-5 animate-stagger">
            {plans.map((plan) => (
              <Card
                key={plan.calories}
                onClick={() => onSelectPlan(plan.calories)}
                className="relative overflow-hidden bg-card border-border/50 hover:border-primary/50 transition-all duration-500 cursor-pointer group hover-lift opacity-0"
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-primary/5 to-transparent" />
                
                <div className="relative p-6 md:p-8">
                  <div className="flex items-start justify-between mb-6">
                    {/* Icon */}
                    <div className="p-3 rounded-xl bg-secondary/80 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110 group-hover:shadow-glow-sm">
                      {plan.icon}
                    </div>
                    
                    {/* Calories Badge */}
                    <div className="text-right">
                      <div className="text-3xl md:text-4xl font-bold text-primary group-hover:scale-105 transition-transform origin-right">
                        {plan.calories.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">kcal/day</div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <h3 className="text-xl md:text-2xl font-bold group-hover:text-primary transition-colors duration-300">
                      {plan.title}
                    </h3>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </div>

                  {/* Meal Preview Images */}
                  <div className="flex items-center gap-2 mb-6">
                    {plan.images.map((img, idx) => (
                      <div 
                        key={idx}
                        className="relative w-12 h-12 rounded-lg overflow-hidden border-2 border-border/50 group-hover:border-primary/30 transition-all duration-300"
                        style={{ 
                          transform: `translateX(-${idx * 8}px)`,
                          zIndex: plan.images.length - idx 
                        }}
                      >
                        <img 
                          src={img} 
                          alt={`Meal preview ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                      </div>
                    ))}
                    <span className="text-xs text-muted-foreground ml-1 group-hover:text-primary/70 transition-colors">
                      +{plan.images.length} meals
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <span className="text-sm text-muted-foreground">
                      <span className="text-foreground font-medium">{plan.meals}</span> included
                    </span>
                    
                    <div className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      View Plan
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-12 text-center opacity-0 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <p className="text-sm text-muted-foreground">
              All meal plans are designed with optimal macro distribution for hybrid athletes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};