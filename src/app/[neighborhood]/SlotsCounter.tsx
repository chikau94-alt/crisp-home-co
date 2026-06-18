'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SlotsCounter({
  initial,
  slug,
  neighborhoodName,
}: {
  initial: number
  slug: string
  neighborhoodName: string
}) {
  const [slots, setSlots] = useState(initial)

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`neighborhood_campaigns_${slug}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'neighborhood_campaigns', filter: `slug=eq.${slug}` },
        payload => {
          const updated = payload.new as { slots_remaining: number }
          setSlots(updated.slots_remaining)
        }
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [slug])

  const isLow = slots <= 2

  return (
    <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold ${
      isLow
        ? 'bg-red-500/20 text-red-200 border border-red-400/30'
        : 'bg-sage/20 text-sage-soft border border-sage/30'
    }`}>
      <span className={`w-2 h-2 rounded-full animate-pulse ${isLow ? 'bg-red-400' : 'bg-sage'}`} />
      {slots <= 0
        ? `All ${neighborhoodName} slots filled this month`
        : `Only ${slots} slot${slots !== 1 ? 's' : ''} left this month in ${neighborhoodName}`}
    </div>
  )
}
