'use client';

import { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ShieldCheck, Lock, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type Step = 'EMAIL' | 'OTP' | 'PASSWORD' | 'SUCCESS';

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get('role') === 'admin';
  const loginUrl = isAdmin ? '/admin/login' : '/';
  
  const [step, setStep] = useState<Step>('EMAIL');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setStep('OTP');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setStep('PASSWORD');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setStep('SUCCESS');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-2xl shadow-indigo-500/10 border dark:border-slate-800"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-6">
            <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              StationeryHub
            </span>
          </Link>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
            {step === 'EMAIL' && 'Forgot Password?'}
            {step === 'OTP' && 'Verify OTP'}
            {step === 'PASSWORD' && 'Set New Password'}
            {step === 'SUCCESS' && 'Password Reset!'}
          </h1>
          <p className="text-slate-500 font-medium">
            {step === 'EMAIL' && "No worries, we'll send you a reset OTP."}
            {step === 'OTP' && `Enter the 6-digit code sent to ${email}`}
            {step === 'PASSWORD' && 'Create a strong password for your account.'}
            {step === 'SUCCESS' && 'Your password has been updated successfully.'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'EMAIL' && (
            <motion.form 
              key="email"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSendOtp} 
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                <div className="relative group">
                  <Input 
                    type="email"
                    required
                    placeholder="hello@stationeryhub.com"
                    className="rounded-2xl border-2 py-7 focus-visible:ring-indigo-600 font-medium pl-12"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                </div>
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl py-7 font-black text-lg shadow-xl shadow-indigo-500/20 group"
              >
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                  <>Send OTP <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></>
                )}
              </Button>
            </motion.form>
          )}

          {step === 'OTP' && (
            <motion.form 
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleVerifyOtp} 
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">6-Digit Code</label>
                <div className="relative group">
                  <Input 
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Enter OTP"
                    className="rounded-2xl border-2 py-7 focus-visible:ring-indigo-600 font-black text-center text-2xl tracking-[1em] pl-8"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  />
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                </div>
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl py-7 font-black text-lg shadow-xl shadow-indigo-500/20 group"
              >
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                  <>Verify Code <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></>
                )}
              </Button>
              <button 
                type="button"
                onClick={() => setStep('EMAIL')}
                className="w-full text-slate-500 font-bold hover:text-indigo-600 transition-colors text-sm"
              >
                Change Email Address
              </button>
            </motion.form>
          )}

          {step === 'PASSWORD' && (
            <motion.form 
              key="password"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleResetPassword} 
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">New Password</label>
                  <div className="relative group">
                    <Input 
                      type="password"
                      required
                      placeholder="••••••••"
                      className="rounded-2xl border-2 py-7 focus-visible:ring-indigo-600 font-medium pl-12"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">Confirm New Password</label>
                  <div className="relative group">
                    <Input 
                      type="password"
                      required
                      placeholder="••••••••"
                      className="rounded-2xl border-2 py-7 focus-visible:ring-indigo-600 font-medium pl-12"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  </div>
                </div>
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl py-7 font-black text-lg shadow-xl shadow-indigo-500/20 group"
              >
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                  <>Update Password <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></>
                )}
              </Button>
            </motion.form>
          )}

          {step === 'SUCCESS' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8"
            >
              <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/30 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              </div>
              <Button 
                asChild
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl py-7 font-black text-lg shadow-xl shadow-indigo-500/20"
              >
                <Link href={loginUrl}>Back to Login</Link>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-10 pt-10 border-t dark:border-slate-800 text-center">
          <Link href={loginUrl} className="text-slate-500 font-bold hover:text-indigo-600 transition-colors text-sm">
            ← Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    }>
      <ForgotPasswordContent />
    </Suspense>
  );
}
