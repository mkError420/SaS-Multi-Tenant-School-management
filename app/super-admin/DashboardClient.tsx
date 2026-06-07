'use client';

import { useState, useTransition } from 'react';
import { 
  setTenantStatus, 
  removeTenantAction, 
  editPlanAction, 
  renewTenantSubscriptionAction,
  fetchInvoicesAction,
  addInvoiceAction,
  updateInvoiceStatusAction,
  removeInvoiceAction
} from './actions';
import type { Tenant } from '../../lib/tenant';
import type { PlatformAnalytics, PlanPackage, BillingRecord } from '../../lib/school';

export default function DashboardClient({
  tenants,
  analytics,
  plans,
}: {
  tenants: Tenant[];
  analytics: PlatformAnalytics;
  plans: PlanPackage[];
}) {
  const [isPending, startTransition] = useTransition();
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [planForm, setPlanForm] = useState({ name: '', price: 0, studentLimit: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  
  const [invoiceModalTenant, setInvoiceModalTenant] = useState<Tenant | null>(null);
  const [invoices, setInvoices] = useState<BillingRecord[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [newInvoiceForm, setNewInvoiceForm] = useState({ label: '', amount: 0, due: '' });

  const handleStatusChange = (slug: string, status: 'active' | 'pending' | 'suspended') => {
    startTransition(() => {
      setTenantStatus(slug, status);
    });
  };

  const handleDelete = (slug: string) => {
    if (confirm('Are you sure you want to delete this tenant? This action cannot be undone.')) {
      startTransition(() => {
        removeTenantAction(slug);
      });
    }
  };

  const handleRenew = (slug: string) => {
    if (confirm('Renew subscription for another 30 days and generate a new invoice?')) {
      startTransition(() => {
        renewTenantSubscriptionAction(slug);
      });
    }
  };

  const handleOpenInvoices = async (tenant: Tenant) => {
    setInvoiceModalTenant(tenant);
    setLoadingInvoices(true);
    const data = await fetchInvoicesAction(tenant.slug);
    setInvoices(data);
    setLoadingInvoices(false);
  };

  const handleAddInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceModalTenant) return;
    startTransition(async () => {
      await addInvoiceAction(invoiceModalTenant.slug, newInvoiceForm.label, newInvoiceForm.amount, newInvoiceForm.due);
      setNewInvoiceForm({ label: '', amount: 0, due: '' });
      const data = await fetchInvoicesAction(invoiceModalTenant.slug);
      setInvoices(data);
    });
  };

  const handleUpdateInvoice = async (id: string, status: 'paid' | 'unpaid' | 'pending') => {
    startTransition(async () => {
      await updateInvoiceStatusAction(id, status);
      if (invoiceModalTenant) {
        const data = await fetchInvoicesAction(invoiceModalTenant.slug);
        setInvoices(data);
      }
    });
  };

  const handleDeleteInvoice = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;
    startTransition(async () => {
      await removeInvoiceAction(id);
      if (invoiceModalTenant) {
        const data = await fetchInvoicesAction(invoiceModalTenant.slug);
        setInvoices(data);
      }
    });
  };

  const handleDownloadInvoicePDF = (inv: BillingRecord) => {
    if (!invoiceModalTenant) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to download the PDF.');
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice_${inv.id}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
            .title { font-size: 28px; font-weight: bold; color: #0ea5e9; margin: 0; }
            .info { margin-top: 40px; display: flex; justify-content: space-between; }
            .info-box { width: 45%; }
            .table { margin-top: 40px; border-collapse: collapse; width: 100%; }
            .table th, .table td { border-bottom: 1px solid #e2e8f0; padding: 12px; text-align: left; }
            .table th { background-color: #f8fafc; font-weight: 600; color: #475569; }
            .total { text-align: right; margin-top: 20px; font-size: 20px; font-weight: bold; color: #0f172a; }
            .footer { margin-top: 80px; text-align: center; font-size: 12px; color: #64748b; }
            @media print {
              body { padding: 0; }
              @page { margin: 1cm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="title">INVOICE</h1>
              <p style="margin-top: 5px; color: #64748b; font-size: 14px;">#INV-${inv.id.substring(0, 8).toUpperCase()}</p>
            </div>
            <div style="text-align: right; font-size: 14px; line-height: 1.5;">
              <strong>Zass SaaS Platform</strong><br>
              support@zass.com<br>
              Super Admin Dashboard
            </div>
          </div>
          
          <div class="info">
            <div class="info-box" style="font-size: 14px; line-height: 1.6;">
              <p style="color: #64748b; font-size: 12px; margin-bottom: 4px; text-transform: uppercase; font-weight: bold;">Billed To:</p>
              <strong style="font-size: 16px; color: #0f172a;">${invoiceModalTenant.name}</strong><br>
              ${invoiceModalTenant.city}<br>
              ${invoiceModalTenant.authorityName || ''}<br>
              ${invoiceModalTenant.phone || ''}
            </div>
            <div class="info-box" style="text-align: right; font-size: 14px;">
              <p style="margin: 0 0 8px 0;"><strong>Issue Date:</strong> ${new Date().toLocaleDateString()}</p>
              <p style="margin: 0 0 8px 0;"><strong>Due Date:</strong> ${inv.due}</p>
              <p style="margin: 0 0 8px 0;"><strong>Status:</strong> <span style="text-transform: uppercase; font-weight: bold; color: ${inv.status === 'paid' ? '#10b981' : '#ef4444'};">${inv.status}</span></p>
            </div>
          </div>
          <table class="table">
            <thead><tr><th>Description</th><th style="text-align: right;">Amount</th></tr></thead>
            <tbody><tr><td>${inv.label}</td><td style="text-align: right;">&#2547;${inv.amount.toLocaleString()}</td></tr></tbody>
          </table>
          <div class="total">Total Due: &#2547;${inv.amount.toLocaleString()}</div>
          <div class="footer">Thank you for your business. Please process the payment by the due date.</div>
          <script>
            window.onload = () => { 
              setTimeout(() => { window.print(); }, 300);
            }
          </script>
        </body>
      </html>
    `;
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handleEditPlan = (plan: PlanPackage) => {
    setEditingPlan(plan.id);
    setPlanForm({ name: plan.name, price: plan.price, studentLimit: plan.studentLimit });
  };

  const handleSavePlan = (id: string) => {
    startTransition(() => {
      editPlanAction(id, Number(planForm.price), planForm.name, Number(planForm.studentLimit));
      setEditingPlan(null);
    });
  };

  const filteredTenants = tenants.filter((tenant) =>
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const expiredTenants = tenants.filter(
    (t) => t.status === 'active' && t.subscriptionExpiresAt && new Date(t.subscriptionExpiresAt) < new Date()
  );

  return (
    <div className="space-y-12">
      {/* Analytics Overview */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="text-sm font-medium text-slate-400">Total Revenue</p>
          <p className="mt-2 text-3xl font-semibold text-white">৳{analytics.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="text-sm font-medium text-slate-400">Active Schools</p>
          <p className="mt-2 text-3xl font-semibold text-white">{analytics.activeSchools}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="text-sm font-medium text-slate-400">Total Students</p>
          <p className="mt-2 text-3xl font-semibold text-white">{analytics.totalStudents}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="text-sm font-medium text-slate-400">Pending Schools</p>
          <p className="mt-2 text-3xl font-semibold text-amber-400">{analytics.pendingSchools}</p>
        </div>
      </section>

      {/* Notifications Section */}
      {expiredTenants.length > 0 && (
        <section className="rounded-3xl border border-red-900/50 bg-red-900/20 p-6">
          <h2 className="text-lg font-semibold text-red-400">Notifications</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-red-200">
            {expiredTenants.map((t) => (
              <li key={t.id}>
                <strong>{t.name}</strong> ({t.slug}) - Subscription expired on {new Date(t.subscriptionExpiresAt!).toLocaleDateString()}.
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Tenants Table */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-xl font-semibold text-white">Tenant Management</h2>
          <input
            type="text"
            placeholder="Search tenants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-slate-800 text-slate-400">
              <tr>
                <th className="pb-3 font-medium">School Name</th>
                <th className="pb-3 font-medium">Plan</th>
                <th className="pb-3 font-medium">Students</th>
                <th className="pb-3 font-medium">Revenue</th>
                <th className="pb-3 font-medium">Dates</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredTenants.map((tenant) => (
                <tr key={tenant.id} className="transition hover:bg-slate-800/20">
                  <td className="py-4 font-medium text-white">{tenant.name}<br /><span className="text-xs font-normal text-slate-500">{tenant.slug}</span></td>
                  <td className="py-4">{tenant.plan}</td>
                  <td className="py-4">{tenant.students}</td>
                  <td className="py-4">৳{tenant.revenue.toLocaleString()}</td>
                  <td className="py-4">
                    {tenant.activationDate ? (
                      <div className="text-xs">
                        <p>Active: {new Date(tenant.activationDate).toLocaleDateString()}</p>
                        <p className={tenant.subscriptionExpiresAt && new Date(tenant.subscriptionExpiresAt) < new Date() ? 'font-semibold text-red-400' : 'text-slate-400'}>
                          Expires: {tenant.subscriptionExpiresAt ? new Date(tenant.subscriptionExpiresAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500">Not activated</span>
                    )}
                  </td>
                  <td className="py-4">
                    <select
                      value={tenant.status}
                      onChange={(e) => handleStatusChange(tenant.slug, e.target.value as 'active' | 'pending' | 'suspended')}
                      disabled={isPending}
                      className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-white focus:border-sky-500 focus:outline-none disabled:opacity-50"
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </td>
                  <td className="py-4 text-right space-x-3">
                    <button onClick={() => handleOpenInvoices(tenant)} disabled={isPending} className="text-sky-400 transition hover:text-sky-300 disabled:opacity-50">Invoices</button>
                    <button onClick={() => handleRenew(tenant.slug)} disabled={isPending} className="text-emerald-400 transition hover:text-emerald-300 disabled:opacity-50">Renew</button>
                    <button onClick={() => handleDelete(tenant.slug)} disabled={isPending} className="text-red-400 transition hover:text-red-300 disabled:opacity-50">Delete</button>
                  </td>
                </tr>
              ))}
              {filteredTenants.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-4 text-center text-slate-500">No tenants found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Plans Management */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
        <h2 className="mb-6 text-xl font-semibold text-white">Subscription Plans</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.id} className="rounded-2xl border border-slate-700 bg-slate-800/30 p-5">
              {editingPlan === plan.id ? (
                <div className="space-y-3">
                  <input type="text" value={planForm.name} onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })} className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none" placeholder="Plan Name" />
                  <input type="number" value={planForm.price} onChange={(e) => setPlanForm({ ...planForm, price: e.target.valueAsNumber })} className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none" placeholder="Price" />
                  <input type="number" value={planForm.studentLimit} onChange={(e) => setPlanForm({ ...planForm, studentLimit: e.target.valueAsNumber })} className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none" placeholder="Student Limit" />
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => handleSavePlan(plan.id)} disabled={isPending} className="flex-1 rounded-lg bg-sky-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400 disabled:opacity-50">Save</button>
                    <button onClick={() => setEditingPlan(null)} disabled={isPending} className="flex-1 rounded-lg border border-slate-600 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                    <button onClick={() => handleEditPlan(plan)} className="text-xs text-sky-400 hover:text-sky-300">Edit</button>
                  </div>
                  <p className="mb-2 text-2xl font-bold text-white">৳{plan.price}</p>
                  <p className="mb-1 text-sm text-slate-400">Max Students: <span className="text-slate-200">{plan.studentLimit}</span></p>
                  <p className="text-xs text-slate-500">{plan.description}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Invoice Modal */}
      {invoiceModalTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-soft">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">Invoices: {invoiceModalTenant.name}</h2>
                <p className="mt-1 text-sm text-slate-400">Manage billing records and generate new custom invoices.</p>
              </div>
              <button onClick={() => setInvoiceModalTenant(null)} className="rounded-full bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white">✕</button>
            </div>

            {/* Add Invoice Form */}
            <form onSubmit={handleAddInvoice} className="mb-8 flex flex-wrap items-end gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <label className="min-w-[200px] flex-1">
                <span className="text-xs font-semibold text-slate-300">Invoice Label</span>
                <input type="text" required value={newInvoiceForm.label} onChange={e => setNewInvoiceForm({...newInvoiceForm, label: e.target.value})} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none" placeholder="e.g. Activity Fee" />
              </label>
              <label className="w-full sm:w-32">
                <span className="text-xs font-semibold text-slate-300">Amount (৳)</span>
                <input type="number" required value={newInvoiceForm.amount} onChange={e => setNewInvoiceForm({...newInvoiceForm, amount: e.target.valueAsNumber || 0})} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none" placeholder="0" />
              </label>
              <label className="w-full sm:w-40">
                <span className="text-xs font-semibold text-slate-300">Due Date</span>
                <input type="date" required value={newInvoiceForm.due} onChange={e => setNewInvoiceForm({...newInvoiceForm, due: e.target.value})} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none" />
              </label>
              <button type="submit" disabled={isPending} className="w-full rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400 disabled:opacity-50 sm:w-auto">Generate</button>
            </form>

            {/* Invoices List */}
            {loadingInvoices ? (
              <p className="py-10 text-center text-slate-400">Loading invoices...</p>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="border-b border-slate-800 bg-slate-900 text-slate-400">
                    <tr>
                      <th className="px-4 py-3 font-medium">Label</th>
                      <th className="px-4 py-3 font-medium">Amount</th>
                      <th className="px-4 py-3 font-medium">Due Date</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="transition hover:bg-slate-900/50">
                        <td className="px-4 py-3 text-white">{inv.label}</td>
                        <td className="px-4 py-3">৳{inv.amount.toLocaleString()}</td>
                        <td className="px-4 py-3">{inv.due}</td>
                        <td className="px-4 py-3">
                          <select
                            value={inv.status}
                            onChange={(e) => handleUpdateInvoice(inv.id, e.target.value as 'paid' | 'unpaid' | 'pending')}
                            disabled={isPending}
                            className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-white focus:border-sky-500 focus:outline-none disabled:opacity-50"
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="unpaid">Unpaid</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => handleDownloadInvoicePDF(inv)} disabled={isPending} className="mr-3 text-xs font-medium text-emerald-400 hover:text-emerald-300 disabled:opacity-50">Download PDF</button>
                          <button onClick={() => handleDeleteInvoice(inv.id)} disabled={isPending} className="text-xs font-medium text-red-400 hover:text-red-300 disabled:opacity-50">Delete</button>
                        </td>
                      </tr>
                    ))}
                    {invoices.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-500">No invoices generated yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}