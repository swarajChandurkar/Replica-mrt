import { useEffect, useRef, useState } from 'react';
import { CartDrawer, CheckoutModal } from './components/CartAndCheckout';
import { CollectionPage } from './components/CollectionPage';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { JacketBuilderPage } from './components/JacketBuilderPage';
import { AccountModal, SearchModal, SizeGuideModal } from './components/Modals';
import { ProductDetailPage } from './components/ProductDetailPage';
import {
  BrandStoryPage,
  CorporateGiftsPage,
  CustomizePage,
  GiftingPage,
  HelpPage,
} from './components/SecondaryPages';
import { PRODUCTS } from './data/catalog';
import type {
  AppPage,
  CartItem,
  CurrencyCode,
  CustomInquiry,
  OrderRecord,
  PaymentMethod,
  Product,
} from './types';
import { calculateCartSummary } from './utils/commerce';

const STORAGE_KEYS = {
  CART: 'mv_ae_cart_v1',
  WISHLIST: 'mv_ae_wishlist_v1',
  ORDERS: 'mv_ae_orders_v1',
  INQUIRIES: 'mv_ae_inquiries_v1',
  CURRENCY: 'mv_ae_currency_v1',
  THEME: 'mv_ae_theme_v1',
} as const;

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [page, setPage] = useState<AppPage>({ view: 'home' });
  const [currency, setCurrency] = useState<CurrencyCode>(() =>
    readStorage<CurrencyCode>(STORAGE_KEYS.CURRENCY, 'AED')
  );
  const [cart, setCart] = useState<CartItem[]>(() => readStorage<CartItem[]>(STORAGE_KEYS.CART, []));
  const [wishlist, setWishlist] = useState<string[]>(() =>
    readStorage<string[]>(STORAGE_KEYS.WISHLIST, [])
  );
  const [orders, setOrders] = useState<OrderRecord[]>(() =>
    readStorage<OrderRecord[]>(STORAGE_KEYS.ORDERS, [])
  );
  const [inquiries, setInquiries] = useState<CustomInquiry[]>(() =>
    readStorage<CustomInquiry[]>(STORAGE_KEYS.INQUIRIES, [])
  );
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    readStorage<'light' | 'dark'>(STORAGE_KEYS.THEME, 'light')
  );
  const [promoCode, setPromoCode] = useState('');

  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutPayment, setCheckoutPayment] = useState<PaymentMethod>('Card');
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const isFirstThemeMount = useRef(true);
  const themeTransitionTimer = useRef<number | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isFirstThemeMount.current && !prefersReducedMotion) {
      root.classList.add('theme-transitioning');
      if (themeTransitionTimer.current !== null) {
        window.clearTimeout(themeTransitionTimer.current);
      }
      themeTransitionTimer.current = window.setTimeout(() => {
        root.classList.remove('theme-transitioning');
        themeTransitionTimer.current = null;
      }, 540);
    }
    isFirstThemeMount.current = false;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      window.localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(theme));
    } catch {
      /* ignore */
    }

    return () => {
      if (themeTransitionTimer.current !== null) {
        window.clearTimeout(themeTransitionTimer.current);
      }
    };
  }, [theme]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch {
      /* ignore storage quota errors */
    }
  }, [cart]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch {
      /* ignore */
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {
      /* ignore */
    }
  }, [orders]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
    } catch {
      /* ignore */
    }
  }, [inquiries]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.CURRENCY, JSON.stringify(currency));
    } catch {
      /* ignore */
    }
  }, [currency]);

  const navigate = (next: AppPage) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const addToCart = (item: Omit<CartItem, 'lineId'>) => {
    setCart((prev) => {
      const existing = prev.find(
        (c) =>
          c.productId === item.productId &&
          c.color === item.color &&
          c.size === item.size &&
          !item.customSummary?.length
      );
      if (existing) {
        return prev.map((c) =>
          c.lineId === existing.lineId ? { ...c, quantity: c.quantity + item.quantity } : c
        );
      }
      const lineId = `${item.productId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      return [{ ...item, lineId }, ...prev];
    });
    setCartOpen(true);
  };

  const handleQuickAdd = (product: Product) => {
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      unitPriceAED: product.priceAED,
      compareAtAED: product.compareAtAED,
      quantity: 1,
      color: product.colors[0]?.name || 'Jet Black',
      size: product.category === 'bags' ? 'One Size (45L)' : product.category === 'shoes' ? 'EU 43' : 'M',
    });
  };

  const updateCartQty = (lineId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.lineId === lineId ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeCartItem = (lineId: string) => {
    setCart((prev) => prev.filter((item) => item.lineId !== lineId));
  };

  const handleSubmitInquiry = (payload: Omit<CustomInquiry, 'id' | 'submittedAt'>): CustomInquiry => {
    const record: CustomInquiry = {
      ...payload,
      id: `BSP-${Math.floor(10000 + Math.random() * 89999)}`,
      submittedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };
    setInquiries((prev) => [record, ...prev]);
    return record;
  };

  const handleCompleteOrder = (order: OrderRecord) => {
    setOrders((prev) => [order, ...prev]);
    setCart([]);
    setPromoCode('');
  };

  const cartSummary = calculateCartSummary(cart, promoCode);

  const activeProduct =
    page.view === 'product'
      ? PRODUCTS.find((p) => p.slug === page.slug) || PRODUCTS[0]
      : null;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0E1214] text-[#1C1C1C] dark:text-[#F4F3EE] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-black dark:focus:bg-[#F4F3EE] focus:text-white dark:focus:text-[#0E1214] focus:px-4 focus:py-2 text-xs"
      >
        Skip to main content
      </a>

      <Header
        page={page}
        onNavigate={navigate}
        currency={currency}
        onCurrencyChange={setCurrency}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        cartCount={cartSummary.itemCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setCartOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenAccount={() => setAccountOpen(true)}
      />

      <main id="main-content" className="flex-1">
        {page.view === 'home' && (
          <HomePage
            theme={theme}
            currency={currency}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            onNavigate={navigate}
            onQuickAdd={handleQuickAdd}
            onSubmitInquiry={handleSubmitInquiry}
          />
        )}

        {page.view === 'collection' && (
          <CollectionPage
            filter={page.filter}
            initialCategory={page.category}
            currency={currency}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            onNavigate={navigate}
            onQuickAdd={handleQuickAdd}
          />
        )}

        {page.view === 'product' && activeProduct && (
          <ProductDetailPage
            key={activeProduct.slug}
            product={activeProduct}
            currency={currency}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            onNavigate={navigate}
            onAddToCart={addToCart}
            onSubmitInquiry={handleSubmitInquiry}
            onOpenSizeGuide={() => setSizeGuideOpen(true)}
          />
        )}

        {page.view === 'builder' && (
          <JacketBuilderPage
            currency={currency}
            prefillName={page.prefillName}
            onAddToCart={addToCart}
          />
        )}

        {page.view === 'customize' && (
          <CustomizePage
            currency={currency}
            onNavigate={navigate}
            onSubmitInquiry={handleSubmitInquiry}
          />
        )}

        {page.view === 'brand' && <BrandStoryPage onNavigate={navigate} />}

        {page.view === 'corporate' && (
          <CorporateGiftsPage currency={currency} onSubmitInquiry={handleSubmitInquiry} />
        )}

        {page.view === 'gifting' && (
          <GiftingPage currency={currency} onAddToCart={addToCart} />
        )}

        {page.view === 'help' && (
          <HelpPage
            key={page.tab || 'track'}
            initialTab={page.tab}
            orders={orders}
            currency={currency}
          />
        )}
      </main>

      <Footer onNavigate={navigate} />

      {/* Overlays & Drawers */}
      <CartDrawer
        open={cartOpen}
        items={cart}
        currency={currency}
        promoCode={promoCode}
        onApplyPromo={setPromoCode}
        onUpdateQty={updateCartQty}
        onRemoveItem={removeCartItem}
        onClose={() => setCartOpen(false)}
        onProceedToCheckout={(preferredPayment) => {
          setCheckoutPayment(preferredPayment || 'Card');
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
        onNavigate={navigate}
      />

      <CheckoutModal
        open={checkoutOpen}
        items={cart}
        currency={currency}
        promoCode={promoCode}
        initialPaymentMethod={checkoutPayment}
        onClose={() => setCheckoutOpen(false)}
        onCompleteOrder={handleCompleteOrder}
      />

      <SearchModal
        open={searchOpen}
        currency={currency}
        onClose={() => setSearchOpen(false)}
        onSelectProduct={(slug) => navigate({ view: 'product', slug })}
        onNavigate={navigate}
      />

      <AccountModal
        open={accountOpen}
        currency={currency}
        wishlist={wishlist}
        orders={orders}
        inquiries={inquiries}
        onClose={() => setAccountOpen(false)}
        onSelectProduct={(slug) => navigate({ view: 'product', slug })}
        onToggleWishlist={toggleWishlist}
      />

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  );
}
