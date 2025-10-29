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
    notes: "Set HS codes per SKU in Shopify to automate duties calculation."
  },
  AE: {
    country: "United Arab Emirates",
    region: "Middle East",
    deliveryEstimate: "4-5 business days",
    costUSD: 55,
    notes: "DHL requires consignee ID for customs clearance."
  },
  AU: {
    country: "Australia",
    region: "Oceania",
    deliveryEstimate: "5-6 business days",
    costUSD: 59,
    notes: "GST applies for orders over AUD 1,000; DHL notifies the customer."
  },
  HN: {
    country: "Honduras",
    region: "Central America",
    deliveryEstimate: "Next-day",
    costUSD: 18,
    notes: "Domestic fulfillment hub in Tegucigalpa for regional orders."
  }
};

const COUNTRY_OPTIONS: { code: CountryCode; label: string }[] = Object.entries(DHL_EXPRESS_PROFILES).map(([code, profile]) => ({
  code: code as CountryCode,
  label: `${profile.country} (${profile.region})`
}));

export function ShippingEstimator() {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>("US");

  const profile = useMemo(() => DHL_EXPRESS_PROFILES[selectedCountry], [selectedCountry]);

  return (
    <div className="shipping-estimator">
      <div className="shipping-estimator__header">
        <h3>DHL Express Worldwide</h3>
        <p>
          Shopify&apos;s native DHL Express integration will surface live rates at checkout. Use this matrix to communicate expectati
          ons up front.
        </p>
      </div>
      <label className="shipping-estimator__label" htmlFor="country-selector">
        Preview a shipping lane
      </label>
      <select
        id="country-selector"
        className="shipping-estimator__select"
        value={selectedCountry}
        onChange={(event) => setSelectedCountry(event.target.value as CountryCode)}
      >
        {COUNTRY_OPTIONS.map((option) => (
          <option key={option.code} value={option.code}>
            {option.label}
          </option>
        ))}
      </select>
      <dl className="shipping-estimator__details">
        <div>
          <dt>Transit time</dt>
          <dd>{profile.deliveryEstimate}</dd>
        </div>
        <div>
          <dt>Estimated rate</dt>
          <dd>USD ${profile.costUSD.toFixed(2)}</dd>
        </div>
        <div>
          <dt>Notes</dt>
          <dd>{profile.notes}</dd>
        </div>
      </dl>
      <p className="shipping-estimator__disclaimer">
        Customers are responsible for customs duties, VAT, or GST in their jurisdiction. Shopify automatically sends pre-shipment
        invoices so buyers know exactly what to expect when DHL delivers.
      </p>
    </div>
  );
}
