import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';
import { NGOCard } from '../components/NGOCard';
import { DonationCategory } from '../types';
import { 
  Search, ShieldCheck, MapPin, Sparkles, Filter, Leaf, 
  HeartHandshake, Utensils, Shirt, BookOpen, PenTool, Home, CheckCircle2 
} from 'lucide-react';

export const DiscoverNGOs: React.FC = () => {
  const { ngos } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocality, setSelectedLocality] = useState<string>('all');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);

  const localities = useMemo(() => {
    const set = new Set<string>();
    ngos.forEach((n) => {
      set.add(n.locality);
      n.serviceAreas.forEach((area) => set.add(area));
    });
    return Array.from(set);
  }, [ngos]);

  const categories = [
    { id: 'all', name: 'All Categories', icon: Sparkles },
    { id: 'food', name: 'Surplus Food', icon: Utensils },
    { id: 'clothes', name: 'Wearable Clothes', icon: Shirt },
    { id: 'books', name: 'Books & Textbooks', icon: BookOpen },
    { id: 'stationery', name: 'School Stationery', icon: PenTool },
    { id: 'household', name: 'Household Goods', icon: Home },
  ];

  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return ngos.length;
    return ngos.filter((n) => n.categoriesAccepted.includes(catId as DonationCategory)).length;
  };

  const filteredNGOs = useMemo(() => {
    return ngos.filter((ngo) => {
      // Verification status filter
      if (verifiedOnly && ngo.verificationStatus !== 'verified') {
        return false;
      }

      // Search term
      const matchesSearch = 
        ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ngo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ngo.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ngo.locality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ngo.serviceAreas.some((a) => a.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;

      // Category accepted filter
      if (selectedCategory !== 'all') {
        if (!ngo.categoriesAccepted.includes(selectedCategory as DonationCategory)) {
          return false;
        }
      }

      // Locality filter
      if (selectedLocality !== 'all') {
        const inService = ngo.locality === selectedLocality || ngo.serviceAreas.includes(selectedLocality);
        if (!inService) return false;
      }

      return true;
    });
  }, [ngos, searchTerm, selectedCategory, selectedLocality, verifiedOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
            <span>Community Care Directory</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-950 tracking-tight mt-1 font-serif">
            Discover Verified Grassroots Partners
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-1.5 max-w-xl leading-relaxed">
            Neighborhood organizations equipped to collect surplus food, clothing, books, and educational supplies with dignity and care.
          </p>
        </div>

        <div className="p-3.5 bg-sage-100 rounded-2xl border border-sage-200 text-xs text-forest-900 max-w-xs shadow-xs">
          <span className="font-bold block text-forest-950 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-peach" />
            <span>Verified Impact Network</span>
          </span>
          Organizations undergo safety inspections and identity verification before accessing live surplus pickups.
        </div>
      </div>

      {/* Filter and Category Pills Bar */}
      <div className="bg-white p-5 rounded-3xl border border-sage-200 shadow-card space-y-4">
        {/* Row 1: Search, Locality, and Verified Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-6 relative">
            <Search className="w-4 h-4 text-charcoal-light absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by NGO name, mission, locality or service area..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-sage-300 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
            />
          </div>

          {/* Locality Filter */}
          <div className="lg:col-span-3 relative">
            <MapPin className="w-4 h-4 text-charcoal-light absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedLocality}
              onChange={(e) => setSelectedLocality(e.target.value)}
              aria-label="Filter by Service Locality"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-sage-300 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white appearance-none"
            >
              <option value="all">All Service Localities (Bengaluru)</option>
              {localities.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Verified Only Toggle */}
          <div className="lg:col-span-3 flex items-center">
            <label className="flex items-center gap-2 p-2.5 rounded-xl border border-sage-300 w-full cursor-pointer hover:bg-sage-50 transition-colors">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="rounded text-forest-700 focus:ring-forest-500"
              />
              <span className="text-xs font-semibold text-charcoal flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest-600" />
                <span>Verified Partners Only</span>
              </span>
            </label>
          </div>
        </div>

        {/* Row 2: Interactive Category Filter Pills with Live NGO Counts */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-light flex items-center gap-1">
            <Filter className="w-3 h-3 text-forest-600" />
            <span>Filter by Accepted Donation Goods</span>
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count = getCategoryCount(cat.id);
              const Icon = cat.icon;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-forest-700 text-white border-forest-800 shadow-xs'
                      : 'bg-cream text-charcoal hover:bg-sage-100 border-sage-200'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-peach' : 'text-forest-700'}`} />
                  <span>{cat.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected 
                      ? 'bg-white/20 text-white' 
                      : 'bg-sage-200 text-forest-900'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-charcoal-muted px-1">
        <span>
          Showing <strong className="text-charcoal font-bold">{filteredNGOs.length}</strong> grassroots partner organizations
        </span>

        {selectedCategory !== 'all' && (
          <span className="text-forest-700 font-medium">
            Filtering by: <strong className="capitalize">{selectedCategory}</strong>
          </span>
        )}
      </div>

      {/* NGO Cards Grid */}
      {filteredNGOs.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredNGOs.map((ngo) => (
            <NGOCard key={ngo.id} ngo={ngo} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No partner NGOs match your current filters"
          description="Try selecting 'All Categories' or clearing your locality filter to discover other verified partners in Bengaluru."
          actionText="Reset All Filters"
          onAction={() => {
            setSearchTerm('');
            setSelectedCategory('all');
            setSelectedLocality('all');
            setVerifiedOnly(false);
          }}
        />
      )}

      {/* Community NGO Join Callout */}
      <div className="rounded-3xl bg-forest-900 text-cream p-8 border border-forest-800 shadow-elevated flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-peach flex items-center justify-center md:justify-start gap-1">
            <HeartHandshake className="w-3.5 h-3.5 text-peach" />
            <span>Grassroots Network</span>
          </span>
          <h3 className="text-xl font-bold text-white">Represent an NGO or Shelter in Bengaluru?</h3>
          <p className="text-xs text-sage-200 max-w-xl">
            Register your organization with ShareServe to receive automated alerts for nearby fresh food batches, clothing drives, and school supplies.
          </p>
        </div>

        <Link
          to="/signin"
          className="px-5 py-3 rounded-2xl bg-peach hover:bg-peach-200 text-forest-950 font-bold text-xs shadow-soft transition-colors whitespace-nowrap flex items-center gap-1.5"
        >
          <span>Register Your Organization</span>
          <CheckCircle2 className="w-3.5 h-3.5 text-forest-900" />
        </Link>
      </div>
    </div>
  );
};

export { DiscoverNGOs as NGOsDirectoryPage };
export default DiscoverNGOs;
