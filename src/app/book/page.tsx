import type { Metadata } from 'next'
import BookingFlow from './BookingFlow'

export const metadata: Metadata = {
  title: 'Book a clean — Crisp Home Co.',
  description:
    'Get an instant flat-rate price for residential cleaning in Salt Lake City. No callbacks, no surprises.',
}

export default function BookPage() {
  return <BookingFlow />
}
