import type {
  BuilderConfig,
  CartItem,
  CurrencyCode,
  CurrencyConfig,
  Product,
  ProductCategory,
} from '../types';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  AED: {
    code: 'AED',
    country: 'United Arab Emirates',
    symbol: 'Dhs.',
    label: 'United Arab Emirates (AED د.إ)',
    rateFromAED: 1,
  },
  USD: {
    code: 'USD',
    country: 'United States',
    symbol: '$',
    label: 'United States (USD $)',
    rateFromAED: 0.2723,
  },
  GBP: {
    code: 'GBP',
    country: 'United Kingdom',
    symbol: '£',
    label: 'United Kingdom (GBP £)',
    rateFromAED: 0.2145,
  },
  EUR: {
    code: 'EUR',
    country: 'European Union',
    symbol: '€',
    label: 'European Union (EUR €)',
    rateFromAED: 0.2512,
  },
  SAR: {
    code: 'SAR',
    country: 'Saudi Arabia',
    symbol: 'SAR',
    label: 'Saudi Arabia (SAR ر.س)',
    rateFromAED: 1.021,
  },
};

export const MADE_TO_MEASURE_SURCHARGE_AED = 200;
export const BUILDER_BASE_PRICE_AED = 5776;

export function convertFromAED(amountAED: number, currency: CurrencyCode): number {
  const cfg = CURRENCIES[currency];
  return Math.round(amountAED * cfg.rateFromAED * 100) / 100;
}

export function formatMoney(amountAED: number, currency: CurrencyCode): string {
  const cfg = CURRENCIES[currency];
  const converted = convertFromAED(amountAED, currency);
  const formattedNumber = converted.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  if (currency === 'AED') {
    return `Dhs. ${formattedNumber} AED`;
  }
  if (currency === 'SAR') {
    return `SAR ${formattedNumber}`;
  }
  return `${cfg.symbol}${formattedNumber}`;
}

export interface PromoResult {
  valid: boolean;
  code: string;
  discountRate: number;
  label: string;
  error?: string;
}

const PROMO_CODES: Record<string, { rate: number; label: string }> = {
  UAE10: { rate: 0.1, label: 'UAE Exclusive 10% Off' },
  BF25: { rate: 0.15, label: 'Black Friday Extra 15% Off' },
  BESPOKE5: { rate: 0.05, label: 'Bespoke Member 5% Off' },
};

export function validatePromoCode(rawCode: string): PromoResult {
  const normalized = rawCode.trim().toUpperCase();
  if (!normalized) {
    return {
      valid: false,
      code: '',
      discountRate: 0,
      label: '',
      error: 'Enter a promo code such as UAE10.',
    };
  }
  const match = PROMO_CODES[normalized];
  if (!match) {
    return {
      valid: false,
      code: normalized,
      discountRate: 0,
      label: '',
      error: `Promo code "${normalized}" is not recognized. Try UAE10 for 10% off.`,
    };
  }
  return {
    valid: true,
    code: normalized,
    discountRate: match.rate,
    label: match.label,
  };
}

export interface CartSummary {
  itemCount: number;
  subtotalAED: number;
  discountAED: number;
  totalAED: number;
  saleSavingsAED: number;
  loyaltyPoints: number;
}

export function calculateCartSummary(items: CartItem[], promoCode?: string): CartSummary {
  let itemCount = 0;
  let subtotalAED = 0;
  let saleSavingsAED = 0;

  for (const item of items) {
    itemCount += item.quantity;
    subtotalAED += item.unitPriceAED * item.quantity;
    if (item.compareAtAED && item.compareAtAED > item.unitPriceAED) {
      saleSavingsAED += (item.compareAtAED - item.unitPriceAED) * item.quantity;
    }
  }

  let discountAED = 0;
  if (promoCode) {
    const promo = validatePromoCode(promoCode);
    if (promo.valid) {
      discountAED = Math.round(subtotalAED * promo.discountRate * 100) / 100;
    }
  }

  const totalAED = Math.max(0, Math.round((subtotalAED - discountAED) * 100) / 100);
  const loyaltyPoints = Math.round(totalAED * 1.315);

  return {
    itemCount,
    subtotalAED: Math.round(subtotalAED * 100) / 100,
    discountAED,
    totalAED,
    saleSavingsAED: Math.round(saleSavingsAED * 100) / 100,
    loyaltyPoints,
  };
}

export const BUILDER_STYLE_DELTAS: Record<BuilderConfig['baseStyle'], { label: string; deltaAED: number }> = {
  'cafe-racer': { label: 'Leather Jacket (Cafe Racer)', deltaAED: 0 },
  'double-rider': { label: 'Leather Jacket (Double Rider)', deltaAED: 0 },
  'leather-bomber': { label: 'Leather Bomber', deltaAED: 0 },
  'leather-vest': { label: 'Leather Vest', deltaAED: -722 },
  'mid-length-coat': { label: 'Mid Length Coat', deltaAED: 1444 },
  'full-length-coat': { label: 'Full Length Coat', deltaAED: 2166 },
};

export const BUILDER_LEATHER_DELTAS: Record<BuilderConfig['leatherType'], { label: string; deltaAED: number; note: string }> = {
  sheepskin: { label: 'Sheepskin', deltaAED: 0, note: 'Supple, lightweight full-grain softness' },
  goatskin: { label: 'Goatskin', deltaAED: 722, note: 'Pebbled grain with exceptional durability' },
  cowhide: { label: 'Cowhide', deltaAED: 722, note: 'Heavyweight, structured protective hide' },
  'calf-hide': { label: 'Calf Hide', deltaAED: 2166, note: 'Ultra-fine luxury dress leather grain' },
};

export const BUILDER_FINISH_DELTAS: Record<BuilderConfig['leatherFinish'], { label: string; deltaAED: number }> = {
  'semi-aniline': { label: 'Semi Aniline', deltaAED: 0 },
  aniline: { label: 'Aniline', deltaAED: 1444 },
  burnished: { label: 'Burnished', deltaAED: 722 },
  nubuck: { label: 'Nubuck', deltaAED: 722 },
  suede: { label: 'Suede', deltaAED: 722 },
  textured: { label: 'Textured', deltaAED: 2888 },
};

export const BUILDER_LINING_DELTAS: Record<BuilderConfig['lining'], { label: string; deltaAED: number }> = {
  'quilted-polyester': { label: 'Quilted Polyester', deltaAED: 0 },
  'plain-polyester': { label: 'Plain Polyester', deltaAED: 0 },
  cotton: { label: 'Breathable Cotton', deltaAED: 722 },
  'faux-fur': { label: 'Shearling Faux Fur', deltaAED: 2166 },
  'custom-printed': { label: 'Custom Printed Silk-Touch', deltaAED: 1444 },
};

export const BUILDER_EMBROIDERY_DELTAS: Record<BuilderConfig['exteriorEmbroidery'], { label: string; deltaAED: number }> = {
  none: { label: 'None (Clean Exterior)', deltaAED: 0 },
  'left-chest': { label: 'Left Chest Artwork/Logo', deltaAED: 722 },
  'right-chest': { label: 'Right Chest Artwork/Logo', deltaAED: 722 },
  'left-arm': { label: 'Left Arm Artwork/Logo', deltaAED: 722 },
  'right-arm': { label: 'Right Arm Artwork/Logo', deltaAED: 722 },
  back: { label: 'Full Back Artwork/Logo', deltaAED: 1444 },
};

export const BUILDER_PERSONALIZATION_DELTAS: Record<BuilderConfig['innerPersonalization'], { label: string; deltaAED: number }> = {
  none: { label: 'No Inner Embroidery', deltaAED: 0 },
  initials: { label: 'Initials Embroidery (Inner Pocket)', deltaAED: 722 },
  phrase: { label: 'Phrase Embroidery (Inner Pocket)', deltaAED: 1155.2 },
};

export function calculateBuilderPriceAED(config: BuilderConfig): number {
  const total =
    BUILDER_BASE_PRICE_AED +
    BUILDER_STYLE_DELTAS[config.baseStyle].deltaAED +
    BUILDER_LEATHER_DELTAS[config.leatherType].deltaAED +
    BUILDER_FINISH_DELTAS[config.leatherFinish].deltaAED +
    BUILDER_LINING_DELTAS[config.lining].deltaAED +
    BUILDER_EMBROIDERY_DELTAS[config.exteriorEmbroidery].deltaAED +
    BUILDER_PERSONALIZATION_DELTAS[config.innerPersonalization].deltaAED;

  return Math.round(total * 100) / 100;
}

export interface CatalogFilterOptions {
  gender?: 'all' | 'men' | 'women';
  category?: ProductCategory | 'all';
  leatherType?: string;
  color?: string;
  primeOnly?: boolean;
  saleOnly?: boolean;
  searchQuery?: string;
  sortBy?: 'best-selling' | 'price-asc' | 'price-desc' | 'rating-desc';
}

export function filterAndSortProducts(
  products: Product[],
  options: CatalogFilterOptions
): Product[] {
  const q = (options.searchQuery || '').trim().toLowerCase();

  const filtered = products.filter((p) => {
    if (options.gender && options.gender !== 'all') {
      if (p.gender !== options.gender && p.gender !== 'unisex') return false;
    }
    if (options.category && options.category !== 'all') {
      if (p.category !== options.category) return false;
    }
    if (options.leatherType && options.leatherType !== 'all') {
      if (p.leatherType.toLowerCase() !== options.leatherType.toLowerCase()) return false;
    }
    if (options.color && options.color !== 'all') {
      const hasColor = p.colors.some((c) =>
        c.name.toLowerCase().includes(options.color!.toLowerCase())
      );
      if (!hasColor) return false;
    }
    if (options.primeOnly && !p.primeDelivery) {
      return false;
    }
    if (options.saleOnly && (!p.discountPercent || p.discountPercent <= 0)) {
      return false;
    }
    if (q) {
      const haystack = `${p.name} ${p.categoryLabel} ${p.leatherType} ${p.description} ${p.colors
        .map((c) => c.name)
        .join(' ')}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  const sorted = [...filtered];
  switch (options.sortBy) {
    case 'price-asc':
      sorted.sort((a, b) => a.priceAED - b.priceAED);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.priceAED - a.priceAED);
      break;
    case 'rating-desc':
      sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      break;
    case 'best-selling':
    default:
      sorted.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
  }
  return sorted;
}

export interface CorporateQuoteResult {
  unitBaseAED: number;
  discountPercent: number;
  unitFinalAED: number;
  totalAED: number;
  totalSavingsAED: number;
}

export function calculateCorporateQuote(
  quantity: number,
  productTier: 'leather-jacket' | 'suede-bomber' | 'leather-bag' | 'tailored-suit',
  includeEmbossing: boolean
): CorporateQuoteResult {
  const safeQty = Math.max(10, Math.min(1000, Math.floor(quantity || 10)));
  const baseRates: Record<typeof productTier, number> = {
    'leather-jacket': 1180,
    'suede-bomber': 1120,
    'leather-bag': 790,
    'tailored-suit': 1590,
  };
  const unitBaseAED = baseRates[productTier] + (includeEmbossing ? 85 : 0);

  let discountPercent = 15;
  if (safeQty >= 100) discountPercent = 38;
  else if (safeQty >= 50) discountPercent = 30;
  else if (safeQty >= 25) discountPercent = 22;

  const unitFinalAED = Math.round(unitBaseAED * (1 - discountPercent / 100) * 100) / 100;
  const totalAED = Math.round(unitFinalAED * safeQty * 100) / 100;
  const totalSavingsAED = Math.round((unitBaseAED - unitFinalAED) * safeQty * 100) / 100;

  return {
    unitBaseAED,
    discountPercent,
    unitFinalAED,
    totalAED,
    totalSavingsAED,
  };
}
