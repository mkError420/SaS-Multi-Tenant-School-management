'use server';

import { updateTenantStatus, deleteTenant } from '../../lib/tenant';
import { updatePlan } from '../../lib/school';
import { revalidatePath } from 'next/cache';

export async function setTenantStatus(slug: string, status: 'active' | 'pending' | 'suspended') {
  await updateTenantStatus(slug, status);
  revalidatePath('/super-admin');
}

export async function removeTenantAction(slug: string) {
  await deleteTenant(slug);
  revalidatePath('/super-admin');
}

export async function editPlanAction(id: string, price: number, name: string, limit: number) {
  await updatePlan(id, price, name, limit);
  revalidatePath('/super-admin');
  revalidatePath('/');
}