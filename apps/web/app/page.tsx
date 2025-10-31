import type { Metadata } from "next";
import { Hero } from "@/components/Hero";

export const metadata: Metadata = {
  title: "Forestal MT | Exporting Nature Without Borders",
  description:
    "Forestal Murillo Tejada combines Shopify commerce, DHL Express shipping, and localized pricing to deliver Honduran ethnobotanical products worldwide.",
  keywords: [
    "Forestal MT",
    "Shopify",
    "DHL Express",
    "batana oil",
    "stingless bee honey",
    "Honduras exports"
  ],
  openGraph: {
    title: "Forestal MT | Exporting Nature Without Borders",
    description:
      "Discover how Forestal Murillo Tejada ships Honduran ethnobotanical treasures globally with Shopify, localized pricing previews, and DHL Express fulfillment.",
    type: "website"
  }
};

export default function Home() {
  return (
    <main className="homepage">
      <Hero />

      <section className="py-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
          {/* Featured products will be implemented here */}
        </div>
      </section>

      <section className="py-12 bg-secondary">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Best Sellers</h2>
          {/* Best sellers will be implemented here */}
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">New Arrivals</h2>
          {/* New arrivals will be implemented here */}
        </div>
      </section>

      <section className="py-12 bg-secondary">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Countdown / Stats</h2>
          {/* Countdown / Stats will be implemented here */}
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">What Our Customers Are Saying</h2>
          {/* Testimonials slice will be implemented here */}
        </div>
      </section>
    </main>
  );
}
