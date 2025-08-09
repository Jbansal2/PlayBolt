import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GamesAPI } from '../lib/games-api';
import { Header } from '../components/Header';
import { VideoGallery } from '../components/VideoGallery';
import { GamesGrid } from '../components/GamesGrid';
import { Footer } from '../components/Footer';
import { Star, Calendar, Users, Globe, ArrowLeft, Play, ExternalLink, Film, Image } from 'lucide-react';

export default function GameDetails() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [videos, setVideos] = useState([]);
  const [screenshots, setScreenshots] = useState([]);
  const [recommendedGames, setRecommendedGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMediaLoading, setIsMediaLoading] = useState(true);
  const [isRecommendedLoading, setIsRecommendedLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('videos');

  useEffect(() => {
    const fetchGameDetails = async () => {
      if (!id) {
        setError('Game ID not provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const gameData = await GamesAPI.fetchGameDetails(parseInt(id));
        setGame(gameData);
      } catch (err) {
        setError('Failed to load game details. Please try again later.');
        console.error('Error fetching game details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchGameMedia = async () => {
      if (!id) return;

      try {
        setIsMediaLoading(true);
        // Disable video fetching for stability - only fetch screenshots
        const screenshotsData = await GamesAPI.fetchGameScreenshots(parseInt(id));
        setVideos([]); // No videos to prevent fetch errors
        setScreenshots(screenshotsData.results || []);
      } catch (err) {
        console.error('Error fetching game media:', err);
        setVideos([]);
        setScreenshots([]);
      } finally {
        setIsMediaLoading(false);
      }
    };

    const fetchRecommendedGames = async () => {
      if (!id) return;

      try {
        setIsRecommendedLoading(true);
        // Fetch games from the same genre or similar games
        const allGames = await GamesAPI.fetchAllGames(1, 40);
        const currentGameId = parseInt(id);
        
        // Filter out current game and get similar games
        const similarGames = allGames
          .filter(g => g.id !== currentGameId)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 8);
        
        setRecommendedGames(similarGames);
      } catch (err) {
        console.error('Error fetching recommended games:', err);
      } finally {
        setIsRecommendedLoading(false);
      }
    };

    fetchGameDetails();
    fetchGameMedia();
    fetchRecommendedGames();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-8 w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="aspect-video bg-muted rounded-lg mb-6"></div>
                <div className="h-12 bg-muted rounded mb-4"></div>
                <div className="h-6 bg-muted rounded mb-6 w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-muted rounded-lg p-6 h-32"></div>
                <div className="bg-muted rounded-lg p-6 h-48"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Game Not Found</h1>
            <p className="text-muted-foreground mb-8">{error}</p>
            <Link 
              to="/"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold transition-colors hover:bg-primary/90 inline-flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const starRating = Math.round(game.rating);
  const primaryGenre = game.genres?.[0]?.name || 'Unknown';
  const primaryDeveloper = game.developers?.[0]?.name || 'Unknown';
  const primaryPublisher = game.publishers?.[0]?.name || 'Unknown';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link 
            to="/"
            className="inline-flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Games</span>
          </Link>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              {/* Game Image */}
              <div className="aspect-video rounded-lg overflow-hidden mb-6 bg-muted">
                <img
                  src={game.background_image || '/placeholder.svg'}
                  alt={game.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Game Title and Rating */}
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-foreground mb-4">{game.name}</h1>
                
                <div className="flex items-center space-x-6 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-5 w-5 ${i < starRating ? 'text-yellow-400 fill-current' : 'text-muted-foreground'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-lg font-semibold text-foreground">
                      {game.rating.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground">
                      ({game.ratings_count} reviews)
                    </span>
                  </div>

                  {game.metacritic && (
                    <div className="bg-primary/20 text-primary px-3 py-1 rounded-lg font-bold">
                      Metacritic: {game.metacritic}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {game.genres?.map((genre) => (
                    <span 
                      key={genre.id}
                      className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {game.website && (
                  <button 
                    className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-primary/90 hover:scale-105 flex items-center justify-center space-x-2"
                    onClick={() => window.open(game.website, '_blank')}
                  >
                    <Play className="h-5 w-5" />
                    <span>Play Game</span>
                  </button>
                )}
                <button 
                  className="border border-border text-foreground px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-muted flex items-center justify-center space-x-2"
                  onClick={() => window.open(`https://rawg.io/games/${game.slug}`, '_blank')}
                >
                  <ExternalLink className="h-5 w-5" />
                  <span>View on RAWG</span>
                </button>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">About This Game</h2>
                <div 
                  className="text-muted-foreground leading-relaxed prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: game.description || game.description_raw || 'No description available.' 
                  }}
                />
              </div>

              {/* Videos and Screenshots */}
              {(videos.length > 0 || screenshots.length > 0) && (
                <div className="mb-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <h2 className="text-2xl font-bold text-foreground">Media</h2>
                    <div className="flex bg-muted rounded-lg p-1">
                      <button
                        onClick={() => setActiveTab('videos')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeTab === 'videos' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Film className="h-4 w-4" />
                        <span>Videos ({videos.length})</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('screenshots')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeTab === 'screenshots' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Image className="h-4 w-4" />
                        <span>Screenshots ({screenshots.length})</span>
                      </button>
                    </div>
                  </div>

                  {/* Media Content */}
                  {isMediaLoading ? (
                    <div className="aspect-video bg-muted rounded-lg animate-pulse flex items-center justify-center">
                      <span className="text-muted-foreground">Loading media...</span>
                    </div>
                  ) : (
                    <>
                      {activeTab === 'videos' && videos.length > 0 && (
                        <VideoGallery videos={videos} />
                      )}
                      
                      {activeTab === 'screenshots' && screenshots.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {screenshots.slice(0, 9).map((screenshot) => (
                            <div key={screenshot.id} className="aspect-video bg-muted rounded-lg overflow-hidden group cursor-pointer">
                              <img
                                src={screenshot.image}
                                alt={`${game.name} screenshot`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                                onClick={() => window.open(screenshot.image, '_blank')}
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {activeTab === 'videos' && videos.length === 0 && (
                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                          <span className="text-muted-foreground">No videos available</span>
                        </div>
                      )}

                      {activeTab === 'screenshots' && screenshots.length === 0 && (
                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                          <span className="text-muted-foreground">No screenshots available</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Game Info */}
            <div className="space-y-6">
              {/* Game Stats */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">Game Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Release Date</div>
                      <div className="font-medium text-foreground">
                        {game.released ? new Date(game.released).toLocaleDateString() : 'TBA'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Developer</div>
                      <div className="font-medium text-foreground">{primaryDeveloper}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Publisher</div>
                      <div className="font-medium text-foreground">{primaryPublisher}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Platforms */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">Available Platforms</h3>
                <div className="space-y-2">
                  {game.platforms?.map((platform) => (
                    <div 
                      key={platform.platform.id}
                      className="bg-muted rounded-lg px-3 py-2 text-sm font-medium text-foreground"
                    >
                      {platform.platform.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Links */}
              {(game.reddit_url || game.website) && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-xl font-bold text-foreground mb-4">External Links</h3>
                  <div className="space-y-2">
                    {game.website && (
                      <a
                        href={game.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-primary hover:text-primary/80 transition-colors"
                      >
                        Official Website
                      </a>
                    )}
                    {game.reddit_url && (
                      <a
                        href={game.reddit_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-primary hover:text-primary/80 transition-colors"
                      >
                        Reddit Community
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recommended Games Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <GamesGrid 
            games={recommendedGames} 
            title="Recommended Games"
            isLoading={isRecommendedLoading} 
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
