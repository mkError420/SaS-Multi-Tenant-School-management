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
  activationDate?: string;
  subscriptionExpiresAt?: string;
  phone?: string;
  authorityName?: string;
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
    activationDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    subscriptionExpiresAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // Expired for demo notifications
    phone: '+8801700000001',
    authorityName: 'Mr. Anisur Rahman',
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
    phone: '+8801700000002',
    authorityName: 'Ms. Farhana Haque',
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
    activationDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    subscriptionExpiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    phone: '+8801700000003',
    authorityName: 'Dr. Kamal Hossain',
  },
];

export async function getAllTenants() {
  // Demo fallback ONLY when Mongo is not configured at all.
  if (!process.env.MONGODB_URI) {
    return defaultTenants;
  }

  try {
    const db = await getDatabase();
    const tenants = await db.collection('tenants').find().toArray();

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
      activationDate: tenant.activationDate,
      subscriptionExpiresAt: tenant.subscriptionExpiresAt,
      phone: tenant.phone,
      authorityName: tenant.authorityName,
    })) as Tenant[];
  } catch (error) {
    console.error('Failed to fetch tenants from MongoDB:', error);
    // Avoid returning demo tenants when Mongo is configured but failing.
    return [];
  }
}

export async function getTenantBySlug(slug: string) {
  // Demo fallback ONLY when Mongo is not configured at all.
  if (!process.env.MONGODB_URI) {
    const fallbackTenant = defaultTenants.find((tenant) => tenant.slug === slug) ?? null;
    if (fallbackTenant && fallbackTenant.status !== 'active') return null;
    return fallbackTenant;
  }

  try {
    const db = await getDatabase();
    const tenant = await db.collection('tenants').findOne({ slug });
    if (!tenant) {
      return null;
    }

    // If the tenant is suspended or pending, block access (returns 404 in standard Next.js pages)
    if (tenant.status && tenant.status !== 'active') {
      return null;
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
      activationDate: tenant.activationDate,
      subscriptionExpiresAt: tenant.subscriptionExpiresAt,
      phone: tenant.phone,
      authorityName: tenant.authorityName,
    } as Tenant;
  } catch (error) {
    console.error('Failed to fetch tenant from MongoDB:', error);
    // Avoid returning demo tenant when Mongo is configured but failing.
    return null;
  }
}

export async function updateTenantStatus(slug: string, status: 'active' | 'pending' | 'suspended') {
  if (!process.env.MONGODB_URI) {
    return true;
  }

  try {
    const db = await getDatabase();
    const updateDoc: any = { status };

    if (status === 'active') {
      const tenant = await db.collection('tenants').findOne({ slug });
      if (tenant && !tenant.activationDate) {
        updateDoc.activationDate = new Date().toISOString();
        updateDoc.subscriptionExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      }
    }

    const result = await db.collection('tenants').updateOne({ slug }, { $set: updateDoc });
    return result.matchedCount > 0;
  } catch (error) {
    console.error('Failed to update tenant status in MongoDB:', error);
    return false;
  }
}

export async function deleteTenant(slug: string) {
  if (!process.env.MONGODB_URI) {
    return false;
  }
  try {
    const db = await getDatabase();
    const result = await db.collection('tenants').deleteOne({ slug });
    await db.collection('users').deleteMany({ tenantSlug: slug });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Failed to delete tenant:', error);
    return false;
  }
}
