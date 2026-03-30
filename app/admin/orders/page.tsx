'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, Filter, MoreVertical, Eye, Truck, CheckCircle2, XCircle, Clock, Calendar, User, DollarSign, ChevronRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?status=${filterStatus}&search=${searchQuery}`);
      const data = await res.json();
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus, searchQuery]);

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      // Add a PUT route for orders to update status
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        toast.success(`Order marked as ${status}`);
        fetchOrders();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      toast.error('Error updating order');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none px-3 py-1 font-black uppercase tracking-widest text-[10px] rounded-full"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'shipped':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none px-3 py-1 font-black uppercase tracking-widest text-[10px] rounded-full"><Truck className="h-3 w-3 mr-1" /> Shipped</Badge>;
      case 'delivered':
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none px-3 py-1 font-black uppercase tracking-widest text-[10px] rounded-full"><CheckCircle2 className="h-3 w-3 mr-1" /> Delivered</Badge>;
      case 'cancelled':
        return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200 border-none px-3 py-1 font-black uppercase tracking-widest text-[10px] rounded-full"><XCircle className="h-3 w-3 mr-1" /> Cancelled</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none px-3 py-1 font-black uppercase tracking-widest text-[10px] rounded-full">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-10">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-4xl font-black tracking-tight">Order Management</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Manage your customer's purchases</p>
        </div>
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <Input 
              placeholder="Search by order ID or city..." 
              className="pl-12 py-7 rounded-2xl border-2 focus-visible:ring-indigo-600 transition-all font-bold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border-2">
            <Filter className="h-5 w-5 text-slate-400 ml-2" />
            <select
              className="bg-transparent border-none focus:ring-0 font-bold text-slate-600 dark:text-slate-400 pr-8"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          [...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-[2.5rem]" />)
        ) : orders.length > 0 ? (
          orders.map((order: any) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="premium-card p-10 flex flex-col md:flex-row gap-10 group hover:shadow-2xl transition-all duration-500"
            >
              <div className="flex-1 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black flex items-center">
                      Order {order._id.slice(-6).toUpperCase()}
                      <span className="mx-3 w-1 h-1 bg-slate-300 rounded-full" />
                      {getStatusBadge(order.status)}
                    </h3>
                    <div className="flex items-center text-slate-500 text-sm font-bold">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Total Amount</p>
                    <p className="text-3xl font-black text-indigo-600">₹{order.totalPrice.toFixed(2)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pt-6 border-t dark:border-slate-800">
                  <div className="space-y-3">
                    <div className="flex items-center text-xs font-black text-slate-400 uppercase tracking-widest">
                      <User className="h-4 w-4 mr-2 text-indigo-600" /> Customer
                    </div>
                    <div className="font-bold">
                      <p className="text-slate-900 dark:text-slate-100">{order.userId?.name || 'Guest'}</p>
                      <p className="text-slate-500 text-sm">{order.userId?.email || 'No email'}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center text-xs font-black text-slate-400 uppercase tracking-widest">
                      <Truck className="h-4 w-4 mr-2 text-indigo-600" /> Shipping to
                    </div>
                    <div className="font-bold">
                      <p className="text-slate-900 dark:text-slate-100">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                      <p className="text-slate-500 text-sm">{order.shippingAddress.address}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center text-xs font-black text-slate-400 uppercase tracking-widest">
                      <DollarSign className="h-4 w-4 mr-2 text-indigo-600" /> Payment
                    </div>
                    <div className="font-bold">
                      <p className="text-slate-900 dark:text-slate-100">{order.paymentMethod}</p>
                      <p className={`text-sm ${order.isPaid ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {order.isPaid ? 'Payment Received' : 'Payment Pending'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between items-end gap-4 md:border-l dark:border-slate-800 md:pl-10">
                <div className="flex -space-x-3 overflow-hidden">
                  {order.orderItems.map((item: any, idx: number) => (
                    <div key={idx} className="relative w-14 h-14 rounded-2xl border-4 border-white dark:border-slate-900 overflow-hidden bg-slate-50 shadow-sm group-hover:scale-110 transition-transform">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-3 w-full">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="w-full bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-indigo-600 dark:hover:bg-indigo-600 dark:hover:text-white rounded-2xl py-6 font-black shadow-xl">
                        Update Status
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-xl p-2 shadow-xl border-none">
                      <DropdownMenuItem onClick={() => updateOrderStatus(order._id, 'pending')} className="font-bold py-3 rounded-lg cursor-pointer">
                        <Clock className="mr-2 h-4 w-4 text-amber-500" /> Mark Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateOrderStatus(order._id, 'shipped')} className="font-bold py-3 rounded-lg cursor-pointer">
                        <Truck className="mr-2 h-4 w-4 text-blue-500" /> Mark Shipped
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateOrderStatus(order._id, 'delivered')} className="font-bold py-3 rounded-lg cursor-pointer">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" /> Mark Delivered
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateOrderStatus(order._id, 'cancelled')} className="font-bold py-3 rounded-lg cursor-pointer text-rose-500 focus:text-rose-500">
                        <XCircle className="mr-2 h-4 w-4" /> Cancel Order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="outline" className="w-full rounded-2xl py-6 font-black border-2 group">
                    View Details
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center space-y-6 bg-white dark:bg-slate-900 rounded-[3rem]">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-950 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-10 w-10 text-slate-400" />
            </div>
            <div>
              <h3 className="text-2xl font-black mb-2">No orders found</h3>
              <p className="text-slate-500 max-w-xs mx-auto">Orders will appear here once customers start purchasing.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
