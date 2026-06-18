import { Resend } from 'resend'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { SIZE_BANDS, FREQUENCIES, fmt } from '@/lib/pricing'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'Crisp Home Co. <hello@crisphomeco.com>'

const ADMIN_TO   = process.env.ADMIN_EMAIL!
const BRAND_URL  = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://crisphomeco.com'

const WINDOW_LABELS: Record<string, string> = {
  '8-10':  '8–10 AM', '10-12': '10 AM–12 PM',
  '12-2':  '12–2 PM', '2-4':   '2–4 PM', '4-6':   '4–6 PM',
}
const ADDON_LABELS: Record<string, string> = {
  oven:    'Inside oven', fridge: 'Inside fridge',
  windows: 'Interior windows', laundry: 'Laundry wash & fold',
}

// ── Shared data fetch ─────────────────────────────────────────────────────────

interface EmailData {
  bookingId: string
  customerName: string
  firstName: string
  customerEmail: string
  customerPhone: string
  address: string
  sizeBandLabel: string
  frequencyLabel: string
  formattedDate: string
  arrivalLabel: string
  isRecurring: boolean
  chargedToday: number
  recurringAmount: number | null
  recurringLabel: string | null
  addons: { label: string; amount: number }[]
}

async function fetchEmailData(bookingId: string): Promise<EmailData> {
  const db = getSupabaseAdmin()

  const { data: booking, error } = await db
    .from('bookings')
    .select(`
      id, scheduled_date, arrival_window, frequency, size_band,
      first_visit_price, recurring_price, one_time_price,
      customers ( name, email, phone ),
      addresses ( street ),
      booking_addons ( addon_type, quantity, unit_price )
    `)
    .eq('id', bookingId)
    .single()

  if (error || !booking) throw new Error('Email: booking not found for ' + bookingId)

  const customer   = booking.customers as unknown as { name: string; email: string; phone: string }
  const addr       = booking.addresses as unknown as { street: string }
  const rawAddons  = (booking.booking_addons ?? []) as Array<{ addon_type: string; quantity: number; unit_price: number }>
  const isRecurring = booking.frequency === 'weekly' || booking.frequency === 'biweekly'

  const sizeBandLabel   = SIZE_BANDS.find(b => b.id === booking.size_band)?.label ?? booking.size_band
  const frequencyLabel  = FREQUENCIES.find(f => f.id === booking.frequency)?.label ?? booking.frequency

  const schedDate    = new Date(booking.scheduled_date + 'T12:00:00')
  const formattedDate = schedDate.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })

  const addons = rawAddons.map(a => ({
    label:  `${ADDON_LABELS[a.addon_type] ?? a.addon_type}${a.quantity > 1 ? ` ×${a.quantity}` : ''}`,
    amount: a.quantity * a.unit_price,
  }))

  const recurringLabel = booking.frequency === 'weekly' ? 'week' : booking.frequency === 'biweekly' ? '2 weeks' : null

  return {
    bookingId,
    customerName:   customer.name,
    firstName:      customer.name.split(' ')[0],
    customerEmail:  customer.email,
    customerPhone:  customer.phone,
    address:        addr.street,
    sizeBandLabel,
    frequencyLabel,
    formattedDate,
    arrivalLabel:   WINDOW_LABELS[booking.arrival_window] ?? booking.arrival_window,
    isRecurring,
    chargedToday:   isRecurring ? (booking.first_visit_price ?? 0) : (booking.one_time_price ?? 0),
    recurringAmount: isRecurring ? booking.recurring_price : null,
    recurringLabel,
    addons,
  }
}

// ── Customer confirmation email ───────────────────────────────────────────────

export async function sendBookingConfirmation(bookingId: string) {
  const d = await fetchEmailData(bookingId)

  const addonsHtml = d.addons.length > 0
    ? d.addons.map(a => `
        <tr>
          <td style="padding:4px 0; color:#5e6470; font-size:14px;">${a.label}</td>
          <td style="padding:4px 0; color:#5e6470; font-size:14px; text-align:right;">${fmt(a.amount)}</td>
        </tr>`).join('')
    : ''

  const pricingHtml = d.isRecurring ? `
    <tr>
      <td colspan="2" style="padding:12px 0 4px; border-top:1px solid #e4e8e1;">
        <p style="margin:0; font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:#8a93a3;">Charged today (first deep clean)</p>
      </td>
    </tr>
    <tr>
      <td style="padding:2px 0 8px; color:#1a2b4a; font-size:22px; font-family:Georgia,serif; font-weight:400;">${fmt(d.chargedToday)}</td>
      <td></td>
    </tr>
    <tr>
      <td style="padding:4px 0; color:#5e6470; font-size:14px;">Then per ${d.recurringLabel}</td>
      <td style="padding:4px 0; color:#1a2b4a; font-size:14px; text-align:right; font-weight:600;">${d.recurringAmount ? fmt(d.recurringAmount) : ''}</td>
    </tr>
    ${addonsHtml}
  ` : `
    <tr>
      <td colspan="2" style="padding:12px 0 4px; border-top:1px solid #e4e8e1;">
        <p style="margin:0; font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:#8a93a3;">Total charged</p>
      </td>
    </tr>
    <tr>
      <td style="padding:2px 0 8px; color:#1a2b4a; font-size:22px; font-family:Georgia,serif; font-weight:400;">${fmt(d.chargedToday)}</td>
      <td></td>
    </tr>
    ${addonsHtml}
  `

  const html = emailShell({
    preheader: `Your booking is confirmed — ${d.formattedDate}, ${d.arrivalLabel}`,
    body: `
      <h1 style="font-family:Georgia,serif; font-size:28px; color:#1a2b4a; margin:0 0 8px; font-weight:400;">
        Consider it handled, ${d.firstName}.
      </h1>
      <p style="color:#5e6470; font-size:15px; margin:0 0 28px; line-height:1.6;">
        Your booking is confirmed. Here's everything you need to know about your upcoming clean.
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f5f2; border-radius:8px; overflow:hidden; margin-bottom:24px;">
        <tr>
          <td style="padding:20px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:4px 0;">
                  <span style="font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:#8a93a3;">Date</span><br>
                  <span style="font-size:15px; color:#2b2b2b; font-weight:500;">${d.formattedDate}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 0 4px;">
                  <span style="font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:#8a93a3;">Arrival window</span><br>
                  <span style="font-size:15px; color:#2b2b2b; font-weight:500;">${d.arrivalLabel}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 0 4px;">
                  <span style="font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:#8a93a3;">Service</span><br>
                  <span style="font-size:15px; color:#2b2b2b; font-weight:500;">${d.sizeBandLabel} · ${d.frequencyLabel}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 0 4px;">
                  <span style="font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:#8a93a3;">Address</span><br>
                  <span style="font-size:15px; color:#2b2b2b; font-weight:500;">${d.address}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
        ${pricingHtml}
      </table>

      ${d.isRecurring ? `
      <p style="color:#5e6470; font-size:13px; line-height:1.6; background:#f3f5f2; border-radius:6px; padding:12px 16px; margin-bottom:24px;">
        Your card on file will be charged <strong style="color:#2b2b2b;">${d.recurringAmount ? fmt(d.recurringAmount) : ''} per ${d.recurringLabel}</strong> after each completed visit.
        You'll receive an email receipt each time.
      </p>
      ` : ''}

      <p style="color:#5e6470; font-size:14px; line-height:1.7; margin-bottom:24px;">
        We'll send you a reminder the day before your clean. If you have any questions or need to reschedule,
        reply to this email or reach us at
        <a href="mailto:hello@crisphomeco.com" style="color:#9eaa8f; text-decoration:none;">hello@crisphomeco.com</a>.
      </p>
    `,
  })

  await resend.emails.send({
    from:    FROM,
    to:      d.customerEmail,
    subject: `Booking confirmed — ${d.formattedDate}`,
    html,
  })
}

// ── Admin notification email ──────────────────────────────────────────────────

export async function sendAdminNotification(bookingId: string) {
  const d = await fetchEmailData(bookingId)

  const html = emailShell({
    preheader: `New booking: ${d.customerName} — ${d.formattedDate}`,
    body: `
      <h1 style="font-family:Georgia,serif; font-size:24px; color:#1a2b4a; margin:0 0 20px; font-weight:400;">
        New booking: ${d.customerName}
      </h1>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        ${detailRow('Date',      d.formattedDate)}
        ${detailRow('Arrival',   d.arrivalLabel)}
        ${detailRow('Service',   `${d.sizeBandLabel} · ${d.frequencyLabel}`)}
        ${detailRow('Address',   d.address)}
        ${detailRow('Phone',     d.customerPhone)}
        ${detailRow('Email',     d.customerEmail)}
        ${detailRow('Charged',   fmt(d.chargedToday) + (d.isRecurring ? ` today, then ${fmt(d.recurringAmount ?? 0)} per ${d.recurringLabel}` : ''))}
        ${d.addons.length > 0 ? detailRow('Add-ons', d.addons.map(a => a.label).join(', ')) : ''}
      </table>

      <a href="${BRAND_URL}/admin/bookings/${bookingId}"
         style="display:inline-block; background:#1a2b4a; color:#ffffff; text-decoration:none; font-size:14px; font-weight:600; padding:12px 24px; border-radius:6px;">
        View in admin →
      </a>
    `,
  })

  await resend.emails.send({
    from:    FROM,
    to:      ADMIN_TO,
    subject: `New booking: ${d.customerName} — ${d.formattedDate}`,
    html,
  })
}

// ── Reminder email (day before) ───────────────────────────────────────────────

export async function sendReminderEmail(bookingId: string) {
  const d = await fetchEmailData(bookingId)

  const html = emailShell({
    preheader: `Your clean is tomorrow — ${d.arrivalLabel}`,
    body: `
      <h1 style="font-family:Georgia,serif; font-size:28px; color:#1a2b4a; margin:0 0 8px; font-weight:400;">
        Your clean is tomorrow, ${d.firstName}.
      </h1>
      <p style="color:#5e6470; font-size:15px; margin:0 0 28px; line-height:1.6;">
        Just a friendly heads-up — your Crisp Home Co. cleaner arrives tomorrow.
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f5f2; border-radius:8px; margin-bottom:28px;">
        <tr>
          <td style="padding:20px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:4px 0;">
                  <span style="font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:#8a93a3;">Date</span><br>
                  <span style="font-size:15px; color:#2b2b2b; font-weight:500;">${d.formattedDate}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 0 4px;">
                  <span style="font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:#8a93a3;">Arrival window</span><br>
                  <span style="font-size:15px; color:#2b2b2b; font-weight:500;">${d.arrivalLabel}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <p style="font-family:Georgia,serif; font-size:17px; color:#1a2b4a; margin:0 0 12px; font-weight:400;">
        A few things to prepare:
      </p>
      <ul style="color:#5e6470; font-size:14px; line-height:1.8; margin:0 0 24px; padding-left:20px;">
        <li>Clear access to the main areas you'd like cleaned</li>
        <li>Secure any pets during the visit</li>
        <li>Leave a note for your cleaner if there's anything specific to focus on</li>
      </ul>

      <p style="color:#5e6470; font-size:14px; line-height:1.7;">
        Questions or need to reschedule? Reply to this email or reach us at
        <a href="mailto:hello@crisphomeco.com" style="color:#9eaa8f; text-decoration:none;">hello@crisphomeco.com</a>.
      </p>
    `,
  })

  await resend.emails.send({
    from:    FROM,
    to:      d.customerEmail,
    subject: `Reminder: your clean is tomorrow — ${d.arrivalLabel}`,
    html,
  })
}

// ── Shared HTML helpers ───────────────────────────────────────────────────────

function emailShell({ preheader, body }: { preheader: string; body: string }): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Crisp Home Co.</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0; padding:0; background:#f3f5f2; -webkit-text-size-adjust:100%;">
  <!-- Preheader text (hidden) -->
  <div style="display:none; max-height:0; overflow:hidden; color:#f3f5f2;">${preheader}</div>

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f5f2;">
    <tr>
      <td align="center" style="padding:40px 16px 48px;">

        <!-- Card -->
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a2b4a 0%,#11203b 100%); border-radius:12px 12px 0 0; padding:28px 40px;">
              <p style="font-family:Georgia,'Times New Roman',serif; color:#fffdf9; font-size:20px; margin:0; font-weight:400; letter-spacing:-0.01em;">
                Crisp Home Co.
              </p>
              <p style="color:#9eaa8f; font-size:12px; margin:5px 0 0; font-style:italic; font-family:Georgia,serif;">
                &ldquo;Come home to crisp.&rdquo;
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#fffdf9; padding:36px 40px;">
              ${body}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f3f5f2; border-radius:0 0 12px 12px; padding:20px 40px; text-align:center; border-top:1px solid #e4e8e1;">
              <p style="color:#8a93a3; font-size:12px; margin:0; line-height:1.6;">
                Salt Lake City, Utah &nbsp;·&nbsp;
                <a href="mailto:hello@crisphomeco.com" style="color:#8a93a3; text-decoration:none;">hello@crisphomeco.com</a>
              </p>
              <p style="color:#b0b8c4; font-size:11px; margin:6px 0 0;">
                © ${new Date().getFullYear()} Crisp Home Co. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function detailRow(label: string, value: string): string {
  return `
  <tr>
    <td style="padding:6px 0; color:#8a93a3; font-size:13px; width:120px; vertical-align:top;">${label}</td>
    <td style="padding:6px 0; color:#2b2b2b; font-size:13px; font-weight:500;">${value}</td>
  </tr>`
}
