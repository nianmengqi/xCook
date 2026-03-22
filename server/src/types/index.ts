export interface User {
  id: string;
  email: string;
  password: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  vitaminA: number;
  vitaminC: number;
  calcium: number;
  iron: number;
  zinc: number;
}

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  nutritionPer100g: NutritionInfo;
}

export interface CookingStep {
  id: string;
  order: number;
  description: string;
  image?: string;
  duration?: number;
}

export interface Recipe {
  id: string;
  userId: string;
  title: string;
  description?: string;
  coverImage: string;
  category: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: Ingredient[];
  steps: CookingStep[];
  nutrition: NutritionInfo;
  isPublic: boolean;
  isFavorite?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FoodItem {
  name: string;
  nutrients: NutritionInfo;
  isCustom: boolean;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}
