'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut, ChevronRight, Menu, X, BarChart3, PieChart, Edit3, Tag, Layout } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useSession, signOut } from 'next-auth/react';

const sidebarLinks = [
  { group: 'Overview', links: [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  ]},
  { group: 'Management', links: [
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Edit3 },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Users', href: '/admin/users', icon: Users },
  ]},
  { group: 'Content', links: [
    { name: 'Home Content', href: '/admin/home', icon: Edit3 },
    { name: 'Footer', href: '/admin/footer', icon: Layout },
    { name: 'Offers', href: '/admin/offers', icon: Tag },
    { name: 'About Page', href: '/admin/about', icon: Edit3 },
  ]},
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const activeLink = sidebarLinks.flatMap(g => g.links).find(l => l.href === pathname);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="fixed left-0 top-0 h-screen bg-gray-900 border-r border-gray-800 z-40 hidden md:flex flex-col overflow-hidden transition-all duration-300"
      >
        <div className="p-6 flex items-center justify-between border-b border-gray-800">
          <Link href="/admin" className={`text-xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent whitespace-nowrap overflow-hidden transition-all ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
            StationeryHub
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-8 overflow-y-auto custom-scrollbar">
          {sidebarLinks.map((group) => (
            <div key={group.group} className="space-y-2">
              <p className={`text-[10px] font-black uppercase tracking-widest text-gray-500 px-4 mb-4 transition-all ${isSidebarOpen ? 'opacity-100' : 'opacity-0 h-0'}`}>
                {group.group}
              </p>
              {group.links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center space-x-4 p-4 rounded-2xl transition-all group ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <link.icon className={`h-6 w-6 flex-shrink-0 ${isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
                    <span className={`font-black whitespace-nowrap transition-all ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                      {link.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link
            href="/admin/settings"
            className={`flex items-center space-x-4 p-4 rounded-2xl transition-all ${
              pathname === '/admin/settings'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Settings className="h-6 w-6 flex-shrink-0" />
            <span className={`font-black transition-all ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-4 p-4 rounded-2xl text-rose-500 hover:bg-rose-950/30 transition-all"
          >
            <LogOut className="h-6 w-6 flex-shrink-0" />
            <span className={`font-black transition-all ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'md:ml-[280px]' : 'md:ml-[80px]'}`}>
        <header className="sticky top-0 z-30 h-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b dark:border-slate-800 flex items-center justify-between px-8">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
              {activeLink?.name || 'Admin'}
            </h2>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex flex-col items-end">
              <span className="text-sm font-black">{user?.name || 'Admin User'}</span>
              <span className="text-xs text-slate-500 font-bold">Administrator</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/30 flex items-center justify-center font-black text-indigo-600 border-2 border-indigo-600/10">
              {user?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
