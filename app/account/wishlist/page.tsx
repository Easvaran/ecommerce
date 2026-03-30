'use client';

import { useWishlist } from '@/hooks/useWishlist';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function UserWishlistPage() {
  const { items } = useWishlist();

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-50 dark:border-slate-800 pb-10">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            My Wishlist
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Items you've saved for later</p>
        </div>
        <Button variant="outline" className="rounded-full px-8 py-6 border-2 font-black group" asChild>
          <Link href="/products">
            <ShoppingBag className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            Explore More
          </Link>
        </Button>
      </div>

      <div className="space-y-8">
        {items.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {items.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="py-20 flex flex-col items-center text-center space-y-6">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
              <Heart className="h-10 w-10 text-slate-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black">Your wishlist is empty</h3>
              <p className="text-slate-500 font-medium max-w-sm">Looks like you haven’t added anything yet. Let’s change that!</p>
            </div>
            <Button className="rounded-full px-8 py-6 bg-indigo-600 font-black shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all" asChild>
              <Link href="/products">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Explore Products
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
