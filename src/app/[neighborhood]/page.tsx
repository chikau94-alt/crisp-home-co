import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { getNeighborhood, NEIGHBORHOOD_SLUGS } from '@/lib/neighborhoods'
import SlotsCounter from './SlotsCounter'
import PromoCode from './PromoCode'

export const revalidate = 60

interface Props { params: Promise<{ neighborhood: string }> }

export async function generateStaticParams() {
  return NEIGHBORHOOD_SLUGS.map(slug => ({ neighborhood: slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { neighborhood: slug } = await params
  const n = getNeighborhood(slug)
  if (!n) return {}
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://crisphomeco.com'
  return {
    title: n.seoTitle,
    description: n.seoDescription,
    openGraph: {
      title: n.seoTitle,
      description: n.seoDescription,
      url: `${siteUrl}/${slug}`,
      siteName: 'Crisp Home Co.',
      type: 'website',
    },
    alternates: { canonical: `${siteUrl}/${slug}` },
  }
}

export default async function NeighborhoodPage({ params }: Props) {
  const { neighborhood: slug } = await params
  const n = getNeighborhood(slug)
  if (!n) notFound()

  const db = getSupabaseAdmin()
  const { data: campaign } = await db
    .from('neighborhood_campaigns')
    .select('slots_remaining')
    .eq('slug', slug)
    .single()

  const slotsRemaining = campaign?.slots_remaining ?? 5

  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + 30)
  const expiryStr = expiryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  const promoCode = n.slug
    .split('-')
    .map(w => w.toUpperCase())
    .join('') + '30'

  return (
    <div className="min-h-screen bg-cream font-[family-name:var(--font-body)]">

      {/* Nav */}
      <header className="bg-navy px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-[family-name:var(--font-display)] text-white text-lg tracking-tight">
          Crisp Home Co.
        </Link>
        <Link
          href="/book"
          className="text-sm font-semibold bg-sage text-navy px-4 py-2 rounded-md hover:bg-sage-soft transition-colors"
        >
          Book now
        </Link>
      </header>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #1a2b4a 0%, #11203b 100%)' }} className="px-6 py-20 md:py-28 text-center">
        <p className="text-sage-soft text-sm tracking-widest uppercase mb-4">Now serving {n.name}</p>
        <h1 className="font-[family-name:var(--font-display)] text-white text-4xl md:text-6xl font-normal leading-tight mb-6 max-w-3xl mx-auto">
          {n.headline.split(n.name).map((part, i, arr) => (
            i < arr.length - 1
              ? <span key={i}>{part}<em>{n.name}</em></span>
              : <span key={i}>{part}</span>
          ))}
        </h1>
        <p className="text-sage-soft/80 text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
          {n.subheadline}
        </p>

        <SlotsCounter initial={slotsRemaining} slug={slug} neighborhoodName={n.name} />

        <Link
          href="/book"
          className="inline-block mt-8 bg-sage text-navy font-bold text-lg px-10 py-4 rounded-lg hover:bg-sage-soft transition-colors shadow-lg"
        >
          Book my clean →
        </Link>
      </section>

      {/* Promo */}
      <section className="max-w-2xl mx-auto px-6 py-14">
        <div className="bg-white rounded-2xl border border-cream-deep shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-cream-deep text-center">
            <p className="text-mist text-xs tracking-widest uppercase mb-1">Introductory offer · {n.name}</p>
            <h2 className="font-[family-name:var(--font-display)] text-navy text-3xl font-normal mb-2">30% off your first clean</h2>
            <p className="text-ink-soft text-sm">Exclusively for {n.name} neighbors. Limited slots.</p>
          </div>
          <div className="px-8 py-8 flex flex-col items-center gap-4">
            <PromoCode code={promoCode} expiryStr={expiryStr} />
            <Link
              href="/book"
              className="w-full max-w-xs text-center bg-navy text-white font-semibold py-3.5 rounded-lg hover:bg-navy/80 transition-colors"
            >
              Claim offer at checkout
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 pb-14">
        <h2 className="font-[family-name:var(--font-display)] text-navy text-3xl text-center mb-10 font-normal">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '1', title: 'Get instant pricing', body: 'Pick your home size and frequency. See your exact price — no callbacks, no estimates.' },
            { step: '2', title: 'Choose your day', body: 'Pick a date and 2-hour arrival window that works for you.' },
            { step: '3', title: 'We handle the rest', body: `A vetted Crisp cleaner arrives in ${n.name} on time. You come home to crisp.` },
          ].map(({ step, title, body }) => (
            <div key={step} className="bg-white rounded-xl border border-cream-deep shadow-sm px-6 py-6 flex flex-col gap-3">
              <span className="w-9 h-9 rounded-full bg-sage/20 text-navy font-bold text-sm flex items-center justify-center">
                {step}
              </span>
              <h3 className="font-semibold text-ink text-base">{title}</h3>
              <p className="text-ink-soft text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      {n.testimonials.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 pb-14">
          <h2 className="font-[family-name:var(--font-display)] text-navy text-3xl text-center mb-10 font-normal">
            What {n.name} neighbors are saying
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {n.testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-xl border border-cream-deep shadow-sm px-6 py-6 flex flex-col gap-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <svg key={j} width="16" height="16" viewBox="0 0 24 24" fill="#9eaa8f">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-ink text-sm leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
                <p className="font-semibold text-ink text-sm">{t.name}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Referral */}
      <section style={{ background: 'linear-gradient(135deg, #1a2b4a 0%, #11203b 100%)' }} className="px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sage-soft text-sm tracking-widest uppercase mb-3">Referral program</p>
          <h2 className="font-[family-name:var(--font-display)] text-white text-4xl font-normal mb-4">
            Give $50, Get $50
          </h2>
          <p className="text-sage-soft/80 text-lg mb-3 leading-relaxed">
            Refer a {n.name} neighbor and you both get $50 off your next clean.
          </p>
          <p className="text-sage-soft/60 text-sm mb-8">
            After your first booking, we'll email you a personal referral link to share.
          </p>
          <Link
            href="/book"
            className="inline-block bg-sage text-navy font-bold px-8 py-3.5 rounded-lg hover:bg-sage-soft transition-colors"
          >
            Book first, then refer →
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-cream-deep px-6 py-16 text-center">
        <h2 className="font-[family-name:var(--font-display)] text-navy text-3xl font-normal mb-3">
          Ready for a <em>crisp</em> home?
        </h2>
        <p className="text-ink-soft mb-8 max-w-md mx-auto">
          Only {slotsRemaining} introductory slot{slotsRemaining !== 1 ? 's' : ''} left this month for {n.name}. Book in under 2 minutes.
        </p>
        <Link
          href="/book"
          className="inline-block bg-navy text-white font-bold text-lg px-10 py-4 rounded-lg hover:bg-navy/80 transition-colors"
        >
          Book my clean →
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-navy px-6 py-8 text-center">
        <p className="font-[family-name:var(--font-display)] text-white text-base mb-1">Crisp Home Co.</p>
        <p className="text-sage-soft/60 text-xs">Salt Lake City, Utah · hello@crisphomeco.com</p>
        <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1">
          {NEIGHBORHOOD_SLUGS.filter(s => s !== slug).slice(0, 8).map(s => {
            const nb = getNeighborhood(s)
            return nb ? (
              <Link key={s} href={`/${s}`} className="text-white/30 text-xs hover:text-white/60 transition-colors">
                {nb.name}
              </Link>
            ) : null
          })}
        </div>
      </footer>

    </div>
  )
}
