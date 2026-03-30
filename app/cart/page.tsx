'use client';

import { useEffect, useState } from 'react';
import useCartStore from '@/store/cartStore';
import CartItem from '@/components/CartItem';
import CartSummary from '@/components/CartSummary';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CartPage() {
  const [isClient, setIsClient] = useState(false);
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // You can show a loading skeleton here
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-16 sm:py-20 text-center">
        <ShoppingBag className="mx-auto h-20 w-20 sm:h-24 sm:w-24 text-slate-300 dark:text-slate-700" />
        <h1 className="mt-6 text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">Your cart is empty</h1>
        <p className="mt-4 text-base sm:text-lg text-slate-500">Looks like you haven't added anything to your cart yet.</p>
        <div className="mt-8 sm:mt-10">
          <Link href="/products">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 sm:px-12 py-6 sm:py-8 font-black text-base sm:text-lg shadow-xl shadow-indigo-500/20">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-8 sm:mb-10">Your Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItem key={item.productId} item={item} />
          ))}
        </div>
        <div className="lg:col-span-1 sticky top-24">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
