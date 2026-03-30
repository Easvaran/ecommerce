
'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! We will get back to you shortly.');
  };

  return (
    <div className="space-y-16">
      <div className="space-y-6">
        <h1 className="text-5xl font-black tracking-tight leading-tight">Contact Us</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl font-medium">
          Have a question about our products or an existing order? We're here to help. 
          Send us a message and our team will get back to you within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border dark:border-slate-800 shadow-xl shadow-indigo-500/5">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</Label>
                <Input placeholder="John Doe" className="rounded-2xl border-2 py-6 focus-visible:ring-indigo-600" required />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</Label>
                <Input type="email" placeholder="john@example.com" className="rounded-2xl border-2 py-6 focus-visible:ring-indigo-600" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Subject</Label>
              <Input placeholder="How can we help?" className="rounded-2xl border-2 py-6 focus-visible:ring-indigo-600" required />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Message</Label>
              <Textarea placeholder="Tell us more about your inquiry..." className="rounded-2xl border-2 min-h-[150px] focus-visible:ring-indigo-600 resize-none" required />
            </div>
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl py-8 text-lg font-black shadow-xl shadow-indigo-500/20 group">
              Send Message
              <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          </form>
        </div>

        {/* Contact Info Details */}
        <div className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-2xl font-black tracking-tight">Direct Contact</h3>
            <div className="grid grid-cols-1 gap-4">
              {[
                { icon: Mail, label: 'Email Us', value: 'hello@stationeryhub.com', color: 'bg-blue-50 text-blue-600' },
                { icon: Phone, label: 'Call Us', value: '+1 (234) 567-890', color: 'bg-green-50 text-green-600' },
                { icon: MapPin, label: 'Visit Us', value: '123 Creative Avenue, NY 10001', color: 'bg-rose-50 text-rose-600' },
                { icon: MessageSquare, label: 'Live Chat', value: 'Available Mon-Fri, 9am-6pm', color: 'bg-purple-50 text-purple-600' },
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-6 p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 group transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg hover:shadow-indigo-500/5">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", item.color)}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{item.label}</p>
                    <p className="font-bold text-slate-900 dark:text-slate-100">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <h4 className="text-xl font-black">Wholesale Inquiries</h4>
              <p className="text-slate-400 font-medium">Interested in stocking our products? We offer competitive wholesale pricing for retailers.</p>
              <Button variant="outline" className="rounded-full border-slate-700 hover:bg-slate-800 text-white font-bold">
                Learn More
              </Button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl -mr-16 -mt-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
