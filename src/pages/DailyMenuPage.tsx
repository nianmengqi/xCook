import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useRecipe } from '../context/RecipeContext';
import { dailyMenuApi } from '../services/api';
import { Recipe, DailyMenuResponse, ShoppingItem } from '../types';

export function DailyMenuPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { recipes } = useRecipe();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedRecipeIds, setSelectedRecipeIds] = useState<string[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showRecipePicker, setShowRecipePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuData, setMenuData] = useState<DailyMenuResponse | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadDailyMenu();
  }, [user, selectedDate, navigate]);

  async function loadDailyMenu() {
    setLoading(true);
    try {
      const data = await dailyMenuApi.get(selectedDate);
      setMenuData(data);
      setSelectedRecipeIds(data.recipeIds);
      setSavedRecipes(data.recipes);
    } catch (error) {
      console.error('Failed to load daily menu:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await dailyMenuApi.save(selectedDate, selectedRecipeIds);
      await loadDailyMenu();
    } catch (error) {
      console.error('Failed to save daily menu:', error);
    } finally {
      setSaving(false);
    }
  }

  function handleAddRecipe(recipeId: string) {
    if (!selectedRecipeIds.includes(recipeId)) {
      setSelectedRecipeIds([...selectedRecipeIds, recipeId]);
    }
    setShowRecipePicker(false);
    setSearchQuery('');
  }

  function handleRemoveRecipe(recipeId: string) {
    setSelectedRecipeIds(selectedRecipeIds.filter(id => id !== recipeId));
  }

  const filteredRecipes = useMemo(() => {
    if (!searchQuery.trim()) return recipes;
    const query = searchQuery.toLowerCase();
    return recipes.filter(recipe => 
      recipe.title.toLowerCase().includes(query) ||
      recipe.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  }, [recipes, searchQuery]);

  const availableRecipes = useMemo(() => {
    return filteredRecipes.filter(recipe => !selectedRecipeIds.includes(recipe.id));
  }, [filteredRecipes, selectedRecipeIds]);

  const selectedRecipes = useMemo(() => {
    return recipes.filter(recipe => selectedRecipeIds.includes(recipe.id));
  }, [recipes, selectedRecipeIds]);

  const totals = useMemo(() => {
    let calories = 0, protein = 0, fat = 0, carbs = 0;
    for (const recipe of selectedRecipes) {
      if (recipe.nutrition) {
        calories += recipe.nutrition.calories || 0;
        protein += recipe.nutrition.protein || 0;
        fat += recipe.nutrition.fat || 0;
        carbs += recipe.nutrition.carbs || 0;
      }
    }
    return {
      calories: Math.round(calories),
      protein: Math.round(protein * 10) / 10,
      fat: Math.round(fat * 10) / 10,
      carbs: Math.round(carbs * 10) / 10
    };
  }, [selectedRecipes]);

  const shoppingList = useMemo(() => {
    const ingredientMap = new Map<string, ShoppingItem>();
    for (const recipe of selectedRecipes) {
      if (recipe.ingredients) {
        for (const ing of recipe.ingredients) {
          const key = ing.name.toLowerCase().trim();
          if (ingredientMap.has(key)) {
            const existing = ingredientMap.get(key)!;
            if (existing.unit === ing.unit) {
              existing.amount += ing.amount;
            } else {
              ingredientMap.set(key + '_' + ing.unit, {
                name: ing.name,
                amount: ing.amount,
                unit: ing.unit
              });
            }
          } else {
            ingredientMap.set(key, {
              name: ing.name,
              amount: ing.amount,
              unit: ing.unit
            });
          }
        }
      }
    }
    return Array.from(ingredientMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedRecipes]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background-primary">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">每日菜单</h1>
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* 营养汇总卡片 */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">营养汇总</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-orange-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-500">热量</p>
                  <p className="text-xl font-bold text-orange-600">{totals.calories}</p>
                  <p className="text-xs text-gray-400">kcal</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-500">蛋白质</p>
                  <p className="text-xl font-bold text-red-600">{totals.protein}</p>
                  <p className="text-xs text-gray-400">g</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-500">脂肪</p>
                  <p className="text-xl font-bold text-yellow-600">{totals.fat}</p>
                  <p className="text-xs text-gray-400">g</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-500">碳水</p>
                  <p className="text-xl font-bold text-green-600">{totals.carbs}</p>
                  <p className="text-xs text-gray-400">g</p>
                </div>
              </div>
            </div>

            {/* 已选菜谱 */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">已选菜谱 ({selectedRecipes.length})</h2>
                <Button onClick={() => setShowRecipePicker(true)} size="sm">
                  添加菜谱
                </Button>
              </div>

              {selectedRecipes.length === 0 ? (
                <p className="text-gray-500 text-center py-8">还没有选择菜谱，点击上方按钮添加</p>
              ) : (
                <div className="space-y-3">
                  {selectedRecipes.map(recipe => (
                    <div key={recipe.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={recipe.coverImage}
                        alt={recipe.title}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <Link to={`/recipe/${recipe.id}`} className="font-medium text-gray-900 hover:text-primary truncate block">
                          {recipe.title}
                        </Link>
                        <p className="text-sm text-gray-500">
                          {recipe.nutrition?.calories || 0} kcal · {recipe.servings} 人份
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveRecipe(recipe.id)}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 采购清单 */}
            {shoppingList.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">食材清单 ({shoppingList.length})</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {shoppingList.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">{item.name}</span>
                      <span className="text-gray-500 text-sm">
                        {item.amount} {item.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 保存按钮 */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => navigate('/')}>
                返回首页
              </Button>
              <Button onClick={handleSave} loading={saving}>
                保存菜单
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 菜谱选择弹窗 */}
      {showRecipePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">选择菜谱</h3>
                <button onClick={() => setShowRecipePicker(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <input
                type="text"
                placeholder="搜索菜谱..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {availableRecipes.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  {recipes.length === 0 ? '还没有菜谱，请先创建菜谱' : '没有可添加的菜谱'}
                </p>
              ) : (
                <div className="space-y-3">
                  {availableRecipes.map(recipe => (
                    <div
                      key={recipe.id}
                      onClick={() => handleAddRecipe(recipe.id)}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <img
                        src={recipe.coverImage}
                        alt={recipe.title}
                        className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{recipe.title}</p>
                        <p className="text-sm text-gray-500">
                          {recipe.nutrition?.calories || 0} kcal · {recipe.servings} 人份
                        </p>
                      </div>
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
