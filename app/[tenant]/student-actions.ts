'use server';

import { revalidatePath } from 'next/cache';
import { getDatabase } from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function addStudentAction(tenantSlug: string, name: string, grade: string, status: string, enrolled: string, guardianName: string, guardianPhone: string, address: string) {
  try {
    const db = await getDatabase();
    const studentDoc = { tenantSlug, name, grade, status, enrolled, guardianName, guardianPhone, address };
    await db.collection('students').insertOne(studentDoc);
    await db.collection('tenants').updateOne({ slug: tenantSlug }, { $inc: { students: 1 } });
    revalidatePath(`/${tenantSlug}`);
    revalidatePath(`/${tenantSlug}/students`);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to add student.' };
  }
}

export async function editStudentAction(tenantSlug: string, id: string, name: string, grade: string, status: string, enrolled: string, guardianName: string, guardianPhone: string, address: string) {
  try {
    const db = await getDatabase();
    await db.collection('students').updateOne(
      { _id: new ObjectId(id), tenantSlug },
      { $set: { name, grade, status, enrolled, guardianName, guardianPhone, address } }
    );
    revalidatePath(`/${tenantSlug}`);
    revalidatePath(`/${tenantSlug}/students`);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update student.' };
  }
}

export async function removeStudentAction(tenantSlug: string, id: string) {
  try {
    const db = await getDatabase();
    const result = await db.collection('students').deleteOne({ _id: new ObjectId(id), tenantSlug });
    if (result.deletedCount > 0) {
      await db.collection('tenants').updateOne({ slug: tenantSlug }, { $inc: { students: -1 } });
    }
    revalidatePath(`/${tenantSlug}`);
    revalidatePath(`/${tenantSlug}/students`);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to remove student.' };
  }
}