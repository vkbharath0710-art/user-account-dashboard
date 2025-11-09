import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: number;
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  description: string;
}

interface CartStore {
  items: CartItem[];
  cardId: string;
  setCardId: (cardId: string) => void;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cardId: '',
      setCardId: (cardId: string) => set({ cardId }),
      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find((i) => i.itemId === item.itemId);

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.itemId === item.itemId
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({
            items: [...items, { ...item, quantity: 1 }],
          });
        }
      },
      removeItem: (itemId) => {
        set({
          items: get().items.filter((i) => i.itemId !== itemId),
        });
      },
      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.itemId === itemId ? { ...i, quantity } : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'canteen-cart-storage',
    }
  )
);
