import { getAllTenants } from '../../lib/tenant';
import { getPlatformAnalytics, getSubscriptionPlans } from '../../lib/school';
import DashboardClient from './DashboardClient';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function SuperAdminPage() {
  const cookieStore = cookies();
  const userCookie = cookieStore.get('schoolspace_user')?.value;

  if (!userCookie) {
    redirect('/login');
  }

  let user;
  try {
    user = JSON.parse(userCookie);
  } catch (e) {
    redirect('/login');
  }

  if (user?.role !== 'super-admin') {
    redirect('/');
  }

  const tenants = await getAllTenants();
  const analytics = await getPlatformAnalytics();
  const plans = await getSubscriptionPlans();

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white">Super Admin Dashboard</h1>
          <p className="mt-2 text-slate-400">Manage all tenants, review platform revenue, and configure subscription plans.</p>
        </div>
        <Link href="/onboarding" className="inline-flex items-center justify-center rounded-2xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
          + Onboard Tenant
        </Link>
      </div>
      
      <DashboardClient tenants={tenants} analytics={analytics} plans={plans} />
    </main>
  );
}