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
  email?: string;
  category?: 'demo' | 'trusted';
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
    email: 'contact@zass-elementary.edu',
    category: 'trusted',
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
    email: 'info@zass-middle.edu',
    category: 'demo',
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
    email: 'admin@zass-high.edu',
    category: 'trusted',
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

    const tenantsWithCounts = await Promise.all(
      tenants.map(async (tenant: any) => {
        // Fetch dynamic real-time counts straight from the students collection
        const studentCount = await db.collection('students').countDocuments({
          $or: [{ tenantSlug: tenant.slug }, { tenantId: tenant.slug }, { slug: tenant.slug }]
        });

        return {
          id: tenant._id.toString(),
          name: tenant.name,
          slug: tenant.slug,
          city: tenant.city,
          description: tenant.description,
          plan: tenant.plan,
          status: tenant.status ?? 'active',
          students: studentCount, // Dynamically synced with School Administration Portal
          teachers: tenant.teachers ?? 0,
          classes: tenant.classes ?? 0,
          revenue: tenant.revenue ?? 0,
          activationDate: tenant.activationDate,
          subscriptionExpiresAt: tenant.subscriptionExpiresAt,
          phone: tenant.phone,
          authorityName: tenant.authorityName,
          email: tenant.email,
          category: tenant.category || 'demo',
        };
      })
    );

    return tenantsWithCounts as Tenant[];
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

    // Fetch dynamic real-time counts straight from the students collection
    const studentCount = await db.collection('students').countDocuments({
      $or: [{ tenantSlug: tenant.slug }, { tenantId: tenant.slug }, { slug: tenant.slug }]
    });

    return {
      id: tenant._id.toString(),
      name: tenant.name,
      slug: tenant.slug,
      city: tenant.city,
      description: tenant.description,
      plan: tenant.plan,
      status: tenant.status ?? 'active',
      students: studentCount, // Dynamically synced with School Administration Portal
      teachers: tenant.teachers ?? 0,
      classes: tenant.classes ?? 0,
      revenue: tenant.revenue ?? 0,
      activationDate: tenant.activationDate,
      subscriptionExpiresAt: tenant.subscriptionExpiresAt,
      phone: tenant.phone,
      authorityName: tenant.authorityName,
      email: tenant.email,
      category: tenant.category || 'demo',
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
        const planInfo = await db.collection('plans').findOne({ name: tenant.plan });
        const duration = planInfo?.durationDays || 30;
        updateDoc.activationDate = new Date().toISOString();
        updateDoc.subscriptionExpiresAt = new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString();
      }
    }

    const result = await db.collection('tenants').updateOne({ slug }, { $set: updateDoc });
    return result.matchedCount > 0;
  } catch (error) {
    console.error('Failed to update tenant status in MongoDB:', error);
    return false;
  }
}

export async function updateTenantDetails(slug: string, payload: { name: string; city: string; description: string; phone: string; authorityName: string; email: string; category: 'demo' | 'trusted' }) {
  if (!process.env.MONGODB_URI) {
    return false;
  }
  try {
    const db = await getDatabase();
    const result = await db.collection('tenants').updateOne({ slug }, { $set: payload });
    return result.matchedCount > 0;
  } catch (error) {
    console.error('Failed to update tenant details:', error);
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
    
    // Create a scope query to catch all possible ways the tenant data might be tied
    const tenantScope = {
      $or: [{ tenantSlug: slug }, { tenantId: slug }, { slug: slug }]
    };

    // Cascade delete all associated tenant data concurrently
    await Promise.all([
      db.collection('users').deleteMany({ tenantSlug: slug }),
      db.collection('students').deleteMany(tenantScope),
      db.collection('teachers').deleteMany(tenantScope),
      db.collection('classes').deleteMany(tenantScope),
      db.collection('billing').deleteMany(tenantScope),
      db.collection('academicSetup').deleteMany(tenantScope),
      db.collection('admissions').deleteMany(tenantScope),
      db.collection('notices').deleteMany(tenantScope),
      db.collection('teacherPortal').deleteMany(tenantScope),
      db.collection('studentPortal').deleteMany(tenantScope),
      db.collection('parentPortal').deleteMany(tenantScope),
    ]);

    return result.deletedCount > 0;
  } catch (error) {
    console.error('Failed to delete tenant:', error);
    return false;
  }
}

export async function renewTenantSubscription(slug: string) {
  if (!process.env.MONGODB_URI) {
    return false;
  }
  try {
    const db = await getDatabase();
    const tenant = await db.collection('tenants').findOne({ slug });
    if (!tenant) return false;

    const planInfo = await db.collection('plans').findOne({ name: tenant.plan });
    const duration = planInfo?.durationDays || 30;

    const currentExpiry = tenant.subscriptionExpiresAt ? new Date(tenant.subscriptionExpiresAt) : new Date();
    const baseDate = currentExpiry < new Date() ? new Date() : currentExpiry;
    const newExpiry = new Date(baseDate.getTime() + duration * 24 * 60 * 60 * 1000).toISOString();

    await db.collection('tenants').updateOne({ slug }, { $set: { subscriptionExpiresAt: newExpiry } });

    const newInvoice = {
      tenantSlug: slug,
      label: `${tenant.plan} Plan Subscription Renewal`,
      amount: tenant.revenue || 0,
      due: new Date(baseDate.getTime() + duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending',
    };

    await db.collection('billing').insertOne(newInvoice);
    return true;
  } catch (error) {
    console.error('Failed to renew subscription:', error);
    return false;
  }
}
