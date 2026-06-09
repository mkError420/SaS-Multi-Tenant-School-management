import { ObjectId } from 'mongodb';
import { getDatabase } from './mongodb';

export type Student = {
  _id?: ObjectId;
  id: string;
  name: string;
  grade: string;
  status: 'Active' | 'Inactive' | 'On leave' | 'Graduated';
  enrolled: string; // date string
  guardianName?: string;
  guardianPhone?: string;
  address?: string;
  tenantSlug: string;
};

export type Teacher = {
  _id?: ObjectId;
  id:string;
  name: string;
  subject: string;
  email: string;
  status: 'Available' | 'In class' | 'On leave';
  tenantSlug: string;
};

export type ScheduleItem = {
  _id?: ObjectId;
  id: string;
  day: string;
  title: string; // Class/Subject
  time: string;
  teacher: string;
  room:string;
  tenantSlug: string;
};

export type PlatformAnalytics = {
    activeSchools: number;
    totalStudents: number;
    pendingSchools: number;
    totalRevenue: number;
};

export type PlanPackage = {
    id: string;
    name: string;
    description: string;
    price: number;
    studentLimit: number;
    durationDays: number;
    serverCost: number;
};

export type BillingRecord = {
    id: string;
    tenantSlug: string;
    label: string;
    amount: number;
    due: string;
    status: 'paid' | 'unpaid' | 'pending';
};

export type PlatformSettings = {
    platformName: string;
    supportEmail: string;
    supportPhone: string;
    maintenanceMode: boolean;
};

export type ContactMessage = {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    date: string;
    status: 'read' | 'unread';
};

export type HeroImage = {
    id: string;
    url: string;
    caption: string;
    isActive: boolean;
};

export type AcademicClass = {
  _id?: ObjectId;
  id: string;
  name: string;
  section: string;
  room: string;
  tenantSlug: string;
};

export type AcademicSubject = {
  _id?: ObjectId;
  id: string;
  name: string;
  code: string;
  tenantSlug: string;
};

export type Notice = {
  _id?: ObjectId;
  id: string;
  title: string;
  content: string;
  date: string;
  tenantSlug: string;
};

export type AdmissionApplication = {
  _id?: ObjectId;
  id: string;
  studentName: string;
  grade: string;
  parentName: string;
  contactEmail: string;
  contactPhone: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  tenantSlug: string;
};

export async function getPlatformSettings(): Promise<PlatformSettings> {
    if (process.env.MONGODB_URI) {
        try {
            const db = await getDatabase();
            const settings = await db.collection('settings').findOne({});
            if (settings) {
                return {
                    platformName: settings.platformName || 'Zass',
                    supportEmail: settings.supportEmail || 'support@zass.edu',
                    supportPhone: settings.supportPhone || '+8801700000000',
                    maintenanceMode: settings.maintenanceMode || false,
                };
            }
        } catch (error) {}
    }
    // Default platform settings fallback
    return {
        platformName: 'Zass',
        supportEmail: 'support@zass.edu',
        supportPhone: '+8801700000000',
        maintenanceMode: false,
    };
}

export async function getSubscriptionPlans(): Promise<PlanPackage[]> {
    if (process.env.MONGODB_URI) {
        try {
            const db = await getDatabase();
            const plans = await db.collection('plans').find().toArray();
            if (plans.length > 0) {
                return plans.map(p => ({
                    id: p.id,
                    name: p.name,
                    description: p.description,
                    price: p.price,
                    studentLimit: p.studentLimit,
                    durationDays: p.durationDays,
                    serverCost: p.serverCost
                }));
            }
        } catch (error) {}
    }
    // Default subscription plans fallback
    return [
        {
            id: 'starter',
            name: 'Starter',
            description: 'Essential features for small schools.',
            price: 5000,
            studentLimit: 500,
            durationDays: 30,
            serverCost: 1000,
        },
        {
            id: 'basic',
            name: 'Basic',
            description: 'Advanced features for growing schools.',
            price: 10000,
            studentLimit: 1500,
            durationDays: 30,
            serverCost: 2000,
        },
    ];
}

export async function getHeroImages(): Promise<HeroImage[]> {
    if (process.env.MONGODB_URI) {
        try {
            const db = await getDatabase();
            const images = await db.collection('heroImages').find().toArray();
            if (images.length > 0) {
                return images.map(i => ({
                    id: i._id.toString(),
                    url: i.url,
                    caption: i.caption,
                    isActive: i.isActive
                }));
            }
        } catch (error) {}
    }
    return [
        {
            id: 'hero_1',
            url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=2070',
            caption: 'Scale Your School Infrastructure with One Unified Platform.',
            isActive: true,
        }
    ];
}

export async function getPlatformAnalytics(): Promise<PlatformAnalytics> {
    if (!process.env.MONGODB_URI) {
        return { activeSchools: 2, totalStudents: 2925, pendingSchools: 1, totalRevenue: 243000 };
    }
    try {
        const db = await getDatabase();
        const activeSchoolsCount = await db.collection('tenants').countDocuments({ status: 'active' });
        const pendingSchoolsCount = await db.collection('tenants').countDocuments({ status: 'pending' });
        const totalStudentsCount = await db.collection('students').countDocuments();
        
        const activeTenants = await db.collection('tenants').find({ status: 'active' }).toArray();
        const totalRevenue = activeTenants.reduce((acc, t) => acc + (t.revenue || 0), 0);

        return {
            activeSchools: activeSchoolsCount,
            totalStudents: totalStudentsCount,
            pendingSchools: pendingSchoolsCount,
            totalRevenue: totalRevenue,
        };
    } catch (error) {
        return { activeSchools: 0, totalStudents: 0, pendingSchools: 0, totalRevenue: 0 };
    }
}

export async function getAllBillingRecords(): Promise<BillingRecord[]> {
    if (!process.env.MONGODB_URI) {
        return [];
    }
    try {
        const db = await getDatabase();
        const records = await db.collection('billing').find().sort({ due: -1 }).toArray();
        return records.map(r => ({ id: r._id.toString(), tenantSlug: r.tenantSlug, label: r.label, amount: r.amount, due: r.due, status: r.status })) as BillingRecord[];
    } catch (error) {
        return [];
    }
}

export async function updatePlan(id: string, price: number, name: string, limit: number, durationDays: number, serverCost: number) {
    if (!process.env.MONGODB_URI) return false;
    try {
        const db = await getDatabase();
        await db.collection('plans').updateOne({ id }, { $set: { price, name, studentLimit: limit, durationDays, serverCost } });
        return true;
    } catch (error) {
        return false;
    }
}

export async function createPlan(name: string, description: string, price: number, limit: number, durationDays: number, serverCost: number) {
    if (!process.env.MONGODB_URI) return false;
    try {
        const db = await getDatabase();
        const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        await db.collection('plans').insertOne({ id, name, description, price, studentLimit: limit, durationDays, serverCost });
        return true;
    } catch (error) {
        return false;
    }
}

export async function deletePlan(id: string) {
    if (!process.env.MONGODB_URI) return false;
    try {
        const db = await getDatabase();
        await db.collection('plans').deleteOne({ id });
        return true;
    } catch (error) {
        return false;
    }
}

export async function createTenantInvoice(tenantSlug: string, label: string, amount: number, due: string) {
    if (!process.env.MONGODB_URI) return false;
    try {
        const db = await getDatabase();
        await db.collection('billing').insertOne({ tenantSlug, label, amount, due, status: 'pending' });
        return true;
    } catch (error) {
        return false;
    }
}

export async function updateTenantInvoice(id: string, status: 'paid' | 'unpaid' | 'pending') {
    if (!process.env.MONGODB_URI) return false;
    try {
        const db = await getDatabase();
        await db.collection('billing').updateOne({ _id: new ObjectId(id) }, { $set: { status } });
        return true;
    } catch (error) {
        return false;
    }
}

export async function deleteTenantInvoice(id: string) {
    if (!process.env.MONGODB_URI) return false;
    try {
        const db = await getDatabase();
        await db.collection('billing').deleteOne({ _id: new ObjectId(id) });
        return true;
    } catch (error) {
        return false;
    }
}

export async function updatePlatformSettings(payload: { platformName: string; supportEmail: string; supportPhone: string; maintenanceMode: boolean }) {
    if (!process.env.MONGODB_URI) return false;
    try {
        const db = await getDatabase();
        await db.collection('settings').updateOne({}, { $set: payload }, { upsert: true });
        return true;
    } catch (error) {
        return false;
    }
}

export async function updateContactMessageStatus(id: string, status: 'read' | 'unread') {
    if (!process.env.MONGODB_URI) return false;
    try {
        const db = await getDatabase();
        await db.collection('contactMessages').updateOne({ _id: new ObjectId(id) }, { $set: { status } });
        return true;
    } catch (error) {
        return false;
    }
}

export async function deleteContactMessage(id: string) {
    if (!process.env.MONGODB_URI) return false;
    try {
        const db = await getDatabase();
        await db.collection('contactMessages').deleteOne({ _id: new ObjectId(id) });
        return true;
    } catch (error) {
        return false;
    }
}

export async function createHeroImage(payload: { url: string; caption: string }) {
    if (!process.env.MONGODB_URI) return false;
    try {
        const db = await getDatabase();
        await db.collection('heroImages').insertOne({ ...payload, isActive: true });
        return true;
    } catch (error) {
        return false;
    }
}

export async function updateHeroImageStatus(id: string, isActive: boolean) {
    if (!process.env.MONGODB_URI) return false;
    try {
        const db = await getDatabase();
        await db.collection('heroImages').updateOne({ _id: new ObjectId(id) }, { $set: { isActive } });
        return true;
    } catch (error) {
        return false;
    }
}

export async function deleteHeroImage(id: string) {
    if (!process.env.MONGODB_URI) return false;
    try {
        const db = await getDatabase();
        await db.collection('heroImages').deleteOne({ _id: new ObjectId(id) });
        return true;
    } catch (error) {
        return false;
    }
}

export async function getTenantBilling(tenantSlug: string): Promise<BillingRecord[]> {
    if (!process.env.MONGODB_URI) {
        return [];
    }
    try {
        const db = await getDatabase();
        const records = await db.collection('billing').find({ tenantSlug }).sort({ due: -1 }).toArray();
        return records.map(r => ({ id: r._id.toString(), tenantSlug: r.tenantSlug, label: r.label, amount: r.amount, due: r.due, status: r.status })) as BillingRecord[];
    } catch (error) {
        return [];
    }
}

export async function getTenantStudents(tenantSlug: string): Promise<Student[]> {
    if (!process.env.MONGODB_URI) {
        return [];
    }
    try {
        const db = await getDatabase();
        const students = await db.collection('students').find({ tenantSlug }).toArray();
        return students.map(s => ({
            id: s._id.toString(),
            name: s.name,
            grade: s.grade,
            status: s.status,
            enrolled: s.enrolled,
            guardianName: s.guardianName,
            guardianPhone: s.guardianPhone,
            address: s.address,
            tenantSlug: s.tenantSlug
        })) as Student[];
    } catch (error) {
        return [];
    }
}

export async function getTenantTeachers(tenantSlug: string): Promise<Teacher[]> {
    if (!process.env.MONGODB_URI) {
        return [];
    }
    try {
        const db = await getDatabase();
        const teachers = await db.collection('teachers').find({ tenantSlug }).toArray();
        return teachers.map(t => ({
            id: t._id.toString(),
            name: t.name,
            subject: t.subject,
            email: t.email,
            status: t.status,
            tenantSlug: t.tenantSlug
        })) as Teacher[];
    } catch (error) {
        return [];
    }
}

export async function getContactMessages(): Promise<ContactMessage[]> {
    if (!process.env.MONGODB_URI) {
        return [];
    }
    try {
        const db = await getDatabase();
        const messages = await db.collection('contactMessages').find().sort({ date: -1 }).toArray();
        return messages.map(m => ({ id: m._id.toString(), name: m.name, email: m.email, subject: m.subject, message: m.message, date: m.date, status: m.status })) as ContactMessage[];
    } catch (error) {
        return [];
    }
}