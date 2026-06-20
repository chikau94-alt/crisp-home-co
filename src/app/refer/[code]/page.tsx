import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getReferralByCode } from '@/lib/referral'

interface Props { params: Promise<{ code: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params
  const referral  = await getReferralByCode(code)
  if (!referral) return {}
  const first = referral.referrer_name.split(' ')[0]
  return {
    title: `${first} invited you — $50 off your first Crisp clean`,
    description: 'Premium flat-rate home cleaning in Salt Lake City. Use this referral link and get $50 off your first booking.',
  }
}

export default async function ReferralLandingPage({ params }: Props) {
  const { code } = await params
  const referral  = await getReferralByCode(code)
  if (!referral) notFound()

  const firstName = referral.referrer_name.split(' ')[0]
  const alreadyUsed = !!referral.referred_booking_id

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #1a2b4a 0%, #11203b 45%, #1a2b4a 100%)' }}>
      <header className="flex items-center justify-between px-6 py-5">
        <Link href="/" className="font-[family-name:var(--font-display)] text-white text-lg">Crisp Home Co.</Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md text-center">

          <p className="text-sage text-sm uppercase tracking-widest mb-3">You're invited</p>
          <h1 className="font-[family-name:var(--font-display)] text-white text-4xl md:text-5xl leading-tight mb-4">
            {firstName} thinks your home deserves crisp.
          </h1>
          <p className="text-white/60 text-base leading-relaxed mb-8">
            {alreadyUsed
              ? 'This referral link has already been used.'
              : `Get $50 off your first Crisp Home Co. clean. Flat-rate pricing, vetted local cleaners, same-week availability.`
            }
          </p>

          {!alreadyUsed && (
            <>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 text-left">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-sage/20 border border-sage/30 flex items-center justify-center shrink-0">
                    <span className="text-sage text-lg">✓</span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Flat-rate pricing</p>
                    <p className="text-white/50 text-xs mt-0.5">See your exact price before you book. No hourly rates, no surprise fees.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-sage/20 border border-sage/30 flex items-center justify-center shrink-0">
                    <span className="text-sage text-lg">✓</span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Vetted local cleaners</p>
                    <p className="text-white/50 text-xs mt-0.5">Every cleaner is background-checked, insured, and local to Salt Lake City.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-sage/20 border border-sage/30 flex items-center justify-center shrink-0">
                    <span className="text-sage text-lg">✓</span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Same-week availability</p>
                    <p className="text-white/50 text-xs mt-0.5">Book online in under 2 minutes. We'll be there this week.</p>
                  </div>
                </div>
              </div>

              <Link
                href={`/book?ref=${code}`}
                className="block w-full py-4 rounded-xl bg-sage text-navy font-semibold text-base hover:bg-sage-soft transition-colors mb-3"
              >
                Claim My $50 Off →
              </Link>
              <p className="text-white/30 text-xs">
                Discount applied automatically at checkout. One use per customer.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
