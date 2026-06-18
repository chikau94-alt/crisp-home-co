import { createClient } from '@/lib/supabase/server'
import SignOutButton from './SignOutButton'
import AdminNav from './AdminNav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = user?.email === process.env.ADMIN_EMAIL

  // Login page — render without chrome
  if (!isAdmin) return <>{children}</>

  return (
    <div className="min-h-screen bg-cream font-[family-name:var(--font-body)]">
      <header
        className="px-6 py-4 flex items-center justify-between"
        style={{ background: '#1a2b4a' }}
      >
        <div>
          <p className="font-[family-name:var(--font-display)] text-white text-lg">Crisp Home Co.</p>
          <p className="text-sage-soft/70 text-xs">Admin dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-mist text-xs hidden md:block">{user?.email}</p>
          <SignOutButton />
        </div>
      </header>
      <AdminNav />
      {children}
    </div>
  )
}
