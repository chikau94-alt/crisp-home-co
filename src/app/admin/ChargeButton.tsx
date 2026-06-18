'use client'

import { useState } from 'react'
import { chargeRecurringVisit } from '@/app/actions/stripe'

export default function ChargeButton({
  bookingId,
  recurringAmount,
}: {
  bookingId: string
  recurringAmount: number
}) {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [msg, setMsg]     = useState('')

  async function handleCharge() {
    if (!confirm(`Charge $${recurringAmount.toFixed(2)} for this recurring visit?`)) return
    setState('loading')
    try {
      await chargeRecurringVisit(bookingId)
      setState('success')
      setMsg('Charged')
    } catch (err) {
      setState('error')
      setMsg(err instanceof Error ? err.message : 'Charge failed')
    }
  }

  if (state === 'success') {
    return (
      <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
        {msg}
      </span>
    )
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        onClick={handleCharge}
        disabled={state === 'loading'}
        className="text-xs font-semibold px-3 py-1.5 rounded-md bg-navy text-white hover:bg-navy/80 transition-colors disabled:opacity-50"
      >
        {state === 'loading' ? 'Charging…' : `Charge $${recurringAmount.toFixed(2)}`}
      </button>
      {state === 'error' && (
        <span className="text-red-500 text-xs">{msg}</span>
      )}
    </div>
  )
}
