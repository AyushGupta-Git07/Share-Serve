import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { StatusStepper } from '../components/StatusStepper';
import { EmptyState } from '../components/EmptyState';
import { 
  PlusCircle, Sparkles, Clock, CheckCircle2, PackageCheck, 
  Trash2, Eye, MapPin, AlertCircle, Heart, Building2, Truck, 
  Leaf, Users, Calendar, ArrowRight 
} from 'lucide-react';

export const DonorDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, donations, openDonationModal, deleteDonation } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'accepted' | 'completed'>('all');
  const [viewScope, setViewScope] = useState<'mine' | 'all'>('mine');

  // Filter donations belonging to current user or default donor Priya Sharma
  const myDonations = donations.filter(
    (d) => d.donorId === currentUser.id || d.donorName.toLowerCase().includes(currentUser.name.split(' ')[0].toLowerCase())
  );

  const displayList = viewScope === 'mine' 
    ? (myDonations.length > 0 ? myDonations : donations.filter((d) => d.donorId === 'user_donor_1'))
    : donations;

  const activeCount = displayList.filter((d) => d.status === 'available').length;
  const acceptedCount = displayList.filter((d) => d.status === 'accepted' || d.status === 'collected').length;
  const completedCount = displayList.filter((d) => d.status === 'completed').length;
  const totalCount = displayList.length;

  const totalFoodPortions = displayList
    .filter((d) => d.category === 'food' && d.foodSpecifics)
    .reduce((acc, d) => acc + (d.foodSpecifics?.servingsCount || 0), 0);

  const filteredList = displayList.filter((d) => {
    if (activeTab === 'active') return d.status === 'available';
    if (activeTab === 'accepted') return d.status === 'accepted' || d.status === 'collected';
    if (activeTab === 'completed') return d.status === 'completed';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Top Welcome Banner */}
      <div className="bg-forest-900 rounded-3xl p-6 sm:p-8 text-cream-100 shadow-elevated flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-forest-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-peach text-xs font-semibold border border-white/10">
            <Heart className="w-3.5 h-3.5 fill-peach text-forest-900" />
            <span>Community Giving Tracker</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-serif">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-sage-200 max-w-xl leading-relaxed">
            Track what you've shared with your community. Once a nearby verified NGO claims your listing, you'll see their coordinator info and pickup dispatch here in real time.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Link
            to="/donate"
            className="px-5 py-3 rounded-2xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs shadow-soft transition-all duration-200 flex items-center justify-center gap-2 border border-forest-600 whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4 text-peach" />
            <span>Post New Donation</span>
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-sage-200 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal-light">Total Registered</span>
            <div className="p-2 rounded-xl bg-sage-100 text-forest-800">
              <Sparkles className="w-4 h-4 text-forest-700" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-forest-950 mt-2">{totalCount}</p>
          <span className="text-[11px] text-charcoal-muted mt-1 block">
            {totalFoodPortions > 0 ? `~${totalFoodPortions} meal portions recorded` : 'All items tracked'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-sage-200 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal-light">Active & Open</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <Clock className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-2">{activeCount}</p>
          <span className="text-[11px] text-charcoal-muted mt-1 block">Awaiting NGO pickup claim</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-sage-200 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal-light">Claimed / In Transit</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-800">
              <PackageCheck className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-700 mt-2">{acceptedCount}</p>
          <span className="text-[11px] text-charcoal-muted mt-1 block">Volunteer dispatch locked</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-sage-200 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal-light">Completed Drives</span>
            <div className="p-2 rounded-xl bg-forest-50 text-forest-800">
              <CheckCircle2 className="w-4 h-4 text-forest-700" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-forest-800 mt-2">{completedCount}</p>
          <span className="text-[11px] text-charcoal-muted mt-1 block">Delivered to beneficiaries</span>
        </div>
      </div>

      {/* Scope Switcher and Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-sage-200 pb-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full sm:w-auto">
          {[
            { id: 'all', label: `All (${totalCount})` },
            { id: 'active', label: `Open / Available (${activeCount})` },
            { id: 'accepted', label: `In Transit (${acceptedCount})` },
            { id: 'completed', label: `Completed (${completedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-forest-700 text-white shadow-xs'
                  : 'text-charcoal hover:bg-sage-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scope Toggle: My Listings vs All Listings */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-sage-200 shadow-xs self-stretch sm:self-auto justify-center">
          <button
            onClick={() => setViewScope('mine')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              viewScope === 'mine'
                ? 'bg-forest-700 text-white shadow-xs'
                : 'text-charcoal-muted hover:text-charcoal hover:bg-sage-50'
            }`}
          >
            My Contributions ({currentUser.role === 'donor' ? myDonations.length : (myDonations.length > 0 ? myDonations.length : donations.filter((d) => d.donorId === 'user_donor_1').length)})
          </button>
          <button
            onClick={() => setViewScope('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              viewScope === 'all'
                ? 'bg-forest-700 text-white shadow-xs'
                : 'text-charcoal-muted hover:text-charcoal hover:bg-sage-50'
            }`}
          >
            All Platform Data ({donations.length})
          </button>
        </div>
      </div>

      {/* Listings Cards */}
      {filteredList.length > 0 ? (
        <div className="space-y-4">
          {filteredList.map((donation) => (
            <div
              key={donation.id}
              className="bg-white rounded-3xl border border-sage-200 shadow-card p-5 sm:p-6 hover:border-forest-400 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <img
                  src={donation.imageUrl}
                  alt={donation.title}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-sage-200 flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=300&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sage-100 text-forest-900 border border-sage-200">
                      {donation.category}
                    </span>
                    <StatusBadge status={donation.status} size="sm" />
                    {donation.isUrgent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                        Priority
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-forest-950 truncate">
                    {donation.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-charcoal-muted">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-forest-600 flex-shrink-0" />
                      <span>{donation.locality}</span>
                    </span>
                    <span>Quantity: <strong className="text-charcoal">{donation.quantity}</strong></span>
                    <span>Listed: {new Date(donation.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Claimed NGO Notice */}
                  {donation.acceptedByNGOName && (
                    <div className="mt-2 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex flex-wrap items-center gap-3">
                      <span className="font-bold flex items-center gap-1.5 text-amber-900">
                        <Building2 className="w-3.5 h-3.5 text-amber-700" />
                        <span>Reserved by: {donation.acceptedByNGOName}</span>
                      </span>

                      {donation.collectionVolunteer && (
                        <span className="text-charcoal-muted">
                          Dispatch: <strong>{donation.collectionVolunteer}</strong>
                        </span>
                      )}

                      {donation.status === 'collected' && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 font-bold text-[10px]">
                          Volunteer In Transit
                        </span>
                      )}

                      {donation.status === 'completed' && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-bold text-[10px] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          <span>Safely Distributed</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions & Stepper Progress */}
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 w-full md:w-auto justify-end flex-shrink-0">
                <button
                  onClick={() => openDonationModal(donation)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-forest-600 text-forest-800 hover:bg-forest-50 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Eye className="w-4 h-4 text-forest-700" />
                  <span>View Details & Timeline</span>
                </button>

                {donation.status === 'available' && (
                  <button
                    onClick={() => deleteDonation(donation.id)}
                    className="p-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                    title="Cancel Listing"
                    aria-label="Cancel listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No donations found in this section"
          description="List your surplus food or essentials to connect with nearby verified grassroots NGOs."
          actionText="Create a Donation Listing"
          onAction={() => navigate('/donate')}
        />
      )}
    </div>
  );
};

export default DonorDashboardPage;
