import { generateSetupInstructions, getEnvVar, isFeatureEnabled, validateEnvironment } from '../lib/env';

type ChecklistItem = {
  label: string;
  description: string;
  isComplete: boolean;
  envVar: string;
};

export function ShopifyReadiness() {
  const validation = validateEnvironment();
  const isShopifyEnabled = isFeatureEnabled('shopify');
  
  const CHECKLIST_ITEMS: ChecklistItem[] = [
    {
      label: "Shopify store provisioned",
      description: "Create the Forestal MT storefront in Shopify and add the product catalog.",
      isComplete: Boolean(getEnvVar('SHOPIFY_STORE_DOMAIN')),
      envVar: 'SHOPIFY_STORE_DOMAIN'
    },
    {
      label: "Storefront API token generated",
      description: "Generate a Storefront API access token from the Shopify admin for public product queries.",
      isComplete: Boolean(getEnvVar('SHOPIFY_STOREFRONT_ACCESS_TOKEN')),
      envVar: 'SHOPIFY_STOREFRONT_ACCESS_TOKEN'
    },
    {
      label: "Admin API token secured (optional)",
      description:
        "Use the Admin API token to sync inventory, create DHL Express shipments, and manage orders directly from Shopify.",
      isComplete: Boolean(getEnvVar('SHOPIFY_ADMIN_API_TOKEN')),
      envVar: 'SHOPIFY_ADMIN_API_TOKEN'
    }
  ];

  const requiredItems = CHECKLIST_ITEMS.filter(item => !item.label.includes('optional'));
  const isBasicConfigured = requiredItems.every((item) => item.isComplete);
  const completedCount = CHECKLIST_ITEMS.filter(item => item.isComplete).length;

  const maskToken = (token: string | undefined): string => {
    if (!token) return 'not-set';
    if (token.length <= 8) return '••••••••';
    return `${token.substring(0, 4)}••••${token.substring(token.length - 4)}`;
  };

  return (
    <div className="shopify-readiness" role="region" aria-labelledby="shopify-readiness-heading">
      <div className="shopify-readiness__header">
        <h3 id="shopify-readiness-heading">Shopify Integration Readiness</h3>
        <p role="status" aria-live="polite" aria-atomic="true">
          <span className={isBasicConfigured ? "badge badge--success" : "badge badge--pending"} role="status">
            {isBasicConfigured ? "Ready" : "Setup Required"}
          </span>
          {completedCount} of {CHECKLIST_ITEMS.length} steps complete
        </p>
        <p>
          Connect to Shopify for product data, checkout redirect, and order management. Only Storefront API is required for basic
          display; the Admin API enables advanced features.
        </p>
      </div>

      <ul className="shopify-readiness__checklist" role="list" aria-label="Shopify integration checklist">
        {CHECKLIST_ITEMS.map((item) => (
          <li key={item.envVar} className={item.isComplete ? 'complete' : 'incomplete'}>
            <span 
              className="shopify-readiness__status" 
              aria-hidden="true"
              role="img"
              aria-label={item.isComplete ? "Complete" : "Incomplete"}
            >
              {item.isComplete ? "✓" : "•"}
            </span>
            <div>
              <p className="shopify-readiness__label">{item.label}</p>
              <p className="shopify-readiness__description">{item.description}</p>
              {!item.isComplete && (
                <p className="shopify-readiness__env-var">
                  Missing: <code>{item.envVar}</code>
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
      
      <div className="shopify-readiness__configuration" role="group" aria-labelledby="current-config-heading">
        <h4 id="current-config-heading">Current Configuration</h4>
        <dl className="shopify-readiness__env-display" role="list">
          <div className="env-var" role="group">
            <dt className="env-var__name">SHOPIFY_STORE_DOMAIN</dt>
            <dd className="env-var__value">{getEnvVar('SHOPIFY_STORE_DOMAIN') || 'not-set'}</dd>
          </div>
          <div className="env-var" role="group">
            <dt className="env-var__name">SHOPIFY_STOREFRONT_ACCESS_TOKEN</dt>
            <dd className="env-var__value">{maskToken(getEnvVar('SHOPIFY_STOREFRONT_ACCESS_TOKEN'))}</dd>
          </div>
          <div className="env-var" role="group">
            <dt className="env-var__name">SHOPIFY_ADMIN_API_TOKEN</dt>
            <dd className="env-var__value">{maskToken(getEnvVar('SHOPIFY_ADMIN_API_TOKEN'))}</dd>
          </div>
        </dl>
      </div>

      <div className="shopify-readiness__footnote">
        {isBasicConfigured ? (
          <div className="success-message" role="status" aria-live="polite">
            <p>🎉 <strong>Shopify integration is ready!</strong></p>
            <p>You can now use Storefront API calls to fetch live product data and redirect to Shopify Checkout for purchases.</p>
          </div>
        ) : (
          <div className="setup-message" role="status" aria-live="polite">
            <h4 id="setup-required-heading">Setup Required:</h4>
            <pre className="setup-instructions" aria-labelledby="setup-required-heading">
              {generateSetupInstructions(validation)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
