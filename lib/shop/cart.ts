"use client";

import { createContext, createElement, useContext, useMemo, useState } from "react";
import type { Product } from "./products";

export type CartItem = {
  lineId: string;
  productId: string;
  slug: string;
  name: string;
  price: string;
  priceValue: number;
  image: string;
  color: string;
  wrap: string;
  quantity: number;
};

type AddToCartInput = {
  product: Product;
  color: string;
  wrap: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  subtotal: number;
  addItem: (input: AddToCartInput) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.priceValue * item.quantity, 0),
    [items],
  );

  function addItem({ product, color, wrap, quantity }: AddToCartInput) {
    const lineId = `${product.id}-${color}-${wrap}`;

    setItems((current) => {
      const existing = current.find((item) => item.lineId === lineId);
      if (existing) {
        return current.map((item) =>
          item.lineId === lineId ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }

      return [
        ...current,
        {
          lineId,
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          priceValue: product.priceValue,
          image: product.images[0],
          color,
          wrap,
          quantity,
        },
      ];
    });

    setIsOpen(true);
  }

  function updateQuantity(lineId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(lineId);
      return;
    }

    setItems((current) => current.map((item) => (item.lineId === lineId ? { ...item, quantity } : item)));
  }

  function removeItem(lineId: string) {
    setItems((current) => current.filter((item) => item.lineId !== lineId));
  }

  return createElement(
    CartContext.Provider,
    {
      value: {
        items,
        isOpen,
        subtotal,
        addItem,
        removeItem,
        updateQuantity,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
      },
    },
    children,
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}

export function formatNaira(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}
