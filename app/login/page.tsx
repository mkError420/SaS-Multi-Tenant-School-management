'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (!response.ok) {
        setMessage(result.error || 'Unable to sign in.');
      } else {
        setMessage('Welcome back! Authentication succeeded. Redirecting...');
        router.push(result.user.role === 'super-admin' ? '/super-admin' : `/${result.user.tenantSlug}`);
      }
    } catch (error) {
      setMessage('An unexpected error occurred while signing in.');
    }

    setLoading(false);
  };

  return (
    <main className="mx-auto max-w-2xl px-6 py-14 lg:px-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/95 p-10 shadow-soft">
        <h1 className="text-3xl font-semibold text-white">Zass-management login</h1>
        <p className="mt-3 text-slate-400">Sign in as a school administrator or staff member to manage students, teachers, classes, and billing.</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <label className="block">
            <span className="text-sm font-semibold text-slate-200">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-200">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          {message ? <p className="text-sm text-slate-300">{message}</p> : null}
        </form>
      </div>
    </main>
  );
}
