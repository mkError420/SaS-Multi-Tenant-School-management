import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllTenants } from '../lib/tenant';

export const metadata: Metadata = {
  title: 'Zass SaaS',
};

export default async function HomePage() {
  const tenants = await getAllTenants();

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <section className="space-y-8 text-center">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Zass "SaaS" school system</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Manage your school from here.
          </h1>
          <p className="mt-6 text-base leading-8 text-slate-300 sm:text-lg">
            Zass "SaaS" school system helps administrators onboard schools, manage students, classes, teachers, and billing with a clean responsive experience on desktop, tablet, and mobile.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/login" className="rounded-2xl bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
              Sign in
            </Link>

            <Link href="/super-admin" className="rounded-2xl border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-sky-400 hover:text-white">
              Super admin
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-soft">
            <h2 className="text-xl font-semibold text-white">Zass tenant intelligence</h2>
            <p className="mt-4 text-slate-400">Give school leaders a unified control center for every campus, with separate tenant data and centralized business operations.</p>
          </article>
          <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-soft">
            <h2 className="text-xl font-semibold text-white">Zass data platform</h2>
            <p className="mt-4 text-slate-400">Power your school ecosystem with Zass storage for schools, users, classes, billing, and performance metrics.</p>
          </article>
          <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-soft">
            <h2 className="text-xl font-semibold text-white">Designed for school teams</h2>
            <p className="mt-4 text-slate-400">Zass delivers a polished responsive dashboard that works for administrators, teachers, parents, and students on any device.</p>
          </article>
        </div>
      </section>

      <section className="mt-16">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Choose a school</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">See details for each school</h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-400">
            Click a school to open its dedicated dashboard, and show how Zass "SaaS" school system keeps all data separate while providing a unified experience across schools.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {tenants.map((tenant) => (
            <Link key={tenant.slug} href={`/${tenant.slug}`} className="group block rounded-3xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-sky-400">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-sky-400">{tenant.plan}</p>
                  <h3 className="mt-4 text-2xl font-semibold text-white">{tenant.name}</h3>
                </div>
                <div className="rounded-2xl bg-slate-800 px-3 py-2 text-sm text-slate-300">{tenant.city}</div>
              </div>
              <p className="mt-6 text-sm leading-6 text-slate-400">{tenant.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
