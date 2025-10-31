'use client';

import { BulkPricingModal } from '@/components/BulkPricingModal';
import { ProductJsonLd } from 'next-seo';
import { useCartStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import { ImageGallery } from '@/components/ImageGallery';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<any>(null);
  const addToCart = useCartStore((state) => state.addToCart);
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';

  useEffect(() => {
    async function fetchProduct() {
      const response = await fetch('/api/products');
      const products = await response.json();
      const product = products.find((p: any) => p.sku === params.slug);
      setProduct(product);
    }
    fetchProduct();
  }, [params.slug]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ProductJsonLd
        name={product.name}
        image={[`https://forestalmt.com/products/${product.sku}.jpg`]}
        description={product.description}
        sku={product.sku}
        brand="Forestal MT"
        offers={[
          {
            price: '10.00',
            priceCurrency: 'USD',
            itemCondition: 'https://schema.org/NewCondition',
            availability: 'https://schema.org/InStock',
            seller: {
              name: 'Forestal MT',
            },
          },
        ]}
      />
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <ImageGallery />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="mb-4">{product.description}</p>
            <div className="mt-4">
              <button
                className="bg-primary text-primary-foreground px-4 py-2 rounded mr-2"
                onClick={() => addToCart({ ...product, price: 10.00, quantity: 1 })}
              >
                Add to Cart
              </button>
              <BulkPricingModal whatsappNumber={whatsappNumber} />
            </div>
          </div>
        </div>
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Product Details</h2>
          {/* Product structure sections will be implemented here */}
        </div>
      </div>
    </>
  );
}
