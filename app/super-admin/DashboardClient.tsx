'use client';

import { useState, useTransition } from 'react';
import { setTenantStatus, removeTenantAction, editPlanAction } from './actions';
import type { Tenant } from '../../lib/tenant';
import type { PlatformAnalytics, PlanPackage } from '../../lib/school';

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

      {/* Tenants Table */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
        <h2 className="mb-6 text-xl font-semibold text-white">Tenant Management</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-slate-800 text-slate-400">
              <tr>
                <th className="pb-3 font-medium">School Name</th>
                <th className="pb-3 font-medium">Plan</th>
                <th className="pb-3 font-medium">Students</th>
                <th className="pb-3 font-medium">Revenue</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {tenants.map((tenant) => (
                <tr key={tenant.id} className="transition hover:bg-slate-800/20">
                  <td className="py-4 font-medium text-white">{tenant.name}<br /><span className="text-xs font-normal text-slate-500">{tenant.slug}</span></td>
                  <td className="py-4">{tenant.plan}</td>
                  <td className="py-4">{tenant.students}</td>
                  <td className="py-4">৳{tenant.revenue.toLocaleString()}</td>
                  <td className="py-4">
                    <select
                      value={tenant.status}
                      onChange={(e) => handleStatusChange(tenant.slug, e.target.value as any)}
                      disabled={isPending}
                      className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-white focus:border-sky-500 focus:outline-none disabled:opacity-50"
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </td>
                  <td className="py-4 text-right">
                    <button onClick={() => handleDelete(tenant.slug)} disabled={isPending} className="text-red-400 transition hover:text-red-300 disabled:opacity-50">Delete</button>
                  </td>
                </tr>
              ))}
              {tenants.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-slate-500">No tenants found.</td>
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
    </div>
  );
}