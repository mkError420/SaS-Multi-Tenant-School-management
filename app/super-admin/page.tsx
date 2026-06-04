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
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="space-y-6">
        <div className="rounded-[32px] border border-slate-800 bg-slate-900/95 p-8 shadow-soft sm:p-10">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.35em] text-sky-400">Super Admin</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Platform control center</h1>
              <p className="mt-4 text-base leading-7 text-slate-400 sm:text-lg">
                Monitor tenant onboarding, subscription plans, revenue, and platform metrics from a responsive centralized dashboard.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
              <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Total schools</p>
                <p className="mt-4 text-3xl font-semibold text-white">{analytics.totalSchools}</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Active schools</p>
                <p className="mt-4 text-3xl font-semibold text-white">{analytics.activeSchools}</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Students</p>
                <p className="mt-4 text-3xl font-semibold text-white">{analytics.totalStudents}</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Revenue</p>
                <p className="mt-4 text-3xl font-semibold text-white">${analytics.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.8fr_1fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-soft sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Tenant management</h2>
              <p className="mt-2 text-sm text-slate-400">View and moderate tenant accounts, status updates, and onboarding progress.</p>
            </div>
            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
            >
              Add new tenant
            </Link>
          </div>

          <div className="mt-8 space-y-4">
            {tenants.map((tenant) => (
              <div key={tenant.slug} className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 p-5 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500">{tenant.plan}</p>
                    <h3 className="mt-2 text-xl font-semibold text-white truncate">{tenant.name}</h3>
                    <p className="mt-2 text-sm text-slate-400">{tenant.description}</p>
                  </div>
                  <TenantStatusButton slug={tenant.slug} currentStatus={tenant.status} />
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-3xl bg-slate-900 p-3 text-sm text-slate-300">
                    <p className="text-slate-500">City</p>
                    <p className="mt-1 font-semibold text-white">{tenant.city}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900 p-3 text-sm text-slate-300">
                    <p className="text-slate-500">Students</p>
                    <p className="mt-1 font-semibold text-white">{tenant.students}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900 p-3 text-sm text-slate-300">
                    <p className="text-slate-500">Revenue</p>
                    <p className="mt-1 font-semibold text-white">${tenant.revenue.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Link href={`/${tenant.slug}`} className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-sky-400 hover:text-white">
                    Open dashboard
                  </Link>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.32em] text-slate-400">{tenant.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-soft sm:p-8">
            <h2 className="text-2xl font-semibold text-white">Subscription plans</h2>
            <p className="mt-2 text-sm text-slate-400">Plan tiers for school accounts and growth management.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {plans.map((plan) => (
                <div key={plan.id} className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                      <p className="mt-2 text-sm text-slate-400">{plan.description}</p>
                    </div>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">${plan.price}/mo</span>
                  </div>
                  <p className="mt-4 text-sm text-slate-500">Student limit: {plan.studentLimit === -1 ? 'Unlimited' : plan.studentLimit}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-soft sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">Platform settings</h2>
                <p className="mt-2 text-sm text-slate-400">Global configuration and application defaults for admins.</p>
              </div>
              <div className="rounded-3xl bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-200">Live</div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-950 p-5 text-slate-300">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Payment</p>
                <p className="mt-2 text-sm">bKash, Nagad, SSLCommerz support coming soon.</p>
              </div>
              <div className="rounded-3xl bg-slate-950 p-5 text-slate-300">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Locale</p>
                <p className="mt-2 text-sm">English / Bengali</p>
              </div>
              <div className="rounded-3xl bg-slate-950 p-5 text-slate-300">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Audit logs</p>
                <p className="mt-2 text-sm">Enabled for all tenant activity.</p>
              </div>
              <div className="rounded-3xl bg-slate-950 p-5 text-slate-300">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Security</p>
                <p className="mt-2 text-sm">Role-based access and cookie sessions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
