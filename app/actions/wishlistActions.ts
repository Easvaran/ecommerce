'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function getWishlist() {
  const session: any = await getServerSession(authOptions);
  if (!session) {
    throw new Error('Not authenticated');
  }

  await connectDB();
  const user = await User.findById(session.user.id).populate('wishlist').lean();
  if (!user) {
    throw new Error('User not found');
  }

  return user.wishlist;
}

export async function addToWishlist(productId: string) {
  const session: any = await getServerSession(authOptions);
  if (!session) {
    throw new Error('Not authenticated');
  }

  await connectDB();
  const user = await User.findByIdAndUpdate(
    session.user.id,
    { $addToSet: { wishlist: productId } },
    { new: true }
  ).lean();

  if (!user) {
    throw new Error('User not found');
  }

  revalidatePath('/wishlist');
  return user.wishlist;
}

export async function removeFromWishlist(productId: string) {
  const session: any = await getServerSession(authOptions);
  if (!session) {
    throw new Error('Not authenticated');
  }

  await connectDB();
  const user = await User.findByIdAndUpdate(
    session.user.id,
    { $pull: { wishlist: productId } },
    { new: true }
  ).lean();

  if (!user) {
    throw new Error('User not found');
  }

  revalidatePath('/wishlist');
  return user.wishlist;
}
