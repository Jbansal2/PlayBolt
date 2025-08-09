import { Gamepad2, Github, Twitter, Youtube, Mail, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <Gamepad2 className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-foreground">GameHub</span>
              </div>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                Discover and explore the best games from around the world. Your ultimate destination for gaming information, reviews, and videos.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Email"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Navigation Links */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Navigation</h3>
              <div className="space-y-3">
                <Link 
                  to="/" 
                  className="block text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Home
                </Link>
                <Link 
                  to="/categories" 
                  className="block text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Categories
                </Link>
                <Link 
                  to="/top-rated" 
                  className="block text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Top Rated
                </Link>
                <Link 
                  to="/new-releases" 
                  className="block text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  New Releases
                </Link>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Popular Genres</h3>
              <div className="space-y-3">
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                  Action
                </a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                  RPG
                </a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                  Strategy
                </a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                  Shooter
                </a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                  Adventure
                </a>
              </div>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <div className="space-y-3">
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                  Help Center
                </a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                  Contact Us
                </a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                  Privacy Policy
                </a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                  Terms of Service
                </a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                  API Documentation
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-border py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-muted-foreground text-sm mb-4 md:mb-0">
              <p className="flex items-center">
                &copy; 2024 PlayBolt. Made with 
                <Heart className="h-4 w-4 mx-1 text-red-500 fill-current" /> 
                for gamers worldwide.
              </p>
            </div>
            <div className="text-muted-foreground text-xs">
              <p>
                Game data provided by{' '}
                <a 
                  href="" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Free-To-Play
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
