import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import LeadCard, { type Lead } from './LeadCard'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Leads — Crisp Home Co.' }

export default async function LeadsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) redirect('/admin/login')

  const { data: leads } = await getSupabaseAdmin()
    .from('leads')
    .select('id, name, email, phone, size_band, service_type, message, preferred_contact, source, status, notes, created_at')
    .order('created_at', { ascending: false })

  const rows = (leads ?? []) as Lead[]

  const counts = {
    total:     rows.length,
    new:       rows.filter(l => l.status === 'new').length,
    contacted: rows.filter(l => l.status === 'contacted').length,
    converted: rows.filter(l => l.status === 'converted').length,
  }
  const closeRate = counts.total > 0
    ? Math.round((counts.converted / counts.total) * 100)
    : 0

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="font-[family-name:var(--font-display)] text-navy text-2xl mb-1">Leads</h1>
        <p className="text-ink-soft text-sm">Free-quote requests. Call new leads back fast — speed wins.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Total',     value: counts.total },
          { label: 'New',       value: counts.new },
          { label: 'Converted', value: counts.converted },
          { label: 'Close rate', value: `${closeRate}%` },
        ].map(s => (
          <div key={s.label} className="bg-white border border-cream-deep rounded-lg px-4 py-3">
            <p className="text-navy text-2xl font-[family-name:var(--font-display)]">{s.value}</p>
            <p className="text-mist text-xs uppercase tracking-wide mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Leads */}
      {rows.length === 0 ? (
        <div className="bg-white border border-cream-deep rounded-xl p-10 text-center">
          <p className="text-ink-soft text-sm">No leads yet. They&apos;ll appear here the moment someone submits the free-quote form.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {rows.map(lead => <LeadCard key={lead.id} lead={lead} />)}
        </div>
      )}
    </div>
  )
}
