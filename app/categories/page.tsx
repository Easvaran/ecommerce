'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Sparkles, Zap, History } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const filters = [
  { id: 'all', name: 'All Categories', icon: Zap },
  { id: 'featured', name: 'Featured', icon: Sparkles },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/categories?search=${searchQuery}`);
        const data = await res.json();
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [searchQuery]);

  const filteredCategories = categories.filter(cat => {
    if (activeFilter === 'featured') {
      return cat.isFeatured;
    }
    return true;
  });

  return (
    <div className="bg-slate-50 dark:bg-slate-950">
      {/* Hero Section */}
      <div className="container mx-auto px-4 md:px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Shop by Categories
        </h1>
        <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto">
          Explore our curated collections of premium stationery. From elegant pens to artistic supplies, find everything you need to inspire your creativity and organize your life.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="container mx-auto px-4 md:px-6 mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex p-1.5 bg-white dark:bg-slate-900 rounded-3xl border dark:border-slate-800 shadow-sm overflow-x-auto custom-scrollbar">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl text-sm font-black transition-all whitespace-nowrap ${
                  activeFilter === filter.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-slate-500 hover:text-indigo-600'
                }`}
              >
                <filter.icon className={`h-4 w-4 ${activeFilter === filter.id ? 'text-white' : ''}`} />
                <span>{filter.name}</span>
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <Input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-7 rounded-2xl border-2 bg-white dark:bg-slate-900 focus-visible:ring-indigo-600 transition-all font-bold"
            />
          </div>
        </div>
      </div>

      {/* Category Grid */}
      <div className="container mx-auto px-4 md:px-6 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredCategories.map((category) => (
              <Link key={category._id} href={`/products?category=${encodeURIComponent(category.name)}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="group relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500"
                >
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <h3 className="text-2xl font-black text-white mb-2">{category.name}</h3>
                    <div className="flex items-center text-indigo-300 font-bold text-sm group-hover:text-white transition-colors">
                      <span>Shop Now</span>
                      <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold">No categories found</h2>
            <p className="text-slate-500">Try adjusting your search or filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
