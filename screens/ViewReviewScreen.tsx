import React from 'react';
import { Review } from '../types';
import { StarRating } from '../components/StarRating';
import { ArrowLeftIcon } from '../components/Icons';

interface ViewReviewScreenProps {
  review: Review;
  onBack: () => void;
}

const ViewReviewScreen: React.FC<ViewReviewScreenProps> = ({ review, onBack }) => {
  return (
    <div className="h-full flex flex-col pb-24 px-6 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
         <div className="flex items-center gap-3">
             <button onClick={onBack} className="p-2 rounded-full hover:bg-black/5 -ml-2">
                <ArrowLeftIcon className="w-6 h-6" />
             </button>
         </div>
         <div className="flex items-center gap-2 bg-white/40 px-3 py-1 rounded-full border border-white/20">
           <span className="font-bold text-sm text-black">{review.author}</span>
           <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white text-xs">
             {review.author.charAt(0)}
           </div>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
        {/* Review Title */}
        <div>
           <h2 className="text-3xl font-bold text-black mb-2 leading-tight">{review.title}</h2>
           <p className="text-gray-700 font-medium text-sm border-l-2 border-black pl-3">Review by {review.author}</p>
        </div>

        {/* Rating */}
        <div className="py-2">
           <StarRating rating={review.rating} readOnly size="lg" />
        </div>

        {/* Content */}
        <div className="prose prose-lg text-gray-900 leading-relaxed font-medium">
           {review.content.split('\n').map((line, i) => (
             <p key={i} className="mb-4 min-h-[1rem]">{line}</p>
           ))}
        </div>
      </div>

      {/* Album Card Sticky Bottom */}
      <div className="mt-4 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/50 flex items-center transform transition-transform hover:scale-[1.02] cursor-pointer">
         <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
            <img src={review.album.artworkUrl100} alt={review.album.collectionName} className="w-full h-full object-cover" />
         </div>
         <div className="ml-4 min-w-0 flex-1">
             <p className="font-bold text-gray-900 text-base truncate">{review.album.collectionName}</p>
             <p className="text-sm text-gray-600 truncate">{review.album.artistName}</p>
             {review.album.releaseDate && (
                <p className="text-xs text-gray-400 mt-1 font-mono">{new Date(review.album.releaseDate).getFullYear()}</p>
             )}
         </div>
      </div>
    </div>
  );
};

export default ViewReviewScreen;