'use server';

import { createTenantTeacher, updateTenantTeacher, deleteTenantTeacher } from '../../lib/school';
import { revalidatePath } from 'next/cache';

export async function addTeacherAction(tenantSlug: string, name: string, subject: string, email: string, status: string) {
  const success = await createTenantTeacher(tenantSlug, name, subject, email, status);
  if (success) revalidatePath(`/${tenantSlug}`);
  return success ? { success: true } : { success: false, error: 'Failed to add teacher.' };
}

export async function editTeacherAction(tenantSlug: string, id: string, name: string, subject: string, email: string, status: string) {
  const success = await updateTenantTeacher(tenantSlug, id, name, subject, email, status);
  if (success) revalidatePath(`/${tenantSlug}`);
  return success ? { success: true } : { success: false, error: 'Failed to update teacher.' };
}

export async function removeTeacherAction(tenantSlug: string, id: string) {
  const success = await deleteTenantTeacher(tenantSlug, id);
  if (success) revalidatePath(`/${tenantSlug}`);
  return success ? { success: true } : { success: false, error: 'Failed to delete teacher.' };
}