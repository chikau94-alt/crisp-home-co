import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { sendBookingConfirmation, sendAdminNotification } from '@/lib/email'
import { sendBookingSMS } from '@/lib/sms'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig  = request.headers.get('stripe-signature') ?? ''

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(
      body, sig, process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const db = getSupabaseAdmin()

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent

    const { data: booking } = await db
      .from('bookings')
      .select('id, frequency')
      .eq('stripe_payment_intent_id', pi.id)
      .single()

    if (booking) {
      await db
        .from('bookings')
        .update({ status: 'confirmed', payment_status: 'succeeded' })
        .eq('id', booking.id)

      const isRecurring = booking.frequency === 'weekly' || booking.frequency === 'biweekly'
      if (isRecurring && pi.payment_method && pi.customer) {
        await db
          .from('customers')
          .update({ stripe_payment_method_id: pi.payment_method as string })
          .eq('stripe_customer_id', pi.customer as string)
      }

      // Send emails — fire-and-forget (don't let email failures break the webhook response)
      Promise.allSettled([
        sendBookingConfirmation(booking.id),
        sendAdminNotification(booking.id),
        sendBookingSMS(booking.id),
      ]).catch(() => {})
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const pi = event.data.object as Stripe.PaymentIntent
    await db
      .from('bookings')
      .update({ payment_status: 'failed' })
      .eq('stripe_payment_intent_id', pi.id)
  }

  return NextResponse.json({ received: true })
}
