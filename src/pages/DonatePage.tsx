import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DonationCategory, FoodType, DietaryType } from '../types';
import { CATEGORY_PRESET_IMAGES } from '../data/seedData';
import { FoodSafetyNotice } from '../components/FoodSafetyNotice';
import { 
  Heart, HandHeart, Sparkles, Utensils, Shirt, BookOpen, PenTool, Home as HomeIcon, 
  Package, AlertCircle, CheckCircle2, Clock, MapPin, Phone, 
  Image as ImageIcon, ShieldAlert, Leaf, Check, ArrowRight 
} from 'lucide-react';

const BENGALURU_LOCALITIES = [
  'Indiranagar',
  'Koramangala',
  'Whitefield',
  'HSR Layout',
  'Jayanagar',
  'Malleshwaram',
  'Domlur',
  'BTM Layout',
  'MG Road',
  'Electronic City',
  'Hebbal',
  'Rajajinagar',
  'Sadashivanagar',
  'Marathahalli',
  'Yelahanka'
];

export const DonatePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paramCategory = searchParams.get('category') as DonationCategory;
  const initialCategory: DonationCategory = 
    ['food', 'clothes', 'books', 'stationery', 'household', 'other'].includes(paramCategory)
      ? paramCategory
      : 'food';

  const { currentUser, createDonation } = useApp();

  const [category, setCategory] = useState<DonationCategory>(initialCategory);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [locality, setLocality] = useState(currentUser.locality?.split(',')[0].trim() || 'Indiranagar');
  const [city] = useState('Bengaluru');
  const [contactName, setContactName] = useState(currentUser.name || '');
  const [contactPhone, setContactPhone] = useState(currentUser.phone || '');
  const [contactEmail, setContactEmail] = useState(currentUser.email || '');
  const [donorType, setDonorType] = useState<'individual' | 'restaurant' | 'event_organizer' | 'corporate' | 'school'>('individual');
  const [isUrgent, setIsUrgent] = useState(false);
  
  // Image selection
  const [selectedImageUrl, setSelectedImageUrl] = useState(
    (CATEGORY_PRESET_IMAGES[initialCategory] || CATEGORY_PRESET_IMAGES['food'])[0]
  );
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Food specific fields
  const [foodType, setFoodType] = useState<FoodType>('cooked_meals');
  const [dietaryType, setDietaryType] = useState<DietaryType>('veg');
  const [prepTime, setPrepTime] = useState(
    new Date(Date.now() - 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [expiryDeadline, setExpiryDeadline] = useState(
    new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [servingsCount, setServingsCount] = useState<number>(35);
  const [storageNotes, setStorageNotes] = useState('Sealed in insulated thermal food containers. Maintained hot.');
  const [temperatureControlled, setTemperatureControlled] = useState(true);
  const [allergens, setAllergens] = useState('');

  // Availability times for non-food
  const [availableFrom, setAvailableFrom] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [availableUntil, setAvailableUntil] = useState(
    new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update image when category changes if user hasn't typed custom URL
  const handleCategoryChange = (newCat: DonationCategory) => {
    setCategory(newCat);
    if (!customImageUrl) {
      const presets = CATEGORY_PRESET_IMAGES[newCat] || CATEGORY_PRESET_IMAGES['other'];
      setSelectedImageUrl(presets[0]);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required (e.g. 50 Veg Biryani Meal Boxes)';
    } else if (title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters.';
    }

    if (!description.trim()) {
      newErrors.description = 'Please provide a clear description of the items and their condition.';
    } else if (description.trim().length < 10) {
      newErrors.description = 'Please provide a slightly more descriptive note (at least 10 characters).';
    }

    if (!quantity.trim()) {
      newErrors.quantity = 'Please specify quantity (e.g. 3 cartons, 50 portions).';
    }

    if (!pickupAddress.trim()) {
      newErrors.pickupAddress = 'Full pickup street address is required for volunteer pickup.';
    }

    if (!locality.trim()) {
      newErrors.locality = 'Neighborhood locality is required.';
    }

    if (!contactName.trim()) {
      newErrors.contactName = 'Contact person name is required.';
    }

    if (!contactPhone.trim()) {
      newErrors.contactPhone = 'Valid contact phone number is required.';
    } else if (contactPhone.replace(/\D/g, '').length < 8) {
      newErrors.contactPhone = 'Please provide a valid phone number (at least 8 digits).';
    }

    if (category === 'food') {
      if (!prepTime) {
        newErrors.prepTime = 'Food preparation time is required.';
      }

      if (!expiryDeadline) {
        newErrors.expiryDeadline = 'Safe pickup deadline is required.';
      } else {
        const prepTimestamp = new Date(prepTime).getTime();
        const expiryTimestamp = new Date(expiryDeadline).getTime();

        if (expiryTimestamp <= prepTimestamp) {
          newErrors.expiryDeadline = 'Expiry deadline must be after preparation time.';
        }
        if (expiryTimestamp <= Date.now()) {
          newErrors.expiryDeadline = 'Expiry deadline must be in the future.';
        }
      }

      if (!servingsCount || servingsCount <= 0) {
        newErrors.servingsCount = 'Servings count must be at least 1 portion.';
      }
    } else {
      const fromTimestamp = new Date(availableFrom).getTime();
      const untilTimestamp = new Date(availableUntil).getTime();

      if (untilTimestamp <= fromTimestamp) {
        newErrors.availableUntil = 'Available until date must be after available from date.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    const activeImage = customImageUrl.trim() || selectedImageUrl;

    const newDonation = createDonation({
      title: title.trim(),
      category,
      description: description.trim(),
      quantity: quantity.trim(),
      pickupAddress: pickupAddress.trim(),
      locality: locality.trim(),
      city,
      contactName: contactName.trim(),
      contactPhone: contactPhone.trim(),
      contactEmail: contactEmail.trim(),
      donorId: currentUser.id,
      donorName: currentUser.name,
      donorType,
      imageUrl: activeImage,
      availableFrom: category === 'food' ? new Date(prepTime).toISOString() : new Date(availableFrom).toISOString(),
      availableUntil: category === 'food' ? new Date(expiryDeadline).toISOString() : new Date(availableUntil).toISOString(),
      isUrgent,
      foodSpecifics: category === 'food' ? {
        foodType,
        dietaryType,
        prepTime: new Date(prepTime).toISOString(),
        expiryDeadline: new Date(expiryDeadline).toISOString(),
        servingsCount: Number(servingsCount),
        storageNotes: storageNotes.trim(),
        temperatureControlled,
        allergens: allergens ? allergens.split(',').map((s) => s.trim()) : undefined,
        safeConsumptionHours: Math.max(1, Math.round((new Date(expiryDeadline).getTime() - new Date(prepTime).getTime()) / (1000 * 60 * 60)))
      } : undefined
    });

    setIsSubmitting(false);

    // Navigate to Browse Donations with 'new' param so user immediately sees their listing
    navigate(`/donations?new=${newDonation.id}`);
  };

  // Calculate hours of safe consumption for food helper display
  const calculatedHours = category === 'food' && prepTime && expiryDeadline
    ? Math.max(1, Math.round((new Date(expiryDeadline).getTime() - new Date(prepTime).getTime()) / (1000 * 60 * 60)))
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Page Header */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sage-100 text-forest-900 border border-sage-200 text-xs font-semibold shadow-xs">
          <Heart className="w-3.5 h-3.5 fill-peach text-forest-700" />
          <span>Community Giving Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-950 tracking-tight mt-1">
          Share What You Have with Your Community
        </h1>
        <p className="text-sm text-charcoal-muted max-w-2xl leading-relaxed">
          Provide accurate details below. Verified grassroots organizations in your neighborhood will be alerted to claim and coordinate safe, respectful pickup.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Step 1: Category Selection */}
        <div className="bg-white p-7 sm:p-8 rounded-3xl border border-sage-200/90 shadow-card space-y-4">
          <label className="text-xs font-bold uppercase tracking-wider text-forest-800 flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5 text-forest-600" />
            <span>1. What Are You Donating?</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { id: 'food', name: 'Surplus Food', icon: Utensils },
              { id: 'clothes', name: 'Clothes', icon: Shirt },
              { id: 'books', name: 'Books', icon: BookOpen },
              { id: 'stationery', name: 'Stationery', icon: PenTool },
              { id: 'household', name: 'Household', icon: HomeIcon },
              { id: 'other', name: 'Other Essentials', icon: Package },
            ].map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.id as DonationCategory)}
                  className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2.5 ${
                    isSelected
                      ? 'bg-forest-700 text-white border-forest-700 shadow-soft scale-[1.02]'
                      : 'bg-white hover:bg-sage-50 text-forest-950 border-sage-200 hover:border-forest-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-bold">{cat.name}</span>
                </button>
              );
            })}
          </div>

          {category === 'food' && (
            <div className="pt-2">
              <FoodSafetyNotice />
            </div>
          )}
        </div>

        {/* Step 2: Food Specific Safety Details (Visible if category === 'food') */}
        {category === 'food' && (
          <div className="bg-white p-7 sm:p-8 rounded-3xl border border-sage-200/90 shadow-card space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-sage-100">
              <ShieldAlert className="w-5 h-5 text-amber-700" />
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-forest-950">
                  2. Food Safety & Consumption Timelines (Mandatory)
                </h3>
                <p className="text-[11px] text-charcoal-muted">
                  Protects recipients and ensures verified NGOs can safely distribute meals in time.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-semibold text-charcoal block mb-1">
                  Food Type *
                </label>
                <select
                  value={foodType}
                  onChange={(e) => setFoodType(e.target.value as FoodType)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sage-300 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                >
                  <option value="cooked_meals">Cooked Banquet / Catered Meals</option>
                  <option value="bakery">Bakery / Bread / Buns</option>
                  <option value="packaged_food">Packaged / Sealed Food Trays</option>
                  <option value="fresh_produce">Fresh Produce / Fruits</option>
                  <option value="raw_grains">Raw Grains / Grocery Pantry</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal block mb-1">
                  Dietary Category *
                </label>
                <select
                  value={dietaryType}
                  onChange={(e) => setDietaryType(e.target.value as DietaryType)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sage-300 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                >
                  <option value="veg">Vegetarian (Pure Veg)</option>
                  <option value="non-veg">Non-Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="jain">Jain (No Root Vegetables)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal block mb-1">
                  When Was It Cooked / Prepared? *
                </label>
                <input
                  type="datetime-local"
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white ${
                    errors.prepTime ? 'border-red-500 ring-1 ring-red-500' : 'border-sage-300'
                  }`}
                />
                {errors.prepTime && <p className="text-[11px] text-red-600 mt-1">{errors.prepTime}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal block mb-1">
                  Strict Pickup Deadline (Safe Expiry) *
                </label>
                <input
                  type="datetime-local"
                  value={expiryDeadline}
                  onChange={(e) => setExpiryDeadline(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white ${
                    errors.expiryDeadline ? 'border-red-500 ring-1 ring-red-500' : 'border-sage-300'
                  }`}
                />
                {errors.expiryDeadline && <p className="text-[11px] text-red-600 mt-1">{errors.expiryDeadline}</p>}
                {calculatedHours && !errors.expiryDeadline && (
                  <span className="text-[11px] text-forest-700 font-medium mt-1 block">
                    ✓ Safe consumption window: approximately {calculatedHours} hours
                  </span>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal block mb-1">
                  Estimated Portions / Servings *
                </label>
                <input
                  type="number"
                  min="1"
                  value={servingsCount}
                  onChange={(e) => setServingsCount(Number(e.target.value))}
                  placeholder="e.g. 50"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white ${
                    errors.servingsCount ? 'border-red-500' : 'border-sage-300'
                  }`}
                />
                {errors.servingsCount && <p className="text-[11px] text-red-600 mt-1">{errors.servingsCount}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal block mb-1">
                  Allergen Notice (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dairy (Paneer), Peanuts, Gluten"
                  value={allergens}
                  onChange={(e) => setAllergens(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sage-300 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-charcoal block mb-1">
                  Storage & Packaging Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Held in commercial thermal insulated pots above 65°C"
                  value={storageNotes}
                  onChange={(e) => setStorageNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sage-300 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                />
              </div>

              <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="tempControl"
                  checked={temperatureControlled}
                  onChange={(e) => setTemperatureControlled(e.target.checked)}
                  className="w-4 h-4 text-forest-700 rounded border-sage-300 focus:ring-forest-500"
                />
                <label htmlFor="tempControl" className="text-xs text-charcoal font-medium">
                  Currently stored in thermal hot-box, refrigerator, or clean temperature-controlled container
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 (Non-Food): Pickup Timing Window */}
        {category !== 'food' && (
          <div className="bg-white p-7 sm:p-8 rounded-3xl border border-sage-200/90 shadow-card space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-forest-950 pb-2 border-b border-sage-100 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-forest-600" />
              <span>2. Pickup Availability Window</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-charcoal block mb-1">
                  Available for Pickup From
                </label>
                <input
                  type="datetime-local"
                  value={availableFrom}
                  onChange={(e) => setAvailableFrom(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sage-300 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal block mb-1">
                  Available Until *
                </label>
                <input
                  type="datetime-local"
                  value={availableUntil}
                  onChange={(e) => setAvailableUntil(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white ${
                    errors.availableUntil ? 'border-red-500' : 'border-sage-300'
                  }`}
                />
                {errors.availableUntil && <p className="text-[11px] text-red-600 mt-1">{errors.availableUntil}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Item Overview & Quantity */}
        <div className="bg-white p-7 sm:p-8 rounded-3xl border border-sage-200/90 shadow-card space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-forest-950 pb-2 border-b border-sage-100 flex items-center gap-1.5">
            <Package className="w-4 h-4 text-forest-600" />
            <span>{category === 'food' ? '3. Food Details & Quantity' : '3. Item Overview & Quantity'}</span>
          </h3>

          <div>
            <label className="text-xs font-semibold text-charcoal block mb-1">
              Listing Title *
            </label>
            <input
              type="text"
              placeholder={category === 'food' ? "e.g. Surplus 75 Veg Biryani & Paneer Curry Meal Boxes" : "e.g. 4 Cartons of Clean Winter Woolens & Blankets"}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white ${
                errors.title ? 'border-red-500 ring-1 ring-red-500' : 'border-sage-300'
              }`}
            />
            {errors.title && <p className="text-[11px] text-red-600 mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-charcoal block mb-1">
                Quantity & Packaging Details *
              </label>
              <input
                type="text"
                placeholder="e.g. 60 sealed meal boxes, 3 large cardboard boxes"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white ${
                  errors.quantity ? 'border-red-500 ring-1 ring-red-500' : 'border-sage-300'
                }`}
              />
              {errors.quantity && <p className="text-[11px] text-red-600 mt-1">{errors.quantity}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal block mb-1">
                Donor Entity Type
              </label>
              <select
                value={donorType}
                onChange={(e) => setDonorType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-sage-300 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
              >
                <option value="individual">Individual / Household</option>
                <option value="event_organizer">Wedding / Event Organizer</option>
                <option value="restaurant">Restaurant / Bakery / Cafe</option>
                <option value="corporate">Corporate Office / CSR</option>
                <option value="school">School / College</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal block mb-1">
              Detailed Description & Condition Notes *
            </label>
            <textarea
              rows={3}
              placeholder="Describe items, condition, hygiene measures, packaging, or special pickup notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white ${
                errors.description ? 'border-red-500 ring-1 ring-red-500' : 'border-sage-300'
              }`}
            />
            {errors.description && <p className="text-[11px] text-red-600 mt-1">{errors.description}</p>}
          </div>

          {/* Photo Picker */}
          <div>
            <label className="text-xs font-semibold text-charcoal block mb-2">
              Listing Photo (Select documentary preset or paste custom URL)
            </label>
            <div className="flex flex-wrap gap-3 items-center mb-3">
              {(CATEGORY_PRESET_IMAGES[category] || CATEGORY_PRESET_IMAGES['other']).map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setSelectedImageUrl(img);
                    setCustomImageUrl('');
                  }}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImageUrl === img && !customImageUrl
                      ? 'border-forest-700 ring-2 ring-forest-500/30 scale-105'
                      : 'border-sage-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={img} 
                    alt="Preset choice" 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=200&auto=format&fit=crop&q=80';
                    }}
                  />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="url"
                placeholder="Or paste external image URL (https://...)"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl border border-sage-300 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Step 4: Pickup Location & Contact Info */}
        <div className="bg-white p-7 sm:p-8 rounded-3xl border border-sage-200/90 shadow-card space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-forest-950 pb-2 border-b border-sage-100 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-forest-600" />
            <span>4. Pickup Location & Coordination</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-charcoal block mb-1">
                Locality / Area *
              </label>
              <select
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white ${
                  errors.locality ? 'border-red-500 ring-1 ring-red-500' : 'border-sage-300'
                }`}
              >
                {BENGALURU_LOCALITIES.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              {errors.locality && <p className="text-[11px] text-red-600 mt-1">{errors.locality}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal block mb-1">
                City
              </label>
              <input
                type="text"
                value={city}
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl border border-sage-200 text-xs text-charcoal-muted bg-sage-50 cursor-not-allowed"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-charcoal block mb-1">
                Full Street Pickup Address *
              </label>
              <input
                type="text"
                placeholder="e.g. Grand Orchid Banquet Hall, 14th Main Road, Indiranagar, Gate 2"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white ${
                  errors.pickupAddress ? 'border-red-500 ring-1 ring-red-500' : 'border-sage-300'
                }`}
              />
              {errors.pickupAddress && <p className="text-[11px] text-red-600 mt-1">{errors.pickupAddress}</p>}
              <span className="text-[11px] text-charcoal-light mt-1 block">
                🔒 Privacy safe: Exact street address and phone number are revealed only to verified NGOs upon confirmed claim.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-charcoal block mb-1">
                Contact Person *
              </label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Your Name"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white ${
                  errors.contactName ? 'border-red-500' : 'border-sage-300'
                }`}
              />
              {errors.contactName && <p className="text-[11px] text-red-600 mt-1">{errors.contactName}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal block mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white ${
                  errors.contactPhone ? 'border-red-500' : 'border-sage-300'
                }`}
              />
              {errors.contactPhone && <p className="text-[11px] text-red-600 mt-1">{errors.contactPhone}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal block mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="contact@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-sage-300 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isUrgent"
              checked={isUrgent}
              onChange={(e) => setIsUrgent(e.target.checked)}
              className="w-4 h-4 text-forest-700 rounded border-sage-300 focus:ring-forest-500"
            />
            <label htmlFor="isUrgent" className="text-xs text-charcoal font-semibold cursor-pointer">
              Mark as Priority Collection (Highlights listing to emergency food volunteers)
            </label>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-sage-300 text-charcoal text-xs font-bold hover:bg-white transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-forest-700 hover:bg-forest-800 text-white font-extrabold text-sm shadow-soft hover:shadow-elevated transition-all flex items-center justify-center gap-2 active:scale-95 hover:-translate-y-0.5 disabled:opacity-50"
          >
            <CheckCircle2 className="w-5 h-5 text-peach" />
            <span>{isSubmitting ? 'Publishing...' : 'Publish Donation Listing'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};

export default DonatePage;
