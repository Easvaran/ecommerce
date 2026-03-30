
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Pen, Notebook, Palette, Briefcase } from 'lucide-react';

export default function AboutPage() {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/content?page=about');
        const data = await res.json();
        if (res.ok) {
          setContent(data.sections);
        }
      } catch (error) {
        console.error('Error fetching about content');
      }
    };
    fetchContent();
  }, []);

  return (
    <div className="space-y-16">
      <div className="space-y-6">
        <h1 className="text-5xl font-black tracking-tight leading-tight">
          {content?.about_title || 'Elevating Your Creative Journey Since 2026'}
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl font-medium">
          {content?.about_description || 'StationeryHub was founded with a simple mission: to provide the finest tools for thinkers, creators, and doers. We believe that the right stationery can transform your daily workflow into an inspiring ritual.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative h-96 rounded-[2.5rem] overflow-hidden group">
          <Image
            src="https://images.unsplash.com/photo-1511556840683-d859ec7fe73d?q=80&w=800&h=800&auto=format&fit=crop"
            alt="Our Workspace"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
            <p className="text-white font-bold">Our Creative Studio in New York</p>
          </div>
        </div>
        <div className="relative h-96 rounded-[2.5rem] overflow-hidden group">
          <Image
            src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=800&h=800&auto=format&fit=crop"
            alt="Our Mission"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
            <p className="text-white font-bold">Curating the Finest Collection</p>
          </div>
        </div>
      </div>

      <div className="space-y-10">
        <h2 className="text-3xl font-black tracking-tight">Our Core Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { icon: Pen, title: 'Quality First', desc: 'Every product in our shop is hand-tested for performance and durability.' },
            { icon: Notebook, title: 'Mindful Design', desc: 'We select items that are as beautiful to look at as they are to use.' },
            { icon: Palette, title: 'Sustainability', desc: 'We prioritize eco-friendly materials and ethical manufacturing processes.' },
            { icon: Briefcase, title: 'Community', desc: 'We support local artists and foster a global community of stationery lovers.' },
          ].map((value, i) => (
            <div key={i} className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center mb-6">
                <value.icon className="h-7 w-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-black mb-3">{value.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
