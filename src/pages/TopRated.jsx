import { useEffect, useState } from 'react';
import { GamesAPI } from '../lib/games-api';
import { Header } from '../components/Header';
import { GamesGrid } from '../components/GamesGrid';
import { Footer } from '../components/Footer';
import { Trophy, Star } from 'lucide-react';

export default function TopRated() {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopRatedGames = async () => {
      try {
        setIsLoading(true);
        // Use dedicated method for fetching top-rated games
        const topRatedGames = await GamesAPI.fetchTopRatedGames(1, 32);

        setGames(topRatedGames);
      } catch (err) {
        setError('Failed to load top rated games. Please try again later.');
        console.error('Error fetching top rated games:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopRatedGames();
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-8">
        {/* Page Header */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h1 className="text-4xl font-bold text-foreground">Top Rated Games</h1>
          </div>
          <p className="text-muted-foreground text-lg mb-6">
            The highest-rated games based on user reviews and critic scores.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-card border border-border rounded-lg p-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-2">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-muted-foreground">Minimum Rating</span>
              </div>
              <span className="text-2xl font-bold text-foreground">4.0+</span>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">Total Games</div>
              <span className="text-2xl font-bold text-foreground">{games.length}</span>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">Avg Rating</div>
              <span className="text-2xl font-bold text-foreground">
                {games.length > 0 ? (games.reduce((sum, game) => sum + game.rating, 0) / games.length).toFixed(1) : '0.0'}
              </span>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">With Metacritic</div>
              <span className="text-2xl font-bold text-foreground">
                {games.filter(game => game.metacritic).length}
              </span>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <GamesGrid 
          games={games} 
          title="Highest Rated Games"
          isLoading={isLoading} 
        />
      </main>

      <Footer />
    </div>
  );
}
