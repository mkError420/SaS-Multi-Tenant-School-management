'use server';

import { revalidatePath } from 'next/cache';
import { getDatabase } from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function addTeacherAction(tenantSlug: string, name: string, subject: string, email: string, status: string) {
  try {
    const db = await getDatabase();
    const teacherDoc = {
      tenantSlug,
      name,
      subject,
      email,
      status,
    };
    await db.collection('teachers').insertOne(teacherDoc);
    await db.collection('tenants').updateOne({ slug: tenantSlug }, { $inc: { teachers: 1 } });
    revalidatePath(`/${tenantSlug}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to add teacher.' };
  }
}

export async function editTeacherAction(tenantSlug: string, id: string, name: string, subject: string, email: string, status: string) {
  try {
    const db = await getDatabase();
    await db.collection('teachers').updateOne(
      { _id: new ObjectId(id), tenantSlug },
      { $set: { name, subject, email, status } }
    );
    revalidatePath(`/${tenantSlug}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update teacher.' };
  }
}

export async function removeTeacherAction(tenantSlug: string, id: string) {
  try {
    const db = await getDatabase();
    const result = await db.collection('teachers').deleteOne({ _id: new ObjectId(id), tenantSlug });
    if (result.deletedCount > 0) {
      await db.collection('tenants').updateOne({ slug: tenantSlug }, { $inc: { teachers: -1 } });
    }
    revalidatePath(`/${tenantSlug}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to remove teacher.' };
  }
}