import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Content from '@/models/Content';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page');

    if (!page) {
      return NextResponse.json({ message: 'Page name is required' }, { status: 400 });
    }

    await connectDB();
    const content = await Content.findOne({ page });

    return NextResponse.json(content || { page, sections: {} });
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

    const { page, sections } = await req.json();

    if (!page || !sections) {
      return NextResponse.json({ message: 'Page and sections are required' }, { status: 400 });
    }

    await connectDB();
    const content = await Content.findOneAndUpdate(
      { page },
      { sections },
      { upsert: true, new: true }
    );

    return NextResponse.json(content);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
