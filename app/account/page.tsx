'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Shield, Save, Edit3, ShieldCheck, MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { data: session, update, status } = useSession();
  const user = session?.user;
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'India',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/users/profile');
        if (res.ok) {
          const data = await res.json();
          setFormData({
            name: data.name || '',
            phone: data.phone || '',
            address: data.address || '',
            city: data.city || '',
            postalCode: data.postalCode || '',
            country: data.country || 'India',
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    } else if (status !== 'loading') {
      setInitialLoading(false);
    }
  }, [user, status]);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        await update({
          ...session,
          user: {
            ...session?.user,
            name: updatedUser.name,
          }
        });
        setIsEditing(false);
        toast.success('Profile updated!', {
          description: 'Your changes have been saved successfully.',
        });
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-50 dark:border-slate-800 pb-8">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            My Profile
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Manage your personal information and security</p>
        </div>
        <div className="flex items-center gap-3">
          {isEditing ? (
            <Button 
              onClick={handleSaveChanges}
              disabled={loading}
              className="rounded-xl px-5 py-2.5 bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 font-bold h-auto transition-all text-sm"
            >
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          ) : (
            <Button 
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="rounded-xl px-5 py-2.5 border-2 font-bold h-auto hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm"
            >
              <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-3xl">
        <div className="space-y-8">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-slate-900/50 p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <Input 
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="pl-12 sm:pl-14 py-6 sm:py-8 rounded-xl sm:rounded-2xl border-2 border-slate-100 dark:border-slate-800 focus:border-indigo-600 focus:ring-0 transition-all text-base sm:text-lg font-bold h-auto" 
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <div className="relative group opacity-60">
                <Mail className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input 
                  disabled
                  value={user.email || ''}
                  className="pl-12 sm:pl-14 py-6 sm:py-8 rounded-xl sm:rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-base sm:text-lg font-bold h-auto" 
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <Input 
                  disabled={!isEditing}
                  placeholder="+91 00000 00000"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="pl-12 sm:pl-14 py-6 sm:py-8 rounded-xl sm:rounded-2xl border-2 border-slate-100 dark:border-slate-800 focus:border-indigo-600 focus:ring-0 transition-all text-base sm:text-lg font-bold h-auto" 
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-3 pt-4 border-t dark:border-slate-800 mt-2">
              <div className="flex items-center space-x-2 text-slate-400 ml-1 mb-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-black uppercase tracking-widest">Shipping Address</span>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Input 
                    disabled={!isEditing}
                    placeholder="Street address, apartment, suite, etc."
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="py-6 sm:py-8 rounded-xl sm:rounded-2xl border-2 border-slate-100 dark:border-slate-800 focus:border-indigo-600 focus:ring-0 transition-all text-base sm:text-lg font-bold px-5 h-auto" 
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">City</label>
                    <Input 
                      disabled={!isEditing}
                      placeholder="e.g. Mumbai"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="py-6 sm:py-8 rounded-xl sm:rounded-2xl border-2 border-slate-100 dark:border-slate-800 focus:border-indigo-600 focus:ring-0 transition-all text-base sm:text-lg font-bold px-5 h-auto" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Pincode</label>
                    <Input 
                      disabled={!isEditing}
                      placeholder="400001"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                      className="py-6 sm:py-8 rounded-xl sm:rounded-2xl border-2 border-slate-100 dark:border-slate-800 focus:border-indigo-600 focus:ring-0 transition-all text-base sm:text-lg font-bold px-5 h-auto" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>

          <div className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-900/30 rounded-2xl sm:rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 flex items-start space-x-4">
            <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-500 mt-1 flex-shrink-0" />
            <p className="text-xs sm:text-sm text-slate-500 font-bold leading-relaxed">
              Your personal information and shipping addresses are stored securely in our encrypted database. This data is used to provide a faster checkout experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
