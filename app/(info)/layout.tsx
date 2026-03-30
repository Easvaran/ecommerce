
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Info, 
  Mail, 
  Truck, 
  RotateCcw, 
  HelpCircle, 
  ShieldCheck, 
  ChevronRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarLinks = [
  { name: 'About Us', href: '/about-us', icon: Info },
  { name: 'Contact Us', href: '/contact-us', icon: Mail },
  { name: 'Shipping Policy', href: '/shipping-policy', icon: Truck },
  { name: 'Return & Refund', href: '/return-&-refund', icon: RotateCcw },
  { name: 'FAQ', href: '/faq', icon: HelpCircle },
  { name: 'Privacy Policy', href: '/privacy-policy', icon: ShieldCheck },
];

export default function InfoLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Side Navbar */}
        <aside className="lg:w-80 flex-shrink-0">
          <div className="sticky top-32 space-y-8">
            <div>
              <h2 className="text-2xl font-black tracking-tight mb-6">Information</h2>
              <nav className="space-y-2">
                {sidebarLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl transition-all group",
                        isActive 
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                          : "hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-indigo-600"
                      )}
                    >
                      <div className="flex items-center space-x-4">
                        <link.icon className={cn("h-5 w-5", isActive ? "text-white" : "group-hover:scale-110 transition-transform")} />
                        <span className="font-bold text-sm">{link.name}</span>
                      </div>
                      <ChevronRight className={cn("h-4 w-4 opacity-0 transition-all", isActive ? "opacity-100 translate-x-0" : "group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0")} />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Help Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <HelpCircle className="h-10 w-10 opacity-50" />
                <h3 className="text-xl font-black leading-tight">Need more assistance?</h3>
                <p className="text-indigo-100 text-sm font-medium opacity-90">
                  Our team is here to help you with any questions or concerns.
                </p>
                <Link 
                  href="/contact-us" 
                  className="inline-flex items-center font-black text-sm hover:underline"
                >
                  Contact Support <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              {/* Decorative Circles */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -top-10 -left-10 w-24 h-24 bg-white/5 rounded-full blur-xl" />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
