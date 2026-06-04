'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import TenantStatusButton from './TenantStatusButton';
import type { Tenant } from '../lib/tenant';

type Props = {
  initialTenants: Tenant[];
};

type TenantStatus = 'active' | 'pending' | 'suspended';

export default function SuperAdminTenantManagement({ initialTenants }: Props) {
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const filteredTenants = useMemo(
    () =>
      tenants.filter((tenant) =>
        [tenant.name, tenant.plan, tenant.city, tenant.description, tenant.status]
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase().trim()),
      ),
    [search, tenants],
  );

  const loadTenants = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/super-admin/tenants', { cache: 'no-store' });
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Unexpected API response: ${text.slice(0, 200)}`);
      }
      if (!response.ok) {
        throw new Error(data.error || 'Unable to load tenants.');
      }
      setTenants(data.tenants ?? []);
    } catch (error) {
      setError((error as Error).message || 'Failed to load tenants.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTenants();
  }, []);

  const handleStatusChanged = (slug: string, status: TenantStatus) => {
    setTenants((current) =>
      current.map((tenant) => (tenant.slug === slug ? { ...tenant, status } : tenant)),
    );
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-soft sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Tenant management</h2>
          <p className="mt-2 text-sm text-slate-400">View and moderate tenant accounts, status updates, and onboarding progress.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setRefreshing(true);
              loadTenants();
            }}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-900"
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
          >
            Add new tenant
          </Link>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex max-w-md flex-1 flex-col gap-2 text-sm text-slate-300">
          Search tenants
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, city, plan, or status"
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-sky-500 focus:outline-none"
          />
        </label>
      </div>

      {error ? <p className="mt-4 text-sm text-rose-400">{error}</p> : null}

      <div className="mt-8 space-y-4">
        {loading ? (
          <div className="space-y-4">
            <div className="h-28 rounded-3xl bg-slate-950/60" />
            <div className="h-28 rounded-3xl bg-slate-950/60" />
          </div>
        ) : filteredTenants.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 text-slate-400">No tenants found.</div>
        ) : (
          filteredTenants.map((tenant) => (
            <div key={tenant.slug} className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500">{tenant.plan}</p>
                  <h3 className="mt-2 text-xl font-semibold text-white truncate">{tenant.name}</h3>
                  <p className="mt-2 text-sm text-slate-400">{tenant.description}</p>
                </div>
                <TenantStatusButton
                  slug={tenant.slug}
                  currentStatus={tenant.status}
                  onStatusChange={(newStatus) => handleStatusChanged(tenant.slug, newStatus)}
                />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl bg-slate-900 p-3 text-sm text-slate-300">
                  <p className="text-slate-500">City</p>
                  <p className="mt-1 font-semibold text-white">{tenant.city}</p>
                </div>
                <div className="rounded-3xl bg-slate-900 p-3 text-sm text-slate-300">
                  <p className="text-slate-500">Students</p>
                  <p className="mt-1 font-semibold text-white">{tenant.students}</p>
                </div>
                <div className="rounded-3xl bg-slate-900 p-3 text-sm text-slate-300">
                  <p className="text-slate-500">Revenue</p>
                  <p className="mt-1 font-semibold text-white">${tenant.revenue.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link
                  href={`/${tenant.slug}`}
                  className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-sky-400 hover:text-white"
                >
                  Open dashboard
                </Link>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.32em] text-slate-400">{tenant.status}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
