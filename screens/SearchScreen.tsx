import React, { useState } from 'react';
import { Genre } from '../types';
import { SearchIcon } from '../components/Icons';

interface SearchScreenProps {
  onGenreClick: (genre: Genre | string) => void;
  onSearch: (term: string) => void;
}

const SearchScreen: React.FC<SearchScreenProps> = ({ onGenreClick, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const genres = Object.values(Genre);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="px-4 pb-24 h-full flex flex-col relative">
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {/* Top Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-8 mt-4">
          <button 
            onClick={() => onGenreClick('Top 1000 Albums')}
            className="aspect-[4/3] bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 flex items-center justify-center p-4 hover:scale-[1.02] transition duration-200"
          >
            <span className="text-center font-bold text-gray-900 text-lg font-serif italic">Top 1000<br/>Albums</span>
          </button>
          <button 
            onClick={() => onGenreClick('Top 1000 Artists')}
            className="aspect-[4/3] bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 flex items-center justify-center p-4 hover:scale-[1.02] transition duration-200"
          >
            <span className="text-center font-bold text-gray-900 text-lg font-serif italic">Top 1000<br/>Artists</span>
          </button>
        </div>

        {/* Genres Grid */}
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-4 font-serif italic text-black">Genres</h3>
          <div className="grid grid-cols-2 gap-3">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => onGenreClick(genre)}
                className="h-16 bg-white/40 backdrop-blur-md rounded-xl shadow-sm border border-white/40 flex items-center justify-center p-2 hover:bg-white/60 transition"
              >
                <span className="font-semibold text-gray-800 text-sm">{genre}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Search Bar */}
      <div className="absolute bottom-24 left-4 right-4 z-10">
         <form onSubmit={handleSearchSubmit} className="relative group">
            <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <input 
              type="text" 
              placeholder="Search artists, albums, members..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-14 pl-12 pr-4 rounded-full bg-white/90 backdrop-blur-xl shadow-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black border border-white/50"
            />
            <SearchIcon className="absolute left-4 top-4 text-gray-400 w-6 h-6" />
         </form>
      </div>
    </div>
  );
};

export default SearchScreen;