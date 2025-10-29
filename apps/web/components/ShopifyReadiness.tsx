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
    <div className="shopify-readiness">
      <div className="shopify-readiness__header">
        <h3>Shopify Integration Readiness</h3>
        <div className="shopify-readiness__status-badge">
          {isShopifyEnabled ? (
            <span className="badge badge--success">✓ Ready ({completedCount}/3)</span>
          ) : (
            <span className="badge badge--warning">⚠ Configuration Required</span>
          )}
        </div>
        <p>
          The site is wired to use Shopify as the commerce engine. Provide the credentials below to unlock live product data,
          cart, and checkout functionality.
        </p>
      </div>
      
      <ul className="shopify-readiness__list">
        {CHECKLIST_ITEMS.map((item) => (
          <li key={item.label} className={item.isComplete ? "is-complete" : "is-pending"}>
            <span className="shopify-readiness__status" aria-hidden="true">
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
      
      <div className="shopify-readiness__configuration">
        <h4>Current Configuration</h4>
        <div className="shopify-readiness__env-display">
          <div className="env-var">
            <span className="env-var__name">SHOPIFY_STORE_DOMAIN</span>
            <span className="env-var__value">{getEnvVar('SHOPIFY_STORE_DOMAIN') || 'not-set'}</span>
          </div>
          <div className="env-var">
            <span className="env-var__name">SHOPIFY_STOREFRONT_ACCESS_TOKEN</span>
            <span className="env-var__value">{maskToken(getEnvVar('SHOPIFY_STOREFRONT_ACCESS_TOKEN'))}</span>
          </div>
          <div className="env-var">
            <span className="env-var__name">SHOPIFY_ADMIN_API_TOKEN</span>
            <span className="env-var__value">{maskToken(getEnvVar('SHOPIFY_ADMIN_API_TOKEN'))}</span>
          </div>
        </div>
      </div>

      <div className="shopify-readiness__footnote">
        {isBasicConfigured ? (
          <div className="success-message">
            <p>🎉 <strong>Shopify integration is ready!</strong></p>
            <p>You can now use Storefront API calls to fetch live product data and redirect to Shopify Checkout for purchases.</p>
          </div>
        ) : (
          <div className="setup-message">
            <p><strong>Setup Required:</strong></p>
            <pre className="setup-instructions">
              {generateSetupInstructions(validation)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
