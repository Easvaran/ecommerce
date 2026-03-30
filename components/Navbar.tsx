'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, User, Menu, X, Heart, LogOut, Package, UserCircle, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useSession, signOut } from 'next-auth/react';
import { useAuthModalStore } from '@/store/authModalStore';
import useCartStore from '@/store/cartStore';
import ThemeToggle from './ThemeToggle';
import SearchBar from './SearchBar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user as any;
  const isLoading = status === 'loading';
  const { openModal } = useAuthModalStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't show the main navbar on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/categories' },
    { name: 'About', href: '/about-us' },
  ];

  const userInitials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : 'U';

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/admin/login" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          StationeryHub
        </Link>

        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-indigo-600 ${
                pathname === link.href ? 'text-indigo-600' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="hidden md:block">
            <SearchBar />
          </div>
          <ThemeToggle />

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative rounded-full">
              <ShoppingCart className="h-6 w-6" />
              {isClient && cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                  {cartItems.length}
                </span>
              )}
            </Button>
          </Link>

          {isLoading ? (
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden border-2 border-transparent hover:border-indigo-600/50 transition-all">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.image || ''} alt={user.name || ''} />
                    <AvatarFallback className="bg-indigo-600 text-white font-bold">{userInitials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl shadow-2xl border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl z-[60]">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal p-4">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-black leading-none text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-xs leading-none text-slate-500 truncate">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 mx-2" />
                <DropdownMenuItem asChild className="rounded-xl p-3 focus:bg-indigo-50 dark:focus:bg-indigo-950/30 group cursor-pointer transition-colors">
                  <Link href="/account" className="flex items-center w-full">
                    <UserCircle className="mr-3 h-5 w-5 text-slate-500 group-hover:text-indigo-600 group-focus:text-indigo-600" />
                    <span className="font-bold text-sm">My Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-xl p-3 focus:bg-indigo-50 dark:focus:bg-indigo-950/30 group cursor-pointer transition-colors">
                  <Link href="/account/orders" className="flex items-center w-full">
                    <Package className="mr-3 h-5 w-5 text-slate-500 group-hover:text-indigo-600 group-focus:text-indigo-600" />
                    <span className="font-bold text-sm">My Orders</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-xl p-3 focus:bg-indigo-50 dark:focus:bg-indigo-950/30 group cursor-pointer transition-colors">
                  <Link href="/account/wishlist" className="flex items-center w-full">
                    <Heart className="mr-3 h-5 w-5 text-slate-500 group-hover:text-indigo-600 group-focus:text-indigo-600" />
                    <span className="font-bold text-sm">Wishlist</span>
                  </Link>
                </DropdownMenuItem>
                {user.role === 'admin' && (
                  <>
                    <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 mx-2" />
                    <DropdownMenuItem asChild className="rounded-xl p-3 focus:bg-indigo-50 dark:focus:bg-indigo-950/30 group cursor-pointer transition-colors">
                      <Link href="/admin" className="flex items-center w-full">
                        <LayoutDashboard className="mr-3 h-5 w-5 text-slate-500 group-hover:text-indigo-600 group-focus:text-indigo-600" />
                        <span className="font-bold text-sm text-indigo-600">Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 mx-2" />
                <DropdownMenuItem onClick={handleLogout} className="rounded-xl p-3 focus:bg-rose-50 dark:focus:bg-rose-950/30 group cursor-pointer transition-colors">
                  <div className="flex items-center w-full">
                    <LogOut className="mr-3 h-5 w-5 text-slate-500 group-hover:text-rose-600 group-focus:text-rose-600" />
                    <span className="font-bold text-sm text-rose-600">Logout</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={openModal} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 font-bold shadow-lg shadow-indigo-600/20">
              Login
            </Button>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-slate-950 border-t dark:border-slate-800"
          >
            <div className="flex flex-col p-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-lg font-bold transition-colors hover:text-indigo-600 ${
                    pathname === link.href ? 'text-indigo-600' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {!user && (
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-full">
                    Login
                  </Button>
                </Link>
              )}
              {user && (
                <Button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-full"
                >
                  Logout
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
