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

  // Super admins can view any tenant. Regular admins can ONLY view their own school.
  if (user.role !== 'super-admin' && user.tenantSlug !== params.tenant) {
    redirect('/');
  }

  const tenant = await getTenantBySlug(params.tenant);
  if (!tenant) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">{tenant.name}</h1>
          <p className="mt-2 text-sm text-sky-400">School Administration Portal</p>
        </div>
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