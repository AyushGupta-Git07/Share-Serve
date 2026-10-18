import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div 
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-md w-full px-4 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 className="w-5 h-5 text-forest-700 flex-shrink-0" />;
            case 'error':
              return <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />;
            case 'warning':
              return <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />;
            default:
              return <Info className="w-5 h-5 text-forest-600 flex-shrink-0" />;
          }
        };

        const getBorderColor = () => {
          switch (toast.type) {
            case 'success':
              return 'border-forest-400 bg-white shadow-soft';
            case 'error':
              return 'border-red-300 bg-white shadow-soft';
            case 'warning':
              return 'border-amber-300 bg-white shadow-soft';
            default:
              return 'border-forest-300 bg-white shadow-soft';
          }
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-xl border p-4 flex items-start gap-3 transition-all transform translate-y-0 duration-200 animate-in fade-in slide-in-from-bottom-2 ${getBorderColor()}`}
            role="alert"
          >
            {getIcon()}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-charcoal">{toast.title}</h4>
              {toast.message && (
                <p className="text-xs text-charcoal-muted mt-0.5 leading-relaxed">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-charcoal-light hover:text-charcoal p-1 rounded-md transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
