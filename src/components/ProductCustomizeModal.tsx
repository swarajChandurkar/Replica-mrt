import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Check, ImagePlus, Sparkles, Trash2, X } from 'lucide-react';
import type { CartItem, CurrencyCode, CustomInquiry, Product } from '../types';
import { formatMoney, usdToAED } from '../utils/commerce';

interface ProductCustomizeModalProps {
  open: boolean;
  product: Product;
  currency: CurrencyCode;
  selectedSize: string;
  onClose: () => void;
  onAddCustomizedToCart: (item: Omit<CartItem, 'lineId'>) => void;
  onSubmitModificationQuote: (inquiry: Omit<CustomInquiry, 'id' | 'submittedAt'>) => CustomInquiry;
  onOpenFullBuilder: () => void;
}

const HIDE_SWAPS = [
  { id: 'original', label: 'Keep Original Hide', deltaAED: 0 },
  { id: 'sheepskin', label: 'Full-Grain Sheepskin', deltaAED: 0 },
  { id: 'cowhide', label: 'Heavyweight Cowhide', deltaAED: usdToAED(50) },
  { id: 'goatskin', label: 'Pebbled Goatskin', deltaAED: usdToAED(50) },
  { id: 'suede', label: 'Velvet-Nap Goat Suede', deltaAED: usdToAED(50) },
  { id: 'calf-hide', label: 'Luxury Dress Calf Hide', deltaAED: usdToAED(150) },
] as const;

const HARDWARE_SWAPS = [
  { id: 'original', label: 'Keep Original Hardware', deltaAED: 0 },
  { id: 'Silver', label: 'Brushed Silver YKK', deltaAED: 0 },
  { id: 'Antique Brass', label: 'Antique Brass YKK', deltaAED: 0 },
  { id: 'Gunmetal', label: 'Gunmetal YKK', deltaAED: 0 },
  { id: 'Matte Black', label: 'Matte Black YKK', deltaAED: usdToAED(20) },
  { id: 'Brushed Gold', label: 'Brushed Gold YKK', deltaAED: 0 },
] as const;

const LINING_SWAPS = [
  { id: 'original', label: 'Keep Original Lining', deltaAED: 0 },
  { id: 'Quilted Polyester', label: 'Quilted Polyester', deltaAED: 0 },
  { id: 'Breathable Cotton', label: 'Breathable Cotton', deltaAED: usdToAED(50) },
  { id: 'Custom Printed Silk-Touch', label: 'Custom Printed Silk-Touch', deltaAED: usdToAED(100) },
  { id: 'Shearling Faux Fur', label: 'Shearling Faux Fur', deltaAED: usdToAED(150) },
] as const;

const ARTWORK_ZONES = [
  { id: 'left-chest', label: 'Left Chest', deltaAED: usdToAED(50) },
  { id: 'right-chest', label: 'Right Chest', deltaAED: usdToAED(50) },
  { id: 'back', label: 'Full Back', deltaAED: usdToAED(100) },
  { id: 'left-sleeve', label: 'Left Sleeve', deltaAED: usdToAED(50) },
  { id: 'right-sleeve', label: 'Right Sleeve', deltaAED: usdToAED(50) },
  { id: 'inner-pocket', label: 'Inner Pocket / Collar', deltaAED: usdToAED(50) },
] as const;

type ZoneId = (typeof ARTWORK_ZONES)[number]['id'];

interface ZoneUpload {
  fileName: string;
  previewUrl?: string;
}

export function ProductCustomizeModal({
  open,
  product,
  currency,
  selectedSize,
  onClose,
  onAddCustomizedToCart,
  onSubmitModificationQuote,
  onOpenFullBuilder,
}: ProductCustomizeModalProps) {
  const [hideSwap, setHideSwap] = useState<string>('original');
  const [colorSwap, setColorSwap] = useState<string>(product.colors[0]?.name || 'Jet Black');
  const [useCustomPantone, setUseCustomPantone] = useState(false);
  const [pantoneCode, setPantoneCode] = useState('');
  const [hardwareSwap, setHardwareSwap] = useState<string>('original');
  const [liningSwap, setLiningSwap] = useState<string>('original');
  const [zoneUploads, setZoneUploads] = useState<Partial<Record<ZoneId, ZoneUpload>>>({});
  const [notes, setNotes] = useState('');
  const [quoteEmail, setQuoteEmail] = useState('');
  const [quoteSent, setQuoteSent] = useState<CustomInquiry | null>(null);
  const [quoteError, setQuoteError] = useState('');

  if (!open) return null;

  const hideDelta = HIDE_SWAPS.find((h) => h.id === hideSwap)?.deltaAED || 0;
  const hwDelta = HARDWARE_SWAPS.find((h) => h.id === hardwareSwap)?.deltaAED || 0;
  const liningDelta = LINING_SWAPS.find((l) => l.id === liningSwap)?.deltaAED || 0;
  const pantoneDelta = useCustomPantone ? usdToAED(100) : 0;

  let artworkDelta = 0;
  const activeZones = ARTWORK_ZONES.filter((z) => Boolean(zoneUploads[z.id]));
  for (const z of activeZones) {
    artworkDelta += z.deltaAED;
  }

  const totalDeltaAED = hideDelta + hwDelta + liningDelta + pantoneDelta + artworkDelta;
  const finalPriceAED = Math.round((product.priceAED + totalDeltaAED) * 100) / 100;

  const handleZoneFile = (zoneId: ZoneId, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImage = file.type.startsWith('image/');
    if (isImage) {
      const reader = new FileReader();
      reader.onload = () => {
        setZoneUploads((prev) => ({
          ...prev,
          [zoneId]: {
            fileName: file.name,
            previewUrl: typeof reader.result === 'string' ? reader.result : undefined,
          },
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setZoneUploads((prev) => ({
        ...prev,
        [zoneId]: { fileName: file.name },
      }));
    }
  };

  const removeZoneFile = (zoneId: ZoneId) => {
    setZoneUploads((prev) => {
      const next = { ...prev };
      delete next[zoneId];
      return next;
    });
  };

  const buildSummaryLines = (): string[] => {
    const lines: string[] = [];
    if (hideSwap !== 'original') {
      const h = HIDE_SWAPS.find((x) => x.id === hideSwap);
      lines.push(`Hide Swap: ${h?.label}`);
    }
    if (useCustomPantone) {
      lines.push(`Custom Pantone: ${pantoneCode.trim() || 'Consultant Match'}`);
    } else if (colorSwap !== (product.colors[0]?.name || '')) {
      lines.push(`Color Swap: ${colorSwap}`);
    }
    if (hardwareSwap !== 'original') {
      lines.push(`Hardware: ${hardwareSwap}`);
    }
    if (liningSwap !== 'original') {
      lines.push(`Lining: ${liningSwap}`);
    }
    for (const z of activeZones) {
      lines.push(`Artwork (${z.label}): ${zoneUploads[z.id]?.fileName}`);
    }
    if (notes.trim()) {
      lines.push(`Notes: ${notes.trim()}`);
    }
    if (lines.length === 0) {
      lines.push('Custom atelier modification requested');
    }
    return lines;
  };

  const handleAddModified = () => {
    onAddCustomizedToCart({
      productId: `${product.id}-custom-${Date.now()}`,
      slug: product.slug,
      name: `${product.name} (Modified)`,
      image: product.image,
      unitPriceAED: finalPriceAED,
      quantity: 1,
      color: useCustomPantone ? `Pantone ${pantoneCode.trim() || 'Custom'}` : colorSwap,
      size: selectedSize,
      workflowTrack: 'Digital Bespoke (10–12 Weeks)',
      customSummary: buildSummaryLines(),
    });
    onClose();
  };

  const handleRequestQuote = (e: FormEvent) => {
    e.preventDefault();
    if (!quoteEmail.trim() || !quoteEmail.includes('@')) {
      setQuoteError('Enter a valid email address so our design consultant can send your mockup.');
      return;
    }
    setQuoteError('');
    const record = onSubmitModificationQuote({
      fullName: 'In-Page Product Customization',
      email: quoteEmail.trim(),
      phone: 'Via Email Consultation',
      company: '',
      quantity: '1',
      country: 'United Arab Emirates',
      gender: product.gender === 'women' ? 'Female' : 'Male',
      budgetAED: String(Math.round(finalPriceAED)),
      description: `Modification for ${product.name}: ${buildSummaryLines().join(' | ')}`,
    });
    setQuoteSent(record);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={`Customize ${product.name}`}
    >
      <div className="bg-white dark:bg-[#14191C] border border-[#E5E5E3] dark:border-[#262D31] w-full max-w-3xl shadow-2xl overflow-hidden my-auto text-[#1C1C1C] dark:text-[#F4F3EE]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E5E5E3] dark:border-[#262D31] flex items-center justify-between gap-4">
          <div>
            <p className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-[#767676] dark:text-[#8A8E91]">
              In-Page Product Modification · No Need to Leave
            </p>
            <h2 className="font-display text-xl sm:text-2xl font-semibold">
              Customize {product.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close customize product modal"
            className="p-2 text-[#595959] dark:text-[#A8ACAF] hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 max-h-[76vh] overflow-y-auto space-y-6">
          {/* 1. Leather Hide & Shade Swap */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="mod-hide"
                className="block text-xs font-semibold uppercase tracking-[0.12em] mb-2"
              >
                01. Leather Hide Swap
              </label>
              <select
                id="mod-hide"
                value={hideSwap}
                onChange={(e) => setHideSwap(e.target.value)}
                className="w-full bg-white dark:bg-[#0E1214] border border-[#D4D4D0] dark:border-[#2B3237] px-3 py-2.5 text-xs text-[#1C1C1C] dark:text-[#F4F3EE]"
              >
                {HIDE_SWAPS.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.label} {h.deltaAED > 0 ? `(+${formatMoney(h.deltaAED, currency)})` : '(Included)'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="mod-color"
                className="block text-xs font-semibold uppercase tracking-[0.12em] mb-2"
              >
                02. Leather Shade / Custom Pantone
              </label>
              <select
                id="mod-color"
                value={useCustomPantone ? '__pantone__' : colorSwap}
                onChange={(e) => {
                  if (e.target.value === '__pantone__') {
                    setUseCustomPantone(true);
                  } else {
                    setUseCustomPantone(false);
                    setColorSwap(e.target.value);
                  }
                }}
                className="w-full bg-white dark:bg-[#0E1214] border border-[#D4D4D0] dark:border-[#2B3237] px-3 py-2.5 text-xs text-[#1C1C1C] dark:text-[#F4F3EE]"
              >
                {product.colors.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} (Original Palette)
                  </option>
                ))}
                <option value="Cognac Amber">Cognac Amber Swap</option>
                <option value="Midnight Navy">Midnight Navy Swap</option>
                <option value="Forest Olive">Forest Olive Swap</option>
                <option value="Oxblood Burgundy">Oxblood Burgundy Swap</option>
                <option value="__pantone__">
                  Custom Pantone Shade (+{formatMoney(usdToAED(100), currency)})
                </option>
              </select>

              {useCustomPantone && (
                <input
                  type="text"
                  value={pantoneCode}
                  onChange={(e) => setPantoneCode(e.target.value)}
                  placeholder="Enter Pantone code (e.g. PMS 19-4052)"
                  aria-label="Custom Pantone shade code"
                  className="mt-2 w-full bg-white dark:bg-[#0E1214] border border-[#D4D4D0] dark:border-[#2B3237] px-3 py-2 text-xs text-[#1C1C1C] dark:text-[#F4F3EE]"
                />
              )}
            </div>
          </div>

          {/* 2. Hardware & Lining Swaps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="mod-hardware"
                className="block text-xs font-semibold uppercase tracking-[0.12em] mb-2"
              >
                03. Hardware Finish Swap
              </label>
              <select
                id="mod-hardware"
                value={hardwareSwap}
                onChange={(e) => setHardwareSwap(e.target.value)}
                className="w-full bg-white dark:bg-[#0E1214] border border-[#D4D4D0] dark:border-[#2B3237] px-3 py-2.5 text-xs text-[#1C1C1C] dark:text-[#F4F3EE]"
              >
                {HARDWARE_SWAPS.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.label} {h.deltaAED > 0 ? `(+${formatMoney(h.deltaAED, currency)})` : '(Included)'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="mod-lining"
                className="block text-xs font-semibold uppercase tracking-[0.12em] mb-2"
              >
                04. Interior Lining Change
              </label>
              <select
                id="mod-lining"
                value={liningSwap}
                onChange={(e) => setLiningSwap(e.target.value)}
                className="w-full bg-white dark:bg-[#0E1214] border border-[#D4D4D0] dark:border-[#2B3237] px-3 py-2.5 text-xs text-[#1C1C1C] dark:text-[#F4F3EE]"
              >
                {LINING_SWAPS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label} {l.deltaAED > 0 ? `(+${formatMoney(l.deltaAED, currency)})` : '(Included)'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. 6-Zone Logo / Artwork Uploads */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em]">
                05. 6-Zone Logo &amp; Artwork Uploads
              </p>
              <span className="text-[11px] text-[#767676] dark:text-[#8A8E91]">
                PNG, JPG, SVG or PDF · {activeZones.length} of 6 zones attached
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {ARTWORK_ZONES.map((zone) => {
                const uploaded = zoneUploads[zone.id];
                return (
                  <div
                    key={zone.id}
                    className={`border p-3 transition-colors ${
                      uploaded
                        ? 'border-[#1C1C1C] dark:border-[#F4F3EE] bg-[#FAF9F7] dark:bg-[#192024]'
                        : 'border-[#D8D8D5] dark:border-[#262D31] bg-white dark:bg-[#0E1214]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-xs font-semibold">{zone.label}</span>
                      <span className="text-[10.5px] text-[#767676] dark:text-[#8A8E91] tabular-nums">
                        +{formatMoney(zone.deltaAED, currency)}
                      </span>
                    </div>

                    {uploaded ? (
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          {uploaded.previewUrl && (
                            <img
                              src={uploaded.previewUrl}
                              alt={`${zone.label} preview`}
                              className="w-8 h-8 object-cover border border-[#E5E5E3] dark:border-[#2B3237] shrink-0"
                            />
                          )}
                          <span className="text-[11px] truncate text-[#1C1C1C] dark:text-[#F4F3EE]">
                            {uploaded.fileName}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeZoneFile(zone.id)}
                          aria-label={`Remove artwork from ${zone.label}`}
                          className="p-1 text-[#767676] hover:text-[#C41E24] dark:hover:text-[#E8555A] shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center gap-1.5 py-2 px-2 border border-dashed border-[#BDBDB8] dark:border-[#3A4248] text-[11px] text-[#595959] dark:text-[#A8ACAF] hover:border-[#1C1C1C] dark:hover:border-[#F4F3EE] cursor-pointer transition-colors">
                        <ImagePlus className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Upload Logo / Art</span>
                        <input
                          type="file"
                          accept="image/*,.svg,.pdf"
                          aria-label={`Upload artwork for ${zone.label}`}
                          onChange={(e) => handleZoneFile(zone.id, e)}
                          className="sr-only"
                        />
                      </label>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Additional Tailoring Notes */}
          <div>
            <label
              htmlFor="mod-notes"
              className="block text-xs font-semibold uppercase tracking-[0.12em] mb-1.5"
            >
              06. Pocket, Collar or Fit Modification Notes (Optional)
            </label>
            <textarea
              id="mod-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Remove epaulettes, add interior passport pocket, shorten sleeves by 2 cm..."
              className="w-full bg-white dark:bg-[#0E1214] border border-[#D4D4D0] dark:border-[#2B3237] px-3 py-2 text-xs text-[#1C1C1C] dark:text-[#F4F3EE]"
            />
          </div>

          {/* 5. Or Request Free 2D Mockup First */}
          <div className="border-t border-[#E5E5E3] dark:border-[#262D31] pt-5">
            {quoteSent ? (
              <div className="p-4 bg-[#FAF9F7] dark:bg-[#0E1214] border border-[#1C1C1C] dark:border-[#F4F3EE] text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>
                  Modification request <strong>{quoteSent.id}</strong> sent! A consultant will email
                  your 2D digital mockup to <strong>{quoteSent.email}</strong> within 24 hours.
                </span>
              </div>
            ) : (
              <form onSubmit={handleRequestQuote} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={quoteEmail}
                  onChange={(e) => setQuoteEmail(e.target.value)}
                  placeholder="Optional: Email to receive a free 2D mockup before ordering"
                  aria-label="Email for free modification consultation"
                  className="flex-1 bg-white dark:bg-[#0E1214] border border-[#D4D4D0] dark:border-[#2B3237] px-3 py-2 text-xs text-[#1C1C1C] dark:text-[#F4F3EE]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 border border-[#1C1C1C] dark:border-[#F4F3EE] text-xs font-semibold tracking-[0.12em] uppercase hover:bg-[#1C1C1C] hover:text-white dark:hover:bg-[#F4F3EE] dark:hover:text-[#0E1214] transition-colors whitespace-nowrap"
                >
                  Request Free Mockup
                </button>
              </form>
            )}
            {quoteError && (
              <p className="mt-1.5 text-xs text-[#C41E24] dark:text-[#E8555A]">{quoteError}</p>
            )}
          </div>
        </div>

        {/* Sticky Footer Bar */}
        <div className="px-6 py-4 border-t border-[#E5E5E3] dark:border-[#262D31] bg-[#FAF9F7] dark:bg-[#0E1214] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs tabular-nums">
            <p className="text-[#595959] dark:text-[#A8ACAF]">
              Base {formatMoney(product.priceAED, currency)}
              {totalDeltaAED > 0 ? ` + Modifications ${formatMoney(totalDeltaAED, currency)}` : ''}
            </p>
            <p className="font-display text-xl font-semibold text-[#1C1C1C] dark:text-[#F4F3EE]">
              Total: {formatMoney(finalPriceAED, currency)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenFullBuilder();
              }}
              className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#595959] dark:text-[#A8ACAF] hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE] underline underline-offset-4"
            >
              Open Full Studio Builder
            </button>
            <button
              type="button"
              onClick={handleAddModified}
              className="px-6 py-3 bg-[#1C1C1C] dark:bg-[#F4F3EE] hover:bg-black dark:hover:bg-white text-white dark:text-[#0E1214] text-xs font-semibold tracking-[0.15em] uppercase inline-flex items-center gap-2 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Add Modified Jacket · {formatMoney(finalPriceAED, currency)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
