import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTenantBySlug } from '../../lib/tenant';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  params: {
    tenant: string;
  };
};

export default async function TenantLayout({ children, params }: Props) {
  const tenant = await getTenantBySlug(params.tenant);

  if (!tenant) {
    notFound();
  }

  const links = [
    { label: 'Overview', href: `/${tenant.slug}` },
    { label: 'School Admin', href: `/${tenant.slug}/admin` },
    { label: 'Students', href: `/${tenant.slug}/students` },
    { label: 'Teachers', href: `/${tenant.slug}/teachers` },
    { label: 'Schedule', href: `/${tenant.slug}/schedule` },
    { label: 'Billing', href: `/${tenant.slug}/billing` },
    { label: 'Teacher Portal', href: `/${tenant.slug}/teacher` },
    { label: 'Student Portal', href: `/${tenant.slug}/student` },
    { label: 'Parent Portal', href: `/${tenant.slug}/parent` },
    { label: 'Settings', href: `/${tenant.slug}/settings` },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-400">Tenant portal</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">{tenant.name}</h2>
            <p className="mt-3 text-sm text-slate-400">Manage this school across students, teachers, classes, billing, and onboarding.</p>
          </div>

          <nav className="space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-2xl px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="rounded-3xl bg-slate-950/80 p-5">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Current plan</p>
            <p className="mt-3 text-lg font-semibold text-white">{tenant.plan}</p>
          </div>
        </aside>

        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}
