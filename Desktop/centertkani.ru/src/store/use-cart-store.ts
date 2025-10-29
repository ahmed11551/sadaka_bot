import { create } from "zustand";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number; // decimal value for fabric
  minQuantity: number;
  step: number;
  attributes?: Record<string, string>;
}

export interface CartStore {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => Promise<boolean>;
  promoDiscount: number;
  promoCode: string | null;
  calculateTotals: () => void;
}

export const useCartStore = create<CartStore>()((set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      promoDiscount: 0,
      promoCode: null,

      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find((i) => i.id === item.id);
        
        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
        
        get().calculateTotals();
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
        get().calculateTotals();
      },

      updateQuantity: (id, quantity) => {
        const item = get().items.find((i) => i.id === id);
        if (!item || quantity < item.minQuantity) return;
        
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        });
        get().calculateTotals();
      },

      applyPromoCode: async (code) => {
        // TODO: Implement API call to validate promo code
        // For now, mock implementation
        set({ promoCode: code, promoDiscount: 0.1 });
        return true;
      },

      clearCart: () => {
        set({ items: [], promoCode: null, promoDiscount: 0 });
      },

      calculateTotals: () => {
        const { items, promoDiscount } = get();
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const finalPrice = totalPrice * (1 - promoDiscount);
        
        set({ totalItems, totalPrice: finalPrice });
      },
    })
);

