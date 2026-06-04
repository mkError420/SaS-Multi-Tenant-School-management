import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <Link href="/" className="text-xl font-semibold text-white hover:text-sky-300">
          Zass-school-management
        </Link>

        <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
          <Link href="/" className="transition hover:text-white">
            Home
          </Link>
          <Link href="/login" className="transition hover:text-white">
            Login
          </Link>
          <Link href="/super-admin" className="transition hover:text-white">
            Super Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
