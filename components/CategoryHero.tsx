
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Home, Shapes } from 'lucide-react';

export default function CategoryHero() {
  return (
    <section className="relative py-20 overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm font-bold text-slate-400 mb-8">
          <Link href="/" className="hover:text-indigo-600 transition-colors flex items-center">
            <Home className="h-4 w-4 mr-2" />
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900 dark:text-slate-100">Categories</span>
        </nav>

        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 border border-indigo-100 dark:border-indigo-900">
              <Shapes className="h-5 w-5" />
              <span className="text-xs font-black uppercase tracking-widest">Collections 2026</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-slate-100 leading-[1.1]">
              Shop by <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Categories</span>
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-2xl">
              Discover everything you need for school, office, and your next creative masterpiece. 
              Our curated collections are designed to inspire and empower.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
