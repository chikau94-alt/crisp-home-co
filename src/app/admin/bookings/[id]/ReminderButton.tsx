'use client'

import { useState, useTransition } from 'react'
import { sendReminderEmail } from '@/app/actions/admin'

export default function ReminderButton({ bookingId }: { bookingId: string }) {
  const [state, setState]   = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [isPending, start]  = useTransition()

  function handleClick() {
    setState('loading')
    start(async () => {
      try {
        await sendReminderEmail(bookingId)
        setState('sent')
      } catch {
        setState('error')
      }
    })
  }

  if (state === 'sent') {
    return (
      <div className="bg-white rounded-xl border border-green-200 shadow-sm px-6 py-4 flex items-center gap-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <p className="text-green-700 text-sm font-medium">Reminder sent to customer.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-cream-deep shadow-sm px-6 py-5 flex items-center justify-between gap-4">
      <div>
        <p className="font-semibold text-ink text-sm">Send reminder</p>
        <p className="text-ink-soft text-xs mt-0.5">
          Send the customer a day-before reminder email.
        </p>
        {state === 'error' && <p className="text-red-500 text-xs mt-1">Failed to send. Check your Resend API key.</p>}
      </div>
      <button
        onClick={handleClick}
        disabled={isPending}
        className="px-5 py-2.5 rounded-md border border-navy text-navy font-semibold text-sm hover:bg-navy hover:text-white transition-colors disabled:opacity-50 whitespace-nowrap"
      >
        {isPending ? 'Sending…' : 'Send reminder'}
      </button>
    </div>
  )
}
