import { notFound } from 'next/navigation';
import { getTenantBySlug } from '../../../lib/tenant';
import { getTenantStudents } from '../../../lib/school';
import StudentsClient from './StudentsClient';

export const dynamic = 'force-dynamic';

type Props = {
  params: {
    tenant: string;
  };
};

export default async function StudentsPage({ params }: Props) {
  const tenant = await getTenantBySlug(params.tenant);
  if (!tenant) {
    notFound();
  }

  const students = await getTenantStudents(params.tenant);

  return <StudentsClient students={students} tenant={tenant} />;
}