import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = body;

    if (!orderItems || orderItems.length === 0) {
      return NextResponse.json({ message: 'No order items' }, { status: 400 });
    }

    await connectDB();

    // Update user's shipping info if it's missing or they changed it
    await User.findByIdAndUpdate(session.user.id, {
      address: shippingAddress.address,
      city: shippingAddress.city,
      postalCode: shippingAddress.postalCode,
      country: shippingAddress.country || 'India',
    });

    const order = await Order.create({
      userId: session.user.id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      isPaid: true, // Mock payment as paid for now
      paidAt: new Date(),
    });

    // Update stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '0');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    await connectDB();

    const query: any = {};
    if (session.user.role !== 'admin') {
      query.userId = session.user.id;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      // Search by order ID or user name/email (if admin)
      const searchRegex = { $regex: search, $options: 'i' };
      if (session.user.role === 'admin') {
        // This is a bit complex with populate, but we can search by ID directly
        query.$or = [
          { _id: search.length === 24 ? search : undefined },
          { 'shippingAddress.city': searchRegex },
          { 'shippingAddress.address': searchRegex },
        ].filter(Boolean);
      } else {
        query.$or = [
          { 'shippingAddress.city': searchRegex },
          { 'shippingAddress.address': searchRegex },
        ];
      }
    }

    let ordersQuery = Order.find(query).sort({ createdAt: -1 });
    
    if (session.user.role === 'admin') {
      ordersQuery = ordersQuery.populate('userId', 'name email');
    }

    if (limit > 0) {
      ordersQuery = ordersQuery.limit(limit);
    }

    const orders = await ordersQuery;

    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
