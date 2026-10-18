import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  Heart, Lock, Mail, ShieldCheck, Building2, User, 
  ArrowRight, CheckCircle2, Sparkles, AlertCircle, Eye, EyeOff 
} from 'lucide-react';

export const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, switchRole, availableUsers, addToast } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser.role || 'donor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quick Persona Presets
  const donorUser = availableUsers.find((u) => u.role === 'donor');
  const ngoUser = availableUsers.find((u) => u.role === 'ngo');
  const adminUser = availableUsers.find((u) => u.role === 'admin');

  const handleQuickLogin = (role: UserRole) => {
    switchRole(role);
    const targetDashboard = 
      role === 'donor' ? '/dashboard' : 
      role === 'ngo' ? '/ngo-dashboard' : '/admin';
    navigate(targetDashboard);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please provide your email and password to proceed.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Find matching demo user or switch to role
      const matchedUser = availableUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() || u.role === selectedRole
      );

      if (matchedUser) {
        switchRole(matchedUser.role);
        addToast({
          type: 'success',
          title: `Welcome back, ${matchedUser.name}!`,
          message: `Signed in as ${matchedUser.role.toUpperCase()} (${matchedUser.organizationName || 'Community Member'})`
        });

        const targetDashboard = 
          matchedUser.role === 'donor' ? '/dashboard' : 
          matchedUser.role === 'ngo' ? '/ngo-dashboard' : '/admin';
        
        setIsLoading(false);
        navigate(targetDashboard);
      } else {
        setIsLoading(false);
        setError('Invalid credentials for this demo environment.');
      }
    }, 600);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-cream">
      <div className="w-full max-w-lg space-y-8">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-12 h-12 rounded-2xl bg-forest-700 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform border border-forest-800">
              <Heart className="w-6 h-6 fill-peach text-forest-700" />
            </div>
            <span className="text-2xl font-extrabold text-forest-950 tracking-tight">
              Share<span className="text-forest-700">Serve</span>
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-950 tracking-tight">
            Sign In to ShareServe
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted">
            Access your donor dashboard, claim community listings, or manage platform safety.
          </p>
        </div>

        {/* Quick Demo Persona Switcher Banner */}
        <div className="bg-sage-100/80 border border-sage-300 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-forest-600" />
              <span>1-Click Demo Profiles</span>
            </span>
            <span className="text-[11px] text-charcoal-light font-medium">Instant Test Access</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Donor Quick Login */}
            <button
              type="button"
              onClick={() => handleQuickLogin('donor')}
              className="p-3 rounded-2xl bg-white border border-sage-200 hover:border-forest-500 hover:shadow-xs transition-all text-left flex flex-col justify-between"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <User className="w-4 h-4 text-forest-600" />
                <span className="text-xs font-bold text-charcoal">Donor</span>
              </div>
              <span className="text-[11px] text-charcoal-muted truncate">
                {donorUser?.name || 'Priya Sharma'}
              </span>
            </button>

            {/* NGO Quick Login */}
            <button
              type="button"
              onClick={() => handleQuickLogin('ngo')}
              className="p-3 rounded-2xl bg-white border border-sage-200 hover:border-forest-500 hover:shadow-xs transition-all text-left flex flex-col justify-between"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Building2 className="w-4 h-4 text-forest-600" />
                <span className="text-xs font-bold text-charcoal">NGO Partner</span>
              </div>
              <span className="text-[11px] text-charcoal-muted truncate">
                {ngoUser?.name || 'Rajesh Verma'}
              </span>
            </button>

            {/* Admin Quick Login */}
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="p-3 rounded-2xl bg-white border border-sage-200 hover:border-forest-500 hover:shadow-xs transition-all text-left flex flex-col justify-between"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <ShieldCheck className="w-4 h-4 text-forest-600" />
                <span className="text-xs font-bold text-charcoal">Admin</span>
              </div>
              <span className="text-[11px] text-charcoal-muted truncate">
                {adminUser?.name || 'Aisha Khan'}
              </span>
            </button>
          </div>
        </div>

        {/* Credentials Form Box */}
        <div className="bg-white rounded-3xl border border-sage-200 shadow-card p-6 sm:p-8 space-y-6">
          {/* Account Role Tabs */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-light mb-2">
              Select Account Type
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-sage-100 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('donor');
                  setEmail(donorUser?.email || '');
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  selectedRole === 'donor'
                    ? 'bg-white text-forest-900 shadow-xs'
                    : 'text-charcoal-muted hover:text-charcoal'
                }`}
              >
                Donor
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('ngo');
                  setEmail(ngoUser?.email || '');
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  selectedRole === 'ngo'
                    ? 'bg-white text-forest-900 shadow-xs'
                    : 'text-charcoal-muted hover:text-charcoal'
                }`}
              >
                NGO Partner
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('admin');
                  setEmail(adminUser?.email || '');
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  selectedRole === 'admin'
                    ? 'bg-white text-forest-900 shadow-xs'
                    : 'text-charcoal-muted hover:text-charcoal'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-charcoal-light absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. name@example.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-sage-300 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-charcoal">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setPassword('demo-pass-123')}
                  className="text-[11px] text-forest-700 hover:underline font-medium"
                >
                  Auto-fill demo pass
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-charcoal-light absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-sage-300 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-light hover:text-charcoal"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-soft transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In as {selectedRole.toUpperCase()}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Assistance */}
          <div className="pt-4 border-t border-sage-100 flex items-center justify-between text-[11px] text-charcoal-muted">
            <span>Looking to list items?</span>
            <Link to="/donate" className="text-forest-700 font-semibold hover:underline">
              Start Donation Flow &rarr;
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignIn;
