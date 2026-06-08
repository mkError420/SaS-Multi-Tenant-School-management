'use server';

import { createContactMessage } from '../lib/school';

export async function submitContactMessageAction(payload: { name: string; email: string; subject: string; message: string; }) {
  const success = await createContactMessage(payload);
  return { success };
}