import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { SIZE_BANDS, FREQUENCIES } from '@/lib/pricing'
import { DateNav, ViewToggle, getMonday } from './ScheduleControls'

interface BookingSlot {
  id: string
  scheduled_date: string
  arrival_window: string
  size_band: string
  frequency: string
  status: string
  neighborhood: string | null
  customers: { name: string }
  addresses: { street: string }
  cleaners: { id: string; name: string } | null
}

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Schedule — Crisp Home Co.' }

const WINDOW_LABELS: Record<string, string> = {
  '8-10':  '8–10 AM',
  '10-12': '10 AM–12 PM',
  '12-2':  '12–2 PM',
  '2-4':   '2–4 PM',
  '4-6':   '4–6 PM',
}
const WINDOWS = ['8-10', '10-12', '12-2', '2-4', '4-6']

const SIZE_LABEL: Record<string, string> = Object.fromEntries(SIZE_BANDS.map(b => [b.id, b.label]))
const FREQ_LABEL: Record<string, string> = Object.fromEntries(FREQUENCIES.map(f => [f.id, f.label]))

interface Props {
  searchParams: Promise<{ date?: string; view?: string }>
}

export default async function SchedulePage({ searchParams }: Props) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) redirect('/admin/login')

  const sp   = await searchParams
  const view = (sp.view === 'week' ? 'week' : 'day') as 'day' | 'week'
  const today = new Date().toISOString().split('T')[0]
  const date  = sp.date ?? today

  const db = getSupabaseAdmin()

  // Determine date range to fetch
  let dateFrom: string, dateTo: string
  if (view === 'week') {
    const mon = getMonday(new Date(date + 'T12:00:00'))
    const sun = new Date(mon); sun.setDate(mon.getDate() + 6)
    dateFrom = mon.toISOString().split('T')[0]
    dateTo   = sun.toISOString().split('T')[0]
  } else {
    dateFrom = date
    dateTo   = date
  }

  const { data: bookings } = await db
    .from('bookings')
    .select(`
      id, scheduled_date, arrival_window, size_band, frequency, status, neighborhood,
      customers ( name ),
      addresses ( street ),
      cleaners ( id, name )
    `)
    .gte('scheduled_date', dateFrom)
    .lte('scheduled_date', dateTo)
    .in('status', ['confirmed', 'pending', 'completed'])
    .order('scheduled_date')
    .order('arrival_window')

  const rows = (bookings ?? []) as unknown as BookingSlot[]

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <DateNav date={date} view={view} />
        <div className="ml-auto">
          <ViewToggle view={view} />
        </div>
      </div>

      {view === 'day' ? (
        <DayView bookings={rows} date={date} today={today} />
      ) : (
        <WeekView bookings={rows} startDate={dateFrom} today={today} />
      )}
    </main>
  )
}

// ── Day view ──────────────────────────────────────────────────────────────────

function DayView({
  bookings, date, today,
}: {
  bookings: BookingSlot[]
  date: string
  today: string
}) {
  const byWindow = Object.fromEntries(WINDOWS.map(w => [w, [] as BookingSlot[]]))
  for (const b of bookings) {
    if (byWindow[b.arrival_window]) byWindow[b.arrival_window].push(b)
  }

  const hasAny = bookings.length > 0

  return (
    <div className="flex flex-col gap-4">
      {!hasAny && (
        <div className="bg-white rounded-xl border border-cream-deep shadow-sm px-6 py-16 text-center text-ink-soft">
          No bookings {date === today ? 'today' : 'on this date'}.
        </div>
      )}
      {WINDOWS.map(w => {
        const slots = byWindow[w]
        if (!slots.length) return null
        return (
          <div key={w} className="bg-white rounded-xl border border-cream-deep shadow-sm overflow-hidden">
            <div className="px-6 py-3 border-b border-cream-deep bg-cream/40 flex items-center justify-between">
              <p className="font-semibold text-sm text-navy">{WINDOW_LABELS[w]}</p>
              <p className="text-mist text-xs">{slots.length} booking{slots.length > 1 ? 's' : ''}</p>
            </div>
            <div className="divide-y divide-cream-deep">
              {slots.map(b => (
                <DayBookingRow key={b.id} booking={b} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function DayBookingRow({ booking: b }: { booking: BookingSlot }) {
  return (
    <div className="px-6 py-4 flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="font-semibold text-ink text-sm truncate">{b.customers.name}</p>
          <StatusPip status={b.status} />
        </div>
        <p className="text-ink-soft text-xs truncate">{b.addresses.street}</p>
        <p className="text-mist text-xs">{SIZE_LABEL[b.size_band]} · {FREQ_LABEL[b.frequency]}</p>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        {b.cleaners ? (
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-navy flex items-center justify-center text-white text-[10px] font-semibold">
              {b.cleaners.name.charAt(0)}
            </div>
            <span className="text-sm text-ink">{b.cleaners.name}</span>
          </div>
        ) : (
          <span className="text-xs text-amber-600 font-medium">Unassigned</span>
        )}
        <Link
          href={`/admin/bookings/${b.id}`}
          className="text-xs text-ink-soft hover:text-ink transition-colors border border-cream-deep rounded-md px-2.5 py-1 hover:border-ink-soft/40"
        >
          Details
        </Link>
      </div>
    </div>
  )
}

// ── Week view ─────────────────────────────────────────────────────────────────

function WeekView({
  bookings, startDate, today,
}: {
  bookings: BookingSlot[]
  startDate: string
  today: string
}) {
  const days: string[] = []
  const base = new Date(startDate + 'T12:00:00')
  for (let i = 0; i < 7; i++) {
    const d = new Date(base); d.setDate(base.getDate() + i)
    days.push(d.toISOString().split('T')[0])
  }

  const idx: Record<string, Record<string, BookingSlot[]>> = {}
  for (const d of days) {
    idx[d] = Object.fromEntries(WINDOWS.map(w => [w, []]))
  }
  for (const b of bookings) {
    idx[b.scheduled_date]?.[b.arrival_window]?.push(b)
  }

  return (
    <div className="bg-white rounded-xl border border-cream-deep shadow-sm overflow-hidden">
      {/* Header row */}
      <div className="grid border-b border-cream-deep" style={{ gridTemplateColumns: '100px repeat(7, 1fr)' }}>
        <div className="px-3 py-3 bg-cream/40" />
        {days.map(d => {
          const dt     = new Date(d + 'T12:00:00')
          const isToday = d === today
          return (
            <div key={d} className={`px-3 py-3 text-center border-l border-cream-deep ${isToday ? 'bg-navy/5' : 'bg-cream/40'}`}>
              <p className={`text-[11px] font-medium uppercase tracking-wide ${isToday ? 'text-navy' : 'text-mist'}`}>
                {dt.toLocaleDateString('en-US', { weekday: 'short' })}
              </p>
              <p className={`text-base font-semibold ${isToday ? 'text-navy' : 'text-ink'}`}>
                {dt.getDate()}
              </p>
            </div>
          )
        })}
      </div>

      {/* Window rows */}
      {WINDOWS.map(w => (
        <div key={w} className="grid border-b border-cream-deep last:border-b-0" style={{ gridTemplateColumns: '100px repeat(7, 1fr)' }}>
          <div className="px-3 py-3 flex items-start">
            <span className="text-[11px] font-semibold text-mist">{WINDOW_LABELS[w]}</span>
          </div>
          {days.map(d => {
            const slots = idx[d]?.[w] ?? []
            const isToday = d === today
            return (
              <div key={d} className={`px-2 py-2 border-l border-cream-deep min-h-[60px] ${isToday ? 'bg-navy/5' : ''}`}>
                {slots.map(b => (
                  <Link key={b.id} href={`/admin/bookings/${b.id}`}>
                    <div className="rounded-md px-2 py-1.5 mb-1 text-[11px] leading-snug bg-sage/10 hover:bg-sage/20 transition-colors">
                      <p className="font-semibold text-navy truncate">{b.customers.name}</p>
                      {b.cleaners && (
                        <p className="text-ink-soft truncate">{b.cleaners.name}</p>
                      )}
                      {!b.cleaners && (
                        <p className="text-amber-600">Unassigned</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

function StatusPip({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending:   'bg-amber-400',
    confirmed: 'bg-blue-400',
    completed: 'bg-green-500',
    cancelled: 'bg-red-400',
  }
  return (
    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colors[status] ?? 'bg-mist'}`} />
  )
}
