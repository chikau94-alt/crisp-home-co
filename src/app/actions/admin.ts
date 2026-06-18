'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

// ── Cleaner assignment ────────────────────────────────────────────────────────

export interface AssignResult {
  success: boolean
  conflict: boolean
  conflictDetail?: string
}

export async function assignCleaner(
  bookingId: string,
  cleanerId: string | null
): Promise<AssignResult> {
  const db = getSupabaseAdmin()

  if (!cleanerId) {
    await db.from('bookings').update({ cleaner_id: null }).eq('id', bookingId)
    revalidatePath('/admin')
    revalidatePath('/admin/schedule')
    return { success: true, conflict: false }
  }

  // Get this booking's date + window
  const { data: booking } = await db
    .from('bookings')
    .select('scheduled_date, arrival_window')
    .eq('id', bookingId)
    .single()

  if (!booking) throw new Error('Booking not found')

  // Conflict: same cleaner already assigned at same date + window
  const { data: conflicts } = await db
    .from('bookings')
    .select('id, customers(name)')
    .eq('cleaner_id', cleanerId)
    .eq('scheduled_date', booking.scheduled_date)
    .eq('arrival_window', booking.arrival_window)
    .neq('id', bookingId)

  const hasConflict = !!conflicts && conflicts.length > 0
  const conflictName = hasConflict
    ? (conflicts[0]?.customers as unknown as { name: string } | null)?.name ?? 'another booking'
    : undefined

  // Assign regardless — conflict is a warning, not a block
  await db.from('bookings').update({ cleaner_id: cleanerId }).eq('id', bookingId)

  revalidatePath('/admin')
  revalidatePath('/admin/schedule')

  return {
    success: true,
    conflict: hasConflict,
    conflictDetail: hasConflict ? `Already assigned to ${conflictName} at this time` : undefined,
  }
}

// ── Mark booking complete ─────────────────────────────────────────────────────

export async function markBookingComplete(bookingId: string) {
  const { error } = await getSupabaseAdmin()
    .from('bookings')
    .update({ status: 'completed' })
    .eq('id', bookingId)
  if (error) throw new Error('Failed to mark complete: ' + error.message)
  revalidatePath('/admin')
  revalidatePath(`/admin/bookings/${bookingId}`)
}

// ── Completion photo upload ───────────────────────────────────────────────────

export async function uploadCompletionPhoto(formData: FormData) {
  const file      = formData.get('photo') as File
  const bookingId = formData.get('bookingId') as string

  if (!file || !bookingId) throw new Error('Missing file or booking ID')

  const bytes    = await file.arrayBuffer()
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path     = `${bookingId}/${Date.now()}-${safeName}`

  const { error: uploadError } = await getSupabaseAdmin()
    .storage
    .from('booking-photos')
    .upload(path, bytes, { contentType: file.type, upsert: false })

  if (uploadError) throw new Error('Upload failed: ' + uploadError.message)

  const { error: dbError } = await getSupabaseAdmin()
    .from('booking_photos')
    .insert({ booking_id: bookingId, storage_path: path })

  if (dbError) throw new Error('Failed to save photo record: ' + dbError.message)

  revalidatePath(`/admin/bookings/${bookingId}`)
}

export async function deleteBookingPhoto(photoId: string, storagePath: string, bookingId: string) {
  await getSupabaseAdmin().storage.from('booking-photos').remove([storagePath])
  await getSupabaseAdmin().from('booking_photos').delete().eq('id', photoId)
  revalidatePath(`/admin/bookings/${bookingId}`)
}

// ── Send reminder email ───────────────────────────────────────────────────────

export async function sendReminderEmail(bookingId: string) {
  const { sendReminderEmail: send } = await import('@/lib/email')
  await send(bookingId)
}
