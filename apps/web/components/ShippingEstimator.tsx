"use client";

import { useMemo, useState } from "react";

type CountryCode = "US" | "CA" | "MX" | "DE" | "GB" | "FR" | "AE" | "AU" | "HN";

type ShippingProfile = {
  country: string;
  region: string;
  deliveryEstimate: string;
  costUSD: number;
  notes?: string;
};

const DHL_EXPRESS_PROFILES: Record<CountryCode, ShippingProfile> = {
  US: {
    country: "United States",
    region: "North America",
    deliveryEstimate: "1-2 business days",
    costUSD: 38,
    notes: "Includes continental U.S. coverage with remote area surcharge passed through at checkout."
  },
  CA: {
    country: "Canada",
    region: "North America",
    deliveryEstimate: "2-3 business days",
    costUSD: 42,
    notes: "Duties & GST collected by DHL upon delivery."
  },
  MX: {
    country: "Mexico",
    region: "North America",
    deliveryEstimate: "2-3 business days",
    costUSD: 35,
    notes: "Customs broker services handled by DHL. Import duties are paid by the recipient."
  },
  DE: {
    country: "Germany",
    region: "European Union",
    deliveryEstimate: "3-4 business days",
    costUSD: 48,
    notes: "VAT is payable by the customer. Provide EORI number for B2B shipments."
  },
  GB: {
    country: "United Kingdom",
    region: "Europe",
    deliveryEstimate: "3-4 business days",
    costUSD: 47,
    notes: "UK Global Tariff applies. DHL collects duties + VAT before delivery."
  },
  FR: {
    country: "France",
    region: "European Union",
    deliveryEstimate: "3-4 business days",
    costUSD: 48,
    notes: "VAT applies. EU customs rules apply."
  },
  AE: {
    country: "United Arab Emirates",
    region: "Middle East",
    deliveryEstimate: "4-5 business days",
    costUSD: 52,
    notes: "Import fees are rare for personal use. Commercial shipments may have small duties."
  },
  AU: {
    country: "Australia",
    region: "Asia-Pacific",
    deliveryEstimate: "4-5 business days",
    costUSD: 50,
    notes: "GST and import duties may apply over AUD 1,000."
  },
  HN: {
    country: "Honduras (Domestic)",
    region: "Central America",
    deliveryEstimate: "Next-day",
    costUSD: 12,
    notes: "Domestic coverage includes Tegucigalpa, San Pedro Sula, La Ceiba, and regional centers."
  }
};

const COUNTRY_OPTIONS = [
  { code: "US" as CountryCode, label: "🇺🇸 United States" },
  { code: "CA" as CountryCode, label: "🇨🇦 Canada" },
  { code: "MX" as CountryCode, label: "🇲🇽 Mexico" },
  { code: "DE" as CountryCode, label: "🇩🇪 Germany" },
  { code: "GB" as CountryCode, label: "🇬🇧 United Kingdom" },
  { code: "FR" as CountryCode, label: "🇫🇷 France" },
  { code: "AE" as CountryCode, label: "🇦🇪 UAE" },
  { code: "AU" as CountryCode, label: "🇦🇺 Australia" },
  { code: "HN" as CountryCode, label: "🇭🇳 Honduras (Local)" }
];

export function ShippingEstimator() {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>("US");

  const profile = useMemo(() => DHL_EXPRESS_PROFILES[selectedCountry], [selectedCountry]);

  return (
    <div className="shipping-estimator" role="region" aria-labelledby="shipping-estimator-heading">
      <div className="shipping-estimator__header">
        <h3 id="shipping-estimator-heading">DHL Express Worldwide</h3>
        <p>
          Shopify's native DHL Express integration will surface live rates at checkout. Use this matrix to communicate expectations up front.
        </p>
      </div>
      <div role="group" aria-labelledby="country-selector-label">
        <label className="shipping-estimator__label" id="country-selector-label" htmlFor="country-selector">
          Preview a shipping lane
        </label>
        <select
          id="country-selector"
          className="shipping-estimator__select"
          value={selectedCountry}
          onChange={(event) => setSelectedCountry(event.target.value as CountryCode)}
          aria-label="Select destination country to preview shipping information"
        >
          {COUNTRY_OPTIONS.map((option) => (
            <option key={option.code} value={option.code}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <dl className="shipping-estimator__details" role="group" aria-label="Shipping details">
        <div role="group">
          <dt>Transit time</dt>
          <dd>{profile.deliveryEstimate}</dd>
        </div>
        <div role="group">
          <dt>Estimated rate</dt>
          <dd>USD ${profile.costUSD.toFixed(2)}</dd>
        </div>
        <div role="group">
          <dt>Notes</dt>
          <dd>{profile.notes}</dd>
        </div>
      </dl>
      <p className="shipping-estimator__disclaimer" role="note">
        Customers are responsible for customs duties, VAT, or GST in their jurisdiction. Shopify automatically sends pre-shipment
        invoices so buyers know exactly what to expect when DHL delivers.
      </p>
    </div>
  );
}
