import { notFound } from 'next/navigation';
import { getTenantBySlug } from '../../../lib/tenant';
import { getDatabase } from '../../../lib/mongodb';
import ScheduleClient from './ScheduleClient';
import type { ScheduleItem } from '../../../lib/school';

async function getSchedule(tenantSlug: string): Promise<ScheduleItem[]> {
  if (!process.env.MONGODB_URI) {
    // Return sample data if no DB is configured
    return [
      { id: '1', day: 'Monday', time: '09:00 - 10:00', title: 'Mathematics', teacher: 'Mr. Brooks', room: '101', tenantSlug },
      { id: '2', day: 'Tuesday', time: '10:00 - 11:00', title: 'Physics', teacher: 'Ms. Carter', room: '202', tenantSlug },
    ];
  }
  const db = await getDatabase();
  const schedule = await db.collection('schedule').find({ tenantSlug }).toArray();

  return schedule.map((item) => ({
    id: item._id.toString(),
    day: item.day,
    title: item.title,
    time: item.time,
    teacher: item.teacher,
    room: item.room,
    tenantSlug: item.tenantSlug,
  }));
}

export default async function SchedulePage({
  params,
}: {
  params: { tenant: string };
}) {
  const tenant = await getTenantBySlug(params.tenant);
  if (!tenant) {
    notFound();
  }

  const schedule = await getSchedule(tenant.slug);

  return <ScheduleClient schedule={schedule} tenant={tenant} />;
}