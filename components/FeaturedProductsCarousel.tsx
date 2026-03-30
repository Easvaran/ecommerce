'use client';

import Image from 'next/image';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  images: string[];
}

interface FeaturedProductsCarouselProps {
  products: Product[];
}

export default function FeaturedProductsCarousel({ products }: FeaturedProductsCarouselProps) {
  // Duplicate the product list 3x to ensure enough content to fill the screen and loop seamlessly.
  const duplicatedProducts = [...products, ...products, ...products];

  return (
    <div className="relative w-full overflow-hidden py-10 group">
      {/* CSS Animation Keyframes for a seamless loop */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.3333%);
          }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>

      {/* Left and Right Gradient Fades for a premium "infinity" feel */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white dark:from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white dark:from-black to-transparent z-10 pointer-events-none" />

      {/* Marquee Container */}
      <div className="flex w-max animate-marquee">
        {duplicatedProducts.map((product, idx) => (
          <Link 
            key={`${product._id}-${idx}`} 
            href="/products"
            className="relative shrink-0 w-[45vw] sm:w-[25vw] md:w-[20vw] lg:w-[15vw] px-3 aspect-square group/item transition-all duration-500"
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-sm group-hover/item:shadow-xl group-hover/item:shadow-indigo-500/10 transition-all duration-500">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover/item:scale-110"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
