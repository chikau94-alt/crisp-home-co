import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseAdmin as supabaseAdmin } from '@/lib/supabase/admin'
import { SIZE_BANDS, FREQUENCIES, fmt } from '@/lib/pricing'
import SignOutButton from './SignOutButton'

interface BookingRow {
  id: string
  size_band: string
  frequency: string
  status: string
  scheduled_date: string
  arrival_window: string
  created_at: string
  first_visit_price: number | null
  recurring_price: number | null
  one_time_price: number | null
  pets: boolean
  heavy: boolean
  customers: { name: string; email: string; phone: string }
  addresses:  { street: string }
}

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Admin — Crisp Home Co.' }

const SIZE_LABEL: Record<string, string> = Object.fromEntries(
  SIZE_BANDS.map(b => [b.id, b.label])
)
const FREQ_LABEL: Record<string, string> = Object.fromEntries(
  FREQUENCIES.map(f => [f.id, f.label])
)
const WINDOW_LABEL: Record<string, string> = {
  '8-10':  '8–10 AM',
  '10-12': '10 AM–12 PM',
  '12-2':  '12–2 PM',
  '2-4':   '2–4 PM',
  '4-6':   '4–6 PM',
}
const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
}

export default async function AdminPage() {
  // Verify session via the SSR client (middleware already guards this route,
  // but we double-check here to be explicit).
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect('/admin/login')
  }

  // Fetch all bookings newest first using the service-role client.
  const { data: rawBookings, error } = await supabaseAdmin()
    .from('bookings')
    .select(`
      id, size_band, frequency, status,
      scheduled_date, arrival_window, created_at,
      first_visit_price, recurring_price, one_time_price,
      pets, heavy,
      customers ( name, email, phone ),
      addresses ( street )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('Failed to load bookings: ' + error.message)
  }

  const bookings = rawBookings as unknown as BookingRow[]

  return (
    <div className="min-h-screen bg-cream font-[family-name:var(--font-body)]">

      {/* Top bar */}
      <header
        className="px-6 py-4 flex items-center justify-between"
        style={{ background: '#1a2b4a' }}
      >
        <div>
          <p className="font-[family-name:var(--font-display)] text-white text-lg">
            Crisp Home Co.
          </p>
          <p className="text-sage-soft/70 text-xs">Admin dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-mist text-xs hidden md:block">{user.email}</p>
          <SignOutButton />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total bookings"  value={bookings.length} />
          <StatCard label="Pending"         value={bookings.filter(b => b.status === 'pending').length} />
          <StatCard label="Confirmed"       value={bookings.filter(b => b.status === 'confirmed').length} />
          <StatCard label="Completed"       value={bookings.filter(b => b.status === 'completed').length} />
        </div>

        {/* Bookings table */}
        <div className="bg-white rounded-xl border border-cream-deep shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-cream-deep">
            <h2 className="font-[family-name:var(--font-display)] text-navy text-xl">
              All bookings
            </h2>
          </div>

          {bookings.length === 0 ? (
            <div className="px-6 py-16 text-center text-ink-soft">
              No bookings yet. Share the site!
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-cream-deep bg-cream/40">
                      {['Date', 'Customer', 'Size', 'Frequency', 'Price', 'Arrival', 'Status', 'Booked'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-ink-soft uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b, i) => {
                      const price = b.frequency === 'weekly' || b.frequency === 'biweekly'
                        ? b.first_visit_price
                        : b.one_time_price
                      const schedDate = new Date(b.scheduled_date + 'T12:00:00')
                      const createdDate = new Date(b.created_at)
                      return (
                        <tr
                          key={b.id}
                          className={`border-b border-cream-deep/50 hover:bg-cream/30 transition-colors ${i % 2 === 0 ? '' : 'bg-cream/20'}`}
                        >
                          <td className="px-4 py-3 font-medium text-navy whitespace-nowrap">
                            {schedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-medium text-ink">{b.customers.name}</p>
                            <p className="text-mist text-xs">{b.customers.email}</p>
                          </td>
                          <td className="px-4 py-3 text-ink-soft">
                            {SIZE_LABEL[b.size_band] ?? b.size_band}
                          </td>
                          <td className="px-4 py-3 text-ink-soft">
                            {FREQ_LABEL[b.frequency] ?? b.frequency}
                          </td>
                          <td className="px-4 py-3 font-semibold text-navy">
                            {price != null ? fmt(price) : '—'}
                          </td>
                          <td className="px-4 py-3 text-ink-soft whitespace-nowrap">
                            {WINDOW_LABEL[b.arrival_window] ?? b.arrival_window}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${STATUS_STYLES[b.status] ?? 'bg-cream text-ink-soft border-cream-deep'}`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-mist text-xs whitespace-nowrap">
                            {createdDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-cream-deep">
                {bookings.map(b => {
                  const price = b.frequency === 'weekly' || b.frequency === 'biweekly'
                    ? b.first_visit_price
                    : b.one_time_price
                  const schedDate = new Date(b.scheduled_date + 'T12:00:00')
                  return (
                    <div key={b.id} className="px-5 py-4 flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-ink">{b.customers.name}</p>
                          <p className="text-mist text-xs">{b.customers.email}</p>
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize flex-shrink-0 ${STATUS_STYLES[b.status] ?? 'bg-cream text-ink-soft border-cream-deep'}`}>
                          {b.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-soft">
                        <span>{schedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span>{WINDOW_LABEL[b.arrival_window]}</span>
                        <span>{FREQ_LABEL[b.frequency]}</span>
                        {price != null && <span className="font-semibold text-navy">{fmt(price)}</span>}
                      </div>
                      <p className="text-xs text-mist">{SIZE_LABEL[b.size_band]}</p>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-xl border border-cream-deep shadow-sm px-5 py-4">
      <p className="text-mist text-xs uppercase tracking-wider mb-1">{label}</p>
      <p className="font-[family-name:var(--font-display)] text-navy text-3xl">{value}</p>
    </div>
  )
}
