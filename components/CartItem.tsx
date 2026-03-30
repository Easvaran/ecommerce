'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import useCartStore, { CartItem as CartItemType } from '@/store/cartStore';
import { Button } from '@/components/ui/button';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-lg shadow-indigo-500/5">
      <div className="flex items-center space-x-4">
        <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
          <Image src={item.image} alt={item.name} fill className="object-cover" />
        </div>
        <div>
          <Link href={`/products/${item.productId}`} className="font-black text-lg hover:text-indigo-600 transition-colors">
            {item.name}
          </Link>
          <p className="text-indigo-600 font-black">₹{item.price.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3 p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
            <Minus className="h-4 w-4" />
          </Button>
          <span className="font-black text-lg w-8 text-center">{item.quantity}</span>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl" onClick={() => removeItem(item.productId)}>
          <Trash2 className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
