'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function addCleaner(payload: {
  name: string; phone: string; email: string
}) {
  const { name, phone, email } = payload
  const { error } = await getSupabaseAdmin()
    .from('cleaners')
    .insert({ name, phone, email, active: true })
  if (error) throw new Error('Failed to add cleaner: ' + error.message)
  revalidatePath('/admin/cleaners')
  revalidatePath('/admin')
}

export async function updateCleaner(payload: {
  id: string; name: string; phone: string; email: string; active: boolean
}) {
  const { id, name, phone, email, active } = payload
  const { error } = await getSupabaseAdmin()
    .from('cleaners')
    .update({ name, phone, email, active })
    .eq('id', id)
  if (error) throw new Error('Failed to update cleaner: ' + error.message)
  revalidatePath('/admin/cleaners')
  revalidatePath('/admin')
}
