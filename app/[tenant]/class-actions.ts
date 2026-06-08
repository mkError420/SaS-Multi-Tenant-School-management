'use server';

import { createTenantClass, updateTenantClass, deleteTenantClass } from '../../lib/school';
import { revalidatePath } from 'next/cache';

export async function addClassAction(tenantSlug: string, title: string, day: string, time: string, room: string, teacher: string) {
  const success = await createTenantClass(tenantSlug, title, day, time, room, teacher);
  if (success) revalidatePath(`/${tenantSlug}`);
  return success ? { success: true } : { success: false, error: 'Failed to add class.' };
}

export async function editClassAction(tenantSlug: string, id: string, title: string, day: string, time: string, room: string, teacher: string) {
  const success = await updateTenantClass(tenantSlug, id, title, day, time, room, teacher);
  if (success) revalidatePath(`/${tenantSlug}`);
  return success ? { success: true } : { success: false, error: 'Failed to update class.' };
}

export async function removeClassAction(tenantSlug: string, id: string) {
  const success = await deleteTenantClass(tenantSlug, id);
  if (success) revalidatePath(`/${tenantSlug}`);
  return success ? { success: true } : { success: false, error: 'Failed to delete class.' };
}