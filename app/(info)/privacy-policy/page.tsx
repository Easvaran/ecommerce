
'use client';

import { ShieldCheck, Eye, Lock, Globe } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-16">
      <div className="space-y-6">
        <h1 className="text-5xl font-black tracking-tight leading-tight">Privacy Policy</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl font-medium">
          Your privacy is important to us. This policy explains how we collect, use, 
          and protect your personal information when you use our website.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Eye, title: 'Transparency', desc: 'We are clear about what data we collect and why.' },
          { icon: Lock, title: 'Security', desc: 'Your data is protected with industry-standard encryption.' },
          { icon: Globe, title: 'Control', desc: 'You have full control over your personal information.' },
        ].map((item, i) => (
          <div key={i} className="p-8 rounded-[2rem] bg-indigo-50 dark:bg-indigo-950/20 border-2 border-indigo-100 dark:border-indigo-900 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20">
              <item.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-black mb-2">{item.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="prose dark:prose-invert max-w-none space-y-10 text-slate-600 dark:text-slate-400 font-medium">
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 underline decoration-indigo-500 decoration-4 underline-offset-8">Information We Collect</h2>
          <p>We collect information you provide directly to us when you create an account, place an order, or contact us. This may include your name, email address, shipping address, and payment information.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 underline decoration-indigo-500 decoration-4 underline-offset-8">How We Use Your Information</h2>
          <p>We use your information to process your orders, communicate with you about your account and purchases, and provide you with updates and offers related to our products. We do not sell your personal information to third parties.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 underline decoration-indigo-500 decoration-4 underline-offset-8">Cookies and Tracking</h2>
          <p>We use cookies to improve your experience on our website, analyze our traffic, and understand where our visitors are coming from. You can manage your cookie preferences through your browser settings.</p>
        </section>

        <section className="space-y-4 text-sm pt-10 border-t dark:border-slate-800">
          <p>Last Updated: March 26, 2026</p>
          <p>If you have any questions about our privacy practices, please contact us at privacy@stationeryhub.com.</p>
        </section>
      </div>
    </div>
  );
}
