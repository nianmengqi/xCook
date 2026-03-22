import React from 'react';
import { Card, CardImage, CardContent, CardFooter } from '../common/Card';
import { Recipe, DIFFICULTY_LABELS } from '../../types';
import { formatTime } from '../../utils';

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  onFavoriteClick?: () => void;
}

export function RecipeCard({ recipe, onClick, onFavoriteClick }: RecipeCardProps) {
  const rating = recipe.rating || 0;
  const ratingCount = recipe.ratingCount || 0;

  return (
    <Card hover onClick={onClick} className="animate-fadeIn">
      <div className="relative">
        <CardImage 
          src={recipe.coverImage || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800'} 
          alt={recipe.title}
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteClick?.();
          }}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all hover:scale-110"
        >
          <svg 
            className={`w-5 h-5 ${recipe.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        <div className="absolute bottom-2 left-2 flex gap-1">
          <span className="px-2 py-1 bg-black/60 text-white text-xs rounded-full">
            {DIFFICULTY_LABELS[recipe.difficulty]}
          </span>
          {rating > 0 && (
            <span className="px-2 py-1 bg-yellow-500/80 text-white text-xs rounded-full flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
      <CardContent className="p-3">
        <h3 className="font-semibold text-gray-900 truncate">{recipe.title}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{recipe.description}</p>
      </CardContent>
      <CardFooter className="px-3 py-2">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatTime(recipe.prepTime + recipe.cookTime)}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {recipe.servings}人份
          </span>
          {ratingCount > 0 && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {ratingCount}评价
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
