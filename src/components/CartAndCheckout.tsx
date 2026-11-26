import { useEffect, useState, type FormEvent } from 'react';
import { Check, Minus, Plus, ShieldCheck, ShoppingBag, Tag, Trash2, X } from 'lucide-react';
import type {
  AppPage,
  CartItem,
  CurrencyCode,
  OrderRecord,
  PaymentMethod,
  WorkflowTrack,
} from '../types';
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
  onProceedToCheckout: (preferredPayment?: PaymentMethod) => void;
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

      <div className="relative z-10 w-full max-w-md bg-white dark:bg-[#12171A] h-full flex flex-col shadow-2xl border-l border-transparent dark:border-[#23292D]">
        {/* Top Bar */}
        <div className="px-6 py-4 border-b border-[#E5E5E3] dark:border-[#23292D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#1C1C1C] dark:text-[#F4F3EE]" aria-hidden="true" />
            <h2 className="font-display text-lg font-semibold text-[#1C1C1C] dark:text-[#F4F3EE]">
              Shopping Cart ({summary.itemCount})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close shopping cart"
            className="p-2 text-[#595959] dark:text-[#A8ACAF] hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Free Shipping & Delivered Duty Paid (DDP) Bar */}
        <div className="bg-[#1C1C1C] dark:bg-[#090C0E] text-white px-6 py-2.5 text-[11.5px] tracking-wide text-center border-b border-transparent dark:border-[#23292D]">
          Delivered Duty Paid (DDP) Guaranteed · Free Express Worldwide Shipping
        </div>

        {/* Cart Body */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <ShoppingBag className="w-10 h-10 text-[#BDBDB8] dark:text-[#4C5358] mb-4" aria-hidden="true" />
            <h3 className="font-display text-2xl font-semibold text-[#1C1C1C] dark:text-[#F4F3EE] mb-2">
              Your cart is empty
            </h3>
            <p className="text-sm text-[#595959] dark:text-[#A8ACAF] mb-7 max-w-xs">
              Explore our Black Friday leather outerwear event or craft a bespoke piece from
              scratch.
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigate({ view: 'collection', filter: 'sale' });
              }}
              className="px-8 py-3 bg-[#1C1C1C] dark:bg-[#F4F3EE] text-white dark:text-[#0E1214] text-xs font-semibold tracking-[0.15em] uppercase hover:bg-black dark:hover:bg-white transition-colors"
            >
              Shop Best Sellers
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5 divide-y divide-[#EFEFED] dark:divide-[#23292D]">
              {items.map((item) => (
                <div key={item.lineId} className="py-4 first:pt-0 flex gap-4">
                  <div className="w-20 h-26 bg-[#F1F1EF] dark:bg-[#192024] shrink-0 overflow-hidden">
                    <SafeImage
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-body text-sm font-semibold text-[#1C1C1C] dark:text-[#F4F3EE] leading-snug">
                        {item.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.lineId)}
                        aria-label={`Remove ${item.name}`}
                        className="p-1 text-[#767676] dark:text-[#8A8E91] hover:text-[#C41E24] dark:hover:text-[#E8555A]"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                    <p className="text-xs text-[#595959] dark:text-[#A8ACAF] mt-0.5">
                      {item.color} · {item.size}
                    </p>
                    {item.workflowTrack && (
                      <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#767676] dark:text-[#9FA5A9] mt-1">
                        {item.workflowTrack}
                      </p>
                    )}
                    {item.customSummary && item.customSummary.length > 0 && (
                      <ul className="mt-1.5 space-y-0.5 text-[11px] text-[#767676] dark:text-[#8A8E91]">
                        {item.customSummary.slice(0, 4).map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center border border-[#D8D8D5] dark:border-[#2B3237]">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.lineId, -1)}
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="p-1.5 text-[#1C1C1C] dark:text-[#F4F3EE] hover:bg-[#FAF9F7] dark:hover:bg-[#1A2024]"
                        >
                          <Minus className="w-3 h-3" aria-hidden="true" />
                        </button>
                        <span className="px-3 text-xs font-medium text-[#1C1C1C] dark:text-[#F4F3EE] tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.lineId, 1)}
                          aria-label={`Increase quantity of ${item.name}`}
                          className="p-1.5 text-[#1C1C1C] dark:text-[#F4F3EE] hover:bg-[#FAF9F7] dark:hover:bg-[#1A2024]"
                        >
                          <Plus className="w-3 h-3" aria-hidden="true" />
                        </button>
                      </div>

                      <span className="text-sm font-semibold text-[#1C1C1C] dark:text-[#F4F3EE] tabular-nums">
                        {formatMoney(item.unitPriceAED * item.quantity, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Totals & Promo */}
            <div className="border-t border-[#E5E5E3] dark:border-[#23292D] bg-[#FAF9F7] dark:bg-[#0E1214] px-6 py-5 space-y-4">
              <form onSubmit={handlePromoSubmit} className="space-y-1.5">
                <div className="flex gap-2">
                  <label htmlFor="cart-promo" className="sr-only">
                    Promo Code
                  </label>
                  <div className="relative flex-1">
                    <Tag
                      className="w-3.5 h-3.5 text-[#767676] dark:text-[#8A8E91] absolute left-3 top-1/2 -translate-y-1/2"
                      aria-hidden="true"
                    />
                    <input
                      id="cart-promo"
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo code (try UAE10)"
                      className="w-full bg-white dark:bg-[#171D20] border border-[#D4D4D0] dark:border-[#2B3237] pl-8 pr-3 py-2 text-xs text-[#1C1C1C] dark:text-[#F4F3EE] placeholder:text-[#767676] dark:placeholder:text-[#707579] uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-[#1C1C1C] dark:border-[#F4F3EE] bg-white dark:bg-transparent text-[#1C1C1C] dark:text-[#F4F3EE] hover:bg-[#1C1C1C] dark:hover:bg-[#F4F3EE] hover:text-white dark:hover:text-[#0E1214] text-xs font-semibold tracking-wider uppercase transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoFeedback && (
                  <p
                    className={`text-[11px] font-medium ${
                      promoFeedback.type === 'ok'
                        ? 'text-[#1C1C1C] dark:text-[#F4F3EE]'
                        : 'text-[#C41E24] dark:text-[#E8555A]'
                    }`}
                  >
                    {promoFeedback.msg}
                  </p>
                )}
              </form>

              <div className="space-y-1.5 text-xs tabular-nums">
                <div className="flex justify-between text-[#595959] dark:text-[#A8ACAF]">
                  <span>Subtotal</span>
                  <span>{formatMoney(summary.subtotalAED, currency)}</span>
                </div>
                {summary.discountAED > 0 && (
                  <div className="flex justify-between text-[#C41E24] dark:text-[#E8555A] font-medium">
                    <span>Promo ({promoCode})</span>
                    <span>-{formatMoney(summary.discountAED, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#595959] dark:text-[#A8ACAF]">
                  <span>Express UAE Shipping &amp; Duties</span>
                  <span className="font-medium text-[#1C1C1C] dark:text-[#F4F3EE]">FREE</span>
                </div>
                <div className="pt-2.5 border-t border-[#E5E5E3] dark:border-[#23292D] flex justify-between items-baseline">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#1C1C1C] dark:text-[#F4F3EE]">
                    Total
                  </span>
                  <span
                    data-testid="cart-total"
                    className="font-display text-xl font-semibold text-[#1C1C1C] dark:text-[#F4F3EE]"
                  >
                    {formatMoney(summary.totalAED, currency)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onProceedToCheckout('Card')}
                className="w-full py-3.5 bg-[#1C1C1C] dark:bg-[#F4F3EE] hover:bg-black dark:hover:bg-white text-white dark:text-[#0E1214] text-xs font-semibold tracking-[0.16em] uppercase transition-colors"
              >
                Proceed to Checkout
              </button>

              {/* Express Wallets: Shop Pay, PayPal, Amazon Pay */}
              <div className="space-y-2">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#767676] dark:text-[#8A8E91] text-center">
                  Or Express Checkout
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => onProceedToCheckout('Shop Pay')}
                    aria-label="Express checkout with Shop Pay"
                    className="py-2.5 px-2 bg-[#5A31F4] hover:bg-[#4922DB] text-white text-xs font-bold tracking-tight transition-colors"
                  >
                    Shop Pay
                  </button>
                  <button
                    type="button"
                    onClick={() => onProceedToCheckout('PayPal')}
                    aria-label="Express checkout with PayPal"
                    className="py-2.5 px-2 bg-[#FFC439] hover:bg-[#F2B629] text-[#003087] text-xs font-bold tracking-tight transition-colors"
                  >
                    PayPal
                  </button>
                  <button
                    type="button"
                    onClick={() => onProceedToCheckout('Amazon Pay')}
                    aria-label="Express checkout with Amazon Pay"
                    className="py-2.5 px-2 bg-[#232F3E] hover:bg-[#19232E] text-[#FF9900] text-xs font-bold tracking-tight transition-colors"
                  >
                    Amazon Pay
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-[#767676] dark:text-[#8A8E91] leading-relaxed flex items-start gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#1C1C1C] dark:text-[#F4F3EE]" aria-hidden="true" />
                <span>
                  <strong className="text-[#1C1C1C] dark:text-[#F4F3EE]">Delivered Duty Paid (DDP):</strong>{' '}
                  Your total includes all customs duties and taxes with zero extra fees on delivery.
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
  initialPaymentMethod?: PaymentMethod;
  onClose: () => void;
  onCompleteOrder: (order: OrderRecord) => void;
}

export function CheckoutModal({
  open,
  items,
  currency,
  promoCode,
  initialPaymentMethod = 'Card',
  onClose,
  onCompleteOrder,
}: CheckoutModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+971 ');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Dubai');
  const [country, setCountry] = useState('United Arab Emirates');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initialPaymentMethod);
  const [error, setError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  useEffect(() => {
    if (open) {
      setPaymentMethod(initialPaymentMethod);
    }
  }, [open, initialPaymentMethod]);

  if (!open) return null;

  const summary = calculateCartSummary(items, promoCode);
  const resolvedTrack: WorkflowTrack = items.some(
    (i) => i.workflowTrack === 'Digital Bespoke (10–12 Weeks)'
  )
    ? 'Digital Bespoke (10–12 Weeks)'
    : items.some((i) => i.isMadeToMeasure || i.workflowTrack === 'Made-to-Measure (3–4 Weeks)')
      ? 'Made-to-Measure (3–4 Weeks)'
      : 'Ready-to-Ship Prime';

  const resolvedEta =
    resolvedTrack === 'Digital Bespoke (10–12 Weeks)'
      ? '10–12 Weeks (7-Step Bespoke Pipeline)'
      : resolvedTrack === 'Made-to-Measure (3–4 Weeks)'
        ? '3–4 Weeks (Custom Tailored)'
        : 'Dispatches Next Business Day (Prime)';

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
    const orderNumber = `MRT-AE-${Math.floor(10000 + Math.random() * 89999)}`;
    const record: OrderRecord = {
      orderNumber,
      placedAt: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      status: 'Confirmed',
      paymentMethod,
      workflowTrack: resolvedTrack,
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
      estimatedDelivery: resolvedEta,
    };
    setConfirmedOrder(record);
    onCompleteOrder(record);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setConfirmedOrder(null);
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Checkout"
    >
      <div className="bg-white dark:bg-[#14191C] w-full max-w-2xl border border-[#E5E5E3] dark:border-[#262D31] shadow-2xl overflow-hidden my-auto text-[#1C1C1C] dark:text-[#F4F3EE]">
        <div className="px-6 py-4 border-b border-[#E5E5E3] dark:border-[#262D31] flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-[#1C1C1C] dark:text-[#F4F3EE]">
            {confirmedOrder ? 'Order Confirmed' : 'Secure Duty-Paid Checkout'}
          </h2>
          <button
            type="button"
            onClick={() => {
              setConfirmedOrder(null);
              onClose();
            }}
            aria-label="Close checkout"
            className="p-2 text-[#595959] dark:text-[#A8ACAF] hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {confirmedOrder ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-12 h-12 bg-[#1C1C1C] dark:bg-[#F4F3EE] text-white dark:text-[#0E1214] flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#767676] dark:text-[#8A8E91]">
                Preparing Atelier Shipment
              </p>
              <h3 className="font-display text-3xl font-semibold text-[#1C1C1C] dark:text-[#F4F3EE] mt-1">
                Order #{confirmedOrder.orderNumber} Confirmed
              </h3>
            </div>
            <p className="text-sm text-[#595959] dark:text-[#A8ACAF] max-w-md mx-auto">
              Thank you, <strong className="text-[#1C1C1C] dark:text-[#F4F3EE]">{confirmedOrder.customerName}</strong>.
              A confirmation receipt has been prepared for{' '}
              <span className="text-[#1C1C1C] dark:text-[#F4F3EE]">{confirmedOrder.email}</span>. Estimated UAE arrival:{' '}
              <strong className="text-[#1C1C1C] dark:text-[#F4F3EE]">{confirmedOrder.estimatedDelivery}</strong>.
            </p>

            <div className="bg-[#FAF9F7] dark:bg-[#0E1214] border border-[#E5E5E3] dark:border-[#262D31] p-5 text-left text-xs space-y-2 max-w-md mx-auto tabular-nums">
              <div className="flex justify-between">
                <span className="text-[#595959] dark:text-[#A8ACAF]">Fulfillment Track</span>
                <span className="font-semibold text-[#1C1C1C] dark:text-[#F4F3EE]">
                  {confirmedOrder.workflowTrack || 'Ready-to-Ship Prime'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#595959] dark:text-[#A8ACAF]">Payment Gateway</span>
                <span className="font-semibold text-[#1C1C1C] dark:text-[#F4F3EE]">{confirmedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#595959] dark:text-[#A8ACAF]">Destination</span>
                <span className="font-medium text-[#1C1C1C] dark:text-[#F4F3EE]">
                  {confirmedOrder.city}, {confirmedOrder.country}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E5E5E3] dark:border-[#262D31]">
                <span className="font-semibold text-[#1C1C1C] dark:text-[#F4F3EE]">Total Paid (DDP Included)</span>
                <span className="font-semibold text-[#1C1C1C] dark:text-[#F4F3EE]">
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
              className="px-8 py-3 bg-[#1C1C1C] dark:bg-[#F4F3EE] text-white dark:text-[#0E1214] text-xs font-semibold tracking-[0.16em] uppercase"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="p-6 sm:p-8 space-y-5">
            <div className="bg-[#FAF9F7] dark:bg-[#0E1214] border border-[#E5E5E3] dark:border-[#262D31] p-4 flex items-center justify-between text-xs tabular-nums">
              <span className="text-[#595959] dark:text-[#A8ACAF]">
                {summary.itemCount} {summary.itemCount === 1 ? 'Item' : 'Items'} · Free Express
                Delivery
              </span>
              <span className="font-semibold text-base text-[#1C1C1C] dark:text-[#F4F3EE]">
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
                  className="w-full bg-white dark:bg-[#0E1214] border border-[#D4D4D0] dark:border-[#2B3237] px-3.5 py-2.5 text-sm text-[#1C1C1C] dark:text-[#F4F3EE]"
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
                  className="w-full bg-white dark:bg-[#0E1214] border border-[#D4D4D0] dark:border-[#2B3237] px-3.5 py-2.5 text-sm text-[#1C1C1C] dark:text-[#F4F3EE]"
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
                  className="w-full bg-white dark:bg-[#0E1214] border border-[#D4D4D0] dark:border-[#2B3237] px-3.5 py-2.5 text-sm text-[#1C1C1C] dark:text-[#F4F3EE]"
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
                  className="w-full bg-white dark:bg-[#0E1214] border border-[#D4D4D0] dark:border-[#2B3237] px-3.5 py-2.5 text-sm text-[#1C1C1C] dark:text-[#F4F3EE]"
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
                  className="w-full bg-white dark:bg-[#0E1214] border border-[#D4D4D0] dark:border-[#2B3237] px-3.5 py-2.5 text-sm text-[#1C1C1C] dark:text-[#F4F3EE]"
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
                  className="w-full border border-[#D4D4D0] dark:border-[#2B3237] px-3 py-2.5 text-sm bg-white dark:bg-[#0E1214] text-[#1C1C1C] dark:text-[#F4F3EE]"
                >
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="Qatar">Qatar</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                </select>
              </div>
            </div>

            {/* Payment Options (Shopify Payments + Express Wallets + UAE COD) */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#1C1C1C] dark:text-[#F4F3EE] mb-2">
                Payment Method (DDP Customs &amp; Taxes Included)
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {(
                  [
                    { id: 'Shop Pay', label: 'Shop Pay / Installments' },
                    { id: 'PayPal', label: 'PayPal Express' },
                    { id: 'Amazon Pay', label: 'Amazon Pay' },
                    { id: 'Card', label: 'Credit / Debit Card' },
                    { id: 'Cash on Delivery (UAE)', label: 'Cash on Delivery (UAE)' },
                  ] as const
                ).map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`py-2.5 px-3 border text-xs font-semibold text-left transition-colors ${
                      paymentMethod === method.id
                        ? 'bg-[#1C1C1C] dark:bg-[#F4F3EE] text-white dark:text-[#0E1214] border-[#1C1C1C] dark:border-[#F4F3EE]'
                        : 'bg-white dark:bg-[#0E1214] text-[#1C1C1C] dark:text-[#F4F3EE] border-[#D8D8D5] dark:border-[#2B3237]'
                    }`}
                  >
                    {method.label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p role="alert" className="text-xs text-[#C41E24] dark:text-[#E8555A] font-medium">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-[#1C1C1C] dark:bg-[#F4F3EE] hover:bg-black dark:hover:bg-white text-white dark:text-[#0E1214] text-xs font-semibold tracking-[0.16em] uppercase transition-colors"
            >
              Complete Order · {formatMoney(summary.totalAED, currency)}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
