import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'sonner';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, qty = 1) => {
        const existingItem = get().items.find((item) => item.productId === product.productId);
        if (existingItem) {
          set((state) => ({
            items: state.items.map((item) =>
              item.productId === product.productId
                ? { ...item, quantity: item.quantity + qty }
                : item
            ),
          }));
          toast.success('Item quantity updated in cart');
        } else {
          set((state) => ({ items: [...state.items, { ...product, quantity: qty }] }));
          toast.success('Item added to cart');
        }
      },
      removeItem: (productId) => {
        set((state) => ({ items: state.items.filter((item) => item.productId !== productId) }));
        toast.error('Item removed from cart');
      },
      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return;
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

export default useCartStore;
