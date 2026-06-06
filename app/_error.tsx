'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorPage() {
  // Next.js will supply errors via error boundary in real apps.
  // This simple fallback prevents build-time PageNotFoundError for /_error.
  useEffect(() => {
    // no-op
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-20 text-center">
      <div className="max-w-xl rounded-3xl border border-slate-800 bg-slate-900/95 p-10 shadow-soft">
        <p className="text-sm uppercase tracking-[0.35em] text-sky-400">Error</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Something went wrong</h1>
        <p className="mt-4 text-slate-400">Please go back to the homepage and try again.</p>
        <Link href="/" className="mt-8 inline-flex rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-400">
          Return home
        </Link>
      </div>
    </main>
  );
}

