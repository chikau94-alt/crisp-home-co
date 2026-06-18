'use client'

import { useState, useTransition } from 'react'
import { assignCleaner } from '@/app/actions/admin'

interface Cleaner { id: string; name: string }

export default function AssignCleanerDropdown({
  bookingId,
  cleaners,
  currentCleanerId,
}: {
  bookingId: string
  cleaners: Cleaner[]
  currentCleanerId: string | null
}) {
  const [value, setValue]       = useState(currentCleanerId ?? '')
  const [conflict, setConflict] = useState<string | null>(null)
  const [isPending, start]      = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value
    setValue(next)
    setConflict(null)

    start(async () => {
      const result = await assignCleaner(bookingId, next || null)
      if (result.conflict && result.conflictDetail) {
        setConflict(result.conflictDetail)
      }
    })
  }

  return (
    <div className="flex flex-col gap-1 min-w-[140px]">
      <select
        value={value}
        onChange={handleChange}
        disabled={isPending}
        className={[
          'text-xs rounded-md border px-2 py-1.5 bg-white text-ink transition-colors',
          'focus:outline-none focus:border-sage',
          conflict ? 'border-amber-400' : 'border-cream-deep',
          isPending ? 'opacity-50' : '',
        ].join(' ')}
      >
        <option value="">Unassigned</option>
        {cleaners.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      {conflict && (
        <p className="text-amber-600 text-[11px] leading-tight">
          ⚠ {conflict}
        </p>
      )}
    </div>
  )
}
