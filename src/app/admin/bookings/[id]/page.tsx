import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { SIZE_BANDS, FREQUENCIES, fmt } from '@/lib/pricing'
import { markBookingComplete, uploadCompletionPhoto, deleteBookingPhoto, sendReminderEmail, cancelBooking } from '@/app/actions/admin'
import ReminderButton from './ReminderButton'
import DeleteBookingButton from './DeleteBookingButton'

export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ id: string }> }

const WINDOW_LABELS: Record<string, string> = {
  '8-10':  '8–10 AM',
  '10-12': '10 AM–12 PM',
  '12-2':  '12–2 PM',
  '2-4':   '2–4 PM',
  '4-6':   '4–6 PM',
}

export default async function BookingDetailPage({ params }: Props) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) redirect('/admin/login')

  const { id } = await params
  const db = getSupabaseAdmin()

  const { data: booking } = await db
    .from('bookings')
    .select(`
      *,
      customers ( name, email, phone ),
      addresses ( street ),
      cleaners ( name ),
      booking_addons ( addon_type, quantity, unit_price ),
      booking_photos ( id, storage_path, uploaded_at )
    `)
    .eq('id', id)
    .single()

  if (!booking) notFound()

  const sizeBand   = SIZE_BANDS.find(b => b.id === booking.size_band)
  const freqOption = FREQUENCIES.find(f => f.id === booking.frequency)
  const isRecurring = booking.frequency === 'weekly' || booking.frequency === 'biweekly'
  const schedDate  = new Date(booking.scheduled_date + 'T12:00:00')

  // Generate signed URLs for photos (1-hour expiry)
  const rawPhotos = (booking.booking_photos ?? []) as Array<{
    id: string; storage_path: string; uploaded_at: string
  }>
  const photos = await Promise.all(
    rawPhotos.map(async p => {
      const { data } = await db.storage
        .from('booking-photos')
        .createSignedUrl(p.storage_path, 3600)
      return { ...p, url: data?.signedUrl ?? null }
    })
  )

  const addonLabels: Record<string, string> = {
    oven: 'Inside oven', fridge: 'Inside fridge',
    windows: 'Interior windows', laundry: 'Laundry wash & fold',
  }

  return (
    <main className="max-w-3xl mx-auto px-4 md:px-6 py-8">

      {/* Back */}
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink transition-colors mb-6"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to bookings
      </Link>

      <div className="flex flex-col gap-6">

        {/* Booking summary card */}
        <div className="bg-white rounded-xl border border-cream-deep shadow-sm overflow-hidden">
          <div className="px-6 py-5" style={{ background: 'linear-gradient(135deg, #1a2b4a 0%, #11203b 100%)' }}>
            <p className="text-sage-soft/70 text-xs tracking-widest uppercase mb-1">
              Booking #{id.slice(0, 8).toUpperCase()}
            </p>
            <p className="font-[family-name:var(--font-display)] text-white text-xl">
              {sizeBand?.label} · {freqOption?.label}
            </p>
          </div>
          <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <Detail label="Customer"    value={booking.customers.name} />
            <Detail label="Email"       value={booking.customers.email} />
            <Detail label="Phone"       value={booking.customers.phone} />
            <Detail label="Address"     value={booking.addresses.street} />
            <Detail label="Date"        value={schedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} />
            <Detail label="Arrival"     value={WINDOW_LABELS[booking.arrival_window] ?? booking.arrival_window} />
            <Detail label="Cleaner"     value={booking.cleaners?.name ?? 'Unassigned'} />
            <Detail label="Status"      value={booking.status} />
            {isRecurring ? (
              <>
                <Detail label="First clean" value={booking.first_visit_price != null ? fmt(booking.first_visit_price) : '—'} />
                <Detail label="Recurring"   value={booking.recurring_price != null ? fmt(booking.recurring_price) : '—'} />
              </>
            ) : (
              <Detail label="Total" value={booking.one_time_price != null ? fmt(booking.one_time_price) : '—'} />
            )}
          </div>

          {booking.booking_addons?.length > 0 && (
            <div className="px-6 pb-5 border-t border-cream-deep pt-4">
              <p className="text-xs font-semibold text-ink-soft uppercase tracking-wider mb-2">Add-ons</p>
              <div className="flex flex-wrap gap-2">
                {(booking.booking_addons as Array<{ addon_type: string; quantity: number; unit_price: number }>)
                  .map(a => (
                    <span key={a.addon_type} className="text-xs px-2.5 py-1 rounded-full bg-cream border border-cream-deep text-ink-soft">
                      {addonLabels[a.addon_type] ?? a.addon_type}
                      {a.quantity > 1 ? ` ×${a.quantity}` : ''}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Completion photos */}
        <div className="bg-white rounded-xl border border-cream-deep shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-cream-deep flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-display)] text-navy text-xl">Completion photos</h2>
            <span className="text-mist text-sm">{photos.length} photo{photos.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="p-6 flex flex-col gap-5">
            {/* Photo grid */}
            {photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {photos.map(p => (
                  <div key={p.id} className="relative group rounded-lg overflow-hidden border border-cream-deep aspect-square bg-cream">
                    {p.url ? (
                      <Image
                        src={p.url}
                        alt="Completion photo"
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-mist text-xs">
                        Unavailable
                      </div>
                    )}
                    {/* Delete button */}
                    <form
                      action={async () => {
                        'use server'
                        await deleteBookingPhoto(p.id, p.storage_path, id)
                      }}
                    >
                      <button
                        type="submit"
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        aria-label="Delete photo"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          strokeWidth="2.5" strokeLinecap="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            )}

            {/* Upload form */}
            <form
              action={uploadCompletionPhoto}
              className="border-2 border-dashed border-cream-deep rounded-lg px-6 py-8 flex flex-col items-center gap-3"
              encType="multipart/form-data"
            >
              <input type="hidden" name="bookingId" value={id} />
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8a93a3"
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <p className="text-ink-soft text-sm text-center">
                Select photos from the completed clean
              </p>
              <input
                type="file"
                name="photo"
                accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                required
                className="text-sm text-ink-soft file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-sage file:text-navy hover:file:bg-sage-soft file:cursor-pointer file:transition-colors"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-md bg-navy text-white font-semibold text-sm hover:bg-navy/80 transition-colors"
              >
                Upload photo
              </button>
            </form>
          </div>
        </div>

        {/* Reminder email */}
        <ReminderButton bookingId={id} />

        {/* Cancel / Delete */}
        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
          <div className="bg-white rounded-xl border border-cream-deep shadow-sm px-6 py-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-ink text-sm">Cancel booking</p>
              <p className="text-ink-soft text-xs mt-0.5">Marks as cancelled. Keeps the record for your reference.</p>
            </div>
            <form action={async () => { 'use server'; await cancelBooking(id) }}>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-md border border-amber-400 text-amber-700 font-semibold text-sm hover:bg-amber-50 transition-colors whitespace-nowrap"
              >
                Cancel booking
              </button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl border border-red-100 shadow-sm px-6 py-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-red-600 text-sm">Delete booking</p>
            <p className="text-ink-soft text-xs mt-0.5">Permanently removes this booking and all photos. Cannot be undone.</p>
          </div>
          <DeleteBookingButton bookingId={id} />
        </div>

        {/* Mark complete */}
        {booking.status !== 'completed' && (
          <div className="bg-white rounded-xl border border-cream-deep shadow-sm px-6 py-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-ink text-sm">Mark as completed</p>
              <p className="text-ink-soft text-xs mt-0.5">
                Upload photos first, then mark the visit as done.
              </p>
            </div>
            <form action={async () => { 'use server'; await markBookingComplete(id) }}>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-md bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition-colors whitespace-nowrap"
              >
                Mark complete
              </button>
            </form>
          </div>
        )}

        {booking.status === 'completed' && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-6 py-4 flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <p className="text-green-700 text-sm font-medium">This booking has been marked as completed.</p>
          </div>
        )}
      </div>
    </main>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-ink-soft uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-ink text-sm capitalize">{value}</p>
    </div>
  )
}
