
'use client';

import { Truck, Globe, Clock, Package } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="space-y-16">
      <div className="space-y-6">
        <h1 className="text-5xl font-black tracking-tight leading-tight">Shipping Policy</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl font-medium">
          We strive to get your creative tools to you as quickly and safely as possible. 
          Here's everything you need to know about our shipping processes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { icon: Clock, title: 'Processing Time', desc: 'Orders are typically processed within 1-2 business days. During peak seasons or sales, processing may take up to 3 business days.' },
          { icon: Truck, title: 'Domestic Shipping', desc: 'We offer standard (3-5 days) and express (1-2 days) shipping options for all domestic orders within the United States.' },
          { icon: Globe, title: 'International Shipping', desc: 'We ship to over 50 countries worldwide. International delivery times vary between 7-21 business days depending on location.' },
          { icon: Package, title: 'Safe Packaging', desc: 'Our products are carefully packed using eco-friendly materials to ensure they arrive in perfect condition.' },
        ].map((item, i) => (
          <div key={i} className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:shadow-indigo-500/5">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center mb-6">
              <item.icon className="h-7 w-7 text-indigo-600" />
            </div>
            <h3 className="text-xl font-black mb-3">{item.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="prose dark:prose-invert max-w-none space-y-8 text-slate-600 dark:text-slate-400 font-medium">
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">Shipping Rates</h2>
          <p>Shipping costs are calculated at checkout based on the weight of your order and the destination address. We offer free standard shipping on all domestic orders over $75.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">Tracking Your Order</h2>
          <p>Once your order has been shipped, you will receive a shipping confirmation email containing your tracking number. You can use this number to track your package on the carrier's website.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">Customs and Duties</h2>
          <p>For international orders, please note that you may be responsible for paying additional customs duties, taxes, or fees as required by your country's regulations. These fees are not included in our shipping costs.</p>
        </section>
      </div>
    </div>
  );
}
