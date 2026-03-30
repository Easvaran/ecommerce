import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '@/models/Category';

// Load env vars
dotenv.config({ path: './.env.local' });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {
    });
    console.log('MongoDB Connected...');
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
};

const categories = [
  {
    name: 'Pens & Writing',
    slug: 'pens-writing',
    description: 'Elegant fountain pens, smooth ballpoints, and professional mechanical pencils.',
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=800&h=800&auto=format&fit=crop',
    isFeatured: true,
  },
  {
    name: 'Notebooks',
    slug: 'notebooks',
    description: 'Premium leather-bound journals, dotted grids, and minimalist planners.',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&h=800&auto=format&fit=crop',
    isFeatured: true,
  },
  {
    name: 'Art Supplies',
    slug: 'art-supplies',
    description: 'Professional grade watercolors, acrylics, and handcrafted brushes.',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&h=800&auto=format&fit=crop',
    isFeatured: true,
  },
  {
    name: 'Office Essentials',
    slug: 'office-essentials',
    description: 'Ergonomic desk organizers, sleek staplers, and high-quality paper.',
    image: 'https://images.unsplash.com/photo-1591129841117-3adfd313e34f?q=80&w=800&h=800&auto=format&fit=crop',
    isFeatured: true,
  },
  {
    name: 'School Supplies',
    slug: 'school-supplies',
    description: 'Durable backpacks, colorful geometry sets, and essential student kits.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&h=800&auto=format&fit=crop',
    isFeatured: false,
  },
  {
    name: 'Markers & Highlighters',
    slug: 'markers-highlighters',
    description: 'Vibrant dual-tip markers and neon highlighters for precise detailing.',
    image: 'https://images.unsplash.com/photo-1511108690759-009324a90311?q=80&w=800&h=800&auto=format&fit=crop',
    isFeatured: false,
  },
  {
    name: 'Files & Folders',
    slug: 'files-folders',
    description: 'Expandable organizers and archival-quality storage solutions.',
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=800&h=800&auto=format&fit=crop',
    isFeatured: false,
  },
];

const seedCategories = async () => {
  await connectDB();
  try {
    await Category.deleteMany();
    await Category.insertMany(categories);
    console.log('Categories seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
};

seedCategories();
