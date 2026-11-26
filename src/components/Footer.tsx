import { useState, type FormEvent } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import type { AppPage } from '../types';

interface FooterProps {
  onNavigate: (page: AppPage) => void;
}

interface FooterLinkItem {
  label: string;
  target: AppPage;
  isSale?: boolean;
}

const FOOTER_SECTIONS: { id: string; title: string; links: FooterLinkItem[] }[] = [
  {
    id: 'shop',
    title: 'Shop',
    links: [
      { label: "Men's Outerwear", target: { view: 'collection', filter: 'men' } },
      { label: "Women's Outerwear", target: { view: 'collection', filter: 'women' } },
      { label: "Men's Shoes", target: { view: 'collection', filter: 'shoes' } },
      { label: 'Bags & Accessories', target: { view: 'collection', filter: 'bags' } },
      { label: 'Tailored Suits', target: { view: 'collection', filter: 'suits' } },
      { label: 'Black Friday Sale', target: { view: 'collection', filter: 'sale' }, isSale: true },
    ],
  },
  {
    id: 'bespoke',
    title: 'Bespoke',
    links: [
      { label: 'Custom Jackets', target: { view: 'customize' } },
      { label: 'Design Your Own', target: { view: 'builder' } },
      { label: 'Custom Bags', target: { view: 'collection', filter: 'bags' } },
      { label: 'Corporate Gifts', target: { view: 'corporate' } },
      { label: 'Gift Cards', target: { view: 'gifting' } },
    ],
  },
  {
    id: 'brand',
    title: 'Brand',
    links: [
      { label: 'Our Story', target: { view: 'brand' } },
      { label: 'Press & Mentions', target: { view: 'brand' } },
      { label: 'Customer Reviews', target: { view: 'brand' } },
      { label: 'Our Bespoke Process', target: { view: 'customize' } },
    ],
  },
  {
    id: 'help',
    title: 'Help',
    links: [
      { label: 'Size Guide', target: { view: 'help', tab: 'size-guide' } },
      { label: 'Track Order', target: { view: 'help', tab: 'track' } },
      { label: 'Delivery Policy', target: { view: 'help', tab: 'shipping' } },
      { label: 'Returns & Refunds', target: { view: 'help', tab: 'returns' } },
      { label: 'Contact Us', target: { view: 'help', tab: 'contact' } },
    ],
  },
];

export function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');
  const [openSection, setOpenSection] = useState<string | null>(null);

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
      <div className="max-w-[1360px] mx-auto px-4 sm:px-10 py-10 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-0 md:gap-10 lg:gap-8">
          {/* Navigation Columns — Collapsible Accordions on Mobile, Open Columns on md+ */}
          {FOOTER_SECTIONS.map((section) => {
            const isOpen = openSection === section.id;
            return (
              <div
                key={section.id}
                className="lg:col-span-2 border-b border-[#E5E5E3] dark:border-[#23292D] md:border-b-0"
              >
                {/* Mobile Accordion Trigger */}
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenSection(isOpen ? null : section.id)}
                  className="md:hidden w-full py-4 flex items-center justify-between text-left font-body text-xs font-semibold tracking-[0.14em] uppercase text-[#1C1C1C] dark:text-[#F4F3EE]"
                >
                  <span>{section.title}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#595959] dark:text-[#A8ACAF] transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {/* Desktop Heading */}
                <h3 className="hidden md:block font-body text-xs font-semibold tracking-[0.14em] uppercase text-[#1C1C1C] dark:text-[#F4F3EE] mb-4">
                  {section.title}
                </h3>

                <ul
                  className={`${
                    isOpen ? 'block pb-4' : 'hidden'
                  } md:block space-y-2.5 text-sm text-[#595959] dark:text-[#A8ACAF]`}
                >
                  {section.links.map((item) => (
                    <li key={item.label}>
                      <button
                        type="button"
                        onClick={() => onNavigate(item.target)}
                        className={
                          item.isSale
                            ? 'text-[#C41E24] dark:text-[#E8555A] font-medium hover:underline py-0.5'
                            : 'hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE] transition-colors py-0.5'
                        }
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          {/* Newsletter */}
          <div className="md:col-span-4 lg:col-span-4 pt-7 md:pt-0">
            <h3 className="font-body text-xs font-semibold tracking-[0.14em] uppercase text-[#1C1C1C] dark:text-[#F4F3EE] mb-2.5 sm:mb-3">
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
                  <p className="font-semibold">Welcome to mrtinternationalholdings.</p>
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
                    className="flex-1 bg-white dark:bg-[#171D20] border border-[#D4D4D0] dark:border-[#2B3237] px-3.5 py-3 sm:py-2.5 text-sm text-[#1C1C1C] dark:text-[#F4F3EE] placeholder:text-[#767676] dark:placeholder:text-[#7F8488] focus:border-[#1C1C1C] dark:focus:border-[#F4F3EE]"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 sm:py-2.5 bg-[#1C1C1C] dark:bg-[#F4F3EE] text-white dark:text-[#0E1214] text-xs font-semibold tracking-[0.12em] uppercase hover:bg-black dark:hover:bg-white transition-colors whitespace-nowrap shrink-0"
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

        <div className="mt-10 sm:mt-14 pt-6 border-t border-[#E5E5E3] dark:border-[#23292D] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-[#767676] dark:text-[#84888B] text-center sm:text-left">
          <p>© 2026 mrtinternationalholdings. Handcrafted Full-Grain Leather Outerwear &amp; Goods.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:gap-6">
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
