'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface OfferBannerProps {
  offer: {
    title: string;
    subtitle: string;
    code?: string;
  };
}

export default function OfferBanner({ offer }: OfferBannerProps) {
  return (
    <div className="relative bg-indigo-600 dark:bg-indigo-700 text-white rounded-3xl p-12 md:p-20 text-center overflow-hidden">
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full" />
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-3xl mx-auto"
      >
        <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
          {offer.title}
        </h2>
        <p className="text-xl text-indigo-100 mb-10 leading-relaxed opacity-90">
          {offer.subtitle}
        </p>
        <Button size="lg" className="bg-white text-indigo-600 hover:bg-slate-100 rounded-full px-12 py-7 text-lg font-black shadow-2xl">
          Grab the Offer
        </Button>
      </motion.div>
    </div>
  );
}
