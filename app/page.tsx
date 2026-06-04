import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllTenants } from '../lib/tenant';
import { getSubscriptionPlans } from '../lib/school';

export const metadata: Metadata = {
  title: 'Zass SaaS',
};

export default async function HomePage() {
  const tenants = await getAllTenants();
  const plans = getSubscriptionPlans();

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <section className="overflow-hidden rounded-[2rem] border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-12 shadow-2xl shadow-slate-950/40 sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-12">
        <div className="max-w-3xl text-center lg:text-left">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-400">Zass SaaS school system</p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Modern school management designed for fast onboarding and smarter campus operations.
          </h1>
          <p className="mt-6 text-base leading-8 text-slate-300 sm:text-lg">
            Simplify every school with a powerful multi-tenant dashboard built for administrators, teachers, and staff across desktop, tablet, and mobile.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
            <Link href="/login" className="inline-flex items-center justify-center rounded-2xl bg-sky-500 px-7 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
              Sign in
            </Link>
            <Link href="/super-admin" className="inline-flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 px-7 py-3 text-sm font-semibold text-white transition hover:border-sky-400 hover:text-white">
              Super admin
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-0 lg:w-[420px]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Trusted</p>
            <p className="mt-3 text-4xl font-semibold text-white">3</p>
            <p className="mt-3 text-sm leading-6 text-slate-400">demo school portals ready to preview</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Built for</p>
            <p className="mt-3 text-4xl font-semibold text-white">School leaders</p>
            <p className="mt-3 text-sm leading-6 text-slate-400">manage students, teachers, attendance, and billing from one place</p>
          </div>
        </div>
      </section>

      <section className="mt-16 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Subscription plans</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Simple Taka pricing for every school stage</h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">
              Select the plan that fits your school best, from essential management to advanced reporting and support.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {plans.map((plan) => (
              <article key={plan.id} className="rounded-[1.75rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft transition hover:-translate-y-1 hover:border-sky-400">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                    <p className="mt-2 text-sm text-slate-400">{plan.description}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-800 px-4 py-2 text-sm font-semibold text-sky-300">Taka {plan.price}</div>
                </div>
                <p className="mt-6 text-sm leading-6 text-slate-400">Up to {plan.studentLimit > 0 ? plan.studentLimit : 'unlimited'} students included.</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Why Zass</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Create a safer, faster, and more connected school workflow</h2>
          <div className="mt-8 space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
              <p className="text-sm font-semibold text-white">Fast onboarding</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">Launch school tenants quickly with ready-to-use demo templates and one-click setup.</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
              <p className="text-sm font-semibold text-white">Centralized control</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">Manage students, classes, teachers, and billing from one secure platform.</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
              <p className="text-sm font-semibold text-white">Responsive design</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">Everything works smoothly on desktop, tablet, and mobile for every school user.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-400">School demos</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Preview demo schools instantly</h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-400">
            Explore school portals and see how Zass keeps tenant data separate while delivering a unified experience.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {tenants.map((tenant) => (
            <Link key={tenant.slug} href={`/${tenant.slug}`} className="group block rounded-[1.75rem] border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-sky-400">
              <div className="flex items-start justify-between gap-4">
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

      <a
        href="https://wa.me/8801572491828"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-3 rounded-3xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-2xl shadow-emerald-500/30 transition hover:bg-emerald-400"
      >
        <span className="h-6 w-6 rounded-full bg-white p-1 text-emerald-600">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M20.5 3.5A11.95 11.95 0 0012 0C5.372 0 0 5.373 0 12c0 2.071.558 4.007 1.528 5.687L0 24l6.487-1.7A11.95 11.95 0 0012 24c6.628 0 12-5.373 12-12 0-3.204-1.246-6.151-3.5-8.5zm-8.5 17.4c-1.86 0-3.69-.5-5.28-1.44l-.38-.22-3.85 1.01 1.03-3.75-.24-.39A9.869 9.869 0 012.5 12c0-5.24 4.26-9.5 9.5-9.5S21.5 6.76 21.5 12 17.74 20.9 12 20.9zm5.1-6.75c-.28-.14-1.66-.82-1.92-.92-.26-.1-.45-.14-.64.14-.19.28-.74.92-.9 1.11-.16.19-.32.21-.6.07-.28-.14-1.18-.43-2.24-1.37-.83-.74-1.39-1.66-1.55-1.94-.16-.28-.02-.43.12-.57.12-.12.28-.32.42-.48.14-.16.19-.28.28-.46.09-.19.05-.35-.02-.49-.07-.14-.64-1.54-.88-2.12-.23-.55-.46-.47-.64-.48-.17-.01-.36-.01-.55-.01-.19 0-.5.07-.76.35-.26.28-1 1-1 2.46 0 1.46 1.03 2.87 1.17 3.06.14.19 2.03 3.1 4.92 4.34.69.3 1.23.48 1.65.62.69.23 1.32.2 1.82.12.56-.09 1.66-.68 1.9-1.34.24-.66.24-1.22.17-1.34-.07-.12-.26-.19-.55-.33z" />
          </svg>
        </span>
        <span>Chat with us</span>
      </a>
    </main>
  );
}
