import { NextResponse } from 'next/server';
import { getDatabase } from '../../../../../lib/mongodb';
import { getTenantBySlug } from '../../../../../lib/tenant';

export async function POST(
  req: Request,
  context: { params: { tenant: string } },
) {
  const { tenant } = context.params;

  const tenantObj = await getTenantBySlug(tenant);
  if (!tenantObj) {
    return NextResponse.json({ error: 'Tenant not found.' }, { status: 404 });
  }

  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      { error: 'MongoDB is not configured. Cannot add student in demo mode.' },
      { status: 400 },
    );
  }

  try {
    const body = await req.json();
    const { name, grade, status, enrolled } = body ?? {};

    if (typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'name is required.' }, { status: 400 });
    }
    if (typeof grade !== 'string' || grade.trim().length === 0) {
      return NextResponse.json({ error: 'grade is required.' }, { status: 400 });
    }

    const tenantSlug = tenant; // tenant slug is the scope key used by school.ts

    const studentDoc = {
      tenantSlug,
      name: name.trim(),
      grade: grade.trim(),
      status: typeof status === 'string' && status.trim().length > 0 ? status.trim() : 'Active',
      enrolled: typeof enrolled === 'string' && enrolled.trim().length > 0 ? enrolled.trim() : new Date().toISOString().slice(0, 10),
    };

    const db = await getDatabase();
    const result = await db.collection('students').insertOne(studentDoc);

    return NextResponse.json(
      { ok: true, id: result.insertedId.toString(), student: studentDoc },
      { status: 201 },
    );
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error)?.message || 'Failed to add student.' },
      { status: 500 },
    );
  }
}
