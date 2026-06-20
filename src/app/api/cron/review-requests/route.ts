import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { sendReviewRequestEmail } from '@/lib/email'

// Runs daily at 10am MT via Vercel cron.
// Finds bookings completed yesterday and sends a review request email.
export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getSupabaseAdmin()

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const dateStr = yesterday.toISOString().split('T')[0]

  // Find confirmed bookings whose scheduled_date was yesterday
  // and haven't had a review request sent yet
  const { data: bookings, error } = await db
    .from('bookings')
    .select('id, customers ( email )')
    .eq('status', 'confirmed')
    .eq('scheduled_date', dateStr)
    .is('review_requested_at', null)

  if (error) {
    console.error('Review cron error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const results = await Promise.allSettled(
    (bookings ?? []).map(async (booking) => {
      await sendReviewRequestEmail(booking.id)
      await db
        .from('bookings')
        .update({ review_requested_at: new Date().toISOString() })
        .eq('id', booking.id)
    })
  )

  const sent   = results.filter(r => r.status === 'fulfilled').length
  const failed = results.filter(r => r.status === 'rejected').length

  return NextResponse.json({ sent, failed })
}
