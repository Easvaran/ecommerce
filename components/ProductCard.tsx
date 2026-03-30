'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import useCartStore from '@/store/cartStore';
import { useWishlist } from '@/hooks/useWishlist';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  rating: number;
  numReviews: number;
  isFeatured?: boolean;
}

const ProductCard = ({ product }: { product: Product }) => {
  const addItemToCart = useCartStore((state) => state.addItem);
  const { isInWishlist, toggleWishlist, isLoading } = useWishlist();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItemToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0] || 'https://via.placeholder.com/400x400',
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  const isProductInWishlist = isInWishlist(product._id);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Card className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-2xl bg-white dark:bg-slate-900">
        <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
          <Link href={`/products/${product._id}`}>
            <Image
              src={product.images[0] || 'https://via.placeholder.com/400x400'}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
            />
          </Link>

          {/* Overlay Buttons */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out">
            <Button 
              size="icon" 
              variant="secondary" 
              className="rounded-full shadow-lg hover:bg-white hover:text-rose-500 transition-colors disabled:opacity-50"
              onClick={handleWishlistToggle}
              disabled={isLoading}
            >
              <Heart className={`h-5 w-5 ${isProductInWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
            </Button>
          </div>

          {product.stock === 0 && (
            <Badge variant="destructive" className="absolute top-4 left-4 uppercase font-bold tracking-wider px-3 py-1 text-[10px] rounded-full">
              Out of Stock
            </Badge>
          )}

          {product.isFeatured && (
            <Badge className="absolute top-4 left-4 bg-indigo-600 hover:bg-indigo-700 uppercase font-bold tracking-wider px-3 py-1 text-[10px] rounded-full">
              Featured
            </Badge>
          )}
        </div>

        <CardContent className="p-5 space-y-2">
          <Link href={`/products/${product._id}`}>
            <h3 className="font-bold text-lg line-clamp-1 group-hover:text-indigo-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 min-h-[2.5rem] leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center space-x-2 pt-2">
            <div className="flex items-center text-amber-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-bold ml-1">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-slate-400 text-xs">({product.numReviews} reviews)</span>
          </div>
        </CardContent>

        <CardFooter className="px-5 pb-5 pt-0 flex flex-col items-start space-y-4">
          <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">
            ₹{product.price.toFixed(2)}
          </div>
          <Button
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-all w-full py-6"
            disabled={product.stock === 0}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
