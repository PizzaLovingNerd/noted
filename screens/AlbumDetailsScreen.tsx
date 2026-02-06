import React, { useState } from 'react';
import { Album, Review } from '../types';
import { ArrowLeftIcon, PlusIcon } from '../components/Icons';
import { StarRating } from '../components/StarRating';

interface AlbumDetailsScreenProps {
  album: Album;
  onBack: () => void;
  onWriteReview: (album: Album) => void;
  onReviewClick: (review: Review) => void;
}

const AlbumDetailsScreen: React.FC<AlbumDetailsScreenProps> = ({ album, onBack, onWriteReview, onReviewClick }) => {
  // Mock data for this screen
  const [reviews] = useState<Review[]>([
    {
      id: '101',
      album: album,
      title: 'A Masterpiece',
      content: 'I have listened to this 5 times today. The production is flawless.',
      rating: 5,
      author: 'Alex',
      date: '1d ago'
    },
    {
      id: '102',
      album: album,
      title: 'Solid but safe',
      content: 'It sounds good, but I feel like I have heard this before.',
      rating: 3,
      author: 'Sam',
      date: '2d ago'
    }
  ]);

  return (
    <div className="h-full flex flex-col pb-24">
      {/* Header Image Background */}
      <div className="relative h-72 w-full">
         <img src={album.artworkUrl600 || album.artworkUrl100} className="w-full h-full object-cover" alt="Cover" />
         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
         
         <div className="absolute top-4 left-4">
            <button onClick={onBack} className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white">
                <ArrowLeftIcon />
            </button>
         </div>

         <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-3xl font-bold text-white font-serif italic leading-tight mb-1 shadow-black drop-shadow-lg">{album.collectionName}</h1>
            <p className="text-gray-300 font-medium text-lg">{album.artistName}</p>
            <div className="flex items-center gap-2 mt-2">
                 <p className="text-xs text-gray-400 uppercase tracking-widest">{album.primaryGenreName}</p>
                 <span className="text-gray-600">•</span>
                 <p className="text-xs text-gray-400">{album.releaseDate?.substring(0,4)}</p>
            </div>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 -mt-4 relative z-10 rounded-t-3xl bg-gradient-to-b from-brand-surfaceFrom to-brand-surfaceTo pt-6 space-y-6">
        
        {/* Actions */}
        <div className="flex gap-4">
             <button 
                onClick={() => onWriteReview(album)}
                className="flex-1 bg-black text-white py-3 px-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
             >
                <PlusIcon className="w-5 h-5" />
                <span>Review</span>
             </button>
        </div>

        {/* Community Reviews */}
        <div>
           <h3 className="text-lg font-bold font-serif italic mb-3 text-black">Popular Reviews</h3>
           <div className="space-y-3">
              {reviews.map(review => (
                  <div 
                    key={review.id}
                    onClick={() => onReviewClick(review)}
                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
                  >
                      <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                             <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                             <span className="font-bold text-sm text-gray-800">{review.author}</span>
                          </div>
                          <StarRating rating={review.rating} readOnly size="sm" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm mb-1">{review.title}</h4>
                      <p className="text-xs text-gray-600 line-clamp-2">{review.content}</p>
                  </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumDetailsScreen;