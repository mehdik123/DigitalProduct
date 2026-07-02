import { motion } from "framer-motion";
import { Flame, TrendingDown, Minus, TrendingUp, Dumbbell, Zap, ChevronRight } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { listVariants, itemVariants, tap } from "../../design/motion";

// Import meal images
import breakfastPancakes from "@nutrition/assets/breakfast-pancakes.jpg";
import lunchChicken from "@nutrition/assets/lunch-chicken-rice.jpg";
import dinnerSteak from "@nutrition/assets/dinner-steak-rice.jpg";
import snackShake from "@nutrition/assets/snack-shake.jpg";

interface CaloriePlan {
  calories: number;
  titleKey: string;
  descKey: string;
  icon: React.ReactNode;
  mealsKey: string;
  images: string[];
}

const plans: CaloriePlan[] = [
  {
    calories: 2000,
    titleKey: "nutrition.plan.2000.title",
    descKey: "nutrition.plan.2000.desc",
    icon: <TrendingDown className="w-6 h-6" />,
    mealsKey: "nutrition.meals3",
    images: [breakfastPancakes, lunchChicken, dinnerSteak],
  },
  {
    calories: 2500,
    titleKey: "nutrition.plan.2500.title",
    descKey: "nutrition.plan.2500.desc",
    icon: <Minus className="w-6 h-6" />,
    mealsKey: "nutrition.meals3snack1",
    images: [breakfastPancakes, lunchChicken, dinnerSteak, snackShake],
  },
  {
    calories: 3000,
    titleKey: "nutrition.plan.3000.title",
    descKey: "nutrition.plan.3000.desc",
    icon: <Flame className="w-6 h-6" />,
    mealsKey: "nutrition.meals3snack1",
    images: [breakfastPancakes, lunchChicken, dinnerSteak, snackShake],
  },
  {
    calories: 3500,
    titleKey: "nutrition.plan.3500.title",
    descKey: "nutrition.plan.3500.desc",
    icon: <TrendingUp className="w-6 h-6" />,
    mealsKey: "nutrition.meals4snack1",
    images: [breakfastPancakes, lunchChicken, dinnerSteak, snackShake],
  },
];

interface CaloriePlanSelectorProps {
  onSelectPlan: (calories: number) => void;
}

export const CaloriePlanSelector = ({ onSelectPlan }: CaloriePlanSelectorProps) => {
  const { t } = useLanguage();

  return (
    <div className="relative z-10">
      <div className="container mx-auto px-0 py-4 md:py-10 relative">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
            className="text-center mb-10 md:mb-16 space-y-4 md:space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-glass border border-hair backdrop-blur-md">
              <Zap className="w-3 md:w-4 h-3 md:h-4 text-brand fill-current" />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.14em] text-txt-mid">
                {t('nutrition.badgePlans')}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-grad-red rounded-3xl flex items-center justify-center shadow-red rotate-6 mb-2">
                <Dumbbell className="w-8 h-8 md:w-10 md:h-10 text-white fill-current" />
              </div>
              <h1 className="font-display text-4xl md:text-7xl font-black italic uppercase tracking-tight text-txt-hi">
                Hybrid <span className="text-transparent bg-clip-text bg-grad-red">Fuel</span>
              </h1>
            </div>

            <p className="text-sm md:text-lg text-txt-mid max-w-2xl mx-auto font-medium px-4">
              {t('nutrition.selectTarget')}
            </p>
          </motion.div>

          {/* Plan Cards Grid */}
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="show"
            className="grid md:grid-cols-2 gap-4 md:gap-6 pb-10"
          >
            {plans.map((plan) => (
              <motion.div
                key={plan.calories}
                variants={itemVariants}
                whileTap={tap}
                onClick={() => onSelectPlan(plan.calories)}
                className="group relative rounded-3xl overflow-hidden cursor-pointer border border-hair bg-surface-2 shadow-soft transition-all duration-500 hover:border-brand/40"
              >
                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="relative z-10 p-6 md:p-8">
                  <div className="flex items-start justify-between mb-6 md:mb-8">
                    {/* Icon */}
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-surface-3 border border-hair flex items-center justify-center text-txt-mid group-hover:text-brand group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      {plan.icon}
                    </div>

                    {/* Calories Badge */}
                    <div className="text-right rtl:text-left">
                      <div className="stat text-3xl md:text-5xl font-black text-txt-hi group-hover:text-brand transition-colors duration-300">
                        {plan.calories.toLocaleString()}
                      </div>
                      <div className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-txt-lo group-hover:text-txt-mid">
                        {t('nutrition.kcalPerDay')}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                    <h3 className="font-display text-xl md:text-3xl font-black italic uppercase tracking-tight text-txt-hi transition-colors duration-300">
                      {t(plan.titleKey)}
                    </h3>
                    <p className="text-txt-mid font-medium leading-relaxed text-sm md:text-base">{t(plan.descKey)}</p>
                  </div>

                  {/* Meal Preview Images */}
                  <div className="flex items-center gap-3 mb-6 md:mb-8 pl-2">
                    {plan.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl overflow-hidden border-2 border-surface-1 bg-surface-3 shadow-soft group-hover:scale-110 transition-transform duration-500"
                        style={{
                          marginLeft: idx === 0 ? 0 : '-12px',
                          zIndex: plan.images.length - idx
                        }}
                      >
                        <img
                          src={img}
                          alt={`${t(plan.titleKey)} ${idx + 1}`}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                    ))}
                    <div className="ml-2 px-2 py-1 md:px-3 md:py-1 rounded-full bg-glass border border-hair text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-txt-lo group-hover:text-txt-hi transition-colors">
                      {t(plan.mealsKey)}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 md:pt-6 border-t border-hair">
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-txt-lo group-hover:text-txt-mid transition-colors">
                      {t('nutrition.viewBlueprint')}
                    </span>

                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-surface-3 border border-hair flex items-center justify-center text-txt-mid group-hover:bg-brand group-hover:border-brand group-hover:text-white transition-all duration-500 rtl:rotate-180">
                      <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Footer Note */}
          <div className="mt-10 text-center opacity-70">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-txt-lo">
              {t('nutrition.designedFor')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
