import { Heart, Star } from 'lucide-react';
import type { CurrencyCode, Product } from '../types';
import { formatMoney } from '../utils/commerce';
import { SafeImage } from './SafeImage';

interface ProductCardProps {
  product: Product;
  currency: CurrencyCode;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onSelectProduct: (slug: string) => void;
  onQuickAdd: (product: Product) => void;
}

export function ProductCard({
  product,
  currency,
  isWishlisted,
  onToggleWishlist,
  onSelectProduct,
  onQuickAdd,
}: ProductCardProps) {
  return (
    <article className="group flex flex-col bg-white transition-transform duration-200 hover:-translate-y-0.5">
      {/* Studio Image Surface */}
      <div className="relative aspect-[3/4] bg-[#F1F1EF] overflow-hidden">
        <button
          type="button"
          onClick={() => onSelectProduct(product.slug)}
          aria-label={`View ${product.name}`}
          className="block w-full h-full text-left"
        >
          <SafeImage
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </button>

        {/* Wishlist Heart */}
        <button
          type="button"
          onClick={() => onToggleWishlist(product.id)}
          aria-label={
            isWishlisted
              ? `Remove ${product.name} from wishlist`
              : `Save ${product.name} to wishlist`
          }
          aria-pressed={isWishlisted}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 hover:bg-white flex items-center justify-center text-[#1C1C1C] transition-colors"
        >
          <Heart
            className={`w-4 h-4 ${isWishlisted ? 'fill-[#C41E24] text-[#C41E24]' : 'text-[#1C1C1C]'}`}
            aria-hidden="true"
          />
        </button>

        {/* Subtle Hover Quick-Add Bar */}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 focus-within:translate-y-0 focus-within:opacity-100 transition-all duration-200">
          <button
            type="button"
            onClick={() => onQuickAdd(product)}
            className="w-full py-2.5 bg-[#1C1C1C]/95 hover:bg-black text-white text-[11px] font-semibold tracking-[0.12em] uppercase transition-colors"
          >
            Quick Add · Size M
          </button>
        </div>
      </div>

      {/* Clean Unboxed Metadata */}
      <div className="pt-3.5 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-[11.5px] text-[#595959] mb-1">
          <span>{product.categoryLabel}</span>
          {product.primeDelivery && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-[#1C1C1C] font-medium">Prime Delivery</span>
            </>
          )}
          {product.discountPercent && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-[#C41E24] font-semibold">{product.discountPercent}% off</span>
            </>
          )}
        </div>

        <h3 className="font-body text-[15px] font-semibold text-[#1C1C1C] leading-snug mb-1.5">
          <button
            type="button"
            onClick={() => onSelectProduct(product.slug)}
            className="text-left hover:underline underline-offset-4"
          >
            {product.name}
          </button>
        </h3>

        {/* Rating Row */}
        <div className="flex items-center gap-1.5 text-xs text-[#595959] mb-2 tabular-nums">
          <Star className="w-3.5 h-3.5 fill-[#C89B3C] text-[#C89B3C]" aria-hidden="true" />
          <span className="font-medium text-[#1C1C1C]">{product.rating.toFixed(1)}</span>
          <span aria-hidden="true">·</span>
          <span>{product.reviewCount} Reviews</span>
        </div>

        {/* Swatches + Price Baseline */}
        <div className="mt-auto pt-1 flex items-end justify-between gap-2">
          <div className="flex items-baseline gap-2 tabular-nums">
            <span className="text-[15px] font-semibold text-[#1C1C1C]">
              {formatMoney(product.priceAED, currency)}
            </span>
            {product.compareAtAED && (
              <span className="text-xs text-[#767676] line-through">
                {formatMoney(product.compareAtAED, currency)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1" aria-label={`Available in ${product.colors.length} colors`}>
            {product.colors.slice(0, 3).map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="w-3 h-3 rounded-full border border-black/15 shrink-0"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
