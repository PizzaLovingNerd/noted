import React, { useState, useEffect } from "react";
import { ScreenName, Album, Review } from "./types";
import HomeScreen from "./screens/HomeScreen";
import SearchScreen from "./screens/SearchScreen";
import AlbumListScreen from "./screens/AlbumListScreen";
import WriteReviewScreen from "./screens/WriteReviewScreen";
import ViewReviewScreen from "./screens/ViewReviewScreen";
import AlbumDetailsScreen from "./screens/AlbumDetailsScreen";
import {
  HomeIcon,
  SearchIcon,
  PlusIcon,
  UserIcon,
  ArrowLeftIcon,
} from "./components/Icons";
import { fetchSpecificAlbums } from "./services/itunes";

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>("home");
  const [history, setHistory] = useState<ScreenName[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [searchContext, setSearchContext] = useState<{
    title: string;
    query?: string;
  }>({ title: "Top Albums" });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Profile Data state
  const [myReviews, setMyReviews] = useState<Review[]>([]);

  useEffect(() => {
    const loadMyReviews = async () => {
      try {
        const albums = await fetchSpecificAlbums([
          { query: "A$AP Rocky", forcedTitle: "Don't Be Dumb" },
          { query: "Clipse", forcedTitle: "Let God Sort Em Out" },
          { query: "My Beautiful Dark Twisted Fantasy" }, // Simplified query for reliability
        ]);

        const aiReviews = [
          {
            title: "Worth the wait",
            content:
              "The experimental production on this album pushes the boundaries of the genre. Rocky creates a psychedelic soundscape that feels both nostalgic and futuristic.",
            rating: 4,
          },
          {
            title: "The reunion we needed",
            content:
              "Pusha T and Malice sound hungrier than ever. The beats are gritty, the flows are impeccable, and the chemistry is undeniable.",
            rating: 5,
          },
          {
            title: "A defining moment",
            content:
              "Maximalist production at its finest. Every track feels like a movie. The features are perfectly utilized.",
            rating: 5,
          },
        ];

        const reviews: Review[] = albums.map((album, index) => ({
          id: `my-${index}`,
          album: album,
          title: aiReviews[index]?.title || "Review",
          content: aiReviews[index]?.content || "Content",
          rating: aiReviews[index]?.rating || 3,
          author: "Cameron",
          date: "1d ago",
        }));
        setMyReviews(reviews);
      } catch (e) {
        console.error("Failed to load profile reviews", e);
      }
    };
    loadMyReviews();
  }, []);

  const navigateTo = (screen: ScreenName) => {
    setHistory((prev) => [...prev, currentScreen]);
    setCurrentScreen(screen);
    setIsMenuOpen(false);
  };

  const goBack = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((prevHist) => prevHist.slice(0, -1));
    setCurrentScreen(prev);
  };

  // Nav Handlers
  const handleHomeClick = () => {
    setHistory([]);
    setCurrentScreen("home");
    setIsMenuOpen(false);
  };

  const handleSearchClick = () => {
    if (currentScreen !== "search") navigateTo("search");
  };

  const handlePlusClick = () => {
    setSearchContext({ title: "Review Album", query: "recent albums" });
    navigateTo("albumList");
  };

  // Screen interaction handlers
  const handleAlbumClick = (album: Album) => {
    setSelectedAlbum(album);
    navigateTo("albumDetails");
  };

  const handleWriteReview = (album: Album) => {
    setSelectedAlbum(album);
    navigateTo("writeReview");
  };

  const handleReviewClick = (review: Review) => {
    setSelectedReview(review);
    navigateTo("viewReview");
  };

  const handleGenreClick = (genre: string) => {
    setSearchContext({ title: genre, query: genre });
    navigateTo("albumList");
  };

  const handleSearchSubmit = (term: string) => {
    setSearchContext({ title: `"${term}"`, query: term });
    navigateTo("albumList");
  };

  const handlePostReview = (review: Review) => {
    setMyReviews((prev) => [review, ...prev]);
    setSelectedReview(review);
    navigateTo("viewReview");
  };

  // Render content based on screen
  const renderContent = () => {
    switch (currentScreen) {
      case "home":
        return (
          <HomeScreen
            onAlbumClick={handleAlbumClick}
            onReviewClick={handleReviewClick}
          />
        );
      case "search":
        return (
          <SearchScreen
            onGenreClick={handleGenreClick}
            onSearch={handleSearchSubmit}
          />
        );
      case "albumList":
        return (
          <AlbumListScreen
            initialTitle={searchContext.title}
            initialQuery={searchContext.query}
            onBack={goBack}
            onSelectAlbum={handleAlbumClick}
          />
        );
      case "albumDetails":
        return selectedAlbum ? (
          <AlbumDetailsScreen
            album={selectedAlbum}
            onBack={goBack}
            onWriteReview={handleWriteReview}
            onReviewClick={handleReviewClick}
          />
        ) : (
          <div>Error</div>
        );
      case "writeReview":
        return selectedAlbum ? (
          <WriteReviewScreen
            album={selectedAlbum}
            onPost={handlePostReview}
            onBack={goBack}
          />
        ) : (
          <div>Error: No album selected</div>
        );
      case "viewReview":
        return selectedReview ? (
          <ViewReviewScreen review={selectedReview} onBack={goBack} />
        ) : (
          <div>Error: No review selected</div>
        );
      case "profile":
        // Inline Profile Screen for simplicity
        return (
          <div className="px-4 pb-24 pt-4">
            <div className="flex items-center mb-6">
              <button onClick={goBack} className="mr-3">
                <ArrowLeftIcon />
              </button>
              <h2 className="text-2xl font-bold font-serif italic text-black">
                My Reviews
              </h2>
            </div>
            <div className="space-y-4">
              {myReviews.map((review) => (
                <div
                  key={review.id}
                  className="flex items-start bg-white p-3 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => handleReviewClick(review)}
                >
                  <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0 shadow-sm border border-gray-100">
                    <img
                      src={review.album.artworkUrl100}
                      alt={review.album.collectionName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm truncate">
                      {review.album.collectionName}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-yellow-500 mb-1">
                      <span className="font-bold text-black mr-1">
                        {review.rating}.0
                      </span>
                      {"★".repeat(review.rating)}
                      <span className="text-gray-300">
                        {"★".repeat(5 - review.rating)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {review.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <HomeScreen
            onAlbumClick={handleAlbumClick}
            onReviewClick={handleReviewClick}
          />
        );
    }
  };

  const showBottomNav = true;

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#DCEFFB] flex justify-center items-center font-sans sm:bg-black">
      {/* Mobile Container: full-bleed on phone, card on larger screens */}
      <div className="w-full max-w-md h-[100dvh] max-h-[100dvh] bg-[#DCEFFB] relative overflow-hidden shadow-2xl sm:rounded-3xl sm:h-[850px] flex flex-col">
        {/* Top Header */}
        {(currentScreen === "home" || currentScreen === "search") && (
          <header className="px-5 pt-8 pb-2 flex justify-between items-center z-10 relative pt-[max(2rem,env(safe-area-inset-top))]">
            <img
              src={`${import.meta.env.BASE_URL}logo.png`}
              alt="Noted"
              className="h-10 w-auto cursor-pointer object-contain"
              onClick={handleHomeClick}
            />
            <div
              className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="font-medium text-sm text-black/80">Cameron</span>
              <div className="bg-black text-white p-1.5 rounded-full">
                <UserIcon className="w-6 h-6" />
              </div>
            </div>
          </header>
        )}

        {/* Menu Dropdown */}
        {isMenuOpen && (
          <>
            <div
              className="absolute inset-0 z-40 bg-transparent"
              onClick={() => setIsMenuOpen(false)}
            />
            <div
              className="absolute top-20 right-5 z-50 bg-white shadow-xl p-2 rounded-2xl w-48 transform transition-all scale-100 border border-gray-100 origin-top-right flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-3 py-2 border-b border-gray-100 mb-1">
                <h2 className="text-lg font-bold font-serif italic">Menu</h2>
              </div>

              <button
                className="text-left px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => navigateTo("profile")}
              >
                My Reviews
              </button>
              <button className="text-left px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 rounded-lg transition-colors">
                Account Settings
              </button>

              <div className="border-t border-gray-100 mt-2 pt-2 pb-1 text-[10px] text-gray-400 text-center">
                Noted App v0.2
              </div>
            </div>
          </>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto no-scrollbar relative z-0">
          {renderContent()}
        </main>

        {/* Bottom Navigation */}
        {showBottomNav && (
          <nav className="absolute bottom-0 left-0 right-0 min-h-[5rem] pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-white border-t border-gray-100 flex items-center justify-between px-10 z-20">
            <button
              onClick={handleHomeClick}
              className="p-2 flex flex-col items-center gap-1 group"
            >
              <HomeIcon
                className={`w-7 h-7 ${currentScreen === "home" ? "text-black stroke-[2.5px]" : "text-gray-400 group-hover:text-black"}`}
              />
            </button>

            {/* Center Plus Button */}
            <button
              onClick={handlePlusClick}
              className="p-2 group hover:scale-110 transition-transform flex items-center justify-center"
            >
              <PlusIcon className="w-10 h-10 text-gray-400 group-hover:text-black stroke-[2.5px] transition-colors" />
            </button>

            <button
              onClick={handleSearchClick}
              className="p-2 flex flex-col items-center gap-1 group"
            >
              <SearchIcon
                className={`w-7 h-7 ${currentScreen === "search" ? "text-black stroke-[3px]" : "text-gray-400 group-hover:text-black"}`}
              />
            </button>
          </nav>
        )}
      </div>
    </div>
  );
};

export default App;
