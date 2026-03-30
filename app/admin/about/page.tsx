'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, Image as ImageIcon, Plus, Trash2, Edit3, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Image from 'next/image';

export default function AdminAboutPage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/content?page=about');
      const data = await res.json();
      if (res.ok) {
        setContent(data.sections || {
          about_title: 'Our Story',
          about_description: 'We started in 2026 with a passion for beautiful stationery and creative tools. Our mission is to provide premium quality products that inspire your journey.',
          about_images: [
            'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=400&h=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=400&h=400&auto=format&fit=crop',
          ],
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
        body: JSON.stringify({ page: 'about', sections: content }),
      });
      if (res.ok) {
        toast.success('About page updated successfully!');
      } else {
        toast.error('Failed to save content');
      }
    } catch (error) {
      toast.error('Error saving content');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key: string, value: any) => {
    setContent((prev: any) => ({ ...prev, [key]: value }));
  };

  const updateAboutImage = (index: number, value: string) => {
    const newImages = [...content.about_images];
    newImages[index] = value;
    updateField('about_images', newImages);
  };

  const removeAboutImage = (index: number) => {
    const newImages = content.about_images.filter((_: any, i: number) => i !== index);
    updateField('about_images', newImages);
  };

  const addAboutImage = () => {
    updateField('about_images', [...(content?.about_images || []), '']);
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
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">About Page Management</h1>
          <p className="text-slate-500 mt-2 font-medium">Edit your story, mission, and the images that represent your brand.</p>
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
          <h2 className="text-2xl font-black">Content Editor</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">Page Title</Label>
              <Input
                value={content?.about_title || ''}
                onChange={(e) => updateField('about_title', e.target.value)}
                placeholder="About Us Title"
                className="rounded-2xl border-2 py-7 focus-visible:ring-indigo-600 font-black text-lg"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">Our Story / Description</Label>
              <Textarea
                value={content?.about_description || ''}
                onChange={(e) => updateField('about_description', e.target.value)}
                placeholder="Write your story here..."
                className="rounded-2xl border-2 min-h-[300px] focus-visible:ring-indigo-600 font-medium leading-relaxed"
              />
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-xl shadow-indigo-500/5 border dark:border-slate-800 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black">Page Images</h2>
            <Button onClick={addAboutImage} variant="outline" size="sm" className="rounded-xl font-bold border-2">
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </div>
          
          <div className="space-y-8">
            {content?.about_images?.map((img: string, idx: number) => (
              <div key={idx} className="space-y-4">
                <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  {img ? (
                    <>
                      <Image src={img} alt={`About Image ${idx + 1}`} fill className="object-cover" />
                      <button 
                        onClick={() => removeAboutImage(idx)}
                        className="absolute top-4 right-4 bg-rose-600 text-white p-2 rounded-xl shadow-lg hover:bg-rose-700 transition-colors"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <ImageIcon className="h-10 w-10 text-slate-300" />
                      <p className="text-slate-400 font-bold mt-4">No image selected</p>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">Image {idx + 1} URL</Label>
                  <Input
                    value={img}
                    onChange={(e) => updateAboutImage(idx, e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="rounded-2xl border-2 py-6 focus-visible:ring-indigo-600 font-medium"
                  />
                </div>
              </div>
            ))}
            
            {(!content?.about_images || content.about_images.length === 0) && (
              <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                <p className="text-slate-400 font-bold">No images added yet.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
