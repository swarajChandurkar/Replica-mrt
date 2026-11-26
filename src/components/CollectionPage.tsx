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
    <div className="max-w-[1360px] mx-auto px-4 sm:px-10 py-6 lg:py-14">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-[#767676] dark:text-[#8A8E91] mb-4 sm:mb-6 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onNavigate({ view: 'home' })}
          className="hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE]"
        >
          Home
        </button>
        <span aria-hidden="true">/</span>
        <span className="text-[#1C1C1C] dark:text-[#F4F3EE] font-medium">{meta.eyebrow}</span>
      </nav>

      {/* Editorial Collection Header */}
      <div className="max-w-2xl mb-6 sm:mb-10">
        <p
          className={`text-[11px] font-semibold tracking-[0.18em] uppercase mb-2 ${
            filter === 'sale' ? 'text-[#C41E24] dark:text-[#E8555A]' : 'text-[#767676] dark:text-[#8A8E91]'
          }`}
        >
          {meta.eyebrow}
        </p>
        <h1 className="font-display text-[28px] sm:text-5xl font-semibold text-[#1C1C1C] dark:text-[#F4F3EE] leading-[1.12] mb-2.5 sm:mb-3">
          {meta.title}
        </h1>
        <p className="text-[13px] sm:text-base text-[#595959] dark:text-[#A8ACAF] leading-relaxed">{meta.description}</p>
      </div>

      {/* Category Sub-Navigation */}
      <div className="flex flex-nowrap overflow-x-auto no-scrollbar sm:flex-wrap items-center gap-2 -mx-4 px-4 sm:mx-0 sm:px-0 pb-4 sm:pb-6 mb-5 sm:mb-6 border-b border-[#E5E5E3] dark:border-[#23292D]">
        {categoryTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setCategory(tab.id)}
            className={`px-3.5 sm:px-4 py-2 text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
              category === tab.id
                ? 'bg-[#1C1C1C] dark:bg-[#F4F3EE] text-white dark:text-[#0E1214] border-[#1C1C1C] dark:border-[#F4F3EE]'
                : 'bg-white dark:bg-[#14191C] text-[#595959] dark:text-[#A8ACAF] border-[#E5E5E3] dark:border-[#262D31] hover:border-[#1C1C1C] dark:hover:border-[#F4F3EE] hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter & Sort Toolbar */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-9">
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#1C1C1C] dark:text-[#F4F3EE]">
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
            className="w-full sm:w-auto border border-[#D4D4D0] dark:border-[#2B3237] bg-white dark:bg-[#14191C] px-2.5 sm:px-3 py-2 text-xs text-[#1C1C1C] dark:text-[#F4F3EE]"
          >
            <option value="all">All Materials</option>
            <option value="Sheepskin">Full-Grain Sheepskin</option>
            <option value="Cowhide">Full-Grain Cowhide</option>
            <option value="Goatskin">Pebbled Goatskin</option>
            <option value="Suede">Goat Suede</option>
            <option value="Merino Wool">Super 130s Merino Wool</option>
            <option value="Full-Grain Calf">Full-Grain Calf</option>
          </select>

          <label className="inline-flex items-center justify-center sm:justify-start gap-2 text-xs text-[#1C1C1C] dark:text-[#E5E4DE] border border-[#D4D4D0] dark:border-[#2B3237] bg-white dark:bg-[#14191C] px-2.5 sm:px-3 py-2 cursor-pointer select-none whitespace-nowrap">
            <input
              type="checkbox"
              checked={primeOnly}
              onChange={(e) => setPrimeOnly(e.target.checked)}
              className="accent-[#1C1C1C] dark:accent-[#F4F3EE]"
            />
            <span className="sm:hidden">Prime UAE Only</span>
            <span className="hidden sm:inline">Prime UAE Delivery Only</span>
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
              className="col-span-2 sm:col-span-1 justify-self-start inline-flex items-center gap-1 text-xs text-[#595959] dark:text-[#A8ACAF] hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE] underline underline-offset-4"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" /> Clear filters
            </button>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
          <span className="text-xs text-[#767676] dark:text-[#8A8E91] tabular-nums">
            {visibleProducts.length} {visibleProducts.length === 1 ? 'Piece' : 'Pieces'}
          </span>

          <div className="flex items-center gap-2">
            <label htmlFor="sort-catalog" className="text-xs text-[#595959] dark:text-[#A8ACAF]">
              Sort:
            </label>
            <select
              id="sort-catalog"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'best-selling' | 'price-asc' | 'price-desc' | 'rating-desc')
              }
              className="border border-[#D4D4D0] dark:border-[#2B3237] bg-white dark:bg-[#14191C] px-2.5 sm:px-3 py-2 text-xs text-[#1C1C1C] dark:text-[#F4F3EE]"
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
        <div className="border border-[#E5E5E3] dark:border-[#252B2F] bg-[#FAF9F7] dark:bg-[#14191C] p-14 text-center">
          <h2 className="font-display text-2xl font-semibold text-[#1C1C1C] dark:text-[#F4F3EE] mb-2">
            No Matching Pieces Found
          </h2>
          <p className="text-sm text-[#595959] dark:text-[#A8ACAF] mb-6">
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
              className="px-6 py-2.5 bg-[#1C1C1C] dark:bg-[#F4F3EE] text-white dark:text-[#0E1214] text-xs font-semibold tracking-[0.14em] uppercase"
            >
              Reset Filters
            </button>
            <button
              type="button"
              onClick={() => onNavigate({ view: 'builder' })}
              className="px-6 py-2.5 border border-[#1C1C1C] dark:border-[#F4F3EE] text-[#1C1C1C] dark:text-[#F4F3EE] text-xs font-semibold tracking-[0.14em] uppercase"
            >
              Design Your Own
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3.5 gap-y-7 sm:gap-x-7 sm:gap-y-12">
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
