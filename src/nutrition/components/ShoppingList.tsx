import { useState, useMemo } from "react";
import { Button } from "@nutrition/components/ui/button";
import { Check, ShoppingCart, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@nutrition/components/ui/dialog";
import { ScrollArea } from "@nutrition/components/ui/scroll-area";
import { MealPlan } from "@nutrition/types/meal";
import { toast } from "sonner";

interface ShoppingListProps {
    mealPlan: MealPlan;
    isOpen: boolean;
    onClose: () => void;
}

interface IngredientItem {
    name: string;
    amount: string;
    category: string;
    checked: boolean;
}

export const ShoppingList = ({ mealPlan, isOpen, onClose }: ShoppingListProps) => {
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

    // Aggregate and categorize ingredients
    const shoppingList = useMemo(() => {
        const list: Record<string, IngredientItem[]> = {
            "Produce": [],
            "Meat & Dairy": [],
            "Pantry": [],
            "Other": []
        };

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

                // Avoid duplicates? For now, list loosely. 
                // Ideally we would merge amounts, but parsing "200g" vs "1 cup" is hard.
                // Let's list them as separate items for simplicity, or dedup by name if simple.

                // Simple distinct naming:
                list[category].push({
                    name: ing.name,
                    amount: ing.amount,
                    category,
                    checked: false // State managed separately
                });
            });
        });

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
        let text = `🛒 Shopping List - ${mealPlan.calorieTarget} kcal Plan\n\n`;
        Object.entries(shoppingList).forEach(([category, items]) => {
            if (items.length > 0) {
                text += `[${category}]\n`;
                items.forEach(item => {
                    text += `- ${item.name} (${item.amount})\n`;
                });
                text += "\n";
            }
        });
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    return (
        <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="max-w-md bg-card border-border/50 text-foreground">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                        <ShoppingCart className="w-5 h-5 text-primary" />
                        Smart Shopping List
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[60vh] pr-4">
                    <div className="space-y-6">
                        {Object.entries(shoppingList).map(([category, items]) => (
                            items.length > 0 && (
                                <div key={category}>
                                    <h3 className="text-sm font-semibold text-primary mb-2 uppercase tracking-wide">{category}</h3>
                                    <div className="space-y-2">
                                        {items.map((item, idx) => {
                                            const id = `${category}-${idx}`;
                                            const isChecked = checkedItems.has(id);
                                            return (
                                                <div
                                                    key={id}
                                                    onClick={() => toggleItem(id)}
                                                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200 ${isChecked
                                                            ? "bg-primary/10 border-primary/20"
                                                            : "bg-secondary/20 border-border/50 hover:bg-secondary/40"
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isChecked ? "bg-primary border-primary" : "border-muted-foreground"
                                                            }`}>
                                                            {isChecked && <Check className="w-3 h-3 text-primary-foreground" />}
                                                        </div>
                                                        <span className={isChecked ? "line-through text-muted-foreground" : "text-foreground"}>
                                                            {item.name}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground bg-background/50 px-2 py-1 rounded">
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

                <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
                    <Button onClick={copyToClipboard} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                        Copy List
                    </Button>
                    <Button variant="outline" onClick={onClose} className="border-border/50">
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
