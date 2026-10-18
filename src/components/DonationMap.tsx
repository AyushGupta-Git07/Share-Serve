import React, { useState, useMemo } from 'react';
import { Donation, DonationCategory } from '../types';
import { useApp } from '../context/AppContext';
import { StatusBadge } from './StatusBadge';
import { 
  MapPin, Utensils, Shirt, BookOpen, PenTool, Home as HomeIcon, 
  Package, Clock, AlertCircle, ZoomIn, ZoomOut, RotateCcw, 
  Layers, ExternalLink, Check, ChevronRight, X 
} from 'lucide-react';

interface LocalityCoord {
  name: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  area: string;
}

// Map coordinates calibrated for Bengaluru neighborhoods
const LOCALITY_COORDS: Record<string, { x: number; y: number; area: string }> = {
  'Indiranagar': { x: 58, y: 44, area: 'East' },
  'Koramangala': { x: 55, y: 64, area: 'South-East' },
  'Whitefield': { x: 86, y: 48, area: 'East Zone' },
  'HSR Layout': { x: 62, y: 74, area: 'South-East' },
  'Jayanagar': { x: 42, y: 68, area: 'South' },
  'Malleshwaram': { x: 38, y: 32, area: 'North-West' },
  'Domlur': { x: 56, y: 50, area: 'Central-East' },
  'BTM Layout': { x: 50, y: 76, area: 'South' },
  'MG Road': { x: 48, y: 46, area: 'Central' },
  'Electronic City': { x: 68, y: 90, area: 'South Extension' },
  'Hebbal': { x: 44, y: 20, area: 'North' },
  'Rajajinagar': { x: 32, y: 40, area: 'West' }
};

interface DonationMapProps {
  donations?: Donation[];
  onSelectDonation?: (donation: Donation) => void;
  className?: string;
  height?: string;
}

export const DonationMap: React.FC<DonationMapProps> = ({
  donations: customDonations,
  onSelectDonation,
  className = '',
  height = 'h-[540px]'
}) => {
  const { donations: allDonations, openDonationModal, currentUser, acceptDonation } = useApp();
  const sourceDonations = customDonations || allDonations;

  const [selectedCategory, setSelectedCategory] = useState<DonationCategory | 'all'>('all');
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [selectedLocality, setSelectedLocality] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [urgentOnly, setUrgentOnly] = useState<boolean>(false);

  // Filter donations based on map controls
  const activeDonations = useMemo(() => {
    return sourceDonations.filter((d) => {
      if (selectedCategory !== 'all' && d.category !== selectedCategory) return false;
      if (urgentOnly && !d.isUrgent) return false;
      return true;
    });
  }, [sourceDonations, selectedCategory, urgentOnly]);

  // Group donations by locality
  const localityGroups = useMemo(() => {
    const groups: Record<string, Donation[]> = {};
    activeDonations.forEach((d) => {
      const loc = d.locality || 'Indiranagar';
      if (!groups[loc]) groups[loc] = [];
      groups[loc].push(d);
    });
    return groups;
  }, [activeDonations]);

  const getCategoryColor = (category: DonationCategory) => {
    switch (category) {
      case 'food':
        return { bg: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-emerald-500', ring: 'ring-emerald-200' };
      case 'clothes':
        return { bg: 'bg-indigo-500', text: 'text-indigo-700', border: 'border-indigo-500', ring: 'ring-indigo-200' };
      case 'books':
        return { bg: 'bg-blue-500', text: 'text-blue-700', border: 'border-blue-500', ring: 'ring-blue-200' };
      case 'stationery':
        return { bg: 'bg-amber-500', text: 'text-amber-700', border: 'border-amber-500', ring: 'ring-amber-200' };
      case 'household':
        return { bg: 'bg-teal-500', text: 'text-teal-700', border: 'border-teal-500', ring: 'ring-teal-200' };
      default:
        return { bg: 'bg-gray-500', text: 'text-gray-700', border: 'border-gray-500', ring: 'ring-gray-200' };
    }
  };

  const getCategoryIcon = (category: DonationCategory) => {
    switch (category) {
      case 'food':
        return <Utensils className="w-3.5 h-3.5 text-white" />;
      case 'clothes':
        return <Shirt className="w-3.5 h-3.5 text-white" />;
      case 'books':
        return <BookOpen className="w-3.5 h-3.5 text-white" />;
      case 'stationery':
        return <PenTool className="w-3.5 h-3.5 text-white" />;
      case 'household':
        return <HomeIcon className="w-3.5 h-3.5 text-white" />;
      default:
        return <Package className="w-3.5 h-3.5 text-white" />;
    }
  };

  const handleMarkerClick = (donationsInLoc: Donation[], localityName: string) => {
    setSelectedLocality(localityName);
    if (donationsInLoc.length > 0) {
      setSelectedDonation(donationsInLoc[0]);
    }
  };

  const handleOpenDetails = (donation: Donation) => {
    if (onSelectDonation) {
      onSelectDonation(donation);
    } else {
      openDonationModal(donation);
    }
  };

  const handleAccept = (e: React.MouseEvent, donation: Donation) => {
    e.stopPropagation();
    if (currentUser.role !== 'ngo') return;
    acceptDonation(
      donation.id,
      currentUser.ngoId || 'ngo_robin_hood',
      currentUser.organizationName || 'Verified Partner NGO',
      currentUser.name
    );
  };

  return (
    <div className={`relative bg-cream-50 rounded-3xl border border-sage-200 shadow-card overflow-hidden flex flex-col ${className}`}>
      {/* Top Map Controls Header */}
      <div className="p-4 sm:p-5 bg-white border-b border-sage-200 flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-forest-600 text-white flex items-center justify-center shadow-xs">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-charcoal">Geographic Redistribution Radar</h3>
            <p className="text-[11px] text-charcoal-muted">
              {activeDonations.length} items plotted across Bengaluru neighborhoods
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(['all', 'food', 'clothes', 'books', 'household'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-forest-600 text-white shadow-xs'
                  : 'bg-sage-100 text-charcoal hover:bg-sage-200'
              }`}
            >
              {cat === 'all' ? 'All Goods' : cat}
            </button>
          ))}

          <button
            onClick={() => setUrgentOnly(!urgentOnly)}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
              urgentOnly
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
            }`}
          >
            <AlertCircle className="w-3 h-3" />
            <span>Urgent Only</span>
          </button>
        </div>

        {/* Zoom & Reset Controls */}
        <div className="flex items-center gap-1.5 bg-sage-100 p-1 rounded-xl">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.6))}
            aria-label="Zoom in map"
            className="p-1.5 rounded-lg text-charcoal hover:bg-white transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
            aria-label="Zoom out map"
            className="p-1.5 rounded-lg text-charcoal hover:bg-white transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setZoomLevel(1);
              setSelectedLocality(null);
              setSelectedDonation(null);
            }}
            aria-label="Reset map view"
            className="p-1.5 rounded-lg text-charcoal hover:bg-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Map Visual Stage */}
      <div className={`relative w-full ${height} overflow-hidden bg-[#eaf1ec] select-none`}>
        {/* SVG Geographic Mesh / Road Grid Background */}
        <div 
          className="absolute inset-0 transition-transform duration-300 origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg className="w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#245C46" strokeWidth="0.5" strokeDasharray="2,4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Primary Ring Road Arteries */}
            <circle cx="50%" cy="50%" r="32%" fill="none" stroke="#245C46" strokeWidth="2.5" strokeOpacity="0.3" strokeDasharray="6,6" />
            <circle cx="50%" cy="50%" r="18%" fill="none" stroke="#245C46" strokeWidth="2" strokeOpacity="0.4" />
            {/* Radial Arterial Expressways */}
            <line x1="50%" y1="50%" x2="90%" y2="50%" stroke="#245C46" strokeWidth="2.5" strokeOpacity="0.35" />
            <line x1="50%" y1="50%" x2="65%" y2="92%" stroke="#245C46" strokeWidth="2.5" strokeOpacity="0.35" />
            <line x1="50%" y1="50%" x2="35%" y2="15%" stroke="#245C46" strokeWidth="2" strokeOpacity="0.35" />
            <line x1="50%" y1="50%" x2="25%" y2="65%" stroke="#245C46" strokeWidth="2" strokeOpacity="0.35" />
          </svg>

          {/* Locality Territory Zones & Labels */}
          {Object.entries(LOCALITY_COORDS).map(([locName, coord]) => {
            const items = localityGroups[locName] || [];
            const hasItems = items.length > 0;
            const isSelected = selectedLocality === locName;

            return (
              <div
                key={locName}
                style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
              >
                {/* Locality Radial Pulse if Active */}
                {hasItems && (
                  <div className="absolute -inset-4 rounded-full bg-forest-400/20 animate-ping pointer-events-none" />
                )}

                {/* Marker Button */}
                <button
                  onClick={() => handleMarkerClick(items, locName)}
                  className={`group relative flex items-center justify-center transition-all duration-200 ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-110 z-20'
                  }`}
                  aria-label={`${locName}: ${items.length} donations`}
                >
                  {hasItems ? (
                    <div className="relative">
                      {/* Category Icon Badge */}
                      <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shadow-elevated border-2 border-white ${
                        items[0]?.isUrgent
                          ? 'bg-red-600 text-white animate-bounce'
                          : getCategoryColor(items[0]?.category).bg
                      }`}>
                        {getCategoryIcon(items[0]?.category)}
                      </div>

                      {/* Item Count Chip */}
                      {items.length > 1 && (
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-forest-900 text-white text-[10px] font-extrabold flex items-center justify-center border border-white shadow-xs">
                          {items.length}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full bg-sage-300 border-2 border-white shadow-xs group-hover:bg-forest-400 transition-colors" />
                  )}
                </button>

                {/* Locality Label */}
                <div className={`mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold text-center whitespace-nowrap shadow-xs pointer-events-none transition-all ${
                  isSelected
                    ? 'bg-forest-900 text-white scale-105'
                    : hasItems
                    ? 'bg-white/95 text-forest-950 border border-sage-300'
                    : 'bg-white/70 text-charcoal-muted'
                }`}>
                  {locName}
                  {hasItems && <span className="ml-1 text-forest-600 font-extrabold">({items.length})</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Locality Donation Popover Drawer */}
        {selectedDonation && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-white/95 backdrop-blur-md rounded-2xl border border-sage-300 shadow-elevated p-4 z-40 animate-in fade-in slide-in-from-bottom duration-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  getCategoryColor(selectedDonation.category).bg
                } text-white`}>
                  {selectedDonation.category}
                </span>
                <StatusBadge status={selectedDonation.status} size="sm" />
              </div>

              <button
                onClick={() => setSelectedDonation(null)}
                className="p-1 rounded-lg text-charcoal-muted hover:bg-sage-100"
                aria-label="Close preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-3.5 mt-3 items-center">
              <img
                src={selectedDonation.imageUrl}
                alt={selectedDonation.title}
                className="w-16 h-16 rounded-xl object-cover border border-sage-200 flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=300&auto=format&fit=crop&q=80';
                }}
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-forest-950 line-clamp-1">
                  {selectedDonation.title}
                </h4>
                <p className="text-[11px] text-charcoal-muted mt-0.5 line-clamp-1">
                  {selectedDonation.quantity} • {selectedDonation.locality}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-forest-800 font-semibold mt-1">
                  <Clock className="w-3 h-3 text-forest-600" />
                  <span>Available until {new Date(selectedDonation.availableUntil).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-3.5 pt-3 border-t border-sage-100 flex items-center justify-between gap-2">
              <span className="text-[11px] text-charcoal-light truncate">
                By {selectedDonation.donorName}
              </span>

              <div className="flex items-center gap-1.5">
                {currentUser.role === 'ngo' && selectedDonation.status === 'available' && (
                  <button
                    onClick={(e) => handleAccept(e, selectedDonation)}
                    className="px-3 py-1 rounded-lg bg-forest-600 hover:bg-forest-700 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    Quick Claim
                  </button>
                )}
                <button
                  onClick={() => handleOpenDetails(selectedDonation)}
                  className="px-3 py-1 rounded-lg border border-sage-300 hover:bg-sage-50 text-charcoal text-xs font-medium transition-colors flex items-center gap-1"
                >
                  <span>Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Map Legend Overlay */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl border border-sage-200 shadow-xs pointer-events-none hidden sm:flex items-center gap-3 text-[11px] text-charcoal-muted">
          <span className="font-semibold text-charcoal">Map Key:</span>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Food</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span>Clothes</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Books</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <span>Urgent</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationMap;
