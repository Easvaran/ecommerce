'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, Image as ImageIcon, Plus, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Image from 'next/image';

export default function AdminHomePage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', files[0]);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });
      const data = await res.json();
      if (res.ok) {
        updateField('hero_banner', data.urls[0]);
        toast.success('Image uploaded successfully');
      } else {
        toast.error(data.message || 'Failed to upload image');
      }
    } catch (error) {
      toast.error('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/content?page=home');
      const data = await res.json();
      if (res.ok) {
        setContent(data.sections || {
          hero_title: 'Premium Stationery for Your Creative Journey',
          hero_subtitle: 'Discover our curated collection of fine pens, notebooks, and art supplies.',
          hero_banner: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=1200&h=600&auto=format&fit=crop',
          featured_title: 'Featured Collection',
          featured_subtitle: 'Our most popular and highly-rated items that customers love.',
        });
      }
    } catch (error) {
      toast.error('Error fetching content');
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
        body: JSON.stringify({ page: 'home', sections: content }),
      });
      if (res.ok) {
        toast.success('Home content updated successfully!');
      } else {
        toast.error('Failed to save content');
      }
    } catch (error) {
      toast.error('Error saving content');
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
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Home Content</h1>
          <p className="text-slate-500 mt-2 font-medium">Manage the hero section and featured content of your home page.</p>
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
        <div className="space-y-10">
          <section className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-xl shadow-indigo-500/5 border dark:border-slate-800 space-y-8">
            <h2 className="text-2xl font-black flex items-center">
              <span className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl flex items-center justify-center mr-4">
                <ImageIcon className="h-5 w-5 text-indigo-600" />
              </span>
              Hero Section
            </h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">Hero Title</Label>
                <Input
                  value={content?.hero_title || ''}
                  onChange={(e) => updateField('hero_title', e.target.value)}
                  placeholder="Main heading on home page"
                  className="rounded-2xl border-2 py-7 focus-visible:ring-indigo-600 font-black text-lg"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">Hero Subtitle</Label>
                <Textarea
                  value={content?.hero_subtitle || ''}
                  onChange={(e) => updateField('hero_subtitle', e.target.value)}
                  placeholder="Subtext under the main heading"
                  className="rounded-2xl border-2 min-h-[120px] focus-visible:ring-indigo-600 font-medium"
                />
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-xl shadow-indigo-500/5 border dark:border-slate-800 space-y-8">
            <h2 className="text-2xl font-black">Featured Section</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">Section Title</Label>
                <Input
                  value={content?.featured_title || ''}
                  onChange={(e) => updateField('featured_title', e.target.value)}
                  placeholder="Title for featured products"
                  className="rounded-2xl border-2 py-7 focus-visible:ring-indigo-600 font-black"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">Section Subtitle</Label>
                <Textarea
                  value={content?.featured_subtitle || ''}
                  onChange={(e) => updateField('featured_subtitle', e.target.value)}
                  placeholder="Description for the featured products section"
                  className="rounded-2xl border-2 min-h-[100px] focus-visible:ring-indigo-600 font-medium"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-10">
          <section className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-xl shadow-indigo-500/5 border dark:border-slate-800 space-y-8">
            <h2 className="text-2xl font-black">Hero Banner Image</h2>
            <div className="space-y-6">
              <div className="relative aspect-video rounded-3xl overflow-hidden border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 group">
                {content?.hero_banner ? (
                  <>
                    <Image src={content.hero_banner} alt="Hero Banner" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                      <label className="bg-white text-slate-900 p-3 rounded-xl cursor-pointer hover:scale-110 transition-transform">
                        <Upload className="h-5 w-5" />
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                      </label>
                      <button 
                        onClick={() => updateField('hero_banner', '')}
                        className="bg-rose-600 text-white p-3 rounded-xl hover:scale-110 transition-transform"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <label className="flex flex-col items-center justify-center h-full space-y-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center">
                      {uploading ? <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" /> : <Plus className="h-8 w-8 text-slate-400" />}
                    </div>
                    <p className="text-slate-500 font-bold">{uploading ? 'Uploading...' : 'Click to upload image'}</p>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                )}
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">Banner Image URL</Label>
                <div className="relative group">
                  <Input
                    value={content?.hero_banner || ''}
                    onChange={(e) => updateField('hero_banner', e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="rounded-2xl border-2 py-7 focus-visible:ring-indigo-600 font-medium pr-12"
                  />
                  <Upload className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                </div>
                <p className="text-xs text-slate-400 mt-2 ml-1">Recommend size: 1920x800px. Supports JPG, PNG, WebP.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
