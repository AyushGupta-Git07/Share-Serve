import React, { ReactNode } from 'react';
import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction
}) => {
  return (
    <div className="text-center py-12 px-4 rounded-3xl bg-white border border-sage-200 p-8 shadow-xs max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-sage-100 text-forest-700 flex items-center justify-center mx-auto mb-4 border border-sage-200">
        {icon || <PackageOpen className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-charcoal">{title}</h3>
      <p className="text-xs text-charcoal-muted mt-1.5 max-w-sm mx-auto leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-5 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-soft transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
