import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');

    await connectDB();

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const categories = await Category.find(query).sort({ createdAt: -1 }).lean();

    const placeholderImages: { [key: string]: string } = {
      'Pens & Writing': 'https://images.unsplash.com/photo-1516975068846-7237f3b873ee?q=80&w=1887&auto=format&fit=crop',
      'Notebooks': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=1772&auto=format&fit=crop',
      'Art Supplies': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1771&auto=format&fit=crop',
      'Office Essentials': 'https://images.unsplash.com/photo-1497032628192-86f99d76b33e?q=80&w=1770&auto=format&fit=crop',
      'School Supplies': 'https://images.unsplash.com/photo-1566381414470-07a535443935?q=80&w=1887&auto=format&fit=crop',
      'Markers & Highlighters': 'https://images.unsplash.com/photo-1629822434992-851323153987?q=80&w=1770&auto=format&fit=crop',
      'Files & Folders': 'https://images.unsplash.com/photo-1599249013849-9e41a74a9a7b?q=80&w=1887&auto=format&fit=crop',
    };

    const categoriesWithImages = categories.map((cat: any) => ({
      ...cat,
      imageUrl: cat.image || placeholderImages[cat.name] || 'https://via.placeholder.com/400x500',
    }));

    return NextResponse.json(categoriesWithImages);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    const body = await req.json();
    await connectDB();
    const category = await Category.create(body);
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
