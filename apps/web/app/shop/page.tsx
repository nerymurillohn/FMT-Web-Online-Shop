import type { Metadata } from "next";
import Image from "next/image";
import {
  CATALOG_PRODUCTS,
  PRODUCT_COLLECTIONS,
  PRODUCT_COLLECTION_ORDER,
  type CatalogProduct,
  type ProductCollection
} from "../../data/catalog";

export const metadata: Metadata = {
  title: "Shop | Forestal MT 2025 Product Catalog",
  description:
    "Shop the complete 2025 Forestal MT lineup featuring Batana Oil, Melipona honey, and traditional Honduran herbs.",
  openGraph: {
    title: "Forestal MT Shop",
    description:
      "Browse the full 2025 product catalog for Batana Oil, Stingless Bee Honey, and Traditional Herbs from Forestal Murillo Tejada.",
    type: "website"
  }
};

function groupProductsByCollection(products: CatalogProduct[]): Record<ProductCollection, CatalogProduct[]> {
  return products.reduce<Record<ProductCollection, CatalogProduct[]>>((accumulator, product) => {
    if (!accumulator[product.collection]) {
      accumulator[product.collection] = [];
    }

    accumulator[product.collection].push(product);
    return accumulator;
  }, {
    "batana-oil": [],
    "stingless-bee-honey": [],
    "traditional-herbs": []
  });
}

const groupedProducts = groupProductsByCollection(CATALOG_PRODUCTS);

export default function ShopPage() {
  return (
    <main className="shop-page">
      <header className="shop-page__header">
        <p className="shop-page__eyebrow">Product shop</p>
        <h1>Forestal MT 2025 product catalog</h1>
        <p>
          Explore all 46 export-ready products across Batana Oil, Stingless Bee Honey, and Traditional Herbs. Every SKU is
          photographed for quick merchandising reference and Shopify setup.
        </p>
      </header>

      {PRODUCT_COLLECTION_ORDER.map((collection) => {
        const definition = PRODUCT_COLLECTIONS[collection];
        const products = groupedProducts[collection];

        return (
          <section className="shop-section" key={collection} aria-labelledby={`shop-${collection}`}>
            <div className="shop-section__header">
              <h2 id={`shop-${collection}`}>{definition.title}</h2>
              <p>{definition.description}</p>
              <p className="shop-section__count" aria-label={`SKUs in ${definition.title}`}>
                {products.length} SKUs
              </p>
            </div>
            <ul className="shop-grid" aria-label={`${definition.title} product gallery`}>
              {products.map((product) => (
                <li key={product.sku}>
                  <article className="shop-card">
                    <div className="shop-card__image">
                      <Image
                        src={product.image}
                        alt={product.alt}
                        fill
                        style={{ objectFit: "contain", objectPosition: "center" }}
                        sizes="(max-width: 768px) 80vw, (max-width: 1200px) 35vw, 20vw"
                      />
                    </div>
                    <div className="shop-card__meta">
                      <span className="shop-card__sku">{product.sku}</span>
                      <span className="shop-card__line">{definition.shortLabel}</span>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </main>
  );
}
