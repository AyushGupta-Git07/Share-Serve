import { Donation, NGO, DemoUser, DonationStatus } from '../types';
import { INITIAL_DONATIONS, INITIAL_NGOS, INITIAL_USERS } from '../data/seedData';

const DONATIONS_STORAGE_KEY = 'shareserve_donations_v1';
const NGOS_STORAGE_KEY = 'shareserve_ngos_v1';
const CURRENT_USER_KEY = 'shareserve_current_user_v1';

// Initialize LocalStorage with seed data if not present
export const initializeStorage = (): void => {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(DONATIONS_STORAGE_KEY)) {
    localStorage.setItem(DONATIONS_STORAGE_KEY, JSON.stringify(INITIAL_DONATIONS));
  }

  if (!localStorage.getItem(NGOS_STORAGE_KEY)) {
    localStorage.setItem(NGOS_STORAGE_KEY, JSON.stringify(INITIAL_NGOS));
  }

  if (!localStorage.getItem(CURRENT_USER_KEY)) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(INITIAL_USERS[0])); // Default: Priya Sharma (Donor)
  }
};

export const storage = {
  // Donations
  getDonations: (): Donation[] => {
    initializeStorage();
    try {
      const data = localStorage.getItem(DONATIONS_STORAGE_KEY);
      if (!data) return INITIAL_DONATIONS;
      const parsed: Donation[] = JSON.parse(data);
      if (!parsed.some((d) => d.id === 'don_food_expired_08')) {
        const expiredSeed = INITIAL_DONATIONS.find((d) => d.id === 'don_food_expired_08');
        if (expiredSeed) {
          parsed.push(expiredSeed);
          localStorage.setItem(DONATIONS_STORAGE_KEY, JSON.stringify(parsed));
        }
      }
      return parsed;
    } catch (e) {
      console.error('Error reading donations from localStorage', e);
      return INITIAL_DONATIONS;
    }
  },

  getDonationById: (id: string): Donation | undefined => {
    const list = storage.getDonations();
    return list.find((d) => d.id === id);
  },

  createDonation: (
    donationData: Omit<Donation, 'id' | 'createdAt' | 'status'>
  ): Donation => {
    const list = storage.getDonations();
    const newDonation: Donation = {
      ...donationData,
      id: `don_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      status: 'available'
    };
    const updated = [newDonation, ...list];
    localStorage.setItem(DONATIONS_STORAGE_KEY, JSON.stringify(updated));
    return newDonation;
  },

  updateDonation: (id: string, updates: Partial<Donation>): Donation => {
    const list = storage.getDonations();
    const index = list.findIndex((d) => d.id === id);
    if (index === -1) {
      throw new Error(`Donation with ID ${id} not found.`);
    }

    const updatedDonation = {
      ...list[index],
      ...updates
    };

    list[index] = updatedDonation;
    localStorage.setItem(DONATIONS_STORAGE_KEY, JSON.stringify(list));
    return updatedDonation;
  },

  updateDonationStatus: (
    id: string,
    status: DonationStatus,
    payload?: Partial<Donation>
  ): Donation => {
    return storage.updateDonation(id, {
      status,
      ...payload
    });
  },

  deleteDonation: (id: string): void => {
    const list = storage.getDonations();
    const updated = list.filter((d) => d.id !== id);
    localStorage.setItem(DONATIONS_STORAGE_KEY, JSON.stringify(updated));
  },

  // NGOs
  getNGOs: (): NGO[] => {
    initializeStorage();
    try {
      const data = localStorage.getItem(NGOS_STORAGE_KEY);
      return data ? JSON.parse(data) : INITIAL_NGOS;
    } catch (e) {
      console.error('Error reading NGOs from localStorage', e);
      return INITIAL_NGOS;
    }
  },

  getNGOById: (id: string): NGO | undefined => {
    const list = storage.getNGOs();
    return list.find((n) => n.id === id);
  },

  updateNGOVerification: (
    id: string,
    verificationStatus: 'verified' | 'pending' | 'rejected'
  ): NGO => {
    const list = storage.getNGOs();
    const index = list.findIndex((n) => n.id === id);
    if (index === -1) {
      throw new Error(`NGO with ID ${id} not found.`);
    }

    const updated = {
      ...list[index],
      verificationStatus
    };
    list[index] = updated;
    localStorage.setItem(NGOS_STORAGE_KEY, JSON.stringify(list));
    return updated;
  },

  // Users & Role Switcher
  getCurrentUser: (): DemoUser => {
    initializeStorage();
    try {
      const data = localStorage.getItem(CURRENT_USER_KEY);
      return data ? JSON.parse(data) : INITIAL_USERS[0];
    } catch {
      return INITIAL_USERS[0];
    }
  },

  setCurrentUser: (user: DemoUser): void => {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  },

  getAllUsers: (): DemoUser[] => {
    return INITIAL_USERS;
  },

  // Reset function to restore demo defaults
  resetDemoData: (): void => {
    localStorage.setItem(DONATIONS_STORAGE_KEY, JSON.stringify(INITIAL_DONATIONS));
    localStorage.setItem(NGOS_STORAGE_KEY, JSON.stringify(INITIAL_NGOS));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(INITIAL_USERS[0]));
  }
};
