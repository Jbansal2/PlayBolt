import { useEffect, useState } from 'react';
import { GamesAPI } from '../lib/games-api';
import { Header } from '../components/Header';
import { GamesGrid } from '../components/GamesGrid';
import { Footer } from '../components/Footer';
import { Calendar, Clock } from 'lucide-react';

export default function NewReleases() {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewReleases = async () => {
      try {
        setIsLoading(true);
        // Use dedicated method for fetching new releases
        const newReleases = await GamesAPI.fetchNewReleases(1, 32);
        setGames(newReleases);
      } catch (err) {
        setError('Failed to load new releases. Please try again later.');
        console.error('Error fetching new releases:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewReleases();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Oops! Something went wrong</h1>
            <p className="text-muted-foreground mb-8">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold transition-colors hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate some stats
  const currentYear = new Date().getFullYear();
  const thisYearGames = games.filter(game => 
    game.released && new Date(game.released).getFullYear() === currentYear
  );
  const lastYearGames = games.filter(game => 
    game.released && new Date(game.released).getFullYear() === currentYear - 1
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-8">
        {/* Page Header */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Calendar className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">New Releases</h1>
          </div>
          <p className="text-muted-foreground text-lg mb-6">
            The latest games released in the past two years, sorted by release date.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-card border border-border rounded-lg p-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Total New Games</span>
              </div>
              <span className="text-2xl font-bold text-foreground">{games.length}</span>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">{currentYear} Releases</div>
              <span className="text-2xl font-bold text-foreground">{thisYearGames.length}</span>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">{currentYear - 1} Releases</div>
              <span className="text-2xl font-bold text-foreground">{lastYearGames.length}</span>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">Avg Rating</div>
              <span className="text-2xl font-bold text-foreground">
                {games.length > 0 ? (games.reduce((sum, game) => sum + game.rating, 0) / games.length).toFixed(1) : '0.0'}
              </span>
            </div>
          </div>
        </div>

        {/* Year Sections */}
        {thisYearGames.length > 0 && (
          <GamesGrid 
            games={thisYearGames} 
            title={`${currentYear} Releases`}
            isLoading={false} 
          />
        )}

        {lastYearGames.length > 0 && (
          <GamesGrid 
            games={lastYearGames} 
            title={`${currentYear - 1} Releases`}
            isLoading={false} 
          />
        )}

        {games.length > 0 && thisYearGames.length === 0 && lastYearGames.length === 0 && (
          <GamesGrid 
            games={games} 
            title="Recent Releases"
            isLoading={isLoading} 
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
