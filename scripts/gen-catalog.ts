import fs from 'fs-extra';
import path from 'path';
import matter from 'gray-matter';
import { z } from 'zod';

const productSchema = z.object({
  sku: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string(),
  sourcing: z.string(),
  // Add other fields from the product description schema here
});

const SRC_DIR = path.join(process.cwd(), 'content', 'products');
const OUTPUT_DIR = path.join(process.cwd(), 'apps', 'web', 'data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'products.json');

async function generateCatalog() {
  console.log('Generating product catalog...');

  await fs.ensureDir(SRC_DIR);
  await fs.ensureDir(OUTPUT_DIR);

  // Mock product data for now
  const mockProducts = [
    {
      sku: 'BO-001',
      name: 'Batana Oil',
      category: 'Oils',
      description: 'Pure, raw, and unrefined Batana Oil from La Mosquitia, Honduras.',
      sourcing: 'Directly from the Tawira people.',
      content: 'This is the body of the product page.'
    },
    {
        sku: 'SBH-001',
        name: 'Stingless Bee Honey',
        category: 'Honey',
        description: 'Rare and medicinal honey from native stingless bees.',
        sourcing: 'Sustainably harvested from the rainforest.',
        content: 'This is the body of the product page.'
    },
    {
        sku: 'TH-001',
        name: 'Traditional Herbs',
        category: 'Herbs',
        description: 'A selection of traditional Honduran medicinal herbs.',
        sourcing: 'Wildcrafted by indigenous communities.',
        content: 'This is the body of the product page.'
    }
  ];

  for (const product of mockProducts) {
    const { content, ...data } = product;
    const filePath = path.join(SRC_DIR, `${product.sku}.md`);
    await fs.writeFile(filePath, matter.stringify(content, data));
  }

  const files = await fs.readdir(SRC_DIR);
  const products = [];

  for (const file of files) {
    if (path.extname(file) === '.md') {
      const filePath = path.join(SRC_DIR, file);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const { data } = matter(fileContent);
      const validatedData = productSchema.parse(data);
      products.push(validatedData);
    }
  }

  await fs.writeJson(OUTPUT_FILE, products, { spaces: 2 });

  console.log(`✅ Product catalog generated at ${OUTPUT_FILE}`);
}

generateCatalog().catch((error) => {
  console.error('❌ Error generating product catalog:', error);
  process.exit(1);
});
