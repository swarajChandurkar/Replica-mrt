import { useState, type FormEvent } from 'react';
import { ArrowRight, Check, Gift, Package, Ruler, Search, ShieldCheck, Star, Truck } from 'lucide-react';
import {
  ASSETS,
  BESPOKE_STEPS,
  CUSTOMER_REVIEWS,
  MEN_SIZE_CHART,
  PRESS_QUOTES,
  WOMEN_SIZE_CHART,
} from '../data/catalog';
import type { AppPage, CartItem, CurrencyCode, CustomInquiry, OrderRecord } from '../types';
import { calculateCorporateQuote, formatMoney } from '../utils/commerce';
import { SafeImage } from './SafeImage';

/* -------------------------------------------------------------------------- */
/* 1. CUSTOMIZE / BESPOKE PAGE                                                */
/* -------------------------------------------------------------------------- */

interface CustomizePageProps {
  onNavigate: (page: AppPage) => void;
  onSubmitInquiry: (inquiry: Omit<CustomInquiry, 'id' | 'submittedAt'>) => CustomInquiry;
}

export function CustomizePage({ onNavigate, onSubmitInquiry }: CustomizePageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+971 ');
  const [budget, setBudget] = useState('2200');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState<CustomInquiry | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.includes('@') || !notes.trim()) {
      setError('Please enter your name, a valid email, and your custom jacket details.');
      return;
    }
    setError('');
    const record = onSubmitInquiry({
      fullName: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      company: '',
      quantity: '1',
      country: 'United Arab Emirates',
      gender: 'Unisex',
      budgetAED: budget,
      description: notes.trim(),
    });
    setSubmitted(record);
    setName('');
    setEmail('');
    setNotes('');
  };

  return (
    <div>
      {/* Editorial Hero */}
      <section className="bg-[#FAF9F7] border-b border-[#E5E5E3]">
        <div className="max-w-[1360px] mx-auto px-6 sm:px-10 py-14 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#767676]">
              White-Glove Bespoke Service
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#1C1C1C] leading-tight">
              Custom Leather Jackets, Tailored Without Compromise
            </h1>
            <p className="text-sm sm:text-base text-[#595959] leading-relaxed">
              Modify any jacket in our collection or bring a completely original concept to life.
              Our design consultants walk with you through hide selection, custom artwork,
              illustrations, and millimeter-accurate measurements.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate({ view: 'builder' })}
                className="px-7 py-3.5 bg-[#1C1C1C] hover:bg-black text-white text-xs font-semibold tracking-[0.15em] uppercase transition-colors"
              >
                Launch Interactive Builder
              </button>
              <a
                href="#bespoke-consultation"
                className="px-7 py-3.5 border border-[#1C1C1C] text-[#1C1C1C] hover:bg-white text-xs font-semibold tracking-[0.15em] uppercase transition-colors"
              >
                Request Consultant Call
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 aspect-[4/3] bg-[#EFEFED] overflow-hidden">
            <SafeImage
              src={ASSETS.BESPOKE_CRAFT}
              alt="Bespoke leather atelier workbench"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Tier Comparison */}
      <section className="max-w-[1360px] mx-auto px-6 sm:px-10 py-16">
        <h2 className="font-display text-3xl font-semibold text-[#1C1C1C] mb-8">
          Three Ways to Tailor Your Piece
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: '01. Standard Ready-to-Wear',
              price: 'Included',
              desc: 'Choose from eight inclusive sizes (XS to 4XL) crafted on-demand from full-grain sheepskin, cowhide, or suede.',
              cta: 'Browse Catalog',
              action: () => onNavigate({ view: 'collection', filter: 'men' }),
            },
            {
              title: '02. Made-to-Measure Fit',
              price: '+Dhs. 200 AED',
              desc: 'Select any design from our store and supply your chest, waist, shoulder, and sleeve measurements for a sculpted bespoke fit.',
              cta: 'Shop Best Sellers',
              action: () => onNavigate({ view: 'collection', filter: 'sale' }),
            },
            {
              title: '03. 100% Bespoke From Scratch',
              price: 'From Dhs. 5,054 AED',
              desc: 'Pick your exact hide, finish, color, hardware, lining, and inner monogram—complete with custom illustration and studio photo approval.',
              cta: 'Design Your Own',
              action: () => onNavigate({ view: 'builder' }),
            },
          ].map((tier) => (
            <div key={tier.title} className="border border-[#E5E5E3] p-7 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-[#767676] mb-1">{tier.price}</p>
                <h3 className="font-display text-2xl font-semibold text-[#1C1C1C] mb-3">
                  {tier.title}
                </h3>
                <p className="text-sm text-[#595959] leading-relaxed mb-6">{tier.desc}</p>
              </div>
              <button
                type="button"
                onClick={tier.action}
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase text-[#1C1C1C] hover:underline underline-offset-4"
              >
                {tier.cta} <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 7-Step Process */}
      <section className="bg-[#FAF9F7] border-y border-[#E5E5E3] py-16">
        <div className="max-w-[1360px] mx-auto px-6 sm:px-10">
          <h2 className="font-display text-3xl font-semibold text-[#1C1C1C] mb-10">
            Our Bespoke Atelier Process
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BESPOKE_STEPS.map((s) => (
              <div key={s.step} className="bg-white border border-[#E5E5E3] p-6">
                <span className="font-display text-2xl font-semibold text-[#767676] tabular-nums">
                  {s.step}
                </span>
                <h3 className="font-body text-sm font-semibold text-[#1C1C1C] mt-3 mb-2">
                  {s.title}
                </h3>
                <p className="text-xs text-[#595959] leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Direct Consultation Form */}
      <section id="bespoke-consultation" className="max-w-[820px] mx-auto px-6 py-16">
        <h2 className="font-display text-3xl font-semibold text-[#1C1C1C] mb-2">
          Start a Bespoke Consultation
        </h2>
        <p className="text-sm text-[#595959] mb-7">
          Tell our design team what you envision—whether modifying a lapel, matching a heritage
          jacket, or commissioning custom team outerwear.
        </p>

        {submitted ? (
          <div className="border border-[#1C1C1C] p-7 bg-[#FAF9F7] space-y-2">
            <p className="font-semibold text-sm text-[#1C1C1C] flex items-center gap-2">
              <Check className="w-4 h-4" aria-hidden="true" /> Consultation Request Logged ({submitted.id})
            </p>
            <p className="text-xs text-[#595959]">
              A dedicated Jacket Maker consultant will reply to {submitted.email} within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4 border border-[#E5E5E3] p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cust-name" className="block text-xs font-medium mb-1">
                  Full Name*
                </label>
                <input
                  id="cust-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-[#D4D4D0] px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label htmlFor="cust-email" className="block text-xs font-medium mb-1">
                  Email*
                </label>
                <input
                  id="cust-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-[#D4D4D0] px-3.5 py-2.5 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cust-phone" className="block text-xs font-medium mb-1">
                  Phone (WhatsApp / Mobile)
                </label>
                <input
                  id="cust-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-[#D4D4D0] px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label htmlFor="cust-budget" className="block text-xs font-medium mb-1">
                  Target Budget (AED)
                </label>
                <input
                  id="cust-budget"
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full border border-[#D4D4D0] px-3.5 py-2.5 text-sm tabular-nums"
                />
              </div>
            </div>
            <div>
              <label htmlFor="cust-notes" className="block text-xs font-medium mb-1">
                Design Vision &amp; Details*
              </label>
              <textarea
                id="cust-notes"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Share preferred silhouette, leather hide, shade, and custom details..."
                className="w-full border border-[#D4D4D0] px-3.5 py-2.5 text-sm"
              />
            </div>
            {error && <p className="text-xs text-[#C41E24]">{error}</p>}
            <button
              type="submit"
              className="px-8 py-3.5 bg-[#1C1C1C] hover:bg-black text-white text-xs font-semibold tracking-[0.15em] uppercase transition-colors"
            >
              Submit Consultation
            </button>
          </form>
        )}
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. BRAND / OUR STORY PAGE — Faithful to thejacketmaker.ae/pages/our-story  */
/* -------------------------------------------------------------------------- */

export function BrandStoryPage({ onNavigate }: { onNavigate: (page: AppPage) => void }) {
  const pillars = [
    {
      num: '01',
      title: 'Finest Raw Materials',
      body: 'It all starts with the raw materials. Every jacket is cut from 100% full-grain natural leather hides, paired with authentic YKK metal zippers and breathable tailored linings.',
    },
    {
      num: '02',
      title: 'Exquisite Craftsmanship',
      body: 'Our outerwear is handmade one piece at a time by a single skilled craftsman with precision and pride—never rushed down a mass chain production line.',
    },
    {
      num: '03',
      title: 'Fair Pricing — Direct to You',
      body: 'With our direct-to-consumer model and just-in-time atelier production, our jackets arrive at roughly one-quarter the price traditional luxury labels charge for comparable full-grain leather.',
    },
    {
      num: '04',
      title: 'Sizes That Fit All',
      body: 'Everyone deserves the unmistakable feeling of a great leather jacket. We offer eight inclusive standard sizes from XS to 4XL plus our Made-to-Measure tailoring option.',
    },
    {
      num: '05',
      title: 'Discovery & Expression',
      body: 'No two people are identical. Our customers can create 100% custom bespoke pieces from scratch alongside our in-house design consultants to express their distinct identity.',
    },
  ];

  return (
    <div>
      {/* Founder's Letter */}
      <section className="max-w-[960px] mx-auto px-6 sm:px-10 py-16 lg:py-20">
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#767676] mb-3">
          Our Story
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#1C1C1C] leading-tight mb-8">
          Born Between Overpriced Luxury &amp; Disposable Fast Fashion
        </h1>

        <div className="space-y-5 text-base text-[#444444] leading-relaxed">
          <p>
            Any wardrobe is simply incomplete without a great leather jacket. A search for a truly
            well-made leather jacket is exactly where The Jacket Maker began, when a few friends and
            I went looking for leather jackets ourselves.
          </p>
          <p>
            We were frustrated by the choice between fast-fashion pieces that peel after a season
            and traditional luxury labels demanding well over $1,000. After digging into the
            industry, we saw why: long chains of distributors, wholesalers, retail markups, and
            bloated marketing budgets meant only a tiny fraction of what customers paid went into
            the leather and stitching itself.
          </p>
          <p>
            By designing and manufacturing in-house, selling directly to our community across the
            UAE and 135+ countries, and operating on-demand atelier production, we deliver full-grain
            craftsmanship at honest, accessible pricing.
          </p>
          <p className="font-display text-lg text-[#1C1C1C] font-semibold pt-2">
            — Syed Obaid, CEO &amp; Co-Founder
          </p>
        </div>
      </section>

      {/* The Jacket Maker Difference */}
      <section className="bg-[#FAF9F7] border-y border-[#E5E5E3] py-16 lg:py-20">
        <div className="max-w-[1360px] mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-6">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#767676]">
                Craft Philosophy
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1C1C1C]">
                The Jacket Maker Difference
              </h2>
              <div className="aspect-[4/3] bg-[#EFEFED] overflow-hidden">
                <SafeImage
                  src={ASSETS.BESPOKE_CRAFT}
                  alt="Artisan hand-cutting full-grain leather hide"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => onNavigate({ view: 'collection', filter: 'men' })}
                className="px-7 py-3.5 bg-[#1C1C1C] hover:bg-black text-white text-xs font-semibold tracking-[0.15em] uppercase transition-colors"
              >
                Explore The Collection
              </button>
            </div>

            <div className="lg:col-span-7 divide-y divide-[#E5E5E3]">
              {pillars.map((p) => (
                <div key={p.num} className="py-7 first:pt-0">
                  <span className="font-display text-sm text-[#767676] tabular-nums">{p.num}.</span>
                  <h3 className="font-display text-2xl font-semibold text-[#1C1C1C] mt-1 mb-2">
                    {p.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#595959] leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Press & Verified Reviews */}
      <section className="max-w-[1360px] mx-auto px-6 sm:px-10 py-16">
        <h2 className="font-display text-3xl font-semibold text-[#1C1C1C] mb-8">
          Press &amp; Verified Customer Praise
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {PRESS_QUOTES.slice(0, 3).map((q) => (
            <div key={q.outlet} className="border border-[#E5E5E3] p-6">
              <p className="font-display text-xs tracking-[0.18em] font-bold text-[#1C1C1C] mb-3">
                {q.outlet}
              </p>
              <p className="font-display italic text-lg text-[#333333] leading-snug">{q.quote}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CUSTOMER_REVIEWS.map((r) => (
            <div key={r.id} className="bg-[#FAF9F7] border border-[#E5E5E3] p-6">
              <div className="flex items-center gap-1 mb-2">
                {[0, 1, 2, 3, 4].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-[#C89B3C] text-[#C89B3C]" aria-hidden="true" />
                ))}
              </div>
              <p className="text-sm font-semibold text-[#1C1C1C] mb-1.5">{r.title}</p>
              <p className="text-xs text-[#595959] leading-relaxed mb-4">“{r.body}”</p>
              <p className="text-[11px] text-[#767676]">
                {r.author} · {r.location}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. CORPORATE GIFTS PAGE                                                    */
/* -------------------------------------------------------------------------- */

interface CorporateGiftsPageProps {
  currency: CurrencyCode;
  onSubmitInquiry: (inquiry: Omit<CustomInquiry, 'id' | 'submittedAt'>) => CustomInquiry;
}

export function CorporateGiftsPage({ currency, onSubmitInquiry }: CorporateGiftsPageProps) {
  const [qty, setQty] = useState(25);
  const [tier, setTier] = useState<'leather-jacket' | 'suede-bomber' | 'leather-bag' | 'tailored-suit'>(
    'leather-jacket'
  );
  const [embossing, setEmbossing] = useState(true);

  const [company, setCompany] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState<CustomInquiry | null>(null);
  const [error, setError] = useState('');

  const quote = calculateCorporateQuote(qty, tier, embossing);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !contactName.trim() || !email.includes('@')) {
      setError('Please enter your company name, contact name, and business email.');
      return;
    }
    setError('');
    const rec = onSubmitInquiry({
      fullName: contactName.trim(),
      email: email.trim(),
      phone: '+971 Corporate Desk',
      company: company.trim(),
      quantity: String(qty),
      country: 'United Arab Emirates',
      gender: 'Unisex / Mixed',
      budgetAED: String(Math.round(quote.totalAED)),
      description: `Corporate gifting order: ${qty} units of ${tier} (${
        embossing ? 'with custom logo embossing' : 'unbranded'
      }).`,
    });
    setSubmitted(rec);
    setCompany('');
    setContactName('');
    setEmail('');
  };

  return (
    <div className="max-w-[1360px] mx-auto px-6 sm:px-10 py-12 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-6 space-y-6">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#767676]">
            UAE &amp; Global Corporate Gifting
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#1C1C1C] leading-tight">
            Executive Leather Gifts That Leave a Lasting Impression
          </h1>
          <p className="text-sm sm:text-base text-[#595959] leading-relaxed">
            Partner with our bespoke atelier for executive jackets, embossed full-grain weekender
            bags, and milestone gifts. Trusted by motorsport teams, hospitality groups, and
            leadership retreats across Dubai, Abu Dhabi, and globally.
          </p>

          <div className="aspect-[4/3] bg-[#F1F1EF] overflow-hidden">
            <SafeImage
              src={ASSETS.LEATHER_WEEKENDER}
              alt="Handcrafted full-grain leather weekender corporate gift"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Live Corporate Volume Quote Estimator & Proposal Form */}
        <div className="lg:col-span-6 border border-[#E5E5E3] bg-[#FAF9F7] p-6 sm:p-9 space-y-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#1C1C1C] mb-1">
              Instant Volume Estimate
            </p>
            <p className="text-xs text-[#595959]">
              Tiered pricing unlocks automatically at 10, 25, 50, and 100+ units.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="corp-tier" className="block text-xs font-medium text-[#1C1C1C] mb-1.5">
                Gift Piece
              </label>
              <select
                id="corp-tier"
                value={tier}
                onChange={(e) => setTier(e.target.value as typeof tier)}
                className="w-full bg-white border border-[#D4D4D0] px-3 py-2.5 text-sm"
              >
                <option value="leather-jacket">Full-Grain Leather Jackets</option>
                <option value="suede-bomber">Suede Bomber Jackets</option>
                <option value="leather-bag">TruCarry Leather Weekenders</option>
                <option value="tailored-suit">Super 130s Wool Suits</option>
              </select>
            </div>
            <div>
              <label htmlFor="corp-qty" className="block text-xs font-medium text-[#1C1C1C] mb-1.5">
                Quantity (Min 10)
              </label>
              <input
                id="corp-qty"
                type="number"
                min={10}
                max={1000}
                value={qty}
                onChange={(e) => setQty(Math.max(10, Number(e.target.value) || 10))}
                className="w-full bg-white border border-[#D4D4D0] px-3 py-2.5 text-sm tabular-nums"
              />
            </div>
          </div>

          <label className="flex items-center gap-2.5 text-xs text-[#1C1C1C] cursor-pointer">
            <input
              type="checkbox"
              checked={embossing}
              onChange={(e) => setEmbossing(e.target.checked)}
              className="accent-[#1C1C1C]"
            />
            Include blind-debossed company logo &amp; custom presentation dust bags (+Dhs. 85 / unit)
          </label>

          {/* Estimate Summary */}
          <div className="bg-white border border-[#E5E5E3] p-5 space-y-2 text-xs tabular-nums">
            <div className="flex justify-between text-[#595959]">
              <span>Volume Discount Applied</span>
              <span className="font-semibold text-[#C41E24]">{quote.discountPercent}% OFF</span>
            </div>
            <div className="flex justify-between text-[#595959]">
              <span>Estimated Unit Price</span>
              <span className="font-medium text-[#1C1C1C]">
                {formatMoney(quote.unitFinalAED, currency)}
              </span>
            </div>
            <div className="flex justify-between text-[#595959]">
              <span>Total Volume Savings</span>
              <span className="font-medium text-[#1C1C1C]">
                {formatMoney(quote.totalSavingsAED, currency)}
              </span>
            </div>
            <div className="pt-3 mt-2 border-t border-[#EFEFED] flex items-baseline justify-between">
              <span className="font-semibold uppercase tracking-[0.12em] text-[#1C1C1C]">
                Estimated Order Total
              </span>
              <span className="font-display text-2xl font-semibold text-[#1C1C1C]">
                {formatMoney(quote.totalAED, currency)}
              </span>
            </div>
          </div>

          {submitted ? (
            <div className="bg-white border border-[#1C1C1C] p-5 text-xs space-y-1.5">
              <p className="font-semibold text-[#1C1C1C] flex items-center gap-1.5">
                <Check className="w-4 h-4" aria-hidden="true" /> Corporate Proposal Request Logged (
                {submitted.id})
              </p>
              <p className="text-[#595959]">
                Our Dubai corporate concierge will send leather swatches and formal quotation to{' '}
                {submitted.email}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Company / Organization*"
                  aria-label="Company or Organization"
                  className="bg-white border border-[#D4D4D0] px-3.5 py-2.5 text-sm"
                />
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Your Name*"
                  aria-label="Your Name"
                  className="bg-white border border-[#D4D4D0] px-3.5 py-2.5 text-sm"
                />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Work Email*"
                aria-label="Work Email"
                className="w-full bg-white border border-[#D4D4D0] px-3.5 py-2.5 text-sm"
              />
              {error && <p className="text-xs text-[#C41E24]">{error}</p>}
              <button
                type="submit"
                className="w-full py-3.5 bg-[#1C1C1C] hover:bg-black text-white text-xs font-semibold tracking-[0.15em] uppercase transition-colors"
              >
                Request Corporate Proposal &amp; Swatch Kit
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. GIFTING / GIFT CARDS PAGE                                               */
/* -------------------------------------------------------------------------- */

interface GiftingPageProps {
  currency: CurrencyCode;
  onAddToCart: (item: Omit<CartItem, 'lineId'>) => void;
}

const GIFT_AMOUNTS = [500, 1000, 1500, 2500, 5000];

export function GiftingPage({ currency, onAddToCart }: GiftingPageProps) {
  const [amountAED, setAmountAED] = useState(1000);
  const [format, setFormat] = useState<'Digital E-Card' | 'Luxury Boxed Leather Folio'>(
    'Digital E-Card'
  );
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleAddGiftCard = (e: FormEvent) => {
    e.preventDefault();
    onAddToCart({
      productId: `gift-card-${amountAED}-${format}`,
      slug: 'gift-cards',
      name: `The Jacket Maker Gift Card (${format})`,
      image: ASSETS.LEATHER_WEEKENDER,
      unitPriceAED: amountAED,
      quantity: 1,
      color: format,
      size: `Value: Dhs. ${amountAED} AED`,
      customSummary: [
        ...(recipientName.trim() ? [`For: ${recipientName.trim()}`] : []),
        ...(recipientEmail.trim() ? [`Delivery Email: ${recipientEmail.trim()}`] : []),
        ...(message.trim() ? [`Note: "${message.trim()}"`] : []),
      ],
    });
  };

  return (
    <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-12 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Live Luxury Gift Card Preview */}
        <div className="lg:col-span-6 space-y-6">
          <div className="aspect-[16/10] bg-[#161616] text-white p-8 sm:p-10 flex flex-col justify-between border border-black relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-display text-[10px] tracking-[0.26em] uppercase text-white/70">
                  THE
                </p>
                <p className="font-display text-2xl font-bold tracking-[0.06em] uppercase leading-none">
                  JACKET MAKER
                </p>
                <p className="text-[11px] tracking-[0.16em] uppercase text-white/60 mt-2">
                  UAE Atelier · {format}
                </p>
              </div>
              <Gift className="w-6 h-6 text-[#C89B3C]" aria-hidden="true" />
            </div>

            <div>
              {recipientName.trim() && (
                <p className="text-xs text-white/75 mb-1">Presented to {recipientName.trim()}</p>
              )}
              <p className="font-display text-3xl sm:text-4xl font-semibold tabular-nums">
                {formatMoney(amountAED, currency)}
              </p>
              <p className="text-[11px] text-white/60 mt-2">
                Redeemable on all Ready-to-Wear, Made-to-Measure &amp; Bespoke Jackets · Never Expires
              </p>
            </div>
          </div>

          <p className="text-sm text-[#595959] leading-relaxed">
            Unsure of their exact leather shade or size? Give the unmistakable experience of
            commissioning a handcrafted jacket or bespoke Made-to-Measure piece—valid online across
            the UAE and worldwide with zero expiration date.
          </p>
        </div>

        {/* Gift Card Configurator */}
        <form onSubmit={handleAddGiftCard} className="lg:col-span-6 space-y-6">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#767676] mb-2">
              Gifting Concierge
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1C1C1C]">
              The Jacket Maker Gift Card
            </h1>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#1C1C1C] mb-2.5">
              Select Presentation
            </p>
            <div className="grid grid-cols-2 gap-3">
              {(['Digital E-Card', 'Luxury Boxed Leather Folio'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setFormat(opt)}
                  className={`py-3 px-4 border text-xs font-semibold transition-colors ${
                    format === opt
                      ? 'bg-[#1C1C1C] text-white border-[#1C1C1C]'
                      : 'bg-white text-[#1C1C1C] border-[#D8D8D5] hover:border-[#1C1C1C]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#1C1C1C] mb-2.5">
              Select Value
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {GIFT_AMOUNTS.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmountAED(val)}
                  className={`py-2.5 border text-xs font-semibold tabular-nums transition-colors ${
                    amountAED === val
                      ? 'bg-[#1C1C1C] text-white border-[#1C1C1C]'
                      : 'bg-white text-[#1C1C1C] border-[#D8D8D5] hover:border-[#1C1C1C]'
                  }`}
                >
                  {val.toLocaleString()} AED
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Recipient Name (Optional)"
              aria-label="Recipient Name"
              className="w-full border border-[#D4D4D0] px-3.5 py-2.5 text-sm"
            />
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="Recipient Email (Optional)"
              aria-label="Recipient Email"
              className="w-full border border-[#D4D4D0] px-3.5 py-2.5 text-sm"
            />
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal gift note..."
              aria-label="Personal gift note"
              className="w-full border border-[#D4D4D0] px-3.5 py-2.5 text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[#1C1C1C] hover:bg-black text-white text-xs font-semibold tracking-[0.16em] uppercase transition-colors"
          >
            Add Gift Card to Cart · {formatMoney(amountAED, currency)}
          </button>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 5. HELP CENTER / TRACK ORDER / SIZE GUIDE / POLICIES                       */
/* -------------------------------------------------------------------------- */

interface HelpPageProps {
  initialTab?: 'track' | 'size-guide' | 'shipping' | 'returns' | 'contact';
  orders: OrderRecord[];
  currency: CurrencyCode;
}

export function HelpPage({ initialTab = 'track', orders, currency }: HelpPageProps) {
  const [tab, setTab] = useState<'track' | 'size-guide' | 'shipping' | 'returns' | 'contact'>(
    initialTab
  );
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const [sizeGender, setSizeGender] = useState<'men' | 'women'>('men');
  const [trackInput, setTrackInput] = useState('TJM-AE-84920');
  const [trackedOrder, setTrackedOrder] = useState<OrderRecord | 'not-found' | null>(null);
  const [contactSent, setContactSent] = useState(false);

  const handleTrack = (e: FormEvent) => {
    e.preventDefault();
    const cleaned = trackInput.trim().toUpperCase().replace(/^#/, '');
    const found = orders.find((o) => o.orderNumber.toUpperCase() === cleaned);
    if (found) {
      setTrackedOrder(found);
      return;
    }
    if (cleaned === 'TJM-AE-84920') {
      setTrackedOrder({
        orderNumber: 'TJM-AE-84920',
        placedAt: 'November 21, 2026',
        status: 'Quality Inspection',
        paymentMethod: 'Card',
        customerName: 'Zaid Al Habtoor',
        email: 'zaid@example.ae',
        phone: '+971 50 000 0000',
        city: 'Dubai',
        country: 'United Arab Emirates',
        items: [],
        subtotalAED: 976,
        discountAED: 0,
        totalAED: 976,
        estimatedDelivery: 'Nov 30 – Dec 02, 2026',
      });
      return;
    }
    setTrackedOrder('not-found');
  };

  const chartRows = sizeGender === 'men' ? MEN_SIZE_CHART : WOMEN_SIZE_CHART;

  return (
    <div className="max-w-[1200px] mx-auto px-6 sm:px-10 py-12 lg:py-16">
      <div className="mb-10">
        <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#767676] mb-2">
          Customer Care Concierge
        </p>
        <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#1C1C1C]">
          Help Center &amp; Policies
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#E5E5E3] pb-4 mb-10" role="tablist">
        {(
          [
            { id: 'track', label: 'Track Order' },
            { id: 'size-guide', label: 'Size Guide' },
            { id: 'shipping', label: 'Delivery Policy' },
            { id: 'returns', label: 'Returns & Exchanges' },
            { id: 'contact', label: 'Contact Us' },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-xs font-semibold tracking-[0.1em] uppercase transition-colors ${
              tab === t.id
                ? 'bg-[#1C1C1C] text-white'
                : 'bg-[#FAF9F7] text-[#595959] hover:text-[#1C1C1C]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'track' && (
        <div className="max-w-2xl space-y-6">
          <p className="text-sm text-[#595959]">
            Enter your Jacket Maker order number (try demo order{' '}
            <strong className="text-[#1C1C1C]">TJM-AE-84920</strong> or any order placed during this
            session).
          </p>
          <form onSubmit={handleTrack} className="flex gap-2">
            <label htmlFor="track-order-input" className="sr-only">
              Order Number
            </label>
            <input
              id="track-order-input"
              type="text"
              value={trackInput}
              onChange={(e) => setTrackInput(e.target.value)}
              placeholder="e.g. TJM-AE-84920"
              className="flex-1 border border-[#D4D4D0] px-4 py-3 text-sm"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#1C1C1C] text-white text-xs font-semibold tracking-[0.14em] uppercase inline-flex items-center gap-2"
            >
              <Search className="w-3.5 h-3.5" aria-hidden="true" /> Track
            </button>
          </form>

          {trackedOrder === 'not-found' && (
            <p className="text-sm text-[#C41E24]">
              No order matched that ID. Try <strong>TJM-AE-84920</strong> or check your Order
              History under Account.
            </p>
          )}

          {trackedOrder && trackedOrder !== 'not-found' && (
            <div className="border border-[#E5E5E3] bg-[#FAF9F7] p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#E5E5E3]">
                <div>
                  <p className="text-xs text-[#767676]">Order Reference</p>
                  <p className="font-display text-xl font-semibold text-[#1C1C1C] tabular-nums">
                    #{trackedOrder.orderNumber}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#767676]">Current Stage</p>
                  <p className="text-sm font-semibold text-[#1C1C1C]">{trackedOrder.status}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <p className="text-[#767676]">Recipient</p>
                  <p className="font-medium text-[#1C1C1C] mt-0.5">{trackedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-[#767676]">Destination</p>
                  <p className="font-medium text-[#1C1C1C] mt-0.5">
                    {trackedOrder.city}, {trackedOrder.country}
                  </p>
                </div>
                <div>
                  <p className="text-[#767676]">Estimated Delivery</p>
                  <p className="font-medium text-[#1C1C1C] mt-0.5">
                    {trackedOrder.estimatedDelivery}
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#595959] tabular-nums">
                Total Paid: <strong className="text-[#1C1C1C]">{formatMoney(trackedOrder.totalAED, currency)}</strong> ·
                All UAE duties &amp; VAT prepaid.
              </p>
            </div>
          )}
        </div>
      )}

      {tab === 'size-guide' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex border border-[#D8D8D5]">
              <button
                type="button"
                onClick={() => setSizeGender('men')}
                className={`px-4 py-2 text-xs font-semibold ${
                  sizeGender === 'men' ? 'bg-[#1C1C1C] text-white' : 'bg-white text-[#595959]'
                }`}
              >
                Men&apos;s Outerwear
              </button>
              <button
                type="button"
                onClick={() => setSizeGender('women')}
                className={`px-4 py-2 text-xs font-semibold ${
                  sizeGender === 'women' ? 'bg-[#1C1C1C] text-white' : 'bg-white text-[#595959]'
                }`}
              >
                Women&apos;s Outerwear
              </button>
            </div>

            <div className="inline-flex items-center gap-2 text-xs">
              <Ruler className="w-4 h-4 text-[#595959]" aria-hidden="true" />
              <button
                type="button"
                onClick={() => setUnit('cm')}
                className={`px-3 py-1.5 border ${
                  unit === 'cm' ? 'bg-[#1C1C1C] text-white border-[#1C1C1C]' : 'border-[#D8D8D5]'
                }`}
              >
                Centimeters (cm)
              </button>
              <button
                type="button"
                onClick={() => setUnit('in')}
                className={`px-3 py-1.5 border ${
                  unit === 'in' ? 'bg-[#1C1C1C] text-white border-[#1C1C1C]' : 'border-[#D8D8D5]'
                }`}
              >
                Inches (in)
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-[#E5E5E3]">
            <table className="w-full text-left text-xs tabular-nums">
              <thead className="bg-[#FAF9F7] border-b border-[#E5E5E3] text-[#1C1C1C] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Size</th>
                  <th className="py-3.5 px-4">EU Equivalent</th>
                  <th className="py-3.5 px-4">Chest ({unit})</th>
                  <th className="py-3.5 px-4">Waist ({unit})</th>
                  <th className="py-3.5 px-4">Sleeve ({unit})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEFED]">
                {chartRows.map((row) => (
                  <tr key={row.size} className="hover:bg-[#FAF9F7]">
                    <td className="py-3 px-4 font-semibold text-[#1C1C1C]">{row.size}</td>
                    <td className="py-3 px-4 text-[#595959]">EU {row.eu}</td>
                    <td className="py-3 px-4 text-[#1C1C1C]">
                      {unit === 'cm' ? row.chestCm : row.chestIn}
                    </td>
                    <td className="py-3 px-4 text-[#1C1C1C]">
                      {unit === 'cm' ? row.waistCm : row.waistIn}
                    </td>
                    <td className="py-3 px-4 text-[#1C1C1C]">
                      {unit === 'cm' ? row.sleeveCm : row.sleeveIn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'shipping' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Truck,
              title: 'Free Express UAE & GCC Delivery',
              body: 'Prime Delivery jackets dispatch within 24–48 hours and arrive across Dubai, Abu Dhabi, Sharjah, and the wider UAE in 3–5 business days.',
            },
            {
              icon: ShieldCheck,
              title: 'All Customs Duties & Taxes Covered',
              body: 'Your checkout total covers all UAE customs duties and VAT. You will never encounter surprise charges upon delivery, guaranteed.',
            },
            {
              icon: Package,
              title: 'Signature Front-Lock Packaging',
              body: 'Every jacket ships in a reinforced protective mailer with a breathable cotton storage bag to preserve full-grain leather drape.',
            },
          ].map((item) => (
            <div key={item.title} className="border border-[#E5E5E3] p-6 space-y-3">
              <item.icon className="w-5 h-5 text-[#1C1C1C]" aria-hidden="true" />
              <h2 className="font-display text-xl font-semibold text-[#1C1C1C]">{item.title}</h2>
              <p className="text-sm text-[#595959] leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'returns' && (
        <div className="max-w-2xl space-y-4 text-sm text-[#595959] leading-relaxed">
          <h2 className="font-display text-2xl font-semibold text-[#1C1C1C]">
            60-Day Exchange &amp; Hassle-Free Returns
          </h2>
          <p>
            Standard ready-to-wear sizes (XS–4XL) may be exchanged or returned within 60 days of
            delivery provided the leather piece is unworn with original tags and packaging intact.
          </p>
          <p>
            For Made-to-Measure and 100% Bespoke pieces, we include complimentary fit adjustments
            and alteration credits so your jacket drapes exactly as envisioned.
          </p>
        </div>
      )}

      {tab === 'contact' && (
        <div className="max-w-xl">
          {contactSent ? (
            <div className="border border-[#1C1C1C] p-6 bg-[#FAF9F7] text-sm">
              <p className="font-semibold text-[#1C1C1C] mb-1">Message Received</p>
              <p className="text-[#595959]">
                Our UAE concierge team will respond within one business day.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setContactSent(true);
              }}
              className="space-y-4 border border-[#E5E5E3] p-6"
            >
              <input
                type="text"
                required
                placeholder="Your Name*"
                aria-label="Your Name"
                className="w-full border border-[#D4D4D0] px-3.5 py-2.5 text-sm"
              />
              <input
                type="email"
                required
                placeholder="Email Address*"
                aria-label="Email Address"
                className="w-full border border-[#D4D4D0] px-3.5 py-2.5 text-sm"
              />
              <textarea
                rows={4}
                required
                placeholder="How can our concierge help?"
                aria-label="Message"
                className="w-full border border-[#D4D4D0] px-3.5 py-2.5 text-sm"
              />
              <button
                type="submit"
                className="px-7 py-3 bg-[#1C1C1C] text-white text-xs font-semibold tracking-[0.15em] uppercase"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
