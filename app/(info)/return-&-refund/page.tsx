
'use client';

import { RotateCcw, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

export default function ReturnRefundPage() {
  return (
    <div className="space-y-16">
      <div className="space-y-6">
        <h1 className="text-5xl font-black tracking-tight leading-tight">Return & Refund</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl font-medium">
          We want you to be completely satisfied with your purchase. If you're not happy with your tools, 
          we're here to help you with a return or exchange.
        </p>
      </div>

      <div className="bg-indigo-50 dark:bg-indigo-950/20 border-2 border-indigo-100 dark:border-indigo-900 rounded-[2.5rem] p-10 md:p-12">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="w-20 h-20 rounded-3xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30">
            <RotateCcw className="h-10 w-10 text-white" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tight">30-Day Return Window</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Items must be returned in their original condition, unused, and in the original packaging within 30 days of delivery.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            Eligible for Return
          </h3>
          <ul className="space-y-4">
            {[
              'Unopened pens and art supplies',
              'Notebooks with no writing or marks',
              'Damaged or defective items upon arrival',
              'Incorrect items sent in your order'
            ].map((item, i) => (
              <li key={i} className="flex items-center space-x-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300">
                <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-8">
          <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-rose-500" />
            Non-Returnable Items
          </h3>
          <ul className="space-y-4">
            {[
              'Used or partially used ink/paint',
              'Customized or personalized products',
              'Final sale or clearance items',
              'Gift cards'
            ].map((item, i) => (
              <li key={i} className="flex items-center space-x-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300">
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="prose dark:prose-invert max-w-none space-y-8 text-slate-600 dark:text-slate-400 font-medium">
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">The Refund Process</h2>
          <p>Once we receive and inspect your return, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund. If approved, your refund will be processed and a credit will automatically be applied to your original method of payment within 5-10 business days.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">Exchanges</h2>
          <p>We only replace items if they are defective or damaged. If you need to exchange it for the same item, send us an email at hello@stationeryhub.com.</p>
        </section>
      </div>
    </div>
  );
}
