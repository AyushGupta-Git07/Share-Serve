import React from 'react';
import { Donation } from '../types';
import { Check, Clock, PackageCheck, HeartHandshake } from 'lucide-react';

interface StatusStepperProps {
  donation: Donation;
}

export const StatusStepper: React.FC<StatusStepperProps> = ({ donation }) => {
  const steps = [
    {
      key: 'available',
      title: 'Listing Published',
      subtitle: new Date(donation.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      icon: Check
    },
    {
      key: 'accepted',
      title: 'NGO Accepted',
      subtitle: donation.acceptedByNGOName 
        ? `${donation.acceptedByNGOName}` 
        : 'Awaiting nearby NGO claim',
      icon: Clock
    },
    {
      key: 'collected',
      title: 'Collected / In Transit',
      subtitle: donation.collectedAt 
        ? new Date(donation.collectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : 'Pickup pending',
      icon: PackageCheck
    },
    {
      key: 'completed',
      title: 'Distributed',
      subtitle: donation.completedAt
        ? 'Delivered to beneficiaries'
        : 'Final distribution',
      icon: HeartHandshake
    }
  ];

  const getStepStatus = (stepKey: string, index: number) => {
    const statusOrder = ['available', 'accepted', 'collected', 'completed'];
    const currentIndex = statusOrder.indexOf(donation.status);

    if (donation.status === 'cancelled') {
      return index === 0 ? 'completed' : 'cancelled';
    }

    if (currentIndex >= index) {
      return 'completed';
    }
    if (currentIndex === index - 1) {
      return 'current';
    }
    return 'upcoming';
  };

  return (
    <div className="w-full py-3">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-6 right-6 top-[18px] -translate-y-1/2 h-1 bg-sage-200 z-0">
          <div 
            className="h-full bg-forest-600 transition-all duration-300"
            style={{
              width: 
                donation.status === 'available' ? '0%' :
                donation.status === 'accepted' ? '33%' :
                donation.status === 'collected' ? '66%' :
                donation.status === 'completed' ? '100%' : '0%'
            }}
          />
        </div>

        {steps.map((step, idx) => {
          const state = getStepStatus(step.key, idx);
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10 text-center max-w-[120px]">
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center font-medium text-sm transition-colors border-2 ${
                  state === 'completed'
                    ? 'bg-forest-600 border-forest-600 text-white'
                    : state === 'current'
                    ? 'bg-white border-forest-600 text-forest-700 animate-pulse'
                    : 'bg-white border-sage-300 text-charcoal-light'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <p className="mt-2 text-xs font-semibold text-charcoal line-clamp-1">{step.title}</p>
              <span className="text-[10px] text-charcoal-muted line-clamp-1 mt-0.5">{step.subtitle}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
