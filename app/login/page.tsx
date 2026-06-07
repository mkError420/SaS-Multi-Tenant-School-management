'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // The server returned HTML instead of JSON (usually a 404 or 504 crash)
        const text = await response.text();
        if (response.status === 404) {
          throw new Error('API route not found (404). Please ensure app/api/login/route.ts is pushed to GitHub.');
        } else if (response.status === 504) {
          throw new Error('Server timeout (504). This usually means MongoDB Atlas Network Access is blocking Vercel. Please allow IP 0.0.0.0/0 in Atlas.');
        } else {
          throw new Error(`Server returned ${response.status} non-JSON response.`);
        }
      }

      const result = await response.json();
      
      if (!response.ok) {
        setMessage(result.error || 'Invalid credentials.');
      } else {
        setMessage('Login successful. Redirecting...');
        // Redirect based on the user's role and associated tenant
        if (result.user.role === 'super-admin') {
          router.push('/super-admin');
        } else if (result.user.tenantSlug) {
          router.push(`/${result.user.tenantSlug}`);
        } else {
          router.push('/');
        }
      }
    } catch (error: any) {
      setMessage(error.message || 'An unexpected error occurred during login.');
    }

    setLoading(false);
  };

  return (
    <main className="mx-auto max-w-md px-6 py-14 lg:px-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/95 p-10 shadow-soft">
        <h1 className="text-3xl font-semibold text-white">Sign in</h1>
        <p className="mt-3 text-slate-400">Sign in to your dashboard.</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <label className="block">
            <span className="text-sm font-semibold text-slate-200">Email address</span>
            <input name="email" type="email" value={form.email} onChange={handleChange} required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-200">Password</span>
            <input name="password" type="password" value={form.password} onChange={handleChange} required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
          </label>

          <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          {message ? <p className="text-sm text-slate-300">{message}</p> : null}
        </form>
      </div>
    </main>
  );
}