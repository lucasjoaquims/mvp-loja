import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
  slug: string;
}

interface CartStore {
  items: CartItem[];
  coupon: { code: string; type: "PERCENTAGE" | "FIXED"; value: number } | null;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string, size?: string, color?: string) => void;
  updateQuantity: (id: string, size: string | undefined, color: string | undefined, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: { code: string; type: "PERCENTAGE" | "FIXED"; value: number }) => void;
  removeCoupon: () => void;
  getSubtotal: () => number;
  getDiscount: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.id === item.id && i.size === item.size && i.color === item.color
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id && i.size === item.size && i.color === item.color
                  ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: item.quantity ?? 1 }] };
        });
      },

      removeItem: (id, size, color) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.id === id && i.size === size && i.color === color)
          ),
        }));
      },

      updateQuantity: (id, size, color, quantity) => {
        if (quantity < 1) {
          get().removeItem(id, size, color);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id && i.size === size && i.color === color ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [], coupon: null }),

      applyCoupon: (coupon) => set({ coupon }),

      removeCoupon: () => set({ coupon: null }),

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      },

      getDiscount: () => {
        const { items, coupon } = get();
        const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);

        let discount = 0;
        // Auto discount: 3+ items = 10% off
        if (totalQty >= 3) discount += subtotal * 0.1;

        if (coupon) {
          if (coupon.type === "PERCENTAGE") discount += subtotal * (coupon.value / 100);
          else discount += coupon.value;
        }

        return Math.min(discount, subtotal);
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        return Math.max(subtotal - discount, 0);
      },

      getItemCount: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
