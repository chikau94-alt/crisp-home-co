'use client'

import { useState, useTransition } from 'react'
import { addCleaner, updateCleaner } from '@/app/actions/cleaners'

interface Cleaner {
  id: string
  name: string
  phone: string
  email: string
  active: boolean
}

const fieldCls =
  'w-full border border-cream-deep rounded-md px-3 py-2 text-ink text-sm bg-white ' +
  'placeholder:text-mist focus:outline-none focus:border-sage transition-colors'

export default function CleanersManager({ initial }: { initial: Cleaner[] }) {
  const [cleaners, setCleaners]   = useState<Cleaner[]>(initial)
  const [editing, setEditing]     = useState<Cleaner | null>(null)
  const [adding, setAdding]       = useState(false)
  const [form, setForm]           = useState({ name: '', phone: '', email: '' })
  const [error, setError]         = useState<string | null>(null)
  const [isPending, start]        = useTransition()

  function openAdd() {
    setAdding(true)
    setEditing(null)
    setForm({ name: '', phone: '', email: '' })
    setError(null)
  }

  function openEdit(c: Cleaner) {
    setEditing(c)
    setAdding(false)
    setForm({ name: c.name, phone: c.phone, email: c.email })
    setError(null)
  }

  function cancel() {
    setAdding(false)
    setEditing(null)
    setError(null)
  }

  function handleAdd() {
    if (!form.name || !form.email) { setError('Name and email are required.'); return }
    start(async () => {
      try {
        await addCleaner(form)
        // Optimistic update — page will revalidate too
        setCleaners(prev => [...prev, {
          id: crypto.randomUUID(), ...form, active: true
        }])
        cancel()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to add cleaner')
      }
    })
  }

  function handleUpdate(active?: boolean) {
    if (!editing) return
    const updated = { id: editing.id, ...form, active: active ?? editing.active }
    start(async () => {
      try {
        await updateCleaner(updated)
        setCleaners(prev => prev.map(c => c.id === editing.id ? { ...c, ...updated } : c))
        cancel()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to update cleaner')
      }
    })
  }

  const active   = cleaners.filter(c => c.active)
  const inactive = cleaners.filter(c => !c.active)

  return (
    <div className="flex flex-col gap-6">

      {/* Add / edit form */}
      {(adding || editing) && (
        <div className="bg-white rounded-xl border border-cream-deep shadow-sm p-6">
          <h3 className="font-[family-name:var(--font-display)] text-navy text-lg mb-4">
            {adding ? 'Add cleaner' : `Edit ${editing!.name}`}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1.5">
                Full name <span className="text-sage">*</span>
              </label>
              <input className={fieldCls} value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Maria Garcia" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1.5">
                Email <span className="text-sage">*</span>
              </label>
              <input type="email" className={fieldCls} value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="maria@example.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1.5">
                Phone
              </label>
              <input type="tel" className={fieldCls} value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="(801) 555-0100" />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <div className="flex items-center gap-3">
            {adding ? (
              <button
                onClick={handleAdd}
                disabled={isPending}
                className="px-5 py-2.5 rounded-md bg-sage text-navy font-semibold text-sm hover:bg-sage-soft transition-colors disabled:opacity-50"
              >
                {isPending ? 'Saving…' : 'Add cleaner'}
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleUpdate()}
                  disabled={isPending}
                  className="px-5 py-2.5 rounded-md bg-sage text-navy font-semibold text-sm hover:bg-sage-soft transition-colors disabled:opacity-50"
                >
                  {isPending ? 'Saving…' : 'Save changes'}
                </button>
                {editing?.active ? (
                  <button
                    onClick={() => handleUpdate(false)}
                    disabled={isPending}
                    className="px-5 py-2.5 rounded-md border border-cream-deep text-ink-soft text-sm hover:border-red-300 hover:text-red-600 transition-colors disabled:opacity-50"
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpdate(true)}
                    disabled={isPending}
                    className="px-5 py-2.5 rounded-md border border-cream-deep text-ink-soft text-sm hover:border-sage hover:text-sage transition-colors disabled:opacity-50"
                  >
                    Reactivate
                  </button>
                )}
              </>
            )}
            <button onClick={cancel} className="text-ink-soft text-sm hover:text-ink transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Active cleaners */}
      <div className="bg-white rounded-xl border border-cream-deep shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-cream-deep flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-display)] text-navy text-xl">
            Active cleaners <span className="text-mist font-normal text-base ml-1">({active.length})</span>
          </h2>
          {!adding && !editing && (
            <button
              onClick={openAdd}
              className="px-4 py-2 rounded-md bg-sage text-navy font-semibold text-sm hover:bg-sage-soft transition-colors"
            >
              + Add cleaner
            </button>
          )}
        </div>

        {active.length === 0 ? (
          <div className="px-6 py-12 text-center text-ink-soft text-sm">
            No active cleaners yet. Add your first one above.
          </div>
        ) : (
          <div className="divide-y divide-cream-deep">
            {active.map(c => (
              <CleanerRow key={c.id} cleaner={c} onEdit={() => openEdit(c)} />
            ))}
          </div>
        )}
      </div>

      {/* Inactive cleaners */}
      {inactive.length > 0 && (
        <div className="bg-white rounded-xl border border-cream-deep shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-cream-deep">
            <h2 className="font-[family-name:var(--font-display)] text-navy text-xl">
              Inactive <span className="text-mist font-normal text-base ml-1">({inactive.length})</span>
            </h2>
          </div>
          <div className="divide-y divide-cream-deep">
            {inactive.map(c => (
              <CleanerRow key={c.id} cleaner={c} onEdit={() => openEdit(c)} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function CleanerRow({ cleaner, onEdit }: { cleaner: Cleaner; onEdit: () => void }) {
  return (
    <div className="px-6 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
          style={{ background: cleaner.active ? '#1a2b4a' : '#8a93a3' }}
        >
          {cleaner.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className={`font-medium text-sm ${cleaner.active ? 'text-ink' : 'text-mist'}`}>
            {cleaner.name}
            {!cleaner.active && <span className="ml-2 text-xs font-normal">(inactive)</span>}
          </p>
          <p className="text-mist text-xs">{cleaner.email}{cleaner.phone ? ` · ${cleaner.phone}` : ''}</p>
        </div>
      </div>
      <button
        onClick={onEdit}
        className="text-xs text-ink-soft hover:text-ink transition-colors px-3 py-1.5 rounded-md border border-cream-deep hover:border-ink-soft/40"
      >
        Edit
      </button>
    </div>
  )
}
