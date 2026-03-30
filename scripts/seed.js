const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load models manually since we're running as a script
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String, required: true }],
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [],
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const products = [
  {
    name: 'Premium Fountain Pen',
    description: 'Handcrafted elegant fountain pen with a gold-plated nib for a superior writing experience.',
    price: 49.99,
    images: ['https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=800&h=800&auto=format&fit=crop'],
    category: 'Pens',
    stock: 25,
    rating: 4.8,
    numReviews: 45,
    isFeatured: true,
  },
  {
    name: 'Leather Bound Journal',
    description: 'Premium quality leather bound journal with 200 pages of thick, ink-proof paper.',
    price: 34.50,
    images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&h=800&auto=format&fit=crop'],
    category: 'Notebooks',
    stock: 40,
    rating: 4.9,
    numReviews: 62,
    isFeatured: true,
  },
  {
    name: 'Professional Watercolor Set',
    description: 'Professional grade watercolor set with 48 vibrant pigments and high-quality brushes.',
    price: 59.99,
    images: ['https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&h=800&auto=format&fit=crop'],
    category: 'Art Supplies',
    stock: 15,
    rating: 4.7,
    numReviews: 28,
    isFeatured: true,
  },
  {
    name: 'Bamboo Desk Organizer',
    description: 'Eco-friendly sustainable bamboo desk organizer for a minimalist and efficient workspace.',
    price: 29.00,
    images: ['https://images.unsplash.com/photo-1591129841117-3adfd313e34f?q=80&w=800&h=800&auto=format&fit=crop'],
    category: 'Office Items',
    stock: 50,
    rating: 4.5,
    numReviews: 19,
    isFeatured: false,
  },
  {
    name: 'Mechanical Pencil Set',
    description: 'Precision mechanical pencil set with leads and erasers, ideal for technical drawing.',
    price: 19.99,
    images: ['https://images.unsplash.com/photo-1511556840683-d859ec7fe73d?q=80&w=800&h=800&auto=format&fit=crop'],
    category: 'Pens',
    stock: 100,
    rating: 4.6,
    numReviews: 34,
    isFeatured: false,
  },
  {
    name: 'Bullet Journal Kit',
    description: 'All-in-one bullet journal kit including dot grid notebook, stencils, and fine-liners.',
    price: 39.99,
    images: ['https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=800&h=800&auto=format&fit=crop'],
    category: 'Notebooks',
    stock: 30,
    rating: 4.8,
    numReviews: 51,
    isFeatured: true,
  },
];

async function seed() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://dk4850551_db_user:dinesh123@ecommerce01.fu44mje.mongodb.net/ecommerce01?appName=ecommerce01';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create Admin User
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin User',
      email: 'admin@stationeryhub.com',
      password: hashedPassword,
      role: 'admin',
    });
    console.log('Admin user created');

    // Create Dummy Products
    await Product.insertMany(products);
    console.log('Dummy products seeded');

    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
