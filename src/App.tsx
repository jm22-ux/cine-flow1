import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Play,
  Plus,
  Check,
  Star,
  Clock,
  ChevronRight,
  TrendingUp,
  Heart,
  Menu,
  X,
  Tv,
  Filter,
  ArrowRight,
  Monitor
} from 'lucide-react';
import { cn } from './lib/utils';
import { MOVIES } from './data/movies';
import { Movie, Genre } from './types';

// --- Components ---

const Navbar = ({ onSearch }: { onSearch: (q: string) => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/movies' },
    { name: 'Trending', path: '/trending' },
    { name: 'Watchlist', path: '/watchlist' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 flex items-center justify-between",
      isScrolled ? "bg-[#0f0f0f]/90 backdrop-blur-md border-b border-white/5 py-3" : "bg-transparent"
    )}>
      <div className="flex items-center gap-12">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-[#FFD700] rounded-lg flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform">
            <Play className="fill-[#0f0f0f] text-[#0f0f0f] ml-1" size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-white">CINE<span className="text-[#FFD700]">FLOW</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-sm font-medium tracking-wide transition-colors hover:text-[#FFD700]",
                location.pathname === link.path ? "text-[#FFD700]" : "text-white/70"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#FFD700] transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search movies..."
            onChange={(e) => onSearch(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white w-64 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 transition-all focus:bg-white/10"
          />
        </div>
        <button className="bg-[#FFD700] p-2 rounded-full hover:scale-110 transition-transform active:scale-95 hidden sm:block">
          <Heart size={20} className="text-[#0f0f0f] fill-[#0f0f0f]" />
        </button>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-[#0f0f0f] border-b border-white/10 p-6 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-white/80 hover:text-[#FFD700]"
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const MovieDetailOverlay = ({ 
  movie, 
  onClose, 
  isWatchlisted, 
  onToggleWatchlist 
}: { 
  movie: Movie, 
  onClose: () => void, 
  isWatchlisted: boolean, 
  onToggleWatchlist: (m: Movie) => void 
}) => {
  if (!movie) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-[#0f0f0f]/95 backdrop-blur-xl overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-[#1a1a1a] w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-[#FFD700] hover:text-[#0f0f0f] transition-all"
        >
          <X size={24} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="h-[40vh] lg:h-auto relative">
            <img src={movie.poster} className="w-full h-full object-cover" alt={movie.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent lg:hidden" />
          </div>

          <div className="p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#FFD700] px-2 py-1 rounded font-black text-[#0f0f0f] text-sm italic">
                CINEFLOW EXCLUSIVE
              </div>
              <span className="text-white/40 text-sm font-bold uppercase tracking-widest">{movie.year} • {movie.runtime} MIN</span>
            </div>

            <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase mb-6 leading-none">
              {movie.title}
            </h2>

            <div className="flex items-center gap-6 mb-8 border-y border-white/5 py-4">
              <div className="flex items-center gap-2">
                <Star className="text-[#FFD700] fill-[#FFD700]" size={20} />
                <span className="text-white font-black text-xl italic">{movie.rating}</span>
                <span className="text-white/30 text-xs font-bold uppercase">/ 10 Rating</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex flex-wrap gap-2">
                {movie.genres.map(g => (
                  <span key={g} className="text-white/60 text-xs font-bold uppercase tracking-wider border border-white/10 px-3 py-1 rounded-full">{g}</span>
                ))}
              </div>
            </div>

            <p className="text-white/70 text-lg leading-relaxed mb-8">
              {movie.description}
            </p>

            <div className="grid grid-cols-2 gap-8 mb-10">
              <div>
                <h4 className="text-white font-bold mb-2 uppercase text-xs tracking-widest text-[#FFD700]">Director</h4>
                <p className="text-white/60 text-sm">{movie.director}</p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-2 uppercase text-xs tracking-widest text-[#FFD700]">Starring</h4>
                <p className="text-white/60 text-sm">{movie.cast.join(', ')}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-10">
              <button className="bg-white text-[#0f0f0f] font-black px-10 py-4 rounded-full hover:bg-[#FFD700] transition-all flex items-center gap-2 uppercase tracking-tighter">
                <Play size={20} className="fill-current" /> Watch Now
              </button>
              <button 
                onClick={() => onToggleWatchlist(movie)}
                className={cn(
                  "p-4 rounded-full border flex items-center gap-2 transition-all font-bold uppercase tracking-tighter px-6",
                  isWatchlisted ? "bg-[#FFD700] text-[#0f0f0f] border-[#FFD700]" : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                )}
              >
                {isWatchlisted ? <Check size={20} /> : <Plus size={20} />}
                {isWatchlisted ? 'Watchlisted' : 'Add to Watchlist'}
              </button>
            </div>

            <div className="border-t border-white/5 pt-8 mt-8">
              <h4 className="text-white font-bold mb-6 italic uppercase tracking-tighter flex items-center gap-2">
                <Star className="text-[#FFD700]" size={16} /> Community Reviews
              </h4>
              <div className="space-y-6">
                {[
                  { user: 'Alex Reyes', comment: 'Absolutely mind-bending. A masterpiece of modern sci-fi.', rating: 10 },
                  { user: 'Sarah Chen', comment: 'The visuals are stunning, but the plot is what really sticks with you.', rating: 9 }
                ].map((rev, i) => (
                  <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-bold text-sm tracking-tight">{rev.user}</span>
                      <div className="flex items-center gap-1 text-[#FFD700] text-xs font-bold">
                        <Star size={10} className="fill-current" /> {rev.rating}
                      </div>
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const MovieCard = ({ 
  movie, 
  isWatchlisted, 
  onToggleWatchlist,
  onClick 
}: { 
  movie: Movie, 
  isWatchlisted: boolean, 
  onToggleWatchlist: (m: Movie) => void,
  onClick: (m: Movie) => void 
}) => {
  return (
    <motion.div
      layout
      whileHover={{ y: -10 }}
      onClick={() => onClick(movie)}
      className="relative aspect-[2/3] rounded-xl overflow-hidden group cursor-pointer border border-white/5 cinematic-shadow"
    >
      <img
        src={movie.poster}
        alt={movie.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex items-center gap-1 bg-[#FFD700] px-1.5 py-0.5 rounded text-[10px] font-bold text-[#0f0f0f]">
            <Star size={10} className="fill-[#0f0f0f]" />
            {movie.rating}
          </div>
          <span className="text-[10px] text-white/70 font-medium uppercase tracking-wider">{movie.genres[0]}</span>
        </div>
        <h3 className="text-white font-bold text-lg leading-tight mb-2">{movie.title}</h3>
        <div className="flex gap-2">
          <button className="flex-1 bg-white text-[#0f0f0f] text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 hover:bg-[#FFD700] transition-colors">
            <Play size={14} className="fill-current" /> Watch
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatchlist(movie);
            }}
            className={cn(
              "p-2 rounded-lg border flex items-center justify-center transition-all",
              isWatchlisted ? "bg-white/20 border-white/40" : "bg-white/5 border-white/10 hover:border-white/30"
            )}
          >
            {isWatchlisted ? <Check size={16} className="text-white" /> : <Plus size={16} className="text-white" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Hero = ({ movie, onToggleWatchlist, isWatchlisted }: { movie: Movie, onToggleWatchlist: (m: Movie) => void, isWatchlisted: boolean }) => {
  return (
    <section className="relative h-[85vh] w-full overflow-hidden flex items-end pb-24 px-6 md:px-12">
      <div className="absolute inset-0">
        <img
          src={movie.backdrop}
          alt={movie.title}
          className="w-full h-full object-cover brightness-[0.6] contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f]/80 via-transparent to-transparent" />
      </div>

      <div className="relative max-w-4xl z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1 bg-[#FFD700] font-bold text-[#0f0f0f] px-2 py-1 rounded text-sm">
              <Star size={14} className="fill-[#0f0f0f]" /> {movie.rating}
            </div>
            <span className="text-white/60 font-medium tracking-widest text-sm uppercase">{movie.year} • {movie.genres.join(', ')}</span>
            <div className="flex items-center gap-1 text-white/60 text-sm">
              <Clock size={14} /> {movie.runtime} min
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white leading-none tracking-tighter mb-6 uppercase italic">
            {movie.title}
          </h1>

          <p className="text-white/70 text-lg md:text-xl line-clamp-3 mb-8 max-w-2xl leading-relaxed">
            {movie.description}
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="bg-white text-[#0f0f0f] font-black uppercase tracking-tight py-4 px-8 rounded-full flex items-center gap-3 hover:bg-[#FFD700] transition-colors group">
              <Play className="group-hover:scale-110 transition-transform fill-current" size={24} />
              Watch Now
            </button>
            <button 
              onClick={() => onToggleWatchlist(movie)}
              className={cn(
                "font-bold uppercase tracking-tight py-4 px-8 rounded-full flex items-center gap-3 border transition-all",
                isWatchlisted 
                  ? "bg-[#FFD700]/10 border-[#FFD700] text-[#FFD700]" 
                  : "bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/40"
              )}
            >
              {isWatchlisted ? <Check size={20} /> : <Plus size={20} />}
              {isWatchlisted ? 'In Watchlist' : 'Add to Wishlist'}
            </button>
          </div>
        </motion.div>
      </div>

      <div className="absolute right-12 bottom-24 hidden lg:flex flex-col gap-6 items-end">
        <div className="text-right">
          <p className="text-[#FFD700] text-xs font-bold uppercase tracking-widest mb-1 italic">Now Trending</p>
          <div className="flex gap-4 items-center">
             <div className="h-0.5 w-12 bg-white/20" />
             <span className="text-white/60 text-sm">Follow us @cineflow</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-[#0a0a0a] border-t border-white/5 pt-20 pb-10 px-6 md:px-12">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 text-center md:text-left">
      <div className="col-span-1 md:col-span-1">
        <Link to="/" className="flex items-center gap-2 mb-6 justify-center md:justify-start">
          <div className="w-8 h-8 bg-[#FFD700] rounded flex items-center justify-center">
            <Play className="fill-[#0f0f0f] text-[#0f0f0f] ml-0.5" size={16} />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white">CINE<span className="text-[#FFD700]">FLOW</span></span>
        </Link>
        <p className="text-white/40 text-sm leading-relaxed mb-6">
          Premium cinematic experience at your fingertips. Discover, stream, and collect your favorite narratives in stunning 4K quality.
        </p>
        <div className="flex gap-4 justify-center md:justify-start">
          {[1,2,3,4].map(i => (
            <div key={i} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#FFD700]/10 hover:border-[#FFD700]/50 cursor-pointer transition-colors" />
          ))}
        </div>
      </div>

      <div className="hidden md:block">
        <h4 className="text-white font-bold mb-6 italic uppercase tracking-wider">Navigation</h4>
        <ul className="flex flex-col gap-3">
          {['Home', 'Movies', 'Trending', 'Watchlist'].map(item => (
            <li key={item}>
              <Link to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-white/40 text-sm hover:text-white transition-colors">{item}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-white font-bold mb-6 italic uppercase tracking-wider">Stay Flowing</h4>
        <p className="text-white/40 text-sm mb-4">Get the latest cinematic updates and curated releases.</p>
        <div className="flex flex-col gap-3">
          <input 
            type="email" 
            placeholder="Email Address" 
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#FFD700]"
          />
          <button className="bg-[#FFD700] text-[#0f0f0f] font-bold text-sm py-2 rounded-lg hover:brightness-110 active:scale-95 transition-all">
            Subscribe
          </button>
        </div>
      </div>
    </div>

    <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/5 pt-10 gap-6">
      <p className="text-white/30 text-xs tracking-wide">© 2026 CINEFLOW ENTERTAINMENT. ALL RIGHTS RESERVED.</p>
      <div className="flex gap-8">
        <a href="#" className="text-white/30 text-xs hover:text-white">Privacy Policy</a>
        <a href="#" className="text-white/30 text-xs hover:text-white">Terms of Service</a>
      </div>
    </div>
  </footer>
);

// --- Pages ---

const HomePage = ({ watchlist, onToggleWatchlist, onMovieClick }: { watchlist: string[], onToggleWatchlist: (m: Movie) => void, onMovieClick: (m: Movie) => void }) => {
  const featured = MOVIES[0];
  const trending = MOVIES.slice(1, 7);
  const categories: Genre[] = ['Action', 'Sci-Fi', 'Thriller', 'Animation'];

  return (
    <div className="bg-[#0f0f0f] min-h-screen">
      <Hero movie={featured} onToggleWatchlist={onToggleWatchlist} isWatchlisted={watchlist.includes(featured.id)} />
      
      <main className="px-6 md:px-12 -mt-10 pb-20 overflow-hidden">
        {/* Trending Slider */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-white italic flex items-center gap-3 tracking-tighter uppercase">
              <TrendingUp className="text-[#FFD700]" /> Trending Now
            </h2>
            <Link to="/movies" className="text-white/40 hover:text-white flex items-center gap-2 text-sm font-bold uppercase transition-colors">
              Explore All <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {trending.map(m => (
              <MovieCard key={m.id} movie={m} isWatchlisted={watchlist.includes(m.id)} onToggleWatchlist={onToggleWatchlist} onClick={onMovieClick} />
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
             <Filter className="text-[#FFD700]" />
             <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Browse Experience</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((genre, idx) => (
              <motion.div
                key={genre}
                whileHover={{ scale: 1.02 }}
                className={cn(
                  "h-48 rounded-2xl relative overflow-hidden group cursor-pointer border border-white/5",
                  idx % 2 === 0 ? "md:col-span-2" : "md:col-span-1"
                )}
              >
                <img 
                  src={MOVIES.find(m => m.genres.includes(genre))?.backdrop} 
                  className="absolute inset-0 w-full h-full object-cover brightness-[0.4] group-hover:scale-110 transition-transform duration-700" 
                  alt={genre}
                />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <span className="text-[#FFD700] text-xs font-black uppercase tracking-widest mb-1">Explore</span>
                  <h3 className="text-white text-3xl font-black uppercase italic tracking-tighter">{genre}</h3>
                  <ArrowRight className="text-white opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-2 mt-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Feature Banner */}
        <section className="mb-20 rounded-3xl overflow-hidden relative h-96 border border-white/5">
           <img src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover brightness-50" alt="Banner" />
           <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f] via-[#0f0f0f]/40 to-transparent p-12 flex flex-col justify-center">
              <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-4 max-w-xl underline decoration-[#FFD700] underline-offset-8">Experience Cinema in 4K HDR</h2>
              <p className="text-white/60 max-w-md mb-8">Unlimited streaming of Blockbusters, Original Series, and more. Start your free trial today.</p>
              <div className="flex gap-4">
                 <button className="bg-[#FFD700] text-[#0f0f0f] font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform uppercase tracking-tight">Try Free</button>
                 <button className="bg-white/10 text-white border border-white/10 px-8 py-3 rounded-full font-bold uppercase tracking-tight backdrop-blur-md">Learn More</button>
              </div>
           </div>
        </section>
      </main>
    </div>
  );
};

const CatalogPage = ({ 
  watchlist, 
  onToggleWatchlist, 
  searchQuery,
  onMovieClick 
}: { 
  watchlist: string[], 
  onToggleWatchlist: (m: Movie) => void,
  searchQuery: string,
  onMovieClick: (m: Movie) => void
}) => {
  const [selectedGenre, setSelectedGenre] = useState<Genre | 'All'>('All');
  const [sortBy, setSortBy] = useState<'rating' | 'year' | 'popularity'>('popularity');

  const genres: (Genre | 'All')[] = ['All', 'Action', 'Sci-Fi', 'Drama', 'Horror', 'Animation', 'Comedy', 'Thriller'];

  const filteredMovies = useMemo(() => {
    let result = MOVIES.filter(m => {
      const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = selectedGenre === 'All' || m.genres.includes(selectedGenre as string);
      return matchesSearch && matchesGenre;
    });

    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'year') result.sort((a, b) => b.year - a.year);
    // Popularity is currently just the original order
    
    return result;
  }, [searchQuery, selectedGenre, sortBy]);

  return (
    <div className="bg-[#0f0f0f] min-h-screen pt-32 px-6 md:px-12 pb-20">
      <header className="mb-12">
        <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-2">Movie <span className="text-[#FFD700]">Catalog</span></h1>
        <p className="text-white/40 font-medium">Explore our curated collection of masterpieces.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between mb-12 bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
        <div className="flex flex-wrap gap-2">
          {genres.map(g => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider",
                selectedGenre === g ? "bg-[#FFD700] text-[#0f0f0f]" : "bg-white/5 text-white/50 hover:text-white"
              )}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
          <span className="text-white/30 text-xs font-bold uppercase whitespace-nowrap">Sort By</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white/5 border border-white/10 text-white text-xs font-bold rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#FFD700] w-full"
          >
            <option value="popularity">Popularity</option>
            <option value="rating">Top Rated</option>
            <option value="year">Newest First</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredMovies.map(m => (
            <MovieCard 
              key={m.id} 
              movie={m} 
              isWatchlisted={watchlist.includes(m.id)} 
              onToggleWatchlist={onToggleWatchlist}
              onClick={onMovieClick} 
            />
          ))}
        </AnimatePresence>
      </div>

      {filteredMovies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-40">
          <Tv size={64} className="text-white/10 mb-4" />
          <h2 className="text-white/30 text-xl font-bold uppercase italic tracking-widest">No movies found</h2>
          <p className="text-white/20">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};

const WatchlistPage = ({ watchlist, onToggleWatchlist, onMovieClick }: { watchlist: string[], onToggleWatchlist: (m: Movie) => void, onMovieClick: (m: Movie) => void }) => {
  const watchlistedMovies = useMemo(() => MOVIES.filter(m => watchlist.includes(m.id)), [watchlist]);

  return (
    <div className="bg-[#0f0f0f] min-h-screen pt-32 px-6 md:px-12 pb-20">
      <header className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-2">My <span className="text-[#FFD700]">Watchlist</span></h1>
          <p className="text-white/40 font-medium">Your personal collection of must-watch cinema.</p>
        </div>
        <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3">
          <Monitor className="text-[#FFD700]" />
          <span className="text-white font-black text-2xl tracking-tighter italic">{watchlistedMovies.length}</span>
        </div>
      </header>

      {watchlistedMovies.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {watchlistedMovies.map(m => (
            <MovieCard key={m.id} movie={m} isWatchlisted={true} onToggleWatchlist={onToggleWatchlist} onClick={onMovieClick} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-40 bg-white/5 rounded-3xl border border-dashed border-white/10">
          <Plus size={64} className="text-white/10 mb-4" />
          <h2 className="text-white/30 text-xl font-bold uppercase italic tracking-widest">Your list is empty</h2>
          <p className="text-white/20 mb-8">Start adding movies to your watch later collection.</p>
          <Link to="/movies" className="bg-[#FFD700] text-[#0f0f0f] font-black px-8 py-3 rounded-full hover:scale-105 transition-transform uppercase tracking-tighter">Explore Movies</Link>
        </div>
      )}
    </div>
  );
};

// --- Application Entry ---

export default function App() {
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('cineflow_watchlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    localStorage.setItem('cineflow_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const onToggleWatchlist = (movie: Movie) => {
    setWatchlist(prev => 
      prev.includes(movie.id) ? prev.filter(id => id !== movie.id) : [...prev, movie.id]
    );
  };

  return (
    <Router>
      <div className="bg-[#0f0f0f] text-white selection:bg-[#FFD700] selection:text-[#0f0f0f]">
        <Navbar onSearch={setSearchQuery} />
        
        <Routes>
          <Route path="/" element={<HomePage watchlist={watchlist} onToggleWatchlist={onToggleWatchlist} onMovieClick={setSelectedMovie} />} />
          <Route path="/movies" element={<CatalogPage watchlist={watchlist} onToggleWatchlist={onToggleWatchlist} searchQuery={searchQuery} onMovieClick={setSelectedMovie} />} />
          <Route path="/trending" element={<CatalogPage watchlist={watchlist} onToggleWatchlist={onToggleWatchlist} searchQuery="" onMovieClick={setSelectedMovie} />} />
          <Route path="/watchlist" element={<WatchlistPage watchlist={watchlist} onToggleWatchlist={onToggleWatchlist} onMovieClick={setSelectedMovie} />} />
        </Routes>

        <AnimatePresence>
          {selectedMovie && (
            <MovieDetailOverlay 
              movie={selectedMovie} 
              onClose={() => setSelectedMovie(null)} 
              isWatchlisted={watchlist.includes(selectedMovie.id)}
              onToggleWatchlist={onToggleWatchlist}
            />
          )}
        </AnimatePresence>

        <Footer />
      </div>
    </Router>
  );
}
