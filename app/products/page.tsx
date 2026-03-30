'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, Search, ChevronDown, SlidersHorizontal, Grid, List as ListIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProductCard from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const sortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
  { label: 'Top Rated', value: 'rating' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (Array.isArray(data)) {
          setCategories(['All', ...data.map((c: any) => c.name)]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        category,
        sort,
        search,
        page: page.toString(),
        limit: '8',
      });
      const res = await fetch(`/api/products?${query}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotalPages(data.pages || 1);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, sort, search, page]);

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      {/* Header & Search */}
      <div className="text-center md:text-left flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black mb-2">Our Collection</h1>
          <p className="text-slate-500 dark:text-slate-400">Discover over 500+ premium stationery items</p>
        </div>
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <Input
            placeholder="Search products..."
            className="pl-12 py-6 rounded-2xl border-2 focus-visible:ring-indigo-600 transition-all shadow-sm focus:shadow-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Filters */}
        <aside className="lg:w-64 space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center">
              <Filter className="mr-2 h-5 w-5 text-indigo-600" /> Categories
            </h3>
            <div className="flex flex-row flex-wrap lg:flex-col gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-left text-sm font-bold transition-all w-full ${
                    category === cat
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center">
              <SlidersHorizontal className="mr-2 h-5 w-5 text-indigo-600" /> Price Range
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Input type="number" placeholder="Min" className="rounded-lg border-2" />
                <span className="text-slate-400">—</span>
                <Input type="number" placeholder="Max" className="rounded-lg border-2" />
              </div>
              <Button className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-indigo-600 dark:hover:bg-indigo-600 dark:hover:text-white rounded-lg font-bold py-5">
                Apply Filters
              </Button>
            </div>
          </div>
        </aside>

        <main className="flex-1 space-y-8">
          {/* Sorting & Layout Toggle */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border dark:border-slate-800 gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-slate-500">Sort by:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="font-bold hover:bg-white dark:hover:bg-slate-800 rounded-xl">
                    {sortOptions.find((o) => o.value === sort)?.label} <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 rounded-2xl p-2 shadow-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl z-[60]">
                  {sortOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setSort(option.value)}
                      className={`font-bold py-3 px-4 rounded-xl cursor-pointer transition-colors ${
                        sort === option.value 
                          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400' 
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="bg-white dark:bg-slate-800 shadow-sm rounded-lg">
                <Grid className="h-4 w-4 text-indigo-600" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-lg">
                <ListIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-4 p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-sm">
                  <Skeleton className="aspect-square w-full rounded-xl" />
                  <Skeleton className="h-6 w-3/4 rounded-lg" />
                  <Skeleton className="h-4 w-1/2 rounded-lg" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-1/4 rounded-lg" />
                    <Skeleton className="h-10 w-1/3 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product: any) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 sm:space-x-4 pt-10">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="rounded-xl border-2 font-bold px-4 sm:px-6"
                  >
                    Previous
                  </Button>
                  <div className="hidden sm:flex items-center space-x-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <Button
                        key={i + 1}
                        variant={page === i + 1 ? 'default' : 'ghost'}
                        onClick={() => setPage(i + 1)}
                        className={`w-10 h-10 rounded-xl font-bold ${
                          page === i + 1 ? 'bg-indigo-600 shadow-lg shadow-indigo-500/20' : ''
                        }`}
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                  <div className="sm:hidden text-sm font-bold text-slate-500">
                    Page {page} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="rounded-xl border-2 font-bold px-4 sm:px-6"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center">
                <Search className="h-10 w-10 text-slate-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">No products found</h3>
                <p className="text-slate-500 max-w-xs mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setCategory('All');
                  setSearch('');
                  setSort('newest');
                }}
                className="rounded-full px-8 border-2 font-bold"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-20 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mx-auto mb-4" />
        <p className="text-slate-500 font-bold">Loading products...</p>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
