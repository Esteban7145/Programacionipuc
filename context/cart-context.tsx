'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CartItem, Product } from '@/types';

type CartContextType = {
  items: CartItem[];
  addToCart: (product: Product, selectedColor?: string, selectedSize?: string) => void;
  updateQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  total: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('az_cart');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('az_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, selectedColor?: string, selectedSize?: string) => {
    setItems((prev) => {
      const found = prev.find((i) => i._id === product._id && i.selectedColor === selectedColor && i.selectedSize === selectedSize);
      if (found) return prev.map((i) => (i === found ? { ...i, quantity: i.quantity + 1 } : i));
      return [...prev, { ...product, selectedColor, selectedSize, quantity: 1 }];
    });
  };

  const updateQty = (id: string, qty: number) => setItems((prev) => prev.map((i) => (i._id === id ? { ...i, quantity: Math.max(1, qty) } : i)));
  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i._id !== id));

  const total = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);

  return <CartContext.Provider value={{ items, addToCart, updateQty, removeItem, total }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}
