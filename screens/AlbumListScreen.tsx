import React, { useEffect, useState } from 'react';
import { Album } from '../types';
import { searchAlbums } from '../services/itunes';
import { ArrowLeftIcon, SearchIcon } from '../components/Icons';

interface AlbumListScreenProps {
  initialTitle: string;
  initialQuery?: string;
  onBack: () => void;
  onSelectAlbum: (album: Album) => void;
}

const AlbumListScreen: React.FC<AlbumListScreenProps> = ({ initialTitle, initialQuery, onBack, onSelectAlbum }) => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Function to perform search
  const doSearch = async (term: string) => {
    setLoading(true);
    const results = await searchAlbums(term, 20);
    setAlbums(results);
    setLoading(false);
  };

  useEffect(() => {
    // Initial load based on props
    const query = initialQuery === 'Top 1000 Albums' ? 'greatest albums' : 
                  initialQuery === 'Top 1000 Artists' ? 'best artists' : (initialQuery || initialTitle);
    
    // If it's a generic "Review Album" title (from Plus button), don't auto-search obscure terms, maybe just trending
    if (initialTitle === 'Review Album') {
        doSearch('new music');
    } else {
        doSearch(query);
    }
  }, [initialQuery, initialTitle]);

  const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (searchTerm.trim()) {
          doSearch(searchTerm);
      }
  };

  return (
    <div className="flex flex-col h-full pb-20">
      <div className="px-4 pt-2 pb-2">
         <div className="flex items-center mb-4">
            <button onClick={onBack} className="mr-3 p-2 rounded-full hover:bg-black/5 -ml-2">
                <ArrowLeftIcon />
            </button>
            <h2 className="text-2xl font-bold font-serif italic truncate text-black">{initialTitle}</h2>
         </div>

         {/* Search Input */}
         <form onSubmit={handleSearchSubmit} className="relative">
             <input 
                type="text" 
                placeholder="Search to review..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/60 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
             />
             <div className="absolute left-3 top-3 text-gray-400">
                <SearchIcon className="w-5 h-5" />
             </div>
         </form>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-3 no-scrollbar pb-24 pt-2">
        {loading ? (
           <div className="space-y-4 pt-2">
             {[1,2,3,4,5].map(i => (
                <div key={i} className="flex items-center space-x-4 animate-pulse">
                  <div className="w-16 h-16 bg-white/30 rounded-md"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/30 rounded w-3/4"></div>
                    <div className="h-3 bg-white/30 rounded w-1/2"></div>
                  </div>
                </div>
             ))}
           </div>
        ) : (
          albums.map((album) => (
            <div 
              key={album.collectionId} 
              className="flex items-center bg-white/60 backdrop-blur-sm p-3 rounded-xl border border-white/50 cursor-pointer hover:scale-[1.01] transition-transform shadow-sm"
              onClick={() => onSelectAlbum(album)}
            >
              <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0 shadow-sm">
                 <img src={album.artworkUrl100} alt={album.collectionName} className="w-full h-full object-cover" />
              </div>
              <div className="ml-4 min-w-0">
                <p className="font-bold text-gray-900 text-base truncate">{album.collectionName}</p>
                <p className="text-sm text-gray-600 truncate">{album.artistName}</p>
                {album.releaseDate && <p className="text-xs text-gray-400 mt-1">{album.releaseDate.substring(0, 4)}</p>}
              </div>
            </div>
          ))
        )}
        {albums.length === 0 && !loading && (
            <div className="text-center py-10 opacity-60">No albums found.</div>
        )}
      </div>
    </div>
  );
};

export default AlbumListScreen;