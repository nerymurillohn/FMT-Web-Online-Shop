'use client';

import { useCartStore } from '@/lib/store';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function Cart() {
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);

  const handleCheckout = async () => {
    const stripe = await stripePromise;
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cart }),
    });

    const { sessionId } = await response.json();
    if (stripe) {
      stripe.redirectToCheckout({ sessionId });
    }
  };

  return (
    <div className="border p-4 rounded">
      <h2 className="text-xl font-semibold mb-4">Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cart.map((product) => (
              <li key={product.sku} className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p>Quantity: {product.quantity}</p>
                </div>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeFromCart(product.sku)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button
            className="bg-primary text-primary-foreground px-4 py-2 rounded mt-4"
            onClick={handleCheckout}
          >
            Checkout
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded mt-4 ml-2"
            onClick={() => clearCart()}
          >
            Clear Cart
          </button>
        </>
      )}
    </div>
  );
}
