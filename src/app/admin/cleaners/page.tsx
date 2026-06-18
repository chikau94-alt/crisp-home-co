import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import CleanersManager from './CleanersManager'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Cleaners — Crisp Home Co.' }

export default async function CleanersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) redirect('/admin/login')

  const { data: cleaners } = await getSupabaseAdmin()
    .from('cleaners')
    .select('id, name, phone, email, active')
    .order('active', { ascending: false })
    .order('name')

  return (
    <main className="max-w-4xl mx-auto px-4 md:px-6 py-8">
      <CleanersManager initial={cleaners ?? []} />
    </main>
  )
}
