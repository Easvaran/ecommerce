'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Plus, Search, MoreVertical, Edit, Trash2, X, Upload, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    isFeatured: false,
  });

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
        setFormData(prev => ({
          ...prev,
          image: data.urls[0],
        }));
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

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: '',
      isFeatured: false,
    });
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/categories?search=${searchQuery}`);
      const data = await res.json();
      setCategories(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [searchQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingCategory ? `/api/categories/${editingCategory._id}` : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(`Category ${editingCategory ? 'updated' : 'added'} successfully!`);
        setIsDialogOpen(false);
        setEditingCategory(null);
        fetchCategories();
        resetForm();
      } else {
        toast.error(`Failed to ${editingCategory ? 'update' : 'add'} category`);
      }
    } catch (error) {
      toast.error('Error saving category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    try {
      const res = await fetch(`/api/categories/${categoryToDelete}`, { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        toast.success('Category deleted');
        // Update local state immediately
        setCategories(prev => prev.filter((c: any) => c._id !== categoryToDelete));
        fetchCategories();
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to delete');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error deleting category');
    } finally {
      setCategoryToDelete(null);
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      isFeatured: category.isFeatured,
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-10">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Categories</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Total Categories: {categories.length}</p>
        </div>
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search categories..." 
              className="pl-10 py-6 rounded-2xl border-2 focus-visible:ring-indigo-600" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingCategory(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-6 py-6 font-black shadow-xl shadow-indigo-500/20">
                <Plus className="mr-2 h-5 w-5" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl rounded-[2rem] p-0 shadow-2xl border-none h-[90vh] overflow-hidden flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 transition-all duration-500">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col h-full overflow-hidden"
              >
                <DialogHeader className="p-8 pb-4 shrink-0 border-b dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
                  <DialogTitle className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {editingCategory ? 'Update Category' : 'Add New Category'}
                  </DialogTitle>
                </DialogHeader>
                
                <form id="category-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Category Name</Label>
                        <Input
                          required
                          placeholder="e.g. Pens, Notebooks"
                          className="rounded-xl py-6 border-2 border-white dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus-visible:ring-indigo-600 font-bold shadow-sm transition-all"
                          value={formData.name}
                          onChange={(e) => {
                            const name = e.target.value;
                            const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                            setFormData({ ...formData, name, slug });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Category Slug</Label>
                        <Input
                          required
                          placeholder="e.g. pens-notebooks"
                          className="rounded-xl py-6 border-2 border-white dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 focus-visible:ring-indigo-600 font-bold shadow-sm"
                          value={formData.slug}
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Description</Label>
                      <Textarea
                        required
                        placeholder="Category description..."
                        className="rounded-xl min-h-[100px] border-2 border-white dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus-visible:ring-indigo-600 font-medium shadow-sm transition-all"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>

                    <div className="space-y-4">
                      <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Category Image</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.image && (
                          <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-white dark:border-slate-800 group shadow-md">
                            <Image src={formData.image} alt="Category" fill className="object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                                className="bg-rose-500 text-white p-2 rounded-lg hover:scale-110 transition-transform"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        )}
                        <label className={`aspect-video rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all flex flex-col items-center justify-center cursor-pointer bg-white/30 dark:bg-slate-900/30 group ${formData.image ? 'h-full' : 'w-full'}`}>
                          {uploading ? (
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                          ) : (
                            <>
                              <Upload className="h-8 w-8 text-slate-400 group-hover:text-indigo-600 mb-2 transition-all" />
                              <span className="text-[10px] font-black text-slate-500 group-hover:text-indigo-600 uppercase tracking-widest">Upload Image</span>
                            </>
                          )}
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                        </label>
                      </div>
                      <div className="relative group">
                        <Input
                          placeholder="Or paste image URL..."
                          className="rounded-xl py-6 border-2 border-white dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus-visible:ring-indigo-600 font-bold shadow-sm transition-all"
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-5 bg-white/50 dark:bg-slate-900/50 rounded-2xl border-2 border-white dark:border-slate-800 shadow-sm">
                      <Switch 
                        id="isFeatured"
                        checked={formData.isFeatured}
                        onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                      />
                      <Label htmlFor="isFeatured" className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                        Feature this category on the homepage
                      </Label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-8 border-t dark:border-slate-800">
                    <Button 
                      variant="ghost" 
                      type="button" 
                      onClick={() => setIsDialogOpen(false)} 
                      className="rounded-xl font-black px-8 text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-all h-auto py-4"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={isSubmitting || uploading} 
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl px-10 py-4 font-black shadow-xl shadow-indigo-500/20 h-auto transition-all hover:scale-[1.02] active:scale-95"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <span className="flex items-center">
                          {editingCategory ? 'Update Category' : 'Create Category'}
                          <CheckCircle2 className="ml-2 h-5 w-5" />
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-64 rounded-[2.5rem] bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))
        ) : (
          categories.map((category: any) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 shadow-xl shadow-indigo-500/5 border border-transparent hover:border-indigo-500/20 transition-all overflow-hidden"
            >
              <div className="relative h-48 w-full rounded-3xl overflow-hidden mb-6">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="icon" className="h-10 w-10 rounded-xl bg-white/90 backdrop-blur-md shadow-lg border-none">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl z-[60]">
                      <DropdownMenuItem onClick={() => handleEdit(category)} className="rounded-xl p-3 cursor-pointer group transition-colors focus:bg-indigo-50 dark:focus:bg-indigo-950/30">
                        <Edit className="mr-3 h-4 w-4 text-slate-500 group-hover:text-indigo-600 group-focus:text-indigo-600" />
                        <span className="font-bold">Edit Category</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setCategoryToDelete(category._id)} className="rounded-xl p-3 cursor-pointer group text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/30 transition-colors">
                        <Trash2 className="mr-3 h-4 w-4" />
                        <span className="font-bold">Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{category.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium line-clamp-2">{category.description}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!categoryToDelete} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
        <AlertDialogContent className="rounded-[2.5rem] p-10 border-none shadow-2xl">
          <AlertDialogHeader>
            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/30 rounded-2xl flex items-center justify-center mb-6">
              <AlertCircle className="h-8 w-8 text-rose-600" />
            </div>
            <AlertDialogTitle className="text-3xl font-black">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-lg font-medium text-slate-500">
              This action cannot be undone. This will permanently delete the category from your database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 space-x-4">
            <AlertDialogCancel className="rounded-2xl py-7 font-black flex-1 border-2">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="rounded-2xl py-7 font-black flex-1 bg-rose-600 hover:bg-rose-700 text-white shadow-xl shadow-rose-600/20"
            >
              Delete Category
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
