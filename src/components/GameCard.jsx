import { cn } from '../lib/utils';
import { Star, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { GamesAPI } from '../lib/games-api';

export function GameCard({ game, className }) {
  const [video, setVideo] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const videoRef = useRef(null);
  const hoverTimeoutRef = useRef();

  const primaryGenre = game.genres?.[0]?.name || 'Unknown';
  const primaryPlatform = game.platforms?.[0]?.platform?.name || 'PC';
  const primaryDeveloper = game.developers?.[0]?.name || 'Unknown';

  // Disable video fetching to prevent API errors - use images only
  useEffect(() => {
    // Videos are disabled for stability - always use static images
    setHasVideo(false);
    setVideo(null);
  }, [game.id]);

  // Handle hover video play/pause with delay
  useEffect(() => {
    if (isHovered && hasVideo && videoRef.current) {
      hoverTimeoutRef.current = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(() => {
            // Autoplay failed, that's okay
          });
        }
      }, 500); // 500ms delay before playing
    } else if (!isHovered && videoRef.current) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      videoRef.current.pause();
    }

    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [isHovered, hasVideo]);

  return (
    <div
      className={cn(
        "group relative bg-card border border-border rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/10 min-w-0 w-full",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/game/${game.id}`} className="block">
        <div className="aspect-video relative overflow-hidden">
          {/* Video thumbnail when available */}
          {hasVideo && video ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              poster={game.background_image || '/placeholder.svg'}
              muted
              loop
              playsInline
            >
              <source src={video.data.max} type="video/mp4" />
              <source src={video.data["480"]} type="video/mp4" />
            </video>
          ) : (
            <img
              src={game.background_image || '/placeholder.svg'}
              alt={game.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Video indicator */}
          {hasVideo && (
            <div className="absolute bottom-2 right-2 bg-black/50 rounded-full p-1">
              <Play className="h-3 w-3 text-white fill-current" />
            </div>
          )}
          
          {/* Rating */}
          <div className="absolute top-2 right-2 bg-black/50 rounded-full px-2 py-1 flex items-center space-x-1">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="text-white text-xs font-medium">{game.rating.toFixed(1)}</span>
          </div>
          
          {/* Metacritic score */}
          {game.metacritic && (
            <div className="absolute top-2 left-2 bg-primary rounded px-2 py-1">
              <span className="text-primary-foreground text-xs font-bold">{game.metacritic}</span>
            </div>
          )}
          
          {/* Description on hover */}
          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-white text-xs line-clamp-2">
              {game.description_raw || `Released: ${game.released}`}
            </p>
          </div>
        </div>
        
        <div className="p-2 sm:p-4">
          <h3 className="font-semibold text-foreground text-sm sm:text-lg mb-1 sm:mb-2 line-clamp-1">
            {game.name}
          </h3>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 gap-1 sm:gap-0">
            <span className="bg-primary/10 text-primary px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium truncate">
              {primaryGenre}
            </span>
            <span className="text-xs truncate">
              {primaryPlatform}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <div className="text-xs text-muted-foreground truncate">
              {primaryDeveloper}
            </div>
            <span className="bg-primary text-primary-foreground px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs font-medium text-center">
              View Details
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
