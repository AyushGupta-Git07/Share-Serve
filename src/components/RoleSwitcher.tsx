import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { User, ShieldCheck, HeartHandshake, ChevronDown, Check } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { currentUser, switchRole, availableUsers } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'donor':
        return {
          label: 'Donor Persona',
          color: 'bg-peach-100 text-charcoal border-peach-300',
          icon: <HeartHandshake className="w-3.5 h-3.5 text-forest-700" />
        };
      case 'ngo':
        return {
          label: 'NGO Partner',
          color: 'bg-sage-100 text-forest-900 border-sage-300',
          icon: <User className="w-3.5 h-3.5 text-forest-800" />
        };
      case 'admin':
        return {
          label: 'Admin Demo',
          color: 'bg-forest-100 text-forest-900 border-forest-300',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-forest-700" />
        };
    }
  };

  const badge = getRoleBadge(currentUser.role);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-sage-300 bg-white shadow-xs hover:border-forest-500 transition-all text-xs font-medium text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-500/20"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-semibold ${badge.color}`}>
          {badge.icon}
          <span>{badge.label}</span>
        </span>
        <span className="font-semibold text-charcoal max-w-[110px] truncate">{currentUser.name}</span>
        <ChevronDown className="w-3.5 h-3.5 text-charcoal-light" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white p-2.5 shadow-elevated border border-sage-200 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-2 border-b border-sage-100 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-light block">
                Interactive Persona Switcher
              </span>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Simulate different stakeholder workflows across the platform.
              </p>
            </div>

            <div className="space-y-1">
              {availableUsers.map((user) => {
                const isSelected = user.id === currentUser.id;
                const roleConfig = getRoleBadge(user.role);

                return (
                  <button
                    key={user.id}
                    onClick={() => {
                      switchRole(user.role);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between ${
                      isSelected 
                        ? 'bg-sage-100/70 border border-forest-300' 
                        : 'hover:bg-cream-100 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img 
                        src={user.avatarUrl} 
                        alt={user.name} 
                        className="w-9 h-9 rounded-full object-cover border border-sage-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-charcoal truncate">{user.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full border ${roleConfig.color}`}>
                            {user.role.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-[11px] text-charcoal-muted truncate mt-0.5">
                          {user.organizationName || user.locality}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-forest-700 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-2.5 pt-2 border-t border-sage-100 px-3 py-1 text-[11px] text-charcoal-light flex items-center justify-between">
              <span>Prototype simulation</span>
              <span className="text-forest-700 font-medium">No live auth required</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
