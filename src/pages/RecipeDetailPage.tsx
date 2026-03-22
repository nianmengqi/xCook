import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecipe } from '../context/RecipeContext';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/layout/Header';
import { MobileNav } from '../components/layout/MobileNav';
import { NutritionPanel } from '../components/recipe/NutritionPanel';
import { Button } from '../components/common/Button';
import { RatingDisplay, RatingInput } from '../components/common/StarRating';
import { DIFFICULTY_LABELS, DEFAULT_CATEGORIES } from '../types';
import { formatTime } from '../utils';
import { recipesApi } from '../services/api';

export function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { recipes, toggleFavorite, deleteRecipe, refreshRecipes } = useRecipe();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [recipeRating, setRecipeRating] = useState<number>(0);
  const [ratingCount, setRatingCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  
  // Load recipe from context or API
  useEffect(() => {
    const loadRecipe = async () => {
      if (!id) return;
      
      // First try to get from context
      const contextRecipe = recipes.find((r) => r.id === id);
      if (contextRecipe) {
        setRecipe(contextRecipe);
        setRecipeRating(contextRecipe.rating || 0);
        setRatingCount(contextRecipe.ratingCount || 0);
        setLoading(false);
        return;
      }
      
      // If not in context, try to fetch from API
      try {
        const fetchedRecipe = await recipesApi.getById(id);
        setRecipe(fetchedRecipe);
        setRecipeRating(fetchedRecipe.rating || 0);
        setRatingCount(fetchedRecipe.ratingCount || 0);
        // Refresh context to include this recipe
        await refreshRecipes();
      } catch (error) {
        console.error('Failed to load recipe:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadRecipe();
  }, [id, recipes, refreshRecipes]);

  // Load user's rating for this recipe (only if logged in)
  useEffect(() => {
    if (id && user) {
      loadRating();
    }
  }, [id, user]);

  const loadRating = async () => {
    try {
      const response = await recipesApi.getUserRating(id!);
      if (response.userRating) {
        setUserRating(response.userRating);
      }
    } catch (error) {
      // User might not be logged in, ignore error
    }
  };

  const handleRate = async (rating: number) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const response = await recipesApi.rate(id!, rating);
      setUserRating(rating);
      setRecipeRating(response.rating);
      setRatingCount(response.ratingCount);
      // Refresh recipes to update the rating in context
      await refreshRecipes();
    } catch (error) {
      console.error('Failed to rate recipe:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-primary">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-gray-500 mt-4">加载中...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background-primary">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 text-lg">菜谱不存在</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            返回首页
          </Button>
        </div>
      </div>
    );
  }

  const category = DEFAULT_CATEGORIES.find((c) => c.id === recipe.category);

  const handleDelete = () => {
    deleteRecipe(recipe.id);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background-primary pb-20 md:pb-0">
      <Header />
      
      <main className="max-w-4xl mx-auto">
        <div className="relative aspect-video bg-gray-100">
          <img
            src={recipe.coverImage || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800'}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {category && (
                    <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full">
                      {category.icon} {category.name}
                    </span>
                  )}
                  <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full">
                    {DIFFICULTY_LABELS[recipe.difficulty]}
                  </span>
                  {/* Recipe Rating Display */}
                  <div className="flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full">
                    <svg className="w-3 h-3 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>{(recipeRating || recipe.rating || 0).toFixed(1)}</span>
                    {(ratingCount || recipe.ratingCount || 0) > 0 && (
                      <span className="text-white/70">({ratingCount || recipe.ratingCount})</span>
                    )}
                  </div>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">{recipe.title}</h1>
              </div>
              <button
                onClick={() => toggleFavorite(recipe.id)}
                className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
              >
                <svg
                  className={`w-6 h-6 ${recipe.isFavorite ? 'text-red-500 fill-current' : 'text-white'}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6">
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>准备: {formatTime(recipe.prepTime)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
              <span>烹饪: {formatTime(recipe.cookTime)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>份量: {recipe.servings}人份</span>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            {recipe.isOwner && (
              <>
                <Button variant="secondary" onClick={() => navigate(`/recipe/${recipe.id}/edit`)}>
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  编辑菜谱
                </Button>
                <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  删除菜谱
                </Button>
              </>
            )}
          </div>

          {recipe.description && (
            <p className="text-gray-600 mb-6">{recipe.description}</p>
          )}

          {recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {recipe.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                <h2 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  食材清单
                </h2>
                <div className="space-y-2">
                  {recipe.ingredients.map((ingredient) => (
                    <div key={ingredient.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <span className="text-gray-800">{ingredient.name}</span>
                      <span className="text-gray-500 font-medium">{ingredient.amount}{ingredient.unit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-4">
                <h2 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  烹饪步骤
                </h2>
                <div className="space-y-4">
                  {recipe.steps.map((step, index) => (
                    <div key={step.id} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-medium">
                        {step.order}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-700 whitespace-pre-wrap">{step.description}</p>
                        {step.duration && (
                          <span className="inline-flex items-center gap-1 mt-2 text-sm text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            约 {step.duration} 分钟
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-1 space-y-4">
              {/* Rating Section */}
              <div className="bg-white rounded-xl shadow-md p-4">
                <h3 className="font-semibold text-gray-900 mb-3">评分</h3>
                <div className="flex items-center gap-2 mb-3">
                  <RatingDisplay 
                    rating={recipeRating || recipe.rating || 0} 
                    reviewCount={ratingCount || recipe.ratingCount || 0}
                    size="md"
                  />
                </div>
                <div className="border-t border-gray-100 pt-3">
                  {user ? (
                    <>
                      <p className="text-sm text-gray-600 mb-2">您的评分</p>
                      <RatingInput 
                        value={userRating} 
                        onChange={handleRate}
                        size="lg"
                      />
                    </>
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-sm text-gray-500 mb-2">登录后可评分</p>
                      <Button size="sm" onClick={() => navigate('/login')}>
                        去登录
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <NutritionPanel nutrition={recipe.nutrition} servings={recipe.servings} />
            </div>
          </div>
        </div>
      </main>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">确认删除</h3>
            <p className="text-gray-600 mb-4">确定要删除"{recipe.title}"吗？此操作无法撤销。</p>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>取消</Button>
              <Button variant="danger" onClick={handleDelete}>删除</Button>
            </div>
          </div>
        </div>
      )}

      <MobileNav />
    </div>
  );
}
