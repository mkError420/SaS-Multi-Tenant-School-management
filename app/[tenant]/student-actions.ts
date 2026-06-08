'use server';

import { createTenantStudent, updateTenantStudent, deleteTenantStudent } from '../../lib/school';
import { revalidatePath } from 'next/cache';

export async function addStudentAction(tenantSlug: string, name: string, grade: string, status: string, enrolled: string, guardianName: string, guardianPhone: string, address: string) {
  const success = await createTenantStudent(tenantSlug, name, grade, status, enrolled, guardianName, guardianPhone, address);
  if (success) revalidatePath(`/${tenantSlug}`);
  return success ? { success: true } : { success: false, error: 'Failed to add student.' };
}

export async function editStudentAction(tenantSlug: string, id: string, name: string, grade: string, status: string, enrolled: string, guardianName: string, guardianPhone: string, address: string) {
  const success = await updateTenantStudent(tenantSlug, id, name, grade, status, enrolled, guardianName, guardianPhone, address);
  if (success) revalidatePath(`/${tenantSlug}`);
  return success ? { success: true } : { success: false, error: 'Failed to update student.' };
}

export async function removeStudentAction(tenantSlug: string, id: string) {
  const success = await deleteTenantStudent(tenantSlug, id);
  if (success) revalidatePath(`/${tenantSlug}`);
  return success ? { success: true } : { success: false, error: 'Failed to delete student.' };
}