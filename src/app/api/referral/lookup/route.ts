import { NextRequest, NextResponse } from 'next/server'
import { getReferralByEmail } from '@/lib/referral'

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  const referral = await getReferralByEmail(email)
  if (!referral) {
    return NextResponse.json(
      { error: 'No referral found. Make sure you use the email from your booking.' },
      { status: 404 }
    )
  }

  return NextResponse.json({
    code: referral.referral_code,
    used: !!referral.referred_booking_id,
  })
}
