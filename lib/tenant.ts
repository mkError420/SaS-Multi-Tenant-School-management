import { getDatabase } from './mongodb';

export type Tenant = {
  id: string;
  name: string;
  slug: string;
  city: string;
  description: string;
  plan: string;
  status: 'active' | 'pending' | 'suspended';
  students: number;
  teachers: number;
  classes: number;
  revenue: number;
};

const defaultTenants: Tenant[] = [
  {
    id: 'tenant_1',
    name: 'Zass Elementary School',
    slug: 'zass-elementary',
    city: 'Dhaka',
    description: 'A modern elementary school with a focus on student wellness and STEAM education.',
    plan: 'Basic',
    status: 'active',
    students: 1280,
    teachers: 72,
    classes: 38,
    revenue: 98000,
  },
  {
    id: 'tenant_2',
    name: 'Zass High School',
    slug: 'zass-high',
    city: 'Gaibandha',
    description: 'High school administration made easy, with attendance, courses, and reporting in one portal.',
    plan: 'Advance',
    status: 'active',
    students: 1645,
    teachers: 89,
    classes: 54,
    revenue: 145000,
  },
  {
    id: 'tenant_3',
    name: 'Zass Middle School',
    slug: 'zass-middle',
    city: 'Rangpur',
    description: 'A community-first school with strong support for families and teachers.',
    plan: 'Starter',
    status: 'pending',
    students: 940,
    teachers: 56,
    classes: 27,
    revenue: 47000,
  },
];

export async function getAllTenants() {
  if (!process.env.MONGODB_URI) {
    return defaultTenants;
  }

  try {
    const db = await getDatabase();
    const tenants = await db.collection('tenants').find().toArray();
    if (tenants.length === 0) {
      return defaultTenants;
    }

    return tenants.map((tenant: any) => ({
      id: tenant._id.toString(),
      name: tenant.name,
      slug: tenant.slug,
      city: tenant.city,
      description: tenant.description,
      plan: tenant.plan,
      status: tenant.status ?? 'active',
      students: tenant.students ?? 0,
      teachers: tenant.teachers ?? 0,
      classes: tenant.classes ?? 0,
      revenue: tenant.revenue ?? 0,
    })) as Tenant[];
  } catch (error) {
    console.error('Failed to fetch tenants from MongoDB:', error);
    return defaultTenants;
  }
}

export async function getTenantBySlug(slug: string) {
  if (!process.env.MONGODB_URI) {
    return defaultTenants.find((tenant) => tenant.slug === slug) ?? null;
  }

  try {
    const db = await getDatabase();
    const tenant = await db.collection('tenants').findOne({ slug });
    if (!tenant) {
      return defaultTenants.find((tenant) => tenant.slug === slug) ?? null;
    }

    return {
      id: tenant._id.toString(),
      name: tenant.name,
      slug: tenant.slug,
      city: tenant.city,
      description: tenant.description,
      plan: tenant.plan,
      status: tenant.status ?? 'active',
      students: tenant.students ?? 0,
      teachers: tenant.teachers ?? 0,
      classes: tenant.classes ?? 0,
      revenue: tenant.revenue ?? 0,
    } as Tenant;
  } catch (error) {
    console.error('Failed to fetch tenant from MongoDB:', error);
    return defaultTenants.find((tenant) => tenant.slug === slug) ?? null;
  }
}

export async function updateTenantStatus(slug: string, status: 'active' | 'pending' | 'suspended') {
  if (!process.env.MONGODB_URI) {
    return true;
  }

  try {
    const db = await getDatabase();
    const result = await db.collection('tenants').updateOne({ slug }, { $set: { status } });
    return result.matchedCount > 0;
  } catch (error) {
    console.error('Failed to update tenant status in MongoDB:', error);
    return false;
  }
}
