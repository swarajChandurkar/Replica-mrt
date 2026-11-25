import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  Moon,
  Search,
  ShoppingBag,
  Sun,
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
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
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
  theme,
  onToggleTheme,
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
    <header className="sticky top-0 z-40 bg-white dark:bg-[#0E1214] border-b border-[#E5E5E3] dark:border-[#23292D] transition-colors duration-200">
      {/* Announcement Bar */}
      <div className="bg-[#0B0D0E] dark:bg-[#07090A] text-white h-9 px-4 flex items-center justify-between text-xs tracking-wide border-b border-transparent dark:border-[#1E2428]">
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
            className="lg:hidden p-2 -ml-2 text-[#1C1C1C] dark:text-[#F4F3EE] hover:bg-[#F4F4F2] dark:hover:bg-[#191F23] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search catalog"
            className="inline-flex items-center gap-2 text-sm text-[#595959] dark:text-[#B0B3B5] hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE] transition-colors py-2 whitespace-nowrap shrink-0"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>

        {/* Center: Iconic Stacked Editorial Didone Wordmark — Maison Valen */}
        <button
          type="button"
          onClick={() => handleNavClick({ view: 'home' })}
          aria-label="Maison Valen Home"
          className="shrink-0 flex flex-col items-center leading-none group py-1"
        >
          <span className="font-display text-[9.5px] tracking-[0.34em] font-medium text-[#595959] dark:text-[#B0B3B5] uppercase">
            MAISON
          </span>
          <span className="font-display text-[22px] sm:text-[26px] tracking-[0.14em] font-bold text-[#141414] dark:text-[#F4F3EE] mt-0.5 uppercase">
            VALEN
          </span>
        </button>

        {/* Right: Currency, Theme Toggle, Account, Cart */}
        <div className="flex items-center justify-end gap-2.5 sm:gap-4 flex-1">
          {/* Currency Selector */}
          <div className="relative hidden md:block">
            <button
              type="button"
              aria-label="Select currency"
              aria-expanded={currencyOpen}
              onClick={() => setCurrencyOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 text-xs text-[#595959] dark:text-[#B0B3B5] hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE] py-2 whitespace-nowrap shrink-0"
            >
              <span>{CURRENCIES[currency].label}</span>
              <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            {currencyOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-1 w-64 bg-white dark:bg-[#151A1D] border border-[#E5E5E3] dark:border-[#262D31] shadow-lg py-1.5 z-50"
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
                        ? 'bg-[#F4F4F2] dark:bg-[#1F262A] font-semibold text-[#1C1C1C] dark:text-[#F4F3EE]'
                        : 'text-[#595959] dark:text-[#B0B3B5] hover:bg-[#FAF9F7] dark:hover:bg-[#1A2024] hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE]'
                    }`}
                  >
                    <span>{CURRENCIES[code].label}</span>
                    {currency === code && <span className="text-[11px]">Active</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 text-[#1C1C1C] dark:text-[#F4F3EE] hover:bg-[#F4F4F2] dark:hover:bg-[#191F23] transition-colors shrink-0"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Moon className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={onOpenAccount}
            aria-label="Account and saved items"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#1C1C1C] dark:text-[#F4F3EE] hover:text-[#595959] dark:hover:text-[#B0B3B5] transition-colors py-2 whitespace-nowrap shrink-0"
          >
            <span className="hidden sm:inline">Account</span>
            <User className="w-4 h-4" aria-hidden="true" />
            {wishlistCount > 0 && (
              <span className="text-[11px] text-[#595959] dark:text-[#B0B3B5] tabular-nums">
                ({wishlistCount})
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Shopping cart with ${cartCount} items`}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#1C1C1C] dark:text-[#F4F3EE] hover:text-[#595959] dark:hover:text-[#B0B3B5] transition-colors py-2 whitespace-nowrap shrink-0"
          >
            <span className="hidden sm:inline">Cart</span>
            <span className="relative inline-flex items-center">
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              {cartCount > 0 && (
                <span
                  data-testid="cart-badge"
                  className="ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[11px] font-semibold bg-[#1C1C1C] dark:bg-[#F4F3EE] text-white dark:text-[#0E1214] tabular-nums"
                >
                  {cartCount}
                </span>
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Desktop Primary Navigation Row */}
      <nav
        aria-label="Primary navigation"
        className="hidden lg:block border-t border-[#F0F0EE] dark:border-[#1E2428] bg-white dark:bg-[#0E1214] transition-colors duration-200"
      >
        <div className="max-w-[1440px] mx-auto px-8 h-11 flex items-center justify-center gap-7 xl:gap-9">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleNavClick(item.target)}
              className={`relative h-full inline-flex items-center text-[11.5px] font-medium tracking-[0.13em] whitespace-nowrap shrink-0 transition-colors ${
                item.isSale
                  ? 'text-[#C41E24] dark:text-[#E8555A] hover:text-[#99161B] dark:hover:text-[#F07175] font-semibold'
                  : item.isActive
                    ? 'text-[#1C1C1C] dark:text-[#F4F3EE]'
                    : 'text-[#4A4A4A] dark:text-[#A8ACAF] hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE]'
              }`}
            >
              {item.label}
              {item.isActive && (
                <span
                  aria-hidden="true"
                  className={`absolute bottom-0 left-0 right-0 h-[2px] ${
                    item.isSale ? 'bg-[#C41E24] dark:bg-[#E8555A]' : 'bg-[#1C1C1C] dark:bg-[#F4F3EE]'
                  }`}
                />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E5E5E3] dark:border-[#23292D] bg-white dark:bg-[#12171A] px-5 py-5 space-y-4">
          <nav aria-label="Mobile navigation" className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavClick(item.target)}
                className={`w-full text-left py-2.5 text-xs tracking-[0.13em] font-medium border-b border-[#F2F2F0] dark:border-[#1E2428] ${
                  item.isSale
                    ? 'text-[#C41E24] dark:text-[#E8555A] font-semibold'
                    : 'text-[#1C1C1C] dark:text-[#F4F3EE]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="pt-2 space-y-3">
            <div>
              <label
                htmlFor="mobile-currency"
                className="block text-xs text-[#595959] dark:text-[#A8ACAF] mb-1.5"
              >
                Currency &amp; Region
              </label>
              <select
                id="mobile-currency"
                value={currency}
                onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
                className="w-full border border-[#D8D8D5] dark:border-[#2B3237] px-3 py-2.5 text-xs bg-white dark:bg-[#171D20] text-[#1C1C1C] dark:text-[#F4F3EE]"
              >
                {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                  <option key={code} value={code}>
                    {CURRENCIES[code].label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
