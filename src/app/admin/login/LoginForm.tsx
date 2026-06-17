'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginForm() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError('Invalid email or password.')
      } else {
        router.push('/admin')
        router.refresh()
      }
    })
  }

  const inputCls =
    'w-full border border-cream-deep rounded-md px-4 py-3 text-ink text-sm bg-white ' +
    'placeholder:text-mist focus:outline-none focus:border-sage transition-colors duration-150'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1.5">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
          className={inputCls}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1.5">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          autoComplete="current-password"
          className={inputCls}
        />
      </div>
      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className={[
          'w-full py-4 rounded-md font-semibold text-sm mt-2 transition-all duration-200',
          isPending
            ? 'bg-sage/50 text-navy/50 cursor-not-allowed'
            : 'bg-sage text-navy shadow-md hover:bg-sage-soft',
        ].join(' ')}
      >
        {isPending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
