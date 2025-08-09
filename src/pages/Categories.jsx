import { useEffect, useState } from 'react';
import { GamesAPI } from '../lib/games-api';
import { Header } from '../components/Header';
import { GamesGrid } from '../components/GamesGrid';
import { GameFilters } from '../components/GameFilters';
import { Footer } from '../components/Footer';
import { Filter } from 'lucide-react';

export default function Categories() {
  const [allGames, setAllGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    categories: [],
    platforms: [],
    rating: '',
    search: ''
  });

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setIsLoading(true);
        const games = await GamesAPI.fetchAllGames(1, 100);
        setAllGames(games);
        setFilteredGames(games);
      } catch (err) {
        setError('Failed to load games. Please try again later.');
        console.error('Error fetching games:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  // Apply filters whenever filters change
  useEffect(() => {
    let filtered = [...allGames];

    // Filter by categories
    if (activeFilters.categories.length > 0) {
      filtered = filtered.filter(game =>
        activeFilters.categories.some(category =>
          game.genres?.[0]?.name?.toLowerCase().includes(category.toLowerCase()) ||
          category.toLowerCase().includes(game.genres?.[0]?.name?.toLowerCase())
        )
      );
    }

    // Filter by platforms
    if (activeFilters.platforms.length > 0 && !activeFilters.platforms.includes('All Platforms')) {
      filtered = filtered.filter(game =>
        activeFilters.platforms.some(platform =>
          game.platforms?.[0]?.platform?.name?.toLowerCase().includes(platform.toLowerCase())
        )
      );
    }

    // Filter by rating
    if (activeFilters.rating) {
      const minRating = parseFloat(activeFilters.rating);
      filtered = filtered.filter(game => game.rating >= minRating);
    }

    // Filter by search term
    if (activeFilters.search) {
      const searchLower = activeFilters.search.toLowerCase();
      filtered = filtered.filter(game =>
        game.name.toLowerCase().includes(searchLower) ||
        game.genres?.[0]?.name?.toLowerCase().includes(searchLower) ||
        game.developers?.[0]?.name?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredGames(filtered);
  }, [allGames, activeFilters]);

  const handleFiltersChange = (newFilters) => {
    setActiveFilters(newFilters);
  };

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

  const getDisplayTitle = () => {
    if (activeFilters.search) {
      return `Search Results for "${activeFilters.search}"`;
    }
    if (activeFilters.categories.length > 0) {
      return activeFilters.categories.join(', ') + ' Games';
    }
    return 'All Games';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-8">
        {/* Page Header */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Filter className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Game Categories</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Discover and filter games by category, platform, rating, or search terms.
          </p>
        </div>

        {/* Advanced Filters */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <GameFilters
            onFiltersChange={handleFiltersChange}
            totalGames={filteredGames.length}
          />
        </div>

        {/* Games Grid */}
        <GamesGrid
          games={filteredGames}
          title={getDisplayTitle()}
          isLoading={isLoading}
        />
      </main>

      <Footer />
    </div>
  );
}
