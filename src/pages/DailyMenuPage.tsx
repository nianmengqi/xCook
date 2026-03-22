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
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);

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
    setSaveSuccess(false);
    setSaveError(false);
    try {
      await dailyMenuApi.save(selectedDate, selectedRecipeIds);
      setSaveSuccess(true);
      await loadDailyMenu();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save daily menu:', error);
      setSaveError(true);
      setTimeout(() => setSaveError(false), 3000);
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-background-primary to-green-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 页面标题区域 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">每日菜单</h1>
              <p className="text-sm text-gray-500">规划您的健康饮食</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white shadow-sm transition-all"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* 保存成功/失败提示 */}
            {saveSuccess && (
              <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce">
                <div className="flex items-center gap-3 px-5 py-3 bg-green-500 text-white rounded-xl shadow-lg shadow-green-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">菜单保存成功！</span>
                </div>
              </div>
            )}
            {saveError && (
              <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce">
                <div className="flex items-center gap-3 px-5 py-3 bg-red-500 text-white rounded-xl shadow-lg shadow-red-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="font-medium">保存失败，请重试</span>
                </div>
              </div>
            )}

            {/* 营养汇总卡片 */}
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-100 p-5 sm:p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">营养汇总</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="relative bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute top-2 right-2 w-2 h-2 bg-orange-400 rounded-full"></div>
                  <p className="text-sm text-orange-600 font-medium mb-1">热量</p>
                  <p className="text-2xl font-bold text-orange-600">{totals.calories}</p>
                  <p className="text-xs text-orange-400 mt-1">kcal</p>
                </div>
                <div className="relative bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 text-center group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full"></div>
                  <p className="text-sm text-red-600 font-medium mb-1">蛋白质</p>
                  <p className="text-2xl font-bold text-red-600">{totals.protein}</p>
                  <p className="text-xs text-red-400 mt-1">g</p>
                </div>
                <div className="relative bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 text-center group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <p className="text-sm text-yellow-600 font-medium mb-1">脂肪</p>
                  <p className="text-2xl font-bold text-yellow-600">{totals.fat}</p>
                  <p className="text-xs text-yellow-400 mt-1">g</p>
                </div>
                <div className="relative bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full"></div>
                  <p className="text-sm text-green-600 font-medium mb-1">碳水</p>
                  <p className="text-2xl font-bold text-green-600">{totals.carbs}</p>
                  <p className="text-xs text-green-400 mt-1">g</p>
                </div>
              </div>
            </div>

            {/* 已选菜谱 */}
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-100 p-5 sm:p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    已选菜谱 
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-primary bg-primary/10 rounded-full">
                      {selectedRecipes.length}
                    </span>
                  </h2>
                </div>
                <Button 
                  onClick={() => setShowRecipePicker(true)} 
                  size="sm"
                  className="shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  添加菜谱
                </Button>
              </div>

              {selectedRecipes.length === 0 ? (
                <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-200">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium mb-1">还没有选择菜谱</p>
                  <p className="text-sm text-gray-400">点击上方按钮添加今日菜谱</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedRecipes.map(recipe => (
                    <div 
                      key={recipe.id} 
                      className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all duration-300 group"
                    >
                      <img
                        src={recipe.coverImage}
                        alt={recipe.title}
                        className="w-16 h-16 object-cover rounded-xl flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow"
                      />
                      <div className="flex-1 min-w-0">
                        <Link 
                          to={`/recipe/${recipe.id}`} 
                          className="font-semibold text-gray-900 hover:text-primary truncate block group-hover:text-primary transition-colors"
                        >
                          {recipe.title}
                        </Link>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="inline-flex items-center gap-1 text-sm text-orange-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                            </svg>
                            {recipe.nutrition?.calories || 0} kcal
                          </span>
                          <span className="text-xs text-gray-300">|</span>
                          <span className="text-sm text-gray-500">
                            {recipe.servings} 人份
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveRecipe(recipe.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 group/btn"
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
              <div className="bg-white rounded-2xl shadow-lg shadow-gray-100 p-5 sm:p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    采购清单 
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-green-600 bg-green-100 rounded-full">
                      {shoppingList.length}
                    </span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {shoppingList.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-white rounded-xl border border-green-100 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700 font-medium">{item.name}</span>
                      </div>
                      <span className="text-gray-500 text-sm font-medium px-2 py-1 bg-gray-100 rounded-lg">
                        {item.amount} {item.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 操作按钮区域 */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="shadow-sm"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                返回首页
              </Button>
              <Button 
                onClick={handleSave} 
                loading={saving}
                className="shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
              >
                {saving ? '保存中...' : (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    保存菜单
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 菜谱选择弹窗 */}
      {showRecipePicker && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl">
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">选择菜谱</h3>
                </div>
                <button 
                  onClick={() => setShowRecipePicker(false)} 
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="搜索菜谱..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-gray-50/50 transition-all"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {availableRecipes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium mb-1">
                    {recipes.length === 0 ? '还没有菜谱' : '没有可添加的菜谱'}
                  </p>
                  <p className="text-sm text-gray-400">
                    {recipes.length === 0 ? '请先创建菜谱' : '已添加所有菜谱'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {availableRecipes.map(recipe => (
                    <div
                      key={recipe.id}
                      onClick={() => handleAddRecipe(recipe.id)}
                      className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 cursor-pointer hover:border-primary/50 hover:shadow-md transition-all duration-300 group"
                    >
                      <img
                        src={recipe.coverImage}
                        alt={recipe.title}
                        className="w-14 h-14 object-cover rounded-xl flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">{recipe.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center gap-1 text-sm text-orange-500">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                            </svg>
                            {recipe.nutrition?.calories || 0} kcal
                          </span>
                          <span className="text-xs text-gray-300">|</span>
                          <span className="text-sm text-gray-500">{recipe.servings} 人份</span>
                        </div>
                      </div>
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                        <svg className="w-4 h-4 text-primary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
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
