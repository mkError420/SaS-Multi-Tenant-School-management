'use client';

import { useState, useTransition } from 'react';
import { submitContactMessageAction } from './contact-actions';

export default function ContactWidget() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('idle');
    startTransition(async () => {
      const res = await submitContactMessageAction(form);
      if (res.success) {
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
      }
    });
  };

  return (
    <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft h-full">
      <h2 className="text-2xl font-semibold text-white">Contact Us</h2>
      <p className="mt-2 text-sm text-slate-400">Have questions or need support? Drop us a message.</p>

      {status === 'success' && (
        <div className="mt-4 rounded-xl bg-emerald-900/50 p-4 text-sm font-semibold text-emerald-400">
          Message sent successfully! We will get back to you soon.
        </div>
      )}
      {status === 'error' && (
        <div className="mt-4 rounded-xl bg-red-900/50 p-4 text-sm font-semibold text-red-400">
          Failed to send message. Please try again later.
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-semibold text-slate-300">Name</span>
            <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-sky-500 focus:outline-none" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-slate-300">Email</span>
            <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-sky-500 focus:outline-none" />
          </label>
        </div>
        <label className="block">
          <span className="text-xs font-semibold text-slate-300">Subject</span>
          <input required type="text" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-sky-500 focus:outline-none" />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-slate-300">Message</span>
          <textarea required rows={4} value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-sky-500 focus:outline-none" />
        </label>
        <button type="submit" disabled={isPending} className="w-full rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-50">
          {isPending ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}