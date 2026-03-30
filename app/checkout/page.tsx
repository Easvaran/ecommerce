'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, CreditCard, ShoppingBag, ArrowLeft, CheckCircle2, Loader2, ShieldCheck, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useCartStore from '@/store/cartStore';
import { useSession } from 'next-auth/react';
import { useAuthModalStore } from '@/store/authModalStore';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useEffect } from 'react';

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { data: session } = useSession();
  const { openModal } = useAuthModalStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: 'India',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/users/profile');
        if (res.ok) {
          const data = await res.json();
          setShippingAddress({
            address: data.address || '',
            city: data.city || '',
            postalCode: data.postalCode || '',
            country: data.country || 'India',
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (session) fetchProfile();
  }, [session]);

  const subtotal = getTotalPrice();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error('Please login to place an order');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderItems: items.map(item => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image,
          })),
          shippingAddress,
          paymentMethod: 'Credit Card',
          totalPrice: total,
        }),
      });

      if (res.ok) {
        setOrderComplete(true);
        clearCart();
        toast.success('Order placed successfully!');
      } else {
        const data = await res.json();
        toast.error('Failed to place order', { description: data.message });
      }
    } catch (error) {
      toast.error('Error', { description: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-20 sm:py-32 flex flex-col items-center justify-center text-center space-y-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="w-24 h-24 sm:w-32 sm:h-32 bg-emerald-100 dark:bg-emerald-950/30 rounded-full flex items-center justify-center"
        >
          <CheckCircle2 className="h-12 w-12 sm:h-16 sm:w-16 text-emerald-600" />
        </motion.div>
        <div className="space-y-3 max-w-md">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black">Order Successful!</h1>
          <p className="text-slate-500 text-base sm:text-lg">Thank you for your purchase. We've sent a confirmation email with all the details.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 sm:px-12 py-6 sm:py-8 text-base sm:text-lg font-black shadow-xl shadow-indigo-500/20">
            <Link href="/account/orders">View Orders</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8 sm:px-12 py-6 sm:py-8 text-base sm:text-lg font-black border-2">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 sm:py-20">
      <div className="flex items-center space-x-2 sm:space-x-4 mb-8 sm:mb-12">
        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-10">
          {!session && (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-xl sm:rounded-2xl">
                  <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
                </div>
                <div>
                  <p className="font-black">Guest Checkout</p>
                  <p className="text-xs sm:text-sm text-slate-500 font-bold">Login to use your saved addresses and track orders.</p>
                </div>
              </div>
              <Button onClick={() => openModal()} variant="outline" className="rounded-full font-black border-2 w-full sm:w-auto">
                Login
              </Button>
            </div>
          )}
          <section className="space-y-6">
            <div className="flex items-center space-x-3 text-xl sm:text-2xl font-black">
              <div className="bg-indigo-100 dark:bg-indigo-950/30 p-2 rounded-xl">
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
              </div>
              <h2>Shipping Address</h2>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-500 px-1">Street Address</label>
                <Input
                  required
                  placeholder="123 Creative St, Design District"
                  className="rounded-xl sm:rounded-2xl py-6 sm:py-7 border-2 focus-visible:ring-indigo-600"
                  value={shippingAddress.address}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 px-1">City</label>
                <Input
                  required
                  placeholder="e.g. Mumbai"
                  className="rounded-xl sm:rounded-2xl py-6 sm:py-7 border-2 focus-visible:ring-indigo-600"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 px-1">Postal Code (Pincode)</label>
                <Input
                  required
                  placeholder="400001"
                  className="rounded-xl sm:rounded-2xl py-6 sm:py-7 border-2 focus-visible:ring-indigo-600"
                  value={shippingAddress.postalCode}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                />
              </div>
            </form>
          </section>

          <section className="space-y-6">
            <div className="flex items-center space-x-3 text-xl sm:text-2xl font-black">
              <div className="bg-purple-100 dark:bg-purple-950/30 p-2 rounded-xl">
                <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <h2>Payment Method</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative group cursor-pointer border-2 border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm">
                    <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-black">Credit Card</p>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Ending in 4242</p>
                  </div>
                </div>
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-4 border-indigo-600 bg-white" />
              </div>
              <div className="relative group cursor-not-allowed opacity-50 border-2 border-slate-100 dark:border-slate-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center space-x-4">
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm">
                    <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-black">PayPal</p>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Coming Soon</p>
                  </div>
                </div>
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-slate-200" />
              </div>
            </div>
          </section>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 space-y-6">
              <h2 className="text-xl sm:text-2xl font-black">Review Order</h2>

              <div className="max-h-60 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-50">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate text-sm">{item.name}</p>
                      <p className="text-xs text-slate-500 font-bold">Qty: {item.quantity} × ₹{item.price.toFixed(2)}</p>
                    </div>
                    <p className="font-black text-indigo-600">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <Separator className="bg-slate-100 dark:bg-slate-800" />

              <div className="space-y-3">
                <div className="flex justify-between text-slate-600 dark:text-slate-400 font-bold text-sm">
                  <span>Subtotal</span>
                  <span className="text-slate-900 dark:text-slate-100">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400 font-bold text-sm">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-emerald-500' : 'text-slate-900 dark:text-slate-100'}>
                    {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between items-end">
                  <span className="text-base sm:text-lg font-black">Grand Total</span>
                  <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                disabled={loading || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode}
                onClick={handlePlaceOrder}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl sm:rounded-2xl py-6 sm:py-8 text-base sm:text-lg font-black shadow-xl shadow-indigo-500/20 group"
              >
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    Complete Purchase
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center space-x-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                <ShieldCheck className="h-4 w-4" />
                <span>SSL Secured Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
