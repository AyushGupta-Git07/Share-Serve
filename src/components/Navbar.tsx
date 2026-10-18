import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { RoleSwitcher } from './RoleSwitcher';
import { 
  Heart, HandHeart, PlusCircle, Menu, X, LayoutDashboard, Building2, 
  ShieldCheck, Search, Sparkles, LogIn, Leaf 
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { currentUser, donations } = useApp();

  const availableCount = donations.filter((d) => d.status === 'available').length;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { name: 'Browse Donations', path: '/donations', badge: availableCount > 0 ? `${availableCount} open` : undefined },
    { name: 'Discover NGOs', path: '/ngos' },
    { 
      name: 'Donor Dashboard', 
      path: '/dashboard', 
      highlight: currentUser.role === 'donor' 
    },
    { 
      name: 'NGO Dashboard', 
      path: '/ngo-dashboard', 
      highlight: currentUser.role === 'ngo' 
    },
    { 
      name: 'Admin', 
      path: '/admin', 
      highlight: currentUser.role === 'admin' 
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-md border-b border-sage-200/90 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-forest-700 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform duration-200 border border-forest-800">
              <Heart className="w-6 h-6 fill-peach text-forest-700" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-forest-950 font-sans">
                  Share<span className="text-forest-700 font-bold">Serve</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-peach/30 text-forest-950 font-bold border border-peach/50">
                  Community Prototype
                </span>
              </div>
              <p className="text-[11px] text-charcoal-muted font-medium -mt-0.5 hidden sm:flex items-center gap-1">
                <Leaf className="w-3 h-3 text-forest-600" />
                <span>Good food. Useful things. Shared with care.</span>
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all relative flex items-center gap-1.5 ${
                    active
                      ? 'bg-sage-100 text-forest-950 font-bold shadow-xs border border-sage-200'
                      : link.highlight
                      ? 'text-forest-900 bg-sage-50/80 hover:bg-sage-100 font-semibold'
                      : 'text-charcoal-muted hover:text-forest-900 hover:bg-cream-200/60'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[10px] bg-forest-700 text-white font-bold px-2 py-0.5 rounded-full shadow-xs">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions & Role Switcher */}
          <div className="flex items-center gap-3">
            <Link
              to="/signin"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-charcoal-muted hover:text-forest-900 hover:bg-sage-100 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5 text-forest-600" />
              <span>Sign In</span>
            </Link>

            <RoleSwitcher />

            <Link
              to="/donate"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs shadow-soft transition-all duration-200 hover:shadow-elevated active:scale-95 hover:-translate-y-0.5"
            >
              <HandHeart className="w-4 h-4 text-peach" />
              <span>Donate Something</span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-charcoal hover:bg-sage-100 lg:hidden border border-sage-200 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-sage-200 bg-cream px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-charcoal-light flex items-center gap-1">
            <Leaf className="w-3 h-3 text-forest-600" />
            <span>Community Navigation</span>
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${
                isActive(link.path)
                  ? 'bg-sage-100 text-forest-950 font-bold border border-sage-200'
                  : 'text-charcoal hover:bg-white'
              }`}
            >
              <span>{link.name}</span>
              {link.badge && (
                <span className="text-xs bg-forest-700 text-white font-bold px-2 py-0.5 rounded-full">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}

          <Link
            to="/signin"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold text-charcoal hover:bg-white transition-colors"
          >
            <LogIn className="w-4 h-4 text-forest-600" />
            <span>Sign In / Change Account</span>
          </Link>

          <div className="pt-3 border-t border-sage-200">
            <Link
              to="/donate"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-sm shadow-soft transition-colors"
            >
              <HandHeart className="w-4 h-4 text-peach" />
              <span>Donate Something Now</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
