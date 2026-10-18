import { useMemo, useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { Donation, DonationCategory, DonationStatus } from '../types';

export interface DonationFilterOptions {
  category?: DonationCategory | 'all';
  status?: DonationStatus | 'all';
  locality?: string | 'all';
  searchQuery?: string;
  isUrgentOnly?: boolean;
  sortBy?: 'urgent' | 'newest' | 'expiring_soon' | 'servings';
}

/**
 * useDonations Hook
 * Reusable donation state logic for filtering, querying, sorting,
 * and performing lifecycle actions across Share&Care views.
 */
export function useDonations(initialFilters?: DonationFilterOptions) {
  const {
    donations,
    currentUser,
    acceptDonation,
    updateDonationStatus,
    deleteDonation,
    openDonationModal,
    addToast
  } = useApp();

  const [filters, setFilters] = useState<DonationFilterOptions>({
    category: 'all',
    status: 'all',
    locality: 'all',
    searchQuery: '',
    isUrgentOnly: false,
    sortBy: 'urgent',
    ...initialFilters
  });

  // Unique localities list derived from active donations
  const localities = useMemo(() => {
    const set = new Set<string>();
    donations.forEach((d) => {
      if (d.locality) set.add(d.locality);
    });
    return Array.from(set).sort();
  }, [donations]);

  // Aggregate metrics
  const metrics = useMemo(() => {
    const available = donations.filter((d) => d.status === 'available');
    const urgent = available.filter((d) => d.isUrgent);
    const food = donations.filter((d) => d.category === 'food' && d.status === 'available');
    const totalServings = food.reduce(
      (sum, d) => sum + (d.foodSpecifics?.servingsCount || 0),
      0
    );

    return {
      totalCount: donations.length,
      availableCount: available.length,
      urgentCount: urgent.length,
      foodCount: food.length,
      totalServings
    };
  }, [donations]);

  // Filtered and sorted donation listings
  const filteredDonations = useMemo(() => {
    return donations
      .filter((item) => {
        // Search filter
        if (filters.searchQuery && filters.searchQuery.trim() !== '') {
          const q = filters.searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchLoc = item.locality.toLowerCase().includes(q);
          const matchDonor = item.donorName.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchLoc && !matchDonor) {
            return false;
          }
        }

        // Category filter
        if (filters.category && filters.category !== 'all' && item.category !== filters.category) {
          return false;
        }

        // Locality filter
        if (filters.locality && filters.locality !== 'all' && item.locality !== filters.locality) {
          return false;
        }

        // Status filter
        if (filters.status && filters.status !== 'all' && item.status !== filters.status) {
          return false;
        }

        // Urgency filter
        if (filters.isUrgentOnly && !item.isUrgent) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'urgent') {
          if (a.isUrgent && !b.isUrgent) return -1;
          if (!a.isUrgent && b.isUrgent) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (filters.sortBy === 'expiring_soon') {
          const timeA = new Date(a.foodSpecifics?.expiryDeadline || a.availableUntil).getTime();
          const timeB = new Date(b.foodSpecifics?.expiryDeadline || b.availableUntil).getTime();
          return timeA - timeB;
        }
        if (filters.sortBy === 'servings') {
          const servingsA = a.foodSpecifics?.servingsCount || 0;
          const servingsB = b.foodSpecifics?.servingsCount || 0;
          return servingsB - servingsA;
        }
        // newest (default fallback)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [donations, filters]);

  // Update specific filter property
  const setFilter = useCallback(<K extends keyof DonationFilterOptions>(
    key: K,
    value: DonationFilterOptions[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Reset all filters to default
  const resetFilters = useCallback(() => {
    setFilters({
      category: 'all',
      status: 'all',
      locality: 'all',
      searchQuery: '',
      isUrgentOnly: false,
      sortBy: 'urgent'
    });
  }, []);

  // Convenient single item lookup
  const getDonation = useCallback(
    (id: string): Donation | undefined => {
      return donations.find((d) => d.id === id);
    },
    [donations]
  );

  // Claim donation action
  const claimDonation = useCallback(
    (donationId: string) => {
      if (currentUser.role !== 'ngo') {
        addToast({
          type: 'warning',
          title: 'NGO Role Required',
          message: 'Please switch to an NGO persona to claim this donation.'
        });
        return false;
      }

      return acceptDonation(
        donationId,
        currentUser.ngoId || 'ngo_robin_hood',
        currentUser.organizationName || 'Verified Partner NGO',
        currentUser.name
      );
    },
    [currentUser, acceptDonation, addToast]
  );

  return {
    donations: filteredDonations,
    allDonations: donations,
    localities,
    metrics,
    filters,
    setFilter,
    setFilters,
    resetFilters,
    getDonation,
    claimDonation,
    updateStatus: updateDonationStatus,
    deleteDonation,
    openDetails: openDonationModal
  };
}

export default useDonations;
