"use client";

function formatCurrency(amount: number) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  } catch {
    return `USD ${amount.toFixed(2)}`;
  }
}

export function CurrencySelector({ amountUSD }: { amountUSD: number }) {
  return (
    <div className="currency-selector" role="region" aria-labelledby="currency-selector-heading">
      <div className="currency-selector__header">
        <h3 id="currency-selector-heading">Global Price Preview</h3>
        <p>
          Display prices in your shopper&rsquo;s local currency while charging in USD. Conversion is refreshed manually as you
          update exchange rates.
        </p>
      </div>
      <div className="currency-selector__amounts" role="group" aria-label="Currency comparison">
        <div>
          <span className="currency-selector__label" id="checkout-currency-label">Checkout currency</span>
          <span className="currency-selector__value" aria-describedby="checkout-currency-label">{formatCurrency(amountUSD)}</span>
        </div>
      </div>
      <p className="currency-selector__disclaimer" role="note">
        * Shopify will capture payments in USD. Presenting localized prices removes friction for international customers while
        maintaining a single accounting currency.
      </p>
    </div>
  );
}
