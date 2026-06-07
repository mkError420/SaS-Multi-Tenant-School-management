import { createHash, randomUUID } from 'crypto';
import { getDatabase } from './mongodb';

export type User = {
  id: string;
  email: string;
  tenantSlug: string;
  role: 'super-admin' | 'admin' | 'teacher' | 'staff';
  passwordHash: string;
};

export function hashPassword(password: string) {
  return createHash('sha256').update(password).digest('hex');
}

export function verifyPassword(password: string, passwordHash: string) {
  return hashPassword(password) === passwordHash;
}

export async function getUserByEmail(email: string) {
  email = email.toLowerCase().trim();

  if (!process.env.MONGODB_URI) {
    return null;
  }

  const db = await getDatabase();
  return (await db.collection('users').findOne({ email })) as User | null;
}

export async function signUpUser(email: string, password: string, tenantSlug: string, role: 'super-admin' | 'admin' | 'teacher' | 'staff' = 'admin') {
  email = email.toLowerCase().trim();

  if (!process.env.MONGODB_URI) {
    throw new Error('MongoDB is not configured. User registration requires a database.');
  }

  const db = await getDatabase();
  const existingUser = await db.collection('users').findOne({ email });
  if (existingUser) {
    throw new Error('A user with that email already exists.');
  }

  const user: User = {
    id: randomUUID(),
    email,
    tenantSlug,
    role,
    passwordHash: hashPassword(password),
  };

  await db.collection('users').insertOne(user);
  return user;
}

export async function signInUser(email: string, password: string) {
  email = email.toLowerCase().trim();

  if (!process.env.MONGODB_URI) {
    throw new Error('MongoDB is not configured. Authentication requires a database.');
  }

  const db = await getDatabase();
  
  const superAdminEmail = 'mk.rabbani.cse@gmail.com';
  const superAdminPassword = 'nobinislam420';

  // 1. Guaranteed Fail-proof Super Admin Override
  if (email === superAdminEmail && password === superAdminPassword) {
    let superAdminUser = await db.collection('users').findOne({ email: superAdminEmail });
    if (!superAdminUser) {
      const newSuperAdmin: User = {
        id: randomUUID(),
        email: superAdminEmail,
        tenantSlug: '',
        role: 'super-admin',
        passwordHash: hashPassword(superAdminPassword),
      };
      await db.collection('users').insertOne(newSuperAdmin);
      return newSuperAdmin;
    } else {
      // Self-healing: Ensure they definitely have super-admin privileges and the correct password
      await db.collection('users').updateOne(
        { email: superAdminEmail },
        { $set: { role: 'super-admin', tenantSlug: '', passwordHash: hashPassword(superAdminPassword) } }
      );
      superAdminUser.role = 'super-admin';
      superAdminUser.tenantSlug = '';
      superAdminUser.passwordHash = hashPassword(superAdminPassword);
      return superAdminUser;
    }
  }

  // 2. Authenticate the requested user
  const user = (await db.collection('users').findOne({ email })) as User | null;

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return null;
  }

  // Prevent logins for users belonging to non-active tenants
  if (user.role !== 'super-admin' && user.tenantSlug) {
    const tenant = await db.collection('tenants').findOne({ slug: user.tenantSlug });
    if (tenant && tenant.status && tenant.status !== 'active') {
      throw new Error(`Account access denied. The school is currently ${tenant.status}.`);
    }
  }

  return user;
}

export async function resetTenantAdminCredentials(tenantSlug: string, newEmail: string, newPassword: string) {
  if (!process.env.MONGODB_URI) return false;
  try {
    const db = await getDatabase();
    newEmail = newEmail.toLowerCase().trim();

    const existingUser = await db.collection('users').findOne({ email: newEmail, tenantSlug: { $ne: tenantSlug } });
    if (existingUser) {
      throw new Error('A user with that email already exists in another school.');
    }

    const result = await db.collection('users').updateOne(
      { tenantSlug, role: 'admin' },
      { $set: { email: newEmail, passwordHash: hashPassword(newPassword) } }
    );
    
    if (result.matchedCount === 0) {
      await signUpUser(newEmail, newPassword, tenantSlug, 'admin');
    }
    
    return true;
  } catch (error) {
    console.error('Failed to reset admin credentials:', error);
    return false;
  }
}
