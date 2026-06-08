import { redirect, notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { getTenantBySlug } from '../../lib/tenant';
import Link from 'next/link';

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { tenant: string };
}) {
  const tenant = await getTenantBySlug(params.tenant);
  if (!tenant) {
    notFound();
  }

  const isDemo = tenant.category === 'demo';

  const cookieStore = cookies();
  const userCookie = cookieStore.get('schoolspace_user')?.value;

  let user;
  if (userCookie) {
    try {
      user = JSON.parse(userCookie);
    } catch (e) {
      // ignore
    }
  }

  if (!isDemo) {
    if (!user) {
      redirect('/login');
    }
    // Super admins can view any tenant. Regular admins can ONLY view their own school.
    if (user.role !== 'super-admin' && user.tenantSlug !== params.tenant) {
      redirect('/');
    }
  }

  async function handleLogout() {
    'use server';
    cookies().delete('schoolspace_user');
    redirect('/');
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white">{tenant.name}</h1>
          <p className="mt-2 text-sm text-sky-400">School Administration Portal {isDemo && !user ? '(Demo Mode)' : ''}</p>
        </div>
        <form action={handleLogout}>
          <button type="submit" className="inline-flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-slate-500 hover:bg-slate-800">
            {user ? 'Log out' : 'Exit Demo'}
          </button>
        </form>
      </div>
      
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Navigation Sidebar */}
        <aside className="w-full shrink-0 md:w-56 lg:w-64">
          <nav className="flex flex-row gap-2 overflow-x-auto pb-4 md:flex-col md:pb-0">
            <Link href={`/${tenant.slug}`} className="whitespace-nowrap rounded-2xl bg-slate-900/80 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800">
              Dashboard Overview
            </Link>
            <Link href={`/${tenant.slug}/billing`} className="whitespace-nowrap rounded-2xl bg-slate-900/80 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white">
              Billing & Invoices
            </Link>
            <Link href={`/${tenant.slug}/students`} className="whitespace-nowrap rounded-2xl bg-slate-900/80 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white">
              Student Records
            </Link>
            <Link href={`/${tenant.slug}/teachers`} className="whitespace-nowrap rounded-2xl bg-slate-900/80 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white">
              Teacher Staff
            </Link>
            <Link href={`/${tenant.slug}/classes`} className="whitespace-nowrap rounded-2xl bg-slate-900/80 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white">
              Classes
            </Link>
            <Link href={`/${tenant.slug}/attendance`} className="whitespace-nowrap rounded-2xl bg-slate-900/80 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white">
              Attendance
            </Link>
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}