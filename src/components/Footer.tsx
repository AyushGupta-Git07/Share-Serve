import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Heart, HandHeart, Leaf, RotateCcw, ShieldCheck, Sparkles, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { resetAllDemoData } = useApp();

  return (
    <footer className="bg-forest-950 text-cream-100 border-t border-forest-900">
      {/* Top Banner Notice */}
      <div className="bg-[#0e231b] py-3.5 px-4 border-b border-forest-900/80">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-sage-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-peach animate-pulse" />
            <span className="font-semibold text-white">Interactive Prototype Notice:</span>
            <span>All NGOs, volunteer coordinates, and donation listings are simulated community sample records.</span>
          </div>
          <button
            onClick={resetAllDemoData}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-peach text-xs font-semibold border border-white/15 transition-all hover:scale-105 active:scale-95"
            title="Reset donations and NGO states to fresh seed defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12">
          
          {/* Brand & Mission Column */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-peach border border-white/15 shadow-soft">
                <Heart className="w-5 h-5 fill-peach text-forest-950" />
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">ShareServe</span>
            </div>
            <p className="text-xs font-semibold text-peach flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-sage-300" />
              <span>Good food. Useful things. Shared with care.</span>
            </p>
            <p className="text-xs text-sage-300 leading-relaxed font-normal">
              A community mutual aid initiative connecting households, banquet halls, and local businesses with verified grassroots organizations across Bengaluru neighborhoods.
            </p>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-peach mb-4 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Community Routes</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-sage-200">
              <li>
                <Link to="/donations" className="hover:text-white transition-colors">Browse Active Donations</Link>
              </li>
              <li>
                <Link to="/donate" className="hover:text-white transition-colors">List Surplus Goods</Link>
              </li>
              <li>
                <Link to="/ngos" className="hover:text-white transition-colors">Verified Grassroots NGOs</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">Donor Giving Tracker</Link>
              </li>
              <li>
                <Link to="/ngo-dashboard" className="hover:text-white transition-colors">NGO Logistics Console</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">Admin Trust & Safety</Link>
              </li>
              <li>
                <Link to="/signin" className="hover:text-white transition-colors">Account Sign In & Personas</Link>
              </li>
            </ul>
          </div>

          {/* Mutual Aid Guidelines */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-peach mb-4 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Care & Safety Standards</span>
            </h4>
            <div className="space-y-3 text-xs text-sage-200 leading-relaxed">
              <p>
                <strong className="text-white block font-semibold mb-0.5">Strict Food Timelines</strong>
                Cooked banquet food requires verified preparation timestamps and explicit consumption deadlines.
              </p>
              <p>
                <strong className="text-white block font-semibold mb-0.5">Clean Thermal Packaging</strong>
                Hot meals must be sealed in food-grade insulated containers to maintain temperature integrity.
              </p>
              <p>
                <strong className="text-white block font-semibold mb-0.5">Dignity in Giving</strong>
                Clothing and educational books must be clean, wearable, and packed with respect.
              </p>
            </div>
          </div>

          {/* Prototype Controls */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-peach mb-4 flex items-center gap-1.5">
              <HandHeart className="w-3.5 h-3.5" />
              <span>Local Sandbox</span>
            </h4>
            <p className="text-xs text-sage-300 leading-relaxed font-normal">
              All volunteer reservations, donor contributions, and NGO reviews are saved in your browser's LocalStorage.
            </p>
            <button
              onClick={resetAllDemoData}
              className="w-full py-2.5 px-4 rounded-xl bg-forest-800/80 hover:bg-forest-700 text-white text-xs font-bold border border-forest-700 transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-peach" />
              <span>Restore Default Sample Records</span>
            </button>
            <div className="pt-2 text-[11px] text-sage-400 flex items-center justify-center gap-1">
              <MapPin className="w-3 h-3 text-forest-500" />
              <span>Calibrated for Bengaluru Localities</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-6 border-t border-forest-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sage-400">
          <p>© {new Date().getFullYear()} ShareServe Community Initiative. Built with compassion for social impact.</p>
          <div className="flex items-center gap-2 text-peach font-semibold text-xs">
            <Heart className="w-3.5 h-3.5 fill-peach" />
            <span>Shared with dignity and heart</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
