"use client";

import { useMemo, useState } from "react";

const SUPPORTED_CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
  "HNL",
  "JPY"
] as const;

const EXCHANGE_RATES: Record<(typeof SUPPORTED_CURRENCIES)[number], number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.36,
  AUD: 1.5,
  HNL: 24.7,
  JPY: 155.2
};

const DEFAULT_LOCALE: Record<string, string> = {
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
  CAD: "en-CA",
  AUD: "en-AU",
  HNL: "es-HN",
  JPY: "ja-JP"
};

function formatCurrency(amount: number, currency: string) {
  const locale = DEFAULT_LOCALE[currency] ?? "en";
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      currencyDisplay: "symbol"
    }).format(amount);
  } catch (error) {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function CurrencySelector({ amountUSD }: { amountUSD: number }) {
  const [selectedCurrency, setSelectedCurrency] = useState<(typeof SUPPORTED_CURRENCIES)[number]>("USD");

  const convertedAmount = useMemo(() => {
    const rate = EXCHANGE_RATES[selectedCurrency] ?? 1;
    return amountUSD * rate;
  }, [amountUSD, selectedCurrency]);

  return (
    <div className="currency-selector">
      <div className="currency-selector__header">
        <h3>Global Price Preview</h3>
        <p>
          Display prices in your shopper&apos;s local currency while charging in USD. Conversion is refreshed manually as you
          update exchange rates.
        </p>
      </div>
      <div className="currency-selector__controls">
        <label htmlFor="currency-picker">Preview currency</label>
        <select
          id="currency-picker"
          value={selectedCurrency}
          onChange={(event) => setSelectedCurrency(event.target.value as (typeof SUPPORTED_CURRENCIES)[number])}
        >
          {SUPPORTED_CURRENCIES.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </div>
      <div className="currency-selector__amounts">
        <div>
          <span className="currency-selector__label">Checkout currency</span>
          <span className="currency-selector__value">{formatCurrency(amountUSD, "USD")}</span>
        </div>
        <div>
          <span className="currency-selector__label">Displayed conversion</span>
          <span className="currency-selector__value">{formatCurrency(convertedAmount, selectedCurrency)}</span>
        </div>
      </div>
      <p className="currency-selector__disclaimer">
        * Shopify will capture payments in USD. Presenting localized prices removes friction for international customers while
        maintaining a single accounting currency.
      </p>
    </div>
  );
}
