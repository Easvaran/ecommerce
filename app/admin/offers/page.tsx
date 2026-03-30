'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Save, Loader2, Tag } from 'lucide-react';

export default function AdminOffersPage() {
  const [offer, setOffer] = useState({
    title: '',
    subtitle: '',
    code: '',
    brandName: 'StationeryHub',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const res = await fetch('/api/offers');
        const data = await res.json();
        if (res.ok) {
          setOffer(data);
        }
      } catch (error) {
        console.error('Error fetching offer');
      } finally {
        setLoading(false);
      }
    };
    fetchOffer();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/offers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offer),
      });

      if (res.ok) {
        toast.success('Offer updated successfully!');
      } else {
        toast.error('Failed to update offer');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <div className="flex items-center space-x-4">
        <div className="bg-indigo-100 dark:bg-indigo-950/30 p-3 rounded-2xl">
          <Tag className="h-8 w-8 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-3xl font-black">Promotional Banner</h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">Edit the main offer on your homepage</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900/50 p-8 md:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl space-y-8">
        <div className="space-y-3">
          <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Title</label>
          <Input 
            value={offer.title}
            onChange={(e) => setOffer({ ...offer, title: e.target.value })}
            className="py-8 rounded-2xl border-2 border-slate-100 dark:border-slate-800 focus:border-indigo-600 focus:ring-0 transition-all text-lg font-bold px-6"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Subtitle</label>
          <Textarea 
            value={offer.subtitle}
            onChange={(e) => setOffer({ ...offer, subtitle: e.target.value })}
            className="py-6 rounded-2xl border-2 border-slate-100 dark:border-slate-800 focus:border-indigo-600 focus:ring-0 transition-all text-lg font-bold px-6 min-h-[120px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Discount Code</label>
            <Input 
              value={offer.code}
              onChange={(e) => setOffer({ ...offer, code: e.target.value })}
              className="py-8 rounded-2xl border-2 border-slate-100 dark:border-slate-800 focus:border-indigo-600 focus:ring-0 transition-all text-lg font-bold px-6"
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Brand Name</label>
            <Input 
              value={offer.brandName}
              onChange={(e) => setOffer({ ...offer, brandName: e.target.value })}
              className="py-8 rounded-2xl border-2 border-slate-100 dark:border-slate-800 focus:border-indigo-600 focus:ring-0 transition-all text-lg font-bold px-6"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          disabled={saving}
          className="rounded-full px-10 py-7 bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98]"
        >
          {saving ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Save className="mr-2 h-5 w-5" />
          )}
          Save Changes
        </Button>
      </div>
    </motion.div>
  );
}
