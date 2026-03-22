import { useState, useEffect, useCallback } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Ingredient } from '../../types';
import { searchFood, FoodSearchResult } from '../../services/nutritionApi';
import { NutritionInfo } from '../../types';

interface IngredientInputProps {
  ingredients: Ingredient[];
  onAdd: (ingredient: Ingredient) => void;
  onRemove: (id: string) => void;
}

export function IngredientInput({ ingredients, onAdd, onRemove }: IngredientInputProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('g');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<FoodSearchResult[]>([]);
  const [error, setError] = useState('');
  const [selectedNutrition, setSelectedNutrition] = useState<NutritionInfo | null>(null);

  const searchSuggestions = useCallback((query: string) => {
    if (query.length < 1) {
      setSuggestions([]);
      return;
    }

    const results = searchFood(query);
    setSuggestions(results.slice(0, 8));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (name.length > 0) {
        searchSuggestions(name);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [name, searchSuggestions]);

  const handleAdd = (nutritionPer100g: NutritionInfo) => {
    if (!name.trim()) {
      setError('请输入食材名称');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError('请输入有效的用量');
      return;
    }

    const newIngredient: Ingredient = {
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      amount: Number(amount),
      unit: unit,
      nutritionPer100g: nutritionPer100g,
    };
    onAdd(newIngredient);

    setName('');
    setAmount('');
    setUnit('g');
    setError('');
    setSuggestions([]);
    setSelectedNutrition(null);
  };

  const handleSuggestionClick = (suggestion: FoodSearchResult) => {
    setName(suggestion.label);
    setSelectedNutrition(suggestion.nutrients);
    setSuggestions([]);
    setShowSuggestions(false);
    
    if (!amount) {
      setAmount('100');
    }
  };

  const handleAddClick = () => {
    if (!name.trim()) {
      setError('请输入食材名称');
      return;
    }
    
    if (selectedNutrition) {
      handleAdd(selectedNutrition);
    } else {
      const results = searchFood(name);
      if (results.length > 0) {
        handleAdd(results[0].nutrients);
      } else {
        setError('未找到该食材，请从搜索结果中选择或尝试其他关键词');
      }
    }
  };

  const calculateCalories = (ingredient: Ingredient): number => {
    // 按克或ml计算：amount / 100 * calories_per_100g (1ml按1g计算)
    const factor = ingredient.amount / 100;
    return Math.round((ingredient.nutritionPer100g?.calories || 0) * factor);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[1fr_100px_80px_auto] gap-2 items-start">
        <div className="relative">
          <Input
            placeholder="输入食材名称搜索，如：米饭、鸡肉"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setShowSuggestions(true);
              setError('');
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            error={error}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden max-h-48 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.foodId}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="text-sm font-medium text-gray-900">{suggestion.label}</div>
                  <div className="text-xs text-gray-500">
                    热量: {Math.round(suggestion.nutrients.calories)}kcal/100g |
                    蛋白质: {Math.round(suggestion.nutrients.protein)}g |
                    脂肪: {Math.round(suggestion.nutrients.fat)}g
                  </div>
                </button>
              ))}
            </div>
          )}
          {showSuggestions && name.length > 0 && suggestions.length === 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500 text-sm">
              未找到"{name}"，请尝试其他关键词
            </div>
          )}
        </div>
        <Input
          type="number"
          placeholder="数量"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
        />
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="g">g</option>
          <option value="ml">ml</option>
        </select>
        <Button onClick={handleAddClick} size="sm">
          添加
        </Button>
      </div>

      {ingredients.length > 0 && (
        <div className="space-y-2">
          {ingredients.map((ingredient) => {
            const calories = calculateCalories(ingredient);
            
            return (
              <div
                key={ingredient.id}
                className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg group"
              >
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-900">{ingredient.name}</span>
                  <span className="text-gray-600">
                    {ingredient.amount}{ingredient.unit}
                  </span>
                  <span className="text-xs text-gray-400">
                    ≈{calories}kcal
                  </span>
                </div>
                <button
                  onClick={() => onRemove(ingredient.id)}
                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
