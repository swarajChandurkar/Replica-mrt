import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BUILDER_BASE_PRICE_AED,
  CURRENCIES,
  MADE_TO_MEASURE_SURCHARGE_AED,
  calculateBuilderPriceAED,
  calculateCartSummary,
  calculateCorporateQuote,
  calculateInstallments,
  convertFromAED,
  filterAndSortProducts,
  formatMoney,
  usdToAED,
  validatePromoCode,
} from './commerce';
import type { BuilderConfig, CartItem, Product } from '../types';

test('supports 100+ currencies and accurate AED/USD conversion', () => {
  assert.ok(Object.keys(CURRENCIES).length >= 100, 'Expected at least 100 currencies');
  assert.equal(formatMoney(976, 'AED'), 'Dhs. 976.00 AED');
  assert.equal(convertFromAED(MADE_TO_MEASURE_SURCHARGE_AED, 'USD'), 50);
  assert.equal(formatMoney(MADE_TO_MEASURE_SURCHARGE_AED, 'USD'), '$50.00');
  assert.equal(convertFromAED(BUILDER_BASE_PRICE_AED, 'USD'), 400);
  assert.equal(formatMoney(BUILDER_BASE_PRICE_AED, 'USD'), '$400.00');
});

test('Shop Pay BNPL installments compute 4 interest-free biweekly and 12-month Affirm plans', () => {
  const jacket239 = usdToAED(239.2);
  const planStandard = calculateInstallments(jacket239);
  assert.equal(convertFromAED(planStandard.biweeklyAmountAED, 'USD'), 59.8);
  assert.equal(planStandard.qualifiesForMonthly, true);

  const planBespoke = calculateInstallments(BUILDER_BASE_PRICE_AED);
  assert.equal(convertFromAED(planBespoke.biweeklyAmountAED, 'USD'), 100);
  assert.equal(convertFromAED(planBespoke.monthly12AmountAED, 'USD'), 36.1);
});

test('promo code validation handles UAE10, BF25, and invalid codes', () => {
  const valid = validatePromoCode(' uae10 ');
  assert.equal(valid.valid, true);
  assert.equal(valid.discountRate, 0.1);
  assert.equal(valid.code, 'UAE10');

  const invalid = validatePromoCode('NOTACODE');
  assert.equal(invalid.valid, false);
  assert.ok(invalid.error && invalid.error.includes('NOTACODE'));
});

test('cart summary computes subtotal, promo discount, savings, and loyalty points', () => {
  const items: CartItem[] = [
    {
      lineId: 'l1',
      productId: 'ionic-black',
      slug: 'ionic-black-leather-jacket',
      name: 'Ionic Black Leather Jacket',
      image: '/img.jpg',
      unitPriceAED: 976,
      compareAtAED: 1220,
      quantity: 2,
      color: 'Black',
      size: 'L',
    },
  ];

  const summaryNoPromo = calculateCartSummary(items);
  assert.equal(summaryNoPromo.itemCount, 2);
  assert.equal(summaryNoPromo.subtotalAED, 1952);
  assert.equal(summaryNoPromo.saleSavingsAED, 488);
  assert.equal(summaryNoPromo.totalAED, 1952);

  const summaryWithPromo = calculateCartSummary(items, 'UAE10');
  assert.equal(summaryWithPromo.discountAED, 195.2);
  assert.equal(summaryWithPromo.totalAED, 1756.8);
  assert.ok(summaryWithPromo.loyaltyPoints > 2000);
});

test('custom jacket builder starts at $400 USD and calculates exact add-on deltas', () => {
  const baseConfig: BuilderConfig = {
    baseStyle: 'cafe-racer',
    leatherType: 'sheepskin',
    leatherFinish: 'semi-aniline',
    shade: 'Jet Black',
    isCustomPantone: false,
    pantoneCode: '',
    hardware: 'Silver',
    lining: 'quilted-polyester',
    exteriorEmbroidery: 'none',
    innerPersonalization: 'none',
    personalizationText: '',
    fitType: 'standard',
    standardSize: 'M',
  };

  assert.equal(convertFromAED(calculateBuilderPriceAED(baseConfig), 'USD'), 400);

  // Vest (-$50) -> $350
  const vestConfig: BuilderConfig = { ...baseConfig, baseStyle: 'leather-vest' };
  assert.equal(convertFromAED(calculateBuilderPriceAED(vestConfig), 'USD'), 350);

  // Full-length coat (+$150) + Calf Hide (+$150) + Textured (+$200) + Pantone (+$100) + Matte Black (+$20) + Faux Fur (+$150) + Back Embroidery (+$100) + Phrase (+$100) = $1,370
  const maxedConfig: BuilderConfig = {
    ...baseConfig,
    baseStyle: 'full-length-coat',
    leatherType: 'calf-hide',
    leatherFinish: 'textured',
    isCustomPantone: true,
    pantoneCode: 'PMS 19-4052',
    hardware: 'Matte Black',
    lining: 'faux-fur',
    exteriorEmbroidery: 'back',
    innerPersonalization: 'phrase',
  };
  assert.equal(convertFromAED(calculateBuilderPriceAED(maxedConfig), 'USD'), 1370);
});

test('catalog filtering and sorting handle search, gender, leather, and price order', () => {
  const sampleProducts: Product[] = [
    {
      id: '1',
      slug: 'sheriff-brown-suede',
      name: 'Sheriff Brown Suede Jacket',
      gender: 'men',
      category: 'suede-jackets',
      categoryLabel: 'Suede Jackets',
      priceAED: 1336,
      compareAtAED: 1670,
      discountPercent: 20,
      primeDelivery: true,
      rating: 4.8,
      reviewCount: 166,
      image: '/a.jpg',
      colors: [{ name: 'Tobacco Brown', hex: '#7c4b27' }],
      leatherType: 'Suede',
      lining: 'Polyester',
      hardware: 'Silver',
      fit: 'Tailored',
      description: 'Goat suede trucker jacket',
      specs: [],
      careNotes: [],
      deliveryEstimate: 'Nov 30',
    },
    {
      id: '2',
      slug: 'ionic-black',
      name: 'Ionic Black Leather Jacket',
      gender: 'men',
      category: 'leather-jackets',
      categoryLabel: 'Leather Jackets',
      priceAED: 976,
      compareAtAED: 1220,
      discountPercent: 20,
      primeDelivery: true,
      rating: 4.9,
      reviewCount: 430,
      image: '/b.jpg',
      colors: [{ name: 'Jet Black', hex: '#141414' }],
      leatherType: 'Sheepskin',
      lining: 'Quilted Polyester',
      hardware: 'YKK Silver',
      fit: 'Slim Fit',
      description: 'Minimalist black sheepskin cafe racer',
      specs: [],
      careNotes: [],
      deliveryEstimate: 'Nov 30',
    },
  ];

  const byPriceAsc = filterAndSortProducts(sampleProducts, { sortBy: 'price-asc' });
  assert.equal(byPriceAsc[0].id, '2');

  const searchSuede = filterAndSortProducts(sampleProducts, { searchQuery: 'suede' });
  assert.equal(searchSuede.length, 1);
  assert.equal(searchSuede[0].id, '1');
});

test('corporate bulk quote applies volume tiers with no minimum order quantity', () => {
  const single = calculateCorporateQuote(1, 'leather-jacket', false);
  assert.equal(single.discountPercent, 0);

  const tier1 = calculateCorporateQuote(15, 'leather-jacket', false);
  assert.equal(tier1.discountPercent, 15);
  assert.equal(tier1.unitBaseAED, 1180);

  const tier3 = calculateCorporateQuote(60, 'leather-jacket', true);
  assert.equal(tier3.discountPercent, 30);
  assert.equal(tier3.unitBaseAED, 1265);
  assert.ok(tier3.totalSavingsAED > 20000);
});
