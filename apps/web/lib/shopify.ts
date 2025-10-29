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

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

const SHOPIFY_STOREFRONT_ENDPOINT = domain
  ? `https://${domain}/api/2024-04/graphql.json`
  : undefined;

export async function shopifyFetch<T>({ query, variables, cache = "force-cache" }: ShopifyFetchParams): Promise<ShopifyFetchResult<T>> {
  if (!SHOPIFY_STOREFRONT_ENDPOINT || !storefrontToken) {
    return { data: null, status: "unconfigured" };
  }

  try {
    const response = await fetch(SHOPIFY_STOREFRONT_ENDPOINT, {
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
      return { data: null, status: "error", errors: [{ message: errorBody }] };
    }

    const payload = await response.json();
    return { data: payload.data as T, errors: payload.errors, status: "ok" };
  } catch (error) {
    console.error("Failed to contact Shopify", error);
    return {
      data: null,
      status: "error",
      errors: [{ message: error instanceof Error ? error.message : "Unknown error" }]
    };
  }
}

export async function getAllProducts() {
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
