import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Donation, NGO, DemoUser, UserRole, DonationStatus, ToastMessage } from '../types';
import { storage } from '../services/storage';

interface AppContextType {
  currentUser: DemoUser;
  switchRole: (role: UserRole) => void;
  availableUsers: DemoUser[];
  donations: Donation[];
  ngos: NGO[];
  refreshData: () => void;
  createDonation: (donation: Omit<Donation, 'id' | 'createdAt' | 'status'>) => Donation;
  acceptDonation: (donationId: string, ngoId: string, ngoName: string, volunteerName?: string) => boolean;
  updateDonationStatus: (donationId: string, status: DonationStatus, payload?: Partial<Donation>) => void;
  deleteDonation: (donationId: string) => void;
  updateNGOVerification: (ngoId: string, status: 'verified' | 'pending' | 'rejected') => void;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  resetAllDemoData: () => void;
  selectedDonationModal: Donation | null;
  openDonationModal: (donation: Donation) => void;
  closeDonationModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState<DemoUser>(() => storage.getCurrentUser());
  const [donations, setDonations] = useState<Donation[]>(() => storage.getDonations());
  const [ngos, setNgos] = useState<NGO[]>(() => storage.getNGOs());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [selectedDonationModal, setSelectedDonationModal] = useState<Donation | null>(null);

  const availableUsers = storage.getAllUsers();

  const refreshData = () => {
    setDonations(storage.getDonations());
    setNgos(storage.getNGOs());
    setCurrentUserState(storage.getCurrentUser());
    if (selectedDonationModal) {
      const updated = storage.getDonationById(selectedDonationModal.id);
      setSelectedDonationModal(updated || null);
    }
  };

  // Synchronize across browser tabs/windows when localStorage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (
        !e.key ||
        e.key.includes('shareserve_donations') ||
        e.key.includes('shareserve_ngos') ||
        e.key.includes('shareserve_current_user')
      ) {
        refreshData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    const duration = toast.duration || 4500;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const switchRole = (role: UserRole) => {
    const matched = availableUsers.find((u) => u.role === role);
    if (matched) {
      storage.setCurrentUser(matched);
      setCurrentUserState(matched);
      addToast({
        type: 'info',
        title: `Switched demo role to ${role.toUpperCase()}`,
        message: `Now acting as ${matched.name} (${matched.organizationName || 'Community Member'})`
      });
    }
  };

  const createDonation = (donationData: Omit<Donation, 'id' | 'createdAt' | 'status'>): Donation => {
    const created = storage.createDonation(donationData);
    refreshData();
    addToast({
      type: 'success',
      title: 'Donation Listing Published!',
      message: `"${created.title}" is now visible to verified nearby NGOs.`
    });
    return created;
  };

  const acceptDonation = (
    donationId: string,
    ngoId: string,
    ngoName: string,
    volunteerName?: string
  ): boolean => {
    const existing = storage.getDonationById(donationId);
    if (!existing) {
      addToast({
        type: 'error',
        title: 'Listing not found',
        message: 'This donation could not be located.'
      });
      return false;
    }

    if (existing.status !== 'available') {
      addToast({
        type: 'warning',
        title: 'Already Claimed',
        message: `This donation has already been accepted by another NGO.`
      });
      return false;
    }

    const isExpired = (existing.foodSpecifics && new Date(existing.foodSpecifics.expiryDeadline).getTime() < Date.now()) ||
                      new Date(existing.availableUntil).getTime() < Date.now();
    if (isExpired) {
      addToast({
        type: 'error',
        title: 'Cannot Accept Expired Listing',
        message: 'Food listings past their safe availability deadline cannot be accepted under food safety protocols.'
      });
      return false;
    }

    storage.updateDonationStatus(donationId, 'accepted', {
      acceptedByNGOId: ngoId,
      acceptedByNGOName: ngoName,
      acceptedAt: new Date().toISOString(),
      collectionVolunteer: volunteerName || 'Logistics Team'
    });

    refreshData();
    addToast({
      type: 'success',
      title: 'Donation Accepted!',
      message: `You have successfully reserved "${existing.title}". Pickup details are now unlocked.`
    });
    return true;
  };

  const updateDonationStatus = (
    donationId: string,
    status: DonationStatus,
    payload?: Partial<Donation>
  ) => {
    const updated = storage.updateDonationStatus(donationId, status, payload);
    refreshData();

    let title = 'Status Updated';
    let message = `Donation marked as ${status}`;
    if (status === 'collected') {
      title = 'Donation Picked Up';
      message = `Items are now in transit with the NGO volunteer.`;
    } else if (status === 'completed') {
      title = 'Donation Completed & Distributed!';
      message = `Thank you! Surplus goods reached beneficiaries safely.`;
    }

    addToast({
      type: 'success',
      title,
      message
    });
  };

  const deleteDonation = (donationId: string) => {
    storage.deleteDonation(donationId);
    if (selectedDonationModal?.id === donationId) {
      setSelectedDonationModal(null);
    }
    refreshData();
    addToast({
      type: 'info',
      title: 'Listing Removed',
      message: 'The donation listing has been removed from the platform.'
    });
  };

  const updateNGOVerification = (
    ngoId: string,
    status: 'verified' | 'pending' | 'rejected'
  ) => {
    storage.updateNGOVerification(ngoId, status);
    refreshData();
    addToast({
      type: status === 'verified' ? 'success' : 'warning',
      title: `NGO Verification Updated`,
      message: `Organization status set to ${status}.`
    });
  };

  const resetAllDemoData = () => {
    storage.resetDemoData();
    refreshData();
    setSelectedDonationModal(null);
    addToast({
      type: 'info',
      title: 'Demo Data Restored',
      message: 'All sample donations, NGOs, and user roles have been reset to fresh defaults.'
    });
  };

  const openDonationModal = (donation: Donation) => {
    setSelectedDonationModal(donation);
  };

  const closeDonationModal = () => {
    setSelectedDonationModal(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchRole,
        availableUsers,
        donations,
        ngos,
        refreshData,
        createDonation,
        acceptDonation,
        updateDonationStatus,
        deleteDonation,
        updateNGOVerification,
        toasts,
        addToast,
        removeToast,
        resetAllDemoData,
        selectedDonationModal,
        openDonationModal,
        closeDonationModal
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
