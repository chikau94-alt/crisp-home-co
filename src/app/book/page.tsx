import type { Metadata } from 'next'
import Link from 'next/link'
import BookingFlow from './BookingFlow'

export const metadata: Metadata = {
  title: 'Book a Clean — Crisp Home Co.',
  description: 'Book your premium flat-rate home cleaning in Salt Lake City. Instant pricing, no callbacks.',
}

interface Props { searchParams: Promise<{ ref?: string }> }

export default async function BookPage({ searchParams }: Props) {
  const { ref } = await searchParams

  return (
    <div className="min-h-screen flex flex-col font-[family-name:var(--font-body)]" style={{ background: 'linear-gradient(160deg, #1a2b4a 0%, #11203b 45%, #1a2b4a 100%)' }}>

      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-5 flex-shrink-0">
        <Link href="/" className="font-[family-name:var(--font-display)] text-white text-lg tracking-tight hover:text-sage-soft transition-colors">
          Crisp Home Co.
        </Link>
        <p className="text-white/40 text-sm hidden sm:block">
          Secure booking · Salt Lake City
        </p>
      </header>

      {/* Referral banner */}
      {ref && (
        <div className="mx-4 mt-2 px-4 py-3 rounded-lg bg-sage/20 border border-sage/30 text-center">
          <p className="text-sage text-sm font-medium">🎉 $50 referral discount applied — complete your booking below.</p>
        </div>
      )}

      {/* Centered booking card */}
      <div className="flex-1 flex items-start justify-center px-4 pb-8 pt-2 md:items-center md:pt-0">
        <div className="w-full max-w-4xl">
          <BookingFlow referralCode={ref} />
        </div>
      </div>

    </div>
  )
}
