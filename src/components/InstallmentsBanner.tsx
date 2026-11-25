import { useState } from 'react';
import { Info, X } from 'lucide-react';
import type { CurrencyCode } from '../types';
import { calculateInstallments, formatMoney } from '../utils/commerce';

interface InstallmentsBannerProps {
  amountAED: number;
  currency: CurrencyCode;
  mode?: 'standard' | 'bespoke';
}

export function InstallmentsBanner({
  amountAED,
  currency,
  mode = 'standard',
}: InstallmentsBannerProps) {
  const [showDetails, setShowDetails] = useState(false);
  const plan = calculateInstallments(amountAED);

  return (
    <div className="text-xs text-[#4A4A4A] dark:text-[#B0B3B5] leading-relaxed">
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {mode === 'bespoke' ? (
          <span>
            Pay in 4 interest-free payments of{' '}
            <strong className="text-[#1C1C1C] dark:text-[#F4F3EE] tabular-nums">
              {formatMoney(plan.biweeklyAmountAED, currency)}
            </strong>{' '}
            (0% APR) or from{' '}
            <strong className="text-[#1C1C1C] dark:text-[#F4F3EE] tabular-nums">
              {formatMoney(plan.monthly12AmountAED, currency)}/mo
            </strong>{' '}
            for 12 months with
          </span>
        ) : (
          <span>
            4 interest-free biweekly payments of{' '}
            <strong className="text-[#1C1C1C] dark:text-[#F4F3EE] tabular-nums">
              {formatMoney(plan.biweeklyAmountAED, currency)}
            </strong>{' '}
            at 0% APR or{' '}
            <strong className="text-[#1C1C1C] dark:text-[#F4F3EE] tabular-nums">
              {formatMoney(plan.monthly12AmountAED, currency)}/mo
            </strong>{' '}
            with
          </span>
        )}
        <span className="inline-flex items-center px-1.5 py-0.5 bg-[#5A31F4] text-white font-semibold text-[10.5px] tracking-tight rounded-[2px]">
          Shop Pay
        </span>
        <span className="text-[#767676] dark:text-[#8A8E91]">Installments</span>
        <button
          type="button"
          onClick={() => setShowDetails((v) => !v)}
          aria-expanded={showDetails}
          className="inline-flex items-center gap-0.5 text-[#1C1C1C] dark:text-[#F4F3EE] underline underline-offset-2 hover:opacity-80 ml-0.5"
        >
          <Info className="w-3 h-3" aria-hidden="true" />
          <span>Learn more</span>
        </button>
      </div>

      {showDetails && (
        <div className="mt-2.5 p-4 border border-[#E5E5E3] dark:border-[#262D31] bg-[#FAF9F7] dark:bg-[#14191C] space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-[#1C1C1C] dark:text-[#F4F3EE]">
              Shop Pay Installments (Powered by Affirm)
            </p>
            <button
              type="button"
              onClick={() => setShowDetails(false)}
              aria-label="Close installment details"
              className="p-0.5 text-[#767676] hover:text-[#1C1C1C] dark:hover:text-[#F4F3EE]"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 tabular-nums">
            <div className="p-3 bg-white dark:bg-[#0E1214] border border-[#E5E5E3] dark:border-[#262D31]">
              <p className="font-semibold text-[#1C1C1C] dark:text-[#F4F3EE]">
                4 Biweekly Payments · 0% APR
              </p>
              <p className="text-sm font-semibold text-[#1C1C1C] dark:text-[#F4F3EE] mt-1">
                {formatMoney(plan.biweeklyAmountAED, currency)} every 2 weeks
              </p>
              <p className="text-[11px] text-[#767676] dark:text-[#8A8E91] mt-0.5">
                No interest, no late fees, no impact on credit score.
              </p>
            </div>
            <div className="p-3 bg-white dark:bg-[#0E1214] border border-[#E5E5E3] dark:border-[#262D31]">
              <p className="font-semibold text-[#1C1C1C] dark:text-[#F4F3EE]">
                12 Monthly Payments · {plan.aprLabel}
              </p>
              <p className="text-sm font-semibold text-[#1C1C1C] dark:text-[#F4F3EE] mt-1">
                {formatMoney(plan.monthly12AmountAED, currency)} / month
              </p>
              <p className="text-[11px] text-[#767676] dark:text-[#8A8E91] mt-0.5">
                Flexible monthly financing for larger custom &amp; bespoke orders.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
