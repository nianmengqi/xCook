import React from 'react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showValue?: boolean;
  reviewCount?: number;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  showValue = false,
  reviewCount,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = (index: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(index);
    }
  };

  const handleMouseEnter = (index: number) => {
    if (interactive) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: maxRating }, (_, index) => {
          const starIndex = index + 1;
          const isFilled = starIndex <= displayRating;
          const isHalf = !isFilled && starIndex - 0.5 <= displayRating;

          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => handleClick(starIndex)}
              onMouseEnter={() => handleMouseEnter(starIndex)}
              onMouseLeave={handleMouseLeave}
              className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            >
              <svg
                className={`${sizeClasses[size]} ${isFilled ? 'text-yellow-400' : isHalf ? 'text-yellow-400' : 'text-gray-300'}`}
                fill={isFilled ? 'currentColor' : isHalf ? 'url(#half)' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isHalf && (
                  <defs>
                    <linearGradient id="half">
                      <stop offset="50%" stopColor="currentColor" />
                      <stop offset="50%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                )}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={isFilled || isHalf ? 0 : 1.5}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </button>
          );
        })}
      </div>
      
      {showValue && (
        <span className="text-sm text-gray-600 ml-1">
          {rating.toFixed(1)}
          {reviewCount !== undefined && (
            <span className="text-gray-400"> ({reviewCount})</span>
          )}
        </span>
      )}
    </div>
  );
}

// 只读评分显示组件
export function RatingDisplay({ 
  rating, 
  reviewCount,
  size = 'sm' 
}: { 
  rating: number; 
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <StarRating 
      rating={rating} 
      size={size}
      showValue={true}
      reviewCount={reviewCount}
    />
  );
}

// 交互式评分组件
export function RatingInput({ 
  value, 
  onChange,
  size = 'lg'
}: { 
  value: number; 
  onChange: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <StarRating 
      rating={value}
      size={size}
      interactive={true}
      onRatingChange={onChange}
    />
  );
}
