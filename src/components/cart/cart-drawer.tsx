'use client';

import { useState, useEffect } from 'react';
import { X, ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/cart-context';
import Link from 'next/link';
import Image from 'next/image';

export function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { items, removeFromCart, updateQuantity, cartTotal, totalItems } = useCart();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden ${
        isOpen ? 'block' : 'hidden'
      }`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />
        <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="w-screen max-w-md">
            <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
              <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Shopping cart</h2>
                  <div className="ml-3 flex h-7 items-center">
                    <button
                      type="button"
                      className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                      onClick={onClose}
                    >
                      <span className="sr-only">Close panel</span>
                      <X className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flow-root">
                    {items.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
                        <p className="mt-1 text-sm text-gray-500">Start adding some items to your cart.</p>
                        <div className="mt-6">
                          <Button onClick={onClose}>Continue Shopping</Button>
                        </div>
                      </div>
                    ) : (
                      <ul role="list" className="-my-6 divide-y divide-gray-200">
                        {items.map((item) => (
                          <li key={`${item.id}-${item.color}`} className="flex py-6">
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={96}
                                height={96}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>

                            <div className="ml-4 flex flex-1 flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>{item.name}</h3>
                                  <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                  Color: <span className="capitalize">{item.color}</span>
                                </p>
                              </div>
                              <div className="flex flex-1 items-end justify-between text-sm">
                                <div className="flex items-center border rounded-md">
                                  <button
                                    type="button"
                                    className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                    onClick={() => updateQuantity(item.id, item.color, item.quantity - 1)}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <span className="w-8 text-center">{item.quantity}</span>
                                  <button
                                    type="button"
                                    className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                    onClick={() => updateQuantity(item.id, item.color, item.quantity + 1)}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  className="font-medium text-primary hover:text-primary/80 flex items-center"
                                  onClick={() => removeFromCart(item.id, item.color)}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Remove
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {items.length > 0 && (
                <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>${cartTotal.toFixed(2)}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/checkout"
                      className="flex items-center justify-center rounded-md border border-transparent bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary/90"
                      onClick={onClose}
                    >
                      Checkout
                    </Link>
                  </div>
                  <div className="mt-4 flex justify-center text-center text-sm text-gray-500">
                    <p>
                      or{' '}
                      <button
                        type="button"
                        className="font-medium text-primary hover:text-primary/80"
                        onClick={onClose}
                      >
                        Continue Shopping<span aria-hidden="true"> &rarr;</span>
                      </button>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
