import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTenantBySlug } from '../../../lib/tenant';

type Props = {
  params: {
    tenant: string;
  };
};

export default async function TenantSettings({ params }: Props) {
  const tenant = await getTenantBySlug(params.tenant);

  if (!tenant) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-400">Configuration</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">{tenant.name} settings</h1>
            <p className="mt-2 text-slate-400">Update tenant details, manage billing, and keep school data centralized.</p>
          </div>
          <Link href={`/${tenant.slug}`} className="inline-flex items-center justify-center rounded-2xl bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-700">
            Back to dashboard
          </Link>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl bg-slate-950/80 p-6">
            <h2 className="text-lg font-semibold text-white">Tenant profile</h2>
            <p className="mt-3 text-slate-400">School name, location, and plan are connected to the tenant record.</p>
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-slate-900 p-5">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Name</p>
                <p className="mt-2 text-base text-white">{tenant.name}</p>
              </div>
              <div className="rounded-3xl bg-slate-900 p-5">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">City</p>
                <p className="mt-2 text-base text-white">{tenant.city}</p>
              </div>
              <div className="rounded-3xl bg-slate-900 p-5">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Plan</p>
                <p className="mt-2 text-base text-white">{tenant.plan}</p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-slate-950/80 p-6">
            <h2 className="text-lg font-semibold text-white">School operations</h2>
            <p className="mt-3 text-slate-400">Enable and configure school modules for the selected tenant.</p>
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-slate-900 p-5">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Attendance</p>
                <p className="mt-2 text-base text-white">Enabled</p>
              </div>
              <div className="rounded-3xl bg-slate-900 p-5">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Class scheduling</p>
                <p className="mt-2 text-base text-white">Enabled</p>
              </div>
              <div className="rounded-3xl bg-slate-900 p-5">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Parent portal</p>
                <p className="mt-2 text-base text-slate-400">Coming soon</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
