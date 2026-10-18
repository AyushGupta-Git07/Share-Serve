import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DonationCard } from '../components/DonationCard';
import { DonationMap } from '../components/DonationMap';
import { EmptyState } from '../components/EmptyState';
import { DonationCategory } from '../types';
import { 
  Search, Filter, MapPin, Sparkles, AlertCircle, ArrowUpDown, 
  Utensils, Shirt, BookOpen, PenTool, Home, Package,
  LayoutGrid, Map as MapIcon, Leaf, CheckCircle2, X
} from 'lucide-react';

export const BrowseDonationsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const newDonationId = searchParams.get('new');

  const { donations, openDonationModal } = useApp();

  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedLocality, setSelectedLocality] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'claimed'>('all');
  const [sortBy, setSortBy] = useState<'urgent' | 'newest' | 'expiring_soon'>('urgent');

  // Extract unique localities
  const localities = useMemo(() => {
    const set = new Set<string>();
    donations.forEach((d) => {
      if (d.locality) set.add(d.locality);
    });
    return Array.from(set);
  }, [donations]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const filteredDonations = useMemo(() => {
    return donations.filter((item) => {
      // Search filter
      const matchesSearch = 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.locality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.donorName.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Locality filter
      if (selectedLocality !== 'all' && item.locality !== selectedLocality) {
        return false;
      }

      // Status filter
      if (statusFilter === 'available' && item.status !== 'available') {
        return false;
      }
      if (statusFilter === 'claimed' && item.status === 'available') {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (newDonationId) {
        if (a.id === newDonationId) return -1;
        if (b.id === newDonationId) return 1;
      }
      if (sortBy === 'urgent') {
        if (a.isUrgent && !b.isUrgent) return -1;
        if (!a.isUrgent && b.isUrgent) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'expiring_soon') {
        const timeA = new Date(a.foodSpecifics?.expiryDeadline || a.availableUntil).getTime();
        const timeB = new Date(b.foodSpecifics?.expiryDeadline || b.availableUntil).getTime();
        return timeA - timeB;
      }
      // newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [donations, searchTerm, selectedCategory, selectedLocality, statusFilter, sortBy, newDonationId]);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'food', name: 'Food' },
    { id: 'clothes', name: 'Clothes' },
    { id: 'books', name: 'Books' },
    { id: 'stationery', name: 'Stationery' },
    { id: 'household', name: 'Household' },
    { id: 'other', name: 'Other' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700 flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5 text-forest-600" />
            <span>Community Giving Exchange</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-950 tracking-tight mt-1">
            Browse Active Donations
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-1.5 max-w-xl leading-relaxed">
            Surplus cooked meals, wearable apparel, and essential goods ready for nearby volunteer collection.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sage-100 text-forest-900 border border-sage-200 text-xs font-semibold self-start md:self-auto shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-peach fill-peach" />
          <span>{donations.filter((d) => d.status === 'available').length} Available for Collection</span>
        </div>
      </div>

      {/* Newly Published Donation Announcement */}
      {newDonationId && (
        <div className="bg-emerald-50/95 border border-emerald-300 rounded-3xl p-5 sm:p-6 text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-soft animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-forest-700 text-white flex items-center justify-center flex-shrink-0 shadow-soft">
              <CheckCircle2 className="w-6 h-6 text-peach" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-forest-950">Your Donation Has Been Published Live!</h4>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-extrabold uppercase tracking-wider">
                  Live on Exchange
                </span>
              </div>
              <p className="text-xs text-forest-800 mt-1">
                It appears directly at the top of the feed below, ready for nearby verified grassroots NGOs to review and claim.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              searchParams.delete('new');
              setSearchParams(searchParams);
            }}
            className="text-xs font-bold text-forest-800 hover:text-forest-950 underline flex-shrink-0"
          >
            Dismiss banner
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-sage-200 shadow-card space-y-4">
        {/* Row 1: Search and Select Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          
          {/* Search Box */}
          <div className="lg:col-span-5 relative">
            <Search className="w-4 h-4 text-charcoal-light absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by meal type, clothes, books, locality..."
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
              aria-label="Filter by Locality"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-sage-300 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white appearance-none"
            >
              <option value="all">All Localities (Bengaluru)</option>
              {localities.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="lg:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              aria-label="Filter by Availability"
              className="w-full px-3.5 py-2.5 rounded-xl border border-sage-300 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available Only</option>
              <option value="claimed">Claimed / In-Progress</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="lg:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort by order"
              className="w-full px-3.5 py-2.5 rounded-xl border border-sage-300 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
            >
              <option value="urgent">Sort: Urgent First</option>
              <option value="newest">Sort: Newly Listed</option>
              <option value="expiring_soon">Sort: Expiring Soonest</option>
            </select>
          </div>
        </div>

        {/* Row 2: Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-forest-600 text-white border-forest-600 shadow-xs'
                    : 'bg-cream text-charcoal hover:bg-sage-100 border-sage-200'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count & View Mode Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-charcoal-muted px-1">
        <div className="flex items-center gap-3">
          <span>Showing <strong className="text-charcoal">{filteredDonations.length}</strong> donation listings</span>
          <span className="text-[11px] text-charcoal-light hidden md:inline">
            * Expired listings are disabled from acceptance to protect food safety.
          </span>
        </div>

        {/* View Switcher: Grid vs Map */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-sage-200 shadow-xs">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              viewMode === 'grid'
                ? 'bg-forest-600 text-white shadow-xs'
                : 'text-charcoal hover:bg-sage-100'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid View</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              viewMode === 'map'
                ? 'bg-forest-600 text-white shadow-xs'
                : 'text-charcoal hover:bg-sage-100'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Map Radar</span>
          </button>
        </div>
      </div>

      {/* Main Content: Map Radar or Donation Grid */}
      {viewMode === 'map' ? (
        <DonationMap 
          donations={filteredDonations} 
          onSelectDonation={(d) => openDonationModal(d)}
        />
      ) : filteredDonations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonations.map((donation) => (
            <DonationCard
              key={donation.id}
              donation={donation}
              isNewlyCreated={donation.id === newDonationId}
              onOpenDetails={() => openDonationModal(donation)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No donations found matching criteria"
          description="Try broadening your locality or category filters, or list a new donation yourself!"
          actionText="Clear All Filters"
          onAction={() => {
            setSearchTerm('');
            setSelectedCategory('all');
            setSelectedLocality('all');
            setStatusFilter('all');
            searchParams.delete('category');
            setSearchParams(searchParams);
          }}
        />
      )}
    </div>
  );
};
