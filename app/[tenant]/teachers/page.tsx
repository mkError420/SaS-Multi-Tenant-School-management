import { getTenantBySlug } from '../../../lib/tenant';
import { getTenantTeachers } from '../../../lib/school';
import TeachersManager from '../../../components/TeachersManager';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function TeachersPage({ params }: { params: { tenant: string } }) {
  const tenant = await getTenantBySlug(params.tenant);
  
  if (!tenant) {
    redirect('/');
  }

  const teachers = await getTenantTeachers(tenant.slug);

  return (
    <div className="animate-in fade-in duration-300">
      <TeachersManager tenantSlug={tenant.slug} initialTeachers={teachers} />
    </div>
  );
}