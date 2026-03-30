'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Users, DollarSign, Package, TrendingUp, TrendingDown, ArrowRight, Star, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';

const chartData = [
  { name: 'Jan', sales: 4000, revenue: 2400 },
  { name: 'Feb', sales: 3000, revenue: 1398 },
  { name: 'Mar', sales: 2000, revenue: 9800 },
  { name: 'Apr', sales: 2780, revenue: 3908 },
  { name: 'May', sales: 1890, revenue: 4800 },
  { name: 'Jun', sales: 2390, revenue: 3800 },
  { name: 'Jul', sales: 3490, revenue: 4300 },
];

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/orders?limit=4'),
        ]);
        const statsData = await statsRes.json();
        const ordersData = await ordersRes.json();
        
        setStats(statsData);
        setRecentOrders(ordersData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statsCards = [
    { title: 'Total Revenue', value: stats ? `₹${stats.revenue.toFixed(2)}` : '₹0.00', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
    { title: 'Total Orders', value: stats ? stats.totalOrders.toString() : '0', icon: ShoppingBag, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-950/30' },
    { title: 'Active Users', value: stats ? stats.totalUsers.toString() : '0', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/30' },
    { title: 'Total Products', value: stats ? stats.totalProducts.toString() : '0', icon: Package, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-[3rem] bg-indigo-600 p-12 text-white shadow-2xl shadow-indigo-500/20">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="relative z-10 space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">Welcome back, {session?.user?.name || 'Admin'}! 👋</h1>
          <p className="text-indigo-100 text-lg font-medium opacity-90">Here's what's happening with StationeryHub today.</p>
          <div className="flex space-x-4 pt-4">
            <Link href="/admin/products">
              <Button className="bg-white text-indigo-600 hover:bg-indigo-50 rounded-2xl px-8 py-6 font-black shadow-xl">
                Manage Inventory
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button variant="outline" className="border-2 border-white/20 hover:bg-white/10 text-white rounded-2xl px-8 py-6 font-black">
                View Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {statsCards.map((stat, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -8 }}
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-xl shadow-indigo-500/5 border dark:border-slate-800 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div className={`${stat.bg} p-4 rounded-2xl`}>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-6">
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-2">{stat.title}</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Sales Chart */}
        <Card className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 shadow-xl shadow-indigo-500/5 border dark:border-slate-800 space-y-8">
          <CardHeader className="p-0 flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-black text-slate-900 dark:text-white">Sales Overview</CardTitle>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="font-bold rounded-lg bg-slate-50 dark:bg-slate-800">Weekly</Button>
              <Button variant="ghost" size="sm" className="font-bold rounded-lg text-slate-500">Monthly</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 800, color: '#4f46e5' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 shadow-xl shadow-indigo-500/5 border dark:border-slate-800 space-y-8">
          <CardHeader className="p-0 flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-black text-slate-900 dark:text-white">Recent Orders</CardTitle>
            <Link href="/admin/orders">
              <Button variant="link" className="text-indigo-600 font-bold p-0 group">
                View All <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-6">
              {recentOrders.length > 0 ? recentOrders.map((order: any, idx) => (
                <div key={idx} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-transparent hover:border-indigo-500/20 transition-all group cursor-pointer">
                  <div className="flex items-center space-x-5">
                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center font-black text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                      {order.userId?.name?.charAt(0) || 'G'}
                    </div>
                    <div>
                      <p className="font-black text-lg text-slate-900 dark:text-white">{order.userId?.name || 'Guest Customer'}</p>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">#{order._id.slice(-6).toUpperCase()} • {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-black text-lg text-indigo-600">₹{order.totalPrice.toFixed(2)}</p>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                      order.status === 'delivered' ? 'bg-emerald-100 text-emerald-600' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-20">
                  <p className="text-slate-500 font-bold">No recent orders found.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
