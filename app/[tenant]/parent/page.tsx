import { notFound } from 'next/navigation';
import { getTenantBySlug } from '../../../lib/tenant';
import { getParentPortalData } from '../../../lib/school';

type Props = {
  params: {
    tenant: string;
  };
};

export default async function ParentPage({ params }: Props) {
  const tenant = await getTenantBySlug(params.tenant);
  if (!tenant) {
    notFound();
  }

  const portal = await getParentPortalData(params.tenant);

  return (
    <section className="space-y-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-soft">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-sky-400">Parent portal</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Monitoring {portal.childName}</h1>
        <p className="mt-2 text-slate-400">Track attendance, fee dues, and academic progress for your child.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl bg-slate-950 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Child</p>
          <p className="mt-3 text-lg font-semibold text-white">{portal.childName}</p>
          <p className="mt-1 text-slate-400">{portal.className}</p>
        </div>
        <div className="rounded-3xl bg-slate-950 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Attendance</p>
          <p className="mt-3 text-lg font-semibold text-white">{portal.attendancePct}%</p>
        </div>
        <div className="rounded-3xl bg-slate-950 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Outstanding fees</p>
          <p className="mt-3 text-lg font-semibold text-white">${portal.outstandingFees}</p>
        </div>
        <div className="rounded-3xl bg-slate-950 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Teacher contact</p>
          <p className="mt-3 text-lg font-semibold text-white">{portal.teacherContact}</p>
        </div>
      </div>

      <div className="rounded-3xl bg-slate-950 p-6">
        <h2 className="text-xl font-semibold text-white">Quick actions</h2>
        <div className="mt-6 space-y-3 text-slate-300">
          <p>Pay fees directly through the school’s mobile payment gateway.</p>
          <p>View report cards and class attendance history for the current academic year.</p>
        </div>
      </div>
    </section>
  );
}
