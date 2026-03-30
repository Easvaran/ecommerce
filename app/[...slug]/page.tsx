'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Construction, ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';

export default function CatchAllPage() {
  const params = useParams();
  const slug = params.slug;
  const pageName = Array.isArray(slug) 
    ? slug[slug.length - 1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'Page';

  return (
    <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center space-y-10">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-48 h-48 bg-indigo-50 dark:bg-indigo-950/30 rounded-full flex items-center justify-center relative"
      >
        <Construction className="h-20 w-20 text-indigo-600" />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-4 border-dashed border-indigo-200 dark:border-indigo-800 rounded-full"
        />
      </motion.div>
      
      <div className="space-y-4 max-w-md">
        <h1 className="text-4xl md:text-5xl font-black">{pageName}</h1>
        <p className="text-slate-500 text-lg">
          We're currently crafting this page with love. It'll be ready soon! 
          In the meantime, feel free to explore our premium stationery collection.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-12 py-8 text-lg font-black shadow-xl shadow-indigo-500/20">
          <Link href="/products">
            Explore Shop
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-full px-12 py-8 text-lg font-black border-2 group">
          <Link href="/">
            <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </Button>
      </div>

      <div className="pt-12 flex items-center space-x-2 text-slate-400 font-bold text-sm">
        <Mail className="h-4 w-4" />
        <span>Need help? hello@stationeryhub.com</span>
      </div>
    </div>
  );
}
