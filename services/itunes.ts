import { Album } from '../types';

const BASE_URL = 'https://itunes.apple.com/search';

// In-memory cache to prevent redundant network requests and rate limiting
const cache: Record<string, Album[]> = {};

interface SearchQuery {
    query: string;
    fallback?: string;
    forcedTitle?: string;
    forcedArtist?: string;
    forcedDate?: string;
    forcedGenre?: string;
    /** Hardcoded artwork URL (e.g. local image path) overrides iTunes artwork */
    forcedArtwork?: string;
}

export const searchAlbums = async (term: string, limit: number = 20): Promise<Album[]> => {
  // Return cached result if available
  if (cache[term]) {
      return cache[term];
  }

  const targetUrl = `${BASE_URL}?term=${encodeURIComponent(term)}&entity=album&limit=${limit}`;

  let data: any = null;

  // Helper to process raw iTunes results
  const processResults = (results: any[]) => {
      return results.map((item: any) => ({
        collectionId: item.collectionId,
        collectionName: item.collectionName,
        artistName: item.artistName,
        artworkUrl100: item.artworkUrl100?.replace('100x100bb', '400x400bb') || '', 
        artworkUrl600: item.artworkUrl100?.replace('100x100bb', '1000x1000bb') || '',
        primaryGenreName: item.primaryGenreName,
        releaseDate: item.releaseDate
      }));
  };

  try {
    // Attempt 1: Direct Fetch
    const response = await fetch(targetUrl);
    if (response.ok) {
        data = await response.json();
    } else {
        throw new Error('Direct fetch failed');
    }
  } catch (error) {
    // Attempt 2: AllOrigins (Often more reliable for iTunes JSON)
    try {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
        const response = await fetch(proxyUrl);
        if (response.ok) {
            data = await response.json();
        } else {
             throw new Error('Proxy 1 failed');
        }
    } catch (proxyError) {
        // Attempt 3: CorsProxy.io
        try {
            const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
            const response = await fetch(proxyUrl);
            if (response.ok) {
                data = await response.json();
            } else {
                throw new Error('Proxy 2 failed');
            }
        } catch (finalError) {
            console.error(`All fetch attempts failed for '${term}'`);
            return [];
        }
    }
  }

  if (data && data.results) {
      const results = processResults(data.results);
      if (results.length > 0) {
        cache[term] = results;
      }
      return results;
  }

  return [];
};

export const fetchSpecificAlbums = async (queries: (string | SearchQuery)[]): Promise<Album[]> => {
  const promises = queries.map(async (item) => {
    const config = typeof item === 'string' ? { query: item } : item;
    
    // 1. Try primary query
    let results = await searchAlbums(config.query, 1);
    
    // 2. Try fallback if no results
    if (results.length === 0 && config.fallback) {
       results = await searchAlbums(config.fallback, 1);
    }

    if (results.length > 0) {
        const album = { ...results[0] }; // Clone to avoid mutating cache if we used it
        // Override metadata
        if (config.forcedTitle) album.collectionName = config.forcedTitle;
        if (config.forcedArtist) album.artistName = config.forcedArtist;
        if (config.forcedDate) album.releaseDate = config.forcedDate;
        if (config.forcedGenre) album.primaryGenreName = config.forcedGenre;
        if (config.forcedArtwork) {
            album.artworkUrl100 = config.forcedArtwork;
            album.artworkUrl600 = config.forcedArtwork;
        }
        return album;
    }
    return null;
  });

  const results = await Promise.all(promises);
  return results.filter((album): album is Album => album !== null);
};

// Hardcoded artwork for trending albums (local images in project)
const TRENDING_ARTWORK = {
  dontBeDumb: "/A$AP_Rocky_-_Don't_Be_Dumb.png",
  octane: "/Don_Toliver_-_Octane_cover.png",
  xavier: "/Xavier_album_cover.jpg",
} as const;

export const fetchTrendingAlbums = async (): Promise<Album[]> => {
  return fetchSpecificAlbums([
    { 
        query: "Don't Be Dumb ASAP Rocky", 
        fallback: "A$AP Rocky",
        forcedTitle: "Don't Be Dumb",
        forcedArtist: "A$AP Rocky",
        forcedDate: "2025-02-20",
        forcedGenre: "Hip-Hop/Rap",
        forcedArtwork: TRENDING_ARTWORK.dontBeDumb
    },
    { 
        query: "OCTANE Don Toliver", 
        fallback: "Heaven or Hell Don Toliver",
        forcedTitle: "OCTANE",
        forcedArtist: "Don Toliver",
        forcedDate: "2025-02-18",
        forcedGenre: "Hip-Hop/Rap",
        forcedArtwork: TRENDING_ARTWORK.octane
    }, 
    { 
        query: "Xavier xaviersobased", 
        fallback: "Xavier wulf",
        forcedTitle: "Xavier",
        forcedArtist: "xaviersobased",
        forcedDate: "2025-01-15",
        forcedGenre: "Hip-Hop/Rap",
        forcedArtwork: TRENDING_ARTWORK.xavier
    }
  ]);
};

export const fetchTopYearAlbums = async (): Promise<Album[]> => {
  return fetchSpecificAlbums([
    { 
        query: "Let God Sort Em Out", 
        fallback: "Hell Hath No Fury Clipse",
        forcedTitle: "Let God Sort Em Out",
        forcedArtist: "Clipse",
        forcedDate: "2025-05-01",
        forcedGenre: "Hip-Hop/Rap"
    },
    { 
        // Use Projector album art for Geese
        query: "Getting Killed Geese", 
        fallback: "3D Country Geese",
        forcedTitle: "Getting Killed", 
        forcedArtist: "Geese",
        forcedDate: "2025-03-10",
        forcedGenre: "Alternative/Rock"
    },
    { 
        query: "Revengeseekerz Jane Remover", 
        fallback: "Census Designated Jane Remover",
        forcedTitle: "Revengeseekerz",
        forcedArtist: "Jane Remover",
        forcedDate: "2025-04-12",
        forcedGenre: "Shoegaze"
    }
  ]);
};