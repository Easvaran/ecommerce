'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, Sparkles, BookOpen, PenTool } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title = "StationeryHub", subtitle = "Everything you need, all in one place" }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white dark:bg-slate-950 transition-colors duration-500 overflow-hidden">
      {/* Left Side - Branding & Illustration */}
      <div className="relative hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 items-center justify-center p-12 overflow-hidden">
        {/* Animated background shapes */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-400/20 rounded-full blur-3xl"
        />
        
        <div className="relative z-10 max-w-lg text-center text-white space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl"
          >
            <ShoppingBag className="h-12 w-12 text-white" />
          </motion.div>
          
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-6xl font-black tracking-tight"
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl font-medium text-indigo-100/90"
            >
              {subtitle}
            </motion.p>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-12">
            {[
              { icon: Sparkles, label: "Premium Quality" },
              { icon: BookOpen, label: "Wide Range" },
              { icon: PenTool, label: "Art Supplies" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex flex-col items-center space-y-2"
              >
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-100/70">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
        {/* Background micro-interactions for dark/light mode */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px] dark:bg-indigo-500/10" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] dark:bg-purple-500/10" />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
