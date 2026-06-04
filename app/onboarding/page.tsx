'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    slug: '',
    city: '',
    plan: 'Starter',
    description: '',
    adminEmail: '',
    adminPassword: '',
  });
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) {
        setMessage(result.error || 'Unable to onboard tenant.');
      } else {
        setMessage('Tenant created successfully. Redirecting to login...');
        router.push('/login');
      }
    } catch (error) {
      setMessage('An unexpected error occurred during onboarding.');
    }

    setLoading(false);
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-14 lg:px-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/95 p-10 shadow-soft">
        <h1 className="text-3xl font-semibold text-white">Tenant onboarding</h1>
        <p className="mt-3 text-slate-400">Create a new school tenant and the first admin account for your multi-tenant SaaS environment.</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-200">School name</span>
              <input name="name" value={form.name} onChange={handleChange} required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-200">Tenant slug</span>
              <input name="slug" value={form.slug} onChange={handleChange} required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-200">City</span>
              <input name="city" value={form.city} onChange={handleChange} required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-200">Plan</span>
              <select name="plan" value={form.plan} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                <option>Starter</option>
                <option>Growth</option>
                <option>Premium</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-slate-200">Description</span>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-200">Admin email</span>
              <input name="adminEmail" type="email" value={form.adminEmail} onChange={handleChange} required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-200">Admin password</span>
              <input name="adminPassword" type="password" value={form.adminPassword} onChange={handleChange} required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
            </label>
          </div>

          <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? 'Creating tenant…' : 'Create tenant'}
          </button>

          {message ? <p className="text-sm text-slate-300">{message}</p> : null}
        </form>
      </div>
    </main>
  );
}
