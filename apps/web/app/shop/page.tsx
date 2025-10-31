'use client';

import { promises as fs } from 'fs';
import path from 'path';
import { useEffect, useState } from 'react';

async function getProducts() {
  const filePath = path.join(process.cwd(), 'data', 'products.json');
  const fileContent = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    async function fetchProducts() {
      const products = await getProducts();
      setProducts(products);
      setFilteredProducts(products);
      const categories = ['all', ...Array.from(new Set(products.map((p: any) => p.category)))];
      setCategories(categories as string[]);
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.category === selectedCategory));
    }
  }, [selectedCategory, products]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Shop</h1>
      <div className="flex mb-4">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 mr-2 rounded ${
              selectedCategory === category ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product: any) => (
          <div key={product.sku} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p>{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
