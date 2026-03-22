import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { MobileNav } from '../components/layout/MobileNav';
import { RecipeCard } from '../components/recipe/RecipeCard';
import { Input } from '../components/common/Input';
import { useRecipe } from '../context/RecipeContext';
import { DEFAULT_CATEGORIES } from '../types';
import { cn } from '../utils';

export function HomePage() {
  const navigate = useNavigate();
  const { recipes, toggleFavorite } = useRecipe();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || recipe.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [recipes, searchQuery, selectedCategory]);

  const handleRecipeClick = (id: string) => {
    navigate(`/recipe/${id}`);
  };

  return (
    <div className="min-h-screen bg-background-primary pb-20 md:pb-0">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="relative max-w-md mx-auto md:mx-0">
            <Input
              placeholder="搜索菜谱..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>
        </div>

        <div className="mb-6 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                'px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all',
                !selectedCategory
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              )}
            >
              全部
            </button>
            {DEFAULT_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  'px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all flex items-center gap-1.5',
                  selectedCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                )}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

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
                  onClick={() => handleRecipeClick(recipe.id)}
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
            <p className="text-gray-500 text-lg">暂无菜谱</p>
            <p className="text-gray-400 text-sm mt-1">试试其他搜索条件或创建一个新菜谱</p>
          </div>
        )}
      </main>

      <MobileNav />
    </div>
  );
}
