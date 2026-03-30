'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, MoreVertical, Shield, User, Trash2, Mail, Calendar, ShieldCheck, UserX, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users?search=${searchQuery}`);
      const data = await res.json();
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchQuery]);

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const res = await fetch(`/api/users/${userToDelete}`, { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        toast.success('User deleted successfully');
        // Update local state immediately
        setUsers(prev => prev.filter((u: any) => u._id !== userToDelete));
        fetchUsers();
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user');
    } finally {
      setUserToDelete(null);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-4xl font-black tracking-tight">User Directory</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Manage your store's community</p>
        </div>
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <Input 
              placeholder="Search by name or email..." 
              className="pl-12 py-7 rounded-2xl border-2 focus-visible:ring-indigo-600 transition-all font-bold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="rounded-2xl px-6 py-6 font-black border-2">
            Export Users
          </Button>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [...Array(6)].map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-[2.5rem]" />)
        ) : users.length > 0 ? (
          users.map((user: any) => (
            <motion.div
              key={user._id}
              whileHover={{ y: -8 }}
              className="premium-card p-10 flex flex-col items-center text-center space-y-6 relative group"
            >
              <div className="absolute top-6 right-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl z-[60]">
                    <DropdownMenuItem className="font-bold py-3 rounded-xl cursor-pointer transition-colors focus:bg-indigo-50 dark:focus:bg-indigo-950/30 group">
                      <UserCheck className="mr-3 h-4 w-4 text-indigo-600" /> View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="font-bold py-3 rounded-xl cursor-pointer transition-colors focus:bg-indigo-50 dark:focus:bg-indigo-950/30 group">
                      <Shield className="mr-3 h-4 w-4 text-purple-600" /> Change Role
                    </DropdownMenuItem>
                    <DropdownMenuItem className="font-bold py-3 rounded-xl cursor-pointer text-amber-500 focus:text-amber-500 transition-colors focus:bg-amber-50 dark:focus:bg-amber-950/30 group">
                      <UserX className="mr-3 h-4 w-4" /> Block User
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="font-bold py-3 rounded-xl cursor-pointer text-rose-500 focus:text-rose-500 transition-colors focus:bg-rose-50 dark:focus:bg-rose-950/30 group"
                      onClick={() => setUserToDelete(user._id)}
                    >
                      <Trash2 className="mr-3 h-4 w-4" /> Delete User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="relative">
                <div className="w-24 h-24 rounded-[2rem] bg-indigo-100 dark:bg-indigo-950/30 flex items-center justify-center font-black text-4xl text-indigo-600 shadow-xl shadow-indigo-500/10 border-4 border-white dark:border-slate-800 group-hover:scale-110 transition-transform duration-500">
                  {user.name.charAt(0)}
                </div>
                {user.role === 'admin' && (
                  <div className="absolute -bottom-2 -right-2 bg-indigo-600 p-2 rounded-xl shadow-lg border-2 border-white dark:border-slate-800">
                    <ShieldCheck className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black">{user.name}</h3>
                <div className="flex flex-col items-center space-y-2">
                  <Badge className={`border-none px-4 py-1 font-black uppercase tracking-widest text-[10px] rounded-full ${
                    user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {user.role}
                  </Badge>
                  <div className="flex items-center text-slate-500 font-bold text-sm">
                    <Mail className="h-4 w-4 mr-2 text-indigo-600" /> {user.email}
                  </div>
                </div>
              </div>

              <div className="w-full pt-6 border-t dark:border-slate-800 flex justify-between items-center px-4">
                <div className="text-left">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Joined On</p>
                  <div className="flex items-center text-xs font-bold">
                    <Calendar className="h-3 w-3 mr-1 text-indigo-600" />
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Status</p>
                  <span className="flex items-center text-xs font-black text-emerald-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                    Active
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-32 text-center space-y-6 bg-white dark:bg-slate-900 rounded-[3rem]">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-950 rounded-full flex items-center justify-center">
              <Users className="h-10 w-10 text-slate-400" />
            </div>
            <div>
              <h3 className="text-2xl font-black mb-2">No users found</h3>
              <p className="text-slate-500 max-w-xs mx-auto">Users will appear here as they register on your platform.</p>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent className="rounded-[2.5rem] p-10 border-none shadow-2xl">
          <AlertDialogHeader>
            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/30 rounded-2xl flex items-center justify-center mb-6">
              <AlertCircle className="h-8 w-8 text-rose-600" />
            </div>
            <AlertDialogTitle className="text-3xl font-black">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-lg font-medium text-slate-500">
              This action cannot be undone. This will permanently delete the user from your database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 space-x-4">
            <AlertDialogCancel className="rounded-2xl py-7 font-black flex-1 border-2">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser}
              className="rounded-2xl py-7 font-black flex-1 bg-rose-600 hover:bg-rose-700 text-white shadow-xl shadow-rose-600/20"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
