'use client'

import { useTransition } from 'react'
import { deleteBooking } from '@/app/actions/admin'

export default function DeleteBookingButton({ bookingId }: { bookingId: string }) {
  const [isPending, start] = useTransition()

  function handleClick() {
    if (!confirm('Permanently delete this booking and all photos? This cannot be undone.')) return
    start(async () => {
      await deleteBooking(bookingId)
      window.location.href = '/admin'
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="px-5 py-2.5 rounded-md bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors whitespace-nowrap disabled:opacity-50"
    >
      {isPending ? 'Deleting…' : 'Delete'}
    </button>
  )
}
