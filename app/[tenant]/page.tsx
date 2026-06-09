import { getTenantBySlug } from '../../lib/tenant';
import { redirect } from 'next/navigation';
import { getTenantStudents, getTenantTeachers } from '../../lib/school';
import StudentsManager from '../../components/StudentsManager';
import TeachersManager from '../../components/TeachersManager';
import { Suspense } from 'react';
 
export const dynamic = 'force-dynamic';

export default async function TenantDashboardPage({ params }: { params: { tenant: string } }) {
  const tenant = await getTenantBySlug(params.tenant);

  if (!tenant) {
    redirect('/');
  }

  // Fetch students and teachers for the manager components
  const students = await getTenantStudents(params.tenant);
  const teachers = await getTenantTeachers(params.tenant);

  return (
    <div className="p-6 sm:p-10 animate-in fade-in duration-300 space-y-10">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-sky-400">Overview</p>
        <h1 className="mt-3 text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-2 text-slate-400">Welcome to {tenant.name}. Here's a summary of your school.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="text-sm font-medium text-slate-400">Total Students</p>
          <p className="mt-2 text-3xl font-semibold text-white">{tenant.students}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="text-sm font-medium text-slate-400">Total Teachers</p>
          <p className="mt-2 text-3xl font-semibold text-white">{tenant.teachers}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="text-sm font-medium text-slate-400">Plan</p>
          <p className="mt-2 text-3xl font-semibold text-white">{tenant.plan}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="text-sm font-semibold text-slate-400">Subscription</p>
          <p className={`mt-2 text-xl font-semibold ${new Date(tenant.subscriptionExpiresAt || 0) < new Date() ? 'text-red-400' : 'text-emerald-400'}`}>
            {tenant.subscriptionExpiresAt ? `Expires on ${new Date(tenant.subscriptionExpiresAt).toLocaleDateString()}` : 'N/A'}
          </p>
        </div>
      </div>

      <div className="space-y-10">
        <Suspense fallback={<div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 text-center text-slate-400">Loading teachers...</div>}>
          <TeachersManager tenantSlug={tenant.slug} initialTeachers={teachers} />
        </Suspense>
        <Suspense fallback={<div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 text-center text-slate-400">Loading students...</div>}>
          <StudentsManager tenantSlug={tenant.slug} initialStudents={students} />
        </Suspense>
      </div>
    </div>
  );
}