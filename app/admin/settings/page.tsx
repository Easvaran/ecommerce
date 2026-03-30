'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, Globe, Mail, MapPin, Phone, Palette, Layout, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/content?page=settings');
      const data = await res.json();
      if (res.ok) {
        setContent(data.sections || {
          site_name: 'StationeryHub',
          site_logo: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=200&h=200&auto=format&fit=crop',
          contact_email: 'hello@stationeryhub.com',
          contact_phone: '+1 (234) 567-890',
          contact_address: '123 Creative Avenue, Stationery City, SC 12345',
          theme_color: '#4f46e5',
        });
      }
    } catch (error) {
      toast.error('Error fetching settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: 'settings', sections: content }),
      });
      if (res.ok) {
        toast.success('Settings updated successfully!');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (error) {
      toast.error('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key: string, value: string) => {
    setContent((prev: any) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Settings</h1>
          <p className="text-slate-500 mt-2 font-medium">Manage your website's branding, contact information, and global settings.</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-8 py-6 font-black shadow-xl shadow-indigo-500/20 group"
        >
          {saving ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Save className="h-5 w-5 mr-2" />}
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-xl shadow-indigo-500/5 border dark:border-slate-800 space-y-8">
          <h2 className="text-2xl font-black flex items-center">
            <span className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl flex items-center justify-center mr-4">
              <Globe className="h-5 w-5 text-indigo-600" />
            </span>
            Branding
          </h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">Website Name</Label>
              <Input
                value={content?.site_name || ''}
                onChange={(e) => updateField('site_name', e.target.value)}
                placeholder="StationeryHub"
                className="rounded-2xl border-2 py-7 focus-visible:ring-indigo-600 font-black text-lg"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">Website Logo URL</Label>
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-950 flex items-center justify-center border-2 border-slate-100 dark:border-slate-800 overflow-hidden">
                  {content?.site_logo ? (
                    <img src={content.site_logo} alt="Logo Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Layout className="h-8 w-8 text-slate-300" />
                  )}
                </div>
                <Input
                  value={content?.site_logo || ''}
                  onChange={(e) => updateField('site_logo', e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="rounded-2xl border-2 py-7 focus-visible:ring-indigo-600 font-medium flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">Theme Primary Color</Label>
              <div className="flex items-center space-x-6">
                <div 
                  className="w-16 h-16 rounded-2xl border-2 border-slate-100 dark:border-slate-800 shadow-sm"
                  style={{ backgroundColor: content?.theme_color || '#4f46e5' }}
                />
                <Input
                  value={content?.theme_color || '#4f46e5'}
                  onChange={(e) => updateField('theme_color', e.target.value)}
                  placeholder="#4f46e5"
                  className="rounded-2xl border-2 py-7 focus-visible:ring-indigo-600 font-medium flex-1"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-xl shadow-indigo-500/5 border dark:border-slate-800 space-y-8">
          <h2 className="text-2xl font-black flex items-center">
            <span className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl flex items-center justify-center mr-4">
              <Mail className="h-5 w-5 text-indigo-600" />
            </span>
            Contact Info
          </h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">Support Email</Label>
              <div className="relative group">
                <Input
                  value={content?.contact_email || ''}
                  onChange={(e) => updateField('contact_email', e.target.value)}
                  placeholder="hello@stationeryhub.com"
                  className="rounded-2xl border-2 py-7 focus-visible:ring-indigo-600 font-medium pr-12"
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">Phone Number</Label>
              <div className="relative group">
                <Input
                  value={content?.contact_phone || ''}
                  onChange={(e) => updateField('contact_phone', e.target.value)}
                  placeholder="+1 (234) 567-890"
                  className="rounded-2xl border-2 py-7 focus-visible:ring-indigo-600 font-medium pr-12"
                />
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">Store Address</Label>
              <div className="relative group">
                <Input
                  value={content?.contact_address || ''}
                  onChange={(e) => updateField('contact_address', e.target.value)}
                  placeholder="123 Creative Avenue, Stationery City"
                  className="rounded-2xl border-2 py-7 focus-visible:ring-indigo-600 font-medium pr-12"
                />
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
