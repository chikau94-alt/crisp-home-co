'use client'

import { useState } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { submitLead } from '@/app/actions/lead'

const SIZE_OPTIONS = [
  'Under 1,500 sq ft',
  '1,500 – 2,500 sq ft',
  '2,500 – 3,500 sq ft',
  '3,500 – 4,500 sq ft',
  'Over 4,500 sq ft',
  'Not sure',
]

const SERVICE_OPTIONS = [
  'Recurring cleaning (weekly / bi-weekly)',
  'One-time deep clean',
  'Move-in / move-out clean',
  'Airbnb turnover',
  'Post-construction clean',
  'Not sure yet',
]

const CONTACT_OPTIONS = [
  { value: 'text',  label: 'Text' },
  { value: 'phone', label: 'Call' },
  { value: 'email', label: 'Email' },
  { value: 'either', label: 'Any' },
] as const

export default function QuoteForm({ source = 'quote_form' }: { source?: string }) {
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [phone, setPhone]     = useState('')
  const [sizeBand, setSize]   = useState('')
  const [service, setService] = useState('')
  const [message, setMessage] = useState('')
  const [preferred, setPreferred] = useState<'text' | 'phone' | 'email' | 'either'>('text')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError]   = useState<string | null>(null)
  const [done, setDone]     = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const res = await submitLead({
      name, email, phone,
      sizeBand: sizeBand || undefined,
      serviceType: service || undefined,
      message: message || undefined,
      preferredContact: preferred,
      source,
    })
    setSubmitting(false)
    if (res.ok) setDone(true)
    else setError(res.error ?? 'Something went wrong. Please try again.')
  }

  if (done) {
    return (
      <div className="bg-white border border-cream-deep rounded-xl p-8 md:p-10 text-center">
        {/* Fire Google Ads lead conversion + GA event when the lead lands */}
        <Script id="gads-lead-conversion" strategy="afterInteractive">
          {`if (typeof gtag === 'function') { gtag('event', 'conversion', { 'send_to': 'AW-18254764683/9GlYCKbk2MIcEIu1xoBE' }); }`}
        </Script>
        <div className="w-14 h-14 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-5">
          <span className="text-sage text-2xl">✓</span>
        </div>
        <h2 className="font-[family-name:var(--font-display)] text-navy text-2xl mb-3">
          You&apos;re all set, {name.split(' ')[0]}.
        </h2>
        <p className="text-ink-soft text-sm leading-relaxed mb-6 max-w-sm mx-auto">
          We just got your request and sent a confirmation to your email. A member of
          our team will reach out shortly with your quote. We usually respond within a
          couple of hours during business hours.
        </p>
        <p className="text-ink-soft text-sm mb-6">
          Don&apos;t want to wait? See your exact price and book online now.
        </p>
        <Link
          href="/book"
          className="inline-flex items-center justify-center px-8 py-3 rounded-md bg-sage text-navy font-semibold text-sm hover:bg-sage-soft transition-colors"
        >
          See My Instant Price →
        </Link>
      </div>
    )
  }

  const inputCls =
    'w-full rounded-md border border-cream-deep bg-white px-4 py-3 text-ink text-[15px] ' +
    'placeholder:text-mist focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage transition-colors'

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-cream-deep rounded-xl p-6 md:p-8 flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-wide text-mist font-medium">Your name *</label>
        <input className={inputCls} value={name} onChange={e => setName(e.target.value)}
               placeholder="Jane Smith" autoComplete="name" required />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs uppercase tracking-wide text-mist font-medium">Phone *</label>
          <input className={inputCls} value={phone} onChange={e => setPhone(e.target.value)}
                 placeholder="(801) 555-0123" type="tel" inputMode="tel" autoComplete="tel" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs uppercase tracking-wide text-mist font-medium">Email *</label>
          <input className={inputCls} value={email} onChange={e => setEmail(e.target.value)}
                 placeholder="jane@email.com" type="email" inputMode="email" autoComplete="email" required />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs uppercase tracking-wide text-mist font-medium">Home size</label>
          <select className={inputCls} value={sizeBand} onChange={e => setSize(e.target.value)}>
            <option value="">Select…</option>
            {SIZE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs uppercase tracking-wide text-mist font-medium">What do you need?</label>
          <select className={inputCls} value={service} onChange={e => setService(e.target.value)}>
            <option value="">Select…</option>
            {SERVICE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-wide text-mist font-medium">Anything else? (optional)</label>
        <textarea className={inputCls + ' resize-none'} rows={3} value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Pets, timing, specific requests…" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs uppercase tracking-wide text-mist font-medium">Best way to reach you</label>
        <div className="flex flex-wrap gap-2">
          {CONTACT_OPTIONS.map(o => (
            <button
              key={o.value}
              type="button"
              onClick={() => setPreferred(o.value)}
              className={`px-4 py-2 rounded-md text-sm border transition-colors ${
                preferred === o.value
                  ? 'bg-navy text-white border-navy'
                  : 'bg-white text-ink-soft border-cream-deep hover:border-sage'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 w-full rounded-md bg-sage text-navy font-semibold text-[15px] py-4 hover:bg-sage-soft transition-colors disabled:opacity-60"
      >
        {submitting ? 'Sending…' : 'Get My Free Quote →'}
      </button>
      <p className="text-mist text-xs text-center">
        No payment required. We&apos;ll reach out with your quote — no obligation.
      </p>
    </form>
  )
}
