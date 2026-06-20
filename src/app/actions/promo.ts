'use server'

import { getSupabaseAdmin } from '@/lib/supabase/admin'

export interface PromoResult {
  valid: boolean
  discountPercent: number
  flatDiscount: number
  error?: string
}

export async function validatePromoCode(code: string): Promise<PromoResult> {
  if (!code.trim()) return { valid: false, discountPercent: 0, flatDiscount: 0, error: 'Enter a promo code.' }

  const { data } = await getSupabaseAdmin()
    .from('promo_codes')
    .select('discount_percent, flat_discount, active, expires_at')
    .eq('code', code.trim().toUpperCase())
    .single()

  if (!data) return { valid: false, discountPercent: 0, flatDiscount: 0, error: 'Code not found.' }
  if (!data.active) return { valid: false, discountPercent: 0, flatDiscount: 0, error: 'This code is no longer active.' }
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { valid: false, discountPercent: 0, flatDiscount: 0, error: 'This code has expired.' }
  }

  return {
    valid:           true,
    discountPercent: data.discount_percent ?? 0,
    flatDiscount:    data.flat_discount    ?? 0,
  }
}
