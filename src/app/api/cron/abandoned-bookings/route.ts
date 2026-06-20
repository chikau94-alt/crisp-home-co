import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { sendAbandonedBookingEmail } from '@/lib/email'

// Runs every hour via Vercel cron.
// Finds customers created 1 hour ago with no confirmed booking and emails them.
export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getSupabaseAdmin()

  const oneHourAgo  = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()

  // Customers created 1-2 hours ago whose booking is still pending
  const { data: bookings, error } = await db
    .from('bookings')
    .select('id, customers ( name, email )')
    .eq('status', 'pending')
    .eq('payment_status', 'pending')
    .gte('created_at', twoHoursAgo)
    .lte('created_at', oneHourAgo)
    .is('abandoned_email_sent_at', null)

  if (error) {
    console.error('Abandoned cron error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const results = await Promise.allSettled(
    (bookings ?? []).map(async (booking) => {
      const customer = booking.customers as unknown as { name: string; email: string }
      const firstName = customer.name.split(' ')[0]
      await sendAbandonedBookingEmail(customer.email, firstName)
      await db
        .from('bookings')
        .update({ abandoned_email_sent_at: new Date().toISOString() })
        .eq('id', booking.id)
    })
  )

  const sent   = results.filter(r => r.status === 'fulfilled').length
  const failed = results.filter(r => r.status === 'rejected').length

  return NextResponse.json({ sent, failed })
}
