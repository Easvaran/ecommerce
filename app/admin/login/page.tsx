
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        toast.error('Authentication Failed', {
          description: result.error || 'Invalid admin credentials',
        });
      } else {
        toast.success('Admin Authenticated', {
          description: 'Welcome back to the dashboard!',
        });
        router.push('/admin');
        router.refresh();
      }
    } catch (error) {
      toast.error('Error', {
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-slate-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-slate-900 p-10 md:p-12 rounded-[2.5rem] shadow-2xl shadow-indigo-500/10 border border-slate-800 space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-600/10 border-2 border-indigo-600/20 mb-2">
              <ShieldCheck className="h-10 w-10 text-indigo-500" />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white">Admin Access</h1>
            <p className="text-slate-400 font-medium">Enter your credentials to manage StationeryHub</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                <Input
                  type="email"
                  placeholder="Admin Email"
                  required
                  className="pl-12 py-7 rounded-2xl border-2 border-slate-800 bg-slate-950 text-white focus-visible:ring-indigo-600 transition-all font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                <Input
                  type="password"
                  placeholder="Password"
                  required
                  className="pl-12 py-7 rounded-2xl border-2 border-slate-800 bg-slate-950 text-white focus-visible:ring-indigo-600 transition-all font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex justify-end px-2">
                <button
                  type="button"
                  onClick={() => router.push('/auth/forgot-password?role=admin')}
                  className="text-xs font-bold text-slate-500 hover:text-indigo-400 transition-colors uppercase tracking-widest"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl py-8 text-lg font-black shadow-xl shadow-indigo-500/20 group"
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  Authenticate
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="pt-6 text-center">
            <button 
              onClick={() => router.push('/')}
              className="text-slate-500 hover:text-white text-sm font-bold transition-colors"
            >
              ← Back to main site
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
