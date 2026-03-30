'use client';

import { Button } from '@/components/ui/button';
import useCartStore from '@/store/cartStore';
import Link from 'next/link';

export default function CartSummary() {
  const items = useCartStore((state) => state.items);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping: number = subtotal > 500 ? 0 : 49; // Free shipping over ₹500, otherwise ₹49
  const total = subtotal + shipping;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl shadow-indigo-500/10 space-y-6">
      <h2 className="text-2xl font-black">Order Summary</h2>
      <div className="space-y-4">
        <div className="flex justify-between font-bold text-slate-600 dark:text-slate-400">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-slate-600 dark:text-slate-400">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700 my-4"></div>
        <div className="flex justify-between items-end">
          <span className="text-lg font-black">Total Amount</span>
          <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">₹{total.toFixed(2)}</span>
        </div>
      </div>
      <Link href="/checkout" className="block">
        <Button size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl py-8 font-black text-lg shadow-xl shadow-indigo-500/20">
          Proceed to Checkout
        </Button>
      </Link>
    </div>
  );
}
