import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Globe, Check, X, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { z } from 'zod';
import { useAuthModalStore } from '@/store/authModalStore';
import { cn } from '@/lib/utils';

const AuthForm = () => {
  const [formType, setFormType] = useState('signin'); // signin, signup, forgot
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);
  const { closeModal } = useAuthModalStore();

  // Password strength calculation
  useEffect(() => {
    if (formType !== 'signup') return;
    let s = 0;
    if (password.length > 6) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    setStrength(s);
  }, [password, formType]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get('email') as string;
    const pwd = formData.get('password') as string;

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password: pwd,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Welcome back!', {
          description: 'You have signed in successfully.',
        });
        closeModal();
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const pwd = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    const schema = z.object({
      name: z.string().min(2, "Name must be at least 2 characters"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      confirmPassword: z.string().min(6),
    }).refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

    const validation = schema.safeParse({ name, email, password: pwd, confirmPassword });

    if (!validation.success) {
      validation.error.issues.forEach((err) => {
        toast.error(err.message);
      });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: pwd }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Account created!', {
          description: 'You can now sign in with your new account.',
        });
        setFormType('signin');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    closeModal();
    window.location.href = '/auth/forgot-password';
  };

  const strengthColor = strength === 0 ? 'bg-slate-200 dark:bg-slate-800' : 
                        strength === 1 ? 'bg-rose-500' : 
                        strength === 2 ? 'bg-amber-500' : 
                        strength === 3 ? 'bg-emerald-500' : 'bg-indigo-500';

  const renderForm = () => {
    switch (formType) {
      case 'signup':
        return (
          <form onSubmit={handleSignUp} className="space-y-5">
            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <Input name="name" type="text" placeholder="Full Name" required className="pl-12 py-6 rounded-2xl border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-600/20 transition-all" />
              </div>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <Input name="email" type="email" placeholder="Email address" required className="pl-12 py-6 rounded-2xl border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-600/20 transition-all" />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <Input 
                  name="password" 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Create Password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 py-6 rounded-2xl border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-600/20 transition-all" 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              <div className="px-1 space-y-2">
                <div className="flex gap-1 h-1.5">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={cn("flex-1 rounded-full transition-all duration-500", i <= strength ? strengthColor : "bg-slate-200 dark:bg-slate-800")} />
                  ))}
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Password Strength: <span className={cn(strength > 0 && "text-indigo-600")}>{strength === 0 ? 'Too weak' : strength === 1 ? 'Weak' : strength === 2 ? 'Medium' : strength === 3 ? 'Strong' : 'Very Strong'}</span>
                </p>
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <Input name="confirmPassword" type={showPassword ? 'text' : 'password'} placeholder="Confirm Password" required className="pl-12 py-6 rounded-2xl border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-600/20 transition-all" />
              </div>
            </div>

            <Button type="submit" className="w-full py-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98]" disabled={loading}>
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <span className="flex items-center">Create Account <ArrowRight className="ml-2 h-4 w-4" /></span>
              )}
            </Button>
            
            <p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <button type="button" onClick={() => setFormType('signin')} className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                Sign In
              </button>
            </p>
          </form>
        );
      case 'forgot':
        return (
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div className="text-center space-y-2 mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 mb-2">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Forgot Password?</h3>
              <p className="text-sm text-slate-500">No worries, we'll send you reset instructions.</p>
            </div>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <Input name="email" type="email" placeholder="Enter your email" required className="pl-12 py-6 rounded-2xl border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-600/20 transition-all" />
            </div>
            <Button type="submit" className="w-full py-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98]" disabled={loading}>
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                'Send Reset Link'
              )}
            </Button>
            <button type="button" onClick={() => setFormType('signin')} className="w-full text-center text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              Back to Sign In
            </button>
          </form>
        );
      default: // signin
        return (
          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <Input name="email" type="email" placeholder="Email address" required className="pl-12 py-6 rounded-2xl border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-600/20 transition-all" />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <Input name="password" type={showPassword ? 'text' : 'password'} placeholder="Password" required className="pl-12 py-6 rounded-2xl border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-600/20 transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center px-1">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5 rounded-md border-2 border-slate-200 dark:border-slate-800 group-hover:border-indigo-600 transition-all">
                  <input type="checkbox" className="peer absolute opacity-0 w-full h-full cursor-pointer" />
                  <Check className="h-3.5 w-3.5 text-indigo-600 scale-0 peer-checked:scale-100 transition-transform" />
                </div>
                <span className="text-sm font-medium text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">Remember me</span>
              </label>
              <button 
                type="button" 
                onClick={() => {
                  closeModal();
                  window.location.href = '/auth/forgot-password';
                }} 
                className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <Button type="submit" className="w-full py-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98]" disabled={loading}>
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <span className="flex items-center">Sign In <ArrowRight className="ml-2 h-4 w-4" /></span>
              )}
            </Button>
            
            <p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400">
              New to StationeryHub?{' '}
              <button type="button" onClick={() => setFormType('signup')} className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                Create account
              </button>
            </p>
          </form>
        );
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900/50 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl transition-colors duration-500">
      <div className="mb-10 space-y-2">
        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          {formType === 'signin' ? 'Welcome Back' : formType === 'signup' ? 'Get Started' : 'Reset Access'}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          {formType === 'signin' ? 'Sign in to continue your shopping journey.' : formType === 'signup' ? 'Create an account to unlock exclusive benefits.' : 'Enter your email to recover your account.'}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={formType}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {renderForm()}
        </motion.div>
      </AnimatePresence>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-100 dark:border-slate-800" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest text-slate-400">
          <span className="bg-white dark:bg-slate-900 px-4">Secure Social Access</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Button 
          variant="outline" 
          className="rounded-2xl py-6 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold transition-all active:scale-[0.98]" 
          onClick={() => signIn('google')}
        >
          <Globe className="mr-2 h-5 w-5 text-rose-500" /> Google
        </Button>
      </div>
      
      <p className="mt-8 text-center text-[11px] text-slate-400 leading-relaxed">
        By continuing, you agree to StationeryHub's <a href="/privacy-policy" className="underline hover:text-indigo-600">Terms of Service</a> and <a href="/privacy-policy" className="underline hover:text-indigo-600">Privacy Policy</a>.
      </p>
    </div>
  );
};

export default AuthForm;
