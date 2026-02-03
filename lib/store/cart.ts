import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartStore } from '@/types/cart';
import { Product } from '@/types/product';

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      // Add item to cart
      addItem: (product: Product) => {
        const items = get().items;
        const existingItem = items.find(
          (item) => item.product.id === product.id
        );

        if (existingItem) {
          // Item exists, increase quantity
          set({
            items: items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          // New item, add to cart
          set({ items: [...items, { product, quantity: 1 }] });
        }
      },

      // Remove item from cart
      removeItem: (productId: string) => {
        set({
          items: get().items.filter((item) => item.product.id !== productId),
        });
      },

      // Update item quantity
      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          ),
        });
      },

      // Clear entire cart
      clearCart: () => {
        set({ items: [] });
      },

      // Get total number of items
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      // Get total price
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) =>
            total + parseFloat(item.product.price) * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage', // localStorage key
    }
  )
);
