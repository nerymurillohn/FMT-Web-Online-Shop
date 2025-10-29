export type ProductCollection = "batana-oil" | "stingless-bee-honey" | "traditional-herbs";

export type CatalogProduct = {
  sku: string;
  image: string;
  collection: ProductCollection;
  alt: string;
};

export const PRODUCT_COLLECTIONS: Record<
  ProductCollection,
  { title: string; description: string; shortLabel: string }
> = {
  "batana-oil": {
    title: "Batana Oil",
    description:
      "Ancestral Miskito elixirs crafted for hair, scalp, and skin rituals. This line spans finished goods for retail shelves and bulk formats for formulators.",
    shortLabel: "Batana Oil"
  },
  "stingless-bee-honey": {
    title: "Stingless Bee Honey",
    description:
      "Raw Melipona honey harvested from Honduran forests. Packed for premium wellness retailers and clinical practitioners.",
    shortLabel: "Stingless Bee Honey"
  },
  "traditional-herbs": {
    title: "Traditional Herbs",
    description:
      "Wildcrafted botanicals shade-dried to protect potency. Each SKU preserves Honduran ethnobotanical wisdom for formulators and herbalists.",
    shortLabel: "Traditional Herb"
  }
};

export const PRODUCT_COLLECTION_ORDER: ProductCollection[] = [
  "batana-oil",
  "stingless-bee-honey",
  "traditional-herbs"
];

const IMAGE_BASE_PATH = "/images/catalog" as const;

export const CATALOG_PRODUCTS: CatalogProduct[] = [
  { sku: "FMT-BO-BO-2025", collection: "batana-oil", image: `${IMAGE_BASE_PATH}/FMT-BO-BO-2025.png`, alt: "Product photography for SKU FMT-BO-BO-2025 from Forestal MT" },
  { sku: "FMT-BO-CO-2025", collection: "batana-oil", image: `${IMAGE_BASE_PATH}/FMT-BO-CO-2025.png`, alt: "Product photography for SKU FMT-BO-CO-2025 from Forestal MT" },
  { sku: "FMT-BO-SB-2025", collection: "batana-oil", image: `${IMAGE_BASE_PATH}/FMT-BO-SB-2025.png`, alt: "Product photography for SKU FMT-BO-SB-2025 from Forestal MT" },
  { sku: "FMT-BO-SH-2025", collection: "batana-oil", image: `${IMAGE_BASE_PATH}/FMT-BO-SH-2025.png`, alt: "Product photography for SKU FMT-BO-SH-2025 from Forestal MT" },
  { sku: "FMT-SBH-JM-2025", collection: "stingless-bee-honey", image: `${IMAGE_BASE_PATH}/FMT-SBH-JM-2025.png`, alt: "Product photography for SKU FMT-SBH-JM-2025 from Forestal MT" },
  { sku: "FMT-TH-AL-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-AL-2025.png`, alt: "Product photography for SKU FMT-TH-AL-2025 from Forestal MT" },
  { sku: "FMT-TH-BL-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-BL-2025.png`, alt: "Product photography for SKU FMT-TH-BL-2025 from Forestal MT" },
  { sku: "FMT-TH-BY-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-BY-2025.png`, alt: "Product photography for SKU FMT-TH-BY-2025 from Forestal MT" },
  { sku: "FMT-TH-CA-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-CA-2025.png`, alt: "Product photography for SKU FMT-TH-CA-2025 from Forestal MT" },
  { sku: "FMT-TH-CC-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-CC-2025.png`, alt: "Product photography for SKU FMT-TH-CC-2025 from Forestal MT" },
  { sku: "FMT-TH-CD-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-CD-2025.png`, alt: "Product photography for SKU FMT-TH-CD-2025 from Forestal MT" },
  { sku: "FMT-TH-CF-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-CF-2025.png`, alt: "Product photography for SKU FMT-TH-CF-2025 from Forestal MT" },
  { sku: "FMT-TH-CI-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-CI-2025.png`, alt: "Product photography for SKU FMT-TH-CI-2025 from Forestal MT" },
  { sku: "FMT-TH-CR-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-CR-2025.png`, alt: "Product photography for SKU FMT-TH-CR-2025 from Forestal MT" },
  { sku: "FMT-TH-CT-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-CT-2025.png`, alt: "Product photography for SKU FMT-TH-CT-2025 from Forestal MT" },
  { sku: "FMT-TH-CW-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-CW-2025.png`, alt: "Product photography for SKU FMT-TH-CW-2025 from Forestal MT" },
  { sku: "FMT-TH-DB-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-DB-2025.png`, alt: "Product photography for SKU FMT-TH-DB-2025 from Forestal MT" },
  { sku: "FMT-TH-DF-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-DF-2025.png`, alt: "Product photography for SKU FMT-TH-DF-2025 from Forestal MT" },
  { sku: "FMT-TH-DO-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-DO-2025.png`, alt: "Product photography for SKU FMT-TH-DO-2025 from Forestal MT" },
  { sku: "FMT-TH-EU-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-EU-2025.png`, alt: "Product photography for SKU FMT-TH-EU-2025 from Forestal MT" },
  { sku: "FMT-TH-GL-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-GL-2025.png`, alt: "Product photography for SKU FMT-TH-GL-2025 from Forestal MT" },
  { sku: "FMT-TH-GLB-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-GLB-2025.png`, alt: "Product photography for SKU FMT-TH-GLB-2025 from Forestal MT" },
  { sku: "FMT-TH-GU-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-GU-2025.png`, alt: "Product photography for SKU FMT-TH-GU-2025 from Forestal MT" },
  { sku: "FMT-TH-HF-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-HF-2025.png`, alt: "Product photography for SKU FMT-TH-HF-2025 from Forestal MT" },
  { sku: "FMT-TH-HG-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-HG-2025.png`, alt: "Product photography for SKU FMT-TH-HG-2025 from Forestal MT" },
  { sku: "FMT-TH-HT-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-HT-2025.png`, alt: "Product photography for SKU FMT-TH-HT-2025 from Forestal MT" },
  { sku: "FMT-TH-KR-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-KR-2025.png`, alt: "Product photography for SKU FMT-TH-KR-2025 from Forestal MT" },
  { sku: "FMT-TH-LG-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-LG-2025.png`, alt: "Product photography for SKU FMT-TH-LG-2025 from Forestal MT" },
  { sku: "FMT-TH-LV-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-LV-2025.png`, alt: "Product photography for SKU FMT-TH-LV-2025 from Forestal MT" },
  { sku: "FMT-TH-MA-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-MA-2025.png`, alt: "Product photography for SKU FMT-TH-MA-2025 from Forestal MT" },
  { sku: "FMT-TH-ML-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-ML-2025.png`, alt: "Product photography for SKU FMT-TH-ML-2025 from Forestal MT" },
  { sku: "FMT-TH-MO-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-MO-2025.png`, alt: "Product photography for SKU FMT-TH-MO-2025 from Forestal MT" },
  { sku: "FMT-TH-MU-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-MU-2025.png`, alt: "Product photography for SKU FMT-TH-MU-2025 from Forestal MT" },
  { sku: "FMT-TH-NL-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-NL-2025.png`, alt: "Product photography for SKU FMT-TH-NL-2025 from Forestal MT" },
  { sku: "FMT-TH-NM-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-NM-2025.png`, alt: "Product photography for SKU FMT-TH-NM-2025 from Forestal MT" },
  { sku: "FMT-TH-PC-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-PC-2025.png`, alt: "Product photography for SKU FMT-TH-PC-2025 from Forestal MT" },
  { sku: "FMT-TH-PG-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-PG-2025.png`, alt: "Product photography for SKU FMT-TH-PG-2025 from Forestal MT" },
  { sku: "FMT-TH-PL-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-PL-2025.png`, alt: "Product photography for SKU FMT-TH-PL-2025 from Forestal MT" },
  { sku: "FMT-TH-PN-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-PN-2025.png`, alt: "Product photography for SKU FMT-TH-PN-2025 from Forestal MT" },
  { sku: "FMT-TH-PS-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-PS-2025.png`, alt: "Product photography for SKU FMT-TH-PS-2025 from Forestal MT" },
  { sku: "FMT-TH-SL-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-SL-2025.png`, alt: "Product photography for SKU FMT-TH-SL-2025 from Forestal MT" },
  { sku: "FMT-TH-SN-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-SN-2025.png`, alt: "Product photography for SKU FMT-TH-SN-2025 from Forestal MT" },
  { sku: "FMT-TH-SP-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-SP-2025.png`, alt: "Product photography for SKU FMT-TH-SP-2025 from Forestal MT" },
  { sku: "FMT-TH-SR-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-SR-2025.png`, alt: "Product photography for SKU FMT-TH-SR-2025 from Forestal MT" },
  { sku: "FMT-TH-TL-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-TL-2025.png`, alt: "Product photography for SKU FMT-TH-TL-2025 from Forestal MT" },
  { sku: "FMT-TH-TT-2025", collection: "traditional-herbs", image: `${IMAGE_BASE_PATH}/FMT-TH-TT-2025.png`, alt: "Product photography for SKU FMT-TH-TT-2025 from Forestal MT" }
];

export function getCatalogProducts(collection?: ProductCollection): CatalogProduct[] {
  if (!collection) {
    return [...CATALOG_PRODUCTS];
  }

  return CATALOG_PRODUCTS.filter((product) => product.collection === collection);
}

export function getProductCount(collection?: ProductCollection): number {
  if (!collection) {
    return CATALOG_PRODUCTS.length;
  }

  return CATALOG_PRODUCTS.filter((product) => product.collection === collection).length;
}
