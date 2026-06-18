import type { Metadata } from 'next'
import BookingFlow from './BookingFlow'

export const metadata: Metadata = {
  title: 'Book a Clean — Crisp Home Co.',
  description: 'Book your premium flat-rate home cleaning in Salt Lake City. Instant pricing, no callbacks.',
}

export default function BookPage() {
  return <BookingFlow />
}
