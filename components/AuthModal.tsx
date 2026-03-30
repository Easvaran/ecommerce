'use client';

import { useAuthModalStore } from '@/store/authModalStore';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import AuthLayout from './AuthLayout';
import AuthForm from './AuthForm';
import { X } from 'lucide-react';

export default function AuthModal() {
  const { isOpen, closeModal } = useAuthModalStore();

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent 
        className="max-w-none w-screen h-screen p-0 border-none bg-transparent overflow-hidden sm:max-w-none rounded-none ring-0 shadow-none"
        showCloseButton={false}
      >
        <AuthLayout>
          <div className="relative">
            <button 
              onClick={closeModal}
              className="absolute -top-16 right-0 lg:-top-20 lg:-right-20 p-3 rounded-full bg-white/10 hover:bg-white/20 dark:bg-slate-900/50 dark:hover:bg-slate-800 backdrop-blur-xl border border-white/20 dark:border-slate-800 text-slate-900 dark:text-white transition-all active:scale-90 z-50 group"
            >
              <X className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
            </button>
            <AuthForm />
          </div>
        </AuthLayout>
      </DialogContent>
    </Dialog>
  );
}