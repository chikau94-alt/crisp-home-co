import twilio from 'twilio'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

export async function sendBookingSMS(bookingId: string): Promise<void> {
  const db = getSupabaseAdmin()

  const { data: booking } = await db
    .from('bookings')
    .select(`
      scheduled_date,
      arrival_window,
      frequency,
      size_band,
      one_time_price,
      first_visit_price,
      customers ( name, phone ),
      addresses ( street )
    `)
    .eq('id', bookingId)
    .single()

  if (!booking) return

  const customer = booking.customers as unknown as { name: string; phone: string }
  const address  = booking.addresses  as unknown as { street: string }
  const price    = booking.first_visit_price ?? booking.one_time_price ?? 0

  const body = [
    `🏠 New Crisp booking!`,
    `👤 ${customer.name} · ${customer.phone}`,
    `📍 ${address.street}`,
    `📅 ${booking.scheduled_date} · ${booking.arrival_window}`,
    `🔁 ${booking.frequency} · ${booking.size_band}`,
    `💰 $${price} today`,
    `🔗 crisphomeco.com/admin`,
  ].join('\n')

  await client.messages.create({
    body,
    from: process.env.TWILIO_FROM_NUMBER!,
    to:   process.env.ADMIN_PHONE!,
  })
}
