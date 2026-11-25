import { useState, type FormEvent } from 'react';
import { Check } from 'lucide-react';
import type { AppPage } from '../types';

interface FooterProps {
  onNavigate: (page: AppPage) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@') || !trimmed.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-[#FAF9F7] dark:bg-[#111619] border-t border-[#E5E5E3] dark:border-[#23292D] text-[#1C1C1C] dark:text-[#F4F3EE] transition-colors duration-200">
      <div className="max-w-[1360px] mx-auto px-6 sm:px-10 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Shop */}
          <div className="lg:col-span-2">
            <h3 className="font-body text-xs font-semibold tracking-[0.14em] uppercase text-[#1C1C1C] dark:text-[#F4F3EE] mb-4">
              Shop
            </h3>
            <ul className="space-y-2.5 text-sm text-[#595959] dark:text-[#A8ACAF]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'collection', filter: 'men' })}
                  className="hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE] transition-colors"
                >
                  Men&apos;s Outerwear
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'collection', filter: 'women' })}
                  className="hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE] transition-colors"
                >
                  Women&apos;s Outerwear
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'collection', filter: 'shoes' })}
                  className="hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE] transition-colors"
                >
                  Men&apos;s Shoes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'collection', filter: 'bags' })}
                  className="hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE] transition-colors"
                >
                  Bags &amp; Accessories
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'collection', filter: 'suits' })}
                  className="hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE] transition-colors"
                >
                  Tailored Suits
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'collection', filter: 'sale' })}
                  className="text-[#C41E24] dark:text-[#E8555A] font-medium hover:underline"
                >
                  Black Friday Sale
                </button>
              </li>
            </ul>
          </div>

          {/* Bespoke */}
          <div className="lg:col-span-2">
            <h3 className="font-body text-xs font-semibold tracking-[0.14em] uppercase text-[#1C1C1C] dark:text-[#F4F3EE] mb-4">
              Bespoke
            </h3>
            <ul className="space-y-2.5 text-sm text-[#595959] dark:text-[#A8ACAF]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'customize' })}
                  className="hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE] transition-colors"
                >
                  Custom Jackets
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'builder' })}
                  className="hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE] transition-colors"
                >
                  Design Your Own
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'collection', filter: 'bags' })}
                  className="hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE] transition-colors"
                >
                  Custom Bags
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'corporate' })}
                  className="hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE] transition-colors"
                >
                  Corporate Gifts
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'gifting' })}
                  className="hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE] transition-colors"
                >
                  Gift Cards
                </button>
              </li>
            </ul>
          </div>

          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="font-body text-xs font-semibold tracking-[0.14em] uppercase text-[#1C1C1C] dark:text-[#F4F3EE] mb-4">
              Brand
            </h3>
            <ul className="space-y-2.5 text-sm text-[#595959] dark:text-[#A8ACAF]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'brand' })}
                  className="hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE] transition-colors"
                >
                  Our Story
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'brand' })}
                  className="hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE] transition-colors"
                >
                  Press &amp; Mentions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'brand' })}
                  className="hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE] transition-colors"
                >
                  Customer Reviews
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'customize' })}
                  className="hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE] transition-colors"
                >
                  Our Bespoke Process
                </button>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div className="lg:col-span-2">
            <h3 className="font-body text-xs font-semibold tracking-[0.14em] uppercase text-[#1C1C1C] dark:text-[#F4F3EE] mb-4">
              Help
            </h3>
            <ul className="space-y-2.5 text-sm text-[#595959] dark:text-[#A8ACAF]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'help', tab: 'size-guide' })}
                  className="hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE] transition-colors"
                >
                  Size Guide
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'help', tab: 'track' })}
                  className="hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE] transition-colors"
                >
                  Track Order
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'help', tab: 'shipping' })}
                  className="hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE] transition-colors"
                >
                  Delivery Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'help', tab: 'returns' })}
                  className="hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE] transition-colors"
                >
                  Returns &amp; Refunds
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'help', tab: 'contact' })}
                  className="hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE] transition-colors"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-4 lg:col-span-4">
            <h3 className="font-body text-xs font-semibold tracking-[0.14em] uppercase text-[#1C1C1C] dark:text-[#F4F3EE] mb-3">
              Newsletter
            </h3>
            <p className="text-sm text-[#595959] dark:text-[#A8ACAF] leading-relaxed mb-4">
              Sign up for exclusive offers, original atelier stories, early Black Friday access, and
              private UAE releases.
            </p>
            {subscribed ? (
              <div className="border border-[#1C1C1C] dark:border-[#F4F3EE] bg-white dark:bg-[#171D20] p-4 text-sm text-[#1C1C1C] dark:text-[#F4F3EE] flex items-start gap-2.5">
                <Check className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold">Welcome to Maison Valen.</p>
                  <p className="text-xs text-[#595959] dark:text-[#A8ACAF] mt-0.5">
                    Use code <strong className="text-[#1C1C1C] dark:text-[#F4F3EE]">UAE10</strong> at
                    checkout for 10% off your order.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} noValidate className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <label htmlFor="footer-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="footer-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 bg-white dark:bg-[#171D20] border border-[#D4D4D0] dark:border-[#2B3237] px-3.5 py-2.5 text-sm text-[#1C1C1C] dark:text-[#F4F3EE] placeholder:text-[#767676] dark:placeholder:text-[#7F8488] focus:border-[#1C1C1C] dark:focus:border-[#F4F3EE]"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#1C1C1C] dark:bg-[#F4F3EE] text-white dark:text-[#0E1214] text-xs font-semibold tracking-[0.12em] uppercase hover:bg-black dark:hover:bg-white transition-colors whitespace-nowrap shrink-0"
                  >
                    Sign Up
                  </button>
                </div>
                {error && <p className="text-xs text-[#C41E24] dark:text-[#E8555A]">{error}</p>}
              </form>
            )}
            <p className="text-xs text-[#767676] dark:text-[#84888B] mt-4">
              All UAE &amp; GCC orders ship free with customs duties and VAT included.
            </p>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-[#E5E5E3] dark:border-[#23292D] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#767676] dark:text-[#84888B]">
          <p>© 2026 Maison Valen UAE. Handcrafted Full-Grain Leather Outerwear &amp; Goods.</p>
          <div className="flex items-center gap-6">
            <span>Free Express UAE Shipping</span>
            <span aria-hidden="true">·</span>
            <span>60-Day Exchange Guarantee</span>
            <span aria-hidden="true">·</span>
            <span>All Customs Duties Covered</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
