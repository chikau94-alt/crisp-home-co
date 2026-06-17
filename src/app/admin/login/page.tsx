import LoginForm from './LoginForm'

export const metadata = { title: 'Admin — Crisp Home Co.' }

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 font-[family-name:var(--font-body)]">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="font-[family-name:var(--font-display)] text-navy text-2xl mb-1">
            Crisp Home Co.
          </p>
          <p className="text-ink-soft text-sm">Admin access only</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl border border-cream-deep shadow-sm p-8">
          <h1 className="font-[family-name:var(--font-display)] text-navy text-xl mb-6">
            Sign in
          </h1>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
