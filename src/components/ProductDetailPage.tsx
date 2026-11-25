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
import { CUSTOMER_REVIEWS, PRODUCTS, STANDARD_SIZES } from '../data/catalog';
import type {
  AppPage,
  CartItem,
  CurrencyCode,
  CustomMeasurements,
  Product,
  ProductReview,
} from '../types';
import { formatMoney, MADE_TO_MEASURE_SURCHARGE_AED } from '../utils/commerce';
import { ProductCard } from './ProductCard';
import { SafeImage } from './SafeImage';

interface ProductDetailPageProps {
  product: Product;
  currency: CurrencyCode;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onNavigate: (page: AppPage) => void;
  onAddToCart: (item: Omit<CartItem, 'lineId'>) => void;
  onOpenSizeGuide: () => void;
}

export function ProductDetailPage({
  product,
  currency,
  wishlist,
  onToggleWishlist,
  onNavigate,
  onAddToCart,
  onOpenSizeGuide,
}: ProductDetailPageProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Jet Black');
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [isMadeToMeasure, setIsMadeToMeasure] = useState(false);
  const [measurements, setMeasurements] = useState<CustomMeasurements>({
    chestCm: '',
    waistCm: '',
    shoulderCm: '',
    sleeveCm: '',
    heightCm: '',
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

  const unitPriceAED =
    product.priceAED + (isMadeToMeasure && !isBag ? MADE_TO_MEASURE_SURCHARGE_AED : 0);
  const loyaltyPoints = Math.round(unitPriceAED * 1.315);

  const galleryImages = [product.image, product.secondaryImage].filter(Boolean) as string[];

  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.gender === product.gender || p.category === product.category)
  ).slice(0, 3);

  const handleAdd = () => {
    if (isMadeToMeasure && !isBag) {
      if (!measurements.chestCm.trim() || !measurements.waistCm.trim() || !measurements.heightCm.trim()) {
        setSizeError('Please enter your Chest, Waist, and Height measurements in cm for Made-to-Measure.');
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
      measurements: isMadeToMeasure && !isBag ? { ...measurements } : undefined,
      customSummary:
        isMadeToMeasure && !isBag
          ? [
              `Chest: ${measurements.chestCm} cm`,
              `Waist: ${measurements.waistCm} cm`,
              `Height: ${measurements.heightCm} cm`,
              ...(measurements.shoulderCm ? [`Shoulders: ${measurements.shoulderCm} cm`] : []),
              ...(measurements.sleeveCm ? [`Sleeve: ${measurements.sleeveCm} cm`] : []),
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
        <ul className="space-y-2 text-sm text-[#4A4A4A]">
          <li>
            <strong className="text-[#1C1C1C]">Material:</strong> {product.leatherType}
          </li>
          <li>
            <strong className="text-[#1C1C1C]">Lining:</strong> {product.lining}
          </li>
          <li>
            <strong className="text-[#1C1C1C]">Hardware:</strong> {product.hardware}
          </li>
          <li>
            <strong className="text-[#1C1C1C]">Fit Profile:</strong> {product.fit}
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
        <div className="space-y-2 text-sm text-[#4A4A4A]">
          <p>
            <strong className="text-[#1C1C1C]">Free Express Delivery:</strong> Estimated arrival by{' '}
            {product.deliveryEstimate} across Dubai, Abu Dhabi, Sharjah, and all UAE emirates.
          </p>
          <p>
            <strong className="text-[#1C1C1C]">Zero Customs Surprises:</strong> Your total payment
            covers all UAE customs duties and VAT. You will never pay extra fees upon delivery.
          </p>
          <p>
            <strong className="text-[#1C1C1C]">60-Day Exchange &amp; Returns:</strong> Complimentary
            size exchange or alteration support on standard and made-to-measure pieces.
          </p>
        </div>
      ),
    },
    {
      id: 'care',
      title: 'Care Details',
      content: (
        <ul className="space-y-2 text-sm text-[#4A4A4A]">
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
        <p className="text-sm text-[#4A4A4A] leading-relaxed">
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
      <nav aria-label="Breadcrumb" className="text-xs text-[#767676] mb-8 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => onNavigate({ view: 'home' })} className="hover:text-[#1C1C1C]">
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
          className="hover:text-[#1C1C1C]"
        >
          {product.categoryLabel}
        </button>
        <span aria-hidden="true">/</span>
        <span className="text-[#1C1C1C] font-medium">{product.name}</span>
      </nav>

      {/* Contiguous Purchase Module: Sticky Left Gallery + Sticky Right Purchase Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Studio Gallery */}
        <div className="lg:col-span-7 lg:sticky lg:top-32 space-y-4">
          <div className="aspect-[3/4] bg-[#F1F1EF] overflow-hidden">
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
                  className={`aspect-[3/4] bg-[#F1F1EF] overflow-hidden border transition-colors ${
                    activeImage === img ? 'border-[#1C1C1C]' : 'border-transparent opacity-70 hover:opacity-100'
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
            <div className="flex items-center gap-2 text-xs text-[#595959] mb-2">
              {product.isFeaturedSale && (
                <span className="text-[#C41E24] font-semibold tracking-[0.1em] uppercase">
                  Black Friday Sale
                </span>
              )}
              {product.primeDelivery && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium text-[#1C1C1C]">Prime Delivery</span>
                </>
              )}
              {product.discountPercent && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#C41E24] font-medium">{product.discountPercent}% off</span>
                </>
              )}
            </div>

            <div className="flex items-start justify-between gap-4">
              <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1C1C1C] leading-tight">
                {product.name}
              </h1>
              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                aria-pressed={isWishlisted}
                className="p-2.5 border border-[#E5E5E3] hover:border-[#1C1C1C] transition-colors shrink-0"
              >
                <Heart
                  className={`w-4 h-4 ${isWishlisted ? 'fill-[#C41E24] text-[#C41E24]' : 'text-[#1C1C1C]'}`}
                  aria-hidden="true"
                />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#595959]">
              <span className="inline-flex items-center gap-1 tabular-nums">
                <Star className="w-3.5 h-3.5 fill-[#C89B3C] text-[#C89B3C]" aria-hidden="true" />
                <strong className="text-[#1C1C1C]">{product.rating.toFixed(1)}</strong>
              </span>
              <span>{product.reviewCount + (reviews.length - 3)} Reviews</span>
              <span aria-hidden="true">·</span>
              <span>Delivery by {product.deliveryEstimate}</span>
            </div>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3 tabular-nums">
              <span className="text-2xl font-semibold text-[#1C1C1C]">
                {formatMoney(unitPriceAED, currency)}
              </span>
              {product.compareAtAED && (
                <span className="text-base text-[#767676] line-through">
                  {formatMoney(product.compareAtAED, currency)}
                </span>
              )}
            </div>
            <p className="text-xs text-[#595959] mt-1">
              Free Shipping &amp; 60 Days to Exchange · All UAE Customs Duties &amp; VAT Included
            </p>
          </div>

          <p className="text-sm text-[#4A4A4A] leading-relaxed border-t border-[#EFEFED] pt-5">
            {product.description}
          </p>

          {/* Color Selector */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#1C1C1C] mb-2.5">
              Color: <span className="font-normal normal-case tracking-normal text-[#595959]">{selectedColor}</span>
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
                      ? 'border-[#1C1C1C] bg-[#FAF9F7] font-semibold text-[#1C1C1C]'
                      : 'border-[#E5E5E3] text-[#595959] hover:border-[#999]'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/15"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector (or Shoe Sizes / One Size Bag) */}
          {!isBag && (
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#1C1C1C]">
                  Size
                </p>
                <button
                  type="button"
                  onClick={onOpenSizeGuide}
                  className="inline-flex items-center gap-1 text-xs text-[#595959] hover:text-[#1C1C1C] underline underline-offset-4"
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
                          ? 'bg-[#1C1C1C] text-white border-[#1C1C1C]'
                          : 'bg-white text-[#1C1C1C] border-[#D8D8D5] hover:border-[#1C1C1C]'
                      }`}
                    >
                      <span className="block text-xs font-semibold">{sz.code}</span>
                      {sz.eu && (
                        <span
                          className={`block text-[10px] ${active ? 'text-white/75' : 'text-[#767676]'}`}
                        >
                          {sz.eu}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Made To Measure Option (+200 AED) matching thejacketmaker.ae */}
              {!isShoe && (
                <button
                  type="button"
                  onClick={() => setIsMadeToMeasure((v) => !v)}
                  aria-pressed={isMadeToMeasure}
                  className={`w-full py-3 px-4 border text-xs font-semibold tracking-[0.1em] uppercase flex items-center justify-between transition-colors ${
                    isMadeToMeasure
                      ? 'bg-[#1C1C1C] text-white border-[#1C1C1C]'
                      : 'bg-[#FAF9F7] text-[#1C1C1C] border-[#D8D8D5] hover:border-[#1C1C1C]'
                  }`}
                >
                  <span>Made To Measure (Custom Tailored Fit)</span>
                  <span className="tabular-nums">
                    +{formatMoney(MADE_TO_MEASURE_SURCHARGE_AED, currency)}
                  </span>
                </button>
              )}

              {/* Custom Measurement Inputs */}
              {isMadeToMeasure && !isShoe && (
                <div className="mt-3 p-4 bg-[#FAF9F7] border border-[#E5E5E3] space-y-3">
                  <p className="text-xs font-medium text-[#1C1C1C]">
                    Enter Your Body Measurements (cm)
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label htmlFor="m-chest" className="block text-[11px] text-[#595959] mb-1">
                        Chest (cm)*
                      </label>
                      <input
                        id="m-chest"
                        type="number"
                        value={measurements.chestCm}
                        onChange={(e) => setMeasurements((m) => ({ ...m, chestCm: e.target.value }))}
                        placeholder="e.g. 102"
                        className="w-full bg-white border border-[#D4D4D0] px-2.5 py-2 text-xs tabular-nums"
                      />
                    </div>
                    <div>
                      <label htmlFor="m-waist" className="block text-[11px] text-[#595959] mb-1">
                        Waist (cm)*
                      </label>
                      <input
                        id="m-waist"
                        type="number"
                        value={measurements.waistCm}
                        onChange={(e) => setMeasurements((m) => ({ ...m, waistCm: e.target.value }))}
                        placeholder="e.g. 86"
                        className="w-full bg-white border border-[#D4D4D0] px-2.5 py-2 text-xs tabular-nums"
                      />
                    </div>
                    <div>
                      <label htmlFor="m-height" className="block text-[11px] text-[#595959] mb-1">
                        Height (cm)*
                      </label>
                      <input
                        id="m-height"
                        type="number"
                        value={measurements.heightCm}
                        onChange={(e) => setMeasurements((m) => ({ ...m, heightCm: e.target.value }))}
                        placeholder="e.g. 178"
                        className="w-full bg-white border border-[#D4D4D0] px-2.5 py-2 text-xs tabular-nums"
                      />
                    </div>
                    <div>
                      <label htmlFor="m-shoulder" className="block text-[11px] text-[#595959] mb-1">
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
                        className="w-full bg-white border border-[#D4D4D0] px-2.5 py-2 text-xs tabular-nums"
                      />
                    </div>
                    <div>
                      <label htmlFor="m-sleeve" className="block text-[11px] text-[#595959] mb-1">
                        Sleeve (cm)
                      </label>
                      <input
                        id="m-sleeve"
                        type="number"
                        value={measurements.sleeveCm}
                        onChange={(e) => setMeasurements((m) => ({ ...m, sleeveCm: e.target.value }))}
                        placeholder="e.g. 64"
                        className="w-full bg-white border border-[#D4D4D0] px-2.5 py-2 text-xs tabular-nums"
                      />
                    </div>
                  </div>
                </div>
              )}

              {sizeError && (
                <p role="alert" className="mt-2 text-xs text-[#C41E24] font-medium">
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
              className="w-full py-4 bg-[#1C1C1C] hover:bg-black text-white text-xs font-semibold tracking-[0.16em] uppercase transition-colors"
            >
              Add To Cart · {formatMoney(unitPriceAED, currency)}
            </button>

            <button
              type="button"
              onClick={() => onNavigate({ view: 'builder', prefillName: product.name })}
              className="w-full py-3.5 border border-[#1C1C1C] text-[#1C1C1C] hover:bg-[#FAF9F7] text-xs font-semibold tracking-[0.16em] uppercase transition-colors"
            >
              Customize This Product
            </button>
          </div>

          {/* Loyalty & Assurance Notes */}
          <div className="bg-[#FAF9F7] border border-[#ECECE9] p-4 space-y-2.5 text-xs text-[#4A4A4A]">
            <p className="text-[#1C1C1C] font-medium tabular-nums">
              Earn up to <strong>{loyaltyPoints.toLocaleString()} Points</strong> when completing
              this purchase.
            </p>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#1C1C1C] shrink-0" aria-hidden="true" />
              <span>Free UAE Express Shipping · Zero Extra Customs Charges</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-[#1C1C1C] shrink-0" aria-hidden="true" />
              <span>Delivered in our Signature Front-Lock Mailer Packaging</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#1C1C1C] shrink-0" aria-hidden="true" />
              <span>60-Day Hassle-Free Exchange &amp; Lifetime Hardware Support</span>
            </div>
          </div>

          {/* Expandable Details Accordions */}
          <div className="border-t border-[#E5E5E3] divide-y divide-[#E5E5E3]">
            {accordions.map((acc) => {
              const isOpen = openAccordion === acc.id;
              return (
                <div key={acc.id}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenAccordion(isOpen ? null : acc.id)}
                    className="w-full py-4 flex items-center justify-between text-xs font-semibold tracking-[0.14em] uppercase text-[#1C1C1C]"
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
      <section className="mt-20 pt-14 border-t border-[#E5E5E3]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-5">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#767676]">
              Verified Buyers
            </p>
            <h2 className="font-display text-3xl font-semibold text-[#1C1C1C]">
              Customer Reviews
            </h2>
            <div className="flex items-center gap-3">
              <span className="font-display text-4xl font-semibold text-[#1C1C1C] tabular-nums">
                {product.rating.toFixed(1)}
              </span>
              <div>
                <div className="flex items-center gap-0.5">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-[#C89B3C] text-[#C89B3C]" aria-hidden="true" />
                  ))}
                </div>
                <p className="text-xs text-[#595959] mt-0.5 tabular-nums">
                  Based on {product.reviewCount + (reviews.length - 3)} verified reviews
                </p>
              </div>
            </div>

            {/* Write a Review Form */}
            <form
              onSubmit={handleReviewSubmit}
              className="border border-[#E5E5E3] bg-[#FAF9F7] p-5 space-y-3"
            >
              <h3 className="font-body text-xs font-semibold tracking-[0.12em] uppercase text-[#1C1C1C]">
                Write a Review
              </h3>
              {reviewSubmitted && (
                <p className="text-xs text-[#1C1C1C] flex items-center gap-1.5 font-medium">
                  <Check className="w-3.5 h-3.5" aria-hidden="true" /> Your review has been added.
                </p>
              )}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#595959]">Rating:</span>
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
                        n <= reviewRating ? 'fill-[#C89B3C] text-[#C89B3C]' : 'text-[#C8C8C4]'
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
                className="w-full bg-white border border-[#D4D4D0] px-3 py-2 text-xs"
              />
              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="Headline (e.g. Incredible leather patina)"
                aria-label="Review Headline"
                className="w-full bg-white border border-[#D4D4D0] px-3 py-2 text-xs"
              />
              <textarea
                rows={3}
                required
                value={reviewBody}
                onChange={(e) => setReviewBody(e.target.value)}
                placeholder="Share your experience with leather quality, stitching, and fit..."
                aria-label="Review details"
                className="w-full bg-white border border-[#D4D4D0] px-3 py-2 text-xs"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#1C1C1C] text-white text-xs font-semibold tracking-[0.14em] uppercase hover:bg-black transition-colors"
              >
                Post Review
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 space-y-5">
            {reviews.map((r) => (
              <article key={r.id} className="border-b border-[#EFEFED] pb-6">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#C89B3C] text-[#C89B3C]" aria-hidden="true" />
                    ))}
                  </div>
                  <span className="text-xs text-[#767676]">{r.date}</span>
                </div>
                <h3 className="font-body text-sm font-semibold text-[#1C1C1C] mb-1">{r.title}</h3>
                <p className="text-sm text-[#4A4A4A] leading-relaxed mb-2">{r.body}</p>
                <p className="text-xs text-[#767676]">
                  {r.author} · {r.location} · {r.verifiedFit}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* You May Also Like */}
      <section className="mt-20 pt-14 border-t border-[#E5E5E3]">
        <h2 className="font-display text-3xl font-semibold text-[#1C1C1C] mb-8">
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
    </div>
  );
}
