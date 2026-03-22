export interface User {
  uid: string;
  email: string;
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
  weightPerUnit?: number; // 单个单位的重量(克)，用于"个"、"只"等单位的转换
}

export interface CookingStep {
  id: string;
  order: number;
  description: string;
  image?: string;
  duration?: number;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Recipe {
  id: string;
  userId: string;
  title: string;
  description?: string;
  coverImage: string;
  category: string;
  tags: string[];
  difficulty: Difficulty;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: Ingredient[];
  steps: CookingStep[];
  nutrition: NutritionInfo;
  isPublic: boolean;
  isFavorite?: boolean;
  rating?: number;
  ratingCount?: number;
  isOwner?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  isCustom?: boolean;
  userId?: string;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'hot-dish', name: '热菜', icon: '🍳', color: '#E85D04' },
  { id: 'cold-dish', name: '凉菜', icon: '🥗', color: '#2D6A4F' },
  { id: 'soup', name: '汤品', icon: '🍲', color: '#F59E0B' },
  { id: 'staple', name: '主食', icon: '🍚', color: '#8B5CF6' },
  { id: 'snack', name: '小吃', icon: '🍡', color: '#EC4899' },
  { id: 'dessert', name: '甜点', icon: '🍰', color: '#F472B6' },
  { id: 'drink', name: '饮品', icon: '🧋', color: '#06B6D4' },
  { id: 'breakfast', name: '早餐', icon: '🥪', color: '#84CC16' },
  { id: 'lunch', name: '午餐', icon: '🍱', color: '#6366F1' },
  { id: 'dinner', name: '晚餐', icon: '🍽️', color: '#14B8A6' },
];

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: '简单',
  medium: '中等',
  hard: '困难',
};

export const UNIT_OPTIONS = [
  { value: 'g', label: '克 (g)' },
  { value: 'ml', label: '毫升 (ml)' },
  { value: '个', label: '个' },
  { value: '勺', label: '勺' },
  { value: '杯', label: '杯' },
  { value: '片', label: '片' },
  { value: '块', label: '块' },
  { value: '根', label: '根' },
  { value: '把', label: '把' },
  { value: '颗', label: '颗' },
  { value: '瓣', label: '瓣' },
  { value: '条', label: '条' },
  { value: '段', label: '段' },
  { value: '克', label: '克' },
];

export interface ShoppingItem {
  name: string;
  amount: number;
  unit: string;
}

export interface DailyMenuResponse {
  date: string;
  recipeIds: string[];
  recipes: Recipe[];
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
  shoppingList: ShoppingItem[];
}
