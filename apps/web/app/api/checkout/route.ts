import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

import { catalog, cartItemSchema } from '@/lib/catalog';
import { z } from 'zod';

const checkoutRequestSchema = z.object({
  cart: z.array(cartItemSchema),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const { cart } = checkoutRequestSchema.parse(json);

    const lineItems = cart.map((item) => {
      const product = catalog[item.sku];
      if (!product) {
        throw new Error(`Unknown product SKU: ${item.sku}`);
      }
      return {
        price: product.priceId,
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/cart`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    console.error(err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid cart data' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error creating checkout session' }, { status: 500 });
  }
}
