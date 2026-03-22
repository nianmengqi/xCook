import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { MobileNav } from '../components/layout/MobileNav';
import { RecipeCard } from '../components/recipe/RecipeCard';
import { useRecipe } from '../context/RecipeContext';
import { DEFAULT_CATEGORIES } from '../types';
import { cn } from '../utils';

export function CategoriesPage() {
  const navigate = useNavigate();
  const { recipes, toggleFavorite } = useRecipe();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredRecipes = useMemo(() => {
    if (!selectedCategory) return recipes;
    return recipes.filter((recipe) => recipe.category === selectedCategory);
  }, [recipes, selectedCategory]);

  return (
    <div className="min-h-screen bg-background-primary pb-20 md:pb-0">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">菜谱分类</h1>
          <p className="text-gray-500 mt-1">按分类浏览菜谱</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
          {DEFAULT_CATEGORIES.map((category) => {
            const count = recipes.filter((r) => r.category === category.id).length;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
                className={cn(
                  'p-4 rounded-xl text-left transition-all',
                  selectedCategory === category.id
                    ? 'bg-primary text-white shadow-lg scale-105'
                    : 'bg-white shadow-md hover:shadow-lg hover:scale-[1.02]'
                )}
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className={cn(
                  'font-medium',
                  selectedCategory === category.id ? 'text-white' : 'text-gray-900'
                )}>
                  {category.name}
                </div>
                <div className={cn(
                  'text-sm',
                  selectedCategory === category.id ? 'text-white/80' : 'text-gray-500'
                )}>
                  {count} 道菜谱
                </div>
              </button>
            );
          })}
        </div>

        {selectedCategory && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {DEFAULT_CATEGORIES.find((c) => c.id === selectedCategory)?.name}
            </h2>
          </div>
        )}

        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredRecipes.map((recipe, index) => (
              <div
                key={recipe.id}
                style={{ animationDelay: `${index * 50}ms` }}
                className="animate-slideUp"
              >
                <RecipeCard
                  recipe={recipe}
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                  onFavoriteClick={() => toggleFavorite(recipe.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-gray-500 text-lg">该分类下还没有菜谱</p>
            <button
              onClick={() => navigate('/recipe/new')}
              className="btn btn-primary mt-6"
            >
              创建菜谱
            </button>
          </div>
        )}
      </main>

      <MobileNav />
    </div>
  );
}
