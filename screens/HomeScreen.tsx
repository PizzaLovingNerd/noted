import React, { useEffect, useState } from "react";
import { Album, Review } from "../types";
import { fetchTrendingAlbums, fetchTopYearAlbums } from "../services/itunes";
import { StarRating } from "../components/StarRating";

interface HomeScreenProps {
  onAlbumClick: (album: Album) => void;
  onReviewClick: (review: Review) => void;
}

const AlbumCard = ({
  album,
  onClick,
}: {
  album: Album;
  onClick: (album: Album) => void;
}) => (
  <div
    className="flex-shrink-0 w-36 mr-4 cursor-pointer hover:opacity-90 transition-opacity"
    onClick={() => onClick(album)}
  >
    <div className="w-36 h-36 bg-gray-200 rounded-lg overflow-hidden shadow-lg mb-2 relative group border border-black/5">
      {album.artworkUrl100 ? (
        <img
          src={album.artworkUrl100}
          alt={album.collectionName}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500 text-xs">
          No Cover
        </div>
      )}
    </div>
    <p className="text-sm font-bold truncate text-gray-900 leading-tight">
      {album.collectionName}
    </p>
    <p className="text-xs text-gray-600 truncate">{album.artistName}</p>
  </div>
);

const HomeScreen: React.FC<HomeScreenProps> = ({
  onAlbumClick,
  onReviewClick,
}) => {
  const [trending, setTrending] = useState<Album[]>([]);
  const [topYear, setTopYear] = useState<Album[]>([]);
  const [friendReviews, setFriendReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const [trendingData, topData] = await Promise.all([
          fetchTrendingAlbums(),
          fetchTopYearAlbums(),
        ]);

        if (mounted) {
          setTrending(trendingData);
          setTopYear(topData);

          // Mock friend reviews based on fetched data
          if (trendingData.length > 0) {
            setFriendReviews([
              {
                id: "1",
                album: trendingData[0],
                title: "Worth the wait",
                content:
                  "The production on this is absolutely insane. Layers upon layers.",
                rating: 5,
                author: "Tyler",
                date: "2h ago",
              },
              {
                id: "2",
                album: topData[0] || trendingData[0], // Fallback if topData empty
                title: "Classic status",
                content:
                  "I did not expect this level of lyricism in 2025. Unmatched.",
                rating: 4,
                author: "Sarah",
                date: "5h ago",
              },
              {
                id: "3",
                album: topData[1] || trendingData[1] || trendingData[0],
                title: "A mood",
                content: "Perfect for late night drives.",
                rating: 4,
                author: "GoatedTravisScott",
                date: "1d ago",
              },
            ]);
          }
          setLoading(false);
        }
      } catch (e) {
        console.error("Home load failed", e);
        if (mounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-8 pb-32 pt-2">
      {/* Trending Section */}
      <section>
        <h2 className="text-xl font-bold px-4 mb-4 font-serif italic text-black">
          Trending Albums
        </h2>
        <div className="flex overflow-x-auto px-4 pb-2 no-scrollbar">
          {loading && trending.length === 0
            ? [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-36 h-36 bg-gray-200 rounded-lg mr-4 flex-shrink-0 animate-pulse"
                />
              ))
            : trending.map((album, idx) => (
                <AlbumCard
                  key={`${album.collectionId}-${idx}`}
                  album={album}
                  onClick={onAlbumClick}
                />
              ))}
        </div>
      </section>

      {/* Best of 2025 Section */}
      <section>
        <h2 className="text-xl font-bold px-4 mb-4 font-serif italic text-black">
          Best of 2025
        </h2>
        <div className="flex overflow-x-auto px-4 pb-2 no-scrollbar">
          {loading && topYear.length === 0
            ? [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-36 h-36 bg-gray-200 rounded-lg mr-4 flex-shrink-0 animate-pulse"
                />
              ))
            : topYear.map((album, idx) => (
                <AlbumCard
                  key={`${album.collectionId}-${idx}`}
                  album={album}
                  onClick={onAlbumClick}
                />
              ))}
        </div>
      </section>

      {/* Friend Reviews Section */}
      <section className="px-4">
        <h2 className="text-xl font-bold mb-4 font-serif italic text-black">
          Friend Reviews
        </h2>
        <div className="space-y-4">
          {friendReviews.map((review, idx) => (
            <div
              key={`${review.id}-${idx}`}
              className="flex items-start bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-white/50 cursor-pointer hover:bg-white/80 transition-colors"
              onClick={() => onReviewClick(review)}
            >
              <div className="w-16 h-16 bg-gray-300 rounded-md overflow-hidden flex-shrink-0 shadow-sm border border-black/5">
                {review.album.artworkUrl100 && (
                  <img
                    src={review.album.artworkUrl100}
                    alt={review.album.collectionName}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {review.author}
                  </p>
                  <p className="text-xs text-gray-500">{review.date}</p>
                </div>
                <div className="flex text-xs my-1">
                  <StarRating rating={review.rating} readOnly size="sm" />
                </div>
                <p className="text-xs font-bold text-gray-800 truncate">
                  {review.album.collectionName}
                </p>
                <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                  {review.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;
