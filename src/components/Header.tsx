import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
  ChevronDown,
} from 'lucide-react';
import type { AppPage, CurrencyCode } from '../types';
import { CURRENCIES } from '../utils/commerce';

interface HeaderProps {
  page: AppPage;
  onNavigate: (page: AppPage) => void;
  currency: CurrencyCode;
  onCurrencyChange: (code: CurrencyCode) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
}

const ANNOUNCEMENTS = [
  {
    text: 'UAE Exclusive — Use code UAE10 for 10% off your order.',
    actionLabel: 'Shop Now',
    target: { view: 'collection', filter: 'sale' } as AppPage,
  },
  {
    text: 'BLACK FRIDAY SALE | UP TO 25% OFF — Free Duty-Paid UAE Delivery.',
    actionLabel: 'Explore Sale',
    target: { view: 'collection', filter: 'sale' } as AppPage,
  },
];

export function Header({
  page,
  onNavigate,
  currency,
  onCurrencyChange,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenSearch,
  onOpenAccount,
}: HeaderProps) {
  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);

  const activeAnnouncement = ANNOUNCEMENTS[announcementIdx];

  const navItems: { label: string; target: AppPage; isSale?: boolean; isActive: boolean }[] = [
    {
      label: 'MEN',
      target: { view: 'collection', filter: 'men' },
      isActive: page.view === 'collection' && page.filter === 'men',
    },
    {
      label: 'WOMEN',
      target: { view: 'collection', filter: 'women' },
      isActive: page.view === 'collection' && page.filter === 'women',
    },
    {
      label: 'CUSTOMIZE',
      target: { view: 'customize' },
      isActive: page.view === 'customize',
    },
    {
      label: 'BRAND',
      target: { view: 'brand' },
      isActive: page.view === 'brand',
    },
    {
      label: 'CORPORATE GIFTS',
      target: { view: 'corporate' },
      isActive: page.view === 'corporate',
    },
    {
      label: 'GIFTING',
      target: { view: 'gifting' },
      isActive: page.view === 'gifting',
    },
    {
      label: 'BLACK FRIDAY SALE',
      target: { view: 'collection', filter: 'sale' },
      isSale: true,
      isActive: page.view === 'collection' && page.filter === 'sale',
    },
    {
      label: 'DESIGN YOUR OWN',
      target: { view: 'builder' },
      isActive: page.view === 'builder',
    },
  ];

  const handleNavClick = (target: AppPage) => {
    onNavigate(target);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E5E5E3]">
      {/* Announcement Bar */}
      <div className="bg-black text-white h-9 px-4 flex items-center justify-between text-xs tracking-wide">
        <button
          type="button"
          aria-label="Previous announcement"
          onClick={() =>
            setAnnouncementIdx((prev) => (prev === 0 ? ANNOUNCEMENTS.length - 1 : prev - 1))
          }
          className="p-1 text-white/70 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate(activeAnnouncement.target)}
          className="truncate text-center font-medium hover:underline underline-offset-4 px-2"
        >
          {activeAnnouncement.text}
        </button>

        <button
          type="button"
          aria-label="Next announcement"
          onClick={() => setAnnouncementIdx((prev) => (prev + 1) % ANNOUNCEMENTS.length)}
          className="p-1 text-white/70 hover:text-white transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* Main Header Row */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-16 lg:h-[72px] flex items-center justify-between gap-4">
        {/* Left: Mobile Menu & Search */}
        <div className="flex items-center gap-3 flex-1">
          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="lg:hidden p-2 -ml-2 text-[#1C1C1C] hover:bg-[#F4F4F2] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search catalog"
            className="inline-flex items-center gap-2 text-sm text-[#595959] hover:text-[#1C1C1C] transition-colors py-2 whitespace-nowrap shrink-0"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>

        {/* Center: Iconic Stacked Editorial Wordmark matching thejacketmaker.ae */}
        <button
          type="button"
          onClick={() => handleNavClick({ view: 'home' })}
          aria-label="The Jacket Maker Home"
          className="shrink-0 flex flex-col items-center leading-none group py-1"
        >
          <span className="font-display text-[9px] tracking-[0.26em] font-semibold text-[#1C1C1C] uppercase">
            THE
          </span>
          <span className="font-display text-[17px] sm:text-[19px] tracking-[0.06em] font-bold text-[#1C1C1C] -mt-0.5 uppercase">
            JACKET
          </span>
          <span className="font-display text-[17px] sm:text-[19px] tracking-[0.06em] font-bold text-[#1C1C1C] -mt-1 uppercase">
            MAKER
          </span>
        </button>

        {/* Right: Currency, Account, Cart */}
        <div className="flex items-center justify-end gap-3 sm:gap-5 flex-1">
          {/* Currency Selector */}
          <div className="relative hidden md:block">
            <button
              type="button"
              aria-label="Select currency"
              aria-expanded={currencyOpen}
              onClick={() => setCurrencyOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 text-xs text-[#595959] hover:text-[#1C1C1C] py-2 whitespace-nowrap shrink-0"
            >
              <span>{CURRENCIES[currency].label}</span>
              <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            {currencyOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-1 w-64 bg-white border border-[#E5E5E3] shadow-lg py-1.5 z-50"
              >
                {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                  <button
                    key={code}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onCurrencyChange(code);
                      setCurrencyOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs transition-colors flex items-center justify-between ${
                      currency === code
                        ? 'bg-[#F4F4F2] font-semibold text-[#1C1C1C]'
                        : 'text-[#595959] hover:bg-[#FAF9F7] hover:text-[#1C1C1C]'
                    }`}
                  >
                    <span>{CURRENCIES[code].label}</span>
                    {currency === code && <span className="text-[11px]">Active</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onOpenAccount}
            aria-label="Account and saved items"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#1C1C1C] hover:text-[#595959] transition-colors py-2 whitespace-nowrap shrink-0"
          >
            <span className="hidden sm:inline">Account</span>
            <User className="w-4 h-4" aria-hidden="true" />
            {wishlistCount > 0 && (
              <span className="text-[11px] text-[#595959] tabular-nums">({wishlistCount})</span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Shopping cart with ${cartCount} items`}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#1C1C1C] hover:text-[#595959] transition-colors py-2 whitespace-nowrap shrink-0"
          >
            <span className="hidden sm:inline">Cart</span>
            <span className="relative inline-flex items-center">
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              {cartCount > 0 && (
                <span
                  data-testid="cart-badge"
                  className="ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[11px] font-semibold bg-[#1C1C1C] text-white tabular-nums"
                >
                  {cartCount}
                </span>
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Desktop Primary Navigation Row (matching exact thejacketmaker.ae hierarchy) */}
      <nav
        aria-label="Primary navigation"
        className="hidden lg:block border-t border-[#F0F0EE] bg-white"
      >
        <div className="max-w-[1440px] mx-auto px-8 h-11 flex items-center justify-center gap-7 xl:gap-9">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleNavClick(item.target)}
              className={`relative h-full inline-flex items-center text-[11.5px] font-medium tracking-[0.11em] whitespace-nowrap shrink-0 transition-colors ${
                item.isSale
                  ? 'text-[#C41E24] hover:text-[#99161B] font-semibold'
                  : item.isActive
                    ? 'text-[#1C1C1C]'
                    : 'text-[#4A4A4A] hover:text-[#1C1C1C]'
              }`}
            >
              {item.label}
              {item.isActive && (
                <span
                  aria-hidden="true"
                  className={`absolute bottom-0 left-0 right-0 h-[2px] ${
                    item.isSale ? 'bg-[#C41E24]' : 'bg-[#1C1C1C]'
                  }`}
                />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E5E5E3] bg-white px-5 py-5 space-y-4">
          <nav aria-label="Mobile navigation" className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavClick(item.target)}
                className={`w-full text-left py-2.5 text-xs tracking-[0.12em] font-medium border-b border-[#F2F2F0] ${
                  item.isSale ? 'text-[#C41E24] font-semibold' : 'text-[#1C1C1C]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="pt-2">
            <label htmlFor="mobile-currency" className="block text-xs text-[#595959] mb-1.5">
              Currency & Region
            </label>
            <select
              id="mobile-currency"
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
              className="w-full border border-[#D8D8D5] px-3 py-2.5 text-xs bg-white text-[#1C1C1C]"
            >
              {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                <option key={code} value={code}>
                  {CURRENCIES[code].label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </header>
  );
}
