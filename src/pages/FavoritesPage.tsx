import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { MobileNav } from '../components/layout/MobileNav';
import { RecipeCard } from '../components/recipe/RecipeCard';
import { useRecipe } from '../context/RecipeContext';

export function FavoritesPage() {
  const navigate = useNavigate();
  const { recipes, toggleFavorite } = useRecipe();
  const favorites = recipes.filter((recipe) => recipe.isFavorite);

  return (
    <div className="min-h-screen bg-background-primary pb-20 md:pb-0">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">我的收藏</h1>
          <p className="text-gray-500 mt-1">共 {favorites.length} 道菜谱</p>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {favorites.map((recipe, index) => (
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <p className="text-gray-500 text-lg">还没有收藏</p>
            <p className="text-gray-400 text-sm mt-1">收藏你喜欢的菜谱，方便下次查看</p>
            <button
              onClick={() => navigate('/')}
              className="btn btn-primary mt-6"
            >
              发现菜谱
            </button>
          </div>
        )}
      </main>

      <MobileNav />
    </div>
  );
}
