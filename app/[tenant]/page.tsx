import { getTenantBySlug } from '../../lib/tenant';
import { getTenantStudents, getTenantTeachers, getTenantSchedule, getTenantNoticeBoard, getTenantBilling} from '../../lib/school';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function TenantDashboardPage({ params }: { params: { tenant: string } }) {
  const tenant = await getTenantBySlug(params.tenant);
  if (!tenant) notFound();

  const students = await getTenantStudents(params.tenant);
  const teachers = await getTenantTeachers(params.tenant);
  const schedule = await getTenantSchedule(params.tenant);
  const notices = await getTenantNoticeBoard(params.tenant);
  const billing = await getTenantBilling(params.tenant);

  // Dynamically calculate fees that are strictly marked as 'unpaid' or 'pending'
  const pendingDue = billing.reduce((acc, curr) => curr.status !== 'paid' ? acc + curr.amount : acc, 0);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 shadow-soft">
          <p className="text-sm font-medium text-slate-400">Total Students</p>
          <p className="mt-2 text-3xl font-semibold text-white">{students.length}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 shadow-soft">
          <p className="text-sm font-medium text-slate-400">Total Teachers</p>
          <p className="mt-2 text-3xl font-semibold text-white">{teachers.length}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 shadow-soft">
          <p className="text-sm font-medium text-slate-400">Classes Scheduled</p>
          <p className="mt-2 text-3xl font-semibold text-white">{schedule.length}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 shadow-soft">
          <p className="text-sm font-medium text-slate-400">Outstanding Fees</p>
          <p className="mt-2 text-3xl font-semibold text-amber-400">৳{pendingDue.toLocaleString()}</p>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Dynamic Notice Board */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 shadow-soft">
          <h2 className="mb-6 text-xl font-semibold text-white">Notice Board</h2>
          <div className="space-y-6">
            {notices.length > 0 ? notices.map(notice => (
              <div key={notice.id} className="border-b border-slate-800 pb-6 last:border-0 last:pb-0">
                <h3 className="font-medium text-white">{notice.title}</h3>
                <p className="mt-1 text-xs text-sky-400">{new Date(notice.date).toLocaleDateString()} • {notice.audience}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{notice.message}</p>
              </div>
            )) : <p className="text-sm text-slate-500">No notices posted.</p>}
          </div>
        </section>

        {/* Recent Students Feed */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 shadow-soft">
          <h2 className="mb-6 text-xl font-semibold text-white">Recent Enrollments</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Grade</th>
                  <th className="pb-3 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {students.slice(0, 5).map(student => (
                  <tr key={student.id}>
                    <td className="py-4 text-white">{student.name}</td>
                    <td className="py-4">{student.grade}</td>
                    <td className="py-4 text-right">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${student.status.toLowerCase() === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr><td colSpan={3} className="py-6 text-center text-slate-500">No students found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}