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
  title: "Catalog | Forestal MT 2025 SKU Lineup",
  description:
    "Browse the complete 2025 Forestal MT catalog featuring Batana Oil, Melipona honey, and traditional Honduran herbs.",
  openGraph: {
    title: "Forestal MT Catalog",
    description:
      "Full 2025 SKU catalog for Batana Oil, Stingless Bee Honey, and Traditional Herbs from Forestal Murillo Tejada.",
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

export default function CatalogPage() {
  return (
    <main className="catalog-page">
      <header className="catalog-page__header">
        <p className="catalog-page__eyebrow">Product catalog</p>
        <h1>Forestal MT 2025 SKU lineup</h1>
        <p>
          Explore all 46 export-ready products across Batana Oil, Stingless Bee Honey, and Traditional Herbs. Every SKU is
          photographed for quick merchandising reference and Shopify setup.
        </p>
      </header>

      {PRODUCT_COLLECTION_ORDER.map((collection) => {
        const definition = PRODUCT_COLLECTIONS[collection];
        const products = groupedProducts[collection];

        return (
          <section className="catalog-section" key={collection} aria-labelledby={`catalog-${collection}`}>
            <div className="catalog-section__header">
              <h2 id={`catalog-${collection}`}>{definition.title}</h2>
              <p>{definition.description}</p>
              <p className="catalog-section__count" aria-label={`SKUs in ${definition.title}`}>
                {products.length} SKUs
              </p>
            </div>
            <ul className="catalog-grid" aria-label={`${definition.title} product gallery`}>
              {products.map((product) => (
                <li key={product.sku} className="catalog-grid__item">
                  <article className="catalog-card">
                    <div className="catalog-card__image">
                      <Image
                        src={product.image}
                        alt={product.alt}
                        fill
                        sizes="(max-width: 768px) 80vw, (max-width: 1200px) 35vw, 20vw"
                      />
                    </div>
                    <div className="catalog-card__meta">
                      <span className="catalog-card__sku">{product.sku}</span>
                      <span className="catalog-card__line">{definition.shortLabel}</span>
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
