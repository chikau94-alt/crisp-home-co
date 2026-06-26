import type { Metadata } from 'next'
import Link from 'next/link'
import QuoteForm from './QuoteForm'

export const metadata: Metadata = {
  title:       'Get a Free Cleaning Quote — Salt Lake City | Crisp Home Co.',
  description: 'Request a free, no-obligation house cleaning quote in Salt Lake City. No payment required — tell us about your home and we\'ll reach out with your price.',
  openGraph: {
    title:       'Get a Free Cleaning Quote — Crisp Home Co.',
    description: 'Free, no-obligation quote. No payment required.',
    url:         'https://crisphomeco.com/quote',
  },
}

export default function QuotePage() {
  return (
    <div className="min-h-screen bg-cream font-[family-name:var(--font-body)]">
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1a2b4a 0%, #11203b 100%)' }}
           className="px-6 pt-12 pb-20 md:pt-16 md:pb-28">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="font-[family-name:var(--font-display)] text-white/60 hover:text-white transition-colors text-sm mb-8 inline-block">
            ← Crisp Home Co.
          </Link>
          <div className="inline-flex items-center gap-2 bg-sage/20 border border-sage/30 text-sage text-xs px-3 py-1 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-sage block" />
            No payment required
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-white text-4xl md:text-5xl leading-tight mb-4">
            Get your free quote.
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-lg">
            Not ready to book online? No problem. Tell us about your home and we&apos;ll
            reach out with a personalized quote — no obligation, no pressure.
          </p>
        </div>
      </div>

      {/* Form — pulled up over the header */}
      <div className="px-6 -mt-12 md:-mt-16 pb-16">
        <div className="max-w-2xl mx-auto">
          <QuoteForm source="quote_page" />

          {/* Trust row */}
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 justify-center text-mist text-xs">
            <span className="flex items-center gap-2"><span className="text-sage">✓</span> Background-checked cleaners</span>
            <span className="flex items-center gap-2"><span className="text-sage">✓</span> Flat-rate pricing</span>
            <span className="flex items-center gap-2"><span className="text-sage">✓</span> Fully insured</span>
            <span className="flex items-center gap-2"><span className="text-sage">✓</span> Same-week availability</span>
          </div>

          {/* Alternative: book now */}
          <div className="mt-10 text-center border-t border-cream-deep pt-8">
            <p className="text-ink-soft text-sm mb-3">
              Already know what you need? Skip the wait.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-cream-deep text-ink text-sm hover:bg-white transition-colors"
            >
              See instant pricing & book online →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
