import { getEnvVar, isFeatureEnabled } from './env';

export type ShopifyFetchParams = {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
};

type ShopifyGraphQLError = {
  message: string;
};

type ShopifyFetchResult<T> = {
  data: T | null;
  errors?: ShopifyGraphQLError[];
  status: "ok" | "unconfigured" | "error";
};

/**
 * Checks if Shopify integration is properly configured
 */
export function isShopifyConfigured(): boolean {
  return isFeatureEnabled('shopify');
}

/**
 * Gets the Shopify Storefront API endpoint if configured
 */
function getStorefrontEndpoint(): string | null {
  const domain = getEnvVar('SHOPIFY_STORE_DOMAIN');
  return domain ? `https://${domain}/api/2024-04/graphql.json` : null;
}

/**
 * Performs a GraphQL request to Shopify Storefront API
 */
export async function shopifyFetch<T>({
  query,
  variables,
  cache = "force-cache"
}: ShopifyFetchParams): Promise<ShopifyFetchResult<T>> {
  const endpoint = getStorefrontEndpoint();
  const storefrontToken = getEnvVar('SHOPIFY_STOREFRONT_ACCESS_TOKEN');

  if (!endpoint || !storefrontToken) {
    console.warn('Shopify integration not configured. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local');
    return {
      data: null,
      status: "unconfigured",
      errors: [{
        message: 'Shopify integration requires SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variables'
      }]
    };
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontToken
      },
      body: JSON.stringify({ query, variables }),
      cache
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Shopify Storefront API error", response.status, errorBody);
      return {
        data: null,
        status: "error",
        errors: [{
          message: `Shopify API error (${response.status}): ${errorBody}`
        }]
      };
    }

    const payload = await response.json();
    
    if (payload.errors && payload.errors.length > 0) {
      console.error('Shopify GraphQL errors:', payload.errors);
      return {
        data: payload.data as T,
        errors: payload.errors,
        status: "error"
      };
    }

    return {
      data: payload.data as T,
      status: "ok"
    };
  } catch (error) {
    console.error("Failed to contact Shopify", error);
    return {
      data: null,
      status: "error",
      errors: [{
        message: error instanceof Error ? error.message : "Unknown error contacting Shopify"
      }]
    };
  }
}

/**
 * Fetches all products from Shopify
 */
export async function getAllProducts() {
  if (!isShopifyConfigured()) {
    return {
      data: null,
      status: "unconfigured" as const,
      errors: [{
        message: 'Shopify integration not configured'
      }]
    };
  }

  const query = `#graphql
    query Products($first: Int!) {
      products(first: $first) {
        nodes {
          id
          title
          handle
          description
          featuredImage {
            url
            altText
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `;

  const result = await shopifyFetch<{ products: { nodes: unknown[] } }>({
    query,
    variables: { first: 12 }
  });

  return result;
}

/**
 * Gets a sample product for testing/development
 */
export function getSampleProduct() {
  return {
    id: 'sample-1',
    title: 'Batana Oil - 30ml',
    handle: 'batana-oil-30ml',
    description: 'Premium ancestral Miskito elixir for hair, scalp, and beard care.',
    featuredImage: {
      url: '/images/batana-placeholder.svg',
      altText: 'Batana Oil product image'
    },
    priceRange: {
      minVariantPrice: {
        amount: '45.00',
        currencyCode: 'USD'
      }
    }
  };
}
