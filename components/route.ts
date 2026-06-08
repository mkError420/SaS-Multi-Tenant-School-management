import { NextResponse } from 'next/server';
import { getDatabase } from '../lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!process.env.MONGODB_URI) return NextResponse.json({ methods: [] });
  try {
    const db = await getDatabase();
    const methods = await db.collection('paymentMethods').find().toArray();
    return NextResponse.json({ 
      methods: methods.map((m: any) => ({ 
        ...m, 
        id: m._id.toString(), 
        _id: undefined,
        paymentOption: m.paymentOption || m.provider,
        paymentNumber: m.paymentNumber || m.accountNumber
      })) 
    });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!process.env.MONGODB_URI) return NextResponse.json({ error: 'No DB' }, { status: 500 });
  try {
    const body = await req.json();
    const db = await getDatabase();
    const result = await db.collection('paymentMethods').insertOne({
      ...body,
      isActive: body.isActive ?? true,
    });
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}