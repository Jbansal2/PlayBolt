import { useEffect, useState } from 'react';
import { GamesAPI } from '../lib/games-api';
import { Header } from '../components/Header';
import { HeroCarousel } from '../components/HeroCarousel';
import { GamesGrid } from '../components/GamesGrid';
import { Footer } from '../components/Footer';

// Fallback mock data (Free-to-Game style)
const mockGames = [
  {
    id: 540,
    name: "Overwatch 2",
    background_image: "https://www.freetogame.com/g/540/thumbnail.jpg",
    rating: 4.2,
    metacritic: 79,
    genres: [{ name: "Shooter" }],
    developers: [{ name: "Blizzard Entertainment" }],
    released: "2022-10-04",
    platforms: [{ platform: { name: "PC" } }],
    description: "A team-based multiplayer first-person shooter",
    publisher: "Blizzard Entertainment"
  },
  {
    id: 521,
    name: "Diablo Immortal",
    background_image: "https://www.freetogame.com/g/521/thumbnail.jpg",
    rating: 4.0,
    metacritic: 79,
    genres: [{ name: "ARPG" }],
    developers: [{ name: "Blizzard Entertainment" }],
    released: "2022-06-02",
    platforms: [{ platform: { name: "PC" } }],
    description: "Built for mobile and also released on PC",
    publisher: "Blizzard Entertainment"
  },
  {
    id: 508,
    name: "Fall Guys",
    background_image: "https://www.freetogame.com/g/508/thumbnail.jpg",
    rating: 4.3,
    metacritic: 83,
    genres: [{ name: "Battle Royale" }],
    developers: [{ name: "Mediatonic" }],
    released: "2020-08-04",
    platforms: [{ platform: { name: "PC" } }],
    description: "A massively multiplayer party game",
    publisher: "Epic Games"
  }
];

export default function Index() {
  const [games, setGames] = useState(mockGames);
  const [heroGames, setHeroGames] = useState(mockGames.slice(0, 3));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('Fetching games from Free-to-Game API...');

        // Fetch games from Free-to-Game API
        const fetchedGames = await GamesAPI.fetchAllGames(1, 50);

        if (fetchedGames && fetchedGames.length > 0) {
          console.log('Free-to-Game API data loaded successfully:', fetchedGames.length, 'games');
          setGames(fetchedGames);

          // Get top-rated games for hero carousel
          const heroGameCandidates = fetchedGames
            .filter(game => game.rating >= 4.0)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 5);

          setHeroGames(heroGameCandidates);
        } else {
          console.log('No games returned from API, using mock data');
          setGames(mockGames);
          setHeroGames(mockGames);
        }
      } catch (error) {
        console.warn('Free-to-Game API failed, using mock data:', error.message);
        setGames(mockGames);
        setHeroGames(mockGames);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
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

  // Get different categories of games
  const popularGames = games.slice(0, 16);
  const actionGames = games.filter(game =>
    game.genres?.some(genre => genre.name.toLowerCase().includes('action'))
  ).slice(0, 16);
  const rpgGames = games.filter(game =>
    game.genres?.some(genre => genre.name.toLowerCase().includes('rpg'))
  ).slice(0, 16);
  const highRatedGames = games
    .filter(game => game.rating >= 4.0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 16);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <HeroCarousel games={heroGames} />
        
        <GamesGrid 
          games={popularGames} 
          title="Popular Games" 
          isLoading={isLoading} 
        />
        
        {actionGames.length > 0 && (
          <GamesGrid
            games={actionGames}
            title="Action Games"
            isLoading={false}
          />
        )}

        {rpgGames.length > 0 && (
          <GamesGrid
            games={rpgGames}
            title="RPG Games"
            isLoading={false}
          />
        )}

        {highRatedGames.length > 0 && (
          <GamesGrid
            games={highRatedGames}
            title="Top Rated Games"
            isLoading={false}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
