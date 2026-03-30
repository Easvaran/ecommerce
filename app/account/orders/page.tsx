'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingBag, Truck, CheckCircle2, Clock, XCircle, ChevronRight, Package, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function UserOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    if (session) fetchOrders();
  }, [session]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none px-4 py-1.5 font-black uppercase tracking-widest text-[10px] rounded-full"><Clock className="h-3.5 w-3.5 mr-1.5" /> Pending</Badge>;
      case 'shipped':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-4 py-1.5 font-black uppercase tracking-widest text-[10px] rounded-full"><Truck className="h-3.5 w-3.5 mr-1.5" /> Shipped</Badge>;
      case 'delivered':
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-4 py-1.5 font-black uppercase tracking-widest text-[10px] rounded-full"><CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Delivered</Badge>;
      case 'cancelled':
        return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-none px-4 py-1.5 font-black uppercase tracking-widest text-[10px] rounded-full"><XCircle className="h-3.5 w-3.5 mr-1.5" /> Cancelled</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-none px-4 py-1.5 font-black uppercase tracking-widest text-[10px] rounded-full">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-50 dark:border-slate-800 pb-10">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            My Orders
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Track your recent purchases and status</p>
        </div>
        <Button variant="outline" className="rounded-full px-8 py-6 border-2 font-black group" asChild>
          <Link href="/products">
            <ShoppingBag className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            Shop More
          </Link>
        </Button>
      </div>

      <div className="space-y-8">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-4">
              <Skeleton className="h-8 w-48 rounded-full" />
              <Skeleton className="h-32 w-full rounded-2xl" />
            </div>
          ))
        ) : orders.length > 0 ? (
          <div className="grid grid-cols-1 gap-8">
            {orders.map((order: any) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all group"
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1 space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="text-xl font-black tracking-tight">Order #{order._id.slice(-6).toUpperCase()}</h3>
                        <div className="flex items-center text-slate-500 text-xs font-bold uppercase tracking-widest">
                          <Calendar className="h-3.5 w-3.5 mr-2 text-indigo-600" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      {getStatusBadge(order.status || 'delivered')}
                    </div>

                    <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
                      {order.orderItems?.map((item: any, idx: number) => (
                        <div key={idx} className="relative w-16 h-16 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:w-48 flex flex-col justify-between items-end gap-4 lg:border-l border-slate-200 dark:border-slate-800 lg:pl-8">
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Total Amount</p>
                      <p className="text-2xl font-black text-indigo-600">₹{order.totalPrice.toFixed(2)}</p>
                    </div>
                    <Button variant="ghost" className="w-full rounded-xl font-black text-xs group" asChild>
                      <Link href={`/orders/${order._id}`}>
                        View Details <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center text-center space-y-6">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
              <Package className="h-10 w-10 text-slate-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black">No orders found</h3>
              <p className="text-slate-500 font-medium">You haven't placed any orders yet.</p>
            </div>
            <Button className="rounded-full px-8 py-6 bg-indigo-600 font-black shadow-lg shadow-indigo-600/20" asChild>
              <Link href="/products">Explore Products</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
