'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  color: string;
  image: string;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number, color: string) => void;
  updateQuantity: (id: number, color: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  cartTotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isMounted]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(
        i => i.id === item.id && i.color === item.color
      );

      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id && i.color === item.color
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number, color: string) => {
    setItems(prevItems => prevItems.filter(i => !(i.id === id && i.color === color)));
  };

  const updateQuantity = (id: number, color: string, quantity: number) => {
    if (quantity < 1) return;
    
    setItems(prevItems =>
      prevItems.map(i =>
        i.id === id && i.color === color ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  // Calculate total items in cart
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  
  // Calculate cart total
  const cartTotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
