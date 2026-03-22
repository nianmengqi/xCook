import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Recipe, Ingredient, CookingStep, NutritionInfo, Difficulty } from '../types';
import { calculateNutritionFromIngredients } from '../data/nutrition';
import { generateId } from '../utils';
import { recipesApi } from '../services/api';
import { useAuth } from './AuthContext';

interface RecipeContextType {
  recipes: Recipe[];
  currentRecipe: Recipe | null;
  loading: boolean;
  createRecipe: (recipe: Partial<Recipe>) => Promise<Recipe>;
  updateRecipe: (id: string, updates: Partial<Recipe>) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
  setCurrentRecipe: (recipe: Recipe | null) => void;
  addIngredient: (recipeId: string, ingredient: Omit<Ingredient, 'id' | 'nutritionPer100g'>) => Promise<void>;
  removeIngredient: (recipeId: string, ingredientId: string) => Promise<void>;
  addStep: (recipeId: string, step: Omit<CookingStep, 'id'>) => Promise<void>;
  removeStep: (recipeId: string, stepId: string) => Promise<void>;
  reorderSteps: (recipeId: string, steps: CookingStep[]) => Promise<void>;
  calculateNutrition: (ingredients: Ingredient[]) => NutritionInfo;
  toggleFavorite: (recipeId: string) => Promise<void>;
  getFavoriteRecipes: () => Recipe[];
  refreshRecipes: () => Promise<void>;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export function RecipeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  // Load recipes from backend on mount or when user changes
  const refreshRecipes = useCallback(async () => {
    if (!user) {
      setRecipes([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const backendRecipes = await recipesApi.getAll();
      setRecipes(backendRecipes.map((r: any) => ({
        ...r,
        createdAt: new Date(r.createdAt),
        updatedAt: new Date(r.updatedAt),
      })));
    } catch (error) {
      console.error('Failed to load recipes:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshRecipes();
  }, [refreshRecipes]);

  const createRecipe = useCallback(async (recipe: Partial<Recipe>): Promise<Recipe> => {
    const newRecipe: Recipe = {
      id: generateId(),
      userId: user?.uid || '',
      title: recipe.title || '未命名菜谱',
      description: recipe.description || '',
      coverImage: recipe.coverImage || '',
      category: recipe.category || 'hot-dish',
      tags: recipe.tags || [],
      difficulty: recipe.difficulty || 'easy',
      prepTime: recipe.prepTime || 0,
      cookTime: recipe.cookTime || 0,
      servings: recipe.servings || 2,
      ingredients: recipe.ingredients || [],
      steps: recipe.steps || [],
      nutrition: recipe.nutrition || { calories: 0, protein: 0, fat: 0, carbs: 0, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 0, iron: 0, zinc: 0 },
      isPublic: recipe.isPublic ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    try {
      const savedRecipe = await recipesApi.create(newRecipe);
      setRecipes(prev => [savedRecipe, ...prev]);
      return savedRecipe;
    } catch (error) {
      console.error('Failed to create recipe:', error);
      // Fallback to local only
      setRecipes(prev => [newRecipe, ...prev]);
      return newRecipe;
    }
  }, [user]);

  const updateRecipe = useCallback(async (id: string, updates: Partial<Recipe>) => {
    try {
      await recipesApi.update(id, updates);
      setRecipes(prev => prev.map(recipe => 
        recipe.id === id 
          ? { ...recipe, ...updates, updatedAt: new Date() }
          : recipe
      ));
    } catch (error) {
      console.error('Failed to update recipe:', error);
      // Fallback to local only
      setRecipes(prev => prev.map(recipe => 
        recipe.id === id 
          ? { ...recipe, ...updates, updatedAt: new Date() }
          : recipe
      ));
    }
  }, []);

  const deleteRecipe = useCallback(async (id: string) => {
    try {
      await recipesApi.delete(id);
      setRecipes(prev => prev.filter(recipe => recipe.id !== id));
    } catch (error) {
      console.error('Failed to delete recipe:', error);
      // Fallback to local only
      setRecipes(prev => prev.filter(recipe => recipe.id !== id));
    }
  }, []);

  const addIngredient = useCallback(async (recipeId: string, ingredient: Omit<Ingredient, 'id' | 'nutritionPer100g'>) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    const newIngredient: Ingredient = {
      ...ingredient,
      id: generateId(),
      nutritionPer100g: { calories: 0, protein: 0, fat: 0, carbs: 0, fiber: 0, vitaminA: 0, vitaminC: 0, calcium: 0, iron: 0, zinc: 0 },
    };
    
    const updatedIngredients = [...recipe.ingredients, newIngredient];
    await updateRecipe(recipeId, { ingredients: updatedIngredients });
  }, [recipes, updateRecipe]);

  const removeIngredient = useCallback(async (recipeId: string, ingredientId: string) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    const updatedIngredients = recipe.ingredients.filter(i => i.id !== ingredientId);
    await updateRecipe(recipeId, { ingredients: updatedIngredients });
  }, [recipes, updateRecipe]);

  const addStep = useCallback(async (recipeId: string, step: Omit<CookingStep, 'id'>) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    const newStep: CookingStep = { ...step, id: generateId() };
    const updatedSteps = [...recipe.steps, newStep];
    await updateRecipe(recipeId, { steps: updatedSteps });
  }, [recipes, updateRecipe]);

  const removeStep = useCallback(async (recipeId: string, stepId: string) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    const updatedSteps = recipe.steps.filter(s => s.id !== stepId);
    await updateRecipe(recipeId, { steps: updatedSteps });
  }, [recipes, updateRecipe]);

  const reorderSteps = useCallback(async (recipeId: string, steps: CookingStep[]) => {
    await updateRecipe(recipeId, { steps });
  }, [updateRecipe]);

  const calculateNutrition = useCallback((ingredients: Ingredient[]): NutritionInfo => {
    return calculateNutritionFromIngredients(
      ingredients.map(i => ({ amount: i.amount, unit: i.unit, nutritionPer100g: i.nutritionPer100g, name: i.name }))
    );
  }, []);

  const toggleFavorite = useCallback(async (recipeId: string) => {
    try {
      const response = await recipesApi.toggleFavorite(recipeId);
      // Update local state
      setRecipes(prev => prev.map(recipe => 
        recipe.id === recipeId 
          ? { ...recipe, isFavorite: response.isFavorite }
          : recipe
      ));
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  }, []);

  const getFavoriteRecipes = useCallback(() => {
    return recipes.filter(recipe => recipe.isFavorite);
  }, [recipes]);

  return (
    <RecipeContext.Provider value={{
      recipes,
      currentRecipe,
      loading,
      createRecipe,
      updateRecipe,
      deleteRecipe,
      setCurrentRecipe,
      addIngredient,
      removeIngredient,
      addStep,
      removeStep,
      reorderSteps,
      calculateNutrition,
      toggleFavorite,
      getFavoriteRecipes,
      refreshRecipes,
    }}>
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipe() {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipe must be used within a RecipeProvider');
  }
  return context;
}
