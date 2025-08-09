import { Search, Menu, Gamepad2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeSwitcher } from './ThemeSwitcher';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Gamepad2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">GameHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`transition-colors font-medium ${
                isActive('/')
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              Home
            </Link>
            <Link
              to="/categories"
              className={`transition-colors ${
                isActive('/categories')
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              Categories
            </Link>
            <Link
              to="/top-rated"
              className={`transition-colors ${
                isActive('/top-rated')
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              Top Rated
            </Link>
            <Link
              to="/new-releases"
              className={`transition-colors ${
                isActive('/new-releases')
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              New Releases
            </Link>
          </nav>

          {/* Search and Menu */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search games..."
                className="bg-muted border border-border rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-64"
              />
            </div>
            
            <ThemeSwitcher />
            
            <button
              className="md:hidden p-2 text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className={`transition-colors font-medium ${
                  isActive('/')
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/categories"
                className={`transition-colors ${
                  isActive('/categories')
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                to="/top-rated"
                className={`transition-colors ${
                  isActive('/top-rated')
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Top Rated
              </Link>
              <Link
                to="/new-releases"
                className={`transition-colors ${
                  isActive('/new-releases')
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                New Releases
              </Link>
              <div className="relative sm:hidden">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search games..."
                  className="bg-muted border border-border rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
                />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
