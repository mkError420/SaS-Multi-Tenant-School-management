import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-20 text-center">
      <div className="max-w-xl rounded-3xl border border-slate-800 bg-slate-900/95 p-10 shadow-soft">
        <p className="text-sm uppercase tracking-[0.35em] text-sky-400">404 error</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Tenant not found</h1>
        <p className="mt-4 text-slate-400">The school you’re looking for does not exist yet. Choose another tenant from the homepage.</p>
        <Link href="/" className="mt-8 inline-flex rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-400">
          Return home
        </Link>
      </div>
    </main>
  );
}
    