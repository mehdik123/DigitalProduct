export interface Ingredient {
  name: string;
  amount: string;
}

export interface Meal {
  name: string;
  type: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  image: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime?: string;
}

export interface MealPlan {
  calorieTarget: number;
  description: string;
  meals: Meal[];
}
