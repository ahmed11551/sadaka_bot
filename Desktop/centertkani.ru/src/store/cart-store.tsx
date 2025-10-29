"use client";

import { createContext, useContext, ReactNode } from "react";
import { useCartStore, CartStore } from "./use-cart-store";

type CartContextType = ReturnType<typeof useCartStore>;

const CartContext = createContext<Partial<CartStore> | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const store = useCartStore();
  return <CartContext.Provider value={store}>{children}</CartContext.Provider>;
}

export function useCart(): CartStore {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context as CartStore;
}

