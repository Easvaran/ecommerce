'use client';

import { motion } from 'framer-motion';
import UserSidebar from '@/components/UserSidebar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black transition-colors duration-500">
      <div className="container mx-auto px-4 md:px-6 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Section */}
          <div className="lg:col-span-1">
            <UserSidebar />
          </div>

          {/* Main Content Section */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-sm min-h-[600px]"
            >
              {children}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
