'use server';

import { updateTenantStatus, deleteTenant, renewTenantSubscription, updateTenantDetails } from '../../lib/tenant';
import { updatePlan, getTenantBilling, createTenantInvoice, updateTenantInvoice, deleteTenantInvoice } from '../../lib/school';
import { resetTenantAdminCredentials } from '../../lib/auth';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function setTenantStatus(slug: string, status: 'active' | 'pending' | 'suspended') {
  await updateTenantStatus(slug, status);
  revalidatePath('/super-admin');
}

export async function removeTenantAction(slug: string) {
  await deleteTenant(slug);
  revalidatePath('/super-admin');
}

export async function editTenantDetailsAction(slug: string, payload: { name: string; city: string; description: string; phone: string; authorityName: string; email: string; category: 'demo' | 'trusted' }) {
  await updateTenantDetails(slug, payload);
  revalidatePath('/super-admin');
}

export async function editPlanAction(id: string, price: number, name: string, limit: number, durationDays: number) {
  await updatePlan(id, price, name, limit, durationDays);
  revalidatePath('/super-admin');
  revalidatePath('/');
}

export async function renewTenantSubscriptionAction(slug: string) {
  await renewTenantSubscription(slug);
  revalidatePath('/super-admin');
}

export async function fetchInvoicesAction(slug: string) {
  // Pure data fetch server action
  return await getTenantBilling(slug);
}

export async function addInvoiceAction(slug: string, label: string, amount: number, due: string) {
  await createTenantInvoice(slug, label, amount, due);
  revalidatePath('/super-admin');
}

export async function updateInvoiceStatusAction(id: string, status: 'paid' | 'unpaid' | 'pending') {
  await updateTenantInvoice(id, status);
  revalidatePath('/super-admin');
}

export async function removeInvoiceAction(id: string) {
  await deleteTenantInvoice(id);
  revalidatePath('/super-admin');
}

export async function logoutAction() {
  cookies().delete('schoolspace_user');
  redirect('/login');
}

export async function resetCredentialsAction(slug: string, email: string, password: string) {
  await resetTenantAdminCredentials(slug, email, password);
  revalidatePath('/super-admin');
}