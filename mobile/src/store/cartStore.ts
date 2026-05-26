import { create } from 'zustand';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  imageUri?: string;
  farmerName: string;
  farmerId: string;
  maxQuantity?: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;

  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const calcTotals = (items: CartItem[]) => ({
  totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
  totalPrice: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
});

export const useCartStore = create<CartState>((set) => ({
  items: [],
  totalItems: 0,
  totalPrice: 0,

  addItem: (newItem) =>
    set((state) => {
      const existing = state.items.find((i) => i.productId === newItem.productId);
      let items: CartItem[];
      if (existing) {
        items = state.items.map((i) =>
          i.productId === newItem.productId
            ? { ...i, quantity: Math.min(i.quantity + 1, i.maxQuantity ?? 999) }
            : i
        );
      } else {
        items = [...state.items, { ...newItem, quantity: 1 }];
      }
      return { items, ...calcTotals(items) };
    }),

  removeItem: (productId) =>
    set((state) => {
      const items = state.items.filter((i) => i.productId !== productId);
      return { items, ...calcTotals(items) };
    }),

  updateQuantity: (productId, quantity) =>
    set((state) => {
      const items =
        quantity <= 0
          ? state.items.filter((i) => i.productId !== productId)
          : state.items.map((i) =>
              i.productId === productId ? { ...i, quantity } : i
            );
      return { items, ...calcTotals(items) };
    }),

  clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),
}));
