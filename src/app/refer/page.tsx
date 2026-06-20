'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ReferPage() {
  const [email, setEmail]     = useState('')
  const [result, setResult]   = useState<{ code: string; used: boolean } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [copied, setCopied]   = useState(false)

  async function lookup() {
    if (!email.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res  = await fetch(`/api/referral/lookup?email=${encodeURIComponent(email.trim())}`)
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setResult(data)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const referralUrl = result ? `${process.env.NEXT_PUBLIC_SITE_URL}/refer/${result.code}` : ''

  async function copy() {
    await navigator.clipboard.writeText(referralUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #1a2b4a 0%, #11203b 45%, #1a2b4a 100%)' }}>
      <header className="flex items-center justify-between px-6 py-5">
        <Link href="/" className="font-[family-name:var(--font-display)] text-white text-lg">Crisp Home Co.</Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">

          {/* Hero */}
          <div className="text-center mb-10">
            <h1 className="font-[family-name:var(--font-display)] text-white text-4xl md:text-5xl leading-tight mb-3">
              Give $50, Get $50
            </h1>
            <p className="text-white/60 text-base leading-relaxed">
              Refer a friend to Crisp Home Co. When they complete their first clean,
              you both get <span className="text-sage font-medium">$50 off</span> your next booking.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            {!result ? (
              <>
                <p className="text-white/70 text-sm mb-4">
                  Enter the email you used to book and we'll find your referral link.
                </p>
                <div className="flex flex-col gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && lookup()}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-sage"
                  />
                  {error && <p className="text-red-400 text-sm">{error}</p>}
                  <button
                    onClick={lookup}
                    disabled={loading}
                    className="w-full py-3 rounded-lg bg-sage text-navy font-semibold text-sm hover:bg-sage-soft transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Looking up…' : 'Find My Referral Link'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Your referral link</p>
                <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-4 py-3 mb-4">
                  <span className="text-white/80 text-sm flex-1 truncate">{referralUrl}</span>
                  <button
                    onClick={copy}
                    className="text-sage text-sm font-semibold shrink-0 hover:text-sage-soft transition-colors"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                {result.used ? (
                  <div className="bg-sage/20 border border-sage/30 rounded-lg px-4 py-3 text-center">
                    <p className="text-sage text-sm font-medium">Your referral was used! 🎉</p>
                    <p className="text-white/50 text-xs mt-1">Check your email for your $50 reward code.</p>
                  </div>
                ) : (
                  <p className="text-white/40 text-xs text-center">
                    Share this link with friends. When they book, you both save $50.
                  </p>
                )}

                <div className="mt-4 flex gap-2">
                  <a
                    href={`sms:?body=I've been using Crisp Home Co. for premium home cleaning in Salt Lake City — use my link to get $50 off your first clean: ${referralUrl}`}
                    className="flex-1 py-2.5 rounded-lg border border-white/20 text-white/70 text-xs text-center hover:border-white/40 transition-colors"
                  >
                    Share via Text
                  </a>
                  <a
                    href={`mailto:?subject=Get $50 off your first Crisp Home Co. clean&body=Hey! I've been using Crisp Home Co. for home cleaning in Salt Lake City and love it. Use my link to get $50 off your first clean: ${referralUrl}`}
                    className="flex-1 py-2.5 rounded-lg border border-white/20 text-white/70 text-xs text-center hover:border-white/40 transition-colors"
                  >
                    Share via Email
                  </a>
                </div>
              </>
            )}
          </div>

          {/* How it works */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            {[
              { step: '1', label: 'Share your link' },
              { step: '2', label: 'Friend books & gets clean' },
              { step: '3', label: 'You both get $50 off' },
            ].map(({ step, label }) => (
              <div key={step}>
                <div className="w-8 h-8 rounded-full bg-sage/20 border border-sage/30 flex items-center justify-center mx-auto mb-2">
                  <span className="text-sage text-sm font-semibold">{step}</span>
                </div>
                <p className="text-white/50 text-xs leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
