import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTenantBySlug } from '../../lib/tenant';

type Props = {
  params: {
    tenant: string;
  };
};

export default async function TenantDashboard({ params }: Props) {
  const tenant = await getTenantBySlug(params.tenant);

  if (!tenant) {
    notFound();
  }

  const stats = [
    { label: 'Students', value: tenant.students, accent: 'bg-sky-500/15 text-sky-300' },
    { label: 'Teachers', value: tenant.teachers, accent: 'bg-emerald-500/15 text-emerald-300' },
    { label: 'Classes', value: tenant.classes, accent: 'bg-violet-500/15 text-violet-300' },
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
      <header className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-400">Tenant portal</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">{tenant.name}</h1>
            <p className="mt-3 max-w-2xl text-slate-400">{tenant.description}</p>
          </div>
          <Link href="/" className="inline-flex items-center justify-center rounded-2xl bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-700">
            Back to home
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((item) => (
            <div key={item.label} className={`rounded-3xl border border-slate-800 p-6 ${item.accent}`}>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-300">{item.label}</p>
              <p className="mt-4 text-3xl font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </header>

      <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { title: 'Students', description: 'Review rosters, attendance, and enrollment data.', href: `/${tenant.slug}/students`, accent: 'bg-sky-500/10 text-sky-300' },
          { title: 'Teachers', description: 'View teachers, assignments, and contact details.', href: `/${tenant.slug}/teachers`, accent: 'bg-emerald-500/10 text-emerald-300' },
          { title: 'Billing', description: 'Track invoices, payments, and outstanding balances.', href: `/${tenant.slug}/billing`, accent: 'bg-violet-500/10 text-violet-300' },
        ].map((card) => (
          <article key={card.title} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-soft">
            <div className={`rounded-3xl ${card.accent} p-4 text-sm font-semibold`}>{card.title}</div>
            <p className="mt-6 text-slate-400">{card.description}</p>
            <Link href={card.href} className="mt-6 inline-flex text-sm font-semibold text-slate-200 underline decoration-slate-600 hover:text-white">
              Open {card.title.toLowerCase()}
            </Link>
          </article>
        ))}
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-sky-400">Tenant settings</p>
              <h2 className="mt-3 text-xl font-semibold text-white">School configuration</h2>
            </div>
            <Link href={`/${tenant.slug}/settings`} className="rounded-full bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-300 transition hover:bg-sky-500/20">
              Open settings
            </Link>
          </div>
          <div className="mt-6 grid gap-4">
            <div className="rounded-3xl bg-slate-950/80 p-5">
              <p className="text-sm text-slate-500">Current plan</p>
              <p className="mt-2 text-lg font-semibold text-white">{tenant.plan}</p>
            </div>
            <div className="rounded-3xl bg-slate-950/80 p-5">
              <p className="text-sm text-slate-500">Campus location</p>
              <p className="mt-2 text-lg font-semibold text-white">{tenant.city}</p>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
