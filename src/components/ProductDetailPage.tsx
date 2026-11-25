import { useState, type FormEvent } from 'react';
import {
  Check,
  ChevronDown,
  Heart,
  Package,
  Ruler,
  ShieldCheck,
  Star,
  Truck,
} from 'lucide-react';
import { CUSTOMER_REVIEWS, PRODUCTS, STANDARD_SIZES, WOMEN_STANDARD_SIZES } from '../data/catalog';
import type {
  AppPage,
  CartItem,
  CurrencyCode,
  CustomInquiry,
  CustomMeasurements,
  Product,
  ProductReview,
} from '../types';
import { formatMoney, MADE_TO_MEASURE_SURCHARGE_AED } from '../utils/commerce';
import { InstallmentsBanner } from './InstallmentsBanner';
import { ProductCard } from './ProductCard';
import { ProductCustomizeModal } from './ProductCustomizeModal';
import { SafeImage } from './SafeImage';

interface ProductDetailPageProps {
  product: Product;
  currency: CurrencyCode;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onNavigate: (page: AppPage) => void;
  onAddToCart: (item: Omit<CartItem, 'lineId'>) => void;
  onSubmitInquiry: (inquiry: Omit<CustomInquiry, 'id' | 'submittedAt'>) => CustomInquiry;
  onOpenSizeGuide: () => void;
}

export function ProductDetailPage({
  product,
  currency,
  wishlist,
  onToggleWishlist,
  onNavigate,
  onAddToCart,
  onSubmitInquiry,
  onOpenSizeGuide,
}: ProductDetailPageProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Jet Black');
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [isMadeToMeasure, setIsMadeToMeasure] = useState(false);
  const [customizeModalOpen, setCustomizeModalOpen] = useState(false);
  const [measurements, setMeasurements] = useState<CustomMeasurements>({
    chestCm: '',
    waistCm: '',
    hipsCm: '',
    shoulderCm: '',
    sleeveCm: '',
    heightCm: '',
    submitLaterByEmail: false,
  });
  const [sizeError, setSizeError] = useState('');
  const [activeImage, setActiveImage] = useState(product.image);
  const [openAccordion, setOpenAccordion] = useState<string | null>('specs');
  const [reviews, setReviews] = useState<ProductReview[]>(CUSTOMER_REVIEWS.slice(0, 3));
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const isShoe = product.category === 'shoes';
  const isBag = product.category === 'bags';
  const isWomen = product.gender === 'women';

  const unitPriceAED =
    product.priceAED + (isMadeToMeasure && !isBag ? MADE_TO_MEASURE_SURCHARGE_AED : 0);
  const loyaltyPoints = Math.round(unitPriceAED * 1.315);

  const galleryImages = [product.image, product.secondaryImage].filter(Boolean) as string[];

  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.gender === product.gender || p.category === product.category)
  ).slice(0, 3);

  const handleAdd = () => {
    if (isMadeToMeasure && !isBag && !measurements.submitLaterByEmail) {
      if (!measurements.chestCm.trim() || !measurements.waistCm.trim() || !measurements.heightCm.trim()) {
        setSizeError(
          'Enter Chest, Waist, and Height in cm—or select "Submit measurements later by email".'
        );
        return;
      }
    }
    setSizeError('');

    onAddToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      unitPriceAED,
      compareAtAED: product.compareAtAED,
      quantity: 1,
      color: selectedColor,
      size: isBag ? 'One Size (45L)' : isMadeToMeasure ? 'Made to Measure' : selectedSize,
      isMadeToMeasure: isMadeToMeasure && !isBag,
      workflowTrack:
        isMadeToMeasure && !isBag ? 'Made-to-Measure (3–4 Weeks)' : 'Ready-to-Ship Prime',
      measurements: isMadeToMeasure && !isBag ? { ...measurements } : undefined,
      customSummary:
        isMadeToMeasure && !isBag
          ? measurements.submitLaterByEmail
            ? [
                'Made-to-Measure · Submit measurements via email after checkout',
                'Delivery: 3–4 weeks (eligible for complimentary alterations)',
              ]
            : [
                `Chest: ${measurements.chestCm} cm · Height: ${measurements.heightCm} cm`,
                `Waist: ${measurements.waistCm} cm${measurements.hipsCm ? ` · Hips: ${measurements.hipsCm} cm` : ''}`,
                ...(measurements.shoulderCm || measurements.sleeveCm
                  ? [
                      `${measurements.shoulderCm ? `Shoulders: ${measurements.shoulderCm} cm` : ''}${
                        measurements.shoulderCm && measurements.sleeveCm ? ' · ' : ''
                      }${measurements.sleeveCm ? `Sleeves: ${measurements.sleeveCm} cm` : ''}`,
                    ]
                  : []),
              ]
          : undefined,
    });
  };

  const handleReviewSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewBody.trim()) return;
    const next: ProductReview = {
      id: `rev-${Date.now()}`,
      author: reviewAuthor.trim(),
      location: 'United Arab Emirates',
      rating: reviewRating,
      date: 'November 2026',
      title: reviewTitle.trim() || 'Verified Leather Craftsmanship',
      body: reviewBody.trim(),
      verifiedFit: isMadeToMeasure ? 'Made to Measure' : 'Standard Fit',
    };
    setReviews((prev) => [next, ...prev]);
    setReviewAuthor('');
    setReviewTitle('');
    setReviewBody('');
    setReviewSubmitted(true);
  };

  const accordions = [
    {
      id: 'specs',
      title: 'Specifications',
      content: (
        <ul className="space-y-2 text-sm text-[#4A4A4A] dark:text-[#B0B3B5]">
          <li>
            <strong className="text-[#1C1C1C] dark:text-[#F4F3EE]">Material:</strong> {product.leatherType}
          </li>
          <li>
            <strong className="text-[#1C1C1C] dark:text-[#F4F3EE]">Lining:</strong> {product.lining}
          </li>
          <li>
            <strong className="text-[#1C1C1C] dark:text-[#F4F3EE]">Hardware:</strong> {product.hardware}
          </li>
          <li>
            <strong className="text-[#1C1C1C] dark:text-[#F4F3EE]">Fit Profile:</strong> {product.fit}
          </li>
          {product.specs.map((s) => (
            <li key={s}>— {s}</li>
          ))}
        </ul>
      ),
    },
    {
      id: 'shipping',
      title: 'Shipping & Returns',
      content: (
        <div className="space-y-2 text-sm text-[#4A4A4A] dark:text-[#B0B3B5]">
          <p>
            <strong className="text-[#1C1C1C] dark:text-[#F4F3EE]">Free Express Delivery:</strong> Estimated arrival by{' '}
            {product.deliveryEstimate} across Dubai, Abu Dhabi, Sharjah, and all UAE emirates.
          </p>
          <p>
            <strong className="text-[#1C1C1C] dark:text-[#F4F3EE]">Zero Customs Surprises:</strong> Your total payment
            covers all UAE customs duties and VAT. You will never pay extra fees upon delivery.
          </p>
          <p>
            <strong className="text-[#1C1C1C] dark:text-[#F4F3EE]">60-Day Exchange &amp; Returns:</strong> Complimentary
            size exchange or alteration support on standard and made-to-measure pieces.
          </p>
        </div>
      ),
    },
    {
      id: 'care',
      title: 'Care Details',
      content: (
        <ul className="space-y-2 text-sm text-[#4A4A4A] dark:text-[#B0B3B5]">
          {product.careNotes.map((c) => (
            <li key={c}>— {c}</li>
          ))}
        </ul>
      ),
    },
    {
      id: 'fit',
      title: 'Size & Fit',
      content: (
        <p className="text-sm text-[#4A4A4A] dark:text-[#B0B3B5] leading-relaxed">
          Offered in 8 standard sizes from XS (EU 44) to 4XL (EU 64–66) plus our Made-to-Measure
          tailoring service (+200 AED). If you plan to layer over heavy knitwear, choose one size up
          or enter your exact measurements above.
        </p>
      ),
    },
  ];

  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="max-w-[1360px] mx-auto px-6 sm:px-10 py-8 lg:py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-[#767676] dark:text-[#8A8E91] mb-8 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onNavigate({ view: 'home' })}
          className="hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE]"
        >
          Home
        </button>
        <span aria-hidden="true">/</span>
        <button
          type="button"
          onClick={() =>
            onNavigate({
              view: 'collection',
              filter: product.gender === 'women' ? 'women' : 'men',
            })
          }
          className="hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE]"
        >
          {product.categoryLabel}
        </button>
        <span aria-hidden="true">/</span>
        <span className="text-[#1C1C1C] dark:text-[#F4F3EE] font-medium">{product.name}</span>
      </nav>

      {/* Contiguous Purchase Module: Sticky Left Gallery + Sticky Right Purchase Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Studio Gallery */}
        <div className="lg:col-span-7 lg:sticky lg:top-32 space-y-4">
          <div className="aspect-[3/4] bg-[#F1F1EF] dark:bg-[#161B1E] overflow-hidden">
            <SafeImage
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover object-top"
            />
          </div>

          {galleryImages.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {galleryImages.map((img, idx) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  aria-label={`View photo ${idx + 1} of ${product.name}`}
                  className={`aspect-[3/4] bg-[#F1F1EF] dark:bg-[#161B1E] overflow-hidden border transition-colors ${
                    activeImage === img
                      ? 'border-[#1C1C1C] dark:border-[#F4F3EE]'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <SafeImage src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Contiguous Purchase Panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header Metadata */}
          <div>
            <div className="flex items-center gap-2 text-xs text-[#595959] dark:text-[#A8ACAF] mb-2">
              {product.isFeaturedSale && (
                <span className="text-[#C41E24] dark:text-[#E8555A] font-semibold tracking-[0.1em] uppercase">
                  Black Friday Sale
                </span>
              )}
              {product.primeDelivery && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium text-[#1C1C1C] dark:text-[#F4F3EE]">Prime Delivery</span>
                </>
              )}
              {product.discountPercent && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#C41E24] dark:text-[#E8555A] font-medium">
                    {product.discountPercent}% off
                  </span>
                </>
              )}
            </div>

            <div className="flex items-start justify-between gap-4">
              <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1C1C1C] dark:text-[#F4F3EE] leading-tight">
                {product.name}
              </h1>
              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                aria-pressed={isWishlisted}
                className="p-2.5 border border-[#E5E5E3] dark:border-[#262D31] hover:border-[#1C1C1C] dark:hover:border-[#F4F3EE] transition-colors shrink-0"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isWishlisted
                      ? 'fill-[#C41E24] text-[#C41E24] dark:fill-[#E8555A] dark:text-[#E8555A]'
                      : 'text-[#1C1C1C] dark:text-[#F4F3EE]'
                  }`}
                  aria-hidden="true"
                />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#595959] dark:text-[#A8ACAF]">
              <span className="inline-flex items-center gap-1 tabular-nums">
                <Star
                  className="w-3.5 h-3.5 fill-[#C89B3C] text-[#C89B3C] dark:fill-[#D9AD4E] dark:text-[#D9AD4E]"
                  aria-hidden="true"
                />
                <strong className="text-[#1C1C1C] dark:text-[#F4F3EE]">{product.rating.toFixed(1)}</strong>
              </span>
              <span>{product.reviewCount + (reviews.length - 3)} Reviews</span>
              <span aria-hidden="true">·</span>
              <span>Delivery by {product.deliveryEstimate}</span>
            </div>

            {/* Price & Shop Pay BNPL Installments */}
            <div className="mt-4 flex items-baseline gap-3 tabular-nums">
              <span className="text-2xl font-semibold text-[#1C1C1C] dark:text-[#F4F3EE]">
                {formatMoney(unitPriceAED, currency)}
              </span>
              {product.compareAtAED && (
                <span className="text-base text-[#767676] dark:text-[#84888B] line-through">
                  {formatMoney(product.compareAtAED, currency)}
                </span>
              )}
            </div>
            <div className="mt-2">
              <InstallmentsBanner amountAED={unitPriceAED} currency={currency} mode="standard" />
            </div>
            <p className="text-xs text-[#595959] dark:text-[#A8ACAF] mt-2">
              {isMadeToMeasure
                ? 'Made-to-Measure: Tailored delivery in 3–4 weeks · Eligible for complimentary alterations'
                : 'Prime Ready-to-Ship: Dispatches next business day · 60-day exchange or store-credit window · DDP'}
            </p>
          </div>

          <p className="text-sm text-[#4A4A4A] dark:text-[#B0B3B5] leading-relaxed border-t border-[#EFEFED] dark:border-[#23292D] pt-5">
            {product.description}
          </p>

          {/* Color Selector */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#1C1C1C] dark:text-[#F4F3EE] mb-2.5">
              Color:{' '}
              <span className="font-normal normal-case tracking-normal text-[#595959] dark:text-[#A8ACAF]">
                {selectedColor}
              </span>
            </p>
            <div className="flex flex-wrap items-center gap-2.5">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedColor(c.name)}
                  aria-label={`Select color ${c.name}`}
                  aria-pressed={selectedColor === c.name}
                  className={`inline-flex items-center gap-2 px-3 py-2 border text-xs transition-colors ${
                    selectedColor === c.name
                      ? 'border-[#1C1C1C] dark:border-[#F4F3EE] bg-[#FAF9F7] dark:bg-[#1B2226] font-semibold text-[#1C1C1C] dark:text-[#F4F3EE]'
                      : 'border-[#E5E5E3] dark:border-[#262D31] text-[#595959] dark:text-[#A8ACAF] hover:border-[#999] dark:hover:border-[#6A7176]'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/20 dark:border-white/25"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          {!isBag && (
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#1C1C1C] dark:text-[#F4F3EE]">
                  Size
                </p>
                <button
                  type="button"
                  onClick={onOpenSizeGuide}
                  className="inline-flex items-center gap-1 text-xs text-[#595959] dark:text-[#A8ACAF] hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE] underline underline-offset-4"
                >
                  <Ruler className="w-3.5 h-3.5" aria-hidden="true" /> Size Guide
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-2.5">
                {(isShoe
                  ? ['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45', 'EU 46', 'EU 47'].map((s) => ({
                      code: s,
                      eu: '',
                    }))
                  : isWomen
                    ? WOMEN_STANDARD_SIZES
                    : STANDARD_SIZES
                ).map((sz) => {
                  const active = !isMadeToMeasure && selectedSize === sz.code;
                  return (
                    <button
                      key={sz.code}
                      type="button"
                      onClick={() => {
                        setIsMadeToMeasure(false);
                        setSelectedSize(sz.code);
                        setSizeError('');
                      }}
                      className={`py-2.5 px-2 border text-center transition-colors ${
                        active
                          ? 'bg-[#1C1C1C] dark:bg-[#F4F3EE] text-white dark:text-[#0E1214] border-[#1C1C1C] dark:border-[#F4F3EE]'
                          : 'bg-white dark:bg-[#14191C] text-[#1C1C1C] dark:text-[#F4F3EE] border-[#D8D8D5] dark:border-[#262D31] hover:border-[#1C1C1C] dark:hover:border-[#F4F3EE]'
                      }`}
                    >
                      <span className="block text-xs font-semibold">{sz.code}</span>
                      {sz.eu && (
                        <span
                          className={`block text-[10px] ${
                            active
                              ? 'text-white/75 dark:text-[#0E1214]/70'
                              : 'text-[#767676] dark:text-[#8A8E91]'
                          }`}
                        >
                          {sz.eu}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Made To Measure Option (+$50) */}
              {!isShoe && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMadeToMeasure((v) => !v);
                    setSizeError('');
                  }}
                  aria-pressed={isMadeToMeasure}
                  className={`w-full py-3 px-4 border text-xs font-semibold tracking-[0.1em] uppercase flex items-center justify-between transition-colors ${
                    isMadeToMeasure
                      ? 'bg-[#1C1C1C] dark:bg-[#F4F3EE] text-white dark:text-[#0E1214] border-[#1C1C1C] dark:border-[#F4F3EE]'
                      : 'bg-[#FAF9F7] dark:bg-[#14191C] text-[#1C1C1C] dark:text-[#F4F3EE] border-[#D8D8D5] dark:border-[#262D31] hover:border-[#1C1C1C] dark:hover:border-[#F4F3EE]'
                  }`}
                >
                  <span>Made To Measure (3–4 Weeks Tailored)</span>
                  <span className="tabular-nums">
                    +{formatMoney(MADE_TO_MEASURE_SURCHARGE_AED, currency)}
                  </span>
                </button>
              )}

              {/* 6-Field Custom Measurement Inputs + Submit Later By Email */}
              {isMadeToMeasure && !isShoe && (
                <div className="mt-3 p-4 bg-[#FAF9F7] dark:bg-[#14191C] border border-[#E5E5E3] dark:border-[#262D31] space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-[#1C1C1C] dark:text-[#F4F3EE]">
                      Body Measurements (cm)
                    </p>
                    <label className="inline-flex items-center gap-1.5 text-[11px] text-[#595959] dark:text-[#A8ACAF] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(measurements.submitLaterByEmail)}
                        onChange={(e) => {
                          setMeasurements((m) => ({
                            ...m,
                            submitLaterByEmail: e.target.checked,
                          }));
                          setSizeError('');
                        }}
                        className="accent-[#1C1C1C] dark:accent-[#F4F3EE]"
                      />
                      <span>Submit later by email</span>
                    </label>
                  </div>

                  {measurements.submitLaterByEmail ? (
                    <p className="text-xs text-[#595959] dark:text-[#A8ACAF] leading-relaxed">
                      After checkout, our tailor desk emails you a step-by-step video measurement
                      guide so you can submit Chest, Height, Waist, Shoulders, Hips &amp; Sleeves at
                      your convenience.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <label htmlFor="m-chest" className="block text-[11px] text-[#595959] dark:text-[#A8ACAF] mb-1">
                          Chest (cm)*
                        </label>
                        <input
                          id="m-chest"
                          type="number"
                          value={measurements.chestCm}
                          onChange={(e) => setMeasurements((m) => ({ ...m, chestCm: e.target.value }))}
                          placeholder="e.g. 102"
                          className="w-full bg-white dark:bg-[#0E1214] border border-[#D4D4D0] dark:border-[#2B3237] px-2.5 py-2 text-xs text-[#1C1C1C] dark:text-[#F4F3EE] tabular-nums"
                        />
                      </div>
                      <div>
                        <label htmlFor="m-height" className="block text-[11px] text-[#595959] dark:text-[#A8ACAF] mb-1">
                          Height (cm)*
                        </label>
                        <input
                          id="m-height"
                          type="number"
                          value={measurements.heightCm}
                          onChange={(e) => setMeasurements((m) => ({ ...m, heightCm: e.target.value }))}
                          placeholder="e.g. 178"
                          className="w-full bg-white dark:bg-[#0E1214] border border-[#D4D4D0] dark:border-[#2B3237] px-2.5 py-2 text-xs text-[#1C1C1C] dark:text-[#F4F3EE] tabular-nums"
                        />
                      </div>
                      <div>
                        <label htmlFor="m-waist" className="block text-[11px] text-[#595959] dark:text-[#A8ACAF] mb-1">
                          Waist (cm)*
                        </label>
                        <input
                          id="m-waist"
                          type="number"
                          value={measurements.waistCm}
                          onChange={(e) => setMeasurements((m) => ({ ...m, waistCm: e.target.value }))}
                          placeholder="e.g. 86"
                          className="w-full bg-white dark:bg-[#0E1214] border border-[#D4D4D0] dark:border-[#2B3237] px-2.5 py-2 text-xs text-[#1C1C1C] dark:text-[#F4F3EE] tabular-nums"
                        />
                      </div>
                      <div>
                        <label htmlFor="m-shoulder" className="block text-[11px] text-[#595959] dark:text-[#A8ACAF] mb-1">
                          Shoulders (cm)
                        </label>
                        <input
                          id="m-shoulder"
                          type="number"
                          value={measurements.shoulderCm}
                          onChange={(e) =>
                            setMeasurements((m) => ({ ...m, shoulderCm: e.target.value }))
                          }
                          placeholder="e.g. 46"
                          className="w-full bg-white dark:bg-[#0E1214] border border-[#D4D4D0] dark:border-[#2B3237] px-2.5 py-2 text-xs text-[#1C1C1C] dark:text-[#F4F3EE] tabular-nums"
                        />
                      </div>
                      <div>
                        <label htmlFor="m-hips" className="block text-[11px] text-[#595959] dark:text-[#A8ACAF] mb-1">
                          Hips (cm)
                        </label>
                        <input
                          id="m-hips"
                          type="number"
                          value={measurements.hipsCm}
                          onChange={(e) => setMeasurements((m) => ({ ...m, hipsCm: e.target.value }))}
                          placeholder="e.g. 98"
                          className="w-full bg-white dark:bg-[#0E1214] border border-[#D4D4D0] dark:border-[#2B3237] px-2.5 py-2 text-xs text-[#1C1C1C] dark:text-[#F4F3EE] tabular-nums"
                        />
                      </div>
                      <div>
                        <label htmlFor="m-sleeve" className="block text-[11px] text-[#595959] dark:text-[#A8ACAF] mb-1">
                          Sleeves (cm)
                        </label>
                        <input
                          id="m-sleeve"
                          type="number"
                          value={measurements.sleeveCm}
                          onChange={(e) => setMeasurements((m) => ({ ...m, sleeveCm: e.target.value }))}
                          placeholder="e.g. 64"
                          className="w-full bg-white dark:bg-[#0E1214] border border-[#D4D4D0] dark:border-[#2B3237] px-2.5 py-2 text-xs text-[#1C1C1C] dark:text-[#F4F3EE] tabular-nums"
                        />
                      </div>
                    </div>
                  )}

                  <p className="text-[11px] text-[#767676] dark:text-[#8A8E91]">
                    Tailored in 3–4 weeks · Eligible for complimentary alterations rather than standard returns.
                  </p>
                </div>
              )}

              {sizeError && (
                <p role="alert" className="mt-2 text-xs text-[#C41E24] dark:text-[#E8555A] font-medium">
                  {sizeError}
                </p>
              )}
            </div>
          )}

          {/* Primary & Secondary Purchase CTAs */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={handleAdd}
              className="w-full py-4 bg-[#1C1C1C] dark:bg-[#F4F3EE] hover:bg-black dark:hover:bg-white text-white dark:text-[#0E1214] text-xs font-semibold tracking-[0.16em] uppercase transition-colors"
            >
              Add To Cart · {formatMoney(unitPriceAED, currency)}
            </button>

            <button
              type="button"
              onClick={() => setCustomizeModalOpen(true)}
              className="w-full py-3.5 border border-[#1C1C1C] dark:border-[#F4F3EE] text-[#1C1C1C] dark:text-[#F4F3EE] hover:bg-[#FAF9F7] dark:hover:bg-[#192024] text-xs font-semibold tracking-[0.16em] uppercase transition-colors"
            >
              Customize This Product
            </button>
          </div>

          {/* Loyalty & Assurance Notes */}
          <div className="bg-[#FAF9F7] dark:bg-[#14191C] border border-[#ECECE9] dark:border-[#262D31] p-4 space-y-2.5 text-xs text-[#4A4A4A] dark:text-[#B0B3B5]">
            <p className="text-[#1C1C1C] dark:text-[#F4F3EE] font-medium tabular-nums">
              Earn up to <strong>{loyaltyPoints.toLocaleString()} Points</strong> when completing
              this purchase.
            </p>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#1C1C1C] dark:text-[#F4F3EE] shrink-0" aria-hidden="true" />
              <span>Free UAE Express Shipping · Zero Extra Customs Charges</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-[#1C1C1C] dark:text-[#F4F3EE] shrink-0" aria-hidden="true" />
              <span>Delivered in our Signature Front-Lock Mailer Packaging</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#1C1C1C] dark:text-[#F4F3EE] shrink-0" aria-hidden="true" />
              <span>60-Day Hassle-Free Exchange &amp; Lifetime Hardware Support</span>
            </div>
          </div>

          {/* Expandable Details Accordions */}
          <div className="border-t border-[#E5E5E3] dark:border-[#262D31] divide-y divide-[#E5E5E3] dark:divide-[#262D31]">
            {accordions.map((acc) => {
              const isOpen = openAccordion === acc.id;
              return (
                <div key={acc.id}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenAccordion(isOpen ? null : acc.id)}
                    className="w-full py-4 flex items-center justify-between text-xs font-semibold tracking-[0.14em] uppercase text-[#1C1C1C] dark:text-[#F4F3EE]"
                  >
                    <span>{acc.title}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && <div className="pb-5">{acc.content}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="mt-20 pt-14 border-t border-[#E5E5E3] dark:border-[#262D31]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-5">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#767676] dark:text-[#8A8E91]">
              Verified Buyers
            </p>
            <h2 className="font-display text-3xl font-semibold text-[#1C1C1C] dark:text-[#F4F3EE]">
              Customer Reviews
            </h2>
            <div className="flex items-center gap-3">
              <span className="font-display text-4xl font-semibold text-[#1C1C1C] dark:text-[#F4F3EE] tabular-nums">
                {product.rating.toFixed(1)}
              </span>
              <div>
                <div className="flex items-center gap-0.5">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Star
                      key={s}
                      className="w-4 h-4 fill-[#C89B3C] text-[#C89B3C] dark:fill-[#D9AD4E] dark:text-[#D9AD4E]"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="text-xs text-[#595959] dark:text-[#A8ACAF] mt-0.5 tabular-nums">
                  Based on {product.reviewCount + (reviews.length - 3)} verified reviews
                </p>
              </div>
            </div>

            {/* Write a Review Form */}
            <form
              onSubmit={handleReviewSubmit}
              className="border border-[#E5E5E3] dark:border-[#262D31] bg-[#FAF9F7] dark:bg-[#14191C] p-5 space-y-3"
            >
              <h3 className="font-body text-xs font-semibold tracking-[0.12em] uppercase text-[#1C1C1C] dark:text-[#F4F3EE]">
                Write a Review
              </h3>
              {reviewSubmitted && (
                <p className="text-xs text-[#1C1C1C] dark:text-[#F4F3EE] flex items-center gap-1.5 font-medium">
                  <Check className="w-3.5 h-3.5" aria-hidden="true" /> Your review has been added.
                </p>
              )}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#595959] dark:text-[#A8ACAF]">Rating:</span>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-label={`Rate ${n} stars`}
                    onClick={() => setReviewRating(n)}
                    className="p-0.5"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        n <= reviewRating
                          ? 'fill-[#C89B3C] text-[#C89B3C] dark:fill-[#D9AD4E] dark:text-[#D9AD4E]'
                          : 'text-[#C8C8C4] dark:text-[#454B50]'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <input
                type="text"
                required
                value={reviewAuthor}
                onChange={(e) => setReviewAuthor(e.target.value)}
                placeholder="Your Name"
                aria-label="Your Name"
                className="w-full bg-white dark:bg-[#0E1214] border border-[#D4D4D0] dark:border-[#2B3237] px-3 py-2 text-xs text-[#1C1C1C] dark:text-[#F4F3EE]"
              />
              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="Headline (e.g. Incredible leather patina)"
                aria-label="Review Headline"
                className="w-full bg-white dark:bg-[#0E1214] border border-[#D4D4D0] dark:border-[#2B3237] px-3 py-2 text-xs text-[#1C1C1C] dark:text-[#F4F3EE]"
              />
              <textarea
                rows={3}
                required
                value={reviewBody}
                onChange={(e) => setReviewBody(e.target.value)}
                placeholder="Share your experience with leather quality, stitching, and fit..."
                aria-label="Review details"
                className="w-full bg-white dark:bg-[#0E1214] border border-[#D4D4D0] dark:border-[#2B3237] px-3 py-2 text-xs text-[#1C1C1C] dark:text-[#F4F3EE]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#1C1C1C] dark:bg-[#F4F3EE] text-white dark:text-[#0E1214] text-xs font-semibold tracking-[0.14em] uppercase hover:bg-black dark:hover:bg-white transition-colors"
              >
                Post Review
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 space-y-5">
            {reviews.map((r) => (
              <article key={r.id} className="border-b border-[#EFEFED] dark:border-[#23292D] pb-6">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-[#C89B3C] text-[#C89B3C] dark:fill-[#D9AD4E] dark:text-[#D9AD4E]"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-[#767676] dark:text-[#8A8E91]">{r.date}</span>
                </div>
                <h3 className="font-body text-sm font-semibold text-[#1C1C1C] dark:text-[#F4F3EE] mb-1">
                  {r.title}
                </h3>
                <p className="text-sm text-[#4A4A4A] dark:text-[#B0B3B5] leading-relaxed mb-2">
                  {r.body}
                </p>
                <p className="text-xs text-[#767676] dark:text-[#8A8E91]">
                  {r.author} · {r.location} · {r.verifiedFit}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* You May Also Like */}
      <section className="mt-20 pt-14 border-t border-[#E5E5E3] dark:border-[#262D31]">
        <h2 className="font-display text-3xl font-semibold text-[#1C1C1C] dark:text-[#F4F3EE] mb-8">
          You May Also Like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {relatedProducts.map((rel) => (
            <ProductCard
              key={rel.id}
              product={rel}
              currency={currency}
              isWishlisted={wishlist.includes(rel.id)}
              onToggleWishlist={onToggleWishlist}
              onSelectProduct={(slug) => onNavigate({ view: 'product', slug })}
              onQuickAdd={(p) =>
                onAddToCart({
                  productId: p.id,
                  slug: p.slug,
                  name: p.name,
                  image: p.image,
                  unitPriceAED: p.priceAED,
                  compareAtAED: p.compareAtAED,
                  quantity: 1,
                  color: p.colors[0]?.name || 'Jet Black',
                  size: 'M',
                })
              }
            />
          ))}
        </div>
      </section>

      {/* In-Page Product Modification Modal */}
      <ProductCustomizeModal
        open={customizeModalOpen}
        product={product}
        currency={currency}
        selectedSize={isBag ? 'One Size (45L)' : isMadeToMeasure ? 'Made to Measure' : selectedSize}
        onClose={() => setCustomizeModalOpen(false)}
        onAddCustomizedToCart={onAddToCart}
        onSubmitModificationQuote={onSubmitInquiry}
        onOpenFullBuilder={() => onNavigate({ view: 'builder', prefillName: product.name })}
      />
    </div>
  );
}
