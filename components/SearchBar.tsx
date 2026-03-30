'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close search on ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  // Handle search with debounce
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=5`);
        const data = await res.json();
        if (res.ok) {
          setResults(data.products || []);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Focus input when search opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  return (
    <div ref={searchRef} className="relative">
      {/* Search Trigger Icon */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-10 h-10 rounded-full transition-all duration-300",
          isOpen ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-100 dark:hover:bg-slate-800"
        )}
      >
        <Search className="h-5 w-5 text-slate-600 dark:text-slate-300" />
      </Button>

      {/* Expandable Search Input */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 z-50 h-10 overflow-hidden"
          >
            <form onSubmit={handleSearchSubmit} className="relative w-full h-full">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-full pr-10 pl-4 rounded-full border-2 border-indigo-600 focus-visible:ring-0 bg-white dark:bg-slate-900 font-bold"
              />
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setQuery('');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dropdown Results */}
      <AnimatePresence>
        {isOpen && query.trim().length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-[350px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border dark:border-slate-800 overflow-hidden z-50"
          >
            <div className="p-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 mb-2">
                    Search Results
                  </p>
                  {results.map((product) => (
                    <button
                      key={product._id}
                      onClick={() => {
                        router.push(`/products/${product._id}`);
                        setIsOpen(false);
                        setQuery('');
                      }}
                      className="w-full flex items-center space-x-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group text-left"
                    >
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-xs text-slate-500 font-bold">${product.price.toFixed(2)}</p>
                      </div>
                    </button>
                  ))}
                  <Button
                    variant="ghost"
                    onClick={handleSearchSubmit}
                    className="w-full mt-2 rounded-xl font-black text-xs text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
                  >
                    View all results
                  </Button>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-slate-500 font-bold text-sm">No products found for "{query}"</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
