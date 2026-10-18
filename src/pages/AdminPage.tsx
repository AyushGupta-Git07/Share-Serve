import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { 
  ShieldCheck, AlertTriangle, Users, Building2, Package, 
  Check, X, Trash2, RotateCcw, Sparkles, Filter 
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { 
    currentUser, 
    switchRole, 
    availableUsers, 
    ngos, 
    donations, 
    updateNGOVerification, 
    deleteDonation, 
    resetAllDemoData,
    openDonationModal 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'ngos' | 'donations' | 'users'>('overview');

  // Metrics
  const pendingNgos = ngos.filter((n) => n.verificationStatus === 'pending');
  const verifiedNgos = ngos.filter((n) => n.verificationStatus === 'verified');
  const rejectedNgos = ngos.filter((n) => n.verificationStatus === 'rejected');

  const foodCount = donations.filter((d) => d.category === 'food').length;
  const clothesCount = donations.filter((d) => d.category === 'clothes').length;
  const booksCount = donations.filter((d) => d.category === 'books').length;
  const stationeryCount = donations.filter((d) => d.category === 'stationery').length;
  const householdCount = donations.filter((d) => d.category === 'household').length;

  const [donationSearchTerm, setDonationSearchTerm] = useState('');
  const [donationStatusFilter, setDonationStatusFilter] = useState<'all' | 'available' | 'claimed' | 'completed'>('all');

  const filteredDonations = donations.filter((d) => {
    const matchesSearch = 
      d.title.toLowerCase().includes(donationSearchTerm.toLowerCase()) ||
      d.locality.toLowerCase().includes(donationSearchTerm.toLowerCase()) ||
      d.donorName.toLowerCase().includes(donationSearchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (donationStatusFilter === 'available' && d.status !== 'available') return false;
    if (donationStatusFilter === 'claimed' && d.status !== 'accepted' && d.status !== 'collected') return false;
    if (donationStatusFilter === 'completed' && d.status !== 'completed') return false;

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Admin Notice Header */}
      <div className="bg-forest-900 rounded-3xl p-6 sm:p-8 text-cream-100 shadow-elevated flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-forest-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-peach/20 text-peach text-xs font-semibold border border-peach/30 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-peach" />
            <span>Simulated Trust & Verification Admin Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-serif">
            ShareServe Administration & Safety Review
          </h1>
          <p className="text-xs sm:text-sm text-sage-200 mt-1 max-w-xl">
            Simulate administrative oversight: review NGO onboarding credentials, audit food safety compliance, and inspect donation workflows.
          </p>
          <div className="flex items-center gap-2 mt-3 text-[11px] text-sage-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Persistence Engine: LocalStorage live-synced across browser tabs and reloads.</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentUser.role !== 'admin' && (
            <button
              onClick={() => switchRole('admin')}
              className="px-4 py-2.5 rounded-2xl bg-peach text-charcoal font-bold text-xs shadow-soft hover:bg-peach-200 transition-colors"
            >
              Switch to Admin Persona
            </button>
          )}

          <button
            onClick={resetAllDemoData}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-cream border border-white/20 font-bold text-xs flex items-center gap-1.5 transition-colors"
            title="Reset to fresh demo seed"
          >
            <RotateCcw className="w-3.5 h-3.5 text-peach" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-sage-200 pb-3 overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: 'Platform Overview & Stats' },
          { id: 'ngos', label: `NGO Verification Queue (${pendingNgos.length} pending)` },
          { id: 'donations', label: `All Donation Listings (${donations.length})` },
          { id: 'users', label: `Demo Stakeholders (${availableUsers.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-forest-700 text-white shadow-xs'
                : 'text-charcoal hover:bg-sage-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-sage-200 shadow-card">
              <span className="text-xs font-bold text-charcoal-light">Total Listings</span>
              <p className="text-3xl font-extrabold text-forest-950 mt-1">{donations.length}</p>
              <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
                {donations.filter((d) => d.status === 'available').length} ready for pickup
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-sage-200 shadow-card">
              <span className="text-xs font-bold text-charcoal-light">Partner NGOs</span>
              <p className="text-3xl font-extrabold text-forest-950 mt-1">{ngos.length}</p>
              <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
                {verifiedNgos.length} verified • {pendingNgos.length} pending review
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-sage-200 shadow-card">
              <span className="text-xs font-bold text-charcoal-light">Completed Cycles</span>
              <p className="text-3xl font-extrabold text-forest-800 mt-1">
                {donations.filter((d) => d.status === 'completed').length}
              </p>
              <span className="text-[11px] text-charcoal-muted mt-1 block">
                Full chain of custody fulfilled
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-sage-200 shadow-card">
              <span className="text-xs font-bold text-charcoal-light">Safety Compliance</span>
              <p className="text-3xl font-extrabold text-emerald-600 mt-1">100%</p>
              <span className="text-[11px] text-charcoal-muted mt-1 block">
                Timestamps & guidelines enforced
              </span>
            </div>
          </div>

          {/* Category Distribution Breakdown */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-sage-200 shadow-card space-y-5">
            <h3 className="text-base font-bold text-forest-950">
              Redistribution Breakdown by Category
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-xs font-bold text-emerald-800">Surplus Food</span>
                <p className="text-2xl font-extrabold text-emerald-900 mt-1">{foodCount}</p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200">
                <span className="text-xs font-bold text-indigo-800">Clothes</span>
                <p className="text-2xl font-extrabold text-indigo-900 mt-1">{clothesCount}</p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                <span className="text-xs font-bold text-blue-800">Books & Textbooks</span>
                <p className="text-2xl font-extrabold text-blue-900 mt-1">{booksCount}</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <span className="text-xs font-bold text-amber-800">Stationery Kits</span>
                <p className="text-2xl font-extrabold text-amber-900 mt-1">{stationeryCount}</p>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">
                <span className="text-xs font-bold text-teal-800">Household Utensils</span>
                <p className="text-2xl font-extrabold text-teal-900 mt-1">{householdCount}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: NGOs Verification Queue */}
      {activeTab === 'ngos' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-sage-100 border border-sage-300 text-xs text-charcoal flex items-center justify-between shadow-xs">
            <span>
              Manage organization compliance. Approving an NGO allows them to claim surplus food and receive exact donor coordinates. Changes persist across reloads.
            </span>
            <span className="text-forest-800 font-bold hidden sm:inline">Verification Console</span>
          </div>

          <div className="space-y-4">
            {ngos.map((ngo) => (
              <div
                key={ngo.id}
                className="bg-white rounded-3xl border border-sage-200 shadow-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={ngo.logoUrl}
                    alt={ngo.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-sage-200 flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=200&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-forest-950">{ngo.name}</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        ngo.verificationStatus === 'verified'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : ngo.verificationStatus === 'pending'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-red-50 text-red-800 border-red-200'
                      }`}>
                        {ngo.verificationStatus.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs text-charcoal-muted line-clamp-1">{ngo.tagline}</p>
                    <p className="text-xs text-charcoal-light">
                      Registration: <strong>{ngo.registrationNumber}</strong> • Coordinator: {ngo.contactPerson} ({ngo.phone})
                    </p>
                  </div>
                </div>

                {/* Verification Action Buttons */}
                <div className="flex items-center gap-2">
                  {ngo.verificationStatus !== 'verified' && (
                    <button
                      onClick={() => updateNGOVerification(ngo.id, 'verified')}
                      className="px-3.5 py-2 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Check className="w-4 h-4 text-peach" />
                      <span>Approve</span>
                    </button>
                  )}

                  {ngo.verificationStatus !== 'rejected' && (
                    <button
                      onClick={() => updateNGOVerification(ngo.id, 'rejected')}
                      className="px-3.5 py-2 rounded-xl border border-red-300 text-red-700 hover:bg-red-50 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  )}

                  {ngo.verificationStatus !== 'pending' && (
                    <button
                      onClick={() => updateNGOVerification(ngo.id, 'pending')}
                      className="px-3 py-2 rounded-xl border border-sage-300 text-charcoal-light hover:bg-sage-100 text-xs font-medium transition-colors"
                    >
                      Reset to Pending
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: All Donations */}
      {activeTab === 'donations' && (
        <div className="space-y-4">
          {/* Filter Bar for Admin Listings Table */}
          <div className="bg-white p-4 rounded-2xl border border-sage-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
            <input
              type="text"
              placeholder="Filter by listing title, locality, donor..."
              value={donationSearchTerm}
              onChange={(e) => setDonationSearchTerm(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-sage-300 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white sm:w-80"
            />

            <select
              value={donationStatusFilter}
              onChange={(e) => setDonationStatusFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-sage-300 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
            >
              <option value="all">All Statuses ({donations.length})</option>
              <option value="available">Available Only ({donations.filter((d) => d.status === 'available').length})</option>
              <option value="claimed">Claimed / In-Transit ({donations.filter((d) => d.status === 'accepted' || d.status === 'collected').length})</option>
              <option value="completed">Completed Drives ({donations.filter((d) => d.status === 'completed').length})</option>
            </select>
          </div>

          <div className="bg-white rounded-3xl border border-sage-200 shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-sage-100/70 text-charcoal font-bold uppercase tracking-wider text-[11px] border-b border-sage-200">
                  <tr>
                    <th className="p-4">Donation Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Locality</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Claimed By</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage-100">
                  {filteredDonations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-charcoal-muted">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <p className="text-sm font-semibold text-charcoal">No donations match your filter</p>
                          <button
                            onClick={() => {
                              setDonationSearchTerm('');
                              setDonationStatusFilter('all');
                            }}
                            className="text-xs text-forest-700 font-bold hover:underline"
                          >
                            Clear filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredDonations.map((d) => (
                      <tr key={d.id} className="hover:bg-cream-100/60 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-forest-950 max-w-xs truncate">{d.title}</div>
                          <span className="text-[11px] text-charcoal-light">By {d.donorName}</span>
                        </td>
                        <td className="p-4 capitalize">{d.category}</td>
                        <td className="p-4">{d.locality}</td>
                        <td className="p-4">
                          <StatusBadge status={d.status} size="sm" />
                        </td>
                        <td className="p-4">
                          {d.acceptedByNGOName ? (
                            <span className="font-semibold text-forest-800">{d.acceptedByNGOName}</span>
                          ) : (
                            <span className="text-charcoal-light italic">Unclaimed</span>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => openDonationModal(d)}
                            className="px-2.5 py-1.5 rounded-lg border border-sage-300 text-forest-800 hover:bg-sage-50 font-semibold"
                          >
                            View
                          </button>
                          <button
                            onClick={() => deleteDonation(d.id)}
                            className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Users */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {availableUsers.map((user) => (
              <div 
                key={user.id}
                className="bg-white rounded-3xl border border-sage-200 shadow-card p-6 flex flex-col justify-between space-y-4"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-forest-600"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div>
                    <h4 className="text-base font-bold text-charcoal">{user.name}</h4>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-peach-100 text-charcoal font-semibold border border-peach-200 uppercase">
                      {user.role}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-charcoal-muted">
                  <p><strong>Organization:</strong> {user.organizationName || 'Individual Citizen'}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Phone:</strong> {user.phone}</p>
                  <p><strong>Locality:</strong> {user.locality}</p>
                </div>

                <button
                  onClick={() => switchRole(user.role)}
                  className="w-full py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-soft transition-colors"
                >
                  Switch into this Persona
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
