import { useState, useRef, useEffect } from 'react';
import { Filter, ChevronDown, X, Search } from 'lucide-react';

export function GameFilters({ onFiltersChange, totalGames = 0 }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedRating, setSelectedRating] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);

  const categoryDropdownRef = useRef(null);
  const platformDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setCategoryDropdownOpen(false);
      }
      if (platformDropdownRef.current && !platformDropdownRef.current.contains(event.target)) {
        setPlatformDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const categories = [
    'Action', 'Adventure', 'Battle Royale', 'Card Game', 'Fighting',
    'First Person', 'Horror', 'MMORPG', 'MOBA', 'Racing', 'RPG',
    'Shooter', 'Sports', 'Strategy', 'Survival', 'Puzzle'
  ];

  const platforms = ['PC', 'Web Browser', 'Mobile', 'All Platforms'];

  const ratingOptions = [
    { label: 'All Ratings', value: '' },
    { label: '4.5+ Stars', value: '4.5' },
    { label: '4.0+ Stars', value: '4.0' },
    { label: '3.5+ Stars', value: '3.5' },
    { label: '3.0+ Stars', value: '3.0' }
  ];

  const handleCategoryToggle = (category) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newCategories);
    updateFilters({ categories: newCategories });
  };

  const handlePlatformToggle = (platform) => {
    const newPlatforms = selectedPlatforms.includes(platform)
      ? selectedPlatforms.filter(p => p !== platform)
      : [...selectedPlatforms, platform];
    
    setSelectedPlatforms(newPlatforms);
    updateFilters({ platforms: newPlatforms });
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
    updateFilters({ rating });
  };

  const handleSearchChange = (search) => {
    setSearchTerm(search);
    updateFilters({ search });
  };

  const updateFilters = (newFilter) => {
    onFiltersChange({
      categories: selectedCategories,
      platforms: selectedPlatforms,
      rating: selectedRating,
      search: searchTerm,
      ...newFilter
    });
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedPlatforms([]);
    setSelectedRating('');
    setSearchTerm('');
    onFiltersChange({
      categories: [],
      platforms: [],
      rating: '',
      search: ''
    });
  };

  const activeFiltersCount = selectedCategories.length + selectedPlatforms.length + 
    (selectedRating ? 1 : 0) + (searchTerm ? 1 : 0);

  return (
    <div className="bg-card border border-border rounded-lg p-3 sm:p-6 mb-6 sm:mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Filter className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          <h3 className="text-base sm:text-lg font-semibold text-foreground">Filter Games</h3>
          <span className="bg-muted text-muted-foreground px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs sm:text-sm">
            {totalGames} games
          </span>
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="flex items-center space-x-1 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors self-start sm:self-auto"
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Clear All ({activeFiltersCount})</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-4 sm:mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search games..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full bg-background border border-border rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Categories Dropdown */}
        <div className="relative" ref={categoryDropdownRef}>
          <h4 className="text-sm font-medium text-foreground mb-3">Categories</h4>
          <button
            onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent flex items-center justify-between"
          >
            <span className="text-muted-foreground">
              {selectedCategories.length === 0
                ? 'Select Categories'
                : `${selectedCategories.length} Selected`}
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {categoryDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
              {categories.map((category) => (
                <label key={category} className="flex items-center space-x-2 px-3 py-2 hover:bg-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                  />
                  <span className="text-xs sm:text-sm text-foreground">{category}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Platforms Dropdown */}
        <div className="relative" ref={platformDropdownRef}>
          <h4 className="text-sm font-medium text-foreground mb-3">Platforms</h4>
          <button
            onClick={() => setPlatformDropdownOpen(!platformDropdownOpen)}
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent flex items-center justify-between"
          >
            <span className="text-muted-foreground">
              {selectedPlatforms.length === 0
                ? 'Select Platforms'
                : `${selectedPlatforms.length} Selected`}
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${platformDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {platformDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
              {platforms.map((platform) => (
                <label key={platform} className="flex items-center space-x-2 px-3 py-2 hover:bg-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes(platform)}
                    onChange={() => handlePlatformToggle(platform)}
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                  />
                  <span className="text-xs sm:text-sm text-foreground">{platform}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Rating */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Minimum Rating</h4>
          <select
            value={selectedRating}
            onChange={(e) => handleRatingChange(e.target.value)}
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {ratingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="mt-4 sm:mt-6 pt-4 border-t border-border">
          <h4 className="text-xs sm:text-sm font-medium text-foreground mb-2 sm:mb-3">Active Filters:</h4>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {selectedCategories.map((category) => (
              <span
                key={category}
                className="inline-flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs"
              >
                <span>{category}</span>
                <button
                  onClick={() => handleCategoryToggle(category)}
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {selectedPlatforms.map((platform) => (
              <span
                key={platform}
                className="inline-flex items-center space-x-1 bg-secondary/10 text-secondary-foreground px-2 py-1 rounded-full text-xs"
              >
                <span>{platform}</span>
                <button
                  onClick={() => handlePlatformToggle(platform)}
                  className="hover:bg-secondary/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {selectedRating && (
              <span className="inline-flex items-center space-x-1 bg-accent/10 text-accent-foreground px-2 py-1 rounded-full text-xs">
                <span>{ratingOptions.find(r => r.value === selectedRating)?.label}</span>
                <button
                  onClick={() => handleRatingChange('')}
                  className="hover:bg-accent/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {searchTerm && (
              <span className="inline-flex items-center space-x-1 bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs">
                <span>Search: "{searchTerm}"</span>
                <button
                  onClick={() => handleSearchChange('')}
                  className="hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
