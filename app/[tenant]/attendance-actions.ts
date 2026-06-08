'use server';

import { createTenantAttendance, updateTenantAttendance, deleteTenantAttendance } from '../../lib/school';
import { revalidatePath } from 'next/cache';

export async function addAttendanceAction(tenantSlug: string, studentId: string, studentName: string, date: string, status: string) {
  const success = await createTenantAttendance(tenantSlug, studentId, studentName, date, status);
  if (success) revalidatePath(`/${tenantSlug}`);
  return success ? { success: true } : { success: false, error: 'Failed to record attendance.' };
}

export async function editAttendanceAction(tenantSlug: string, id: string, studentId: string, studentName: string, date: string, status: string) {
  const success = await updateTenantAttendance(tenantSlug, id, studentId, studentName, date, status);
  if (success) revalidatePath(`/${tenantSlug}`);
  return success ? { success: true } : { success: false, error: 'Failed to update attendance.' };
}

export async function removeAttendanceAction(tenantSlug: string, id: string) {
  const success = await deleteTenantAttendance(tenantSlug, id);
  if (success) revalidatePath(`/${tenantSlug}`);
  return success ? { success: true } : { success: false, error: 'Failed to delete attendance.' };
}