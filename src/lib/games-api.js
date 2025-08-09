export class GamesAPI {
  // Base URL for Free-to-Game API with different CORS proxy
  static CORS_PROXY = 'https://corsproxy.io/?';
  static API_BASE = 'https://www.freetogame.com/api';

  /**
   * Build URL for Free-to-Game API with CORS proxy
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @returns {string} Complete URL with parameters
   */
  static buildURL(endpoint, params = {}) {
    const apiUrl = new URL(`${this.API_BASE}${endpoint}`);

    // Add parameters to the original API URL
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        apiUrl.searchParams.set(key, value);
      }
    });

    // Wrap with CORS proxy
    return `${this.CORS_PROXY}${encodeURIComponent(apiUrl.toString())}`;
  }

  /**
   * Generic fetch method with error handling
   * @param {string} url - URL to fetch
   * @returns {Promise<Object>} Response data
   */
  static async fetchData(url) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout for proxy

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }

      // corsproxy.io returns the data directly
      const data = await response.json();
      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please check your internet connection');
      }
      console.error('API fetch error:', error);
      throw error;
    }
  }

  /**
   * Transform Free-to-Game API data to our app format
   * @param {Object} game - Game data from Free-to-Game API
   * @returns {Object} Transformed game data
   */
  static transformGameData(game) {
    return {
      id: game.id,
      name: game.title,
      background_image: game.thumbnail,
      rating: 4.0 + Math.random() * 1.0, // Free-to-Game doesn't provide ratings, simulate
      metacritic: Math.floor(70 + Math.random() * 30), // Simulate metacritic score
      genres: [{ name: game.genre }],
      developers: [{ name: game.developer }],
      released: game.release_date,
      platforms: [{ platform: { name: game.platform } }],
      description: game.short_description,
      game_url: game.game_url,
      publisher: game.publisher
    };
  }

  /**
   * Fetch all games with multiple fallback strategies
   * @param {number} page - Page number (not used in Free-to-Game API)
   * @param {number} pageSize - Number of games per page (not used)
   * @returns {Promise<Array>} Array of games
   */
  static async fetchAllGames(page = 1, pageSize = 40) {
    // List of CORS proxies to try
    const corsProxies = [
      'https://corsproxy.io/?',
      'https://api.allorigins.win/get?url=',
      'https://cors-anywhere.herokuapp.com/',
    ];

    const apiUrl = `${this.API_BASE}/games`;

    // Try each proxy
    for (let i = 0; i < corsProxies.length; i++) {
      try {
        console.log(`Trying CORS proxy ${i + 1}:`, corsProxies[i]);

        let finalUrl;
        let processResponse;

        if (corsProxies[i].includes('allorigins')) {
          finalUrl = `${corsProxies[i]}${encodeURIComponent(apiUrl)}`;
          processResponse = (data) => JSON.parse(data.contents);
        } else {
          finalUrl = `${corsProxies[i]}${apiUrl}`;
          processResponse = (data) => data;
        }

        const response = await fetch(finalUrl, {
          headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const rawData = await response.json();
        const data = processResponse(rawData);

        if (Array.isArray(data) && data.length > 0) {
          console.log(`Success with proxy ${i + 1}!`);
          const transformedGames = data.slice(0, pageSize).map(game => this.transformGameData(game));
          return transformedGames;
        }

      } catch (error) {
        console.warn(`Proxy ${i + 1} failed:`, error.message);
        // Continue to next proxy
      }
    }

    console.warn('All CORS proxies failed, using extended mock data');
    return this.getExtendedMockData(pageSize);
  }

  /**
   * Get extended mock data when API fails
   * @param {number} count - Number of games to return
   * @returns {Array} Array of mock games
   */
  static getExtendedMockData(count = 40) {
    const mockGameTemplates = [
      { id: 540, title: "Overwatch 2", genre: "Shooter", platform: "PC", developer: "Blizzard Entertainment", thumbnail: "https://www.freetogame.com/g/540/thumbnail.jpg" },
      { id: 521, title: "Diablo Immortal", genre: "Action RPG", platform: "PC", developer: "Blizzard Entertainment", thumbnail: "https://www.freetogame.com/g/521/thumbnail.jpg" },
      { id: 508, title: "Fall Guys", genre: "Battle Royale", platform: "PC", developer: "Mediatonic", thumbnail: "https://www.freetogame.com/g/508/thumbnail.jpg" },
      { id: 345, title: "Genshin Impact", genre: "Action RPG", platform: "PC", developer: "miHoYo", thumbnail: "https://www.freetogame.com/g/345/thumbnail.jpg" },
      { id: 516, title: "PUBG: BATTLEGROUNDS", genre: "Battle Royale", platform: "PC", developer: "KRAFTON", thumbnail: "https://www.freetogame.com/g/516/thumbnail.jpg" },
      { id: 452, title: "Call of Duty: Warzone", genre: "Battle Royale", platform: "PC", developer: "Activision", thumbnail: "https://www.freetogame.com/g/452/thumbnail.jpg" },
      { id: 365, title: "Call of Duty: Warzone Mobile", genre: "Shooter", platform: "Android", developer: "Activision", thumbnail: "https://www.freetogame.com/g/365/thumbnail.jpg" },
      { id: 517, title: "Lost Ark", genre: "Action RPG", platform: "PC", developer: "Smilegate", thumbnail: "https://www.freetogame.com/g/517/thumbnail.jpg" },
      { id: 475, title: "Apex Legends", genre: "Battle Royale", platform: "PC", developer: "Respawn Entertainment", thumbnail: "https://www.freetogame.com/g/475/thumbnail.jpg" },
      { id: 427, title: "Dota 2", genre: "MOBA", platform: "PC", developer: "Valve", thumbnail: "https://www.freetogame.com/g/427/thumbnail.jpg" },
    ];

    const extendedMockGames = [];
    for (let i = 0; i < count; i++) {
      const template = mockGameTemplates[i % mockGameTemplates.length];
      extendedMockGames.push(this.transformGameData({
        ...template,
        id: template.id + Math.floor(i / mockGameTemplates.length) * 1000,
        release_date: `2022-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        short_description: `A popular ${template.genre.toLowerCase()} game`,
        game_url: `https://www.freetogame.com/game/${template.id}`,
        publisher: template.developer
      }));
    }

    return extendedMockGames;
  }

  /**
   * Fetch games by category
   * @param {string} category - Game category
   * @returns {Promise<Array>} Array of games
   */
  static async fetchGamesByCategory(category) {
    try {
      const url = this.buildURL('/games', { category: category.toLowerCase() });
      const data = await this.fetchData(url);
      
      const transformedGames = data.map(game => this.transformGameData(game));
      return transformedGames;
    } catch (error) {
      console.warn('Failed to fetch games by category:', error);
      return [];
    }
  }

  /**
   * Fetch games by platform
   * @param {string} platform - Platform (pc, browser, all)
   * @returns {Promise<Array>} Array of games
   */
  static async fetchGamesByPlatform(platform = 'all') {
    try {
      const url = this.buildURL('/games', { platform: platform.toLowerCase() });
      const data = await this.fetchData(url);
      
      const transformedGames = data.map(game => this.transformGameData(game));
      return transformedGames;
    } catch (error) {
      console.warn('Failed to fetch games by platform:', error);
      return [];
    }
  }

  /**
   * Fetch game details by ID
   * @param {string|number} id - Game ID
   * @returns {Promise<Object>} Game details
   */
  static async fetchGameDetails(id) {
    // List of CORS proxies to try
    const corsProxies = [
      'https://corsproxy.io/?',
      'https://api.allorigins.win/get?url=',
    ];

    const apiUrl = `${this.API_BASE}/game?id=${id}`;

    // Try each proxy
    for (let i = 0; i < corsProxies.length; i++) {
      try {
        console.log(`Trying to fetch game details with proxy ${i + 1}`);

        let finalUrl;
        let processResponse;

        if (corsProxies[i].includes('allorigins')) {
          finalUrl = `${corsProxies[i]}${encodeURIComponent(apiUrl)}`;
          processResponse = (data) => JSON.parse(data.contents);
        } else {
          finalUrl = `${corsProxies[i]}${apiUrl}`;
          processResponse = (data) => data;
        }

        const response = await fetch(finalUrl, {
          headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const rawData = await response.json();
        const data = processResponse(rawData);

        if (data && data.id) {
          console.log(`Game details fetched successfully with proxy ${i + 1}`);
          return this.transformGameData(data);
        }

      } catch (error) {
        console.warn(`Proxy ${i + 1} failed for game details:`, error.message);
      }
    }

    console.warn('All proxies failed for game details, using mock data');
    return this.getMockGameDetails(id);
  }

  /**
   * Get mock game details when API fails
   * @param {string|number} id - Game ID
   * @returns {Object} Mock game details
   */
  static getMockGameDetails(id) {
    const mockGame = {
      id: parseInt(id),
      title: "Adventure Quest",
      genre: "Action RPG",
      platform: "PC",
      developer: "Game Studio",
      publisher: "Game Publisher",
      release_date: "2022-06-15",
      short_description: "An epic adventure awaits! Explore vast worlds, battle fierce enemies, and uncover ancient secrets in this thrilling action RPG.",
      description: "Embark on an unforgettable journey in Adventure Quest, a captivating action RPG that combines stunning visuals with engaging gameplay. Battle through diverse landscapes, master powerful abilities, and forge your own destiny in a world filled with mystery and danger. With its rich storyline, dynamic combat system, and endless exploration opportunities, Adventure Quest offers hundreds of hours of immersive gameplay for both casual and hardcore gamers.",
      game_url: `https://www.freetogame.com/game/${id}`,
      thumbnail: `https://www.freetogame.com/g/${id}/thumbnail.jpg`,
      minimum_system_requirements: {
        os: "Windows 7/8/10",
        processor: "Intel Core i3 or equivalent",
        memory: "4 GB RAM",
        graphics: "DirectX 9 compatible",
        storage: "2 GB available space"
      },
      screenshots: [
        { id: 1, image: `https://www.freetogame.com/g/${id}/1.jpg` },
        { id: 2, image: `https://www.freetogame.com/g/${id}/2.jpg` },
        { id: 3, image: `https://www.freetogame.com/g/${id}/3.jpg` }
      ]
    };

    return this.transformGameData(mockGame);
  }

  /**
   * Search games (Free-to-Game doesn't have search, filter by title)
   * @param {string} query - Search query
   * @returns {Promise<Array>} Array of matching games
   */
  static async searchGames(query) {
    try {
      const allGames = await this.fetchAllGames(1, 100);
      const filteredGames = allGames.filter(game => 
        game.name.toLowerCase().includes(query.toLowerCase()) ||
        game.genres[0].name.toLowerCase().includes(query.toLowerCase())
      );
      return filteredGames;
    } catch (error) {
      console.warn('Failed to search games:', error);
      return [];
    }
  }

  /**
   * Get available categories
   * @returns {Array} Array of category names
   */
  static getCategories() {
    return [
      'mmorpg',
      'shooter',
      'strategy',
      'moba',
      'racing',
      'sports',
      'social',
      'sandbox',
      'open-world',
      'survival',
      'pvp',
      'pve',
      'pixel',
      'voxel',
      'zombie',
      'turn-based',
      'first-person',
      'third-Person',
      'top-down',
      'tank',
      'space',
      'sailing',
      'side-scroller',
      'superhero',
      'permadeath',
      'card',
      'battle-royale',
      'mmo',
      'mmofps',
      'mmotps',
      '3d',
      '2d',
      'anime',
      'fantasy',
      'sci-fi',
      'fighting',
      'action-rpg',
      'action',
      'military',
      'martial-arts',
      'flight',
      'low-spec',
      'tower-defense',
      'horror',
      'mmorts'
    ];
  }

  /**
   * Fetch genres (for Categories page)
   * @returns {Promise<Array>} Array of genres
   */
  static async fetchGenres() {
    const categories = this.getCategories();
    return categories.map((category, index) => ({
      id: index + 1,
      name: category.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '),
      slug: category,
      games_count: Math.floor(Math.random() * 100) + 10
    }));
  }

  /**
   * Fetch games by genre (for Categories page)
   * @param {string} genre - Genre slug
   * @returns {Promise<Array>} Array of games
   */
  static async fetchGamesByGenre(genre) {
    try {
      return await this.fetchGamesByCategory(genre);
    } catch (error) {
      console.warn('Failed to fetch games by genre:', error);
      // Return filtered mock data for the genre
      const mockGames = this.getExtendedMockData(20);
      return mockGames.filter(game =>
        game.genres[0].name.toLowerCase() === genre.toLowerCase() ||
        game.genres[0].name.toLowerCase().includes(genre.toLowerCase())
      );
    }
  }

  /**
   * Fetch top-rated games
   * @param {number} page - Page number
   * @param {number} pageSize - Number of games per page
   * @returns {Promise<Array>} Array of top-rated games
   */
  static async fetchTopRatedGames(page = 1, pageSize = 40) {
    try {
      const allGames = await this.fetchAllGames(1, 100);
      // Sort by rating and return top games
      const topGames = allGames
        .sort((a, b) => b.rating - a.rating)
        .slice(0, pageSize);
      return topGames;
    } catch (error) {
      console.warn('Failed to fetch top-rated games:', error);
      return this.getExtendedMockData(pageSize)
        .sort((a, b) => b.rating - a.rating);
    }
  }

  /**
   * Fetch new releases
   * @param {number} page - Page number
   * @param {number} pageSize - Number of games per page
   * @returns {Promise<Array>} Array of new release games
   */
  static async fetchNewReleases(page = 1, pageSize = 40) {
    try {
      const allGames = await this.fetchAllGames(1, 100);
      // Sort by release date (newest first)
      const newGames = allGames
        .sort((a, b) => new Date(b.released) - new Date(a.released))
        .slice(0, pageSize);
      return newGames;
    } catch (error) {
      console.warn('Failed to fetch new releases:', error);
      return this.getExtendedMockData(pageSize)
        .sort((a, b) => new Date(b.released) - new Date(a.released));
    }
  }

  // Placeholder methods for compatibility (Free-to-Game doesn't support these)
  static async fetchGameScreenshots(id) {
    // Return mock screenshots for the game
    const mockScreenshots = [
      { id: 1, image: `https://www.freetogame.com/g/${id}/1.jpg` },
      { id: 2, image: `https://www.freetogame.com/g/${id}/2.jpg` },
      { id: 3, image: `https://www.freetogame.com/g/${id}/3.jpg` }
    ];
    return { results: mockScreenshots };
  }

  static async fetchGameVideos(id) {
    return { results: [] };
  }
}
