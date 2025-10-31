'use client';

import { motion } from 'framer-motion';
import Image from "next/image";

type ProductLine = {
  title: string;
  description: string;
  image: string;
  alt: string;
};

const PRODUCT_LINES: ProductLine[] = [
  {
    title: "Batana Oil",
    description: "Ancestral Miskito elixir for hair, scalp, and beard care.",
    image: "/images/catalog/FMT-BO-BO-2025.png",
    alt: "Product photography of Forestal MT SKU FMT-BO-BO-2025 batana oil"
  },
  {
    title: "Stingless Bee Honey",
    description: "Raw stingless bee honey treasured by the Mayans for holistic wellness.",
    image: "/images/catalog/FMT-SBH-JM-2025.png",
    alt: "Product photography of Forestal MT SKU FMT-SBH-JM-2025 stingless bee honey"
  },
  {
    title: "Traditional Herbs",
    description: "Wildcrafted botanicals preserving Honduran ancestral wisdom.",
    image: "/images/catalog/FMT-TH-AL-2025.png",
    alt: "Product photography of Forestal MT SKU FMT-TH-AL-2025 traditional herbs"
  }
];

export function Hero() {
  return (
    <motion.section
      className="hero"
      aria-labelledby="hero-heading"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="hero__copy">
        <motion.span
          className="hero__eyebrow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Exporting Nature Without Borders
        </motion.span>
        <motion.h1
          id="hero-heading"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Honduras&rsquo; ethnobotanical heritage, delivered globally with Shopify and DHL Express
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Forestal Murillo Tejada ships authentic batana oil, stingless bee honey, and traditional herbs to the world. The site is
          engineered for international buyers with localized pricing, DHL Express lanes, and 24/7 AI assistance.
        </motion.p>
        <div className="hero__cta-group">
          <a
            className="hero__cta"
            href="/shop"
            aria-label="Navigate to the full Forestal MT product catalog"
          >
            Shop Now
          </a>
        </div>
      </div>
      <div className="hero__products">
        {PRODUCT_LINES.map((item, index) => (
          <motion.div
            key={item.title}
            className="hero-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 + index * 0.2 }}
          >
            <div className="hero-card__image">
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 45vw, 20vw"
                loading="lazy"
                aria-label={`Product image for ${item.title}: ${item.alt}`}
              />
            </div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
