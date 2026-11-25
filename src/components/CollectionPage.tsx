import { useEffect, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { PRODUCTS } from '../data/catalog';
import type { AppPage, CurrencyCode, Product, ProductCategory } from '../types';
import { filterAndSortProducts } from '../utils/commerce';
import { ProductCard } from './ProductCard';

interface CollectionPageProps {
  filter: 'men' | 'women' | 'sale' | 'suits' | 'bags' | 'shoes' | 'all';
  initialCategory?: ProductCategory;
  currency: CurrencyCode;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onNavigate: (page: AppPage) => void;
  onQuickAdd: (product: Product) => void;
}

const COLLECTION_META: Record<
  CollectionPageProps['filter'],
  { title: string; eyebrow: string; description: string }
> = {
  men: {
    eyebrow: "Men's Outerwear",
    title: "Men's Leather & Suede Jackets",
    description:
      'From minimalist full-grain cafe racers and burnished biker jackets to velvet-nap goat suede bombers and overcoats.',
  },
  women: {
    eyebrow: "Women's Outerwear",
    title: "Women's Leather Jackets & Coats",
    description:
      'Tailored lambskin double-rider bikers and sweeping leather trench coats cut for effortless structure and movement.',
  },
  sale: {
    eyebrow: 'Limited Annual Event',
    title: 'The Black Friday Event — Up to 25% Off',
    description:
      'Our only sale of the year across iconic handcrafted jackets, coats, weekend bags, and tailored wool suits. Stack code UAE10 at checkout.',
  },
  suits: {
    eyebrow: 'Fine Wool Tailoring',
    title: 'Introducing Tailored Wool Suits',
    description:
      'Super 130s Australian Merino wool with traditional half-canvas construction for enduring drape, breathability, and fit.',
  },
  bags: {
    eyebrow: 'TruCarry Leather Goods',
    title: 'Full-Grain Leather Bags & Carryalls',
    description:
      'Vegetable-tanned leather weekenders and cabin duffles finished with solid brushed brass hardware.',
  },
  shoes: {
    eyebrow: 'Eviternity Footwear',
    title: "Goodyear-Welted Men's Shoes & Boots",
    description:
      'Hand-lasted full-grain calfskin footwear built to be resoled and worn for years.',
  },
  all: {
    eyebrow: 'Complete Atelier Archive',
    title: 'All Handcrafted Leather Goods',
    description:
      'Explore every handcrafted leather jacket, suede bomber, wool suit, weekender bag, and Goodyear-welted boot.',
  },
};

export function CollectionPage({
  filter,
  initialCategory,
  currency,
  wishlist,
  onToggleWishlist,
  onNavigate,
  onQuickAdd,
}: CollectionPageProps) {
  const [category, setCategory] = useState<ProductCategory | 'all'>(initialCategory || 'all');
  const [leatherType, setLeatherType] = useState<string>('all');
  const [primeOnly, setPrimeOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'best-selling' | 'price-asc' | 'price-desc' | 'rating-desc'>(
    'best-selling'
  );

  useEffect(() => {
    if (filter === 'suits') setCategory('suits');
    else if (filter === 'bags') setCategory('bags');
    else if (filter === 'shoes') setCategory('shoes');
    else setCategory(initialCategory || 'all');
    setLeatherType('all');
    setPrimeOnly(false);
  }, [filter, initialCategory]);

  const genderScope = filter === 'men' ? 'men' : filter === 'women' ? 'women' : 'all';

  const visibleProducts = filterAndSortProducts(PRODUCTS, {
    gender: genderScope,
    category,
    leatherType,
    primeOnly,
    saleOnly: filter === 'sale',
    sortBy,
  });

  const meta = COLLECTION_META[filter];

  const categoryTabs: { id: ProductCategory | 'all'; label: string }[] =
    filter === 'men'
      ? [
          { id: 'all', label: 'All Men' },
          { id: 'leather-jackets', label: 'Leather Jackets' },
          { id: 'suede-jackets', label: 'Suede Jackets' },
          { id: 'biker-jackets', label: 'Biker Jackets' },
          { id: 'bomber-jackets', label: 'Bomber Jackets' },
          { id: 'leather-coats', label: 'Leather Coats' },
          { id: 'suits', label: 'Wool Suits' },
          { id: 'shoes', label: 'Shoes' },
        ]
      : filter === 'women'
        ? [
            { id: 'all', label: 'All Women' },
            { id: 'biker-jackets', label: 'Biker Jackets' },
            { id: 'leather-coats', label: 'Leather Coats' },
            { id: 'bags', label: 'Leather Bags' },
          ]
        : [
            { id: 'all', label: 'All Pieces' },
            { id: 'leather-jackets', label: 'Leather Jackets' },
            { id: 'suede-jackets', label: 'Suede' },
            { id: 'biker-jackets', label: 'Bikers' },
            { id: 'bomber-jackets', label: 'Bombers' },
            { id: 'leather-coats', label: 'Coats' },
            { id: 'suits', label: 'Suits' },
            { id: 'bags', label: 'Bags' },
            { id: 'shoes', label: 'Shoes' },
          ];

  const hasActiveFilters = leatherType !== 'all' || primeOnly || (category !== 'all' && filter !== 'suits' && filter !== 'bags' && filter !== 'shoes');

  return (
    <div className="max-w-[1360px] mx-auto px-6 sm:px-10 py-10 lg:py-14">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-[#767676] mb-6 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onNavigate({ view: 'home' })}
          className="hover:text-[#1C1C1C]"
        >
          Home
        </button>
        <span aria-hidden="true">/</span>
        <span className="text-[#1C1C1C] font-medium">{meta.eyebrow}</span>
      </nav>

      {/* Editorial Collection Header */}
      <div className="max-w-2xl mb-10">
        <p
          className={`text-[11px] font-semibold tracking-[0.18em] uppercase mb-2 ${
            filter === 'sale' ? 'text-[#C41E24]' : 'text-[#767676]'
          }`}
        >
          {meta.eyebrow}
        </p>
        <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#1C1C1C] leading-tight mb-3">
          {meta.title}
        </h1>
        <p className="text-sm sm:text-base text-[#595959] leading-relaxed">{meta.description}</p>
      </div>

      {/* Category Sub-Navigation */}
      <div className="flex flex-wrap items-center gap-2 pb-6 mb-6 border-b border-[#E5E5E3]">
        {categoryTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setCategory(tab.id)}
            className={`px-4 py-2 text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
              category === tab.id
                ? 'bg-[#1C1C1C] text-white border-[#1C1C1C]'
                : 'bg-white text-[#595959] border-[#E5E5E3] hover:border-[#1C1C1C] hover:text-[#1C1C1C]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter & Sort Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-9">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1C1C1C]">
            <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
            Filter:
          </span>

          <label htmlFor="filter-material" className="sr-only">
            Filter by material
          </label>
          <select
            id="filter-material"
            value={leatherType}
            onChange={(e) => setLeatherType(e.target.value)}
            className="border border-[#D4D4D0] bg-white px-3 py-2 text-xs text-[#1C1C1C]"
          >
            <option value="all">All Materials</option>
            <option value="Sheepskin">Full-Grain Sheepskin</option>
            <option value="Cowhide">Full-Grain Cowhide</option>
            <option value="Goatskin">Pebbled Goatskin</option>
            <option value="Suede">Goat Suede</option>
            <option value="Merino Wool">Super 130s Merino Wool</option>
            <option value="Full-Grain Calf">Full-Grain Calf</option>
          </select>

          <label className="inline-flex items-center gap-2 text-xs text-[#1C1C1C] border border-[#D4D4D0] px-3 py-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={primeOnly}
              onChange={(e) => setPrimeOnly(e.target.checked)}
              className="accent-[#1C1C1C]"
            />
            Prime UAE Delivery Only
          </label>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setLeatherType('all');
                setPrimeOnly(false);
                if (filter !== 'suits' && filter !== 'bags' && filter !== 'shoes') {
                  setCategory('all');
                }
              }}
              className="inline-flex items-center gap-1 text-xs text-[#595959] hover:text-[#1C1C1C] underline underline-offset-4"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" /> Clear filters
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-[#767676] tabular-nums">
            {visibleProducts.length} {visibleProducts.length === 1 ? 'Piece' : 'Pieces'}
          </span>

          <div className="flex items-center gap-2">
            <label htmlFor="sort-catalog" className="text-xs text-[#595959]">
              Sort:
            </label>
            <select
              id="sort-catalog"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'best-selling' | 'price-asc' | 'price-desc' | 'rating-desc')
              }
              className="border border-[#D4D4D0] bg-white px-3 py-2 text-xs text-[#1C1C1C]"
            >
              <option value="best-selling">Best Selling</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid or Empty State */}
      {visibleProducts.length === 0 ? (
        <div className="border border-[#E5E5E3] bg-[#FAF9F7] p-14 text-center">
          <h2 className="font-display text-2xl font-semibold text-[#1C1C1C] mb-2">
            No Matching Pieces Found
          </h2>
          <p className="text-sm text-[#595959] mb-6">
            Try resetting your material or delivery filters, or design your own exact leather piece
            in our bespoke studio.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setCategory('all');
                setLeatherType('all');
                setPrimeOnly(false);
              }}
              className="px-6 py-2.5 bg-[#1C1C1C] text-white text-xs font-semibold tracking-[0.14em] uppercase"
            >
              Reset Filters
            </button>
            <button
              type="button"
              onClick={() => onNavigate({ view: 'builder' })}
              className="px-6 py-2.5 border border-[#1C1C1C] text-[#1C1C1C] text-xs font-semibold tracking-[0.14em] uppercase"
            >
              Design Your Own
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-12">
          {visibleProducts.map((product) => (
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
      )}
    </div>
  );
}
