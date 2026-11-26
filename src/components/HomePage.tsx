import { useEffect, useState, type FormEvent } from 'react';
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ShoppingBag,
  Star,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import {
  ASSETS,
  COMMUNITY_VIDEOS,
  CUSTOMER_REVIEWS,
  PRESS_QUOTES,
  PRODUCTS,
  STAR_SPOTLIGHT,
} from '../data/catalog';
import type { AppPage, CommunityVideo, CurrencyCode, CustomInquiry, Product } from '../types';
import { formatMoney } from '../utils/commerce';
import { ProductCard } from './ProductCard';
import { SafeImage } from './SafeImage';

interface HomePageProps {
  theme: 'light' | 'dark';
  currency: CurrencyCode;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onNavigate: (page: AppPage) => void;
  onQuickAdd: (product: Product) => void;
  onSubmitInquiry: (inquiry: Omit<CustomInquiry, 'id' | 'submittedAt'>) => CustomInquiry;
}

const BESPOKE_TABS = [
  {
    id: 'made-for-you',
    label: 'Made For You',
    heading: 'Your Individuality, Handcrafted From Scratch',
    body: 'Our white-glove bespoke service is where your individuality becomes our ultimate masterpiece. From bespoke illustrations to selecting full-grain hides, cuts, finishes, hardware, and linings, you collaborate directly with our in-house design consultants to shape a piece that is unmistakably yours.',
    metrics: ['1-on-1 Design Consultant', 'Hyper-Realistic Mockups', 'Zero Middlemen Markup'],
  },
  {
    id: 'made-to-fit',
    label: 'Made To Fit',
    heading: 'Tailored to Your Exact Proportions',
    body: 'Whether you choose from eight inclusive standard sizes (XS to 4XL) or opt for Made-to-Measure tailoring, every pattern panel is cut individually to match your shoulders, torso drape, and sleeve length with millimeter precision.',
    metrics: ['8 Standard Sizes (XS–4XL)', 'Made-to-Measure (+200 AED)', '60-Day Fit Exchange'],
  },
  {
    id: 'made-to-last',
    label: 'Made To Last',
    heading: 'One Master Craftsman. One Jacket at a Time.',
    body: 'Unlike mass chain-production factories, each jacket is constructed start-to-finish by a single master leather craftsman using full-grain natural hides, genuine YKK metal zippers, and breathable linings built to patina beautifully over decades.',
    metrics: ['100% Full-Grain Natural Hide', 'Authentic YKK Hardware', 'Single-Artisan Construction'],
  },
] as const;

export function HomePage({
  theme,
  currency,
  wishlist,
  onToggleWishlist,
  onNavigate,
  onQuickAdd,
  onSubmitInquiry,
}: HomePageProps) {
  const [pressIndex, setPressIndex] = useState(0);
  const [bestSellerTab, setBestSellerTab] = useState<'all' | 'men' | 'women' | 'suede'>('all');
  const [activePillar, setActivePillar] = useState<(typeof BESPOKE_TABS)[number]['id']>('made-for-you');
  const [activeVideo, setActiveVideo] = useState<CommunityVideo | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [reelProgress, setReelProgress] = useState(0);

  useEffect(() => {
    if (!activeVideo || !isPlaying) return;
    const timer = window.setInterval(() => {
      setReelProgress((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 180);
    return () => window.clearInterval(timer);
  }, [activeVideo, isPlaying]);

  // Custom Leather Jacket Inquiry Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+971 ');
  const [company, setCompany] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [country, setCountry] = useState('United Arab Emirates');
  const [gender, setGender] = useState('Male');
  const [budgetAED, setBudgetAED] = useState('1500');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');
  const [submittedRecord, setSubmittedRecord] = useState<CustomInquiry | null>(null);

  const activePress = PRESS_QUOTES[pressIndex];
  const currentPillar = BESPOKE_TABS.find((t) => t.id === activePillar) || BESPOKE_TABS[0];

  const bestSellers = PRODUCTS.filter((p) => {
    if (bestSellerTab === 'men') return p.gender === 'men' && p.category !== 'suits' && p.category !== 'shoes';
    if (bestSellerTab === 'women') return p.gender === 'women';
    if (bestSellerTab === 'suede') return p.leatherType === 'Suede';
    return p.isBestSeller;
  }).slice(0, 6);

  const categories = [
    {
      title: "Men's Jackets",
      subtitle: 'Cafe Racers, Bikers & Bombers',
      image: ASSETS.IONIC_BLACK,
      target: { view: 'collection', filter: 'men' } as AppPage,
    },
    {
      title: "Women's Jackets",
      subtitle: 'Lambskin Bikers & Tailored Silhouettes',
      image: ASSETS.WOMEN_BIKER_BLACK,
      target: { view: 'collection', filter: 'women' } as AppPage,
    },
    {
      title: 'Suede Outerwear',
      subtitle: 'Velvet-Nap Goatskin Truckers & Bombers',
      image: ASSETS.SHERIFF_SUEDE,
      target: { view: 'collection', filter: 'men', category: 'suede-jackets' } as AppPage,
    },
    {
      title: 'Leather Coats',
      subtitle: 'Belted Trenches & Overcoats',
      image: ASSETS.WOMEN_CAMEL_COAT,
      target: { view: 'collection', filter: 'all', category: 'leather-coats' } as AppPage,
    },
    {
      title: 'Leather Bags',
      subtitle: 'TruCarry Weekenders & Carryalls',
      image: ASSETS.LEATHER_WEEKENDER,
      target: { view: 'collection', filter: 'bags' } as AppPage,
    },
    {
      title: 'Bespoke Studio',
      subtitle: 'Design Your Own From Scratch',
      image: ASSETS.BESPOKE_CRAFT,
      target: { view: 'builder' } as AppPage,
    },
  ];

  const handleInquirySubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !email.includes('@') || phone.trim().length < 7) {
      setFormError('Please provide your full name, a valid email address, and phone number.');
      return;
    }
    if (!description.trim() || description.trim().length < 10) {
      setFormError('Please describe your custom leather jacket vision (at least 10 characters).');
      return;
    }
    setFormError('');
    const created = onSubmitInquiry({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      company: company.trim(),
      quantity,
      country,
      gender,
      budgetAED: budgetAED.trim() || '1500',
      description: description.trim(),
    });
    setSubmittedRecord(created);
    setFullName('');
    setEmail('');
    setPhone('+971 ');
    setCompany('');
    setDescription('');
  };

  return (
    <div>
      {/* 1. SEAMLESS CYCLORAMA EDITORIAL HERO — Vertical stack on mobile (zero text-on-face overlap), 2-column seamless cyclorama on desktop */}
      <section className="relative bg-[#EFEFE9] dark:bg-[#0D1113] overflow-hidden border-b border-[#E5E5E0] dark:border-[#1E2428] transition-colors duration-300">
        {/* Reference-inspired sleek black sub-banner on mobile */}
        <div className="lg:hidden bg-[#0B0D0E] dark:bg-[#07090A] text-white text-center py-1.5 px-4 border-b border-white/10">
          <p className="font-display text-[15px] tracking-[0.03em] font-normal">
            Our Only Sale Of The Year
          </p>
        </div>

        <div className="max-w-[1440px] mx-auto relative flex flex-col lg:min-h-[650px] lg:flex-row lg:items-center">
          {/* Editorial Typography — Centered above models on mobile, left-aligned column on desktop */}
          <div className="relative z-10 w-full px-5 pt-6 pb-3 sm:px-10 sm:pt-10 lg:px-16 lg:py-24 text-center lg:text-left">
            <div className="max-w-xl mx-auto lg:mx-0">
              <p className="hidden lg:block font-display text-2xl font-normal text-[#2A2A28] dark:text-[#D5D4CE] tracking-tight mb-2">
                Our Only Sale Of The Year
              </p>
              <h1 className="font-display text-[32px] sm:text-5xl lg:text-[56px] font-bold text-[#121212] dark:text-[#F6F5F0] leading-[1.06] lg:leading-[1.04] tracking-[-0.015em] mb-1 lg:mb-1.5">
                The Black Friday Event
              </h1>
              <p className="font-display text-[36px] sm:text-5xl lg:text-[62px] font-normal text-[#121212] dark:text-[#F6F5F0] leading-[1.06] lg:leading-[1.04] tracking-[-0.01em] mb-5 lg:mb-6">
                Up to 25% OFF
              </p>
              <p className="hidden lg:block text-[15px] text-[#454542] dark:text-[#B5B9BC] leading-relaxed max-w-md mb-8">
                Full-grain handcrafted leather jackets, velvet-nap suede, and bespoke tailoring by
                Maison Valen — shipped free across the UAE with all customs duties covered.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-6">
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'collection', filter: 'sale' })}
                  className="px-8 py-2.5 lg:px-9 lg:py-3.5 border border-[#141414] dark:border-[#F4F3EE] bg-transparent hover:bg-[#141414] hover:text-white dark:hover:bg-[#F4F3EE] dark:hover:text-[#0E1214] text-[#141414] dark:text-[#F4F3EE] text-[11px] lg:text-xs font-semibold tracking-[0.18em] uppercase transition-colors whitespace-nowrap shrink-0"
                >
                  Shop The Sale
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'builder' })}
                  className="inline-flex items-center gap-1.5 text-[11px] lg:text-xs font-semibold tracking-[0.15em] uppercase text-[#1C1C1C] dark:text-[#E5E4DE] underline underline-offset-8 decoration-[#1C1C1C]/35 dark:decoration-[#F4F3EE]/35 hover:decoration-[#1C1C1C] dark:hover:decoration-[#F4F3EE] py-1.5 lg:py-2 transition-colors whitespace-nowrap shrink-0"
                >
                  Or Design Your Own <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Seamless Studio Models Layer — Dedicated clean viewport below CTA on mobile, right-anchored full-bleed on desktop */}
          <div className="relative w-full h-[335px] sm:h-[420px] lg:h-full lg:absolute lg:inset-0 pointer-events-none select-none">
            <SafeImage
              src={theme === 'dark' ? ASSETS.HERO_CAMPAIGN_DARK : ASSETS.HERO_CAMPAIGN}
              alt="Maison Valen UAE Black Friday Event models wearing full-grain handcrafted black biker, cognac cafe racer, and shearling aviator leather jackets"
              className={`w-full h-full object-cover sm:object-[86%_8%] lg:object-[92%_6%] hero-seamless-mask ${
                theme === 'dark' ? 'object-[92%_10%]' : 'object-[96%_8%]'
              }`}
            />
            {/* Seamless desktop left-side canvas integration (desktop only so mobile models stay crisp and unobstructed) */}
            <div
              aria-hidden="true"
              className="hidden lg:block absolute inset-0 bg-gradient-to-r from-[#EFEFE9] via-[#EFEFE9]/20 to-transparent dark:from-[#0D1113] dark:via-[#0D1113]/20 dark:to-transparent"
            />
            {/* Seamless subtle bottom dissolve into page */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-10 lg:h-14 bg-gradient-to-t from-[#EFEFE9]/80 dark:from-[#0D1113]/85 to-transparent"
            />
          </div>
        </div>
      </section>

      {/* 2. AS FEATURED IN + TRUST PROOF */}
      <section className="bg-white dark:bg-[#0E1214] border-b border-[#EFEFED] dark:border-[#1E2428] py-9 sm:py-14 transition-colors duration-200">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 text-center">
          <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#767676] dark:text-[#8A8E91] mb-4 sm:mb-5">
            As Featured In
          </p>

          <div className="flex items-center justify-center gap-2 sm:gap-8 min-h-[64px] sm:min-h-[72px]">
            <button
              type="button"
              aria-label="Previous press quote"
              onClick={() =>
                setPressIndex((prev) => (prev === 0 ? PRESS_QUOTES.length - 1 : prev - 1))
              }
              className="p-2 text-[#595959] dark:text-[#A8ACAF] hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE] transition-colors shrink-0"
            >
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>

            <blockquote className="font-display text-[17px] sm:text-2xl italic text-[#1C1C1C] dark:text-[#F4F3EE] max-w-2xl leading-snug px-1">
              {activePress.quote}
            </blockquote>

            <button
              type="button"
              aria-label="Next press quote"
              onClick={() => setPressIndex((prev) => (prev + 1) % PRESS_QUOTES.length)}
              className="p-2 text-[#595959] dark:text-[#A8ACAF] hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE] transition-colors shrink-0"
            >
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Interactive Outlet Selector Row — Smooth single-row horizontal swipe on mobile, centered row on desktop */}
          <div className="mt-5 sm:mt-7 flex items-center justify-start sm:justify-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar py-1 px-2">
            {PRESS_QUOTES.map((item, idx) => (
              <button
                key={item.outlet}
                type="button"
                onClick={() => setPressIndex(idx)}
                className={`font-display text-sm sm:text-base tracking-[0.16em] whitespace-nowrap shrink-0 transition-colors ${
                  idx === pressIndex
                    ? 'text-[#1C1C1C] dark:text-[#F4F3EE] font-bold underline underline-offset-8 decoration-[#1C1C1C] dark:decoration-[#F4F3EE]'
                    : 'text-[#9A9A96] dark:text-[#666B6F] hover:text-[#595959] dark:hover:text-[#B0B3B5]'
                }`}
              >
                {item.outlet}
              </button>
            ))}
          </div>

          <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-[#F0F0EE] dark:border-[#1E2428] flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 text-xs sm:text-sm text-[#595959] dark:text-[#A8ACAF]">
            <div className="inline-flex items-center gap-2">
              <span className="inline-flex items-center gap-0.5" aria-label="4.9 out of 5 stars">
                {[0, 1, 2, 3, 4].map((s) => (
                  <Star
                    key={s}
                    className="w-3.5 h-3.5 fill-[#C89B3C] text-[#C89B3C] dark:fill-[#D9AD4E] dark:text-[#D9AD4E]"
                    aria-hidden="true"
                  />
                ))}
              </span>
              <span className="font-semibold text-[#1C1C1C] dark:text-[#F4F3EE] tabular-nums">
                3,450+ Reviews &amp; 4.9 Rating
              </span>
            </div>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span className="text-[11.5px] sm:text-sm">
              Direct-to-Consumer Full-Grain Leather Without Luxury Markups
            </span>
          </div>
        </div>
      </section>

      {/* 3. SHOP BY CATEGORY EDITORIAL GRID — 2 flagship hero tiles + 2x2 mosaic on mobile (matching reference), 3-col on desktop */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-10 py-11 sm:py-16 lg:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-10">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#767676] dark:text-[#8A8E91] mb-1.5 sm:mb-2">
              Curated Collections
            </p>
            <h2 className="font-display text-[26px] sm:text-4xl font-semibold text-[#1C1C1C] dark:text-[#F4F3EE] leading-tight">
              Explore Handcrafted Outerwear &amp; Goods
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate({ view: 'collection', filter: 'all' })}
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase text-[#1C1C1C] dark:text-[#F4F3EE] hover:underline underline-offset-4 self-start sm:self-auto"
          >
            View All Collections <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {categories.map((cat, idx) => {
            const isHeroTileOnMobile = idx < 2;
            return (
              <button
                key={cat.title}
                type="button"
                onClick={() => onNavigate(cat.target)}
                className={`group relative bg-[#F1F1EF] dark:bg-[#161B1E] overflow-hidden text-left ${
                  isHeroTileOnMobile
                    ? 'col-span-2 sm:col-span-1 aspect-[16/10] sm:aspect-[4/3]'
                    : 'col-span-1 aspect-[4/5] sm:aspect-[4/3]'
                }`}
              >
                <SafeImage
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"
                />
                <div
                  className={`absolute inset-x-0 bottom-0 text-white ${
                    isHeroTileOnMobile ? 'p-5 sm:p-6' : 'p-3.5 sm:p-6'
                  }`}
                >
                  <h3
                    className={`font-display font-medium tracking-tight mb-0.5 sm:mb-1 ${
                      isHeroTileOnMobile ? 'text-2xl' : 'text-[18px] sm:text-2xl leading-tight'
                    }`}
                  >
                    {cat.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-white/80 flex items-center justify-between gap-2">
                    <span className={isHeroTileOnMobile ? 'truncate' : 'hidden sm:inline truncate'}>
                      {cat.subtitle}
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold tracking-wider uppercase text-white group-hover:translate-x-1 transition-transform shrink-0">
                      Shop <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
                    </span>
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. SHOP BEST SELLERS — 2-column mobile luxury grid */}
      <section className="bg-[#FAF9F7] dark:bg-[#13181B] border-y border-[#ECECE9] dark:border-[#22282C] py-12 sm:py-16 lg:py-20 transition-colors duration-200">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6 mb-7 sm:mb-10">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#C41E24] dark:text-[#E8555A] mb-1.5 sm:mb-2">
                Black Friday Event · 20% Off Best Sellers
              </p>
              <h2 className="font-display text-[28px] sm:text-4xl font-semibold text-[#1C1C1C] dark:text-[#F4F3EE]">
                Shop Best Sellers
              </h2>
            </div>

            {/* Clean Segmented Filter Tabs */}
            <div
              role="tablist"
              aria-label="Filter best sellers"
              className="grid grid-cols-4 sm:inline-flex items-center gap-1 bg-white dark:bg-[#0E1214] border border-[#E5E5E3] dark:border-[#262D31] p-1 w-full sm:w-auto self-start"
            >
              {(
                [
                  { id: 'all', label: 'All Icons' },
                  { id: 'men', label: 'Men' },
                  { id: 'women', label: 'Women' },
                  { id: 'suede', label: 'Suede' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={bestSellerTab === tab.id}
                  onClick={() => setBestSellerTab(tab.id)}
                  className={`px-2 sm:px-4 py-2 text-[11.5px] sm:text-xs font-medium transition-colors whitespace-nowrap shrink-0 text-center ${
                    bestSellerTab === tab.id
                      ? 'bg-[#1C1C1C] dark:bg-[#F4F3EE] text-white dark:text-[#0E1214]'
                      : 'text-[#595959] dark:text-[#A8ACAF] hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3.5 gap-y-7 sm:gap-x-7 sm:gap-y-11">
            {bestSellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currency={currency}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                onSelectProduct={(slug) => onNavigate({ view: 'product', slug })}
                onQuickAdd={onQuickAdd}
              />
            ))}
          </div>

          <div className="mt-9 sm:mt-12 text-center">
            <button
              type="button"
              onClick={() => onNavigate({ view: 'collection', filter: 'sale' })}
              className="w-full sm:w-auto px-9 py-3.5 border border-[#1C1C1C] dark:border-[#F4F3EE] text-[#1C1C1C] dark:text-[#F4F3EE] hover:bg-[#1C1C1C] dark:hover:bg-[#F4F3EE] hover:text-white dark:hover:text-[#0E1214] text-xs font-semibold tracking-[0.16em] uppercase transition-colors"
            >
              Shop All Best Sellers
            </button>
          </div>
        </div>
      </section>

      {/* 5. MADE FOR YOU / MADE TO FIT / MADE TO LAST — Dark Atelier Editorial Showcase (matching reference mobile contrast) */}
      <section className="bg-[#181B1D] dark:bg-[#111518] text-white py-12 sm:py-16 lg:py-24 transition-colors duration-200">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-10">
          {/* Mobile-first single-row tabs above the atelier image */}
          <div className="lg:hidden mb-6">
            <p className="text-[10.5px] font-semibold tracking-[0.2em] uppercase text-white/60 text-center mb-4">
              The Maison Valen Standard
            </p>
            <div
              className="grid grid-cols-3 gap-2 border-b border-white/15"
              role="tablist"
              aria-label="Maison Valen pillars"
            >
              {BESPOKE_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activePillar === tab.id}
                  onClick={() => setActivePillar(tab.id)}
                  className={`pb-3 text-[11px] font-semibold tracking-[0.1em] uppercase border-b-2 -mb-[1px] transition-colors whitespace-nowrap text-center ${
                    activePillar === tab.id
                      ? 'border-white text-white'
                      : 'border-transparent text-white/55 hover:text-white/85'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-14 items-stretch">
            <div className="lg:col-span-6 relative bg-[#22272A] aspect-[4/3] lg:aspect-auto lg:min-h-[380px] overflow-hidden">
              <SafeImage
                src={ASSETS.BESPOKE_CRAFT}
                alt="Maison Valen master leather craftsman hand-cutting full-grain espresso hide in atelier"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="hidden lg:block text-[11px] font-semibold tracking-[0.18em] uppercase text-white/60 mb-3">
                The Maison Valen Standard
              </p>

              {/* Desktop Pillar Tabs */}
              <div
                className="hidden lg:flex flex-wrap gap-6 border-b border-white/15 mb-7"
                role="tablist"
              >
                {BESPOKE_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={activePillar === tab.id}
                    onClick={() => setActivePillar(tab.id)}
                    className={`pb-3 text-xs font-semibold tracking-[0.14em] uppercase border-b-2 -mb-[1px] transition-colors whitespace-nowrap shrink-0 ${
                      activePillar === tab.id
                        ? 'border-white text-white'
                        : 'border-transparent text-white/55 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <h2 className="font-display text-[26px] sm:text-4xl font-semibold text-white leading-tight mb-3.5 sm:mb-4">
                {currentPillar.heading}
              </h2>
              <p className="text-sm sm:text-base text-white/75 leading-relaxed mb-6 sm:mb-7">
                {currentPillar.body}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-white/90 mb-7 sm:mb-8">
                {currentPillar.metrics.map((m, i) => (
                  <span key={m} className="inline-flex items-center gap-2">
                    {i > 0 && <span className="text-white/35" aria-hidden="true">/</span>}
                    <span>{m}</span>
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'builder' })}
                  className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-[#EAEAE6] text-[#141414] text-xs font-semibold tracking-[0.15em] uppercase transition-colors"
                >
                  Customize Your Own
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'brand' })}
                  className="text-xs font-semibold tracking-[0.14em] uppercase text-white/85 hover:text-white hover:underline underline-offset-4 py-2 text-center sm:text-left"
                >
                  Why &amp; How We Did It →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTRODUCING SUITS — Full-Width Editorial Tailoring Banner */}
      <section className="relative bg-[#161616] text-white overflow-hidden border-t border-white/10">
        <div className="max-w-[1440px] mx-auto relative min-h-[380px] lg:min-h-[500px] flex items-center">
          <div className="absolute inset-0">
            <SafeImage
              src={ASSETS.LUXURY_SUITS}
              alt="Introducing tailored charcoal wool suits with half-canvas construction"
              className="w-full h-full object-cover object-center opacity-75"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/85 via-black/60 to-black/25"
            />
          </div>

          <div className="relative z-10 max-w-xl px-5 sm:px-10 lg:px-16 py-12 sm:py-16">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/75 mb-2.5 sm:mb-3">
              Fine Wool Tailoring
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-semibold leading-tight mb-3.5 sm:mb-4">
              Introducing Suits
            </h2>
            <p className="text-sm sm:text-base text-white/85 leading-relaxed mb-7 sm:mb-8">
              A new chapter in fine tailoring, featuring the finest Super 130s wool fabrics from
              luxury mills, heritage craftsmanship, and canvassed construction for a natural shape,
              drape, and fit.
            </p>
            <button
              type="button"
              onClick={() => onNavigate({ view: 'collection', filter: 'suits' })}
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#141414] hover:bg-[#EAEAEA] text-xs font-semibold tracking-[0.16em] uppercase transition-colors"
            >
              Shop The Collection
            </button>
          </div>
        </div>
      </section>

      {/* 7. PEOPLE ARE TALKING + COMMUNITY REELS + STAR SPOTLIGHT — Smooth horizontal snap carousels on mobile */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-10 py-12 sm:py-16 lg:py-22">
        <div className="text-center max-w-2xl mx-auto mb-7 sm:mb-12">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#767676] dark:text-[#8A8E91] mb-1.5 sm:mb-2">
            Verified Customer Voices
          </p>
          <h2 className="font-display text-[28px] sm:text-4xl font-semibold text-[#1C1C1C] dark:text-[#F4F3EE]">
            People Are Talking
          </h2>
        </div>

        <div className="flex md:grid md:grid-cols-3 gap-4 sm:gap-7 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-4 px-4 pb-3 md:mx-0 md:px-0 md:pb-0 no-scrollbar mb-12 sm:mb-20">
          {CUSTOMER_REVIEWS.slice(0, 3).map((review) => (
            <article
              key={review.id}
              className="w-[82vw] max-w-[310px] md:w-auto md:max-w-none shrink-0 snap-start border border-[#E5E5E3] dark:border-[#252B2F] bg-white dark:bg-[#14191C] p-5 sm:p-7 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-3.5 sm:mb-4" aria-label={`${review.rating} out of 5 stars`}>
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Star
                      key={s}
                      className="w-3.5 h-3.5 fill-[#C89B3C] text-[#C89B3C] dark:fill-[#D9AD4E] dark:text-[#D9AD4E]"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="text-sm text-[#333333] dark:text-[#D5D7D8] leading-relaxed mb-5 sm:mb-6">
                  “{review.body}”
                </p>
              </div>

              <div className="pt-3.5 sm:pt-4 border-t border-[#F0F0EE] dark:border-[#22282C] text-xs">
                <p className="font-semibold text-[#1C1C1C] dark:text-[#F4F3EE]">{review.author}</p>
                <p className="text-[#767676] dark:text-[#8A8E91] mt-0.5">
                  {review.location} · {review.verifiedFit}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* COMMUNITY IN ACTION — Shoppable Customer & Influencer Videos */}
        <div className="mb-12 sm:mb-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-4 mb-6 sm:mb-8">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#767676] dark:text-[#8A8E91] mb-1.5 sm:mb-2">
                Community In Action
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1C1C1C] dark:text-[#F4F3EE]">
                Watch Real Fits &amp; Shop The Look
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#595959] dark:text-[#A8ACAF] max-w-md">
              Tap any customer or creator reel to inspect drape, leather patina, and shop the exact
              jacket in seconds.
            </p>
          </div>

          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory -mx-4 px-4 pb-3 sm:mx-0 sm:px-0 sm:pb-0 no-scrollbar">
            {COMMUNITY_VIDEOS.map((vid) => (
              <div
                key={vid.id}
                className="w-[68vw] max-w-[245px] sm:w-auto sm:max-w-none shrink-0 snap-start group border border-[#E5E5E3] dark:border-[#252B2F] bg-white dark:bg-[#14191C] flex flex-col"
              >
                <button
                  type="button"
                  onClick={() => {
                    setActiveVideo(vid);
                    setIsPlaying(true);
                    setReelProgress(0);
                  }}
                  aria-label={`Play community video by ${vid.creatorHandle}: ${vid.title}`}
                  className="relative aspect-[9/12] bg-[#14191C] overflow-hidden text-left"
                >
                  <SafeImage
                    src={vid.posterImage}
                    alt={`${vid.creatorHandle} wearing ${vid.productName}`}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/25"
                  />
                  <div className="absolute top-2.5 left-2.5 right-2.5 sm:top-3 sm:left-3 sm:right-3 flex items-center justify-between text-[10px] sm:text-[10.5px] font-semibold text-white/90">
                    <span className="bg-black/60 px-2 py-0.5 tracking-wide">{vid.views} views</span>
                    <span className="bg-black/60 px-2 py-0.5 tabular-nums">{vid.duration}</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/90 text-[#141414] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                      <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4 text-white">
                    <p className="text-[11px] font-semibold tracking-wide text-white/85">
                      {vid.creatorHandle}
                    </p>
                    <p className="text-xs font-medium leading-snug mt-0.5 line-clamp-2">
                      {vid.title}
                    </p>
                  </div>
                </button>

                <div className="p-3 sm:p-3.5 flex items-center justify-between gap-2 mt-auto">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#1C1C1C] dark:text-[#F4F3EE] truncate">
                      {vid.productName}
                    </p>
                    <p className="text-[11px] sm:text-[11.5px] text-[#595959] dark:text-[#A8ACAF] tabular-nums">
                      {formatMoney(vid.priceAED, currency)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate({ view: 'product', slug: vid.productSlug })}
                    className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#1C1C1C] dark:text-[#F4F3EE] hover:underline whitespace-nowrap shrink-0 py-1"
                  >
                    Shop
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Star Spotlight */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#767676] dark:text-[#8A8E91] mb-1.5 sm:mb-2">
              Star Spotlight
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1C1C1C] dark:text-[#F4F3EE]">
              Styled From Premieres to Off-Duty Moments
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#595959] dark:text-[#A8ACAF] max-w-md">
            Browse iconic looks and shop the exact handcrafted piece worn by artists and creators.
          </p>
        </div>

        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory -mx-4 px-4 pb-3 sm:mx-0 sm:px-0 sm:pb-0 no-scrollbar">
          {STAR_SPOTLIGHT.map((spot) => (
            <div
              key={spot.handle}
              className="w-[68vw] max-w-[245px] sm:w-auto sm:max-w-none shrink-0 snap-start group border border-[#E5E5E3] dark:border-[#252B2F] bg-white dark:bg-[#14191C]"
            >
              <div className="aspect-[3/4] bg-[#F1F1EF] dark:bg-[#181E21] overflow-hidden">
                <SafeImage
                  src={spot.image}
                  alt={`${spot.handle} wearing ${spot.productName}`}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-3.5 sm:p-4 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#1C1C1C] dark:text-[#F4F3EE] truncate">
                    {spot.handle}
                  </p>
                  <p className="text-[11px] sm:text-[11.5px] text-[#767676] dark:text-[#8A8E91] truncate">
                    {spot.productName}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'product', slug: spot.productSlug })}
                  className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#1C1C1C] dark:text-[#F4F3EE] hover:underline whitespace-nowrap shrink-0 py-1"
                >
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. CREATE YOUR CUSTOM LEATHER JACKETS — Direct Inquiry Form */}
      <section className="bg-[#FAF9F7] dark:bg-[#13181B] border-y border-[#E5E5E3] dark:border-[#22282C] py-12 sm:py-16 lg:py-20 transition-colors duration-200">
        <div className="max-w-[920px] mx-auto px-4 sm:px-10">
          <div className="text-center mb-7 sm:mb-10">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#767676] dark:text-[#8A8E91] mb-1.5 sm:mb-2">
              Bespoke Atelier Consultation
            </p>
            <h2 className="font-display text-[28px] sm:text-4xl font-semibold text-[#1C1C1C] dark:text-[#F4F3EE] mb-2.5 sm:mb-3">
              Create Your Custom Leather Jackets
            </h2>
            <p className="text-sm text-[#595959] dark:text-[#A8ACAF] max-w-xl mx-auto">
              Share your vision for a one-off custom leather piece or a group commission. A
              dedicated design consultant responds within 24 hours with hide options and a free
              estimate.
            </p>
          </div>

          {submittedRecord ? (
            <div className="bg-white dark:bg-[#171D20] border border-[#1C1C1C] dark:border-[#F4F3EE] p-8 text-center">
              <div className="w-11 h-11 bg-[#1C1C1C] dark:bg-[#F4F3EE] text-white dark:text-[#0E1214] flex items-center justify-center mx-auto mb-4">
                <Check className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-[#1C1C1C] dark:text-[#F4F3EE] mb-2">
                Bespoke Request Received
              </h3>
              <p className="text-sm text-[#595959] dark:text-[#A8ACAF] max-w-md mx-auto mb-4">
                Thank you, <strong className="text-[#1C1C1C] dark:text-[#F4F3EE]">{submittedRecord.fullName}</strong>.
                Your reference ID is{' '}
                <strong className="text-[#1C1C1C] dark:text-[#F4F3EE] tabular-nums">{submittedRecord.id}</strong>. Our
                UAE design desk will email{' '}
                <span className="text-[#1C1C1C] dark:text-[#F4F3EE]">{submittedRecord.email}</span> shortly.
              </p>
              <button
                type="button"
                onClick={() => setSubmittedRecord(null)}
                className="px-6 py-2.5 border border-[#1C1C1C] dark:border-[#F4F3EE] text-xs font-semibold tracking-[0.14em] uppercase hover:bg-[#1C1C1C] hover:text-white dark:hover:bg-[#F4F3EE] dark:hover:text-[#0E1214] transition-colors"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleInquirySubmit}
              noValidate
              className="bg-white dark:bg-[#161B1E] border border-[#E5E5E3] dark:border-[#262D31] p-4 sm:p-10 space-y-4 sm:space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="inq-name" className="block text-xs font-medium text-[#1C1C1C] dark:text-[#E5E4DE] mb-1.5">
                    Full Name*
                  </label>
                  <input
                    id="inq-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Tariq Al Mansoori"
                    className="w-full bg-white dark:bg-[#0E1214] border border-[#D4D4D0] dark:border-[#2B3237] px-3.5 py-2.5 text-sm text-[#1C1C1C] dark:text-[#F4F3EE] placeholder:text-[#767676] dark:placeholder:text-[#707579]"
                  />
                </div>
                <div>
                  <label htmlFor="inq-email" className="block text-xs font-medium text-[#1C1C1C] dark:text-[#E5E4DE] mb-1.5">
                    Email*
                  </label>
                  <input
                    id="inq-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-white dark:bg-[#0E1214] border border-[#D4D4D0] dark:border-[#2B3237] px-3.5 py-2.5 text-sm text-[#1C1C1C] dark:text-[#F4F3EE] placeholder:text-[#767676] dark:placeholder:text-[#707579]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="inq-phone" className="block text-xs font-medium text-[#1C1C1C] dark:text-[#E5E4DE] mb-1.5">
                    Phone*
                  </label>
                  <input
                    id="inq-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+971 50 123 4567"
                    className="w-full bg-white dark:bg-[#0E1214] border border-[#D4D4D0] dark:border-[#2B3237] px-3.5 py-2.5 text-sm text-[#1C1C1C] dark:text-[#F4F3EE]"
                  />
                </div>
                <div>
                  <label htmlFor="inq-company" className="block text-xs font-medium text-[#1C1C1C] dark:text-[#E5E4DE] mb-1.5">
                    Company or Organization (Optional)
                  </label>
                  <input
                    id="inq-company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Optional for individual orders"
                    className="w-full bg-white dark:bg-[#0E1214] border border-[#D4D4D0] dark:border-[#2B3237] px-3.5 py-2.5 text-sm text-[#1C1C1C] dark:text-[#F4F3EE] placeholder:text-[#767676] dark:placeholder:text-[#707579]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="inq-qty" className="block text-xs font-medium text-[#1C1C1C] dark:text-[#E5E4DE] mb-1.5">
                    Quantity
                  </label>
                  <select
                    id="inq-qty"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full border border-[#D4D4D0] dark:border-[#2B3237] px-3 py-2.5 text-sm bg-white dark:bg-[#0E1214] text-[#1C1C1C] dark:text-[#F4F3EE]"
                  >
                    <option value="1">1</option>
                    <option value="2-5">2–5</option>
                    <option value="6-20">6–20</option>
                    <option value="21-50">21–50</option>
                    <option value="50+">50+</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="inq-country" className="block text-xs font-medium text-[#1C1C1C] dark:text-[#E5E4DE] mb-1.5">
                    Country
                  </label>
                  <select
                    id="inq-country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full border border-[#D4D4D0] dark:border-[#2B3237] px-3 py-2.5 text-sm bg-white dark:bg-[#0E1214] text-[#1C1C1C] dark:text-[#F4F3EE]"
                  >
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="inq-gender" className="block text-xs font-medium text-[#1C1C1C] dark:text-[#E5E4DE] mb-1.5">
                    Gender
                  </label>
                  <select
                    id="inq-gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full border border-[#D4D4D0] dark:border-[#2B3237] px-3 py-2.5 text-sm bg-white dark:bg-[#0E1214] text-[#1C1C1C] dark:text-[#F4F3EE]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Unisex / Mixed">Unisex / Mixed</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="inq-budget" className="block text-xs font-medium text-[#1C1C1C] dark:text-[#E5E4DE] mb-1.5">
                    Budget (AED)
                  </label>
                  <input
                    id="inq-budget"
                    type="number"
                    min={500}
                    step={100}
                    value={budgetAED}
                    onChange={(e) => setBudgetAED(e.target.value)}
                    className="w-full bg-white dark:bg-[#0E1214] border border-[#D4D4D0] dark:border-[#2B3237] px-3 py-2.5 text-sm text-[#1C1C1C] dark:text-[#F4F3EE] tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="inq-desc" className="block text-xs font-medium text-[#1C1C1C] dark:text-[#E5E4DE] mb-1.5">
                  Custom Order Description*
                </label>
                <textarea
                  id="inq-desc"
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the leather hide, color, collar style, hardware, lining, or custom embroidery you have in mind..."
                  className="w-full bg-white dark:bg-[#0E1214] border border-[#D4D4D0] dark:border-[#2B3237] px-3.5 py-2.5 text-sm text-[#1C1C1C] dark:text-[#F4F3EE] placeholder:text-[#767676] dark:placeholder:text-[#707579]"
                />
              </div>

              {formError && (
                <p role="alert" className="text-xs text-[#C41E24] dark:text-[#E8555A] font-medium">
                  {formError}
                </p>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <p className="text-xs text-[#767676] dark:text-[#8A8E91]">
                  No Minimum Order Quantity (1+ Units) · Free consultation &amp; 2D illustration preview.
                </p>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-9 py-3.5 bg-[#1C1C1C] dark:bg-[#F4F3EE] hover:bg-black dark:hover:bg-white text-white dark:text-[#0E1214] text-xs font-semibold tracking-[0.16em] uppercase transition-colors"
                >
                  Start Free Consultation
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* 9. HERITAGE METRICS STRIP */}
      <section className="bg-white dark:bg-[#0E1214] py-10 sm:py-14 transition-colors duration-200">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            {[
              { value: '41,000+', label: 'Customers Served' },
              { value: '478,000+', label: 'Custom Requests' },
              { value: '135+', label: 'Countries Covered' },
              { value: '3,900+', label: 'Verified Reviews' },
            ].map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="font-display text-2xl sm:text-4xl font-semibold text-[#1C1C1C] dark:text-[#F4F3EE] tabular-nums">
                  {stat.value}
                </p>
                <p className="text-[11px] sm:text-xs tracking-[0.12em] uppercase text-[#595959] dark:text-[#A8ACAF]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shoppable Community Video Lightbox Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75"
          role="dialog"
          aria-modal="true"
          aria-label={`Community video by ${activeVideo.creatorHandle}`}
        >
          <div className="bg-white dark:bg-[#14191C] border border-[#E5E5E3] dark:border-[#262D31] w-full max-w-3xl max-h-[92dvh] overflow-y-auto grid grid-cols-1 md:grid-cols-12 shadow-2xl">
            {/* Simulated Video Reel Stage */}
            <div className="md:col-span-6 relative bg-[#0B0E10] aspect-[4/3] md:aspect-auto md:min-h-[460px] overflow-hidden">
              <SafeImage
                src={reelProgress > 55 ? activeVideo.secondaryFrameImage : activeVideo.posterImage}
                alt={activeVideo.title}
                className={`w-full h-full object-cover object-top transition-transform duration-700 ${
                  isPlaying ? 'scale-[1.06]' : 'scale-100'
                }`}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"
              />
              {/* Top Progress Scrubber */}
              <div className="absolute top-3 left-3 right-3 h-1 bg-white/30 overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-200"
                  style={{ width: `${reelProgress}%` }}
                />
              </div>
              <div className="absolute top-6 left-4 right-4 flex items-center justify-between text-xs text-white">
                <span className="font-semibold">{activeVideo.creatorHandle}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPlaying((p) => !p)}
                    aria-label={isPlaying ? 'Pause video reel' : 'Play video reel'}
                    className="p-1.5 bg-black/55 hover:bg-black/80 text-white"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMuted((m) => !m)}
                    aria-label={isMuted ? 'Unmute video reel' : 'Mute video reel'}
                    className="p-1.5 bg-black/55 hover:bg-black/80 text-white"
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-[11px] uppercase tracking-[0.14em] text-white/75">
                  {activeVideo.location} · {activeVideo.duration}
                </p>
                <p className="text-sm font-medium mt-0.5">{activeVideo.title}</p>
              </div>
            </div>

            {/* Shoppable Product Panel */}
            <div className="md:col-span-6 p-6 flex flex-col justify-between text-[#1C1C1C] dark:text-[#F4F3EE]">
              <div>
                <div className="flex items-start justify-between gap-2 pb-4 border-b border-[#EFEFED] dark:border-[#23292D]">
                  <div>
                    <p className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-[#767676] dark:text-[#8A8E91]">
                      Shoppable Community Reel
                    </p>
                    <h3 className="font-display text-2xl font-semibold mt-1">
                      {activeVideo.productName}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveVideo(null)}
                    aria-label="Close community video"
                    className="p-1.5 text-[#595959] dark:text-[#A8ACAF] hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE]"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>

                <p className="mt-4 text-sm text-[#4A4A4A] dark:text-[#B0B3B5] italic leading-relaxed">
                  “{activeVideo.quote}”
                </p>
                <p className="mt-3 text-xs text-[#767676] dark:text-[#8A8E91]">
                  {activeVideo.creatorRole} · {activeVideo.fitNote}
                </p>

                <div className="mt-6 p-4 bg-[#FAF9F7] dark:bg-[#0E1214] border border-[#E5E5E3] dark:border-[#262D31]">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-[#767676] dark:text-[#8A8E91]">
                    Featured Piece
                  </p>
                  <p className="font-display text-2xl font-semibold mt-1 tabular-nums">
                    {formatMoney(activeVideo.priceAED, currency)}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const matched = PRODUCTS.find((p) => p.slug === activeVideo.productSlug);
                    if (matched) onQuickAdd(matched);
                    setActiveVideo(null);
                  }}
                  className="w-full py-3.5 bg-[#1C1C1C] dark:bg-[#F4F3EE] hover:bg-black dark:hover:bg-white text-white dark:text-[#0E1214] text-xs font-semibold tracking-[0.15em] uppercase inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Quick Add To Cart</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const slug = activeVideo.productSlug;
                    setActiveVideo(null);
                    onNavigate({ view: 'product', slug });
                  }}
                  className="w-full py-3 border border-[#1C1C1C] dark:border-[#F4F3EE] text-[#1C1C1C] dark:text-[#F4F3EE] hover:bg-[#FAF9F7] dark:hover:bg-[#1A2024] text-xs font-semibold tracking-[0.15em] uppercase transition-colors"
                >
                  View Full Product Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
