import { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { ASSETS, BESPOKE_STEPS, STANDARD_SIZES } from '../data/catalog';
import type { BuilderConfig, CartItem, CurrencyCode } from '../types';
import {
  BUILDER_EMBROIDERY_DELTAS,
  BUILDER_FINISH_DELTAS,
  BUILDER_HARDWARE_DELTAS,
  BUILDER_LEATHER_DELTAS,
  BUILDER_LINING_DELTAS,
  BUILDER_PANTONE_SURCHARGE_AED,
  BUILDER_PERSONALIZATION_DELTAS,
  BUILDER_STYLE_DELTAS,
  calculateBuilderPriceAED,
  formatMoney,
} from '../utils/commerce';
import { InstallmentsBanner } from './InstallmentsBanner';
import { SafeImage } from './SafeImage';

interface JacketBuilderPageProps {
  currency: CurrencyCode;
  prefillName?: string;
  onAddToCart: (item: Omit<CartItem, 'lineId'>) => void;
}

const SHADES = [
  { name: 'Jet Black', hex: '#161616', image: ASSETS.IONIC_BLACK },
  { name: 'Espresso Brown', hex: '#4A2C1D', image: ASSETS.DEAN_BIKER_BROWN },
  { name: 'Tobacco Tan', hex: '#8B5427', image: ASSETS.SHERIFF_SUEDE },
  { name: 'Mocha Suede', hex: '#634838', image: ASSETS.BLAIN_MOCHA_BOMBER },
  { name: 'Cognac Amber', hex: '#94562B', image: ASSETS.WOMEN_CAMEL_COAT },
  { name: 'Oxblood Burgundy', hex: '#541A21', image: ASSETS.DEAN_BIKER_BROWN },
] as const;

const HARDWARE_OPTIONS: BuilderConfig['hardware'][] = [
  'Silver',
  'Antique Brass',
  'Gunmetal',
  'Matte Black',
  'Brushed Gold',
];

export function JacketBuilderPage({
  currency,
  prefillName,
  onAddToCart,
}: JacketBuilderPageProps) {
  const [config, setConfig] = useState<BuilderConfig>({
    baseStyle: 'cafe-racer',
    leatherType: 'sheepskin',
    leatherFinish: 'semi-aniline',
    shade: 'Jet Black',
    isCustomPantone: false,
    pantoneCode: '',
    hardware: 'Silver',
    lining: 'quilted-polyester',
    exteriorEmbroidery: 'none',
    innerPersonalization: 'none',
    personalizationText: '',
    fitType: 'standard',
    standardSize: 'M',
  });

  const [addedNotice, setAddedNotice] = useState(false);

  const totalAED = calculateBuilderPriceAED(config);
  const activeShade = SHADES.find((s) => s.name === config.shade) || SHADES[0];

  const previewImage =
    config.baseStyle === 'mid-length-coat' || config.baseStyle === 'full-length-coat'
      ? ASSETS.WOMEN_CAMEL_COAT
      : config.baseStyle === 'double-rider'
        ? ASSETS.DEAN_BIKER_BROWN
        : config.baseStyle === 'leather-bomber'
          ? ASSETS.BLAIN_MOCHA_BOMBER
          : activeShade.image;

  const handleAddBespokeToCart = () => {
    const shadeLabel = config.isCustomPantone
      ? `Custom Pantone (${config.pantoneCode.trim() || 'Consultant Match'})`
      : config.shade;
    const summary: string[] = [
      `Style: ${BUILDER_STYLE_DELTAS[config.baseStyle].label}`,
      `Hide: ${BUILDER_LEATHER_DELTAS[config.leatherType].label} (${BUILDER_FINISH_DELTAS[config.leatherFinish].label})`,
      `Shade: ${shadeLabel} · Hardware: ${BUILDER_HARDWARE_DELTAS[config.hardware].label}`,
      `Lining: ${BUILDER_LINING_DELTAS[config.lining].label}`,
    ];
    if (config.exteriorEmbroidery !== 'none') {
      summary.push(`Exterior: ${BUILDER_EMBROIDERY_DELTAS[config.exteriorEmbroidery].label}`);
    }
    if (config.innerPersonalization !== 'none') {
      summary.push(
        `Monogram: ${BUILDER_PERSONALIZATION_DELTAS[config.innerPersonalization].label}${
          config.personalizationText.trim() ? ` — "${config.personalizationText.trim()}"` : ''
        }`
      );
    }

    onAddToCart({
      productId: `custom-builder-${Date.now()}`,
      slug: 'custom-leather-jacket-builder',
      name: prefillName
        ? `Custom ${prefillName}`
        : `Bespoke ${BUILDER_STYLE_DELTAS[config.baseStyle].label}`,
      image: previewImage,
      unitPriceAED: totalAED,
      quantity: 1,
      color: shadeLabel,
      size: config.fitType === 'made-to-measure' ? 'Made to Measure' : config.standardSize,
      isMadeToMeasure: config.fitType === 'made-to-measure',
      workflowTrack: 'Digital Bespoke (10–12 Weeks)',
      customSummary: summary,
    });
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-10 py-6 lg:py-14">
      {/* Header */}
      <div className="max-w-3xl mb-6 sm:mb-10">
        <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#767676] dark:text-[#8A8E91] mb-2">
          Bespoke Leather Configurator · Free UAE Shipping &amp; Alteration
        </p>
        <h1 className="font-display text-[28px] sm:text-5xl font-semibold text-[#1C1C1C] dark:text-[#F4F3EE] leading-[1.12] mb-2.5 sm:mb-3">
          Design Your Own Leather Jacket
        </h1>
        <p className="text-[13px] sm:text-base text-[#595959] dark:text-[#A8ACAF] leading-relaxed">
          {prefillName
            ? `Starting from the proportions of ${prefillName} — configure your hide, finish, hardware, lining, and personal monogram with real-time pricing.`
            : 'Configure every detail from base silhouette and natural full-grain hide to YKK hardware, interior lining, and pocket embroidery. Includes a dedicated design consultant and studio illustration review.'}
        </p>
      </div>

      {/* Main Configurator Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 sm:gap-10 lg:gap-12 items-start">
        {/* Sticky Live Visual & Spec Sheet */}
        <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-4 sm:space-y-5">
          <div className="relative aspect-[4/4.3] sm:aspect-[3/4] bg-[#F1F1EF] dark:bg-[#161B1E] overflow-hidden border border-[#E5E5E3] dark:border-[#262D31]">
            <SafeImage
              src={previewImage}
              alt={`Bespoke ${BUILDER_STYLE_DELTAS[config.baseStyle].label} preview`}
              className="w-full h-full object-cover object-top"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 text-white">
              <p className="text-[10px] sm:text-[11px] tracking-[0.16em] uppercase text-white/75 mb-1">
                Live Bespoke Specification
              </p>
              <p className="font-display text-xl sm:text-2xl font-medium">
                {BUILDER_STYLE_DELTAS[config.baseStyle].label}
              </p>
              <p className="text-xs text-white/85 mt-1">
                {BUILDER_LEATHER_DELTAS[config.leatherType].label} ·{' '}
                {BUILDER_FINISH_DELTAS[config.leatherFinish].label} · {config.shade}
              </p>
              {config.innerPersonalization !== 'none' && config.personalizationText.trim() && (
                <p className="mt-3 pt-2.5 border-t border-white/25 font-display italic text-sm text-[#F3D999]">
                  Inner Lining Monogram: “{config.personalizationText.trim()}”
                </p>
              )}
            </div>
          </div>

          {/* Live Summary Ledger */}
          <div className="border border-[#E5E5E3] dark:border-[#262D31] bg-[#FAF9F7] dark:bg-[#14191C] p-4 sm:p-5 space-y-2.5 text-xs">
            <div className="flex items-start justify-between gap-3 text-[#595959] dark:text-[#A8ACAF]">
              <span className="shrink-0">Silhouette</span>
              <span className="font-medium text-[#1C1C1C] dark:text-[#F4F3EE] text-right">
                {BUILDER_STYLE_DELTAS[config.baseStyle].label}
              </span>
            </div>
            <div className="flex items-start justify-between gap-3 text-[#595959] dark:text-[#A8ACAF]">
              <span className="shrink-0">Hide &amp; Finish</span>
              <span className="font-medium text-[#1C1C1C] dark:text-[#F4F3EE] text-right">
                {BUILDER_LEATHER_DELTAS[config.leatherType].label} ·{' '}
                {BUILDER_FINISH_DELTAS[config.leatherFinish].label}
              </span>
            </div>
            <div className="flex items-start justify-between gap-3 text-[#595959] dark:text-[#A8ACAF]">
              <span className="shrink-0">Shade &amp; Hardware</span>
              <span className="font-medium text-[#1C1C1C] dark:text-[#F4F3EE] text-right">
                {config.isCustomPantone
                  ? `Pantone ${config.pantoneCode.trim() || 'Custom'}`
                  : config.shade}{' '}
                · {config.hardware}
              </span>
            </div>
            <div className="flex items-start justify-between gap-3 text-[#595959] dark:text-[#A8ACAF]">
              <span className="shrink-0">Inner Lining</span>
              <span className="font-medium text-[#1C1C1C] dark:text-[#F4F3EE] text-right">
                {BUILDER_LINING_DELTAS[config.lining].label}
              </span>
            </div>
            <div className="flex items-start justify-between gap-3 text-[#595959] dark:text-[#A8ACAF]">
              <span className="shrink-0">Digital Bespoke Pipeline</span>
              <span className="font-medium text-[#1C1C1C] dark:text-[#F4F3EE] text-right">
                10–12 Weeks · 7 Steps
              </span>
            </div>
            <div className="pt-3 mt-2 border-t border-[#E5E5E3] dark:border-[#262D31] flex items-baseline justify-between">
              <span className="font-semibold uppercase tracking-[0.12em] text-[#1C1C1C] dark:text-[#F4F3EE]">
                Estimated Total
              </span>
              <span
                data-testid="builder-total-price"
                className="font-display text-2xl font-semibold text-[#1C1C1C] dark:text-[#F4F3EE] tabular-nums"
              >
                {formatMoney(totalAED, currency)}
              </span>
            </div>
            <div className="pt-2.5 border-t border-[#ECECE9] dark:border-[#23292D]">
              <InstallmentsBanner amountAED={totalAED} currency={currency} mode="bespoke" />
            </div>
          </div>
        </div>

        {/* Right Interactive Options Stack */}
        <div className="lg:col-span-7 space-y-9">
          {/* 1. Base Style */}
          <fieldset className="space-y-3">
            <legend className="text-xs font-semibold tracking-[0.14em] uppercase text-[#1C1C1C] dark:text-[#F4F3EE]">
              01. Base Style*
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(Object.keys(BUILDER_STYLE_DELTAS) as BuilderConfig['baseStyle'][]).map((key) => {
                const item = BUILDER_STYLE_DELTAS[key];
                const active = config.baseStyle === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setConfig((c) => ({ ...c, baseStyle: key }))}
                    className={`p-3.5 border text-left transition-colors flex items-center justify-between gap-2 ${
                      active
                        ? 'bg-[#1C1C1C] dark:bg-[#F4F3EE] text-white dark:text-[#0E1214] border-[#1C1C1C] dark:border-[#F4F3EE]'
                        : 'bg-white dark:bg-[#14191C] text-[#1C1C1C] dark:text-[#F4F3EE] border-[#D8D8D5] dark:border-[#262D31] hover:border-[#1C1C1C] dark:hover:border-[#F4F3EE]'
                    }`}
                  >
                    <span className="text-xs font-medium">{item.label}</span>
                    <span
                      className={`text-[11px] tabular-nums ${
                        active ? 'text-white/80 dark:text-[#0E1214]/75' : 'text-[#595959] dark:text-[#A8ACAF]'
                      }`}
                    >
                      {item.deltaAED === 0
                        ? 'Included'
                        : `${item.deltaAED > 0 ? '+' : ''}${formatMoney(item.deltaAED, currency)}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* 2. Leather Type */}
          <fieldset className="space-y-3">
            <legend className="text-xs font-semibold tracking-[0.14em] uppercase text-[#1C1C1C] dark:text-[#F4F3EE]">
              02. Full-Grain Leather Type*
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(Object.keys(BUILDER_LEATHER_DELTAS) as BuilderConfig['leatherType'][]).map((key) => {
                const item = BUILDER_LEATHER_DELTAS[key];
                const active = config.leatherType === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setConfig((c) => ({ ...c, leatherType: key }))}
                    className={`p-3.5 border text-left transition-colors ${
                      active
                        ? 'bg-[#1C1C1C] dark:bg-[#F4F3EE] text-white dark:text-[#0E1214] border-[#1C1C1C] dark:border-[#F4F3EE]'
                        : 'bg-white dark:bg-[#14191C] text-[#1C1C1C] dark:text-[#F4F3EE] border-[#D8D8D5] dark:border-[#262D31] hover:border-[#1C1C1C] dark:hover:border-[#F4F3EE]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold">{item.label}</span>
                      <span
                        className={`text-[11px] tabular-nums ${
                          active ? 'text-white/80 dark:text-[#0E1214]/75' : 'text-[#595959] dark:text-[#A8ACAF]'
                        }`}
                      >
                        {item.deltaAED === 0 ? 'Included' : `+${formatMoney(item.deltaAED, currency)}`}
                      </span>
                    </div>
                    <p
                      className={`text-[11px] mt-1 ${
                        active ? 'text-white/75 dark:text-[#0E1214]/70' : 'text-[#767676] dark:text-[#8A8E91]'
                      }`}
                    >
                      {item.note}
                    </p>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* 3. Leather Finish */}
          <fieldset className="space-y-3">
            <legend className="text-xs font-semibold tracking-[0.14em] uppercase text-[#1C1C1C] dark:text-[#F4F3EE]">
              03. Leather Finish
            </legend>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(Object.keys(BUILDER_FINISH_DELTAS) as BuilderConfig['leatherFinish'][]).map((key) => {
                const item = BUILDER_FINISH_DELTAS[key];
                const active = config.leatherFinish === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setConfig((c) => ({ ...c, leatherFinish: key }))}
                    className={`p-3 border text-left transition-colors ${
                      active
                        ? 'bg-[#1C1C1C] dark:bg-[#F4F3EE] text-white dark:text-[#0E1214] border-[#1C1C1C] dark:border-[#F4F3EE]'
                        : 'bg-white dark:bg-[#14191C] text-[#1C1C1C] dark:text-[#F4F3EE] border-[#D8D8D5] dark:border-[#262D31] hover:border-[#1C1C1C] dark:hover:border-[#F4F3EE]'
                    }`}
                  >
                    <span className="block text-xs font-medium">{item.label}</span>
                    <span
                      className={`block text-[11px] mt-0.5 tabular-nums ${
                        active ? 'text-white/75 dark:text-[#0E1214]/70' : 'text-[#767676] dark:text-[#8A8E91]'
                      }`}
                    >
                      {item.deltaAED === 0 ? 'Included' : `+${formatMoney(item.deltaAED, currency)}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* 4. Shade (incl. Custom Pantone +$100) & Hardware (incl. Matte Black +$20) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <fieldset className="space-y-3">
              <legend className="text-xs font-semibold tracking-[0.14em] uppercase text-[#1C1C1C] dark:text-[#F4F3EE]">
                04. Leather Shade
              </legend>
              <div className="grid grid-cols-2 gap-2">
                {SHADES.map((shade) => {
                  const active = !config.isCustomPantone && config.shade === shade.name;
                  return (
                    <button
                      key={shade.name}
                      type="button"
                      onClick={() =>
                        setConfig((c) => ({ ...c, shade: shade.name, isCustomPantone: false }))
                      }
                      className={`px-3 py-2.5 border text-xs flex items-center gap-2 transition-colors ${
                        active
                          ? 'border-[#1C1C1C] dark:border-[#F4F3EE] bg-[#FAF9F7] dark:bg-[#1B2226] font-semibold text-[#1C1C1C] dark:text-[#F4F3EE]'
                          : 'border-[#D8D8D5] dark:border-[#262D31] bg-white dark:bg-[#14191C] text-[#595959] dark:text-[#A8ACAF] hover:border-[#1C1C1C] dark:hover:border-[#F4F3EE]'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20 dark:border-white/25 shrink-0"
                        style={{ backgroundColor: shade.hex }}
                      />
                      <span className="truncate">{shade.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Pantone Shade (+$100) */}
              <button
                type="button"
                onClick={() => setConfig((c) => ({ ...c, isCustomPantone: !c.isCustomPantone }))}
                aria-pressed={config.isCustomPantone}
                className={`w-full px-3 py-2.5 border text-xs flex items-center justify-between gap-2 transition-colors ${
                  config.isCustomPantone
                    ? 'bg-[#1C1C1C] dark:bg-[#F4F3EE] text-white dark:text-[#0E1214] border-[#1C1C1C] dark:border-[#F4F3EE] font-semibold'
                    : 'border-[#D8D8D5] dark:border-[#262D31] bg-white dark:bg-[#14191C] text-[#1C1C1C] dark:text-[#F4F3EE] hover:border-[#1C1C1C] dark:hover:border-[#F4F3EE]'
                }`}
              >
                <span>Custom Pantone Shade</span>
                <span className="tabular-nums text-[11px]">
                  +{formatMoney(BUILDER_PANTONE_SURCHARGE_AED, currency)}
                </span>
              </button>

              {config.isCustomPantone && (
                <div>
                  <label htmlFor="builder-pantone" className="sr-only">
                    Pantone Color Code
                  </label>
                  <input
                    id="builder-pantone"
                    type="text"
                    value={config.pantoneCode}
                    onChange={(e) => setConfig((c) => ({ ...c, pantoneCode: e.target.value }))}
                    placeholder="Enter Pantone code (e.g. PMS 19-4052)"
                    className="w-full bg-white dark:bg-[#14191C] border border-[#D4D4D0] dark:border-[#2B3237] px-3 py-2 text-xs text-[#1C1C1C] dark:text-[#F4F3EE]"
                  />
                </div>
              )}
            </fieldset>

            <fieldset className="space-y-3">
              <legend className="text-xs font-semibold tracking-[0.14em] uppercase text-[#1C1C1C] dark:text-[#F4F3EE]">
                05. YKK Hardware Finish
              </legend>
              <div className="grid grid-cols-1 gap-2">
                {HARDWARE_OPTIONS.map((hw) => {
                  const meta = BUILDER_HARDWARE_DELTAS[hw];
                  const active = config.hardware === hw;
                  return (
                    <button
                      key={hw}
                      type="button"
                      onClick={() => setConfig((c) => ({ ...c, hardware: hw }))}
                      className={`px-3 py-2.5 border text-xs flex items-center justify-between transition-colors ${
                        active
                          ? 'bg-[#1C1C1C] dark:bg-[#F4F3EE] text-white dark:text-[#0E1214] border-[#1C1C1C] dark:border-[#F4F3EE] font-semibold'
                          : 'bg-white dark:bg-[#14191C] text-[#1C1C1C] dark:text-[#F4F3EE] border-[#D8D8D5] dark:border-[#262D31] hover:border-[#1C1C1C] dark:hover:border-[#F4F3EE]'
                      }`}
                    >
                      <span>{meta.label}</span>
                      <span
                        className={`text-[11px] tabular-nums ${
                          active ? 'text-white/80 dark:text-[#0E1214]/75' : 'text-[#767676] dark:text-[#8A8E91]'
                        }`}
                      >
                        {meta.deltaAED === 0 ? 'Included' : `+${formatMoney(meta.deltaAED, currency)}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </div>

          {/* 6. Inner Lining */}
          <fieldset className="space-y-3">
            <legend className="text-xs font-semibold tracking-[0.14em] uppercase text-[#1C1C1C] dark:text-[#F4F3EE]">
              06. Inner Lining
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(Object.keys(BUILDER_LINING_DELTAS) as BuilderConfig['lining'][]).map((key) => {
                const item = BUILDER_LINING_DELTAS[key];
                const active = config.lining === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setConfig((c) => ({ ...c, lining: key }))}
                    className={`p-3 border text-left flex items-center justify-between gap-2 transition-colors ${
                      active
                        ? 'bg-[#1C1C1C] dark:bg-[#F4F3EE] text-white dark:text-[#0E1214] border-[#1C1C1C] dark:border-[#F4F3EE]'
                        : 'bg-white dark:bg-[#14191C] text-[#1C1C1C] dark:text-[#F4F3EE] border-[#D8D8D5] dark:border-[#262D31] hover:border-[#1C1C1C] dark:hover:border-[#F4F3EE]'
                    }`}
                  >
                    <span className="text-xs font-medium">{item.label}</span>
                    <span
                      className={`text-[11px] tabular-nums ${
                        active ? 'text-white/75 dark:text-[#0E1214]/70' : 'text-[#595959] dark:text-[#A8ACAF]'
                      }`}
                    >
                      {item.deltaAED === 0 ? 'Included' : `+${formatMoney(item.deltaAED, currency)}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* 7. Exterior Artwork/Logo Embroidery */}
          <fieldset className="space-y-3">
            <legend className="text-xs font-semibold tracking-[0.14em] uppercase text-[#1C1C1C] dark:text-[#F4F3EE]">
              07. Exterior Artwork / Logo Embroidery
            </legend>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(
                Object.keys(BUILDER_EMBROIDERY_DELTAS) as BuilderConfig['exteriorEmbroidery'][]
              ).map((key) => {
                const item = BUILDER_EMBROIDERY_DELTAS[key];
                const active = config.exteriorEmbroidery === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setConfig((c) => ({ ...c, exteriorEmbroidery: key }))}
                    className={`p-3 border text-left transition-colors ${
                      active
                        ? 'bg-[#1C1C1C] dark:bg-[#F4F3EE] text-white dark:text-[#0E1214] border-[#1C1C1C] dark:border-[#F4F3EE]'
                        : 'bg-white dark:bg-[#14191C] text-[#1C1C1C] dark:text-[#F4F3EE] border-[#D8D8D5] dark:border-[#262D31] hover:border-[#1C1C1C] dark:hover:border-[#F4F3EE]'
                    }`}
                  >
                    <span className="block text-xs font-medium">{item.label}</span>
                    <span
                      className={`block text-[11px] mt-0.5 tabular-nums ${
                        active ? 'text-white/75 dark:text-[#0E1214]/70' : 'text-[#767676] dark:text-[#8A8E91]'
                      }`}
                    >
                      {item.deltaAED === 0 ? 'Included' : `+${formatMoney(item.deltaAED, currency)}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* 8. Inner Lining Personalization */}
          <fieldset className="space-y-3">
            <legend className="text-xs font-semibold tracking-[0.14em] uppercase text-[#1C1C1C] dark:text-[#F4F3EE]">
              08. Inner Lining Pocket Personalization
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {(
                Object.keys(
                  BUILDER_PERSONALIZATION_DELTAS
                ) as BuilderConfig['innerPersonalization'][]
              ).map((key) => {
                const item = BUILDER_PERSONALIZATION_DELTAS[key];
                const active = config.innerPersonalization === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setConfig((c) => ({ ...c, innerPersonalization: key }))}
                    className={`p-3 border text-left transition-colors ${
                      active
                        ? 'bg-[#1C1C1C] dark:bg-[#F4F3EE] text-white dark:text-[#0E1214] border-[#1C1C1C] dark:border-[#F4F3EE]'
                        : 'bg-white dark:bg-[#14191C] text-[#1C1C1C] dark:text-[#F4F3EE] border-[#D8D8D5] dark:border-[#262D31] hover:border-[#1C1C1C] dark:hover:border-[#F4F3EE]'
                    }`}
                  >
                    <span className="block text-xs font-medium">{item.label}</span>
                    <span
                      className={`block text-[11px] mt-0.5 tabular-nums ${
                        active ? 'text-white/75 dark:text-[#0E1214]/70' : 'text-[#767676] dark:text-[#8A8E91]'
                      }`}
                    >
                      {item.deltaAED === 0 ? 'Included' : `+${formatMoney(item.deltaAED, currency)}`}
                    </span>
                  </button>
                );
              })}
            </div>

            {config.innerPersonalization !== 'none' && (
              <div>
                <label
                  htmlFor="builder-monogram"
                  className="block text-xs text-[#595959] dark:text-[#A8ACAF] mb-1.5"
                >
                  {config.innerPersonalization === 'initials'
                    ? 'Enter Initials or Name (up to 16 characters)'
                    : 'Enter Phrase or Quote (up to 60 characters)'}
                </label>
                <input
                  id="builder-monogram"
                  type="text"
                  maxLength={config.innerPersonalization === 'initials' ? 16 : 60}
                  value={config.personalizationText}
                  onChange={(e) =>
                    setConfig((c) => ({ ...c, personalizationText: e.target.value }))
                  }
                  placeholder={
                    config.innerPersonalization === 'initials'
                      ? 'e.g. K. Al Maktoum'
                      : 'e.g. Built for the open road'
                  }
                  className="w-full bg-white dark:bg-[#14191C] border border-[#D4D4D0] dark:border-[#2B3237] px-3.5 py-2.5 text-sm text-[#1C1C1C] dark:text-[#F4F3EE]"
                />
              </div>
            )}
          </fieldset>

          {/* 9. Sizing */}
          <fieldset className="space-y-3">
            <legend className="text-xs font-semibold tracking-[0.14em] uppercase text-[#1C1C1C] dark:text-[#F4F3EE]">
              09. Fit &amp; Sizing
            </legend>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfig((c) => ({ ...c, fitType: 'standard' }))}
                className={`flex-1 py-2.5 px-2.5 border text-[11px] sm:text-xs font-semibold leading-snug ${
                  config.fitType === 'standard'
                    ? 'bg-[#1C1C1C] dark:bg-[#F4F3EE] text-white dark:text-[#0E1214] border-[#1C1C1C] dark:border-[#F4F3EE]'
                    : 'bg-white dark:bg-[#14191C] text-[#1C1C1C] dark:text-[#F4F3EE] border-[#D8D8D5] dark:border-[#262D31]'
                }`}
              >
                Standard Size (XS–4XL)
              </button>
              <button
                type="button"
                onClick={() => setConfig((c) => ({ ...c, fitType: 'made-to-measure' }))}
                className={`flex-1 py-2.5 px-2.5 border text-[11px] sm:text-xs font-semibold leading-snug ${
                  config.fitType === 'made-to-measure'
                    ? 'bg-[#1C1C1C] dark:bg-[#F4F3EE] text-white dark:text-[#0E1214] border-[#1C1C1C] dark:border-[#F4F3EE]'
                    : 'bg-white dark:bg-[#14191C] text-[#1C1C1C] dark:text-[#F4F3EE] border-[#D8D8D5] dark:border-[#262D31]'
                }`}
              >
                Made-to-Measure (Included)
              </button>
            </div>
            {config.fitType === 'standard' && (
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {STANDARD_SIZES.map((s) => (
                  <button
                    key={s.code}
                    type="button"
                    onClick={() => setConfig((c) => ({ ...c, standardSize: s.code }))}
                    className={`py-2 border text-xs font-semibold ${
                      config.standardSize === s.code
                        ? 'bg-[#1C1C1C] dark:bg-[#F4F3EE] text-white dark:text-[#0E1214] border-[#1C1C1C] dark:border-[#F4F3EE]'
                        : 'bg-white dark:bg-[#14191C] text-[#1C1C1C] dark:text-[#F4F3EE] border-[#D8D8D5] dark:border-[#262D31]'
                    }`}
                  >
                    {s.code}
                  </button>
                ))}
              </div>
            )}
          </fieldset>

          {/* Final Add to Cart Action */}
          <div className="pt-4 border-t border-[#E5E5E3] dark:border-[#262D31] space-y-3">
            <button
              type="button"
              onClick={handleAddBespokeToCart}
              className="w-full py-4 bg-[#1C1C1C] dark:bg-[#F4F3EE] hover:bg-black dark:hover:bg-white text-white dark:text-[#0E1214] text-xs font-semibold tracking-[0.16em] uppercase transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>Add Bespoke Jacket to Cart · {formatMoney(totalAED, currency)}</span>
            </button>

            {addedNotice && (
              <p className="text-xs text-[#1C1C1C] dark:text-[#F4F3EE] font-medium flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4" aria-hidden="true" /> Custom jacket added to your
                shopping bag.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 7-Step Bespoke Process */}
      <section className="mt-14 sm:mt-24 pt-10 sm:pt-16 border-t border-[#E5E5E3] dark:border-[#262D31]">
        <div className="max-w-2xl mb-7 sm:mb-12">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#767676] dark:text-[#8A8E91] mb-2">
            The Process · How It Works
          </p>
          <h2 className="font-display text-2xl sm:text-4xl font-semibold text-[#1C1C1C] dark:text-[#F4F3EE] mb-2.5 sm:mb-3">
            Seven Guided Steps From Idea to Delivery
          </h2>
          <p className="text-[13px] sm:text-base text-[#595959] dark:text-[#A8ACAF] leading-relaxed">
            Every bespoke jacket begins with your vision and moves through a transparent,
            consultant-led journey ensuring comfort, confidence, and clarity from start to finish.
          </p>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-3.5 -mx-4 px-4 sm:mx-0 sm:px-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6">
          {BESPOKE_STEPS.map((s) => (
            <div
              key={s.step}
              className="w-[78vw] max-w-[290px] shrink-0 snap-start md:w-auto md:max-w-none border border-[#E5E5E3] dark:border-[#262D31] bg-white dark:bg-[#14191C] p-5 sm:p-6"
            >
              <span className="font-display text-2xl font-semibold text-[#767676] dark:text-[#8A8E91] tabular-nums">
                {s.step}
              </span>
              <h3 className="font-body text-sm font-semibold text-[#1C1C1C] dark:text-[#F4F3EE] mt-3 mb-2">
                {s.title}
              </h3>
              <p className="text-xs text-[#595959] dark:text-[#A8ACAF] leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
