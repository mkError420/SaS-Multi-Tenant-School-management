'use server';

import { revalidatePath } from 'next/cache';
import { getDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

type SchedulePayload = {
  day: string;
  title: string;
  time: string;
  teacher: string;
  room: string;
};

export async function addScheduleAction(tenantSlug: string, payload: SchedulePayload) {
  try {
    const db = await getDatabase();
    await db.collection('schedule').insertOne({
      tenantSlug,
      ...payload,
    });
    revalidatePath(`/${tenantSlug}/schedule`);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to add schedule item.' };
  }
}

export async function updateScheduleAction(tenantSlug: string, id: string, payload: SchedulePayload) {
  try {
    const db = await getDatabase();
    await db.collection('schedule').updateOne(
      { _id: new ObjectId(id) },
      { $set: payload }
    );
    revalidatePath(`/${tenantSlug}/schedule`);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update schedule item.' };
  }
}

export async function deleteScheduleAction(tenantSlug: string, id: string) {
  try {
    const db = await getDatabase();
    await db.collection('schedule').deleteOne({ _id: new ObjectId(id) });
    revalidatePath(`/${tenantSlug}/schedule`);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete schedule item.' };
  }
}