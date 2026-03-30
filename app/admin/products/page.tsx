'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Plus, Search, Filter, MoreVertical, Edit, Trash2, X, Upload, Loader2, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: [] as string[],
  });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i]);
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...data.urls],
        }));
        toast.success('Images uploaded successfully');
      } else {
        toast.error(data.message || 'Failed to upload images');
      }
    } catch (error) {
      toast.error('Error uploading images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?limit=100&search=${searchQuery}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data || []);
      if (data.length > 0 && !formData.category) {
        setFormData(prev => ({ ...prev, category: data[0].name }));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [searchQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
        }),
      });

      if (res.ok) {
        toast.success(`Product ${editingProduct ? 'updated' : 'added'} successfully!`);
        setIsDialogOpen(false);
        setEditingProduct(null);
        fetchProducts();
        resetForm();
      } else {
        toast.error(`Failed to ${editingProduct ? 'update' : 'add'} product`);
      }
    } catch (error) {
      toast.error('Error saving product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: categories.length > 0 ? categories[0].name : '',
      stock: '',
      images: [],
    });
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      const res = await fetch(`/api/products/${productToDelete}`, { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        toast.success('Product deleted successfully');
        // Update local state immediately for instant feedback
        setProducts(prev => prev.filter((p: any) => p._id !== productToDelete));
        fetchProducts(); // Also refresh from server to stay in sync
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Error deleting product');
    } finally {
      setProductToDelete(null);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      images: product.images,
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-10">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Products Inventory</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Total Products: {products.length}</p>
        </div>
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search inventory..." 
              className="pl-10 py-6 rounded-2xl border-2 focus-visible:ring-indigo-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingProduct(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-6 py-6 font-black shadow-xl shadow-indigo-500/20">
                <Plus className="mr-2 h-5 w-5" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl rounded-[2rem] p-0 shadow-2xl border-none h-[90vh] overflow-hidden flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 transition-all duration-500">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col h-full"
              >
                <DialogHeader className="p-8 pb-4 shrink-0 border-b dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
                  <DialogTitle className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {editingProduct ? 'Update Product' : 'Add New Product'}
                  </DialogTitle>
                </DialogHeader>
                
                <form id="product-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 pt-6 space-y-6 custom-scrollbar">
                  <div className="space-y-5">
                    {/* Product Name */}
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Product Name</label>
                      <Input
                        required
                        placeholder="e.g. Premium Fountain Pen"
                        className="rounded-xl py-6 border-2 border-white dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus-visible:ring-indigo-600 font-bold shadow-sm transition-all"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                      <Textarea
                        required
                        placeholder="Product details and features..."
                        className="rounded-xl min-h-[100px] border-2 border-white dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus-visible:ring-indigo-600 font-medium shadow-sm transition-all"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      {/* Price */}
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Price (₹)</label>
                        <Input
                          required
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="rounded-xl py-6 border-2 border-white dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus-visible:ring-indigo-600 font-bold shadow-sm transition-all"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        />
                      </div>
                      {/* Stock */}
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Stock</label>
                        <Input
                          required
                          type="number"
                          placeholder="0"
                          className="rounded-xl py-6 border-2 border-white dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus-visible:ring-indigo-600 font-bold shadow-sm transition-all"
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                      <div className="relative">
                        <select
                          className="w-full rounded-xl py-3 px-4 border-2 border-white dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:border-indigo-600 focus:outline-none font-bold shadow-sm appearance-none cursor-pointer transition-all"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          required
                        >
                          <option value="" disabled>Select Category</option>
                          {categories.map((cat: any) => (
                            <option key={cat._id} value={cat.name}>{cat.name}</option>
                          ))}
                        </select>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 rotate-90 pointer-events-none" />
                      </div>
                    </div>

                    {/* Image Upload Area */}
                    <div className="space-y-4">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Product Images</label>
                      <div className="grid grid-cols-3 gap-4">
                        {formData.images.map((url, index) => (
                          <motion.div 
                            key={index} 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative aspect-square rounded-2xl overflow-hidden border-2 border-white dark:border-slate-800 group shadow-md"
                          >
                            <Image src={url} alt="Product" fill className="object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="bg-rose-500 text-white p-2 rounded-lg hover:scale-110 transition-transform"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                        
                        {/* Drag & Drop Upload Box */}
                        <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all flex flex-col items-center justify-center cursor-pointer bg-white/30 dark:bg-slate-900/30 group relative overflow-hidden">
                          {uploading ? (
                            <div className="flex flex-col items-center">
                              <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
                              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter">Uploading...</span>
                            </div>
                          ) : (
                            <>
                              <Upload className="h-8 w-8 text-slate-400 group-hover:text-indigo-600 group-hover:-translate-y-1 transition-all mb-2" />
                              <span className="text-[10px] font-black text-slate-500 group-hover:text-indigo-600 transition-colors uppercase tracking-widest text-center px-2">Upload from Device</span>
                            </>
                          )}
                          <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} />
                        </label>
                      </div>

                      {/* URL Input */}
                      <div className="relative group">
                        <Input
                          placeholder="Or paste image URL and press Enter..."
                          className="rounded-xl py-6 border-2 border-white dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus-visible:ring-indigo-600 font-bold shadow-sm transition-all pr-12"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const input = e.target as HTMLInputElement;
                              if (input.value) {
                                setFormData(prev => ({ ...prev, images: [...prev.images, input.value] }));
                                input.value = '';
                                toast.success('Image URL added');
                              }
                            }
                          }}
                        />
                        <Plus className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      </div>
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
                          {editingProduct ? 'Update Product' : 'Add Product'}
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

      {/* Products Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl shadow-indigo-500/5 border dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b dark:border-slate-800">
              <tr>
                <th className="p-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">Product Info</th>
                <th className="p-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">Category</th>
                <th className="p-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">Stock</th>
                <th className="p-6 font-black text-slate-500 uppercase tracking-widest text-[10px]">Price</th>
                <th className="p-6 font-black text-slate-500 uppercase tracking-widest text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="p-6"><Skeleton className="h-16 w-64 rounded-xl" /></td>
                    <td className="p-6"><Skeleton className="h-8 w-24 rounded-lg" /></td>
                    <td className="p-6"><Skeleton className="h-8 w-16 rounded-lg" /></td>
                    <td className="p-6"><Skeleton className="h-8 w-20 rounded-lg" /></td>
                    <td className="p-6"><Skeleton className="h-10 w-10 ml-auto rounded-lg" /></td>
                  </tr>
                ))
              ) : products.length > 0 ? (
                products.map((product: any) => (
                  <tr key={product._id} className="group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                          <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-black truncate text-slate-900 dark:text-white">{product.name}</p>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">ID: {product._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <Badge className="bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 border-none font-black text-[10px] uppercase tracking-wider px-3 py-1">
                        {product.category}
                      </Badge>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-rose-500'}`} />
                        <span className="font-bold text-sm text-slate-700 dark:text-slate-300">{product.stock} units</span>
                      </div>
                    </td>
                    <td className="p-6 font-black text-indigo-600">₹{product.price.toFixed(2)}</td>
                    <td className="p-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                            <MoreVertical className="h-5 w-5 text-slate-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl z-[60]">
                          <DropdownMenuItem onClick={() => handleEdit(product)} className="font-bold py-3 rounded-xl cursor-pointer group transition-colors focus:bg-indigo-50 dark:focus:bg-indigo-950/30">
                            <Edit className="mr-3 h-4 w-4 text-slate-500 group-hover:text-indigo-600 group-focus:text-indigo-600" />
                            <span className="font-bold">Edit Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="font-bold py-3 rounded-xl cursor-pointer text-rose-500 focus:text-rose-500 transition-colors focus:bg-rose-50 dark:focus:bg-rose-950/30 group"
                            onClick={() => setProductToDelete(product._id)}
                          >
                            <Trash2 className="mr-3 h-4 w-4 text-rose-400 group-hover:text-rose-600 group-focus:text-rose-600" />
                            <span className="font-bold">Delete Product</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Package className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="text-2xl font-black mb-2 text-slate-900 dark:text-white">No products found</h3>
                    <p className="text-slate-500 font-medium mb-8">Start adding some items to your inventory</p>
                    <Button onClick={() => setIsDialogOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 py-6 font-black shadow-xl shadow-indigo-600/20">
                      Add Your First Product
                    </Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent className="rounded-[2.5rem] p-10 border-none shadow-2xl">
          <AlertDialogHeader>
            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/30 rounded-2xl flex items-center justify-center mb-6">
              <AlertCircle className="h-8 w-8 text-rose-600" />
            </div>
            <AlertDialogTitle className="text-3xl font-black">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-lg font-medium text-slate-500">
              This action cannot be undone. This will permanently delete the product from your database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 space-x-4">
            <AlertDialogCancel className="rounded-2xl py-7 font-black flex-1 border-2">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProduct}
              className="rounded-2xl py-7 font-black flex-1 bg-rose-600 hover:bg-rose-700 text-white shadow-xl shadow-rose-600/20"
            >
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
