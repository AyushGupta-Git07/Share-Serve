import React from 'react';
import { ShieldAlert, Info, AlertTriangle } from 'lucide-react';
import { FoodSpecifics } from '../types';

interface FoodSafetyNoticeProps {
  foodSpecifics?: FoodSpecifics;
  compact?: boolean;
}

export const FoodSafetyNotice: React.FC<FoodSafetyNoticeProps> = ({ 
  foodSpecifics, 
  compact = false 
}) => {
  const isExpired = foodSpecifics && new Date(foodSpecifics.expiryDeadline).getTime() < Date.now();

  if (compact) {
    return (
      <div className={`flex items-start gap-2 p-2.5 rounded-lg border text-xs ${
        isExpired 
          ? 'bg-red-50 border-red-200 text-red-800' 
          : 'bg-amber-50/70 border-amber-200/80 text-amber-900'
      }`}>
        <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-700" />
        <div>
          <span className="font-semibold">Food Safety Standard:</span>{' '}
          {isExpired ? (
            <span className="font-medium text-red-700">Deadline elapsed. This item cannot be accepted for consumption.</span>
          ) : (
            <span>Inspect temperature, sealed packaging, and freshness before distribution.</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-amber-100 text-amber-800 flex-shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-amber-950 flex items-center gap-2">
            ShareServe Food Safety & Integrity Protocol
          </h4>
          <p className="text-xs text-amber-900/90 mt-1 leading-relaxed">
            Listing on ShareServe does not automatically certify food safety. Donors and collecting organizations must strictly verify hygiene, safe holding temperatures (hot food &gt;60°C, cold food &lt;4°C), and timely distribution.
          </p>
        </div>
      </div>

      {foodSpecifics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-amber-200/60 text-xs">
          <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200/40">
            <span className="text-charcoal-muted block text-[11px]">Preparation Time</span>
            <span className="font-medium text-charcoal">
              {new Date(foodSpecifics.prepTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (
              {new Date(foodSpecifics.prepTime).toLocaleDateString()})
            </span>
          </div>

          <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200/40">
            <span className="text-charcoal-muted block text-[11px]">Strict Pickup Deadline</span>
            <span className={`font-semibold ${isExpired ? 'text-red-700' : 'text-charcoal'}`}>
              {new Date(foodSpecifics.expiryDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (
              {new Date(foodSpecifics.expiryDeadline).toLocaleDateString()})
              {isExpired && ' — EXPIRED'}
            </span>
          </div>

          {foodSpecifics.storageNotes && (
            <div className="sm:col-span-2 bg-white/80 p-2.5 rounded-lg border border-amber-200/40">
              <span className="text-charcoal-muted block text-[11px]">Storage & Handling Instructions</span>
              <span className="font-medium text-charcoal">{foodSpecifics.storageNotes}</span>
            </div>
          )}

          {foodSpecifics.allergens && foodSpecifics.allergens.length > 0 && (
            <div className="sm:col-span-2 flex items-center gap-1.5 text-[11px] text-amber-800 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-amber-600" />
              <span>Allergen Notice: {foodSpecifics.allergens.join(', ')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
