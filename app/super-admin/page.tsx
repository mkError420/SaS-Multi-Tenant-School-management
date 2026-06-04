import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import TenantStatusButton from '../../components/TenantStatusButton';
import { getAllTenants } from '../../lib/tenant';
import { getPlatformAnalytics, getSubscriptionPlans } from '../../lib/school';

export default async function SuperAdminPage() {
  const cookieStore = cookies();
  const userCookie = cookieStore.get('schoolspace_user')?.value;
  if (!userCookie) {
    redirect('/login');
  }

  let user;
  try {
    user = JSON.parse(userCookie);
  } catch {
    redirect('/login');
  }

  if (user?.role !== 'super-admin') {
    redirect('/login');
  }
  const tenants = await getAllTenants();
  const analytics = await getPlatformAnalytics();
  const plans = getSubscriptionPlans();

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <section className="space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/95 p-10 shadow-soft">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-400">Super Admin</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">Platform control center</h1>
          <p className="mt-4 text-slate-400">Monitor tenant enrollment, subscription plans, billing, and platform metrics from a centralized admin dashboard.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl bg-slate-950 p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Total schools</p>
              <p className="mt-4 text-3xl font-semibold text-white">{analytics.totalSchools}</p>
            </div>
            <div className="rounded-3xl bg-slate-950 p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Active schools</p>
              <p className="mt-4 text-3xl font-semibold text-white">{analytics.activeSchools}</p>
            </div>
            <div className="rounded-3xl bg-slate-950 p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Students</p>
              <p className="mt-4 text-3xl font-semibold text-white">{analytics.totalStudents}</p>
            </div>
            <div className="rounded-3xl bg-slate-950 p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Revenue</p>
              <p className="mt-4 text-3xl font-semibold text-white">${analytics.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
          <h2 className="text-xl font-semibold text-white">Tenant management</h2>
          <p className="mt-3 text-slate-400">Approve, suspend, or activate school tenants, and review each school’s status.</p>
          <div className="mt-6 space-y-4">
            {tenants.map((tenant) => (
              <div key={tenant.slug} className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{tenant.city}</p>
                    <p className="mt-1 text-lg font-semibold text-white">{tenant.name}</p>
                  </div>
                  <TenantStatusButton slug={tenant.slug} currentStatus={tenant.status} />
                </div>
                <Link href={`/${tenant.slug}`} className="mt-4 inline-flex text-sm font-semibold text-sky-300 underline">Open tenant dashboard</Link>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
          <h2 className="text-xl font-semibold text-white">Subscription plans</h2>
          <p className="mt-3 text-slate-400">Create and manage pricing tiers for schools based on size and feature access.</p>
          <div className="mt-6 space-y-4">
            {plans.map((plan) => (
              <div key={plan.id} className="rounded-3xl bg-slate-950 p-5">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">${plan.price}/mo</span>
                </div>
                <p className="mt-2 text-slate-400">{plan.description}</p>
                <p className="mt-3 text-sm text-slate-500">Student limit: {plan.studentLimit === -1 ? 'Unlimited' : plan.studentLimit}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
          <h2 className="text-xl font-semibold text-white">System settings</h2>
          <p className="mt-3 text-slate-400">Global configuration for languages, payment gateways, and platform defaults.</p>
          <div className="mt-6 space-y-4 text-slate-300">
            <div className="rounded-3xl bg-slate-950 p-5">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Payment gateways</p>
              <p className="mt-2">bKash, Nagad, SSLCommerz support coming soon.</p>
            </div>
            <div className="rounded-3xl bg-slate-950 p-5">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">System locale</p>
              <p className="mt-2">English / Bengali</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
