const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;

const CHECKLIST_ITEMS = [
  {
    label: "Shopify store provisioned",
    description: "Create the Forestal MT storefront in Shopify and add the product catalog.",
    isComplete: Boolean(STORE_DOMAIN)
  },
  {
    label: "Storefront API token generated",
    description: "Generate a Storefront API access token from the Shopify admin for public product queries.",
    isComplete: Boolean(STOREFRONT_TOKEN)
  },
  {
    label: "Admin API token secured",
    description:
      "Use the Admin API token to sync inventory, create DHL Express shipments, and manage orders directly from Shopify.",
    isComplete: Boolean(ADMIN_TOKEN)
  }
] as const;

export function ShopifyReadiness() {
  const isConfigured = CHECKLIST_ITEMS.every((item) => item.isComplete);

  return (
    <div className="shopify-readiness">
      <div className="shopify-readiness__header">
        <h3>Shopify Integration Readiness</h3>
        <p>
          The site is wired to use Shopify as the commerce engine. Provide the credentials below to unlock live product data,
          cart, and checkout.
        </p>
      </div>
      <ul className="shopify-readiness__list">
        {CHECKLIST_ITEMS.map((item) => (
          <li key={item.label} className={item.isComplete ? "is-complete" : "is-pending"}>
            <span className="shopify-readiness__status" aria-hidden>{item.isComplete ? "✓" : "•"}</span>
            <div>
              <p className="shopify-readiness__label">{item.label}</p>
              <p className="shopify-readiness__description">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="shopify-readiness__footnote">
        <p>
          {isConfigured
            ? "All systems go. Add Hydrogen or Storefront API calls wherever product data is required."
            : "Add the credentials above to `.env.local` under apps/web and restart the dev server."}
        </p>
        <code>
          SHOPIFY_STORE_DOMAIN={STORE_DOMAIN ?? "your-store.myshopify.com"}
          <br />
          SHOPIFY_STOREFRONT_ACCESS_TOKEN={STOREFRONT_TOKEN ? "••••••••" : "your-token"}
          <br />
          SHOPIFY_ADMIN_API_TOKEN={ADMIN_TOKEN ? "••••••••" : "admin-token"}
        </code>
      </div>
    </div>
  );
}
