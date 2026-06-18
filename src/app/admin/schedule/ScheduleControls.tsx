'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

const WINDOWS = ['8-10', '10-12', '12-2', '2-4', '4-6']

export function ViewToggle({ view }: { view: 'day' | 'week' }) {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  function setView(v: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('view', v)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex rounded-md border border-cream-deep overflow-hidden">
      {(['day', 'week'] as const).map(v => (
        <button
          key={v}
          onClick={() => setView(v)}
          className={[
            'px-4 py-2 text-sm font-medium capitalize transition-colors',
            view === v ? 'bg-navy text-white' : 'bg-white text-ink-soft hover:text-ink',
          ].join(' ')}
        >
          {v}
        </button>
      ))}
    </div>
  )
}

export function DateNav({ date, view }: { date: string; view: 'day' | 'week' }) {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  function navigate(offsetDays: number) {
    const d = new Date(date + 'T12:00:00')
    d.setDate(d.getDate() + (view === 'week' ? offsetDays * 7 : offsetDays))
    const params = new URLSearchParams(searchParams.toString())
    params.set('date', d.toISOString().split('T')[0])
    router.push(`${pathname}?${params.toString()}`)
  }

  const displayDate = new Date(date + 'T12:00:00')
  const today       = new Date().toISOString().split('T')[0]

  const label = view === 'week'
    ? weekRangeLabel(displayDate)
    : displayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => navigate(-1)}
        className="w-8 h-8 rounded-md border border-cream-deep bg-white flex items-center justify-center hover:border-ink-soft/40 transition-colors"
        aria-label="Previous"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <span className="text-ink font-medium text-sm min-w-[200px] text-center">{label}</span>
      <button
        onClick={() => navigate(1)}
        className="w-8 h-8 rounded-md border border-cream-deep bg-white flex items-center justify-center hover:border-ink-soft/40 transition-colors"
        aria-label="Next"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
      {date !== today && (
        <button
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString())
            params.set('date', today)
            router.push(`${pathname}?${params.toString()}`)
          }}
          className="text-xs text-ink-soft hover:text-ink transition-colors underline underline-offset-2"
        >
          Today
        </button>
      )}
    </div>
  )
}

export function WeekDayLink({ targetDate }: { targetDate: string }) {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  function go() {
    const params = new URLSearchParams(searchParams.toString())
    params.set('date', targetDate)
    params.set('view', 'day')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <button onClick={go} className="hover:underline underline-offset-2 text-left w-full">
    </button>
  )
}

function weekRangeLabel(d: Date): string {
  const mon = getMonday(d)
  const sun = new Date(mon)
  sun.setDate(mon.getDate() + 6)
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  return `${mon.toLocaleDateString('en-US', opts)} – ${sun.toLocaleDateString('en-US', opts)}`
}

export function getMonday(d: Date): Date {
  const result = new Date(d)
  const day = result.getDay()
  const diff = day === 0 ? -6 : 1 - day
  result.setDate(result.getDate() + diff)
  return result
}

export { WINDOWS }
