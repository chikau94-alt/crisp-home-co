import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { SIZE_BANDS, FREQUENCIES, fmt } from '@/lib/pricing'
import AssignCleanerDropdown from './AssignCleanerDropdown'

interface BookingRow {
  id: string
  size_band: string
  frequency: string
  status: string
  payment_status: string | null
  scheduled_date: string
  arrival_window: string
  created_at: string
  first_visit_price: number | null
  recurring_price: number | null
  one_time_price: number | null
  cleaner_id: string | null
  customers: { name: string; email: string; phone: string }
  addresses:  { street: string }
}

interface CleanerOption { id: string; name: string }

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Admin — Crisp Home Co.' }

const SIZE_LABEL: Record<string, string> = Object.fromEntries(SIZE_BANDS.map(b => [b.id, b.label]))
const FREQ_LABEL: Record<string, string> = Object.fromEntries(FREQUENCIES.map(f => [f.id, f.label]))
const WINDOW_LABEL: Record<string, string> = {
  '8-10':  '8–10 AM', '10-12': '10 AM–12 PM',
  '12-2':  '12–2 PM', '2-4':   '2–4 PM', '4-6':   '4–6 PM',
}
const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
}
const PAYMENT_STYLES: Record<string, string> = {
  pending:   'bg-amber-50 text-amber-600 border-amber-200',
  succeeded: 'bg-green-50 text-green-700 border-green-200',
  failed:    'bg-red-50 text-red-600 border-red-200',
}

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) redirect('/admin/login')

  const db = getSupabaseAdmin()

  const [{ data: rawBookings, error }, { data: cleaners }] = await Promise.all([
    db
      .from('bookings')
      .select(`
        id, size_band, frequency, status, payment_status,
        scheduled_date, arrival_window, created_at,
        first_visit_price, recurring_price, one_time_price,
        cleaner_id,
        customers ( name, email, phone ),
        addresses ( street )
      `)
      .order('created_at', { ascending: false }),
    db
      .from('cleaners')
      .select('id, name')
      .eq('active', true)
      .order('name'),
  ])

  if (error) throw new Error('Failed to load bookings: ' + error.message)

  const bookings       = rawBookings as unknown as BookingRow[]
  const cleanerOptions = (cleaners ?? []) as CleanerOption[]

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total bookings"  value={bookings.length} />
        <StatCard label="Pending"         value={bookings.filter(b => b.status === 'pending').length} />
        <StatCard label="Confirmed"       value={bookings.filter(b => b.status === 'confirmed').length} />
        <StatCard label="Completed"       value={bookings.filter(b => b.status === 'completed').length} />
      </div>

      <div className="bg-white rounded-xl border border-cream-deep shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-cream-deep">
          <h2 className="font-[family-name:var(--font-display)] text-navy text-xl">All bookings</h2>
        </div>

        {bookings.length === 0 ? (
          <div className="px-6 py-16 text-center text-ink-soft">No bookings yet. Share the site!</div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-cream-deep bg-cream/40">
                    {['Date', 'Customer', 'Size', 'Frequency', 'Price', 'Arrival', 'Cleaner', 'Payment', 'Status', ''].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-ink-soft uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, i) => {
                    const price = b.frequency === 'weekly' || b.frequency === 'biweekly'
                      ? b.first_visit_price : b.one_time_price
                    const schedDate = new Date(b.scheduled_date + 'T12:00:00')
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
                        <td className="px-4 py-3 text-ink-soft">{SIZE_LABEL[b.size_band] ?? b.size_band}</td>
                        <td className="px-4 py-3 text-ink-soft">{FREQ_LABEL[b.frequency] ?? b.frequency}</td>
                        <td className="px-4 py-3 font-semibold text-navy">
                          {price != null ? fmt(price) : '—'}
                        </td>
                        <td className="px-4 py-3 text-ink-soft whitespace-nowrap">
                          {WINDOW_LABEL[b.arrival_window] ?? b.arrival_window}
                        </td>
                        <td className="px-4 py-3">
                          <AssignCleanerDropdown
                            bookingId={b.id}
                            cleaners={cleanerOptions}
                            currentCleanerId={b.cleaner_id}
                          />
                        </td>
                        <td className="px-4 py-3">
                          {b.payment_status ? (
                            <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${PAYMENT_STYLES[b.payment_status] ?? 'bg-cream text-ink-soft border-cream-deep'}`}>
                              {b.payment_status}
                            </span>
                          ) : <span className="text-mist text-xs">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${STATUS_STYLES[b.status] ?? 'bg-cream text-ink-soft border-cream-deep'}`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/admin/bookings/${b.id}`}
                            className="text-xs text-ink-soft hover:text-ink border border-cream-deep hover:border-ink-soft/40 rounded-md px-2.5 py-1.5 transition-colors whitespace-nowrap"
                          >
                            Details
                          </Link>
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
                  ? b.first_visit_price : b.one_time_price
                const schedDate = new Date(b.scheduled_date + 'T12:00:00')
                return (
                  <div key={b.id} className="px-5 py-4 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-ink">{b.customers.name}</p>
                        <p className="text-mist text-xs">{b.customers.email}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${STATUS_STYLES[b.status] ?? ''}`}>
                          {b.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-soft">
                      <span>{schedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span>{WINDOW_LABEL[b.arrival_window]}</span>
                      <span>{FREQ_LABEL[b.frequency]}</span>
                      {price != null && <span className="font-semibold text-navy">{fmt(price)}</span>}
                    </div>
                    <AssignCleanerDropdown
                      bookingId={b.id}
                      cleaners={cleanerOptions}
                      currentCleanerId={b.cleaner_id}
                    />
                    <Link
                      href={`/admin/bookings/${b.id}`}
                      className="text-xs text-ink-soft hover:text-ink transition-colors underline underline-offset-2 w-fit"
                    >
                      View details & photos →
                    </Link>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </main>
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
