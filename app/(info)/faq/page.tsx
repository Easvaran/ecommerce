
'use client';

import { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const faqs = [
  {
    question: "Do you offer international shipping?",
    answer: "Yes, we ship to over 50 countries worldwide. International shipping rates and delivery times vary by location and are calculated at checkout."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order ships, you'll receive a confirmation email with a tracking number and a link to the carrier's website where you can follow your package's journey."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for unused items in their original packaging. Please visit our Return & Refund page for detailed instructions."
  },
  {
    question: "Are your products eco-friendly?",
    answer: "Sustainability is one of our core values. We prioritize products made from recycled materials and work with manufacturers who follow ethical and eco-friendly practices."
  },
  {
    question: "Do you offer wholesale or bulk discounts?",
    answer: "Yes! We offer competitive pricing for bulk orders and retail partnerships. Please contact us through our wholesale inquiry form on the Contact page."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-16">
      <div className="space-y-6">
        <h1 className="text-5xl font-black tracking-tight leading-tight">Frequently Asked Questions</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl font-medium">
          Find quick answers to common questions about our products, shipping, and more.
        </p>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input 
          placeholder="Search for answers..." 
          className="pl-12 py-7 rounded-2xl border-2 focus-visible:ring-indigo-600 font-bold"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, i) => (
            <div 
              key={i} 
              className={cn(
                "border-2 rounded-[2rem] transition-all overflow-hidden",
                openIndex === i ? "border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/10" : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900"
              )}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-8 text-left"
              >
                <span className="text-xl font-black pr-8">{faq.question}</span>
                <ChevronDown className={cn("h-6 w-6 text-indigo-600 transition-transform duration-300", openIndex === i ? "rotate-180" : "")} />
              </button>
              <div className={cn(
                "px-8 pb-8 transition-all duration-300",
                openIndex === i ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
              )}>
                <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed">
            <p className="text-xl font-black text-slate-400">No results found for your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
