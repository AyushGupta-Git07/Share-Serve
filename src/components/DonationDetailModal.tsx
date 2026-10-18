import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from './StatusBadge';
import { StatusStepper } from './StatusStepper';
import { FoodSafetyNotice } from './FoodSafetyNotice';
import { 
  X, MapPin, Calendar, Clock, Phone, Mail, User, ShieldCheck, 
  AlertCircle, CheckCircle2, Truck, Sparkles, Building, Trash2 
} from 'lucide-react';

export const DonationDetailModal: React.FC = () => {
  const { 
    selectedDonationModal, 
    closeDonationModal, 
    currentUser, 
    acceptDonation, 
    updateDonationStatus,
    deleteDonation 
  } = useApp();

  const [volunteerNameInput, setVolunteerNameInput] = useState('');
  const [completionNotesInput, setCompletionNotesInput] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDonationModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeDonationModal]);

  if (!selectedDonationModal) return null;
  const d = selectedDonationModal;

  const isExpired = (d.foodSpecifics && new Date(d.foodSpecifics.expiryDeadline).getTime() < Date.now()) ||
                    new Date(d.availableUntil).getTime() < Date.now();
  const isAssignedToCurrentNGO = currentUser.role === 'ngo' && 
    (d.acceptedByNGOId === currentUser.ngoId || 
     (d.acceptedByNGOName && currentUser.organizationName && d.acceptedByNGOName.toLowerCase().includes(currentUser.organizationName.toLowerCase())));
  const canAccept = currentUser.role === 'ngo' && d.status === 'available' && !isExpired;

  const handleAccept = () => {
    acceptDonation(
      d.id,
      currentUser.ngoId || 'ngo_robin_hood',
      currentUser.organizationName || 'Verified Partner NGO',
      volunteerNameInput.trim() || currentUser.name
    );
  };

  const handleMarkCollected = () => {
    updateDonationStatus(d.id, 'collected', {
      collectedAt: new Date().toISOString(),
      collectionVolunteer: volunteerNameInput.trim() || d.collectionVolunteer || currentUser.name
    });
  };

  const handleMarkCompleted = () => {
    updateDonationStatus(d.id, 'completed', {
      completedAt: new Date().toISOString(),
      completionNotes: completionNotesInput.trim() || 'Items successfully redistributed to verified beneficiaries.'
    });
  };

  const handleDelete = () => {
    deleteDonation(d.id);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-charcoal/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="fixed inset-0" 
        onClick={closeDonationModal}
        aria-hidden="true"
      />

      <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-sage-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header Media */}
        <div className="relative h-64 sm:h-72 w-full bg-sage-100 overflow-hidden">
          <img 
            src={d.imageUrl} 
            alt={d.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-transparent" />

          {/* Close button */}
          <button
            onClick={closeDonationModal}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 hover:bg-white text-charcoal shadow-soft backdrop-blur-md transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Overlay Info */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md border border-white/30">
                {d.category}
              </span>
              <StatusBadge status={d.status} size="md" />
              {d.isUrgent && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white animate-pulse">
                  Urgent Need
                </span>
              )}
            </div>
            <h2 id="modal-title" className="text-xl sm:text-2xl font-bold leading-tight">
              {d.title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[calc(85vh-18rem)] overflow-y-auto">
          {/* Stepper */}
          <div className="bg-sage-50/70 p-4 rounded-2xl border border-sage-200">
            <StatusStepper donation={d} />
          </div>

          {/* Food Safety Callout if Category is Food */}
          {d.category === 'food' && (
            <FoodSafetyNotice foodSpecifics={d.foodSpecifics} />
          )}

          {/* Description & Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-light">Description</h4>
            <p className="text-sm text-charcoal-muted mt-1.5 leading-relaxed whitespace-pre-line">
              {d.description}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-cream/70 p-5 rounded-2xl border border-sage-200 text-xs">
            <div>
              <span className="text-charcoal-light block">Quantity Available</span>
              <span className="text-sm font-bold text-charcoal mt-0.5 block">{d.quantity}</span>
            </div>

            <div>
              <span className="text-charcoal-light block">Pickup Locality</span>
              <span className="text-sm font-bold text-charcoal mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-forest-600 flex-shrink-0" />
                {d.locality}, {d.city}
              </span>
            </div>

            <div>
              <span className="text-charcoal-light block">Pickup Window</span>
              <span className="font-semibold text-charcoal mt-0.5 block">
                {new Date(d.availableFrom).toLocaleDateString()} to{' '}
                {new Date(d.availableUntil).toLocaleDateString()}
              </span>
            </div>

            <div>
              <span className="text-charcoal-light block">Donor Category</span>
              <span className="font-semibold text-charcoal capitalize mt-0.5 block">
                {d.donorType.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Pickup Address & Contact Details */}
          <div className="rounded-2xl border border-sage-200 p-5 bg-white space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-forest-700" />
              <span>Full Pickup Address & Contact Coordination</span>
            </h4>

            {d.status === 'available' && currentUser.role !== 'admin' && currentUser.id !== d.donorId ? (
              <div className="bg-sage-50/70 p-4 rounded-xl border border-sage-200 text-xs text-charcoal-muted flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-forest-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-charcoal">Privacy Guard Active:</span> Exact street address, gate code and donor phone number are unlocked immediately upon acceptance by a verified NGO partner to prevent unwanted traffic.
                  <p className="mt-1 font-medium text-forest-800">
                    Locality: <span className="font-bold">{d.locality}, {d.city}</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-forest-50/50 border border-forest-200/60">
                  <span className="text-[11px] text-charcoal-light block">Exact Pickup Address</span>
                  <p className="text-sm font-semibold text-forest-950 mt-0.5">
                    {d.pickupAddress}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-sage-50 border border-sage-200">
                    <span className="text-[11px] text-charcoal-light block">Contact Person</span>
                    <p className="font-bold text-charcoal mt-0.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-forest-600" />
                      {d.contactName} ({d.donorName})
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-sage-50 border border-sage-200">
                    <span className="text-[11px] text-charcoal-light block">Phone Number</span>
                    <a 
                      href={`tel:${d.contactPhone}`}
                      className="font-bold text-forest-700 hover:underline mt-0.5 flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-forest-600" />
                      {d.contactPhone}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Assigned NGO details if accepted */}
          {d.acceptedByNGOName && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 text-xs space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
                Claiming NGO Partner
              </span>
              <p className="text-sm font-bold text-charcoal flex items-center gap-2">
                <Building className="w-4 h-4 text-amber-700" />
                {d.acceptedByNGOName}
              </p>
              {d.collectionVolunteer && (
                <p className="text-charcoal-muted">
                  Assigned Volunteer / Vehicle: <span className="font-semibold text-charcoal">{d.collectionVolunteer}</span>
                </p>
              )}
              {d.completionNotes && (
                <div className="mt-2 pt-2 border-t border-amber-200 text-charcoal-muted">
                  <span className="font-bold text-charcoal">Redistribution Notes:</span> {d.completionNotes}
                </div>
              )}
            </div>
          )}

          {/* NGO Workflow Actions inside Modal */}
          {currentUser.role === 'ngo' && (
            <div className="p-5 rounded-2xl border-2 border-forest-500/30 bg-forest-50/40 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-forest-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-forest-700" />
                <span>NGO Coordination Console</span>
              </h4>

              {canAccept && (
                <div className="space-y-3">
                  <p className="text-xs text-charcoal-muted leading-relaxed">
                    By accepting, your organization commits to dispatching a volunteer to collect this donation before the stated deadline.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input 
                      type="text"
                      placeholder="Volunteer / Vehicle details (e.g. Ramesh - Van KA04)"
                      value={volunteerNameInput}
                      onChange={(e) => setVolunteerNameInput(e.target.value)}
                      className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                    />
                    <button
                      onClick={handleAccept}
                      className="px-5 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs shadow-soft transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-peach" />
                      <span>Accept This Donation</span>
                    </button>
                  </div>
                </div>
              )}

              {!canAccept && !isAssignedToCurrentNGO && d.status !== 'available' && (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 text-xs text-amber-950 flex items-start gap-3 shadow-xs">
                  <ShieldCheck className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-950 block">Single-Claim Lock Active</span>
                    <p className="text-amber-900 mt-0.5 leading-relaxed">
                      This donation is currently locked and reserved by <strong>{d.acceptedByNGOName || 'another verified partner organization'}</strong>.
                      To maintain donor trust and prevent duplicate dispatches, only one NGO partner can claim any donation.
                    </p>
                  </div>
                </div>
              )}

              {isExpired && d.status === 'available' && (
                <div className="p-4 bg-red-50 rounded-2xl border border-red-300 text-xs text-red-950 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-red-950 block">Listing Expired</span>
                    <p className="text-red-900 mt-0.5 leading-relaxed">
                      This donation has passed its safe consumption deadline and can no longer be claimed for pickup under food safety rules.
                    </p>
                  </div>
                </div>
              )}

              {isAssignedToCurrentNGO && d.status === 'accepted' && (
                <div className="space-y-3">
                  <p className="text-xs text-charcoal-muted">
                    When your team arrives at the pickup address and receives the items, update status to notify the donor.
                  </p>
                  <button
                    onClick={handleMarkCollected}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-soft transition-colors flex items-center justify-center gap-2"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Confirm Items Picked Up (In Transit)</span>
                  </button>
                </div>
              )}

              {isAssignedToCurrentNGO && d.status === 'collected' && (
                <div className="space-y-3">
                  <p className="text-xs text-charcoal-muted">
                    Finalize this donation once items have been served or distributed to the community.
                  </p>
                  <input 
                    type="text"
                    placeholder="Brief notes (e.g. Served 80 meals at City Care Shelter)"
                    value={completionNotesInput}
                    onChange={(e) => setCompletionNotesInput(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                  />
                  <button
                    onClick={handleMarkCompleted}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs shadow-soft transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark Donation Completed & Distributed</span>
                  </button>
                </div>
              )}

              {d.status === 'completed' && (
                <div className="p-3 bg-emerald-100/70 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <span>This donation cycle is completed. Thank you for your community impact!</span>
                </div>
              )}
            </div>
          )}

          {/* Delete / Cancel Option for Donor or Admin */}
          {(currentUser.id === d.donorId || currentUser.role === 'admin') && (
            <div className="pt-2 border-t border-sage-200 flex items-center justify-between">
              {showConfirmDelete ? (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-red-700 font-semibold">Delete permanently?</span>
                  <button
                    onClick={handleDelete}
                    className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setShowConfirmDelete(false)}
                    className="px-3 py-1.5 rounded-lg border border-sage-300 text-charcoal"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowConfirmDelete(true)}
                  className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-medium transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Listing</span>
                </button>
              )}

              <button
                onClick={closeDonationModal}
                className="px-4 py-2 rounded-xl border border-sage-300 hover:bg-sage-100 text-xs font-semibold text-charcoal transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
