import { notFound } from 'next/navigation';
import { getTenantBySlug } from '../../../lib/tenant';
import { getTenantAcademicSetup, getTenantAdmissions, getTenantBilling, getTenantNoticeBoard } from '../../../lib/school';

type Props = {
  params: {
    tenant: string;
  };
};

export default async function AdminPage({ params }: Props) {
  const tenant = await getTenantBySlug(params.tenant);
  if (!tenant) {
    notFound();
  }

  const academicSetup = await getTenantAcademicSetup(params.tenant);
  const admissions = await getTenantAdmissions(params.tenant);
  const billing = await getTenantBilling(params.tenant);
  const notices = await getTenantNoticeBoard(params.tenant);

  return (
    <section className="space-y-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-soft">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-sky-400">School Admin</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">{tenant.name} administration</h1>
          <p className="mt-2 text-slate-400">Academic setup, admission processing, fee management, and school-wide announcements.</p>
        </div>
        <button className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
          Create new admission
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-slate-950 p-6">
          <h2 className="text-xl font-semibold text-white">Academic setup</h2>
          <p className="mt-3 text-slate-400">Configure classes, sections, subjects, shifts, and academic session details.</p>
          <div className="mt-6 space-y-3 text-slate-300">
            <p>Classes: {academicSetup.classes}</p>
            <p>Sections: {academicSetup.sections}</p>
            <p>Subjects: {academicSetup.subjects}</p>
            <p>Shifts: {academicSetup.shifts.join(', ')}</p>
            <p>Academic year: {academicSetup.session}</p>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-950 p-6">
          <h2 className="text-xl font-semibold text-white">Accounts & fees</h2>
          <p className="mt-3 text-slate-400">Track outstanding invoices and review fee collection across the school.</p>
          <div className="mt-6 space-y-3">
            {billing.slice(0, 3).map((invoice) => (
              <div key={invoice.id} className="rounded-3xl bg-slate-900 p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-white">{invoice.label}</p>
                  <span className="text-sm text-slate-400">{invoice.status}</span>
                </div>
                <p className="mt-2 text-slate-300">Due: {invoice.due} — ${invoice.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-slate-950 p-6">
          <h2 className="text-xl font-semibold text-white">Admission applications</h2>
          <div className="mt-6 space-y-4">
            {admissions.map((application) => (
              <div key={application.id} className="rounded-3xl bg-slate-900 p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-white">{application.studentName}</p>
                  <span className="text-sm text-slate-400">{application.status}</span>
                </div>
                <p className="mt-2 text-slate-300">Grade: {application.grade} • Applied: {application.appliedOn}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-slate-950 p-6">
          <h2 className="text-xl font-semibold text-white">Notice board</h2>
          <div className="mt-6 space-y-4">
            {notices.map((notice) => (
              <div key={notice.id} className="rounded-3xl bg-slate-900 p-4">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">{notice.audience}</p>
                <p className="mt-2 text-lg font-semibold text-white">{notice.title}</p>
                <p className="mt-1 text-sm text-slate-400">{notice.date}</p>
                <p className="mt-3 text-slate-300">{notice.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
