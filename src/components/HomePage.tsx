import { useState, type FormEvent } from 'react';
import { ArrowRight, Check, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import {
  ASSETS,
  CUSTOMER_REVIEWS,
  PRESS_QUOTES,
  PRODUCTS,
  STAR_SPOTLIGHT,
} from '../data/catalog';
import type { AppPage, CurrencyCode, CustomInquiry, Product } from '../types';
import { ProductCard } from './ProductCard';
import { SafeImage } from './SafeImage';

interface HomePageProps {
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
      {/* 1. CAMPAIGN HERO — Faithful studio alabaster aesthetic matching thejacketmaker.ae */}
      <section className="relative bg-[#EAEAEA] overflow-hidden border-b border-[#E5E5E3]">
        <div className="max-w-[1440px] mx-auto relative min-h-[540px] lg:min-h-[640px] flex items-center">
          {/* Background Studio Photography */}
          <div className="absolute inset-0">
            <SafeImage
              src={ASSETS.HERO_CAMPAIGN}
              alt="The Jacket Maker UAE Black Friday Event featuring handcrafted black biker, cognac cafe racer, and shearling aviator leather jackets"
              className="w-full h-full object-cover object-[85%_12%]"
            />
            {/* Gentle readability scrim on small viewports */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-[#EAEAEA] via-[#EAEAEA]/85 to-transparent lg:via-[#EAEAEA]/25 lg:to-transparent"
            />
          </div>

          {/* Editorial Left Column Typography */}
          <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16 py-16 lg:py-24">
            <div className="max-w-2xl">
              <p className="font-display text-xl sm:text-2xl text-[#1C1C1C] tracking-tight mb-2">
                Our Only Sale Of The Year
              </p>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[52px] font-bold text-[#141414] leading-[1.08] tracking-tight mb-2">
                The Black Friday Event
              </h1>
              <p className="font-display text-4xl sm:text-5xl lg:text-[54px] font-normal text-[#141414] leading-[1.08] mb-5">
                Up to 25% OFF
              </p>
              <p className="text-sm sm:text-[15px] text-[#444444] leading-relaxed max-w-md mb-8">
                Full-grain handcrafted leather jackets, velvet-nap suede, and bespoke tailoring —
                shipped free across the UAE with all customs duties covered.
              </p>

              <div className="flex flex-wrap items-center gap-6">
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'collection', filter: 'sale' })}
                  className="px-8 py-3.5 bg-[#1C1C1C] hover:bg-black text-white text-xs font-semibold tracking-[0.16em] uppercase transition-colors"
                >
                  Shop The Sale
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'builder' })}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.14em] uppercase text-[#1C1C1C] underline underline-offset-8 decoration-[#1C1C1C]/40 hover:decoration-[#1C1C1C] py-2 transition-colors"
                >
                  Or Design Your Own <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. AS FEATURED IN + TRUST PROOF */}
      <section className="bg-white border-b border-[#EFEFED] py-12 sm:py-14">
        <div className="max-w-[1100px] mx-auto px-6 text-center">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#767676] mb-5">
            As Featured In
          </p>

          <div className="flex items-center justify-center gap-4 sm:gap-8 min-h-[72px]">
            <button
              type="button"
              aria-label="Previous press quote"
              onClick={() =>
                setPressIndex((prev) => (prev === 0 ? PRESS_QUOTES.length - 1 : prev - 1))
              }
              className="p-2 text-[#595959] hover:text-[#1C1C1C] transition-colors shrink-0"
            >
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>

            <blockquote className="font-display text-lg sm:text-2xl italic text-[#1C1C1C] max-w-2xl leading-snug">
              {activePress.quote}
            </blockquote>

            <button
              type="button"
              aria-label="Next press quote"
              onClick={() => setPressIndex((prev) => (prev + 1) % PRESS_QUOTES.length)}
              className="p-2 text-[#595959] hover:text-[#1C1C1C] transition-colors shrink-0"
            >
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Interactive Outlet Selector Row */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {PRESS_QUOTES.map((item, idx) => (
              <button
                key={item.outlet}
                type="button"
                onClick={() => setPressIndex(idx)}
                className={`font-display text-sm sm:text-base tracking-[0.14em] transition-colors ${
                  idx === pressIndex
                    ? 'text-[#1C1C1C] font-bold underline underline-offset-8 decoration-[#1C1C1C]'
                    : 'text-[#9A9A96] hover:text-[#595959]'
                }`}
              >
                {item.outlet}
              </button>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-[#F0F0EE] flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-[#595959]">
            <span className="inline-flex items-center gap-1" aria-label="4.9 out of 5 stars">
              {[0, 1, 2, 3, 4].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-[#C89B3C] text-[#C89B3C]" aria-hidden="true" />
              ))}
            </span>
            <span className="font-semibold text-[#1C1C1C] tabular-nums">3,450+ Reviews &amp; 4.9 Rating</span>
            <span aria-hidden="true">·</span>
            <span>Direct-to-Consumer Full-Grain Leather Without Luxury Markups</span>
          </div>
        </div>
      </section>

      {/* 3. SHOP BY CATEGORY EDITORIAL GRID */}
      <section className="max-w-[1360px] mx-auto px-6 sm:px-10 py-16 lg:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#767676] mb-2">
              Curated Collections
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1C1C1C]">
              Explore Handcrafted Outerwear &amp; Goods
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate({ view: 'collection', filter: 'all' })}
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase text-[#1C1C1C] hover:underline underline-offset-4 self-start sm:self-auto"
          >
            View All Collections <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <button
              key={cat.title}
              type="button"
              onClick={() => onNavigate(cat.target)}
              className="group relative aspect-[4/3] bg-[#F1F1EF] overflow-hidden text-left"
            >
              <SafeImage
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <h3 className="font-display text-2xl font-medium tracking-tight mb-1">
                  {cat.title}
                </h3>
                <p className="text-xs text-white/80 flex items-center justify-between">
                  <span>{cat.subtitle}</span>
                  <span className="inline-flex items-center gap-1 font-semibold tracking-wider uppercase text-white group-hover:translate-x-1 transition-transform">
                    Shop <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 4. SHOP BEST SELLERS */}
      <section className="bg-[#FAF9F7] border-y border-[#ECECE9] py-16 lg:py-20">
        <div className="max-w-[1360px] mx-auto px-6 sm:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#C41E24] mb-2">
                Black Friday Event · 20% Off Best Sellers
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1C1C1C]">
                Shop Best Sellers
              </h2>
            </div>

            {/* Clean Segmented Filter Tabs */}
            <div
              role="tablist"
              aria-label="Filter best sellers"
              className="inline-flex items-center gap-1 bg-white border border-[#E5E5E3] p-1 self-start"
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
                  className={`px-4 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    bestSellerTab === tab.id
                      ? 'bg-[#1C1C1C] text-white'
                      : 'text-[#595959] hover:text-[#1C1C1C]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-11">
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

          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => onNavigate({ view: 'collection', filter: 'sale' })}
              className="px-9 py-3.5 border border-[#1C1C1C] text-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-white text-xs font-semibold tracking-[0.16em] uppercase transition-colors"
            >
              Shop All Best Sellers
            </button>
          </div>
        </div>
      </section>

      {/* 5. MADE FOR YOU / MADE TO FIT / MADE TO LAST — Bespoke Craftsmanship Section */}
      <section className="max-w-[1360px] mx-auto px-6 sm:px-10 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          <div className="lg:col-span-6 relative bg-[#F1F1EF] min-h-[360px]">
            <SafeImage
              src={ASSETS.BESPOKE_CRAFT}
              alt="Master leather craftsman hand-cutting full-grain espresso hide in atelier"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#767676] mb-3">
              The Jacket Maker Standard
            </p>

            {/* Pillar Tabs */}
            <div className="flex flex-wrap gap-6 border-b border-[#E5E5E3] mb-7" role="tablist">
              {BESPOKE_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activePillar === tab.id}
                  onClick={() => setActivePillar(tab.id)}
                  className={`pb-3 text-xs font-semibold tracking-[0.14em] uppercase border-b-2 -mb-[1px] transition-colors whitespace-nowrap shrink-0 ${
                    activePillar === tab.id
                      ? 'border-[#1C1C1C] text-[#1C1C1C]'
                      : 'border-transparent text-[#767676] hover:text-[#1C1C1C]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1C1C1C] leading-tight mb-4">
              {currentPillar.heading}
            </h2>
            <p className="text-sm sm:text-base text-[#595959] leading-relaxed mb-7">
              {currentPillar.body}
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-[#1C1C1C] mb-8">
              {currentPillar.metrics.map((m, i) => (
                <span key={m} className="inline-flex items-center gap-2">
                  {i > 0 && <span className="text-[#BDBDB8]" aria-hidden="true">/</span>}
                  <span>{m}</span>
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate({ view: 'builder' })}
                className="px-7 py-3.5 bg-[#1C1C1C] hover:bg-black text-white text-xs font-semibold tracking-[0.15em] uppercase transition-colors"
              >
                Customize Your Own
              </button>
              <button
                type="button"
                onClick={() => onNavigate({ view: 'brand' })}
                className="text-xs font-semibold tracking-[0.14em] uppercase text-[#1C1C1C] hover:underline underline-offset-4 py-2"
              >
                Why &amp; How We Did It →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTRODUCING SUITS — Full-Width Editorial Tailoring Banner */}
      <section className="relative bg-[#161616] text-white overflow-hidden">
        <div className="max-w-[1440px] mx-auto relative min-h-[440px] lg:min-h-[500px] flex items-center">
          <div className="absolute inset-0">
            <SafeImage
              src={ASSETS.LUXURY_SUITS}
              alt="Introducing tailored charcoal wool suits with half-canvas construction"
              className="w-full h-full object-cover object-center opacity-75"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25"
            />
          </div>

          <div className="relative z-10 max-w-xl px-6 sm:px-10 lg:px-16 py-16">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/75 mb-3">
              Fine Wool Tailoring
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-semibold leading-tight mb-4">
              Introducing Suits
            </h2>
            <p className="text-sm sm:text-base text-white/85 leading-relaxed mb-8">
              A new chapter in fine tailoring, featuring the finest Super 130s wool fabrics from
              luxury mills, heritage craftsmanship, and canvassed construction for a natural shape,
              drape, and fit.
            </p>
            <button
              type="button"
              onClick={() => onNavigate({ view: 'collection', filter: 'suits' })}
              className="px-8 py-3.5 bg-white text-[#141414] hover:bg-[#EAEAEA] text-xs font-semibold tracking-[0.16em] uppercase transition-colors"
            >
              Shop The Collection
            </button>
          </div>
        </div>
      </section>

      {/* 7. PEOPLE ARE TALKING + STAR SPOTLIGHT */}
      <section className="max-w-[1360px] mx-auto px-6 sm:px-10 py-16 lg:py-22">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#767676] mb-2">
            Verified Customer Voices
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1C1C1C]">
            People Are Talking
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-20">
          {CUSTOMER_REVIEWS.slice(0, 3).map((review) => (
            <article
              key={review.id}
              className="border border-[#E5E5E3] bg-white p-7 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-4" aria-label={`${review.rating} out of 5 stars`}>
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-[#C89B3C] text-[#C89B3C]" aria-hidden="true" />
                  ))}
                </div>
                <p className="text-sm text-[#333333] leading-relaxed mb-6">“{review.body}”</p>
              </div>

              <div className="pt-4 border-t border-[#F0F0EE] text-xs">
                <p className="font-semibold text-[#1C1C1C]">{review.author}</p>
                <p className="text-[#767676] mt-0.5">
                  {review.location} · {review.verifiedFit}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Star Spotlight */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#767676] mb-2">
              Star Spotlight
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1C1C1C]">
              Styled From Premieres to Off-Duty Moments
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#595959] max-w-md">
            Browse iconic looks and shop the exact handcrafted piece worn by artists and creators.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STAR_SPOTLIGHT.map((spot) => (
            <div key={spot.handle} className="group border border-[#E5E5E3] bg-white">
              <div className="aspect-[3/4] bg-[#F1F1EF] overflow-hidden">
                <SafeImage
                  src={spot.image}
                  alt={`${spot.handle} wearing ${spot.productName}`}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-4 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#1C1C1C] truncate">{spot.handle}</p>
                  <p className="text-[11.5px] text-[#767676] truncate">{spot.productName}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'product', slug: spot.productSlug })}
                  className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#1C1C1C] hover:underline whitespace-nowrap shrink-0"
                >
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. CREATE YOUR CUSTOM LEATHER JACKETS — Direct Inquiry Form matching thejacketmaker.ae */}
      <section className="bg-[#FAF9F7] border-y border-[#E5E5E3] py-16 lg:py-20">
        <div className="max-w-[920px] mx-auto px-6 sm:px-10">
          <div className="text-center mb-10">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#767676] mb-2">
              Bespoke Atelier Consultation
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1C1C1C] mb-3">
              Create Your Custom Leather Jackets
            </h2>
            <p className="text-sm text-[#595959] max-w-xl mx-auto">
              Share your vision for a one-off custom leather piece or a group commission. A
              dedicated design consultant responds within 24 hours with hide options and a free
              estimate.
            </p>
          </div>

          {submittedRecord ? (
            <div className="bg-white border border-[#1C1C1C] p-8 text-center">
              <div className="w-11 h-11 bg-[#1C1C1C] text-white flex items-center justify-center mx-auto mb-4">
                <Check className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-[#1C1C1C] mb-2">
                Bespoke Request Received
              </h3>
              <p className="text-sm text-[#595959] max-w-md mx-auto mb-4">
                Thank you, <strong className="text-[#1C1C1C]">{submittedRecord.fullName}</strong>.
                Your reference ID is{' '}
                <strong className="text-[#1C1C1C] tabular-nums">{submittedRecord.id}</strong>. Our
                UAE design desk will email{' '}
                <span className="text-[#1C1C1C]">{submittedRecord.email}</span> shortly.
              </p>
              <button
                type="button"
                onClick={() => setSubmittedRecord(null)}
                className="px-6 py-2.5 border border-[#1C1C1C] text-xs font-semibold tracking-[0.14em] uppercase hover:bg-[#1C1C1C] hover:text-white transition-colors"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleInquirySubmit}
              noValidate
              className="bg-white border border-[#E5E5E3] p-6 sm:p-10 space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="inq-name" className="block text-xs font-medium text-[#1C1C1C] mb-1.5">
                    Full Name*
                  </label>
                  <input
                    id="inq-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Tariq Al Mansoori"
                    className="w-full border border-[#D4D4D0] px-3.5 py-2.5 text-sm text-[#1C1C1C]"
                  />
                </div>
                <div>
                  <label htmlFor="inq-email" className="block text-xs font-medium text-[#1C1C1C] mb-1.5">
                    Email*
                  </label>
                  <input
                    id="inq-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full border border-[#D4D4D0] px-3.5 py-2.5 text-sm text-[#1C1C1C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="inq-phone" className="block text-xs font-medium text-[#1C1C1C] mb-1.5">
                    Phone*
                  </label>
                  <input
                    id="inq-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+971 50 123 4567"
                    className="w-full border border-[#D4D4D0] px-3.5 py-2.5 text-sm text-[#1C1C1C]"
                  />
                </div>
                <div>
                  <label htmlFor="inq-company" className="block text-xs font-medium text-[#1C1C1C] mb-1.5">
                    Company or Organization (Optional)
                  </label>
                  <input
                    id="inq-company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Optional for individual orders"
                    className="w-full border border-[#D4D4D0] px-3.5 py-2.5 text-sm text-[#1C1C1C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="inq-qty" className="block text-xs font-medium text-[#1C1C1C] mb-1.5">
                    Quantity
                  </label>
                  <select
                    id="inq-qty"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full border border-[#D4D4D0] px-3 py-2.5 text-sm bg-white text-[#1C1C1C]"
                  >
                    <option value="1">1</option>
                    <option value="2-5">2–5</option>
                    <option value="6-20">6–20</option>
                    <option value="21-50">21–50</option>
                    <option value="50+">50+</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="inq-country" className="block text-xs font-medium text-[#1C1C1C] mb-1.5">
                    Country
                  </label>
                  <select
                    id="inq-country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full border border-[#D4D4D0] px-3 py-2.5 text-sm bg-white text-[#1C1C1C]"
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
                  <label htmlFor="inq-gender" className="block text-xs font-medium text-[#1C1C1C] mb-1.5">
                    Gender
                  </label>
                  <select
                    id="inq-gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full border border-[#D4D4D0] px-3 py-2.5 text-sm bg-white text-[#1C1C1C]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Unisex / Mixed">Unisex / Mixed</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="inq-budget" className="block text-xs font-medium text-[#1C1C1C] mb-1.5">
                    Budget (AED)
                  </label>
                  <input
                    id="inq-budget"
                    type="number"
                    min={500}
                    step={100}
                    value={budgetAED}
                    onChange={(e) => setBudgetAED(e.target.value)}
                    className="w-full border border-[#D4D4D0] px-3 py-2.5 text-sm text-[#1C1C1C] tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="inq-desc" className="block text-xs font-medium text-[#1C1C1C] mb-1.5">
                  Custom Order Description*
                </label>
                <textarea
                  id="inq-desc"
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the leather hide, color, collar style, hardware, lining, or custom embroidery you have in mind..."
                  className="w-full border border-[#D4D4D0] px-3.5 py-2.5 text-sm text-[#1C1C1C]"
                />
              </div>

              {formError && (
                <p role="alert" className="text-xs text-[#C41E24] font-medium">
                  {formError}
                </p>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <p className="text-xs text-[#767676]">
                  No obligation · Complimentary illustration preview before production.
                </p>
                <button
                  type="submit"
                  className="px-9 py-3.5 bg-[#1C1C1C] hover:bg-black text-white text-xs font-semibold tracking-[0.16em] uppercase transition-colors"
                >
                  Submit Custom Request
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* 9. HERITAGE METRICS STRIP — Exact stats from thejacketmaker.ae */}
      <section className="bg-white py-14">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: '41,000+', label: 'Customers Served' },
              { value: '478,000+', label: 'Custom Requests' },
              { value: '135+', label: 'Countries Covered' },
              { value: '3,900+', label: 'Verified Reviews' },
            ].map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="font-display text-3xl sm:text-4xl font-semibold text-[#1C1C1C] tabular-nums">
                  {stat.value}
                </p>
                <p className="text-xs tracking-[0.12em] uppercase text-[#595959]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
