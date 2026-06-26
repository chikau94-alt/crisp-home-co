import Link from 'next/link'
import Image from 'next/image'
import type { ServicePage } from '@/lib/services'

const SCHEMA_ORG = (page: ServicePage) => {
  const base = {
    '@context': 'https://schema.org',
    '@type': page.schema,
    name: page.schema === 'LocalBusiness' ? 'Crisp Home Co.' : page.hero.headline,
    description: page.seoDescription,
    url: `https://crisphomeco.com/${page.slug}`,
    areaServed: {
      '@type': 'City',
      name: 'Salt Lake City',
      addressRegion: 'UT',
    },
    telephone: '+13852375485',
    email: 'hello@crisphomeco.com',
  }
  return JSON.stringify(base)
}

export default function ServiceLandingPage({ page }: { page: ServicePage }) {
  return (
    <div className="min-h-screen bg-cream font-[family-name:var(--font-body)]">

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: SCHEMA_ORG(page) }}
      />

      {/* Hero */}
      <div className="relative px-6 py-16 md:py-24 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&q=75&auto=format&fit=crop"
          alt="Clean home interior"
          fill
          className="object-cover object-center"
          unoptimized
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(26,43,74,0.95) 0%, rgba(17,32,59,0.92) 100%)' }} />
        <div className="relative z-10 max-w-4xl mx-auto">
          <Link href="/" className="font-[family-name:var(--font-display)] text-white/60 hover:text-white transition-colors text-sm mb-8 inline-block">
            ← Crisp Home Co.
          </Link>
          {page.badge && (
            <div className="inline-flex items-center gap-2 bg-sage/20 border border-sage/30 text-sage text-xs px-3 py-1 rounded-full mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-sage block" />
              {page.badge}
            </div>
          )}
          <h1 className="font-[family-name:var(--font-display)] text-white text-4xl md:text-5xl leading-tight mb-4">
            {page.hero.headline}
          </h1>
          <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-xl mb-8">
            {page.hero.subheadline}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md bg-sage text-navy font-semibold text-sm hover:bg-sage-soft transition-colors"
            >
              {page.cta.button}
            </Link>
            <Link
              href="/quote"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md border border-white/20 text-white text-sm hover:bg-white/10 transition-colors"
            >
              Get a free quote
            </Link>
          </div>
          <a
            href="tel:+13852375485"
            className="inline-block mt-4 text-white/50 hover:text-white text-sm transition-colors"
          >
            Or call (385) 237-5485
          </a>
        </div>
      </div>

      {/* Trust bar */}
      <div className="border-b border-cream-deep bg-white/50 px-6 py-4">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-6 items-center justify-center md:justify-start text-mist text-xs">
          <span className="flex items-center gap-2">
            <span className="text-sage">✓</span> Background-checked cleaners
          </span>
          <span className="flex items-center gap-2">
            <span className="text-sage">✓</span> Flat-rate pricing
          </span>
          <span className="flex items-center gap-2">
            <span className="text-sage">✓</span> Fully insured
          </span>
          <span className="flex items-center gap-2">
            <span className="text-sage">✓</span> Same-week availability
          </span>
          <span className="flex items-center gap-2">
            <span className="text-sage">✓</span> 100% satisfaction guarantee
          </span>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {page.features.map(f => (
            <div key={f.title} className="flex flex-col gap-2">
              <h3 className="font-[family-name:var(--font-display)] text-navy text-lg">{f.title}</h3>
              <p className="text-ink-soft text-sm leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-navy px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-sage mb-3">Pricing</p>
          <h2 className="font-[family-name:var(--font-display)] text-white text-3xl mb-2">
            Flat-rate. No surprises.
          </h2>
          <p className="text-white/50 text-sm mb-10">
            You see the exact price before you book. It doesn&apos;t change.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {page.pricing.map(p => (
              <div key={p.label} className="bg-white/5 border border-white/10 rounded-lg p-5">
                <p className="text-white/60 text-sm mb-1">{p.label}</p>
                <p className="font-[family-name:var(--font-display)] text-white text-2xl">{p.price}</p>
                {p.note && <p className="text-sage text-xs mt-1">{p.note}</p>}
              </div>
            ))}
          </div>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-md bg-sage text-navy font-semibold text-sm hover:bg-sage-soft transition-colors"
          >
            {page.cta.button}
          </Link>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-xs uppercase tracking-widest text-mist mb-3">Questions</p>
        <h2 className="font-[family-name:var(--font-display)] text-navy text-3xl mb-10">
          Frequently asked
        </h2>
        <div className="flex flex-col divide-y divide-cream-deep">
          {page.faq.map(item => (
            <div key={item.q} className="py-6">
              <p className="font-[family-name:var(--font-display)] text-navy text-base mb-2">{item.q}</p>
              <p className="text-ink-soft text-sm leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA block */}
      <div className="bg-cream border-t border-cream-deep px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-display)] text-navy text-3xl mb-3">
            {page.cta.headline}
          </h2>
          <p className="text-ink-soft text-sm mb-8">{page.cta.sub}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/book"
              className="inline-flex items-center justify-center px-8 py-4 rounded-md bg-sage text-navy font-semibold text-sm hover:bg-sage-soft transition-colors"
            >
              {page.cta.button}
            </Link>
            <a
              href="mailto:hello@crisphomeco.com"
              className="inline-flex items-center justify-center px-8 py-4 rounded-md border border-cream-deep text-ink text-sm hover:bg-cream-deep/50 transition-colors"
            >
              Email us a question
            </a>
          </div>
        </div>
      </div>

      {/* Footer nav */}
      <div className="border-t border-cream-deep px-6 py-8">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-4 text-xs text-mist">
          <Link href="/" className="hover:text-ink transition-colors">Home</Link>
          <Link href="/book" className="hover:text-ink transition-colors">Book Now</Link>
          <Link href="/blog" className="hover:text-ink transition-colors">Blog</Link>
          <Link href="/refer" className="hover:text-ink transition-colors">Refer a Friend</Link>
        </div>
      </div>
    </div>
  )
}
