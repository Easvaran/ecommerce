
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    description: string;
    image: string;
    count?: string;
  };
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500"
    >
      <Link href={`/products?category=${encodeURIComponent(category.name)}`}>
        {/* Image Container */}
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Item Count Badge */}
          {category.count && (
            <div className="absolute top-6 right-6 px-4 py-2 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest shadow-lg">
              {category.count}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-8 space-y-4">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">
              {category.name}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed line-clamp-2">
              {category.description}
            </p>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <Button 
              variant="ghost" 
              className="p-0 font-black text-indigo-600 hover:bg-transparent hover:text-indigo-700 flex items-center group/btn"
            >
              Explore Collection
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
