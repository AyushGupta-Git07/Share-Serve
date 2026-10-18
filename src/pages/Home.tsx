import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DonationCard } from '../components/DonationCard';
import { CategoryCard } from '../components/CategoryCard';
import { NGOCard } from '../components/NGOCard';
import { 
  Heart, HandHeart, Leaf, Users, Sparkles, Utensils, Shirt, BookOpen, 
  PenTool, Home as HomeIcon, ArrowRight, ShieldCheck, Clock, CheckCircle2,
  MapPin, Check
} from 'lucide-react';

export const Home: React.FC = () => {
  const { donations, ngos, openDonationModal } = useApp();

  const featuredDonations = donations
    .filter((d) => d.status === 'available')
    .slice(0, 3);

  const verifiedNgos = ngos
    .filter((n) => n.verificationStatus === 'verified')
    .slice(0, 2);

  const categories = [
    {
      id: 'food',
      name: 'Surplus Food',
      count: donations.filter((d) => d.category === 'food' && d.status === 'available').length,
      desc: 'Fresh banquet trays, catering meals, bakery goods, and pantry staples prepared with care.',
      icon: Utensils,
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=700&auto=format&fit=crop&q=80'
    },
    {
      id: 'clothes',
      name: 'Wearable Clothes',
      count: donations.filter((d) => d.category === 'clothes' && d.status === 'available').length,
      desc: 'Clean, sorted clothing, warm winter woolens, blankets, and children’s school apparel.',
      icon: Shirt,
      bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=700&auto=format&fit=crop&q=80'
    },
    {
      id: 'books',
      name: 'Books & Learning',
      count: donations.filter((d) => d.category === 'books' && d.status === 'available').length,
      desc: 'Textbooks, storybooks, illustrated readers, and notebooks for neighborhood micro-libraries.',
      icon: BookOpen,
      bg: 'bg-blue-50 text-blue-800 border-blue-200',
      imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=700&auto=format&fit=crop&q=80'
    },
    {
      id: 'stationery',
      name: 'Stationery Kits',
      count: donations.filter((d) => d.category === 'stationery' && d.status === 'available').length,
      desc: 'School backpacks, pencil boxes, crayons, geometry sets, and study supplies for students.',
      icon: PenTool,
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=700&auto=format&fit=crop&q=80'
    },
    {
      id: 'household',
      name: 'Household Essentials',
      count: donations.filter((d) => d.category === 'household' && d.status === 'available').length,
      desc: 'Clean cookware, stainless steel containers, bedding, and working everyday appliances.',
      icon: HomeIcon,
      bg: 'bg-teal-50 text-teal-800 border-teal-200',
      imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=700&auto=format&fit=crop&q=80'
    }
  ];

  return (
    <div className="flex flex-col">
      {/* =====================================================================
          1. HERO SECTION (Warm Ivory & Cream Background)
      ===================================================================== */}
      <section className="relative overflow-hidden bg-cream pt-10 sm:pt-16 pb-16 sm:pb-24 border-b border-sage-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            {/* Left Narrative Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Community Sub-badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sage-100/90 border border-sage-300 text-xs font-semibold text-forest-800 shadow-xs">
                <Leaf className="w-3.5 h-3.5 text-forest-600" />
                <span>A community bridge for sharing and mutual care</span>
              </div>

              {/* Exact Requested Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-forest-950 tracking-tight leading-[1.12]">
                Turn what you have into <span className="text-forest-700 underline decoration-peach decoration-wavy underline-offset-8">hope</span> for someone else.
              </h1>

              {/* Exact Requested Subheading */}
              <p className="text-base sm:text-lg text-charcoal-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Share surplus food and everyday essentials with people who need them, through organizations in your community.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/donate"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-sm shadow-soft hover:shadow-elevated transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                >
                  <HandHeart className="w-4 h-4 text-peach" />
                  <span>Donate Something</span>
                </Link>

                <Link
                  to="/donations"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-sage-50 text-forest-900 font-bold text-sm border border-sage-300 shadow-xs transition-all flex items-center justify-center gap-2 hover:border-forest-400"
                >
                  <span>Explore Donations</span>
                  <ArrowRight className="w-4 h-4 text-forest-700" />
                </Link>
              </div>

              {/* Subtle Trust & Respect Notes */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-charcoal-muted">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-forest-700 fill-peach/40" />
                  <span>100% Volunteer Supported</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-forest-700" />
                  <span>Vetted Community NGOs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-forest-700" />
                  <span>Time-Critical Food Safety</span>
                </div>
              </div>
            </div>

            {/* Right Visual Image Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Large Authentic Documentary Community Photograph */}
                <div className="rounded-3xl overflow-hidden shadow-elevated border-4 border-white bg-sage-100 aspect-[4/3] sm:aspect-square relative">
                  <img
                    src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1000&auto=format&fit=crop&q=80"
                    alt="Volunteers sharing freshly prepared warm meals with community members"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1000&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/40 via-transparent to-transparent" />
                </div>

                {/* Subtle Floating Card with Sample Donation, Marked Clearly as Demo Data */}
                <div 
                  onClick={() => donations[0] && openDonationModal(donations[0])}
                  className="absolute -bottom-6 -left-4 sm:-left-8 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-elevated border border-sage-300 max-w-xs sm:max-w-sm animate-in fade-in slide-in-from-bottom duration-300 cursor-pointer hover:border-forest-500 hover:shadow-2xl hover:-translate-y-0.5 transition-all group"
                  role="button"
                  tabIndex={0}
                  aria-label="View sample demo donation"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center flex-shrink-0 border border-sage-200 group-hover:bg-forest-100 transition-colors">
                      <Utensils className="w-5 h-5 text-forest-700" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-peach/30 text-forest-900 border border-peach/50">
                          Demo Data
                        </span>
                        <span className="text-[11px] text-forest-700 font-semibold">Rescued Today</span>
                      </div>
                      <h4 className="text-xs font-bold text-forest-950 line-clamp-1 group-hover:text-forest-700 transition-colors">
                        60 Fresh Banquet Meal Boxes
                      </h4>
                      <p className="text-[11px] text-charcoal-muted mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-forest-600 flex-shrink-0" />
                        <span className="truncate">Indiranagar • Click to inspect modal</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Gentle Leaf Accent Chip */}
                <div className="absolute -top-3 -right-3 bg-white/95 backdrop-blur-md text-forest-900 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-soft border border-sage-200 flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-forest-600" />
                  <span>Zero Food Waste</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================================
          2. DONATION CATEGORIES SECTION (Soft Sage Background)
      ===================================================================== */}
      <section className="bg-sage-50/70 py-16 sm:py-24 border-b border-sage-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700 flex items-center justify-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-peach fill-peach" />
              <span>What We Can Share Together</span>
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-forest-950">
              Care for every season and everyday need
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
              Whether you have unserved catering from an evening celebration, warm clothing your family has outgrown, or children’s school books ready to inspire another child.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                id={cat.id}
                name={cat.name}
                count={cat.count}
                description={cat.desc}
                icon={cat.icon}
                bgColorClass={cat.bg}
                imageUrl={cat.imageUrl}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. THREE-STEP WORKFLOW (Warm Cream Background with Photo Storytelling)
      ===================================================================== */}
      <section className="bg-cream py-16 sm:py-24 border-b border-sage-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700 flex items-center justify-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-forest-600" />
              <span>A Gentle, Transparent Path</span>
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-forest-950">
              How ShareServe works in three simple steps
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
              We provide a safe, respectful bridge connecting generous neighbors directly with local verified organizations equipped for distribution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-3xl border border-sage-200/90 shadow-card flex flex-col justify-between hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 group overflow-hidden">
              <div className="relative aspect-[16/10] overflow-hidden bg-sage-100">
                <img 
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=700&auto=format&fit=crop&q=80" 
                  alt="Kitchen team preparing fresh surplus meal trays"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=700&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <span className="w-9 h-9 rounded-xl bg-forest-900/90 text-white font-extrabold text-sm flex items-center justify-center border border-white/20 shadow-xs">
                    01
                  </span>
                </div>
              </div>

              <div className="p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-forest-950">List What You Wish to Share</h3>
                  <p className="text-xs sm:text-sm text-charcoal-muted mt-2.5 leading-relaxed font-normal">
                    Post details of your surplus food, clothing, or books in under two minutes. For hot meals, note preparation time and safe consumption guidelines so volunteers can prioritize promptly.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-sage-100 flex items-center gap-1.5 text-xs font-semibold text-forest-700">
                  <Check className="w-4 h-4 text-forest-600" />
                  <span>Takes under 2 minutes</span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl border border-sage-200/90 shadow-card flex flex-col justify-between hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 group overflow-hidden">
              <div className="relative aspect-[16/10] overflow-hidden bg-sage-100">
                <img 
                  src="https://images.unsplash.com/photo-1593113630400-ea4288922497?w=700&auto=format&fit=crop&q=80" 
                  alt="Volunteers receiving and logging donation boxes"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=700&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <span className="w-9 h-9 rounded-xl bg-forest-900/90 text-white font-extrabold text-sm flex items-center justify-center border border-white/20 shadow-xs">
                    02
                  </span>
                </div>
              </div>

              <div className="p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-forest-950">A Nearby NGO Claims the Item</h3>
                  <p className="text-xs sm:text-sm text-charcoal-muted mt-2.5 leading-relaxed font-normal">
                    Verified grassroots nonprofits in your area are notified based on distance and capacity. A single-claim lock guarantees only one verified NGO claims the pickup.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-sage-100 flex items-center gap-1.5 text-xs font-semibold text-forest-700">
                  <ShieldCheck className="w-4 h-4 text-forest-600" />
                  <span>Locked to a verified partner</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl border border-sage-200/90 shadow-card flex flex-col justify-between hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 group overflow-hidden">
              <div className="relative aspect-[16/10] overflow-hidden bg-sage-100">
                <img 
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=700&auto=format&fit=crop&q=80" 
                  alt="Volunteer handing care and warmth to community member"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=700&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <span className="w-9 h-9 rounded-xl bg-forest-900/90 text-white font-extrabold text-sm flex items-center justify-center border border-white/20 shadow-xs">
                    03
                  </span>
                </div>
              </div>

              <div className="p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-forest-950">Care Delivered with Dignity</h3>
                  <p className="text-xs sm:text-sm text-charcoal-muted mt-2.5 leading-relaxed font-normal">
                    Volunteer drivers arrive for contactless pickup and redistribute items to night shelters, elder-care facilities, hospital waiting lines, or learning centers.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-sage-100 flex items-center gap-1.5 text-xs font-semibold text-forest-700">
                  <Heart className="w-4 h-4 text-forest-600 fill-peach/40" />
                  <span>Hand-delivered with respect</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. FEATURED LIVE DONATIONS (Soft Sage Background)
      ===================================================================== */}
      <section className="bg-sage-50/70 py-16 sm:py-24 border-b border-sage-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-forest-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-peach fill-peach" />
                <span>Community Exchange In Action</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-950 mt-1">
                Active Donations Looking for a Home
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-muted mt-1 max-w-xl">
                Real-time listings from weddings, homes, and cafes ready for pickup by authorized volunteers.
              </p>
            </div>

            <Link
              to="/donations"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-700 hover:text-forest-900 group"
            >
              <span>Explore all donations ({donations.length})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
        </div>
      </section>

      {/* =====================================================================
          5. COMMUNITY IMPACT & MUTUAL AID REACH (Warm Deep Forest Section)
      ===================================================================== */}
      <section className="bg-cream py-16 sm:py-24 border-b border-sage-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-forest-900 text-cream p-8 sm:p-12 shadow-elevated relative overflow-hidden border border-forest-800">
            <div className="max-w-2xl space-y-2 mb-10 pb-6 border-b border-forest-800/80">
              <span className="text-xs font-bold uppercase tracking-wider text-peach flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-peach" />
                <span>Neighbor-to-Neighbor Impact</span>
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
                Every plate shared is an act of dignity
              </h2>
              <p className="text-xs sm:text-sm text-sage-200 leading-relaxed font-normal">
                Surplus food feeds families instead of landfills. Clothing and books open fresh chapters in neighborhood learning centers.
              </p>
              <div className="pt-1">
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-forest-800/90 text-sage-200 border border-forest-700 inline-block">
                  * Illustrative community metrics for platform demonstration
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-3xl sm:text-4xl font-extrabold text-peach block">142,000+</span>
                <span className="text-xs text-sage-200 mt-1.5 block font-medium">Meals Redistributed</span>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-3xl sm:text-4xl font-extrabold text-white block">80,400+</span>
                <span className="text-xs text-sage-200 mt-1.5 block font-medium">Useful Items Donated</span>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-3xl sm:text-4xl font-extrabold text-peach block">2,450+</span>
                <span className="text-xs text-sage-200 mt-1.5 block font-medium">Volunteer Drives</span>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-3xl sm:text-4xl font-extrabold text-white block">100%</span>
                <span className="text-xs text-sage-200 mt-1.5 block font-medium">Nonprofit Grassroots Model</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. GRASSROOTS NGO SPOTLIGHT (Soft Sage Background)
      ===================================================================== */}
      <section className="bg-sage-50/70 py-16 sm:py-24 border-b border-sage-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-forest-700 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
                <span>Our Grassroots Partners</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-950 mt-1">
                Verified Community Organizations
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-muted mt-1 max-w-xl">
                Vetted local teams that collect, verify, and redistribute goods daily across Bengaluru neighborhoods.
              </p>
            </div>

            <Link
              to="/ngos"
              className="px-4 py-2.5 rounded-xl border border-sage-300 hover:bg-white text-xs font-bold text-forest-900 transition-colors bg-white/80"
            >
              Explore All NGOs ({ngos.length})
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {verifiedNgos.map((ngo) => (
              <NGOCard key={ngo.id} ngo={ngo} />
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          7. EVENT SURPLUS CALLOUT (Warm Cream Background with Soft Sage Card)
      ===================================================================== */}
      <section className="bg-cream py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-sage-100/90 border border-sage-300 flex flex-col md:flex-row items-center gap-8 justify-between shadow-card">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-forest-800">
                <Leaf className="w-3.5 h-3.5 text-forest-600" />
                <span>Planning a Wedding, Party, or Corporate Gathering?</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-forest-950">
                Schedule surplus food pickup before your event concludes
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-muted max-w-2xl leading-relaxed">
                Post your expected surplus an hour before dining ends. A local volunteer rescue team can coordinate timely, dignified redistribution to nearby night shelters.
              </p>
            </div>

            <Link
              to="/donate"
              className="flex-shrink-0 px-6 py-3.5 rounded-2xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs shadow-soft transition-all hover:-translate-y-0.5"
            >
              Share Event Surplus
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export { Home as HomePage };
export default Home;
