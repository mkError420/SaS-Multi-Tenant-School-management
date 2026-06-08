'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header({ platformName = 'Zass-school-management' }: { platformName?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-4 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-xl font-semibold text-white hover:text-sky-300">
            {platformName}
          </Link>

          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls="site-navigation"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-200 transition hover:border-slate-700 hover:bg-slate-800 sm:hidden"
            onClick={() => setIsOpen((value) => !value)}
          >
            <span className="sr-only">Toggle navigation</span>
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>

          <nav className="hidden items-center gap-4 text-sm text-slate-300 sm:flex">
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

        <nav
          id="site-navigation"
          className={`overflow-hidden transition-all duration-200 sm:hidden ${isOpen ? 'max-h-48' : 'max-h-0'}`}
        >
          <div className="flex flex-col gap-3 pb-2 text-sm text-slate-300">
            <Link href="/" className="block rounded-2xl px-4 py-3 transition hover:bg-slate-900 hover:text-white" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link href="/login" className="block rounded-2xl px-4 py-3 transition hover:bg-slate-900 hover:text-white" onClick={() => setIsOpen(false)}>
              Login
            </Link>
            <Link href="/super-admin" className="block rounded-2xl px-4 py-3 transition hover:bg-slate-900 hover:text-white" onClick={() => setIsOpen(false)}>
              Super Admin
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
