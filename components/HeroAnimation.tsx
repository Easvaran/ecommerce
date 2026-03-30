'use client';

import { motion, Variants } from 'framer-motion';
import { Pen, Notebook, Brush, Paperclip } from 'lucide-react';

const iconVariants: Variants = {
  float: (i: number) => ({
    y: [0, -10, 10, 0],
    transition: {
      duration: 4 + i * 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  }),
};

const stationeryItems = [
  { icon: Pen, size: 8, color: 'text-indigo-400', position: 'top-1/4 left-1/4' },
  { icon: Notebook, size: 10, color: 'text-purple-400', position: 'top-1/3 right-1/4' },
  { icon: Brush, size: 9, color: 'text-blue-400', position: 'bottom-1/4 left-1/3' },
  { icon: Paperclip, size: 7, color: 'text-pink-400', position: 'bottom-1/3 right-1/3' },
];

export default function HeroAnimation() {
  return (
    <div className="relative w-full h-96 md:h-auto md:aspect-square bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-3xl shadow-xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
      <div className="absolute inset-0 bg-white/30 dark:bg-black/30 backdrop-blur-lg" />
      
      {stationeryItems.map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={i}
            className={`absolute ${item.position} ${item.color}`}
            variants={iconVariants}
            custom={i}
            animate="float"
          >
            <Icon size={item.size * 8} strokeWidth={1.5} />
          </motion.div>
        );
      })}

      <div className="absolute inset-0 rounded-3xl border-2 border-white/20" />
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-300/30 rounded-full blur-2xl" />
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-300/30 rounded-full blur-2xl" />
    </div>
  );
}
