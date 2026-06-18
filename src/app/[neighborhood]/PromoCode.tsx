'use client'

import { useState } from 'react'

export default function PromoCode({ code, expiryStr }: { code: string; expiryStr: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="w-full max-w-xs flex flex-col items-center gap-2">
      <button
        onClick={copy}
        className="w-full flex items-center justify-between gap-3 bg-cream border-2 border-dashed border-sage rounded-xl px-5 py-4 hover:border-navy transition-colors group"
        aria-label="Copy promo code"
      >
        <span className="font-[family-name:var(--font-display)] text-navy text-2xl tracking-widest font-normal">
          {code}
        </span>
        <span className="text-xs font-semibold text-sage-soft group-hover:text-navy transition-colors">
          {copied ? '✓ Copied!' : 'Copy'}
        </span>
      </button>
      <p className="text-mist text-xs">Expires {expiryStr}</p>
    </div>
  )
}
