'use server'

import { redirect } from 'next/navigation'
import { getSupabaseAdmin as supabaseAdmin } from '@/lib/supabase/admin'
import { calculatePrice, type SizeBand, type Frequency, type AddOns } from '@/lib/pricing'

export interface BookingPayload {
  // Customer
  name: string
  email: string
  phone: string
  // Address
  address: string
  neighborhood: string
  notes: string
  // Service
  sizeBand: SizeBand
  frequency: Frequency
  pets: boolean
  heavyDirty: boolean
  scheduledDate: string  // ISO date string (YYYY-MM-DD)
  arrivalWindow: string
  // À-la-carte quantities (0 = not selected)
  oven: boolean
  fridge: boolean
  windows: number
  laundry: number
}

export async function submitBooking(payload: BookingPayload): Promise<never> {
  const {
    name, email, phone,
    address, neighborhood, notes,
    sizeBand, frequency, pets, heavyDirty, scheduledDate, arrivalWindow,
    oven, fridge, windows, laundry,
  } = payload

  // Recalculate price server-side — never trust client-provided numbers.
  const addons: AddOns = { pets, heavyDirty, oven, fridge, windows, laundry }
  const pricing = calculatePrice(sizeBand, frequency, addons)

  // ── 1. Insert customer ──────────────────────────────────────────────────────
  const { data: customer, error: custErr } = await supabaseAdmin()
    .from('customers')
    .insert({ name, email, phone })
    .select('id')
    .single()

  if (custErr || !customer) {
    throw new Error('Failed to save customer: ' + custErr?.message)
  }

  // ── 2. Insert address ───────────────────────────────────────────────────────
  // Parse "123 Main St, Salt Lake City, UT 84101" into parts best-effort;
  // store the full string in street if parsing isn't clean.
  const { data: addr, error: addrErr } = await supabaseAdmin()
    .from('addresses')
    .insert({
      customer_id: customer.id,
      street:      address,
      city:        'Salt Lake City',
      state:       'UT',
      notes:       notes || null,
    })
    .select('id')
    .single()

  if (addrErr || !addr) {
    throw new Error('Failed to save address: ' + addrErr?.message)
  }

  // ── 3. Insert booking ────────────────────────────────────────────────────────
  const bookingRow = {
    customer_id:       customer.id,
    address_id:        addr.id,
    size_band:         sizeBand,
    frequency,
    pets,
    heavy:             heavyDirty,
    status:            'pending' as const,
    scheduled_date:    scheduledDate,
    arrival_window:    arrivalWindow,
    neighborhood:      neighborhood || null,
    // Price fields — set only what applies to this frequency type.
    first_visit_price: pricing.kind === 'recurring' ? pricing.firstVisitTotal  : null,
    recurring_price:   pricing.kind === 'recurring' ? pricing.recurringTotal   : null,
    one_time_price:    pricing.kind === 'single'    ? pricing.total            : null,
  }

  const { data: booking, error: bookingErr } = await supabaseAdmin()
    .from('bookings')
    .insert(bookingRow)
    .select('id')
    .single()

  if (bookingErr || !booking) {
    throw new Error('Failed to save booking: ' + bookingErr?.message)
  }

  // ── 4. Insert add-ons ────────────────────────────────────────────────────────
  const addonRows: {
    booking_id: string
    addon_type: string
    quantity: number
    unit_price: number
  }[] = []

  if (oven)         addonRows.push({ booking_id: booking.id, addon_type: 'oven',    quantity: 1,       unit_price: 30 })
  if (fridge)       addonRows.push({ booking_id: booking.id, addon_type: 'fridge',  quantity: 1,       unit_price: 30 })
  if (windows > 0)  addonRows.push({ booking_id: booking.id, addon_type: 'windows', quantity: windows, unit_price: 8  })
  if (laundry > 0)  addonRows.push({ booking_id: booking.id, addon_type: 'laundry', quantity: laundry, unit_price: 25 })

  if (addonRows.length > 0) {
    const { error: addonErr } = await supabaseAdmin()
      .from('booking_addons')
      .insert(addonRows)

    if (addonErr) {
      throw new Error('Failed to save add-ons: ' + addonErr?.message)
    }
  }

  // Redirect to the confirmation page — throws internally (Next.js redirect).
  redirect(`/booking/${booking.id}`)
}
