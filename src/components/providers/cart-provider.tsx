"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

type CartContextType = {
  count: number;
  refresh: () => Promise<void>;
};

const CartContext = createContext<CartContextType>({ count: 0, refresh: async () => {} });

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!session) {
      setCount(0);
      return;
    }
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setCount(data.cart?.items?.length ?? 0);
      }
    } catch {
      // ignore
    }
  }, [session]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <CartContext.Provider value={{ count, refresh }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
