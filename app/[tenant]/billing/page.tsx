import { notFound } from 'next/navigation';
import { getTenantBySlug } from '../../../lib/tenant';
import { getTenantBilling } from '../../../lib/school';
import DownloadPDFButton from './DownloadPDFButton';

type Props = {
  params: {
    tenant: string;
  };
};

export default async function BillingPage({ params }: Props) {
  const tenant = await getTenantBySlug(params.tenant);
  if (!tenant) {
    notFound();
  }

  const invoices = await getTenantBilling(params.tenant);
  const totalDue = invoices.reduce((sum, invoice) => sum + (invoice.status === 'unpaid' || invoice.status === 'pending' ? invoice.amount : 0), 0);

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-soft">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-sky-400">Billing module</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Invoices & payments</h1>
          <p className="mt-2 text-slate-400">Track tuition, services, and subscription invoices for {tenant.name}.</p>
        </div>
        <div className="rounded-3xl bg-slate-950/80 px-5 py-4 text-right">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Outstanding</p>
          <p className="mt-2 text-3xl font-semibold text-white">৳{totalDue.toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950">
        <table className="min-w-full divide-y divide-slate-800 text-sm text-left">
          <thead className="bg-slate-900 text-slate-400">
            <tr>
              <th className="px-6 py-4">Invoice</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Due date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b border-slate-800 last:border-none">
                <td className="px-6 py-4 text-slate-100">{invoice.label}</td>
                <td className="px-6 py-4 text-slate-300">৳{invoice.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-slate-300">{invoice.due}</td>
                <td className="px-6 py-4 text-slate-300">{invoice.status}</td>
                <td className="px-6 py-4 text-right">
                  <DownloadPDFButton invoice={invoice} tenant={tenant} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
