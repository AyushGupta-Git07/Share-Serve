import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DonationCard } from '../components/DonationCard';
import { 
  Heart, Sparkles, Utensils, Shirt, BookOpen, PenTool, Home, 
  ArrowRight, ShieldCheck, Clock, Users, CheckCircle2, ChevronRight 
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { donations, ngos, openDonationModal } = useApp();

  const featuredDonations = donations
    .filter((d) => d.status === 'available')
    .slice(0, 3);

  const verifiedNgos = ngos.filter((n) => n.verificationStatus === 'verified').slice(0, 3);

  const categories = [
    {
      id: 'food',
      name: 'Surplus Food',
      count: donations.filter((d) => d.category === 'food' && d.status === 'available').length,
      desc: 'Cooked banquet meals, bakery goods, packaged snacks & pantry staples',
      icon: Utensils,
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    },
    {
      id: 'clothes',
      name: 'Wearable Clothes',
      count: donations.filter((d) => d.category === 'clothes' && d.status === 'available').length,
      desc: 'Clean apparel, winter woolens, blankets, and children garments',
      icon: Shirt,
      bg: 'bg-indigo-50 text-indigo-800 border-indigo-200'
    },
    {
      id: 'books',
      name: 'Books & Learning',
      count: donations.filter((d) => d.category === 'books' && d.status === 'available').length,
      desc: 'School textbooks, storybooks, reference guides & notebooks',
      icon: BookOpen,
      bg: 'bg-blue-50 text-blue-800 border-blue-200'
    },
    {
      id: 'stationery',
      name: 'Stationery Kits',
      count: donations.filter((d) => d.category === 'stationery' && d.status === 'available').length,
      desc: 'Pencils, crayons, backpacks, geometry sets & school supplies',
      icon: PenTool,
      bg: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    {
      id: 'household',
      name: 'Household Essentials',
      count: donations.filter((d) => d.category === 'household' && d.status === 'available').length,
      desc: 'Cookware, clean steel utensils, bedding & usable appliances',
      icon: Home,
      bg: 'bg-teal-50 text-teal-800 border-teal-200'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-20 bg-gradient-to-b from-cream via-cream to-sage-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sage-200/80 border border-sage-300 text-xs font-semibold text-forest-900 shadow-xs">
                <Sparkles className="w-4 h-4 text-forest-700" />
                <span>Good food. Useful things. Shared with care.</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-charcoal tracking-tight leading-[1.12]">
                Turn what you have into <span className="text-forest-700 underline decoration-peach decoration-wavy underline-offset-8">hope</span> for someone else.
              </h1>

              <p className="text-base sm:text-lg text-charcoal-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Don’t let surplus food from weddings, parties, or kitchens go to waste. Connect in minutes with verified nearby NGOs to redistribute cooked meals and pass forward clothes, books, and essential household goods.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/donate"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-sm shadow-soft hover:shadow-elevated transition-all flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4 fill-peach text-forest-600" />
                  <span>Donate Something</span>
                </Link>

                <Link
                  to="/donations"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-sage-100 text-charcoal font-bold text-sm border border-sage-300 shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <span>Find Donations</span>
                  <ArrowRight className="w-4 h-4 text-forest-600" />
                </Link>
              </div>

              {/* Trust Callout */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-charcoal-muted">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-forest-600" />
                  <span>100% Free Platform</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-forest-600" />
                  <span>Vetted NGO Partners</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-forest-600" />
                  <span>Urgent Meal Redistribution</span>
                </div>
              </div>
            </div>

            {/* Right Visual Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="rounded-3xl overflow-hidden shadow-elevated border-4 border-white bg-sage-100 aspect-[4/3] sm:aspect-square">
                  <img
                    src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=900&auto=format&fit=crop&q=80"
                    alt="Volunteers sharing cooked meals with community"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating Highlight Card */}
                <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-elevated border border-sage-200 max-w-xs animate-in fade-in slide-in-from-bottom duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center flex-shrink-0">
                      <Utensils className="w-5 h-5 text-forest-700" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-charcoal block">Wedding Surplus Rescued</span>
                      <span className="text-[11px] text-charcoal-muted">80 meals delivered in Indiranagar</span>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 bg-peach/90 backdrop-blur-md text-charcoal px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-soft">
                  ⚡ 2h Average Pickup
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Illustrative Demo Impact Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-forest-900 text-white p-8 sm:p-10 shadow-elevated relative overflow-hidden">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-forest-800/40 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-forest-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-peach">
                Community Reach (Illustrative Prototype Metrics)
              </span>
              <h2 className="text-xl sm:text-2xl font-bold mt-1">
                Small acts, profound neighborhood change
              </h2>
            </div>
            <span className="text-[11px] px-3 py-1 rounded-full bg-forest-800 text-sage-200 border border-forest-700">
              * Simulated sample data
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-3xl sm:text-4xl font-extrabold text-peach block">142,000+</span>
              <span className="text-xs text-sage-200 mt-1 block font-medium">Meals Redistributed</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-3xl sm:text-4xl font-extrabold text-white block">80,400+</span>
              <span className="text-xs text-sage-200 mt-1 block font-medium">Reusable Items Donated</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-3xl sm:text-4xl font-extrabold text-peach block">2,450+</span>
              <span className="text-xs text-sage-200 mt-1 block font-medium">Completed Pickup Drives</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-3xl sm:text-4xl font-extrabold text-white block">100%</span>
              <span className="text-xs text-sage-200 mt-1 block font-medium">Nonprofit Volunteer Model</span>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
            What Can You Share?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal mt-1">
            Care for every season and circumstance
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-2">
            Whether it's unconsumed catering trays from an evening reception or children's textbooks from last semester.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                to={`/donations?category=${cat.id}`}
                className="group p-6 rounded-3xl bg-white border border-sage-200 shadow-card hover:shadow-elevated transition-all duration-300 hover:border-forest-400 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${cat.bg}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-forest-700 bg-sage-100 px-2.5 py-1 rounded-full">
                      {cat.count} Available
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-charcoal group-hover:text-forest-700 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-charcoal-muted mt-1.5 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-sage-100 flex items-center justify-between text-xs font-bold text-forest-700">
                  <span>Browse {cat.name}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Three-step How It Works Section */}
      <section className="bg-sage-100/60 py-16 sm:py-20 border-y border-sage-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
              The Journey of Giving
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal mt-1">
              How ShareServe Works in 3 Steps
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted mt-2">
              A transparent, safe bridge between generous donors and authorized neighborhood organizations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white p-7 rounded-3xl border border-sage-200 shadow-card relative flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-forest-600 text-white font-extrabold text-base flex items-center justify-center mb-5 shadow-soft">
                01
              </div>
              <h3 className="text-lg font-bold text-charcoal">Donor Posts a Listing</h3>
              <p className="text-xs text-charcoal-muted mt-2 leading-relaxed flex-1">
                Share photos, quantity, pickup address, and availability timings. For hot or perishable food, specify preparation timestamps and safe consumption deadlines.
              </p>
              <div className="mt-5 pt-4 border-t border-sage-100 text-[11px] font-semibold text-forest-700">
                Takes less than 2 minutes
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-7 rounded-3xl border border-sage-200 shadow-card relative flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-forest-600 text-white font-extrabold text-base flex items-center justify-center mb-5 shadow-soft">
                02
              </div>
              <h3 className="text-lg font-bold text-charcoal">Nearby NGO Claims & Accepts</h3>
              <p className="text-xs text-charcoal-muted mt-2 leading-relaxed flex-1">
                Verified grassroots NGOs receive notifications based on their location and accepted categories. Once claimed, exclusive contact details are unlocked.
              </p>
              <div className="mt-5 pt-4 border-t border-sage-100 text-[11px] font-semibold text-forest-700">
                Prevents double-allocation
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-7 rounded-3xl border border-sage-200 shadow-card relative flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-forest-600 text-white font-extrabold text-base flex items-center justify-center mb-5 shadow-soft">
                03
              </div>
              <h3 className="text-lg font-bold text-charcoal">Coordinated Redistribution</h3>
              <p className="text-xs text-charcoal-muted mt-2 leading-relaxed flex-1">
                Volunteers collect items, inspect food freshness, and redistribute to hospital attendees, night shelters, or community learning centers. Status updates in real time.
              </p>
              <div className="mt-5 pt-4 border-t border-sage-100 text-[11px] font-semibold text-forest-700">
                Full lifecycle verification
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Live Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
              Active In Your Area
            </span>
            <h2 className="text-2xl font-bold text-charcoal mt-1">
              Urgent & Available Donations
            </h2>
          </div>
          <Link
            to="/donations"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-700 hover:text-forest-800"
          >
            <span>View all donations ({donations.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredDonations.map((donation) => (
            <DonationCard 
              key={donation.id} 
              donation={donation}
              onOpenDetails={() => openDonationModal(donation)}
            />
          ))}
        </div>
      </section>

      {/* Featured NGO Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-sage-200 shadow-card">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
                Our Community Partners
              </span>
              <h2 className="text-2xl font-bold text-charcoal mt-1">
                Verified Grassroots NGOs
              </h2>
              <p className="text-xs text-charcoal-muted mt-1">
                Sample organizations vetted for food hygiene and community delivery logistics.
              </p>
            </div>
            <Link
              to="/ngos"
              className="px-4 py-2 rounded-xl border border-sage-300 hover:bg-sage-50 text-xs font-bold text-charcoal transition-colors"
            >
              Explore All NGOs ({ngos.length})
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {verifiedNgos.map((ngo) => (
              <div 
                key={ngo.id}
                className="p-5 rounded-2xl bg-cream/70 border border-sage-200 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <img 
                      src={ngo.logoUrl} 
                      alt={ngo.name} 
                      className="w-12 h-12 rounded-xl object-cover border border-sage-200"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-charcoal leading-tight">{ngo.name}</h4>
                      <span className="text-[11px] text-forest-700 font-semibold flex items-center gap-1 mt-0.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
                        Verified NGO
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-charcoal-muted mt-3 line-clamp-2 leading-relaxed">
                    {ngo.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-sage-200 text-xs text-charcoal-light flex items-center justify-between">
                  <span>{ngo.locality}, {ngo.city}</span>
                  <span className="font-semibold text-charcoal">{ngo.impactMetrics.completedDrives} drives</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety & Trust Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-sage-100 border border-sage-300 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold text-forest-950">
              Are you hosting an event, wedding, or celebration?
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted max-w-2xl leading-relaxed">
              Plan surplus distribution ahead. Post your expected excess food an hour before your event wraps up, and a nearby NGO volunteer can coordinate timely pickup.
            </p>
          </div>
          <Link
            to="/donate"
            className="flex-shrink-0 px-6 py-3.5 rounded-2xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-soft transition-colors"
          >
            Create Event Donation
          </Link>
        </div>
      </section>
    </div>
  );
};
