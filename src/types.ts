export type CurrencyCode = string;

export interface CurrencyConfig {
  code: CurrencyCode;
  country: string;
  symbol: string;
  label: string;
  rateFromAED: number;
}

export type GenderFilter = 'all' | 'men' | 'women' | 'unisex';

export type ProductCategory =
  | 'leather-jackets'
  | 'suede-jackets'
  | 'biker-jackets'
  | 'bomber-jackets'
  | 'leather-coats'
  | 'suits'
  | 'bags'
  | 'shoes'
  | 'gift-cards';

export type WorkflowTrack =
  | 'Ready-to-Ship Prime'
  | 'Made-to-Measure (3–4 Weeks)'
  | 'Digital Bespoke (10–12 Weeks)';

export type PaymentMethod =
  | 'Card'
  | 'Shop Pay'
  | 'PayPal'
  | 'Amazon Pay'
  | 'Cash on Delivery (UAE)';

export interface ProductColorOption {
  name: string;
  hex: string;
}

export interface ProductReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verifiedFit: 'Standard Fit' | 'Made to Measure' | 'Bespoke Custom';
}

export interface CommunityVideo {
  id: string;
  creatorHandle: string;
  creatorRole: string;
  location: string;
  title: string;
  duration: string;
  views: string;
  productSlug: string;
  productName: string;
  priceAED: number;
  posterImage: string;
  secondaryFrameImage: string;
  quote: string;
  fitNote: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  gender: 'men' | 'women' | 'unisex';
  category: ProductCategory;
  categoryLabel: string;
  priceAED: number;
  compareAtAED?: number;
  discountPercent?: number;
  primeDelivery: boolean;
  rating: number;
  reviewCount: number;
  image: string;
  secondaryImage?: string;
  colors: ProductColorOption[];
  leatherType: 'Sheepskin' | 'Cowhide' | 'Goatskin' | 'Suede' | 'Merino Wool' | 'Full-Grain Calf';
  lining: string;
  hardware: string;
  fit: string;
  description: string;
  specs: string[];
  careNotes: string[];
  isBestSeller?: boolean;
  isFeaturedSale?: boolean;
  deliveryEstimate: string;
}

export interface CustomMeasurements {
  chestCm: string;
  waistCm: string;
  hipsCm: string;
  shoulderCm: string;
  sleeveCm: string;
  heightCm: string;
  submitLaterByEmail?: boolean;
}

export interface CartItem {
  lineId: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  unitPriceAED: number;
  compareAtAED?: number;
  quantity: number;
  color: string;
  size: string;
  isMadeToMeasure?: boolean;
  workflowTrack?: WorkflowTrack;
  measurements?: CustomMeasurements;
  customSummary?: string[];
}

export interface BuilderConfig {
  baseStyle:
    | 'cafe-racer'
    | 'double-rider'
    | 'leather-bomber'
    | 'leather-vest'
    | 'mid-length-coat'
    | 'full-length-coat';
  leatherType: 'sheepskin' | 'goatskin' | 'cowhide' | 'calf-hide';
  leatherFinish: 'semi-aniline' | 'aniline' | 'burnished' | 'nubuck' | 'suede' | 'textured';
  shade: string;
  isCustomPantone: boolean;
  pantoneCode: string;
  hardware: 'Silver' | 'Antique Brass' | 'Gunmetal' | 'Matte Black' | 'Brushed Gold';
  lining: 'quilted-polyester' | 'plain-polyester' | 'cotton' | 'faux-fur' | 'custom-printed';
  exteriorEmbroidery: 'none' | 'left-chest' | 'right-chest' | 'left-arm' | 'right-arm' | 'back';
  innerPersonalization: 'none' | 'initials' | 'phrase';
  personalizationText: string;
  fitType: 'standard' | 'made-to-measure';
  standardSize: string;
}

export interface OrderRecord {
  orderNumber: string;
  placedAt: string;
  status: 'Confirmed' | 'In Atelier Production' | 'Quality Inspection' | 'Dispatched' | 'Delivered';
  paymentMethod: PaymentMethod;
  workflowTrack?: WorkflowTrack;
  customerName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  items: CartItem[];
  subtotalAED: number;
  discountAED: number;
  promoCode?: string;
  totalAED: number;
  estimatedDelivery: string;
}

export interface CustomInquiry {
  id: string;
  submittedAt: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  quantity: string;
  country: string;
  gender: string;
  budgetAED: string;
  description: string;
}

export type AppPage =
  | { view: 'home' }
  | { view: 'collection'; filter: 'men' | 'women' | 'sale' | 'suits' | 'bags' | 'shoes' | 'all'; category?: ProductCategory }
  | { view: 'product'; slug: string }
  | { view: 'builder'; prefillName?: string }
  | { view: 'customize' }
  | { view: 'brand' }
  | { view: 'corporate' }
  | { view: 'gifting' }
  | { view: 'help'; tab?: 'track' | 'size-guide' | 'shipping' | 'returns' | 'contact' };
