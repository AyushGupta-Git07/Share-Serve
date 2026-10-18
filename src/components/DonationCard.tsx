import React from 'react';
import { Donation } from '../types';
import { useApp } from '../context/AppContext';
import { StatusBadge } from './StatusBadge';
import { 
  MapPin, Clock, Utensils, Shirt, BookOpen, PenTool, Home as HomeIcon, 
  Package, AlertCircle, Heart, HandHeart, Leaf, Sparkles 
} from 'lucide-react';

interface DonationCardProps {
  donation: Donation;
  onOpenDetails?: () => void;
  showManageActions?: boolean;
  isNewlyCreated?: boolean;
}

export const DonationCard: React.FC<DonationCardProps> = ({ 
  donation, 
  onOpenDetails,
  showManageActions = false,
  isNewlyCreated = false 
}) => {
  const { currentUser, acceptDonation, openDonationModal } = useApp();

  const handleCardClick = () => {
    if (onOpenDetails) {
      onOpenDetails();
    } else {
      openDonationModal(donation);
    }
  };

  const getCategoryIcon = () => {
    switch (donation.category) {
      case 'food':
        return <Utensils className="w-3.5 h-3.5" />;
      case 'clothes':
        return <Shirt className="w-3.5 h-3.5" />;
      case 'books':
        return <BookOpen className="w-3.5 h-3.5" />;
      case 'stationery':
        return <PenTool className="w-3.5 h-3.5" />;
      case 'household':
        return <HomeIcon className="w-3.5 h-3.5" />;
      default:
        return <Package className="w-3.5 h-3.5" />;
    }
  };

  const getCategoryColor = () => {
    switch (donation.category) {
      case 'food':
        return 'bg-emerald-50/90 text-emerald-900 border-emerald-200';
      case 'clothes':
        return 'bg-indigo-50/90 text-indigo-900 border-indigo-200';
      case 'books':
        return 'bg-blue-50/90 text-blue-900 border-blue-200';
      case 'stationery':
        return 'bg-amber-50/90 text-amber-900 border-amber-200';
      case 'household':
        return 'bg-teal-50/90 text-teal-900 border-teal-200';
      default:
        return 'bg-sage-50 text-forest-900 border-sage-200';
    }
  };

  // Remaining time calculation
  const calculateTimeRemaining = () => {
    const deadline = donation.foodSpecifics?.expiryDeadline || donation.availableUntil;
    const diff = new Date(deadline).getTime() - Date.now();
    if (diff <= 0) return { text: 'Expired', isExpired: true, isNear: false };

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return { text: `${days}d window`, isExpired: false, isNear: false };
    }
    if (hours > 0) {
      return { text: `${hours}h ${minutes}m left`, isExpired: false, isNear: hours < 3 };
    }
    return { text: `${minutes}m left`, isExpired: false, isNear: true };
  };

  const timeRemaining = calculateTimeRemaining();

  const handleQuickAccept = (e: React.MouseEvent) => {
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
    <div 
      onClick={handleCardClick}
      className={`group relative bg-white rounded-3xl border shadow-card hover:shadow-elevated transition-all duration-300 flex flex-col overflow-hidden cursor-pointer hover:border-forest-400 hover:-translate-y-0.5 ${
        isNewlyCreated 
          ? 'border-forest-500 ring-2 ring-forest-500/40 shadow-elevated' 
          : 'border-sage-200/90'
      }`}
    >
      {/* Top Media Section */}
      <div className="relative aspect-[16/10] overflow-hidden bg-sage-100">
        <img 
          src={donation.imageUrl} 
          alt={donation.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&auto=format&fit=crop&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent opacity-70" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold backdrop-blur-md border uppercase tracking-wider ${getCategoryColor()}`}>
              {getCategoryIcon()}
              <span>{donation.category}</span>
            </span>

            {isNewlyCreated && (
              <span className="inline-flex items-center gap-1 bg-forest-800 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full shadow-xs border border-forest-600 animate-pulse">
                <Sparkles className="w-3 h-3 text-peach" />
                <span>Just Listed</span>
              </span>
            )}
          </div>

          <StatusBadge status={donation.status} size="sm" />
        </div>

        {/* Time Remaining / Urgency Overlay */}
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white text-xs font-medium">
          <span className="flex items-center gap-1.5 bg-forest-950/75 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] border border-white/10">
            <Clock className="w-3.5 h-3.5 text-peach" />
            <span className={timeRemaining.isNear ? 'text-peach font-bold' : 'text-sage-100'}>
              {timeRemaining.text}
            </span>
          </span>

          {donation.isUrgent && (
            <span className="inline-flex items-center gap-1 bg-peach/95 text-forest-950 font-bold px-2.5 py-1 rounded-full text-[11px] shadow-xs">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Priority Collection</span>
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-base font-bold text-forest-950 group-hover:text-forest-700 transition-colors line-clamp-2 leading-snug">
            {donation.title}
          </h3>

          <p className="text-xs text-charcoal-muted mt-2 line-clamp-2 leading-relaxed font-normal">
            {donation.description}
          </p>

          <div className="mt-4 pt-3.5 border-t border-sage-100 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[11px] text-charcoal-light font-medium block">Quantity</span>
              <span className="font-semibold text-charcoal truncate block">
                {donation.quantity}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-charcoal-light font-medium block">Locality</span>
              <span className="font-semibold text-charcoal truncate flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-forest-600 flex-shrink-0" />
                <span className="truncate">{donation.locality}</span>
              </span>
            </div>
          </div>

          {/* Food-specific safety quick badge */}
          {donation.category === 'food' && donation.foodSpecifics && (
            <div className="mt-3 px-3 py-1.5 rounded-xl bg-sage-50 border border-sage-200/80 flex items-center justify-between text-[11px]">
              <span className="text-forest-800 font-semibold capitalize flex items-center gap-1">
                <Leaf className="w-3 h-3 text-forest-600" />
                <span>{donation.foodSpecifics.dietaryType} • {donation.foodSpecifics.foodType.replace('_', ' ')}</span>
              </span>
              <span className="text-charcoal-muted font-medium">
                {donation.foodSpecifics.servingsCount} portions
              </span>
            </div>
          )}
        </div>

        {/* Action Button Footer */}
        <div className="pt-3.5 border-t border-sage-100 flex items-center justify-between gap-2">
          <div className="text-[11px] text-charcoal-light truncate flex items-center gap-1">
            <span>By</span>
            <span className="font-semibold text-charcoal truncate">{donation.donorName}</span>
          </div>

          <div className="flex items-center gap-2">
            {currentUser.role === 'ngo' && donation.status === 'available' && (
              timeRemaining.isExpired ? (
                <span 
                  className="px-3 py-1.5 rounded-xl bg-red-50 text-red-700 text-xs font-bold border border-red-200 cursor-not-allowed flex items-center gap-1"
                  title="Past safe consumption deadline — food safety pickup prohibited"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Expired</span>
                </span>
              ) : (
                <button
                  onClick={handleQuickAccept}
                  className="px-3.5 py-1.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1"
                  title="Reserve this item for volunteer pickup"
                >
                  <HandHeart className="w-3.5 h-3.5 text-peach" />
                  <span>Claim</span>
                </button>
              )
            )}

            <button
              onClick={handleCardClick}
              className="px-3.5 py-1.5 rounded-xl border border-sage-300 hover:border-forest-500 hover:bg-sage-50 text-forest-900 text-xs font-medium transition-colors"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationCard;
