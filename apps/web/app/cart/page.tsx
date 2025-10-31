import { Cart } from '@/components/Cart';

export default function CartPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
      <Cart />
    </div>
  );
}
