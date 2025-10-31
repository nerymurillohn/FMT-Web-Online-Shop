import { z } from 'zod';

export const cartItemSchema = z.object({
  sku: z.string(),
  quantity: z.number().int().min(1),
});

export type CartItem = z.infer<typeof cartItemSchema>;

export const catalog: Record<string, {
    sku: string;
    name: string;
    priceId: string;
    price: number;
}> = {
  'BO-001': {
    sku: 'BO-001',
    name: 'Batana Oil',
    priceId: 'price_1PjA6QEpA1qS7u5xZgX6f9q8', // Batana Oil - 50 USD
    price: 5000,
  },
  'SBH-001': {
    sku: 'SBH-001',
    name: 'Stingless Bee Honey',
    priceId: 'price_1PjA6hEpA1qS7u5x8fG9g0h1', // Stingless Bee Honey - 75 USD
    price: 7500,
  },
  'TH-001': {
    sku: 'TH-001',
    name: 'Traditional Herbs',
    priceId: 'price_1PjA71EpA1qS7u5xI2j3k4l5', // Traditional Herbs - 25 USD
    price: 2500,
  },
};
