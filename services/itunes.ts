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

// Base URL for static assets (required for GitHub Pages when base is e.g. '/noted/')
const ASSET_BASE = import.meta.env.BASE_URL;

const asset = (filename: string) => `${ASSET_BASE}${filename.replace(/^\//, '')}`;

// Hardcoded artwork for trending albums (local images in public/)
const TRENDING_ARTWORK = {
  fallOff: asset("fall-off.jpg"),
  Joji: asset("joji.jpg"),
  Mayhem: asset("mayhem.jpg"),
} as const;

// Hardcoded artwork for Best of 2025 (local images in public/)
const TOP_YEAR_ARTWORK = {
  gettingKilled: asset("Geese_-_Getting_Killed.jpg"),
  revengeseekerz: asset("Jane_remover_revengeseekerz.jpg"),
} as const;

export const fetchTrendingAlbums = async (): Promise<Album[]> => {
  return fetchSpecificAlbums([
    { 
        query: "The Fall-Off J. Cole", 
        fallback: "J. Cole",
        forcedTitle: "The Fall-Off",
        forcedArtist: "J. Cole",
        forcedDate: "2026-02-06",
        forcedGenre: "Hip-Hop/Rap",
        forcedArtwork: TRENDING_ARTWORK.fallOff
    },
    { 
        query: "Piss In The Wind Joji", 
        fallback: "Joji",
        forcedTitle: "Piss In The Wind",
        forcedArtist: "Joji",
        forcedDate: "2026-02-06",
        forcedGenre: "Pop",
        forcedArtwork: TRENDING_ARTWORK.Joji
    }, 
    { 
        query: "Liturgy of Death Mayhem", 
        fallback: "Mayhem",
        forcedTitle: "Liturgy of Death",
        forcedArtist: "Mayhem",
        forcedDate: "2026-02-06",
        forcedGenre: "Hip-Hop/Rap",
        forcedArtwork: TRENDING_ARTWORK.Mayhem
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
        query: "Getting Killed Geese", 
        fallback: "3D Country Geese",
        forcedTitle: "Getting Killed", 
        forcedArtist: "Geese",
        forcedDate: "2025-03-10",
        forcedGenre: "Alternative/Rock",
        forcedArtwork: TOP_YEAR_ARTWORK.gettingKilled
    },
    { 
        query: "Revengeseekerz Jane Remover", 
        fallback: "Census Designated Jane Remover",
        forcedTitle: "Revengeseekerz",
        forcedArtist: "Jane Remover",
        forcedDate: "2025-04-12",
        forcedGenre: "Shoegaze",
        forcedArtwork: TOP_YEAR_ARTWORK.revengeseekerz
    }
  ]);
};