import React from 'react';
import { StarIcon } from './Icons';

interface StarRatingProps {
  rating: number;
  setRating?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, setRating, readOnly = false, size = 'md' }) => {
  const stars = [1, 2, 3, 4, 5];
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex gap-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && setRating && setRating(star)}
          className={`${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'}`}
        >
          <StarIcon 
            filled={star <= rating} 
            className={`${sizeClasses[size]} ${star <= rating ? 'text-[#FFD700]' : 'text-gray-600'}`} 
          />
        </button>
      ))}
    </div>
  );
};