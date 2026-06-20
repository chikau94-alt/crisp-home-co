import { notFound } from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import { getSupabaseAdmin as supabaseAdmin } from '@/lib/supabase/admin'
import { SIZE_BANDS, FREQUENCIES, fmt } from '@/lib/pricing'

export const dynamic = 'force-dynamic'

interface Props {
  params:      Promise<{ id: string }>
  searchParams: Promise<{ redirect_status?: string; payment_intent?: string }>
}

export default async function BookingConfirmationPage({ params, searchParams }: Props) {
  const { id }             = await params
  const { redirect_status } = await searchParams

  const { data: booking } = await supabaseAdmin()
    .from('bookings')
    .select(`
      *,
      customers ( name, email, phone ),
      addresses ( street ),
      booking_addons ( addon_type, quantity, unit_price )
    `)
    .eq('id', id)
    .single()

  if (!booking) notFound()

  const sizeBand    = SIZE_BANDS.find(b => b.id === booking.size_band)
  const freqOption  = FREQUENCIES.find(f => f.id === booking.frequency)
  const isRecurring = booking.frequency === 'weekly' || booking.frequency === 'biweekly'

  // After Stripe redirect, redirect_status=succeeded means payment went through
  // even if the webhook hasn't confirmed the DB row yet
  const paymentSucceeded =
    redirect_status === 'succeeded' ||
    booking.payment_status === 'succeeded' ||
    booking.status === 'confirmed'

  const paymentFailed =
    redirect_status === 'failed' ||
    booking.payment_status === 'failed'

  const scheduledDate  = new Date(booking.scheduled_date + 'T12:00:00')
  const formattedDate  = scheduledDate.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })

  const windowMap: Record<string, string> = {
    '8-10':  '8–10 AM',
    '10-12': '10 AM–12 PM',
    '12-2':  '12–2 PM',
    '2-4':   '2–4 PM',
    '4-6':   '4–6 PM',
  }
  const windowLabel = windowMap[booking.arrival_window] ?? booking.arrival_window

  const addonLabels: Record<string, string> = {
    oven:    'Inside oven',
    fridge:  'Inside fridge',
    windows: 'Interior windows',
    laundry: 'Laundry wash & fold',
  }

  if (paymentFailed) {
    return (
      <div className="min-h-screen bg-cream font-[family-name:var(--font-body)] px-4 py-16 md:py-24">
        <div className="max-w-lg mx-auto flex flex-col items-center text-center gap-6">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#dc2626"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-navy text-3xl">Payment failed</h1>
            <p className="text-ink-soft mt-2">Your card was not charged. Please try again.</p>
          </div>
          <Link
            href="/#book"
            className="px-6 py-3 rounded-md bg-sage text-navy font-semibold text-sm hover:bg-sage-soft transition-colors"
          >
            Try again
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream font-[family-name:var(--font-body)] px-4 py-16 md:py-24">
      {paymentSucceeded && (
        <Script id="gads-conversion" strategy="afterInteractive">
          {`gtag('event', 'conversion', {
            'send_to': 'AW-18254764683/9GlYCRbk2MicIulxoBE',
            'transaction_id': '${id}'
          });`}
        </Script>
      )}
      <div className="max-w-lg mx-auto flex flex-col items-center text-center gap-8">

        {/* Animated checkmark */}
        <div className="animate-pop-in">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden>
            <circle cx="40" cy="40" r="40" fill="#9eaa8f" fillOpacity="0.12" />
            <circle cx="40" cy="40" r="30" fill="#9eaa8f" fillOpacity="0.18" />
            <polyline
              points="24,40 35,51 56,29"
              fill="none"
              stroke="#9eaa8f"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="65"
              className="animate-draw-check"
            />
          </svg>
        </div>

        <div>
          <h1 className="font-[family-name:var(--font-display)] text-navy text-4xl md:text-5xl leading-tight">
            Consider it handled.
          </h1>
          <p className="font-[family-name:var(--font-display)] italic text-sage text-xl mt-2">
            Come home to crisp.
          </p>
        </div>

        <p className="text-ink-soft leading-relaxed max-w-sm">
          {paymentSucceeded
            ? <>Payment confirmed. We&apos;ve received your booking, {booking.customers.name.split(' ')[0]}. A confirmation will be sent to <span className="text-ink">{booking.customers.email}</span>.</>
            : <>We&apos;ve received your booking, {booking.customers.name.split(' ')[0]}. A confirmation will be sent to <span className="text-ink">{booking.customers.email}</span>.</>
          }
        </p>

        {/* Receipt card */}
        <div className="w-full bg-white rounded-xl border border-cream-deep shadow-sm overflow-hidden text-left">

          <div
            className="px-6 py-5"
            style={{ background: 'linear-gradient(135deg, #1a2b4a 0%, #11203b 100%)' }}
          >
            <p className="text-sage-soft/70 text-xs tracking-widest uppercase mb-1">
              Booking #{id.slice(0, 8).toUpperCase()}
            </p>
            <p className="font-[family-name:var(--font-display)] text-white text-lg leading-snug">
              {sizeBand?.label} &middot; {freqOption?.label}
            </p>
          </div>

          <div className="px-6 py-5 flex flex-col gap-3 text-sm">
            <Row label="Date"           value={formattedDate} />
            <Row label="Arrival window" value={windowLabel} />
            <Row label="Address"        value={booking.addresses.street} />

            <div className="h-px bg-cream-deep my-1" />

            {isRecurring ? (
              <>
                <Row label="Charged today (first deep clean)" value={fmt(booking.first_visit_price)} bold />
                <Row
                  label={`Then per ${booking.frequency === 'weekly' ? 'week' : '2 weeks'}`}
                  value={fmt(booking.recurring_price)}
                />
              </>
            ) : (
              <Row
                label={booking.frequency === 'monthly' ? 'Per month' : 'Deep clean total'}
                value={fmt(booking.one_time_price)}
                bold
              />
            )}

            {booking.booking_addons?.length > 0 && (
              <>
                <div className="h-px bg-cream-deep my-1" />
                {booking.booking_addons.map((a: {
                  addon_type: string; quantity: number; unit_price: number
                }) => (
                  <Row
                    key={a.addon_type}
                    label={`${addonLabels[a.addon_type] ?? a.addon_type}${a.quantity > 1 ? ` ×${a.quantity}` : ''}`}
                    value={fmt(a.quantity * a.unit_price)}
                  />
                ))}
              </>
            )}
          </div>
        </div>

        {/* Referral CTA */}
        <div className="w-full bg-white rounded-xl border border-cream-deep shadow-sm p-6 text-center">
          <p className="font-[family-name:var(--font-display)] text-navy text-lg mb-1">Give $50, Get $50</p>
          <p className="text-ink-soft text-sm mb-4">Refer a friend and you both get $50 off your next clean.</p>
          <Link
            href="/refer"
            className="inline-block px-6 py-2.5 rounded-md bg-sage text-navy font-semibold text-sm hover:bg-sage-soft transition-colors"
          >
            Get My Referral Link →
          </Link>
        </div>

        <Link
          href="/#book"
          className="text-ink-soft text-sm hover:text-ink transition-colors underline underline-offset-4"
        >
          Start a new booking
        </Link>
      </div>
    </div>
  )
}

function Row({ label, value, bold }: { label: string; value: string | number; bold?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-ink-soft">{label}</span>
      <span className={bold ? 'font-semibold text-navy' : 'text-ink'}>{value}</span>
    </div>
  )
}
