import React, { useState } from 'react';
import { Album, Review } from '../types';
import { StarRating } from '../components/StarRating';
import { ArrowLeftIcon } from '../components/Icons';

interface WriteReviewScreenProps {
  album: Album;
  onPost: (review: Review) => void;
  onBack: () => void;
}

const WriteReviewScreen: React.FC<WriteReviewScreenProps> = ({ album, onPost, onBack }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    if (!title || !content || rating === 0) return;
    
    const newReview: Review = {
      id: Date.now().toString(),
      album: album,
      title,
      content,
      rating,
      author: 'username', // Current user
      date: 'Just now'
    };
    onPost(newReview);
  };

  return (
    <div className="h-full flex flex-col pb-20 px-4">
      {/* Header */}
      <div className="pt-2 pb-4 flex items-center justify-between">
         <button onClick={onBack} className="p-1 rounded-full hover:bg-black/5">
            <ArrowLeftIcon />
         </button>
         <h2 className="text-lg font-bold font-serif italic text-gray-800">Review</h2>
         <div className="w-6"></div> {/* Spacer for center alignment */}
      </div>

      {/* Main Form Area */}
      <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-sm overflow-hidden mb-4">
        <textarea
          className="flex-1 w-full p-4 resize-none focus:outline-none text-gray-800 text-lg placeholder-gray-400"
          placeholder="Write your review..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {/* Bottom Controls */}
      <div className="space-y-4">
        {/* Title Input */}
        <input 
          type="text"
          placeholder="Review Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full h-12 px-4 rounded-xl border-2 border-gray-300 bg-white/50 backdrop-blur-sm focus:outline-none focus:border-black font-semibold"
        />

        {/* Rating and Post */}
        <div className="flex items-center justify-between bg-white/50 backdrop-blur-sm p-3 rounded-xl border border-white/50">
          <StarRating rating={rating} setRating={setRating} size="lg" />
          <button 
            onClick={handleSubmit}
            disabled={!title || !content || rating === 0}
            className="bg-black text-white px-6 py-2 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition"
          >
            Post
          </button>
        </div>

        {/* Selected Album Info Card (Mini) */}
        <div className="flex items-center bg-white p-3 rounded-xl shadow-lg border border-gray-100">
           <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
             <img src={album.artworkUrl100} alt={album.collectionName} className="w-full h-full object-cover" />
           </div>
           <div className="ml-3 overflow-hidden">
             <p className="font-bold text-gray-900 text-sm truncate">{album.collectionName}</p>
             <p className="text-xs text-gray-500 truncate">{album.artistName}</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WriteReviewScreen;
