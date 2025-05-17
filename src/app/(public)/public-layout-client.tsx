"use client";

import { useState } from 'react';
import { Toaster } from "sonner";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { CartProvider } from "@/contexts/cart-context";
import { ReviewProvider } from "@/contexts/review-context";
import { CartDrawer } from "@/components/cart/cart-drawer";

export default function PublicLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <CartProvider>
      <ReviewProvider>
        <div className="flex min-h-screen flex-col">
          <Header onCartClick={() => setIsCartOpen(true)} />
          <main className="flex-1 w-full pt-16">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>
          <footer className="w-full bg-gray-50 border-t mt-auto">
            <div className="w-full">
              <Footer />
            </div>
          </footer>
          <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          <Toaster position="top-center" richColors />
        </div>
      </ReviewProvider>
    </CartProvider>
  );
}
