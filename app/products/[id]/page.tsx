'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Star, Heart, Share2, ShieldCheck, Truck, RotateCcw, Minus, Plus, ChevronRight, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

import useCartStore from '@/store/cartStore';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const addItemToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          setProduct(null);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = () => {
    if (!product) return;
    addItemToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
    }, quantity);
    toast.success(`${product.name} added to cart!`, {
      description: `Quantity: ${quantity}`,
      icon: <ShoppingCart className="h-4 w-4" />,
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-6">
            <Skeleton className="aspect-square w-full rounded-[2rem]" />
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-xl" />
              ))}
            </div>
          </div>
          <div className="space-y-8 py-4">
            <div className="space-y-4">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-12 w-3/4 rounded-lg" />
              <Skeleton className="h-6 w-1/3 rounded-lg" />
            </div>
            <Skeleton className="h-32 w-full rounded-2xl" />
            <div className="flex items-center space-x-4">
              <Skeleton className="h-16 w-32 rounded-full" />
              <Skeleton className="h-16 flex-1 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-4xl font-bold">Product not found</h1>
        <Button className="mt-8 rounded-full px-8" asChild>
          <a href="/products">Back to Shop</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <a href="/" className="hover:text-indigo-600 transition-colors">Home</a>
        <ChevronRight className="h-4 w-4 flex-shrink-0" />
        <a href="/products" className="hover:text-indigo-600 transition-colors">Shop</a>
        <ChevronRight className="h-4 w-4 flex-shrink-0" />
        <span className="text-slate-900 dark:text-slate-100 font-bold truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900 group"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full"
              >
                <Image
                  src={product.images?.[activeImage] || 'https://via.placeholder.com/800x800'}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
            </AnimatePresence>
            <Button size="icon" variant="secondary" className="absolute top-4 right-4 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity h-9 w-9">
              <Heart className="h-4 w-4" />
            </Button>
          </motion.div>

          {product.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images?.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === idx ? 'border-indigo-600 shadow-sm' : 'border-transparent hover:border-slate-200 dark:hover:border-slate-800'
                  }`}
                >
                  <Image src={img} alt={`${product.name} view ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6 flex flex-col py-4">
          <div className="space-y-3">
            <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-none px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[10px]">
              {product.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
              {product.name}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="flex items-center space-x-1 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded-full">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                <span className="font-black text-amber-700 dark:text-amber-500 text-sm">{product.rating?.toFixed(1) || '0.0'}</span>
                <span className="text-amber-700/60 dark:text-amber-500/60 text-xs">({product.numReviews})</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-500">
                <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                <span className="font-bold text-xs">{product.stock > 0 ? `In Stock` : 'Out of Stock'}</span>
              </div>
            </div>
            <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 pt-2">
              ₹{product.price?.toFixed(2) || '0.00'}
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold mb-2 flex items-center text-sm">
              <MessageSquare className="mr-2 h-3.5 w-3.5 text-indigo-600" /> Description
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
              {product.description}
            </p>
          </div>

          <div className="space-y-5 pt-2">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="flex items-center justify-center bg-white dark:bg-slate-800 rounded-full border-2 border-slate-100 dark:border-slate-800 p-1 shadow-sm">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-10 w-10 hover:bg-slate-50 dark:hover:bg-slate-700"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={product.stock === 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center font-black text-lg">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-10 w-10 hover:bg-slate-50 dark:hover:bg-slate-700"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={product.stock === 0 || quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                size="lg" 
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full py-7 font-black text-base shadow-lg shadow-indigo-500/20"
                onClick={addToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
            <div className="flex items-center justify-between px-2 text-xs sm:text-sm">
              <button className="flex items-center font-bold text-slate-500 hover:text-indigo-600 transition-colors">
                <Share2 className="mr-2 h-4 w-4" /> Share Product
              </button>
              <button className="flex items-center font-bold text-slate-500 hover:text-indigo-600 transition-colors">
                <RotateCcw className="mr-2 h-4 w-4" /> 30-Day Returns
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 mt-auto border-t dark:border-slate-800">
            <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
              <div className="bg-indigo-50 dark:bg-indigo-950/30 p-2.5 rounded-xl">
                <Truck className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-900 dark:text-slate-100">Free Delivery</p>
                <p>On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
              <div className="bg-purple-50 dark:bg-purple-950/30 p-2.5 rounded-xl">
                <ShieldCheck className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-900 dark:text-slate-100">Safe Payment</p>
                <p>100% secure processing</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for Reviews & Specifications */}
      <div className="mt-20 md:mt-32">
        <Tabs defaultValue="reviews" className="w-full">
          <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0 space-x-4 sm:space-x-8 overflow-x-auto">
            <TabsTrigger
              value="reviews"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent px-1 py-4 font-black text-base sm:text-lg text-slate-500 data-[state=active]:text-indigo-600 whitespace-nowrap"
            >
              Reviews ({product.numReviews || 0})
            </TabsTrigger>
            <TabsTrigger
              value="specs"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent px-1 py-4 font-black text-base sm:text-lg text-slate-500 data-[state=active]:text-indigo-600 whitespace-nowrap"
            >
              Specifications
            </TabsTrigger>
          </TabsList>
          <TabsContent value="reviews" className="py-8 sm:py-10 space-y-8">
            {product.reviews?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.reviews.map((review: any, idx: number) => (
                  <div key={idx} className="p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border dark:border-slate-800 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-black text-indigo-600">
                          {review.userName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">{review.userName || 'Anonymous'}</h4>
                          <p className="text-xs text-slate-500">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Date unavailable'}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-amber-500 flex-shrink-0 ml-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < (review.rating || 0) ? 'fill-current' : 'text-slate-200'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic text-sm">"{review.comment || 'No comment'}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 sm:py-20 bg-slate-50 dark:bg-slate-900 rounded-2xl sm:rounded-[3rem]">
                <MessageSquare className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-slate-300 mb-4 sm:mb-6" />
                <h3 className="text-xl sm:text-2xl font-bold mb-2">No reviews yet</h3>
                <p className="text-slate-500 mb-6 sm:mb-8 text-sm sm:text-base">Be the first to share your experience with this product.</p>
                <Button className="rounded-full px-6 sm:px-8 bg-indigo-600">Write a Review</Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="specs" className="py-8 sm:py-10">
            <div className="max-w-2xl mx-auto premium-card p-6 sm:p-10 space-y-4">
              {[
                { label: 'Category', value: product.category },
                { label: 'Material', value: 'Eco-friendly sustainable material' },
                { label: 'Weight', value: '0.25 kg' },
                { label: 'Dimensions', value: '15 x 10 x 2 cm' },
                { label: 'Origin', value: 'Handcrafted in Italy' },
              ].map((spec, idx) => (
                <div key={idx} className="flex justify-between items-center py-3 sm:py-4 border-b last:border-0 dark:border-slate-800">
                  <span className="font-bold text-slate-500 text-sm">{spec.label}</span>
                  <span className="font-black text-slate-900 dark:text-slate-100 text-sm text-right">{spec.value}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
