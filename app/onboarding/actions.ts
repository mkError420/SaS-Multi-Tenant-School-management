'use server';

import { onboardTenant, type OnboardTenantPayload } from '../../lib/school';
import { revalidatePath } from 'next/cache';

export async function submitOrderAction(payload: OnboardTenantPayload) {
  try {
    const result = await onboardTenant(payload);
    revalidatePath('/super-admin');
    return { success: true, slug: result.slug };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}