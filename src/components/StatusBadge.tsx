import React from 'react';
import { DonationStatus } from '../types';
import { Sparkles, Clock, CheckCircle2, PackageCheck, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: DonationStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md',
  showIcon = true 
}) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'available':
        return {
          label: 'Available for Pickup',
          bgColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
        };
      case 'accepted':
        return {
          label: 'NGO Reserved',
          bgColor: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: <Clock className="w-3.5 h-3.5 text-amber-600" />
        };
      case 'collected':
        return {
          label: 'In Transit / Picked Up',
          bgColor: 'bg-blue-50 text-blue-800 border-blue-200',
          icon: <PackageCheck className="w-3.5 h-3.5 text-blue-600" />
        };
      case 'completed':
        return {
          label: 'Completed & Distributed',
          bgColor: 'bg-forest-50 text-forest-800 border-forest-200',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" />
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          bgColor: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: <XCircle className="w-3.5 h-3.5 text-gray-500" />
        };
      default:
        return {
          label: status,
          bgColor: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: null
        };
    }
  };

  const config = getBadgeConfig();

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 font-semibold'
  }[size];

  return (
    <span 
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bgColor} ${sizeClasses}`}
      role="status"
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};
