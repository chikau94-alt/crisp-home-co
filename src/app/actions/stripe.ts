'use server'

import { getStripe } from '@/lib/stripe'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { calculatePrice, fmt, type SizeBand, type Frequency, type AddOns } from '@/lib/pricing'
import type { BookingPayload } from './booking'
import { validatePromoCode } from './promo'

export interface PaymentSessionResult {
  clientSecret: string
  bookingId: string
  amountToday: number
  isRecurring: boolean
  recurringAmount: number | null
  frequencyLabel: string | null
  discountPercent: number
  discountAmount: number
}

export async function createPaymentSession(
  payload: BookingPayload
): Promise<PaymentSessionResult> {
  const stripe = getStripe()
  const db     = getSupabaseAdmin()

  const {
    name, email, phone,
    address, neighborhood, notes,
    sizeBand, frequency, pets, heavyDirty, scheduledDate, arrivalWindow,
    oven, fridge, windows, laundry,
    promoCode,
  } = payload

  // ── Server-side price recalculation (never trust the browser) ────────────────
  const addons: AddOns = { pets, heavyDirty, oven, fridge, windows, laundry }
  const pricing        = calculatePrice(sizeBand as SizeBand, frequency as Frequency, addons)

  const isRecurring  = pricing.kind === 'recurring'
  const baseToday    = isRecurring ? pricing.firstVisitTotal : pricing.total
  const recurringAmt = isRecurring ? pricing.recurringTotal  : null
  const freqLabel    = isRecurring ? pricing.frequencyLabel  : null

  // ── Server-side promo validation (never trust the browser discount) ───────────
  let discountPercent = 0
  if (promoCode?.trim()) {
    const promo = await validatePromoCode(promoCode)
    if (promo.valid) discountPercent = promo.discountPercent
  }

  const discountAmount = discountPercent > 0 ? Math.round(baseToday * discountPercent) / 100 : 0
  const amountToday    = Math.max(0, baseToday - discountAmount)
  const amountCents    = Math.round(amountToday * 100)

  // ── 1. Create Stripe Customer ─────────────────────────────────────────────────
  const stripeCustomer = await stripe.customers.create({ name, email, phone })

  // ── 2. Create PaymentIntent ───────────────────────────────────────────────────
  // setup_future_usage saves the card for later off-session charges on recurring plans
  const paymentIntent = await stripe.paymentIntents.create({
    amount:              amountCents,
    currency:            'usd',
    customer:            stripeCustomer.id,
    setup_future_usage:  isRecurring ? 'off_session' : undefined,
    description:         `Crisp Home Co. — ${isRecurring ? 'first deep clean (recurring plan)' : 'one-time deep clean'}`,
    metadata: {
      sizeBand, frequency, scheduledDate, arrivalWindow,
      address, name, email,
    },
  })

  // ── 3. Insert customer row ────────────────────────────────────────────────────
  const { data: customer, error: custErr } = await db
    .from('customers')
    .insert({ name, email, phone, stripe_customer_id: stripeCustomer.id })
    .select('id')
    .single()

  if (custErr || !customer) throw new Error('Failed to save customer: ' + custErr?.message)

  // ── 4. Insert address row ─────────────────────────────────────────────────────
  const { data: addr, error: addrErr } = await db
    .from('addresses')
    .insert({ customer_id: customer.id, street: address, city: 'Salt Lake City', state: 'UT', notes: notes || null })
    .select('id')
    .single()

  if (addrErr || !addr) throw new Error('Failed to save address: ' + addrErr?.message)

  // ── 5. Insert booking in 'pending' state ──────────────────────────────────────
  const { data: booking, error: bookingErr } = await db
    .from('bookings')
    .insert({
      customer_id:             customer.id,
      address_id:              addr.id,
      size_band:               sizeBand,
      frequency,
      pets,
      heavy:                   heavyDirty,
      status:                  'pending',
      scheduled_date:          scheduledDate,
      arrival_window:          arrivalWindow,
      neighborhood:            neighborhood || null,
      stripe_payment_intent_id: paymentIntent.id,
      payment_status:          'pending',
      first_visit_price:       isRecurring ? amountToday            : null,
      recurring_price:         isRecurring ? pricing.recurringTotal  : null,
      one_time_price:          !isRecurring ? amountToday            : null,
      promo_code:              promoCode?.trim().toUpperCase() || null,
      discount_percent:        discountPercent || null,
    })
    .select('id')
    .single()

  if (bookingErr || !booking) throw new Error('Failed to save booking: ' + bookingErr?.message)

  // ── 6. Insert add-ons ─────────────────────────────────────────────────────────
  const addonRows: { booking_id: string; addon_type: string; quantity: number; unit_price: number }[] = []
  if (oven)        addonRows.push({ booking_id: booking.id, addon_type: 'oven',    quantity: 1,       unit_price: 30 })
  if (fridge)      addonRows.push({ booking_id: booking.id, addon_type: 'fridge',  quantity: 1,       unit_price: 30 })
  if (windows > 0) addonRows.push({ booking_id: booking.id, addon_type: 'windows', quantity: windows, unit_price: 8  })
  if (laundry > 0) addonRows.push({ booking_id: booking.id, addon_type: 'laundry', quantity: laundry, unit_price: 25 })

  if (addonRows.length > 0) {
    await db.from('booking_addons').insert(addonRows)
  }

  return {
    clientSecret:    paymentIntent.client_secret!,
    bookingId:       booking.id,
    amountToday,
    isRecurring,
    recurringAmount: recurringAmt,
    frequencyLabel:  freqLabel,
    discountPercent,
    discountAmount,
  }
}

// ── Off-session charge for a completed recurring visit ─────────────────────────
export async function chargeRecurringVisit(bookingId: string): Promise<void> {
  const stripe = getStripe()
  const db     = getSupabaseAdmin()

  const { data: booking, error } = await db
    .from('bookings')
    .select('recurring_price, customers ( stripe_customer_id, stripe_payment_method_id )')
    .eq('id', bookingId)
    .single()

  if (error || !booking) throw new Error('Booking not found')

  const customer = booking.customers as unknown as {
    stripe_customer_id: string | null
    stripe_payment_method_id: string | null
  }

  if (!customer?.stripe_customer_id || !customer?.stripe_payment_method_id) {
    throw new Error('No saved payment method for this customer')
  }

  if (!booking.recurring_price) {
    throw new Error('No recurring price set on this booking')
  }

  const amountCents = Math.round(booking.recurring_price * 100)

  await stripe.paymentIntents.create({
    amount:         amountCents,
    currency:       'usd',
    customer:       customer.stripe_customer_id,
    payment_method: customer.stripe_payment_method_id,
    description:    `Crisp Home Co. — recurring visit charge`,
    off_session:    true,
    confirm:        true,
    metadata:       { bookingId },
  })
}

export { fmt }
