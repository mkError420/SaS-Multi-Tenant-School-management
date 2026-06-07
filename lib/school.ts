import { getDatabase } from './mongodb';
import { getAllTenants } from './tenant';
import { Tenant } from './tenant';
import { signUpUser } from './auth';

export type Student = {
  id: string;
  name: string;
  grade: string;
  status: string;
  enrolled: string;
};

export type Teacher = {
  id: string;
  name: string;
  subject: string;
  email: string;
  status: string;
};

export type ClassSchedule = {
  id: string;
  title: string;
  day: string;
  time: string;
  room: string;
  teacher: string;
};

export type BillingRecord = {
  id: string;
  label: string;
  amount: number;
  due: string;
  status: 'paid' | 'unpaid' | 'pending';
};

export type PlanPackage = {
  id: string;
  name: string;
  description: string;
  price: number;
  studentLimit: number;
};

export type AcademicSetup = {
  classes: number;
  sections: number;
  subjects: number;
  shifts: string[];
  session: string;
};

export type EnrollmentApplication = {
  id: string;
  studentName: string;
  grade: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedOn: string;
};

export type Notice = {
  id: string;
  title: string;
  date: string;
  audience: string;
  message: string;
};

export type TeacherPortalData = {
  attendanceRate: string;
  classesToday: string;
  pendingHomework: number;
  gradebookEntries: {
    course: string;
    dueDate: string;
    status: string;
  }[];
};

export type StudentPortalData = {
  studentId: string;
  className: string;
  section: string;
  attendancePct: number;
  results: {
    subject: string;
    score: string;
    grade: string;
  }[];
  feeStatus: {
    paid: number;
    due: number;
  };
};

export type ParentPortalData = {
  childName: string;
  className: string;
  attendancePct: number;
  outstandingFees: number;
  teacherContact: string;
};

const defaultStudents: Student[] = [
  { id: 'student-1', name: 'Amelia Rivera', grade: '5', status: 'Active', enrolled: '2024-08-14' },
  { id: 'student-2', name: 'Noah Patel', grade: '7', status: 'Active', enrolled: '2023-09-01' },
  { id: 'student-3', name: 'Mia Hernandez', grade: '3', status: 'Active', enrolled: '2024-01-12' },
  { id: 'student-4', name: 'Ethan Walker', grade: '12', status: 'On leave', enrolled: '2021-08-24' },
];

const defaultTeachers: Teacher[] = [
  { id: 'teacher-1', name: 'Avery Brooks', subject: 'Mathematics', email: 'avery@schoolspace.com', status: 'Available' },
  { id: 'teacher-2', name: 'Jaxon Lee', subject: 'Science', email: 'jaxon@schoolspace.com', status: 'In class' },
  { id: 'teacher-3', name: 'Sofia Kim', subject: 'English', email: 'sofia@schoolspace.com', status: 'Available' },
  { id: 'teacher-4', name: 'Lucas Morgan', subject: 'History', email: 'lucas@schoolspace.com', status: 'On leave' },
];

const defaultSchedule: ClassSchedule[] = [
  { id: 'schedule-1', title: 'Algebra II', day: 'Monday', time: '09:00 AM', room: 'Room 201', teacher: 'Avery Brooks' },
  { id: 'schedule-2', title: 'Biology Lab', day: 'Tuesday', time: '11:00 AM', room: 'Science Wing', teacher: 'Jaxon Lee' },
  { id: 'schedule-3', title: 'Creative Writing', day: 'Wednesday', time: '01:00 PM', room: 'Room 109', teacher: 'Sofia Kim' },
  { id: 'schedule-4', title: 'World History', day: 'Thursday', time: '02:30 PM', room: 'Room 116', teacher: 'Lucas Morgan' },
];

const defaultBilling: BillingRecord[] = [
  { id: 'billing-1', label: 'Tuition support', amount: 8200, due: '2026-06-30', status: 'pending' },
  { id: 'billing-2', label: 'Technology services', amount: 3200, due: '2026-06-20', status: 'paid' },
  { id: 'billing-3', label: 'Athletics lease', amount: 1750, due: '2026-07-05', status: 'unpaid' },
];

const defaultPlans: PlanPackage[] = [
  { id: 'plan-basic', name: 'Basic', description: 'Up to 200 students, core school tools, and essential support.', price: 29, studentLimit: 200 },
  { id: 'plan-starter', name: 'Starter', description: 'Up to 500 students, basic school tools, local support.', price: 49, studentLimit: 500 },
  { id: 'plan-advance', name: 'Advance', description: 'Up to 1,500 students, reports, and enhanced communication.', price: 99, studentLimit: 1500 },
];

const defaultAcademicSetup: AcademicSetup = {
  classes: 18,
  sections: 4,
  subjects: 22,
  shifts: ['Morning', 'Day'],
  session: '2025-2026',
};

const defaultAdmissions: EnrollmentApplication[] = [
  { id: 'app-1', studentName: 'Sofia Turner', grade: '6', status: 'pending', appliedOn: '2026-05-15' },
  { id: 'app-2', studentName: 'Miguel Santos', grade: '8', status: 'approved', appliedOn: '2026-05-07' },
  { id: 'app-3', studentName: 'Nina Patel', grade: '9', status: 'rejected', appliedOn: '2026-05-02' },
];

const defaultNotices: Notice[] = [
  { id: 'notice-1', title: 'Campus closed for Eid', date: '2026-06-10', audience: 'All users', message: 'School will remain closed for Eid holidays. Classes resume on June 14.' },
  { id: 'notice-2', title: 'Exam schedule published', date: '2026-06-01', audience: 'Students & Parents', message: 'Term exam timetable is available in the student portal.' },
];

const defaultTeacherPortal: TeacherPortalData = {
  attendanceRate: '94%',
  classesToday: 'Math, Science, History',
  pendingHomework: 4,
  gradebookEntries: [
    { course: 'Algebra II', dueDate: '2026-06-12', status: 'Open' },
    { course: 'Biology Lab', dueDate: '2026-06-14', status: 'Draft' },
  ],
};

const defaultStudentPortal: StudentPortalData = {
  studentId: 'S-2026-0042',
  className: '7th Grade',
  section: 'A',
  attendancePct: 96,
  results: [
    { subject: 'Mathematics', score: '91%', grade: 'A-' },
    { subject: 'English', score: '89%', grade: 'B+' },
    { subject: 'Science', score: '94%', grade: 'A' },
  ],
  feeStatus: { paid: 4500, due: 1200 },
};

const defaultParentPortal: ParentPortalData = {
  childName: 'Alina Hosein',
  className: '5th Grade',
  attendancePct: 98,
  outstandingFees: 850,
  teacherContact: 'Mrs. Sofia Kim',
};

function tenantScopeQuery(tenantSlugOrId: string) {
  // Support multiple possible tenant keys stored in DB:
  // - tenantSlug (used by onboardTenant currently)
  // - tenantId (common alternative)
  // - slug (if tenant slug was stored under a generic field)
  return {
    $or: [{ tenantSlug: tenantSlugOrId }, { tenantId: tenantSlugOrId }, { slug: tenantSlugOrId }],
  };
}

export async function getTenantStudents(tenantSlug: string) {
  if (!process.env.MONGODB_URI) {
    return defaultStudents;
  }

  try {
    const db = await getDatabase();
    return (await db.collection<Student>('students').find(tenantScopeQuery(tenantSlug)).toArray()) as Student[];
  } catch (error) {
    console.error('Failed to load tenant students:', error);
    return [];
  }
}

export async function getTenantTeachers(tenantSlug: string) {
  if (!process.env.MONGODB_URI) {
    return defaultTeachers;
  }

  try {
    const db = await getDatabase();
    return (await db.collection<Teacher>('teachers').find(tenantScopeQuery(tenantSlug)).toArray()) as Teacher[];
  } catch (error) {
    console.error('Failed to load tenant teachers:', error);
    return [];
  }
}

export async function getTenantSchedule(tenantSlug: string) {
  if (!process.env.MONGODB_URI) {
    return defaultSchedule;
  }

  try {
    const db = await getDatabase();
    return (await db.collection<ClassSchedule>('classes').find(tenantScopeQuery(tenantSlug)).toArray()) as ClassSchedule[];
  } catch (error) {
    console.error('Failed to load tenant schedule:', error);
    return [];
  }
}

export async function getTenantBilling(tenantSlug: string) {
  if (!process.env.MONGODB_URI) {
    return defaultBilling;
  }

  try {
    const db = await getDatabase();
    return (await db.collection<BillingRecord>('billing').find(tenantScopeQuery(tenantSlug)).toArray()) as BillingRecord[];
  } catch (error) {
    console.error('Failed to load tenant billing:', error);
    return [];
  }
}

export async function getSubscriptionPlans() {
  if (!process.env.MONGODB_URI) {
    return defaultPlans;
  }

  try {
    const db = await getDatabase();
    const plans = await db.collection<PlanPackage>('plans').find().toArray();
    if (plans.length === 0) {
      // Seed plans initially if they don't exist
      await db.collection('plans').insertMany(defaultPlans as any);
      return defaultPlans;
    }
    return plans.map((p) => ({ ...p, id: (p as any).id || (p as any)._id.toString() })) as PlanPackage[];
  } catch (error) {
    console.error('Failed to load plans:', error);
    return defaultPlans;
  }
}

export async function updatePlan(id: string, price: number, name?: string, studentLimit?: number) {
  if (!process.env.MONGODB_URI) return false;
  try {
    const db = await getDatabase();
    const updateDoc: any = { price };
    if (name) updateDoc.name = name;
    if (studentLimit !== undefined) updateDoc.studentLimit = studentLimit;

    const result = await db.collection('plans').updateOne({ id }, { $set: updateDoc });

    // Dynamically cascade plan price changes to update Total Revenue for existing tenants
    if (result.matchedCount > 0) {
      const updatedPlan = await db.collection('plans').findOne({ id });
      if (updatedPlan && updatedPlan.name) {
        await db.collection('tenants').updateMany(
          { plan: updatedPlan.name },
          { $set: { revenue: price } }
        );
      }
    }

    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Failed to update plan:', error);
    return false;
  }
}

export async function getTenantAcademicSetup(tenantSlug: string) {
  if (!process.env.MONGODB_URI) {
    return defaultAcademicSetup;
  }

  try {
    const db = await getDatabase();
    const result = await db.collection<AcademicSetup>('academicSetup').findOne(tenantScopeQuery(tenantSlug));
    return result ?? defaultAcademicSetup;
  } catch (error) {
    console.error('Failed to load academic setup:', error);
    return defaultAcademicSetup;
  }
}

export async function getTenantAdmissions(tenantSlug: string) {
  if (!process.env.MONGODB_URI) {
    return defaultAdmissions;
  }

  try {
    const db = await getDatabase();
    return (await db.collection<EnrollmentApplication>('admissions').find(tenantScopeQuery(tenantSlug)).toArray()) as EnrollmentApplication[];
  } catch (error) {
    console.error('Failed to load admissions:', error);
    return defaultAdmissions;
  }
}

export async function getTenantNoticeBoard(tenantSlug: string) {
  if (!process.env.MONGODB_URI) {
    return defaultNotices;
  }

  try {
    const db = await getDatabase();
    return (await db.collection<Notice>('notices').find(tenantScopeQuery(tenantSlug)).toArray()) as Notice[];
  } catch (error) {
    console.error('Failed to load notices:', error);
    return defaultNotices;
  }
}

export async function getTeacherPortalData(tenantSlug: string) {
  if (!process.env.MONGODB_URI) {
    return defaultTeacherPortal;
  }

  try {
    const db = await getDatabase();
    return (await db.collection<TeacherPortalData>('teacherPortal').findOne(tenantScopeQuery(tenantSlug))) ?? defaultTeacherPortal;
  } catch (error) {
    console.error('Failed to load teacher portal data:', error);
    return defaultTeacherPortal;
  }
}

export async function getStudentPortalData(tenantSlug: string) {
  if (!process.env.MONGODB_URI) {
    return defaultStudentPortal;
  }

  try {
    const db = await getDatabase();
    return (await db.collection<StudentPortalData>('studentPortal').findOne(tenantScopeQuery(tenantSlug))) ?? defaultStudentPortal;
  } catch (error) {
    console.error('Failed to load student portal data:', error);
    return defaultStudentPortal;
  }
}

export async function getParentPortalData(tenantSlug: string) {
  if (!process.env.MONGODB_URI) {
    return defaultParentPortal;
  }

  try {
    const db = await getDatabase();
    return (await db.collection<ParentPortalData>('parentPortal').findOne(tenantScopeQuery(tenantSlug))) ?? defaultParentPortal;
  } catch (error) {
    console.error('Failed to load parent portal data:', error);
    return defaultParentPortal;
  }
}

export async function getPlatformAnalytics() {
  const tenants = await getAllTenants();
  const totalStudents = tenants.reduce((sum, tenant) => sum + tenant.students, 0);
  const totalTeachers = tenants.reduce((sum, tenant) => sum + tenant.teachers, 0);
  const totalRevenue = tenants.reduce((sum, tenant) => sum + tenant.revenue, 0);

  return {
    totalSchools: tenants.length,
    activeSchools: tenants.filter((tenant) => tenant.status === 'active').length,
    pendingSchools: tenants.filter((tenant) => tenant.status === 'pending').length,
    suspendedSchools: tenants.filter((tenant) => tenant.status === 'suspended').length,
    totalStudents,
    totalTeachers,
    totalRevenue,
  };
}

export type PlatformAnalytics = Awaited<ReturnType<typeof getPlatformAnalytics>>;

export type OnboardTenantPayload = {
  name: string;
  slug: string;
  city: string;
  description: string;
  plan: string;
  adminEmail: string;
  adminPassword: string;
};

export async function onboardTenant(payload: OnboardTenantPayload) {
  if (!process.env.MONGODB_URI) {
    throw new Error('MongoDB is not configured. Cannot onboard a new tenant in demo mode.');
  }

  const db = await getDatabase();
  const existingTenant = await db.collection('tenants').findOne({ slug: payload.slug });
  if (existingTenant) {
    throw new Error('A tenant with that slug already exists.');
  }

  // Determine initial revenue dynamically based on the selected subscription plan
  const plans = await getSubscriptionPlans();
  const selectedPlan = plans.find((p) => p.name === payload.plan || p.id === payload.plan);

  const tenant = {
    name: payload.name,
    slug: payload.slug,
    city: payload.city,
    description: payload.description,
    plan: payload.plan,
    status: 'pending' as const,
    students: 0,
    teachers: 0,
    classes: 0,
    revenue: selectedPlan ? selectedPlan.price : 0,
  };

  const defaultStudent = {
    tenantSlug: payload.slug,
    name: 'New Student One',
    grade: '1',
    status: 'Active',
    enrolled: new Date().toISOString().split('T')[0],
  };

  const defaultTeacher = {
    tenantSlug: payload.slug,
    name: 'School Admin',
    subject: 'Administration',
    email: payload.adminEmail,
    status: 'Available',
  };

  const defaultClass = {
    tenantSlug: payload.slug,
    title: 'Welcome Orientation',
    day: 'Monday',
    time: '10:00 AM',
    room: 'Main Hall',
    teacher: defaultTeacher.name,
  };

  const defaultInvoice = {
    tenantSlug: payload.slug,
    label: `${payload.plan} Plan Subscription`,
    amount: selectedPlan ? selectedPlan.price : 1200,
    due: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
    status: 'pending' as const,
  };

  // Create tenant record (or ensure it exists) so tenant pages can rely on MongoDB-backed state.
  const insertResult = await db.collection('tenants').insertOne(tenant);

  // Provision required tenant-scoped data.
  // Using insertOne because these defaults should only be created at tenant onboarding time.
  await db.collection('students').insertOne(defaultStudent);
  await db.collection('teachers').insertOne(defaultTeacher);
  await db.collection('classes').insertOne(defaultClass);
  await db.collection('billing').insertOne(defaultInvoice);

  // Provision additional tenant-scoped collections so the tenant dashboard
  // works fully with persisted data (no demo fallbacks) right after onboarding.
  await db.collection('academicSetup').insertOne({ tenantSlug: payload.slug, ...defaultAcademicSetup });
  await db.collection('admissions').insertMany(
    defaultAdmissions.map((app) => ({
      ...app,
      tenantSlug: payload.slug,
    })),
  );
  await db.collection('notices').insertMany(
    defaultNotices.map((notice) => ({
      ...notice,
      tenantSlug: payload.slug,
    })),
  );
  await db.collection('teacherPortal').insertOne({ tenantSlug: payload.slug, ...defaultTeacherPortal });
  await db.collection('studentPortal').insertOne({ tenantSlug: payload.slug, ...defaultStudentPortal });
  await db.collection('parentPortal').insertOne({ tenantSlug: payload.slug, ...defaultParentPortal });

  // Also ensure the admin user exists for tenant.
  await signUpUser(payload.adminEmail, payload.adminPassword, payload.slug, 'admin');

  return {
    ...tenant,
    id: insertResult.insertedId.toString(),
  } as Tenant & { id: string };
}
