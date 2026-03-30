'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryCard from './CategoryCard';
import { Sparkles, History, Zap, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

const filters = [
  { id: 'all', name: 'All Categories', icon: Zap },
  { id: 'popular', name: 'Popular', icon: Sparkles },
  { id: 'new', name: 'New Arrivals', icon: History },
];

export default function CategoryGrid() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (Array.isArray(data)) {
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((cat) => {
    // Note: Since real categories from DB might not have 'type', 
    // we handle the filter gracefully. In a real app, you might add 'type' to the model.
    const matchesFilter = activeFilter === 'all' || cat.type === activeFilter;
    const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         cat.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Loading Categories...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex p-1.5 bg-white dark:bg-slate-900 rounded-3xl border dark:border-slate-800 shadow-sm overflow-x-auto custom-scrollbar">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl text-sm font-black transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-slate-500 hover:text-indigo-600'
                }`}
              >
                <filter.icon className={`h-4 w-4 ${isActive ? 'text-white' : ''}`} />
                <span>{filter.name}</span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <Input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-7 rounded-2xl border-2 focus-visible:ring-indigo-600 transition-all font-bold"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category, index) => (
              <motion.div
                key={category._id || category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <CategoryCard category={{...category, id: category._id || category.id}} />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 text-center space-y-6"
            >
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                <Search className="h-10 w-10 text-slate-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">No categories found</h3>
                <p className="text-slate-500 font-medium">Try adjusting your search or filter to find what you're looking for.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
