import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Donation, DonationCategory } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { FoodSafetyNotice } from '../components/FoodSafetyNotice';
import { EmptyState } from '../components/EmptyState';
import { 
  Building2, CheckCircle2, Clock, Truck, HeartHandshake, 
  MapPin, Phone, ShieldCheck, AlertCircle, Eye, ArrowRight, 
  Sparkles, Filter, Leaf, ChevronDown, Check, User 
} from 'lucide-react';

export const NGODashboardPage: React.FC = () => {
  const { 
    currentUser, 
    donations, 
    ngos, 
    acceptDonation, 
    updateDonationStatus, 
    openDonationModal, 
    switchRole 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'available' | 'claimed' | 'completed'>('available');
  const [selectedNGOId, setSelectedNGOId] = useState<string>(currentUser.ngoId || ngos[0]?.id || 'ngo_robin_hood');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [volunteerInput, setVolunteerInput] = useState<Record<string, string>>({});
  const [completionNotesInput, setCompletionNotesInput] = useState<Record<string, string>>({});

  const currentNGO = ngos.find((n) => n.id === selectedNGOId) || ngos[0];

  // Available open donations matching category filter
  const availableDonations = donations.filter((d) => {
    if (d.status !== 'available') return false;
    if (categoryFilter !== 'all' && d.category !== categoryFilter) return false;
    return true;
  });

  // Claimed donations by this NGO
  const claimedDonations = donations.filter(
    (d) => (d.acceptedByNGOId === currentNGO.id || d.acceptedByNGOName?.toLowerCase().includes(currentNGO.name.slice(0, 5).toLowerCase())) &&
           (d.status === 'accepted' || d.status === 'collected')
  );

  // Completed drives by this NGO
  const completedDonations = donations.filter(
    (d) => (d.acceptedByNGOId === currentNGO.id || d.acceptedByNGOName?.toLowerCase().includes(currentNGO.name.slice(0, 5).toLowerCase())) &&
           d.status === 'completed'
  );

  const handleClaim = (donation: Donation) => {
    const vol = volunteerInput[donation.id] || `${currentUser.name} (Lead Dispatch)`;
    const success = acceptDonation(donation.id, currentNGO.id, currentNGO.name, vol);
    if (success) {
      setActiveTab('claimed');
    }
  };

  const handleMarkCollected = (donationId: string) => {
    updateDonationStatus(donationId, 'collected', {
      collectedAt: new Date().toISOString()
    });
  };

  const handleMarkCompleted = (donationId: string) => {
    const note = completionNotesInput[donationId] || `Successfully distributed to community beneficiaries by ${currentNGO.name}.`;
    updateDonationStatus(donationId, 'completed', {
      completedAt: new Date().toISOString(),
      completionNotes: note
    });
  };

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'food', label: 'Surplus Food' },
    { id: 'clothes', label: 'Clothes' },
    { id: 'books', label: 'Books' },
    { id: 'stationery', label: 'Stationery' },
    { id: 'household', label: 'Household' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Top Banner with NGO Identity & Interactive Switcher */}
      <div className="bg-forest-900 rounded-3xl p-6 sm:p-8 text-cream-100 shadow-elevated flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border border-forest-800">
        <div className="flex items-center gap-4">
          <img
            src={currentNGO.logoUrl}
            alt={currentNGO.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-soft flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=300&auto=format&fit=crop&q=80';
            }}
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">{currentNGO.name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold flex items-center gap-1 ${
                currentNGO.verificationStatus === 'verified'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="capitalize">{currentNGO.verificationStatus}</span>
              </span>
            </div>
            <p className="text-xs text-sage-200 mt-1">
              Active Coordinator: <strong className="text-white">{currentUser.name}</strong> • {currentNGO.locality}, Bengaluru
            </p>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-sage-300 flex-wrap">
              <span className="font-semibold text-white">Accepts:</span>
              {currentNGO.categoriesAccepted.map((cat) => (
                <span key={cat} className="px-2 py-0.5 rounded-md bg-white/10 text-cream capitalize font-medium">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Console Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
          {/* NGO Organization Switcher */}
          <div className="bg-white/10 p-2 rounded-2xl border border-white/15 w-full sm:w-auto">
            <label className="block text-[10px] uppercase font-bold text-sage-300 px-2 pb-1">
              Switch Represented NGO (Demo)
            </label>
            <select
              value={selectedNGOId}
              onChange={(e) => setSelectedNGOId(e.target.value)}
              className="bg-forest-950/80 text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-peach w-full cursor-pointer"
            >
              {ngos.map((n) => (
                <option key={n.id} value={n.id} className="bg-forest-900 text-white">
                  {n.name} ({n.locality})
                </option>
              ))}
            </select>
          </div>

          {currentUser.role !== 'ngo' && (
            <button
              onClick={() => switchRole('ngo')}
              className="px-4 py-2.5 rounded-2xl bg-peach text-charcoal font-bold text-xs shadow-soft hover:bg-peach-200 transition-colors whitespace-nowrap self-stretch sm:self-auto"
            >
              Set Persona to NGO
            </button>
          )}
        </div>
      </div>

      {/* Primary Action Tabs */}
      <div className="flex items-center justify-between border-b border-sage-200 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'available'
                ? 'bg-forest-700 text-white shadow-xs'
                : 'text-charcoal hover:bg-sage-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-peach" />
            <span>Open Available Donations ({donations.filter((d) => d.status === 'available').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('claimed')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'claimed'
                ? 'bg-forest-700 text-white shadow-xs'
                : 'text-charcoal hover:bg-sage-100'
            }`}
          >
            <Truck className="w-4 h-4 text-peach" />
            <span>Active Pickups In Progress ({claimedDonations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'completed'
                ? 'bg-forest-700 text-white shadow-xs'
                : 'text-charcoal hover:bg-sage-100'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-peach" />
            <span>Completed Drives ({completedDonations.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Available Open Donations */}
      {activeTab === 'available' && (
        <div className="space-y-6">
          {/* Single-Claim Safety Notice */}
          <div className="p-4 rounded-2xl bg-sage-100 border border-sage-300 text-xs text-charcoal flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-forest-700 flex-shrink-0" />
              <span>
                <strong>Single-Claim Protocol:</strong> Claiming an item locks it exclusively to <strong>{currentNGO.name}</strong>, unlocking donor pickup coordinates and removing it from other organizations.
              </span>
            </div>
            <span className="text-[11px] font-bold text-forest-800 bg-white/70 px-3 py-1 rounded-full border border-sage-300 whitespace-nowrap">
              Locking Enforced
            </span>
          </div>

          {/* Category Filter Pills for Open Listings */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-charcoal-light flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-forest-600" />
              <span>Filter:</span>
            </span>
            {categories.map((c) => {
              const isSelected = categoryFilter === c.id;
              const matchesNGOFocus = currentNGO.categoriesAccepted.includes(c.id as DonationCategory);

              return (
                <button
                  key={c.id}
                  onClick={() => setCategoryFilter(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-forest-700 text-white border-forest-800 shadow-xs'
                      : 'bg-white text-charcoal hover:bg-sage-50 border-sage-300'
                  }`}
                >
                  <span>{c.label}</span>
                  {matchesNGOFocus && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Matches your accepted categories" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Open Available Donations Grid */}
          {availableDonations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableDonations.map((d) => {
                const isExpired = (d.foodSpecifics && new Date(d.foodSpecifics.expiryDeadline).getTime() < Date.now()) ||
                                  new Date(d.availableUntil).getTime() < Date.now();
                const matchesNGOFocus = currentNGO.categoriesAccepted.includes(d.category);

                return (
                  <div
                    key={d.id}
                    className={`bg-white rounded-3xl border shadow-card p-6 flex flex-col justify-between hover:border-forest-500 transition-all space-y-4 ${
                      matchesNGOFocus ? 'border-sage-300 ring-1 ring-forest-500/20' : 'border-sage-200'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sage-100 text-forest-900 border border-sage-200">
                            {d.category}
                          </span>
                          {matchesNGOFocus && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold flex items-center gap-1">
                              <Leaf className="w-3 h-3 text-emerald-600" />
                              <span>Matches Mission</span>
                            </span>
                          )}
                        </div>
                        <StatusBadge status={d.status} size="sm" />
                      </div>

                      {/* Image & Title */}
                      <div className="flex items-start gap-4">
                        <img
                          src={d.imageUrl}
                          alt={d.title}
                          className="w-20 h-20 rounded-2xl object-cover border border-sage-200 flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=300&auto=format&fit=crop&q=80';
                          }}
                        />
                        <div>
                          <h3 className="text-base font-bold text-forest-950 leading-snug">{d.title}</h3>
                          <p className="text-xs text-charcoal-muted mt-1 line-clamp-2">{d.description}</p>
                        </div>
                      </div>

                      {/* Quantity & Locality */}
                      <div className="mt-4 pt-3 border-t border-sage-100 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-charcoal-light block">Quantity Available</span>
                          <span className="font-bold text-charcoal">{d.quantity}</span>
                        </div>
                        <div>
                          <span className="text-charcoal-light block">Pickup Locality</span>
                          <span className="font-bold text-charcoal flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-forest-600" />
                            {d.locality}
                          </span>
                        </div>
                      </div>

                      {d.category === 'food' && (
                        <div className="mt-3">
                          <FoodSafetyNotice foodSpecifics={d.foodSpecifics} compact />
                        </div>
                      )}
                    </div>

                    {/* Single-Claim Dispatch Footer */}
                    <div className="pt-3 border-t border-sage-100 space-y-2.5">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <input
                          type="text"
                          placeholder="Dispatch volunteer (e.g. Ramesh - Van #4)"
                          value={volunteerInput[d.id] || ''}
                          onChange={(e) =>
                            setVolunteerInput({ ...volunteerInput, [d.id]: e.target.value })
                          }
                          className="flex-1 px-3 py-2 text-xs rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                        />
                        <button
                          onClick={() => handleClaim(d)}
                          disabled={isExpired}
                          className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-soft transition-all flex items-center justify-center gap-1.5 ${
                            isExpired
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-forest-700 hover:bg-forest-800 text-white'
                          }`}
                        >
                          <HeartHandshake className="w-3.5 h-3.5 text-peach" />
                          <span>{isExpired ? 'Expired' : 'Claim for Pickup'}</span>
                        </button>
                      </div>

                      <button
                        onClick={() => openDonationModal(d)}
                        className="w-full text-center text-xs text-forest-700 hover:underline font-semibold py-1"
                      >
                        Inspect Full Listing Details & Requirements
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="No open donations found for this category"
              description="Check back shortly or view other categories in Bengaluru."
              actionText="View All Open Categories"
              onAction={() => setCategoryFilter('all')}
            />
          )}
        </div>
      )}

      {/* Tab 2: Claimed & In-Transit Pickups */}
      {activeTab === 'claimed' && (
        <div className="space-y-4">
          {claimedDonations.length > 0 ? (
            <div className="space-y-5">
              {claimedDonations.map((d) => (
                <div
                  key={d.id}
                  className="bg-white rounded-3xl border border-amber-300 shadow-card p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={d.imageUrl}
                      alt={d.title}
                      className="w-24 h-24 rounded-2xl object-cover border border-sage-200 flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=300&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <StatusBadge status={d.status} size="sm" />
                        <span className="text-xs font-bold text-charcoal">
                          Claimed at {d.acceptedAt ? new Date(d.acceptedAt).toLocaleTimeString() : 'Recently'}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-semibold border border-amber-200">
                          Locked to {currentNGO.name}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-forest-950">{d.title}</h3>

                      {/* Unlocked Contact and Exact Pickup Address */}
                      <div className="p-4 rounded-2xl bg-forest-50/70 border border-forest-200 text-xs text-forest-950 space-y-1.5">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-forest-700 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong>Exact Street Pickup Address:</strong>
                            <p className="text-forest-900 font-medium">{d.pickupAddress}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 pt-1">
                          <span className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-forest-700" />
                            <span>Contact: <strong>{d.contactName}</strong></span>
                          </span>

                          <a
                            href={`tel:${d.contactPhone}`}
                            className="font-bold text-forest-700 underline flex items-center gap-1 hover:text-forest-900"
                          >
                            <Phone className="w-3.5 h-3.5 text-forest-700" />
                            <span>{d.contactPhone}</span>
                          </a>
                        </div>

                        {d.collectionVolunteer && (
                          <div className="text-charcoal-muted pt-1 border-t border-forest-200/50">
                            Assigned Dispatch: <strong className="text-charcoal">{d.collectionVolunteer}</strong>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Progressive Lifecycle Buttons */}
                  <div className="flex flex-col gap-2.5 w-full lg:w-72 flex-shrink-0">
                    {d.status === 'accepted' && (
                      <button
                        onClick={() => handleMarkCollected(d.id)}
                        className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-soft transition-colors flex items-center justify-center gap-2"
                      >
                        <Truck className="w-4 h-4" />
                        <span>Confirm Volunteer Picked Up</span>
                      </button>
                    )}

                    {d.status === 'collected' && (
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Distribution notes (optional)"
                          value={completionNotesInput[d.id] || ''}
                          onChange={(e) =>
                            setCompletionNotesInput({ ...completionNotesInput, [d.id]: e.target.value })
                          }
                          className="w-full px-3 py-2 text-xs rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                        />
                        <button
                          onClick={() => handleMarkCompleted(d.id)}
                          className="w-full py-3 rounded-2xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs shadow-soft transition-colors flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4 text-peach" />
                          <span>Confirm Delivered & Distributed</span>
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => openDonationModal(d)}
                      className="w-full py-2 rounded-xl border border-sage-300 hover:bg-sage-100 text-xs font-semibold text-charcoal transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Stepper & Donor Info</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No active pickups currently claimed"
              description="Head to the 'Open Available Donations' tab to reserve items for your beneficiaries."
              actionText="Browse Available Listings"
              onAction={() => setActiveTab('available')}
            />
          )}
        </div>
      )}

      {/* Tab 3: Completed Drives */}
      {activeTab === 'completed' && (
        <div className="space-y-4">
          {completedDonations.length > 0 ? (
            <div className="space-y-4">
              {completedDonations.map((d) => (
                <div
                  key={d.id}
                  className="bg-white rounded-3xl border border-sage-200 shadow-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={d.imageUrl}
                      alt={d.title}
                      className="w-16 h-16 rounded-2xl object-cover border border-sage-200 flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=300&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status="completed" size="sm" />
                        <span className="text-xs text-charcoal-muted">
                          {d.completedAt ? new Date(d.completedAt).toLocaleDateString() : 'Completed'}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-charcoal mt-1">{d.title}</h4>
                      <p className="text-xs text-forest-800 font-medium">
                        {d.completionNotes || 'Redistributed to community beneficiaries'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => openDonationModal(d)}
                    className="px-4 py-2 rounded-xl border border-sage-300 hover:bg-sage-100 text-xs font-semibold text-charcoal"
                  >
                    View Record
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No completed drives yet"
              description="Completed distribution runs will appear here as permanent impact logs."
            />
          )}
        </div>
      )}
    </div>
  );
};

export default NGODashboardPage;
