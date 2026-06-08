'use client';

import { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { submitOrderAction } from './actions';
import type { PlanPackage } from '../../lib/school';

export default function OnboardingClient({ plans }: { plans: PlanPackage[] }) {
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get('plan') || plans[0]?.id || '';

  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);
  
  const [form, setForm] = useState({
    name: '',
    slug: '',
    city: '',
    description: '',
    plan: initialPlan,
    phone: '',
    authorityName: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    
    // Generate slug from name if not provided
    let slug = form.slug;
    if (!slug) {
      slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const submitPayload = { ...form, slug, category: 'trusted' as const, adminEmail: form.email, adminPassword: form.password };

    startTransition(async () => {
      const result = await submitOrderAction(submitPayload);
      if (result.success) {
        setMessage({ text: 'Order submitted successfully! Our team will review and activate your portal soon.', type: 'success' });
        setForm({ name: '', slug: '', city: '', description: '', plan: plans[0]?.id || '', phone: '', authorityName: '', email: '', password: '' });
      } else {
        setMessage({ text: result.error || 'Failed to submit order.', type: 'error' });
      }
    });
  };

  return (
     <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
        {message && (
          <div className={`p-4 rounded-xl text-sm font-semibold ${message.type === 'success' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-red-900/50 text-red-400'}`}>
            {message.text}
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-200">School Name *</span>
            <input required name="name" type="text" value={form.name} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-sky-500 focus:outline-none" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-200">Preferred URL Slug (Optional)</span>
            <input name="slug" type="text" value={form.slug} onChange={handleChange} placeholder="e.g. my-school" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-sky-500 focus:outline-none" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-200">Authority Name *</span>
            <input required name="authorityName" type="text" value={form.authorityName} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-sky-500 focus:outline-none" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-200">Phone Number *</span>
            <input required name="phone" type="text" value={form.phone} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-sky-500 focus:outline-none" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-200">Admin Email *</span>
            <input required name="email" type="email" value={form.email} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-sky-500 focus:outline-none" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-200">Admin Password *</span>
            <input required name="password" type="password" value={form.password} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-sky-500 focus:outline-none" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-200">City *</span>
            <input required name="city" type="text" value={form.city} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-sky-500 focus:outline-none" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-200">Subscription Plan *</span>
            <select required name="plan" value={form.plan} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-sky-500 focus:outline-none">
              {plans.map(p => <option key={p.id} value={p.id}>{p.name} - ৳{p.price}/mo</option>)}
            </select>
          </label>
        </div>
        <button type="submit" disabled={isPending} className="mt-6 w-full rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-50">
          {isPending ? 'Submitting...' : 'Submit Order'}
        </button>
     </form>
  );
}