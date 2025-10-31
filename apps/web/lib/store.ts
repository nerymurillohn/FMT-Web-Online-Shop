import { create } from 'zustand';

type Product = {
  sku: string;
  name: string;
  price: number;
  quantity: number;
};

type CartState = {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (sku: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  addToCart: (product) =>
    set((state) => {
      const existingProduct = state.cart.find((p) => p.sku === product.sku);
      if (existingProduct) {
        return {
          cart: state.cart.map((p) =>
            p.sku === product.sku ? { ...p, quantity: p.quantity + 1 } : p
          ),
        };
      }
      return { cart: [...state.cart, { ...product, quantity: 1 }] };
    }),
  removeFromCart: (sku) =>
    set((state) => ({
      cart: state.cart.filter((p) => p.sku !== sku),
    })),
  clearCart: () => set({ cart: [] }),
}));
