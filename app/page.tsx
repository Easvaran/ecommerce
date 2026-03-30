import { ArrowRight, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/ProductCard';
import FeaturedProductsCarousel from '@/components/FeaturedProductsCarousel';
import OfferBanner from '@/components/OfferBanner';
import HeroAnimation from '@/components/HeroAnimation';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Offer from '@/models/Offer';
import Content from '@/models/Content';

async function getFeaturedProducts() {
  await connectDB();
  const products = await Product.find({ isFeatured: true }).limit(10).lean();
  return products;
}

async function getOffer() {
  await connectDB();
  const offer = await Offer.findOne().lean();
  if (!offer) {
    return {
      title: 'Get 20% Off Your First Premium Order',
      subtitle: 'Join our creative community and start your journey with our premium stationery collection. Use code WELCOME20 at checkout.',
      code: 'WELCOME20',
      brandName: 'StationeryHub',
    };
  }
  return offer;
}

async function getHomePageContent() {
  await connectDB();
  const content = await Content.findOne({ page: 'home' }).lean();
  return content?.sections || {};
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
  const offer = await getOffer();
  const content: any = await getHomePageContent();

  return (
    <div className="space-y-20 md:space-y-32">
      <section className="relative bg-white dark:bg-black pt-12 md:pt-24">
        <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="relative z-10 text-center md:text-left">
            <Badge variant="outline" className="mb-4 border-2 px-4 py-1.5 rounded-full font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800">
              <Star className="h-4 w-4 mr-2 text-indigo-400" />
              Premium Collection
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight mb-4 md:mb-6 leading-tight">
              {content.hero_title || 'Write Your Own Story with Style'}
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-lg mx-auto md:mx-0">
              {content.hero_subtitle || 'Discover our curated collection of premium stationery designed to inspire your creativity and elevate your workspace.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 py-7 text-lg group shadow-lg shadow-indigo-500/20">
                <Link href="/products">
                  Shop Collection
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-8 py-7 text-lg border-2">
                <Link href="/categories">
                  View Categories
                </Link>
              </Button>
            </div>
          </div>
          {content.hero_banner ? (
            <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
              <Image 
                src={content.hero_banner} 
                alt="Hero Banner" 
                fill 
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <HeroAnimation />
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="w-full">
        <div className="container mx-auto px-4 md:px-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-black mb-2 md:mb-4">
                {content.featured_title || 'Featured Products'}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-md text-base md:text-lg leading-relaxed mx-auto md:mx-0">
                {content.featured_subtitle || 'Our most popular and highly-rated items that customers love.'}
              </p>
            </div>
            <Link href="/products" className="mx-auto md:mx-0">
              <Button variant="outline" className="rounded-full px-6 border-2 font-bold">
                Explore Store
              </Button>
            </Link>
          </div>
        </div>

        <FeaturedProductsCarousel products={JSON.parse(JSON.stringify(featuredProducts))} />
      </section>

      {/* Shop by Category */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-black mb-2 md:mb-4">Shop by Category</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md text-base md:text-lg leading-relaxed mx-auto md:mx-0">
              Explore our wide range of stationery items tailored for every creative need.
            </p>
          </div>
          <Link href="/categories" className="mx-auto md:mx-0">
            <Button variant="link" className="text-indigo-600 font-bold p-0 text-lg group">
              View All Categories <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
        {/* Category Cards Here */}
      </section>

      {/* Offer Banner */}
      <section className="container mx-auto px-4 md:px-6">
        <OfferBanner 
          offer={{
            title: offer?.title || 'Get 20% Off Your First Premium Order',
            subtitle: offer?.subtitle || 'Join our creative community and start your journey with our premium stationery collection. Use code WELCOME20 at checkout.',
          }} 
        />
      </section>
    </div>
  );
}
