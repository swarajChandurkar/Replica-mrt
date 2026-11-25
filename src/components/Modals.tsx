import { useState } from 'react';
import { Heart, Package, Ruler, Search, Sparkles, X } from 'lucide-react';
import { MEN_SIZE_CHART, PRODUCTS, WOMEN_SIZE_CHART } from '../data/catalog';
import type { AppPage, CurrencyCode, CustomInquiry, OrderRecord } from '../types';
import { filterAndSortProducts, formatMoney } from '../utils/commerce';
import { SafeImage } from './SafeImage';

/* -------------------------------------------------------------------------- */
/* SEARCH MODAL                                                               */
/* -------------------------------------------------------------------------- */

interface SearchModalProps {
  open: boolean;
  currency: CurrencyCode;
  onClose: () => void;
  onSelectProduct: (slug: string) => void;
  onNavigate: (page: AppPage) => void;
}

export function SearchModal({
  open,
  currency,
  onClose,
  onSelectProduct,
  onNavigate,
}: SearchModalProps) {
  const [query, setQuery] = useState('');

  if (!open) return null;

  const results = filterAndSortProducts(PRODUCTS, {
    searchQuery: query,
    sortBy: 'best-selling',
  }).slice(0, 6);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-16 sm:pt-24 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Search The Jacket Maker Catalog"
    >
      <div className="bg-white w-full max-w-2xl border border-[#E5E5E3] shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E5E3] flex items-center gap-3">
          <Search className="w-4 h-4 text-[#595959] shrink-0" aria-hidden="true" />
          <label htmlFor="catalog-search-input" className="sr-only">
            Search leather jackets, suede, coats, or bags
          </label>
          <input
            id="catalog-search-input"
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Ionic, Suede, Biker, Trench, Weekender..."
            className="flex-1 text-sm text-[#1C1C1C] placeholder:text-[#767676] focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="p-1.5 text-[#595959] hover:text-[#1C1C1C]"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="p-5 max-h-[65vh] overflow-y-auto space-y-5">
          {!query.trim() && (
            <div className="flex flex-wrap gap-2">
              {['Suede', 'Biker', 'Black', 'Trench', 'Suit', 'Weekender'].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="px-3 py-1.5 border border-[#E5E5E3] text-xs text-[#595959] hover:border-[#1C1C1C] hover:text-[#1C1C1C]"
                >
                  {term}
                </button>
              ))}
            </div>
          )}

          {results.length === 0 ? (
            <div className="py-10 text-center space-y-3">
              <p className="text-sm text-[#595959]">
                No pieces matched “{query}”. Try another term or craft your custom jacket.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigate({ view: 'builder' });
                }}
                className="px-5 py-2.5 bg-[#1C1C1C] text-white text-xs font-semibold uppercase tracking-[0.14em]"
              >
                Design Your Own
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    onSelectProduct(p.slug);
                    onClose();
                  }}
                  className="flex items-center gap-3.5 p-2 hover:bg-[#FAF9F7] text-left transition-colors"
                >
                  <div className="w-16 h-20 bg-[#F1F1EF] shrink-0 overflow-hidden">
                    <SafeImage src={p.image} alt={p.name} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-[#767676]">{p.categoryLabel}</p>
                    <p className="text-xs font-semibold text-[#1C1C1C] truncate">{p.name}</p>
                    <p className="text-xs font-medium text-[#1C1C1C] mt-1 tabular-nums">
                      {formatMoney(p.priceAED, currency)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ACCOUNT MODAL (WISHLIST, ORDER HISTORY, BESPOKE REQUESTS)                  */
/* -------------------------------------------------------------------------- */

interface AccountModalProps {
  open: boolean;
  currency: CurrencyCode;
  wishlist: string[];
  orders: OrderRecord[];
  inquiries: CustomInquiry[];
  onClose: () => void;
  onSelectProduct: (slug: string) => void;
  onToggleWishlist: (productId: string) => void;
}

export function AccountModal({
  open,
  currency,
  wishlist,
  orders,
  inquiries,
  onClose,
  onSelectProduct,
  onToggleWishlist,
}: AccountModalProps) {
  const [tab, setTab] = useState<'wishlist' | 'orders' | 'inquiries'>('wishlist');

  if (!open) return null;

  const savedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Account, Wishlist and Orders"
    >
      <div className="bg-white w-full max-w-2xl max-h-[82vh] flex flex-col border border-[#E5E5E3] shadow-2xl">
        <div className="px-6 py-4 border-b border-[#E5E5E3] flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-[#1C1C1C]">Your Atelier Account</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close account modal"
            className="p-2 text-[#595959] hover:text-[#1C1C1C]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="px-6 pt-4 border-b border-[#EFEFED] flex gap-6 text-xs font-semibold uppercase tracking-[0.12em]">
          <button
            type="button"
            onClick={() => setTab('wishlist')}
            className={`pb-3 border-b-2 -mb-[1px] inline-flex items-center gap-1.5 ${
              tab === 'wishlist'
                ? 'border-[#1C1C1C] text-[#1C1C1C]'
                : 'border-transparent text-[#767676]'
            }`}
          >
            <Heart className="w-3.5 h-3.5" aria-hidden="true" /> Saved ({savedProducts.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('orders')}
            className={`pb-3 border-b-2 -mb-[1px] inline-flex items-center gap-1.5 ${
              tab === 'orders'
                ? 'border-[#1C1C1C] text-[#1C1C1C]'
                : 'border-transparent text-[#767676]'
            }`}
          >
            <Package className="w-3.5 h-3.5" aria-hidden="true" /> Orders ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('inquiries')}
            className={`pb-3 border-b-2 -mb-[1px] inline-flex items-center gap-1.5 ${
              tab === 'inquiries'
                ? 'border-[#1C1C1C] text-[#1C1C1C]'
                : 'border-transparent text-[#767676]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> Bespoke ({inquiries.length})
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {tab === 'wishlist' && (
            savedProducts.length === 0 ? (
              <p className="text-sm text-[#595959] py-8 text-center">
                You haven&apos;t saved any pieces yet. Tap the heart icon on any jacket to keep it
                here.
              </p>
            ) : (
              <div className="space-y-4">
                {savedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-4 border-b border-[#EFEFED] pb-4"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onSelectProduct(p.slug);
                        onClose();
                      }}
                      className="flex items-center gap-3.5 text-left"
                    >
                      <div className="w-14 h-18 bg-[#F1F1EF] overflow-hidden shrink-0">
                        <SafeImage src={p.image} alt={p.name} className="w-full h-full object-cover object-top" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1C1C1C]">{p.name}</p>
                        <p className="text-xs text-[#595959] tabular-nums">
                          {formatMoney(p.priceAED, currency)}
                        </p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleWishlist(p.id)}
                      className="text-xs text-[#767676] hover:text-[#C41E24] underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )
          )}

          {tab === 'orders' && (
            orders.length === 0 ? (
              <p className="text-sm text-[#595959] py-8 text-center">
                No orders placed yet. Complete a checkout to track your shipment here.
              </p>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div key={ord.orderNumber} className="border border-[#E5E5E3] p-4 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="font-semibold text-[#1C1C1C] tabular-nums">
                        Order #{ord.orderNumber}
                      </span>
                      <span className="font-medium text-[#1C1C1C]">{ord.status}</span>
                    </div>
                    <p className="text-[#595959]">
                      Placed {ord.placedAt} · {ord.paymentMethod} · Est. Delivery{' '}
                      {ord.estimatedDelivery}
                    </p>
                    <p className="font-semibold text-[#1C1C1C] tabular-nums">
                      Total: {formatMoney(ord.totalAED, currency)}
                    </p>
                  </div>
                ))}
              </div>
            )
          )}

          {tab === 'inquiries' && (
            inquiries.length === 0 ? (
              <p className="text-sm text-[#595959] py-8 text-center">
                No bespoke consultation requests yet.
              </p>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="border border-[#E5E5E3] p-4 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="font-semibold text-[#1C1C1C]">{inq.id}</span>
                      <span className="text-[#767676]">{inq.submittedAt}</span>
                    </div>
                    <p className="text-[#1C1C1C] font-medium">
                      Qty: {inq.quantity} · Budget: Dhs. {inq.budgetAED} AED
                    </p>
                    <p className="text-[#595959]">{inq.description}</p>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SIZE GUIDE MODAL                                                           */
/* -------------------------------------------------------------------------- */

export function SizeGuideModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [gender, setGender] = useState<'men' | 'women'>('men');
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');

  if (!open) return null;

  const rows = gender === 'men' ? MEN_SIZE_CHART : WOMEN_SIZE_CHART;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Size Guide"
    >
      <div className="bg-white w-full max-w-2xl border border-[#E5E5E3] shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E5E3] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-[#1C1C1C]" aria-hidden="true" />
            <h2 className="font-display text-xl font-semibold text-[#1C1C1C]">
              Updated Outerwear Size Guide
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close size guide"
            className="p-2 text-[#595959] hover:text-[#1C1C1C]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex border border-[#D8D8D5]">
              <button
                type="button"
                onClick={() => setGender('men')}
                className={`px-4 py-1.5 text-xs font-semibold ${
                  gender === 'men' ? 'bg-[#1C1C1C] text-white' : 'bg-white text-[#595959]'
                }`}
              >
                Men
              </button>
              <button
                type="button"
                onClick={() => setGender('women')}
                className={`px-4 py-1.5 text-xs font-semibold ${
                  gender === 'women' ? 'bg-[#1C1C1C] text-white' : 'bg-white text-[#595959]'
                }`}
              >
                Women
              </button>
            </div>

            <div className="inline-flex border border-[#D8D8D5]">
              <button
                type="button"
                onClick={() => setUnit('cm')}
                className={`px-3 py-1.5 text-xs font-semibold ${
                  unit === 'cm' ? 'bg-[#1C1C1C] text-white' : 'bg-white text-[#595959]'
                }`}
              >
                CM
              </button>
              <button
                type="button"
                onClick={() => setUnit('in')}
                className={`px-3 py-1.5 text-xs font-semibold ${
                  unit === 'in' ? 'bg-[#1C1C1C] text-white' : 'bg-white text-[#595959]'
                }`}
              >
                Inches
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-[#E5E5E3]">
            <table className="w-full text-left text-xs tabular-nums">
              <thead className="bg-[#FAF9F7] border-b border-[#E5E5E3]">
                <tr>
                  <th className="py-3 px-3">Size</th>
                  <th className="py-3 px-3">EU</th>
                  <th className="py-3 px-3">Chest ({unit})</th>
                  <th className="py-3 px-3">Waist ({unit})</th>
                  <th className="py-3 px-3">Sleeve ({unit})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEFED]">
                {rows.map((r) => (
                  <tr key={r.size}>
                    <td className="py-2.5 px-3 font-semibold">{r.size}</td>
                    <td className="py-2.5 px-3 text-[#595959]">{r.eu}</td>
                    <td className="py-2.5 px-3">{unit === 'cm' ? r.chestCm : r.chestIn}</td>
                    <td className="py-2.5 px-3">{unit === 'cm' ? r.waistCm : r.waistIn}</td>
                    <td className="py-2.5 px-3">{unit === 'cm' ? r.sleeveCm : r.sleeveIn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[#595959]">
            Between sizes? Select <strong>Made to Measure (+200 AED)</strong> on any product page
            for exact custom tailoring.
          </p>
        </div>
      </div>
    </div>
  );
}
