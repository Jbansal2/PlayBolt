import { GameCard } from './GameCard';

export function GamesGrid({ games, title, isLoading }) {
  if (isLoading) {
    return (
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8">{title}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
                <div className="aspect-video bg-muted"></div>
                <div className="p-2 sm:p-4">
                  <div className="h-4 sm:h-6 bg-muted rounded mb-1 sm:mb-2"></div>
                  <div className="h-3 sm:h-4 bg-muted rounded mb-2 sm:mb-3 w-3/4"></div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <div className="h-3 sm:h-4 bg-muted rounded w-1/2 sm:w-1/4"></div>
                    <div className="h-6 sm:h-8 bg-muted rounded w-full sm:w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (games.length === 0) {
    return (
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8">{title}</h2>
          <div className="text-center py-8 sm:py-12">
            <p className="text-muted-foreground text-base sm:text-lg">No games found.</p>
            <p className="text-muted-foreground text-sm sm:text-base mt-2">Try adjusting your filters or search terms.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
        
        {/* Results Summary for Mobile */}
        <div className="mt-6 sm:mt-8 text-center sm:hidden">
          <p className="text-xs text-muted-foreground">
            Showing {games.length} games
          </p>
        </div>
      </div>
    </section>
  );
}
