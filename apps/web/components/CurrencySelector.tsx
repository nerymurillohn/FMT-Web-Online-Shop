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
      currency
    }).format(amount);
  } catch {
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
    <div className="currency-selector" role="region" aria-labelledby="currency-selector-heading">
      <div className="currency-selector__header">
        <h3 id="currency-selector-heading">Global Price Preview</h3>
        <p>
          Display prices in your shopper&rsquo;s local currency while charging in USD. Conversion is refreshed manually as you
          update exchange rates.
        </p>
      </div>
      <div className="currency-selector__controls" role="group" aria-labelledby="currency-picker-label">
        <label id="currency-picker-label" htmlFor="currency-picker">
          Preview currency
        </label>
        <select
          id="currency-picker"
          value={selectedCurrency}
          onChange={(event) => setSelectedCurrency(event.target.value as (typeof SUPPORTED_CURRENCIES)[number])}
          aria-label="Select currency for price preview"
        >
          {SUPPORTED_CURRENCIES.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </div>
      <div className="currency-selector__amounts" role="group" aria-label="Currency comparison">
        <div>
          <span className="currency-selector__label" id="checkout-currency-label">Checkout currency</span>
          <span className="currency-selector__value" aria-describedby="checkout-currency-label">{formatCurrency(amountUSD, "USD")}</span>
        </div>
        <div>
          <span className="currency-selector__label" id="display-currency-label">Displayed conversion</span>
          <span className="currency-selector__value" aria-describedby="display-currency-label">{formatCurrency(convertedAmount, selectedCurrency)}</span>
        </div>
      </div>
      <p className="currency-selector__disclaimer" role="note">
        * Shopify will capture payments in USD. Presenting localized prices removes friction for international customers while
        maintaining a single accounting currency.
      </p>
    </div>
  );
}
