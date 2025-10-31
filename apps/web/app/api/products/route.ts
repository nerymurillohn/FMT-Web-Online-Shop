import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  const filePath = path.join(process.cwd(), 'data', 'products.json');
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const products = JSON.parse(fileContent);
  return NextResponse.json(products);
}
