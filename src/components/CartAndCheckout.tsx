import { useState, type FormEvent } from 'react';
import { Check, Minus, Plus, ShieldCheck, ShoppingBag, Tag, Trash2, X } from 'lucide-react';
import type { AppPage, CartItem, CurrencyCode, OrderRecord } from '../types';
import { calculateCartSummary, formatMoney, validatePromoCode } from '../utils/commerce';
import { SafeImage } from './SafeImage';

interface CartDrawerProps {
  open: boolean;
  items: CartItem[];
  currency: CurrencyCode;
  promoCode: string;
  onApplyPromo: (code: string) => void;
  onUpdateQty: (lineId: string, delta: number) => void;
  onRemoveItem: (lineId: string) => void;
  onClose: () => void;
  onProceedToCheckout: () => void;
  onNavigate: (page: AppPage) => void;
}

export function CartDrawer({
  open,
  items,
  currency,
  promoCode,
  onApplyPromo,
  onUpdateQty,
  onRemoveItem,
  onClose,
  onProceedToCheckout,
  onNavigate,
}: CartDrawerProps) {
  const [promoInput, setPromoInput] = useState(promoCode);
  const [promoFeedback, setPromoFeedback] = useState<{ type: 'ok' | 'err'; msg: string } | null>(
    null
  );

  if (!open) return null;

  const summary = calculateCartSummary(items, promoCode);

  const handlePromoSubmit = (e: FormEvent) => {
    e.preventDefault();
    const res = validatePromoCode(promoInput);
    if (!res.valid) {
      setPromoFeedback({ type: 'err', msg: res.error || 'Invalid promo code.' });
      return;
    }
    onApplyPromo(res.code);
    setPromoFeedback({ type: 'ok', msg: `${res.code} applied — ${res.label}.` });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Shopping Cart">
      <div
        className="fixed inset-0 bg-black/45 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md bg-white h-full flex flex-col shadow-2xl">
        {/* Top Bar */}
        <div className="px-6 py-4 border-b border-[#E5E5E3] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#1C1C1C]" aria-hidden="true" />
            <h2 className="font-display text-lg font-semibold text-[#1C1C1C]">
              Shopping Cart ({summary.itemCount})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close shopping cart"
            className="p-2 text-[#595959] hover:text-[#1C1C1C]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Free Shipping Assurance Bar */}
        <div className="bg-[#1C1C1C] text-white px-6 py-2.5 text-[11.5px] tracking-wide text-center">
          Free Express UAE Shipping · All Customs Duties &amp; Taxes Included
        </div>

        {/* Cart Body */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <ShoppingBag className="w-10 h-10 text-[#BDBDB8] mb-4" aria-hidden="true" />
            <h3 className="font-display text-2xl font-semibold text-[#1C1C1C] mb-2">
              Your cart is empty
            </h3>
            <p className="text-sm text-[#595959] mb-7 max-w-xs">
              Explore our Black Friday leather outerwear event or craft a bespoke piece from
              scratch.
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigate({ view: 'collection', filter: 'sale' });
              }}
              className="px-8 py-3 bg-[#1C1C1C] text-white text-xs font-semibold tracking-[0.15em] uppercase hover:bg-black transition-colors"
            >
              Shop Best Sellers
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5 divide-y divide-[#EFEFED]">
              {items.map((item) => (
                <div key={item.lineId} className="py-4 first:pt-0 flex gap-4">
                  <div className="w-20 h-26 bg-[#F1F1EF] shrink-0 overflow-hidden">
                    <SafeImage
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-body text-sm font-semibold text-[#1C1C1C] leading-snug">
                        {item.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.lineId)}
                        aria-label={`Remove ${item.name}`}
                        className="p-1 text-[#767676] hover:text-[#C41E24]"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                    <p className="text-xs text-[#595959] mt-0.5">
                      {item.color} · {item.size}
                    </p>
                    {item.customSummary && item.customSummary.length > 0 && (
                      <ul className="mt-1.5 space-y-0.5 text-[11px] text-[#767676]">
                        {item.customSummary.slice(0, 3).map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center border border-[#D8D8D5]">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.lineId, -1)}
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="p-1.5 text-[#1C1C1C] hover:bg-[#FAF9F7]"
                        >
                          <Minus className="w-3 h-3" aria-hidden="true" />
                        </button>
                        <span className="px-3 text-xs font-medium tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.lineId, 1)}
                          aria-label={`Increase quantity of ${item.name}`}
                          className="p-1.5 text-[#1C1C1C] hover:bg-[#FAF9F7]"
                        >
                          <Plus className="w-3 h-3" aria-hidden="true" />
                        </button>
                      </div>

                      <span className="text-sm font-semibold text-[#1C1C1C] tabular-nums">
                        {formatMoney(item.unitPriceAED * item.quantity, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Totals & Promo */}
            <div className="border-t border-[#E5E5E3] bg-[#FAF9F7] px-6 py-5 space-y-4">
              <form onSubmit={handlePromoSubmit} className="space-y-1.5">
                <div className="flex gap-2">
                  <label htmlFor="cart-promo" className="sr-only">
                    Promo Code
                  </label>
                  <div className="relative flex-1">
                    <Tag
                      className="w-3.5 h-3.5 text-[#767676] absolute left-3 top-1/2 -translate-y-1/2"
                      aria-hidden="true"
                    />
                    <input
                      id="cart-promo"
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo code (try UAE10)"
                      className="w-full bg-white border border-[#D4D4D0] pl-8 pr-3 py-2 text-xs uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-[#1C1C1C] bg-white hover:bg-[#1C1C1C] hover:text-white text-xs font-semibold tracking-wider uppercase transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoFeedback && (
                  <p
                    className={`text-[11px] font-medium ${
                      promoFeedback.type === 'ok' ? 'text-[#1C1C1C]' : 'text-[#C41E24]'
                    }`}
                  >
                    {promoFeedback.msg}
                  </p>
                )}
              </form>

              <div className="space-y-1.5 text-xs tabular-nums">
                <div className="flex justify-between text-[#595959]">
                  <span>Subtotal</span>
                  <span>{formatMoney(summary.subtotalAED, currency)}</span>
                </div>
                {summary.discountAED > 0 && (
                  <div className="flex justify-between text-[#C41E24] font-medium">
                    <span>Promo ({promoCode})</span>
                    <span>-{formatMoney(summary.discountAED, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#595959]">
                  <span>Express UAE Shipping &amp; Duties</span>
                  <span className="font-medium text-[#1C1C1C]">FREE</span>
                </div>
                <div className="pt-2.5 border-t border-[#E5E5E3] flex justify-between items-baseline">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#1C1C1C]">
                    Total
                  </span>
                  <span
                    data-testid="cart-total"
                    className="font-display text-xl font-semibold text-[#1C1C1C]"
                  >
                    {formatMoney(summary.totalAED, currency)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onProceedToCheckout}
                className="w-full py-3.5 bg-[#1C1C1C] hover:bg-black text-white text-xs font-semibold tracking-[0.16em] uppercase transition-colors"
              >
                Proceed to Checkout
              </button>

              <p className="text-[11px] text-[#767676] leading-relaxed flex items-start gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#1C1C1C]" aria-hidden="true" />
                <span>
                  Your total payment covers all customs duties and taxes. You won&apos;t encounter
                  any extra charges upon delivery, guaranteed.
                </span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* CHECKOUT MODAL WITH UAE COD & CARD + RECEIPT                               */
/* -------------------------------------------------------------------------- */

interface CheckoutModalProps {
  open: boolean;
  items: CartItem[];
  currency: CurrencyCode;
  promoCode: string;
  onClose: () => void;
  onCompleteOrder: (order: OrderRecord) => void;
}

export function CheckoutModal({
  open,
  items,
  currency,
  promoCode,
  onClose,
  onCompleteOrder,
}: CheckoutModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+971 ');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Dubai');
  const [country, setCountry] = useState('United Arab Emirates');
  const [paymentMethod, setPaymentMethod] = useState<'Card' | 'Cash on Delivery (UAE)'>('Card');
  const [error, setError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  if (!open) return null;

  const summary = calculateCartSummary(items, promoCode);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (
      !customerName.trim() ||
      !email.trim() ||
      !email.includes('@') ||
      phone.trim().length < 7 ||
      !address.trim()
    ) {
      setError('Please complete your full name, valid email, phone number, and delivery address.');
      return;
    }
    setError('');
    const orderNumber = `TJM-AE-${Math.floor(10000 + Math.random() * 89999)}`;
    const record: OrderRecord = {
      orderNumber,
      placedAt: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      status: 'Confirmed',
      paymentMethod,
      customerName: customerName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: city.trim() || 'Dubai',
      country,
      items: [...items],
      subtotalAED: summary.subtotalAED,
      discountAED: summary.discountAED,
      promoCode: promoCode || undefined,
      totalAED: summary.totalAED,
      estimatedDelivery: 'Nov 30 – Dec 03, 2026',
    };
    setConfirmedOrder(record);
    onCompleteOrder(record);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Checkout"
    >
      <div className="bg-white w-full max-w-2xl border border-[#E5E5E3] shadow-2xl overflow-hidden my-auto">
        <div className="px-6 py-4 border-b border-[#E5E5E3] flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-[#1C1C1C]">
            {confirmedOrder ? 'Order Confirmed' : 'Secure Duty-Paid Checkout'}
          </h2>
          <button
            type="button"
            onClick={() => {
              setConfirmedOrder(null);
              onClose();
            }}
            aria-label="Close checkout"
            className="p-2 text-[#595959] hover:text-[#1C1C1C]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {confirmedOrder ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-12 h-12 bg-[#1C1C1C] text-white flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#767676]">
                Preparing Atelier Shipment
              </p>
              <h3 className="font-display text-3xl font-semibold text-[#1C1C1C] mt-1">
                Order #{confirmedOrder.orderNumber} Confirmed
              </h3>
            </div>
            <p className="text-sm text-[#595959] max-w-md mx-auto">
              Thank you, <strong className="text-[#1C1C1C]">{confirmedOrder.customerName}</strong>.
              A confirmation receipt has been prepared for{' '}
              <span className="text-[#1C1C1C]">{confirmedOrder.email}</span>. Estimated UAE arrival:{' '}
              <strong className="text-[#1C1C1C]">{confirmedOrder.estimatedDelivery}</strong>.
            </p>

            <div className="bg-[#FAF9F7] border border-[#E5E5E3] p-5 text-left text-xs space-y-2 max-w-md mx-auto tabular-nums">
              <div className="flex justify-between">
                <span className="text-[#595959]">Payment Method</span>
                <span className="font-semibold text-[#1C1C1C]">{confirmedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#595959]">Destination</span>
                <span className="font-medium text-[#1C1C1C]">
                  {confirmedOrder.city}, {confirmedOrder.country}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E5E5E3]">
                <span className="font-semibold text-[#1C1C1C]">Total Paid (Duties Included)</span>
                <span className="font-semibold text-[#1C1C1C]">
                  {formatMoney(confirmedOrder.totalAED, currency)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setConfirmedOrder(null);
                onClose();
              }}
              className="px-8 py-3 bg-[#1C1C1C] text-white text-xs font-semibold tracking-[0.16em] uppercase"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="p-6 sm:p-8 space-y-5">
            <div className="bg-[#FAF9F7] border border-[#E5E5E3] p-4 flex items-center justify-between text-xs tabular-nums">
              <span className="text-[#595959]">
                {summary.itemCount} {summary.itemCount === 1 ? 'Item' : 'Items'} · Free Express
                Delivery
              </span>
              <span className="font-semibold text-base text-[#1C1C1C]">
                {formatMoney(summary.totalAED, currency)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="chk-name" className="block text-xs font-medium mb-1">
                  Full Name*
                </label>
                <input
                  id="chk-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Omar Al Suwaidi"
                  className="w-full border border-[#D4D4D0] px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label htmlFor="chk-email" className="block text-xs font-medium mb-1">
                  Email*
                </label>
                <input
                  id="chk-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="omar@example.ae"
                  className="w-full border border-[#D4D4D0] px-3.5 py-2.5 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="chk-phone" className="block text-xs font-medium mb-1">
                  Phone Number*
                </label>
                <input
                  id="chk-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+971 50 123 4567"
                  className="w-full border border-[#D4D4D0] px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label htmlFor="chk-city" className="block text-xs font-medium mb-1">
                  Emirate / City*
                </label>
                <input
                  id="chk-city"
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Dubai"
                  className="w-full border border-[#D4D4D0] px-3.5 py-2.5 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="chk-addr" className="block text-xs font-medium mb-1">
                  Street Address / Villa / Building*
                </label>
                <input
                  id="chk-addr"
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Downtown Dubai, Blvd Plaza Tower 1"
                  className="w-full border border-[#D4D4D0] px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label htmlFor="chk-country" className="block text-xs font-medium mb-1">
                  Country
                </label>
                <select
                  id="chk-country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full border border-[#D4D4D0] px-3 py-2.5 text-sm bg-white"
                >
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="Qatar">Qatar</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                </select>
              </div>
            </div>

            {/* Payment Options */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#1C1C1C] mb-2">
                Payment Method
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(['Card', 'Cash on Delivery (UAE)'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-3 px-4 border text-xs font-semibold text-left transition-colors ${
                      paymentMethod === method
                        ? 'bg-[#1C1C1C] text-white border-[#1C1C1C]'
                        : 'bg-white text-[#1C1C1C] border-[#D8D8D5]'
                    }`}
                  >
                    {method === 'Card' ? 'Credit / Debit Card / Apple Pay' : 'Cash on Delivery (UAE)'}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p role="alert" className="text-xs text-[#C41E24] font-medium">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-[#1C1C1C] hover:bg-black text-white text-xs font-semibold tracking-[0.16em] uppercase transition-colors"
            >
              Complete Order · {formatMoney(summary.totalAED, currency)}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
