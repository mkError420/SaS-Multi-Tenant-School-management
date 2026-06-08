import { getTenantBySlug } from '../../../lib/tenant';
import { getTenantStudents } from '../../../lib/school';
import StudentsManager from '../../../components/StudentsManager';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function StudentsPage({ params }: { params: { tenant: string } }) {
  const tenant = await getTenantBySlug(params.tenant);
  
  if (!tenant) {
    redirect('/');
  }

  const students = await getTenantStudents(tenant.slug);

  return (
    <div className="animate-in fade-in duration-300">
      <StudentsManager tenantSlug={tenant.slug} initialStudents={students} />
    </div>
  );
}