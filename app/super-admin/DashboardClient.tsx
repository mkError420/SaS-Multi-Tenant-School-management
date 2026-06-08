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
  removeInvoiceAction,
  editTenantDetailsAction,
  resetCredentialsAction
} from './actions';
import type { Tenant } from '../../lib/tenant';
import type { PlatformAnalytics, PlanPackage, BillingRecord } from '../../lib/school';
import Link from 'next/link';

export default function DashboardClient({
  tenants,
  analytics,
  plans,
  billingRecords = [],
}: {
  tenants: Tenant[];
  analytics: PlatformAnalytics;
  plans: PlanPackage[];
  billingRecords?: BillingRecord[];
}) {
  const [isPending, startTransition] = useTransition();
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [planForm, setPlanForm] = useState({ name: '', price: 0, studentLimit: 0, durationDays: 30, serverCost: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  
  const [invoiceModalTenant, setInvoiceModalTenant] = useState<Tenant | null>(null);
  const [invoices, setInvoices] = useState<BillingRecord[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [newInvoiceForm, setNewInvoiceForm] = useState({ label: '', amount: 0, due: '' });

  const [viewTenant, setViewTenant] = useState<Tenant | null>(null);
  const [editTenantModal, setEditTenantModal] = useState<Tenant | null>(null);
  const [tenantForm, setTenantForm] = useState<{ name: string; city: string; phone: string; authorityName: string; email: string; description: string; category: 'demo' | 'trusted' }>({ name: '', city: '', phone: '', authorityName: '', email: '', description: '', category: 'demo' });
  const [resetCredentialsModal, setResetCredentialsModal] = useState<Tenant | null>(null);
  const [credentialsForm, setCredentialsForm] = useState({ email: '', password: '' });

  const [revenueMonth, setRevenueMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [revenueYear, setRevenueYear] = useState(new Date().getFullYear().toString());

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

  const handleOpenEditTenant = (tenant: Tenant) => {
    setEditTenantModal(tenant);
    setTenantForm({
      name: tenant.name,
      city: tenant.city,
      phone: tenant.phone || '',
      authorityName: tenant.authorityName || '',
      email: tenant.email || '',
      description: tenant.description || '',
      category: tenant.category || 'demo',
    });
  };

  const handleSaveTenantDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTenantModal) return;
    startTransition(() => {
      editTenantDetailsAction(editTenantModal.slug, tenantForm).then(() => {
        setEditTenantModal(null);
      });
    });
  };

  const handleOpenResetCredentials = (tenant: Tenant) => {
    setResetCredentialsModal(tenant);
    setCredentialsForm({ email: '', password: '' });
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetCredentialsModal) return;
    startTransition(() => {
      resetCredentialsAction(resetCredentialsModal.slug, credentialsForm.email, credentialsForm.password).then(() => {
        setResetCredentialsModal(null);
      });
    });
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
    setPlanForm({ name: plan.name, price: plan.price, studentLimit: plan.studentLimit, durationDays: plan.durationDays || 30, serverCost: plan.serverCost || 0 });
  };

  const handleSavePlan = (id: string) => {
    startTransition(() => {
      editPlanAction(id, Number(planForm.price), planForm.name, Number(planForm.studentLimit), Number(planForm.durationDays), Number(planForm.serverCost));
      setEditingPlan(null);
    });
  };

  const filteredTenants = tenants.filter((tenant) =>
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const demoTenants = filteredTenants.filter(t => t.category === 'demo' || !t.category);
  const trustedTenants = filteredTenants.filter(t => t.category === 'trusted');

  const expiredTenants = tenants.filter(
    (t) => t.status === 'active' && t.subscriptionExpiresAt && new Date(t.subscriptionExpiresAt) < new Date()
  );

  const filteredRevenueRecords = (billingRecords || []).filter(b => {
    if (!b.due) return false;

    // Ensure the tenant still exists (exclude deleted tenants from the report)
    const tenantExists = tenants.some(t => t.slug === b.tenantSlug);
    if (!tenantExists) return false;

    const date = new Date(b.due);
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear().toString();
    return m === revenueMonth && y === revenueYear;
  });

  const totalCollected = filteredRevenueRecords.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.amount, 0);
  const totalExpected = filteredRevenueRecords.reduce((sum, b) => sum + b.amount, 0);

  const handlePrintRevenue = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to print the report.');
      return;
    }

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = monthNames[parseInt(revenueMonth) - 1];

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Revenue Report - ${monthName} ${revenueYear}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; }
            .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 20px; text-align: center; }
            .title { font-size: 24px; font-weight: bold; color: #0ea5e9; margin: 0; }
            .subtitle { color: #64748b; font-size: 14px; margin-top: 5px; }
            .table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            .table th, .table td { border-bottom: 1px solid #e2e8f0; padding: 10px; text-align: left; font-size: 14px; }
            .table th { background-color: #f8fafc; font-weight: 600; color: #475569; }
            .table tr:nth-child(even) { background-color: #f8fafc; }
            .summary { margin-top: 30px; text-align: right; font-size: 16px; color: #0f172a; }
            .summary strong { color: #10b981; font-size: 20px; }
            @media print { body { padding: 0; } @page { margin: 1cm; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">MONTHLY REVENUE REPORT</h1>
            <p class="subtitle">Period: ${monthName} ${revenueYear}</p>
          </div>
          <table class="table">
            <thead>
              <tr><th>Tenant (School)</th><th>Description</th><th>Due Date</th><th>Status</th><th style="text-align: right;">Amount</th></tr>
            </thead>
            <tbody>
              ${filteredRevenueRecords.map(b => `
                <tr>
                  <td>${b.tenantSlug || 'N/A'}</td>
                  <td>${b.label}</td>
                  <td>${b.due}</td>
                  <td style="color: ${b.status === 'paid' ? '#10b981' : (b.status === 'pending' ? '#f59e0b' : '#ef4444')}; text-transform: uppercase; font-size: 12px; font-weight: bold;">${b.status}</td>
                  <td style="text-align: right;">&#2547;${b.amount.toLocaleString()}</td>
                </tr>
              `).join('')}
              ${filteredRevenueRecords.length === 0 ? '<tr><td colSpan="5" style="text-align: center; color: #94a3b8;">No records found for this period.</td></tr>' : ''}
            </tbody>
          </table>
          <div class="summary">
            <p>Total Billed: &#2547;${totalExpected.toLocaleString()}</p>
            <p><strong>Total Collected: &#2547;${totalCollected.toLocaleString()}</strong></p>
          </div>
          <script>window.onload = () => { setTimeout(() => { window.print(); }, 300); }</script>
        </body>
      </html>
    `;
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handleDownloadTenantsCSV = () => {
    const headers = ['School Name', 'Slug', 'City', 'Plan', 'Status', 'Students', 'Revenue', 'Activation Date', 'Expiry Date'];
    const rows = filteredTenants.map(t => [
      `"${t.name}"`,
      `"${t.slug}"`,
      `"${t.city}"`,
      `"${t.plan}"`,
      `"${t.status}"`,
      t.students,
      t.revenue,
      t.activationDate ? `"${new Date(t.activationDate).toLocaleDateString()}"` : '"N/A"',
      t.subscriptionExpiresAt ? `"${new Date(t.subscriptionExpiresAt).toLocaleDateString()}"` : '"N/A"'
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `tenants_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintTenantsPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to print the report.');
      return;
    }
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Tenants Report</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; max-width: 1000px; margin: 0 auto; }
            .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 20px; text-align: center; }
            .title { font-size: 24px; font-weight: bold; color: #0ea5e9; margin: 0; }
            .subtitle { color: #64748b; font-size: 14px; margin-top: 5px; }
            .table { border-collapse: collapse; width: 100%; margin-top: 20px; font-size: 12px; }
            .table th, .table td { border-bottom: 1px solid #e2e8f0; padding: 8px; text-align: left; }
            .table th { background-color: #f8fafc; font-weight: 600; color: #475569; }
            .table tr:nth-child(even) { background-color: #f8fafc; }
            @media print { body { padding: 0; } @page { margin: 1cm; size: landscape; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">TENANTS REPORT</h1>
            <p class="subtitle">Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
          <table class="table">
            <thead><tr><th>School Name</th><th>Slug</th><th>City</th><th>Plan</th><th>Students</th><th>Revenue</th><th>Status</th></tr></thead>
            <tbody>
              ${filteredTenants.map(t => `<tr><td><strong>${t.name}</strong></td><td>${t.slug}</td><td>${t.city}</td><td>${t.plan}</td><td>${t.students}</td><td>&#2547;${t.revenue.toLocaleString()}</td><td style="text-transform: uppercase; font-weight: bold; color: ${t.status === 'active' ? '#10b981' : (t.status === 'pending' ? '#f59e0b' : '#ef4444')};">${t.status}</td></tr>`).join('')}
              ${filteredTenants.length === 0 ? '<tr><td colSpan="7" style="text-align: center; color: #94a3b8;">No tenants found.</td></tr>' : ''}
            </tbody>
          </table>
          <script>window.onload = () => { setTimeout(() => { window.print(); }, 300); }</script>
        </body>
      </html>
    `;
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="space-y-12">
      {/* Analytics Overview */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col justify-between col-span-full sm:col-span-2 lg:col-span-1">
          <div>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-slate-400">Monthly Revenue</p>
              <div className="flex gap-1">
                <select value={revenueMonth} onChange={e => setRevenueMonth(e.target.value)} className="bg-slate-950 text-xs border border-slate-700 rounded px-1 py-0.5 text-slate-300 focus:border-sky-500 focus:outline-none">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <option key={i} value={(i + 1).toString().padStart(2, '0')}>{(i + 1).toString().padStart(2, '0')}</option>
                  ))}
                </select>
                <select value={revenueYear} onChange={e => setRevenueYear(e.target.value)} className="bg-slate-950 text-xs border border-slate-700 rounded px-1 py-0.5 text-slate-300 focus:border-sky-500 focus:outline-none">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <option key={i} value={(new Date().getFullYear() - 1 + i).toString()}>{(new Date().getFullYear() - 1 + i).toString()}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="mt-2 text-3xl font-semibold text-emerald-400">৳{totalCollected.toLocaleString()}</p>
            <p className="mt-1 text-xs text-slate-500">Billed: ৳{totalExpected.toLocaleString()}</p>
          </div>
          <button onClick={handlePrintRevenue} className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-sky-400 hover:text-sky-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            Print Report
          </button>
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
          <div className="flex flex-wrap items-center gap-4">
            <h2 className="text-xl font-semibold text-white">Tenant Management</h2>
            <div className="flex items-center gap-2">
              <button onClick={handleDownloadTenantsCSV} className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-sky-400 transition hover:bg-slate-700">Export CSV</button>
              <button onClick={handlePrintTenantsPDF} className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-sky-400 transition hover:bg-slate-700">Print PDF</button>
            </div>
          </div>
          <input
            type="text"
            placeholder="Search tenants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
          />
        </div>
        
        {[
          { title: 'Trusted Organizations', data: trustedTenants },
          { title: 'Demo Schools', data: demoTenants }
        ].map((section) => (
          <div key={section.title} className="mt-8 border-t border-slate-800 pt-6 first:border-0 first:pt-0">
            <h3 className="mb-4 text-lg font-semibold text-white">{section.title} ({section.data.length})</h3>
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
                  {section.data.map((tenant) => (
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
                      <td className="py-4 text-right space-x-3 whitespace-nowrap">
                        <button onClick={() => setViewTenant(tenant)} className="text-slate-400 transition hover:text-white" title="View Details">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="inline-block h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                        </button>
                        <button onClick={() => handleOpenEditTenant(tenant)} disabled={isPending} className="text-sky-400 transition hover:text-sky-300 disabled:opacity-50" title="Edit Tenant">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="inline-block h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                        </button>
                        {section.title !== 'Demo Schools' && (
                          <button onClick={() => handleOpenResetCredentials(tenant)} disabled={isPending} className="text-amber-400 transition hover:text-amber-300 disabled:opacity-50" title="Reset Admin Credentials">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="inline-block h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
                          </button>
                        )}
                        <Link href={`/${tenant.slug}`} className="text-indigo-400 transition hover:text-indigo-300">Portal</Link>
                        <button onClick={() => handleOpenInvoices(tenant)} disabled={isPending} className="text-sky-400 transition hover:text-sky-300 disabled:opacity-50">Invoices</button>
                        <button onClick={() => handleRenew(tenant.slug)} disabled={isPending} className="text-emerald-400 transition hover:text-emerald-300 disabled:opacity-50">Renew</button>
                        <button onClick={() => handleDelete(tenant.slug)} disabled={isPending} className="text-red-400 transition hover:text-red-300 disabled:opacity-50">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {section.data.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-4 text-center text-slate-500">No {section.title.toLowerCase()} found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </section>

      {/* Plans Management */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
        <h2 className="mb-6 text-xl font-semibold text-white">Subscription Plans</h2>
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-900 text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Package Name</th>
                <th className="px-4 py-3 font-medium">Server & Installation Cost</th>
                <th className="px-4 py-3 font-medium">Monthly Subscription</th>
                <th className="px-4 py-3 font-medium">Student Limit</th>
                <th className="px-4 py-3 font-medium">Duration</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {plans.map((plan) => (
                <tr key={plan.id} className="transition hover:bg-slate-900/50">
                  {editingPlan === plan.id ? (
                    <>
                      <td className="px-4 py-3"><input type="text" value={planForm.name} onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })} className="w-full min-w-[120px] rounded-lg border border-slate-600 bg-slate-900 px-3 py-1 text-sm text-white focus:border-sky-500 focus:outline-none" placeholder="Package Name" /></td>
                      <td className="px-4 py-3"><input type="number" value={planForm.serverCost} onChange={(e) => setPlanForm({ ...planForm, serverCost: e.target.valueAsNumber })} className="w-full min-w-[100px] rounded-lg border border-slate-600 bg-slate-900 px-3 py-1 text-sm text-white focus:border-sky-500 focus:outline-none" placeholder="Server Cost" /></td>
                      <td className="px-4 py-3"><input type="number" value={planForm.price} onChange={(e) => setPlanForm({ ...planForm, price: e.target.valueAsNumber })} className="w-full min-w-[100px] rounded-lg border border-slate-600 bg-slate-900 px-3 py-1 text-sm text-white focus:border-sky-500 focus:outline-none" placeholder="Monthly Sub" /></td>
                      <td className="px-4 py-3"><input type="number" value={planForm.studentLimit} onChange={(e) => setPlanForm({ ...planForm, studentLimit: e.target.valueAsNumber })} className="w-full min-w-[100px] rounded-lg border border-slate-600 bg-slate-900 px-3 py-1 text-sm text-white focus:border-sky-500 focus:outline-none" placeholder="Student Limit" /></td>
                      <td className="px-4 py-3"><input type="number" value={planForm.durationDays} onChange={(e) => setPlanForm({ ...planForm, durationDays: e.target.valueAsNumber })} className="w-full min-w-[100px] rounded-lg border border-slate-600 bg-slate-900 px-3 py-1 text-sm text-white focus:border-sky-500 focus:outline-none" placeholder="Duration (Days)" /></td>
                      <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                        <button onClick={() => handleSavePlan(plan.id)} disabled={isPending} className="rounded-lg bg-sky-500 px-3 py-1 text-sm font-semibold text-slate-950 hover:bg-sky-400 disabled:opacity-50">Save</button>
                        <button onClick={() => setEditingPlan(null)} disabled={isPending} className="rounded-lg border border-slate-600 px-3 py-1 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50">Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 font-semibold text-white">{plan.name}</td>
                      <td className="px-4 py-3">৳{plan.serverCost || 0}</td>
                      <td className="px-4 py-3">৳{plan.price}</td>
                      <td className="px-4 py-3">{plan.studentLimit}</td>
                      <td className="px-4 py-3">{plan.durationDays || 30} Days</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => handleEditPlan(plan)} className="text-sky-400 hover:text-sky-300">Edit</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
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

      {/* Tenant Details Modal */}
      {viewTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-soft">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">Tenant Details</h2>
                <p className="mt-1 text-sm text-slate-400">{viewTenant.name}</p>
              </div>
              <button onClick={() => setViewTenant(null)} className="rounded-full bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white">✕</button>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">School Name</p>
                <p className="mt-1 text-sm text-white">{viewTenant.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tenant Slug</p>
                <p className="mt-1 text-sm text-white">{viewTenant.slug}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Authority Name</p>
                <p className="mt-1 text-sm text-white">{viewTenant.authorityName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">School Email</p>
                <p className="mt-1 text-sm text-white">{viewTenant.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Category</p>
                <p className="mt-1 text-sm text-white capitalize">{viewTenant.category || 'demo'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Phone Number</p>
                <p className="mt-1 text-sm text-white">{viewTenant.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">City</p>
                <p className="mt-1 text-sm text-white">{viewTenant.city}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status</p>
                <p className={`mt-1 text-sm font-semibold uppercase tracking-wider ${viewTenant.status === 'active' ? 'text-emerald-400' : viewTenant.status === 'pending' ? 'text-amber-400' : 'text-rose-400'}`}>{viewTenant.status}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Subscription Plan</p>
                <p className="mt-1 text-sm text-white">{viewTenant.plan}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Revenue</p>
                <p className="mt-1 text-sm text-white">৳{viewTenant.revenue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Students</p>
                <p className="mt-1 text-sm text-white">{viewTenant.students}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Teachers</p>
                <p className="mt-1 text-sm text-white">{viewTenant.teachers}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Activation Date</p>
                <p className="mt-1 text-sm text-white">{viewTenant.activationDate ? new Date(viewTenant.activationDate).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Expiry Date</p>
                <p className="mt-1 text-sm text-white">{viewTenant.subscriptionExpiresAt ? new Date(viewTenant.subscriptionExpiresAt).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div className="col-span-full">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Description</p>
                <p className="mt-1 text-sm text-slate-300">{viewTenant.description || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Tenant Modal */}
      {editTenantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-soft">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">Edit Tenant</h2>
                <p className="mt-1 text-sm text-slate-400">Update details for {editTenantModal.name}</p>
              </div>
              <button onClick={() => setEditTenantModal(null)} className="rounded-full bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSaveTenantDetails} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-200">School Name</span>
                  <input required type="text" value={tenantForm.name} onChange={(e) => setTenantForm({ ...tenantForm, name: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-sky-500 focus:outline-none" />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-200">City</span>
                  <input required type="text" value={tenantForm.city} onChange={(e) => setTenantForm({ ...tenantForm, city: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-sky-500 focus:outline-none" />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-200">Authority Name</span>
                  <input required type="text" value={tenantForm.authorityName} onChange={(e) => setTenantForm({ ...tenantForm, authorityName: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-sky-500 focus:outline-none" />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-200">Phone Number</span>
                  <input required type="text" value={tenantForm.phone} onChange={(e) => setTenantForm({ ...tenantForm, phone: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-sky-500 focus:outline-none" />
                </label>
              </div>
              <label className="block">
                <span className="text-sm font-semibold text-slate-200">School Email</span>
                <input required type="email" value={tenantForm.email} onChange={(e) => setTenantForm({ ...tenantForm, email: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-sky-500 focus:outline-none" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-200">Category</span>
                <select required value={tenantForm.category} onChange={(e) => setTenantForm({ ...tenantForm, category: e.target.value as 'demo' | 'trusted' })} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-sky-500 focus:outline-none">
                  <option value="demo">Demo School</option>
                  <option value="trusted">Trusted Organization</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-200">Description</span>
                <textarea required rows={3} value={tenantForm.description} onChange={(e) => setTenantForm({ ...tenantForm, description: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-sky-500 focus:outline-none" />
              </label>
              <div className="pt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setEditTenantModal(null)} disabled={isPending} className="rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-900 disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={isPending} className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-sky-400 disabled:opacity-50">{isPending ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Credentials Modal */}
      {resetCredentialsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-soft">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Reset Credentials</h2>
                <p className="mt-1 text-sm text-slate-400">Update admin login for {resetCredentialsModal.name}</p>
              </div>
              <button onClick={() => setResetCredentialsModal(null)} className="rounded-full bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSaveCredentials} className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-200">New Admin Email</span>
                <input required type="email" value={credentialsForm.email} onChange={(e) => setCredentialsForm({ ...credentialsForm, email: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-sky-500 focus:outline-none" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-200">New Admin Password</span>
                <input required type="password" value={credentialsForm.password} onChange={(e) => setCredentialsForm({ ...credentialsForm, password: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-sky-500 focus:outline-none" />
              </label>
              <div className="pt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setResetCredentialsModal(null)} disabled={isPending} className="rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-900 disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={isPending} className="rounded-2xl bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-50">{isPending ? 'Saving...' : 'Save Credentials'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}