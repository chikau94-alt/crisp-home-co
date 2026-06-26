'use server'

import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { sendLeadSMS } from '@/lib/sms'
import { sendLeadNotificationToAdmin, sendLeadConfirmationToCustomer } from '@/lib/email'

export interface LeadInput {
  name:              string
  email:             string
  phone:             string
  sizeBand?:         string
  serviceType?:      string
  message?:          string
  preferredContact?: 'phone' | 'text' | 'email' | 'either'
  source?:           string
}

export interface LeadResult {
  ok:     boolean
  error?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Require at least 10 digits — basic US phone sanity check.
const digits = (s: string) => s.replace(/[^0-9]/g, '')

export async function submitLead(input: LeadInput): Promise<LeadResult> {
  // ── Server-side validation (never trust the browser) ──
  const name  = (input.name  ?? '').trim()
  const email = (input.email ?? '').trim().toLowerCase()
  const phone = (input.phone ?? '').trim()

  if (name.length < 2)        return { ok: false, error: 'Please enter your name.' }
  if (!EMAIL_RE.test(email))  return { ok: false, error: 'Please enter a valid email address.' }
  if (digits(phone).length < 10) return { ok: false, error: 'Please enter a valid phone number.' }

  const preferred = (['phone', 'text', 'email', 'either'] as const)
    .includes(input.preferredContact as never)
    ? input.preferredContact!
    : 'either'

  const lead = {
    name,
    email,
    phone,
    size_band:         input.sizeBand?.trim()    || null,
    service_type:      input.serviceType?.trim() || null,
    message:           input.message?.trim()     || null,
    preferred_contact: preferred,
    source:            input.source?.trim()      || 'quote_form',
  }

  // ── Store ──
  const { error } = await getSupabaseAdmin().from('leads').insert(lead)
  if (error) {
    console.error('submitLead: insert failed', error)
    return { ok: false, error: 'Something went wrong. Please try again or call us.' }
  }

  // ── Notify (best-effort — a failed notification must not fail the lead) ──
  const payload = {
    name,
    email,
    phone,
    sizeBand:         lead.size_band,
    serviceType:      lead.service_type,
    message:          lead.message,
    preferredContact: preferred,
  }

  await Promise.allSettled([
    sendLeadSMS(payload),
    sendLeadNotificationToAdmin(payload),
    sendLeadConfirmationToCustomer(payload),
  ])

  return { ok: true }
}
