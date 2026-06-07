'use server';

import { createTenantStudent, updateTenantStudent, deleteTenantStudent } from '../../../lib/school';
import { revalidatePath } from 'next/cache';

export async function addStudentAction(tenantSlug: string, name: string, grade: string, status: string, enrolled: string, guardianName: string, guardianPhone: string, address: string) {
  await createTenantStudent(tenantSlug, name, grade, status, enrolled, guardianName, guardianPhone, address);
  revalidatePath(`/${tenantSlug}`);
  revalidatePath(`/${tenantSlug}/students`);
}

export async function updateStudentAction(tenantSlug: string, id: string, name: string, grade: string, status: string, enrolled: string, guardianName: string, guardianPhone: string, address: string) {
  await updateTenantStudent(tenantSlug, id, name, grade, status, enrolled, guardianName, guardianPhone, address);
  revalidatePath(`/${tenantSlug}`);
  revalidatePath(`/${tenantSlug}/students`);
}

export async function deleteStudentAction(tenantSlug: string, id: string) {
  await deleteTenantStudent(tenantSlug, id);
  revalidatePath(`/${tenantSlug}`);
  revalidatePath(`/${tenantSlug}/students`);
}