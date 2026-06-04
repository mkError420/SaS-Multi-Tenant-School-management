'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
            <div className="relative mt-2">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-white focus:border-sky-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400 transition hover:text-slate-100"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19.5c-5.3 0-9.8-3.42-11.47-8.25a1 1 0 0 1 0-.5" />
                    <path d="M1 1l22 22" />
                    <path d="M9.88 9.88a3 3 0 0 0 4.24 4.24" />
                    <path d="M14.12 14.12A3 3 0 0 1 9.88 9.88" />
                    <path d="M4.73 4.73A16 16 0 0 1 19.27 19.27" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
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
