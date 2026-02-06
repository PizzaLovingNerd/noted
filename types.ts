export interface Album {
  collectionId: number;
  collectionName: string;
  artistName: string;
  artworkUrl100: string; // 100x100
  artworkUrl600?: string; // High res
  primaryGenreName?: string;
  releaseDate?: string;
}

export interface Review {
  id: string;
  album: Album;
  title: string;
  content: string;
  rating: number; // 0-5
  author: string;
  date: string;
}

export type ScreenName = 'home' | 'search' | 'albumList' | 'writeReview' | 'viewReview' | 'albumDetails' | 'profile';

export enum Genre {
  Pop = 'Pop',
  HipHop = 'Hip Hop / Rap',
  Country = 'Country',
  Alternative = 'Alternative',
  RnB = 'R&B',
  Electronic = 'Electronic',
  Rock = 'Rock',
  Jazz = 'Jazz',
  Indie = 'Indie',
  Soul = 'Soul',
  Metal = 'Metal',
  Classical = 'Classical'
}