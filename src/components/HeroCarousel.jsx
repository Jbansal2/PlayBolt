import { useState, useEffect, useRef } from 'react';
import { Play, Star, ChevronLeft, ChevronRight, Pause } from 'lucide-react';
import { GamesAPI } from '../lib/games-api';
import { Link } from 'react-router-dom';

export function HeroCarousel({ games }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [gamesWithVideos, setGamesWithVideos] = useState([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);
  const videoRef = useRef(null);
  const intervalRef = useRef();

  // Fetch videos for games
  useEffect(() => {
    const fetchGameVideos = async () => {
      if (!games || games.length === 0) return;

      setIsLoadingVideos(true);
      
      // Process first 3 games to reduce API load
      const gamesToProcess = games.slice(0, 3);
      
      // First, add all games without videos to avoid blocking UI
      const gamesWithVideoData = gamesToProcess.map(game => ({
        ...game,
        hasVideo: false
      }));
      
      setGamesWithVideos(gamesWithVideoData);
      setIsLoadingVideos(false);

      // Video fetching disabled for stability - use static images only
      console.log('Video fetching disabled for HeroCarousel - using static images');
    };

    fetchGameVideos();
  }, [games]);

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoPlay || gamesWithVideos.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === gamesWithVideos.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000); // Change slide every 6 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlay, gamesWithVideos.length]);

  // Handle video events
  useEffect(() => {
    const currentGame = gamesWithVideos[currentIndex];
    if (currentGame?.hasVideo && videoRef.current) {
      videoRef.current.currentTime = 0;
      if (isAutoPlay) {
        videoRef.current.play().catch(() => {
          // If autoplay fails, that's okay
        });
      }
    }
  }, [currentIndex, isAutoPlay]);

  const handlePrevious = () => {
    setCurrentIndex(currentIndex === 0 ? gamesWithVideos.length - 1 : currentIndex - 1);
    setIsAutoPlay(false);
  };

  const handleNext = () => {
    setCurrentIndex(currentIndex === gamesWithVideos.length - 1 ? 0 : currentIndex + 1);
    setIsAutoPlay(false);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  if (isLoadingVideos || gamesWithVideos.length === 0) {
    return (
      <section className="relative bg-gradient-to-r from-background via-background/90 to-background min-h-[80vh] flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="animate-pulse">
              <div className="h-12 bg-muted rounded mb-4"></div>
              <div className="h-6 bg-muted rounded mb-6 w-3/4"></div>
              <div className="h-10 bg-muted rounded w-32"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentGame = gamesWithVideos[currentIndex];
  const primaryGenre = currentGame.genres?.[0]?.name || 'Unknown';
  const primaryDeveloper = currentGame.developers?.[0]?.name || 'Unknown';
  const primaryPublisher = currentGame.publishers?.[0]?.name || 'Unknown';
  const primaryPlatform = currentGame.platforms?.[0]?.platform?.name || 'PC';
  const starRating = Math.round(currentGame.rating);

  return (
    <section className="relative min-h-[60vh] sm:min-h-[70vh] lg:min-h-[80vh] flex items-center overflow-hidden">
      {/* Background Media (Video or Image) */}
      <div className="absolute inset-0 z-0">
        {currentGame.hasVideo && currentGame.video ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            poster={currentGame.background_image || '/placeholder.svg'}
            muted
            loop
            playsInline
          >
            <source src={currentGame.video.data.max} type="video/mp4" />
            <source src={currentGame.video.data["480"]} type="video/mp4" />
          </video>
        ) : (
          <img
            src={currentGame.background_image || '/placeholder.svg'}
            alt={currentGame.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent"></div>
      </div>

      {/* Navigation Controls */}
      <button
        onClick={handlePrevious}
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 sm:p-3 transition-all duration-300 hover:scale-110"
      >
        <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 sm:p-3 transition-all duration-300 hover:scale-110"
      >
        <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
      </button>

      {/* Auto-play Control */}
      <button
        onClick={toggleAutoPlay}
        className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 sm:p-2 transition-all duration-300"
      >
        {isAutoPlay ? <Pause className="h-3 w-3 sm:h-4 sm:w-4" /> : <Play className="h-3 w-3 sm:h-4 sm:w-4" />}
      </button>

      {/* Media Type Indicator */}
      {currentGame.hasVideo && (
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-20 bg-primary/80 text-primary-foreground px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium flex items-center space-x-1">
          <Play className="h-2 w-2 sm:h-3 sm:w-3" />
          <span className="hidden sm:inline">Video</span>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-full sm:max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
            <span className="bg-primary text-primary-foreground px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium">
              {primaryGenre}
            </span>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 sm:h-4 sm:w-4 ${i < starRating ? 'text-yellow-400 fill-current' : 'text-muted-foreground'}`}
                />
              ))}
              <span className="text-xs sm:text-sm text-muted-foreground ml-1 sm:ml-2">
                {currentGame.rating.toFixed(1)}
              </span>
            </div>
            {currentGame.metacritic && (
              <div className="bg-primary/20 text-primary px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs sm:text-sm font-bold">
                {currentGame.metacritic}
              </div>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold text-foreground mb-3 sm:mb-6 leading-tight">
            {currentGame.name}
          </h1>

          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            {currentGame.description_raw || `Released: ${currentGame.released}`}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link
              to={`/game/${currentGame.id}`}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-primary/90 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Play className="h-5 w-5" />
              <span>View Details</span>
            </Link>
            <button 
              className="border border-border text-foreground px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-muted hover:scale-105"
              onClick={() => window.open(currentGame.website || `https://rawg.io/games/${currentGame.slug}`, '_blank')}
            >
              Official Site
            </button>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div>
              <span className="font-medium text-foreground">Developer:</span> {primaryDeveloper}
            </div>
            <div>
              <span className="font-medium text-foreground">Publisher:</span> {primaryPublisher}
            </div>
            <div>
              <span className="font-medium text-foreground">Platform:</span> {primaryPlatform}
            </div>
            {currentGame.released && (
              <div>
                <span className="font-medium text-foreground">Released:</span> {currentGame.released}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {gamesWithVideos.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setIsAutoPlay(false);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-primary' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
