'use client'

import { useState, useTransition } from 'react'
import { updateLeadStatus, updateLeadNotes } from '@/app/actions/admin'

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  size_band: string | null
  service_type: string | null
  message: string | null
  preferred_contact: string | null
  source: string | null
  status: 'new' | 'contacted' | 'converted' | 'lost'
  notes: string | null
  created_at: string
}

const STATUS_OPTIONS: Lead['status'][] = ['new', 'contacted', 'converted', 'lost']

const STATUS_STYLES: Record<Lead['status'], string> = {
  new:       'bg-amber-50 text-amber-700 border-amber-200',
  contacted: 'bg-blue-50 text-blue-700 border-blue-200',
  converted: 'bg-green-50 text-green-700 border-green-200',
  lost:      'bg-red-50 text-red-600 border-red-200',
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function LeadCard({ lead }: { lead: Lead }) {
  const [status, setStatus] = useState(lead.status)
  const [notes, setNotes]   = useState(lead.notes ?? '')
  const [savedNotes, setSavedNotes] = useState(lead.notes ?? '')
  const [pending, startTransition] = useTransition()

  function setLeadStatus(next: Lead['status']) {
    setStatus(next)
    startTransition(() => updateLeadStatus(lead.id, next))
  }

  function saveNotes() {
    if (notes === savedNotes) return
    setSavedNotes(notes)
    startTransition(() => updateLeadNotes(lead.id, notes))
  }

  const telHref = `tel:${lead.phone.replace(/[^0-9+]/g, '')}`

  return (
    <div className={`bg-white border rounded-xl p-5 flex flex-col gap-4 ${status === 'new' ? 'border-amber-300 shadow-sm' : 'border-cream-deep'}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-[family-name:var(--font-display)] text-navy text-lg">{lead.name}</h3>
            {status === 'new' && <span className="text-amber-600 text-xs font-semibold uppercase tracking-wide">● New</span>}
          </div>
          <p className="text-mist text-xs mt-0.5">{timeAgo(lead.created_at)} · via {lead.source ?? 'quote'}</p>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full border capitalize ${STATUS_STYLES[status]}`}>
          {status}
        </span>
      </div>

      {/* Contact */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <a href={telHref} className="text-sage font-medium hover:underline">📞 {lead.phone}</a>
        <a href={`mailto:${lead.email}`} className="text-ink-soft hover:underline">✉️ {lead.email}</a>
        {lead.preferred_contact && <span className="text-mist">Prefers: {lead.preferred_contact}</span>}
      </div>

      {/* Details */}
      {(lead.size_band || lead.service_type || lead.message) && (
        <div className="text-sm text-ink-soft flex flex-col gap-1 bg-cream rounded-lg px-4 py-3">
          {lead.size_band   && <p><span className="text-mist">Home size:</span> {lead.size_band}</p>}
          {lead.service_type && <p><span className="text-mist">Wants:</span> {lead.service_type}</p>}
          {lead.message     && <p><span className="text-mist">Note:</span> {lead.message}</p>}
        </div>
      )}

      {/* Status buttons */}
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map(s => (
          <button
            key={s}
            onClick={() => setLeadStatus(s)}
            disabled={pending}
            className={`px-3 py-1.5 rounded-md text-xs font-medium border capitalize transition-colors disabled:opacity-50 ${
              status === s ? STATUS_STYLES[s] : 'bg-white text-ink-soft border-cream-deep hover:border-sage'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-1.5">
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          onBlur={saveNotes}
          rows={2}
          placeholder="Add a note (saved on blur)…"
          className="w-full text-sm rounded-md border border-cream-deep px-3 py-2 text-ink placeholder:text-mist focus:outline-none focus:border-sage resize-none"
        />
      </div>
    </div>
  )
}
