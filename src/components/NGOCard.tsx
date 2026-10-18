import React from 'react';
import { Link } from 'react-router-dom';
import { NGO } from '../types';
import { ShieldCheck, AlertTriangle, MapPin, Clock, Phone, Building2, Leaf, Heart, HeartHandshake } from 'lucide-react';

interface NGOCardProps {
  ngo: NGO;
  onContact?: (ngo: NGO) => void;
  showAdminActions?: boolean;
}

export const NGOCard: React.FC<NGOCardProps> = ({ ngo, onContact, showAdminActions = false }) => {
  const isVerified = ngo.verificationStatus === 'verified';

  return (
    <div className="bg-white rounded-3xl border border-sage-200/90 shadow-card p-7 flex flex-col justify-between hover:shadow-elevated hover:border-forest-400 transition-all duration-300 hover:-translate-y-0.5 space-y-6">
      <div>
        {/* Top Header: Logo, Name, Verification Badge */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <img 
              src={ngo.logoUrl} 
              alt={ngo.name} 
              className="w-14 h-14 rounded-2xl object-cover border border-sage-200 shadow-xs"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=150&auto=format&fit=crop&q=80';
              }}
            />
            <div>
              <h3 className="text-lg font-bold text-forest-950">{ngo.name}</h3>
              <p className="text-xs text-forest-700 font-semibold">{ngo.tagline}</p>
              <span className="text-[11px] text-charcoal-light">Reg: {ngo.registrationNumber}</span>
            </div>
          </div>

          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
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

        <p className="text-xs sm:text-sm text-charcoal-muted mt-4 leading-relaxed font-normal">
          {ngo.description}
        </p>

        {/* Categories Accepted */}
        <div className="mt-5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-light block mb-2 flex items-center gap-1.5">
            <Leaf className="w-3 h-3 text-forest-600" />
            <span>Categories Accepted</span>
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
        <div className="mt-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-light block mb-1">
            Service Areas
          </span>
          <div className="flex items-center gap-1 text-xs text-charcoal-muted flex-wrap">
            <MapPin className="w-3.5 h-3.5 text-forest-600 flex-shrink-0" />
            <span>{ngo.serviceAreas.join(' • ')}</span>
          </div>
        </div>
      </div>

      {/* Footer Details: Coordinator & Operating Hours */}
      <div className="pt-4 border-t border-sage-100 space-y-4 bg-cream/70 -mx-7 -mb-7 p-6 rounded-b-3xl border-t border-sage-200/60">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <span className="text-[11px] text-charcoal-light block font-medium">Contact Coordinator</span>
            <p className="font-semibold text-charcoal truncate">{ngo.contactPerson}</p>
            <a href={`tel:${ngo.phone}`} className="text-forest-700 hover:underline block font-semibold">
              {ngo.phone}
            </a>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-charcoal-light block font-medium">Operating Hours</span>
            <p className="font-semibold text-charcoal flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-forest-600 flex-shrink-0" />
              <span>{ngo.operatingHours}</span>
            </p>
            <span className="text-[11px] text-charcoal-muted block flex items-center gap-1">
              <Heart className="w-3 h-3 text-peach fill-peach/40" />
              <span>{ngo.impactMetrics.completedDrives} verified completed drives</span>
            </span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-sage-200/80">
          <Link
            to={`/donate?category=${ngo.categoriesAccepted[0] || 'food'}`}
            className="flex-1 py-2 px-3 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <HeartHandshake className="w-3.5 h-3.5 text-peach" />
            <span>Donate Matching Goods</span>
          </Link>
          <a
            href={`tel:${ngo.phone}`}
            className="py-2 px-3 rounded-xl border border-sage-300 hover:bg-sage-100 text-forest-900 text-xs font-semibold transition-colors flex items-center gap-1"
            title={`Call coordinator at ${ngo.phone}`}
          >
            <Phone className="w-3.5 h-3.5 text-forest-700" />
            <span>Call Coordinator</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NGOCard;
