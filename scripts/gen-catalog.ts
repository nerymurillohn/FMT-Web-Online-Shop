import fs from 'fs-extra';
import path from 'path';
import matter from 'gray-matter';
import { z } from 'zod';

const productSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  category: z.enum(['Oils', 'Honey', 'Herbs', 'Traditional Products']),
  description: z.string().min(10),
  sourcing: z.string().min(10),
  content: z.string().optional(),
  price: z.number().positive().optional(),
  currency: z.enum(['USD', 'HNL']).default('USD'),
  images: z.array(z.string()).min(1),
  inStock: z.boolean().default(true),
  featured: z.boolean().default(false),
  variants: z.array(z.object({
    size: z.string(),
    price: z.number().positive(),
    sku: z.string()
  })).optional(),
  stripeProductId: z.string().optional(),
  stripePriceId: z.string().optional(),
});

const SRC_DIR = path.join(process.cwd(), 'content', 'products');
const OUTPUT_DIR = path.join(process.cwd(), 'apps', 'web', 'data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'products.json');
const IMAGES_DIR = path.join(process.cwd(), 'apps', 'web', 'public', 'images', 'catalog');

async function generateCatalog() {
  console.log('Generating product catalog...');

  await fs.ensureDir(SRC_DIR);
  await fs.ensureDir(OUTPUT_DIR);

  // Get all available product images (46 PNGs)
  const availableImages = await fs.readdir(IMAGES_DIR);
  const pngImages = availableImages.filter(f => f.endsWith('.png'));
  
  console.log(`Found ${pngImages.length} product images in catalog`);

  const files = await fs.readdir(SRC_DIR);
  
  if (files.filter(f => f.endsWith('.md')).length === 0) {
    console.error('❌ No product markdown files found in content/products/');
    console.log('Create .md files matching your SKUs (e.g., BO-001.md, SBH-001.md)');
    process.exit(1);
  }

  const products = [];

  for (const file of files) {
    if (path.extname(file) === '.md') {
      const filePath = path.join(SRC_DIR, file);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const { data, content } = matter(fileContent);
      
      // Auto-map SKU to image file (e.g., BO-001.png)
      const imagePath = `/images/catalog/${data.sku}.png`;
      const imageExists = pngImages.includes(`${data.sku}.png`);
      
      if (!imageExists) {
        console.warn(`⚠️  Warning: No image found for SKU ${data.sku}`);
      }
      
      // Ensure images array exists
      if (!data.images || data.images.length === 0) {
        data.images = imageExists ? [imagePath] : [];
      }
      
      // Add content to data
      data.content = content;
      
      const validatedData = productSchema.parse(data);
      products.push(validatedData);
    }
  }

  await fs.writeJson(OUTPUT_FILE, products, { spaces: 2 });

  console.log(`✅ Product catalog generated at ${OUTPUT_FILE}`);
  console.log(`📦 Total products: ${products.length}`);
}

generateCatalog().catch((error) => {
  console.error('❌ Error generating product catalog:', error);
  process.exit(1);
});
