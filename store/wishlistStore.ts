import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  rating: number;
  numReviews: number;
}

interface WishlistState {
  items: Product[];
  setItems: (items: Product[]) => void;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      setItems: (items) => set({ items }),
      addItem: (product) => {
        const currentItems = get().items || [];
        if (!currentItems.find((item) => item._id === product._id)) {
          set({ items: [...currentItems, product] });
        }
      },
      removeItem: (productId) => {
        const currentItems = get().items || [];
        set({ items: currentItems.filter((item) => item._id !== productId) });
      },
      isInWishlist: (productId) => {
        const currentItems = get().items || [];
        return currentItems.some((item) => item._id === productId);
      },
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'wishlist-storage',
    }
  )
);

export default useWishlistStore;
