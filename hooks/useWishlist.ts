'use client';

import { useEffect, useState, useTransition } from 'react';
import { useSession } from 'next-auth/react';
import useWishlistStore from '@/store/wishlistStore';
import { toast } from 'sonner';
import { getWishlist, addToWishlist, removeFromWishlist } from '@/app/actions/wishlistActions';

export function useWishlist() {
  const { data: session, status } = useSession();
  const { items, setItems, addItem, removeItem, isInWishlist, clearWishlist } = useWishlistStore();
  const [isPending, startTransition] = useTransition();

  // Sync wishlist from backend when user logs in
  useEffect(() => {
    const fetchWishlist = async () => {
      if (status === 'authenticated') {
        startTransition(async () => {
          try {
            const wishlist = await getWishlist();
            setItems(wishlist);
          } catch (error) {
            console.error('Failed to fetch wishlist:', error);
          }
        });
      } else if (status === 'unauthenticated') {
        clearWishlist();
      }
    };

    fetchWishlist();
  }, [status, setItems, clearWishlist]);

  const toggleWishlist = async (product: any) => {
    if (status !== 'authenticated') {
      toast.error('Please login to add items to your wishlist');
      return;
    }

    const isCurrentlyInWishlist = isInWishlist(product._id);

    startTransition(async () => {
      try {
        if (isCurrentlyInWishlist) {
          // Optimistic update
          removeItem(product._id);
          await removeFromWishlist(product._id);
          toast.success('Removed from wishlist');
        } else {
          // Optimistic update
          addItem(product);
          await addToWishlist(product._id);
          toast.success('Added to wishlist');
        }
      } catch (error) {
        // Revert on error
        if (isCurrentlyInWishlist) {
          addItem(product);
        } else {
          removeItem(product._id);
        }
        toast.error('Something went wrong');
      }
    });
  };

  return {
    items: items || [],
    isInWishlist,
    toggleWishlist,
    isLoading: isPending,
  };
}
