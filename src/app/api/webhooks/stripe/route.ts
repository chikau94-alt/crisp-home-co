import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { sendBookingConfirmation, sendAdminNotification, sendReferralRewardEmail } from '@/lib/email'
import { sendBookingSMS } from '@/lib/sms'
import { createReferralForBooking } from '@/lib/referral'

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

      // Fetch customer info for referral creation
      const { data: fullBooking } = await db
        .from('bookings')
        .select('referral_code, customers ( name, email )')
        .eq('id', booking.id)
        .single()

      const customer = fullBooking?.customers as unknown as { name: string; email: string } | null

      // Fire-and-forget: emails, SMS, referral code creation, referral reward
      Promise.allSettled([
        sendBookingConfirmation(booking.id),
        sendAdminNotification(booking.id),
        sendBookingSMS(booking.id),
        // Create a referral code for this customer so they can refer friends
        customer
          ? createReferralForBooking(booking.id, customer.name, customer.email)
          : Promise.resolve(),
        // If this booking came from a referral, reward the referrer
        fullBooking?.referral_code
          ? (async () => {
              const { data: referral } = await db
                .from('referrals')
                .select('referrer_email, referrer_name')
                .eq('referral_code', fullBooking.referral_code)
                .single()
              if (referral && customer) {
                // Mark referral as used
                await db
                  .from('referrals')
                  .update({
                    referred_email:      customer.email,
                    referred_booking_id: booking.id,
                  })
                  .eq('referral_code', fullBooking.referral_code)
                // Create a $50 reward promo code for the referrer
                const rewardCode = `REWARD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
                await db.from('promo_codes').insert({
                  code:             rewardCode,
                  discount_percent: 0,
                  flat_discount:    50,
                  active:           true,
                  expires_at:       new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
                })
                await sendReferralRewardEmail(
                  referral.referrer_email,
                  referral.referrer_name,
                  customer.name,
                  rewardCode,
                )
              }
            })()
          : Promise.resolve(),
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
