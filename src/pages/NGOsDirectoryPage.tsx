import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';
import { DonationCategory } from '../types';
import { 
  Building2, ShieldCheck, MapPin, Phone, Mail, Clock, 
  Search, CheckCircle2, AlertTriangle, ExternalLink, Sparkles 
} from 'lucide-react';

export const NGOsDirectoryPage: React.FC = () => {
  const { ngos } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocality, setSelectedLocality] = useState<string>('all');

  const localities = useMemo(() => {
    const set = new Set<string>();
    ngos.forEach((n) => {
      set.add(n.locality);
      n.serviceAreas.forEach((area) => set.add(area));
    });
    return Array.from(set);
  }, [ngos]);

  const filteredNGOs = useMemo(() => {
    return ngos.filter((ngo) => {
      const matchesSearch = 
        ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ngo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ngo.locality.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedCategory !== 'all') {
        if (!ngo.categoriesAccepted.includes(selectedCategory as DonationCategory)) {
          return false;
        }
      }

      if (selectedLocality !== 'all') {
        const inService = ngo.locality === selectedLocality || ngo.serviceAreas.includes(selectedLocality);
        if (!inService) return false;
      }

      return true;
    });
  }, [ngos, searchTerm, selectedCategory, selectedLocality]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
            Network Directory
          </span>
          <h1 className="text-3xl font-extrabold text-charcoal tracking-tight mt-1">
            Discover Verified NGOs & Community Groups
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-1 max-w-xl">
            Sample grassroots organizations equipped to collect food, clothing, books, and educational supplies.
          </p>
        </div>

        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 max-w-xs">
          <span className="font-bold block">Illustrative Demo Disclaimer:</span>
          NGO profiles shown are simulated partner samples for prototype demonstration.
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-3xl border border-sage-200 shadow-card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-charcoal-light absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by NGO name, mission..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-sage-300 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter by Accepted Category"
              className="w-full px-3.5 py-2.5 rounded-xl border border-sage-300 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
            >
              <option value="all">All Accepted Categories</option>
              <option value="food">Accepts Surplus Food</option>
              <option value="clothes">Accepts Wearable Clothes</option>
              <option value="books">Accepts Books & Textbooks</option>
              <option value="stationery">Accepts School Stationery</option>
              <option value="household">Accepts Household Utensils</option>
            </select>
          </div>

          {/* Locality Filter */}
          <div>
            <select
              value={selectedLocality}
              onChange={(e) => setSelectedLocality(e.target.value)}
              aria-label="Filter by Service Locality"
              className="w-full px-3.5 py-2.5 rounded-xl border border-sage-300 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
            >
              <option value="all">All Service Localities (Bengaluru)</option>
              {localities.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* NGO Cards Grid */}
      {filteredNGOs.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredNGOs.map((ngo) => {
            const isVerified = ngo.verificationStatus === 'verified';
            return (
              <div 
                key={ngo.id}
                className="bg-white rounded-3xl border border-sage-200 shadow-card p-6 sm:p-7 flex flex-col justify-between hover:shadow-elevated hover:border-forest-400 transition-all space-y-5"
              >
                <div>
                  {/* Top Bar with Logo & Verification Badge */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <img 
                        src={ngo.logoUrl} 
                        alt={ngo.name} 
                        className="w-14 h-14 rounded-2xl object-cover border border-sage-200 shadow-xs"
                      />
                      <div>
                        <h3 className="text-lg font-bold text-charcoal">{ngo.name}</h3>
                        <p className="text-xs text-forest-700 font-semibold">{ngo.tagline}</p>
                        <span className="text-[11px] text-charcoal-light">Reg: {ngo.registrationNumber}</span>
                      </div>
                    </div>

                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      isVerified
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : ngo.verificationStatus === 'pending'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-red-50 text-red-800 border-red-200'
                    }`}>
                      {isVerified ? (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Verified Partner</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span className="capitalize">{ngo.verificationStatus} Verification</span>
                        </>
                      )}
                    </span>
                  </div>

                  <p className="text-xs text-charcoal-muted mt-4 leading-relaxed">
                    {ngo.description}
                  </p>

                  {/* Categories Accepted */}
                  <div className="mt-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-light block mb-2">
                      Categories Accepted
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {ngo.categoriesAccepted.map((cat) => (
                        <span 
                          key={cat} 
                          className="px-2.5 py-1 rounded-lg bg-sage-100 text-forest-900 border border-sage-200 text-xs font-medium capitalize"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Service Areas */}
                  <div className="mt-3.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-light block mb-1">
                      Service Areas
                    </span>
                    <div className="flex items-center gap-1 text-xs text-charcoal-muted flex-wrap">
                      <MapPin className="w-3.5 h-3.5 text-forest-600 flex-shrink-0" />
                      <span>{ngo.serviceAreas.join(' • ')}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Info: Contact & Operating Hours */}
                <div className="pt-4 border-t border-sage-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-cream/50 -mx-6 -mb-6 p-5 rounded-b-3xl">
                  <div className="space-y-1">
                    <span className="text-[11px] text-charcoal-light block">Contact Coordinator</span>
                    <p className="font-semibold text-charcoal truncate">{ngo.contactPerson}</p>
                    <a href={`tel:${ngo.phone}`} className="text-forest-700 hover:underline block font-medium">
                      {ngo.phone}
                    </a>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-charcoal-light block">Operating Hours</span>
                    <p className="font-semibold text-charcoal flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-forest-600 flex-shrink-0" />
                      <span>{ngo.operatingHours}</span>
                    </p>
                    <span className="text-[11px] text-charcoal-muted block">
                      {ngo.impactMetrics.completedDrives} verified completed drives
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No NGOs found in this area or category"
          description="Try selecting 'All Categories' or 'All Localities'."
          actionText="Reset Filters"
          onAction={() => {
            setSearchTerm('');
            setSelectedCategory('all');
            setSelectedLocality('all');
          }}
        />
      )}
    </div>
  );
};
