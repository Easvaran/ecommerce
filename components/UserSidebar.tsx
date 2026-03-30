'use client';

import { motion } from 'framer-motion';
import { User, Package, Heart, MapPin, LogOut, ChevronRight } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export default function UserSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const user = session?.user;

  if (!user) return null;

  const userInitials = user.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : 'U';

  const menuItems = [
    { name: 'My Profile', href: '/account', icon: User },
    { name: 'My Orders', href: '/account/orders', icon: Package },
    { name: 'Wishlist', href: '/account/wishlist', icon: Heart },
  ];

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      {/* User Info Card */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-600 rounded-full blur-xl opacity-10" />
          <Avatar className="h-24 w-24 border-4 border-white dark:border-slate-800 shadow-xl relative">
            <AvatarImage src={user.image || ''} />
            <AvatarFallback className="bg-indigo-600 text-white text-2xl font-black">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </div>
        <div>
          <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
            {user.name}
          </h3>
          <p className="text-sm font-bold text-slate-500 truncate max-w-[200px]">
            {user.email}
          </p>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-4 border border-slate-100 dark:border-slate-800 shadow-sm space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between p-4 rounded-2xl transition-all group",
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              <div className="flex items-center space-x-4">
                <item.icon className={cn(
                  "h-5 w-5 transition-transform group-hover:scale-110",
                  isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-600"
                )} />
                <span className="font-bold text-sm">{item.name}</span>
              </div>
              <ChevronRight className={cn(
                "h-4 w-4 transition-transform group-hover:translate-x-1",
                isActive ? "text-white/70" : "text-slate-300"
              )} />
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-slate-50 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-4 p-4 rounded-2xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all group"
          >
            <LogOut className="h-5 w-5 transition-transform group-hover:scale-110 group-hover:-translate-x-1" />
            <span className="font-bold text-sm">Logout</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
