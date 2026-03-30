import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Offer from '@/models/Offer';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET the current offer
export async function GET() {
  try {
    await connectDB();
    const offer = await Offer.findOne();
    if (!offer) {
      // Create a default offer if none exists
      const defaultOffer = await Offer.create({
        title: 'Get 20% Off Your First Premium Order',
        subtitle: 'Join our creative community and start your journey with our premium stationery collection. Use code WELCOME20 at checkout.',
        code: 'WELCOME20',
        brandName: 'StationeryHub',
      });
      return NextResponse.json(defaultOffer);
    }
    return NextResponse.json(offer);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// UPDATE the offer
export async function PUT(req: Request) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, subtitle, code, brandName } = body;

    await connectDB();
    const offer = await Offer.findOneAndUpdate(
      {},
      { title, subtitle, code, brandName },
      { new: true, upsert: true } // upsert: true creates the document if it doesn't exist
    );

    return NextResponse.json(offer);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
