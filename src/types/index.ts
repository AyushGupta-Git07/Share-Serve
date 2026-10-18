export type DonationCategory = 
  | 'food' 
  | 'clothes' 
  | 'books' 
  | 'stationery' 
  | 'household' 
  | 'other';

export type DonationStatus = 
  | 'available' 
  | 'accepted' 
  | 'collected' 
  | 'completed' 
  | 'cancelled';

export type FoodType = 
  | 'cooked_meals' 
  | 'packaged_food' 
  | 'fresh_produce' 
  | 'bakery' 
  | 'raw_grains';

export type DietaryType = 'veg' | 'non-veg' | 'vegan' | 'jain';

export interface FoodSpecifics {
  foodType: FoodType;
  dietaryType: DietaryType;
  prepTime: string; // ISO date-time string
  expiryDeadline: string; // ISO date-time string
  servingsCount: number;
  storageNotes: string; // e.g., "Stored in food-grade hot cases"
  handlingGuidelines?: string;
  temperatureControlled: boolean;
  allergens?: string[];
  safeConsumptionHours: number;
}

export interface Donation {
  id: string;
  title: string;
  category: DonationCategory;
  description: string;
  quantity: string; // e.g. "45 hot meal packs", "3 bags of children clothes"
  pickupAddress: string;
  locality: string;
  city: string;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  donorId: string;
  donorName: string;
  donorType: 'individual' | 'restaurant' | 'event_organizer' | 'corporate' | 'school';
  status: DonationStatus;
  imageUrl: string;
  createdAt: string; // ISO string
  availableFrom: string;
  availableUntil: string;
  isUrgent?: boolean;
  
  // Specific to food donations
  foodSpecifics?: FoodSpecifics;
  
  // NGO acceptance & workflow tracking
  acceptedByNGOId?: string;
  acceptedByNGOName?: string;
  acceptedAt?: string;
  collectedAt?: string;
  completedAt?: string;
  completionNotes?: string;
  collectionVolunteer?: string;
}

export interface NGO {
  id: string;
  name: string;
  registrationNumber: string;
  tagline: string;
  description: string;
  logoUrl: string;
  locality: string;
  city: string;
  serviceAreas: string[];
  categoriesAccepted: DonationCategory[];
  contactPerson: string;
  phone: string;
  email: string;
  website?: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  operatingHours: string;
  establishedYear: number;
  impactMetrics: {
    mealsServed: number;
    itemsDistributed: number;
    completedDrives: number;
  };
}

export type UserRole = 'donor' | 'ngo' | 'admin';

export interface DemoUser {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  organizationName?: string;
  ngoId?: string; // If role is NGO
  avatarUrl: string;
  locality: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
  duration?: number;
}
