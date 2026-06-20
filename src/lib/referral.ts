import { getSupabaseAdmin } from '@/lib/supabase/admin'

export function generateReferralCode(name: string): string {
  const first = name.split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '').slice(0, 8)
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${first}-${suffix}`
}

export async function createReferralForBooking(
  bookingId: string,
  customerName: string,
  customerEmail: string,
): Promise<string> {
  const db = getSupabaseAdmin()

  // Check if this customer already has a referral code
  const { data: existing } = await db
    .from('referrals')
    .select('referral_code')
    .eq('referrer_email', customerEmail)
    .single()

  if (existing) return existing.referral_code

  const code = generateReferralCode(customerName)

  await db.from('referrals').insert({
    referrer_email: customerEmail,
    referrer_name:  customerName,
    referral_code:  code,
  })

  return code
}

export async function getReferralByCode(code: string) {
  const db = getSupabaseAdmin()
  const { data } = await db
    .from('referrals')
    .select('*')
    .eq('referral_code', code.toUpperCase())
    .single()
  return data
}

export async function getReferralByEmail(email: string) {
  const db = getSupabaseAdmin()
  const { data } = await db
    .from('referrals')
    .select('*, bookings:referred_booking_id ( status )')
    .eq('referrer_email', email)
    .single()
  return data
}
