import { useState, useMemo } from "react";
import { Button } from "../../components/ui";
import { Check, ShoppingCart } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@nutrition/components/ui/dialog";
import { ScrollArea } from "@nutrition/components/ui/scroll-area";
import { MealPlan } from "@nutrition/types/meal";
import { toast } from "sonner";
import { useLanguage } from "../../contexts/LanguageContext";

interface ShoppingListProps {
    mealPlan: MealPlan;
    isOpen: boolean;
    onClose: () => void;
}

interface IngredientItem {
    name: string;
    amount: string;
    category: string;
}

/**
 * Adds up the amounts of an ingredient that appears in several meals.
 *
 * Amounts are free text ("250g", "200ml", "1 large"), so quantities are summed
 * only when every entry shares the same unit. Mixed units are listed side by
 * side rather than silently dropped.
 */
function combineAmounts(amounts: string[]): string {
    if (amounts.length === 1) return amounts[0];

    const parsed = amounts.map((amount) => {
        const match = amount.trim().match(/^([\d.]+)\s*(.*)$/);
        return match ? { value: Number(match[1]), unit: match[2].trim() } : null;
    });

    if (parsed.every((p) => p !== null)) {
        const units = new Set(parsed.map((p) => p!.unit.toLowerCase()));
        if (units.size === 1) {
            const total = parsed.reduce((sum, p) => sum + p!.value, 0);
            const unit = parsed[0]!.unit;
            const rounded = Math.round(total * 100) / 100;
            return unit ? `${rounded}${/^[a-z]/i.test(unit) ? '' : ' '}${unit}` : String(rounded);
        }
    }

    return amounts.join(' + ');
}

const CATEGORY_KEYS: Record<string, string> = {
    "Produce": "nutrition.cat.produce",
    "Meat & Dairy": "nutrition.cat.meatDairy",
    "Pantry": "nutrition.cat.pantry",
    "Other": "nutrition.cat.other",
};

export const ShoppingList = ({ mealPlan, isOpen, onClose }: ShoppingListProps) => {
    const { t } = useLanguage();
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

    // Aggregate and categorize ingredients
    const shoppingList = useMemo(() => {
        const list: Record<string, IngredientItem[]> = {
            "Produce": [],
            "Meat & Dairy": [],
            "Pantry": [],
            "Other": []
        };

        // An ingredient used by several meals must appear once with the total,
        // otherwise the same item is listed two or three times.
        const totals = new Map<string, { name: string; category: string; amounts: string[] }>();

        mealPlan.meals.forEach(meal => {
            meal.ingredients.forEach(ing => {
                // Simple categorization logic based on keywords
                let category = "Other";
                const lowerName = ing.name.toLowerCase();

                if (["chicken", "beef", "egg", "yogurt", "milk", "cheese", "fish", "tuna", "pork", "turkey"].some(k => lowerName.includes(k))) {
                    category = "Meat & Dairy";
                } else if (["apple", "banana", "berry", "spinach", "lettuce", "tomato", "avocado", "potato", "onion", "garlic", "fruit", "veg"].some(k => lowerName.includes(k))) {
                    category = "Produce";
                } else if (["oat", "rice", "pasta", "bread", "oil", "sauce", "spice", "salt", "pepper", "honey", "nut", "seed", "powder"].some(k => lowerName.includes(k))) {
                    category = "Pantry";
                }

                const existing = totals.get(lowerName);
                if (existing) {
                    existing.amounts.push(ing.amount);
                } else {
                    totals.set(lowerName, { name: ing.name, category, amounts: [ing.amount] });
                }
            });
        });

        totals.forEach(({ name, category, amounts }) => {
            list[category].push({ name, category, amount: combineAmounts(amounts) });
        });

        Object.values(list).forEach(items => items.sort((a, b) => a.name.localeCompare(b.name)));

        return list;
    }, [mealPlan]);

    const toggleItem = (name: string) => {
        const newSet = new Set(checkedItems);
        if (newSet.has(name)) {
            newSet.delete(name);
        } else {
            newSet.add(name);
        }
        setCheckedItems(newSet);
    };

    const copyToClipboard = () => {
        let text = `🛒 ${t('nutrition.smartShoppingList')} - ${mealPlan.calorieTarget} ${t('nutrition.kcal')}\n\n`;
        Object.entries(shoppingList).forEach(([category, items]) => {
            if (items.length > 0) {
                text += `[${t(CATEGORY_KEYS[category] || category)}]\n`;
                items.forEach(item => {
                    text += `- ${item.name} (${item.amount})\n`;
                });
                text += "\n";
            }
        });
        navigator.clipboard.writeText(text);
        toast.success(t('nutrition.copiedClipboard'));
    };

    return (
        <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="max-w-md bg-surface-1 border-hair text-txt-hi">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 font-display text-xl font-black italic uppercase tracking-tight">
                        <ShoppingCart className="w-5 h-5 text-brand" />
                        {t('nutrition.smartShoppingList')}
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[60vh] pr-4">
                    <div className="space-y-6">
                        {Object.entries(shoppingList).map(([category, items]) => (
                            items.length > 0 && (
                                <div key={category}>
                                    <h3 className="text-sm font-bold text-brand mb-2 uppercase tracking-wide">{t(CATEGORY_KEYS[category] || category)}</h3>
                                    <div className="space-y-2">
                                        {items.map((item) => {
                                            // Keyed by name, not index, so ticking an item
                                            // survives reordering of the list.
                                            const id = `${category}-${item.name}`;
                                            const isChecked = checkedItems.has(id);
                                            return (
                                                <div
                                                    key={id}
                                                    onClick={() => toggleItem(id)}
                                                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200 ${isChecked
                                                            ? "bg-brand-soft border-brand/30"
                                                            : "bg-surface-2 border-hair hover:border-hair-strong"
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isChecked ? "bg-brand border-brand" : "border-txt-lo"
                                                            }`}>
                                                            {isChecked && <Check className="w-3 h-3 text-white" />}
                                                        </div>
                                                        <span className={isChecked ? "line-through text-txt-lo" : "text-txt-hi"}>
                                                            {item.name}
                                                        </span>
                                                    </div>
                                                    <span className="stat text-sm text-txt-mid bg-surface-1 border border-hair px-2 py-1 rounded-lg">
                                                        {item.amount}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </ScrollArea>

                <div className="flex gap-2 mt-4 pt-4 border-t border-hair">
                    <Button variant="primary" size="sm" fullWidth onClick={copyToClipboard} className="flex-1">
                        {t('nutrition.copyList')}
                    </Button>
                    <Button variant="secondary" size="sm" onClick={onClose}>
                        {t('nutrition.close')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
