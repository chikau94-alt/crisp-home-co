# Crisp Home Co. — Project Reference

## Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4 (config via `@theme` in `globals.css`, no `tailwind.config.ts`)
- **Fonts:** Google Fonts via `next/font/google` — Fraunces (display/serif) + Outfit (body/UI)
- **Database:** Supabase (later phase)
- **Payments:** Stripe (later phase) — first deep clean charged at booking, card saved on file, charged per completed visit afterward. Not fixed subscriptions.
- **Email:** Resend (later phase)
- **Deploy:** Vercel

---

## Brand

- **Name:** Crisp Home Co.
- **Tagline:** "Come home to crisp."
- **Location:** Salt Lake City, Utah
- **Positioning:** Premium, flat-rate residential cleaning. No hourly billing, no custom quotes (except oversized homes). Instant transparent pricing is the differentiator — no callbacks, no "it depends," no surprises.
- **Model:** Fully subcontracted cleaners, self-serve online booking.

---

## Design Direction

- **Mobile-first, always.** Most customers book on a phone.
- **Feel:** Luxury, calm, editorial, navy and sage. Lots of whitespace, refined and uncluttered. Closer to a boutique hospitality brand than a typical cleaning company.

### Color Tokens

| Token        | Hex       | Usage                                              |
|--------------|-----------|----------------------------------------------------|
| `navy`       | `#1a2b4a` | Primary, hero background, headings, dark accents   |
| `navy-deep`  | `#11203b` | Hero gradient, footer                              |
| `sage`       | `#9eaa8f` | Buttons, active states, CTA                        |
| `sage-soft`  | `#b8c4a8` | Highlights, tagline, secondary text, hero accents  |
| `cream`      | `#f3f5f2` | Main background, secondary surfaces                |
| `cream-deep` | `#e4e8e1` | Borders, subtle dividers                           |
| `ink`        | `#2b2b2b` | Body text                                          |
| `ink-soft`   | `#5e6470` | Secondary text, hints                              |
| `mist`       | `#8a93a3` | Faint labels, tertiary text                        |
| `white`      | `#fffdf9` | Card backgrounds, brightest surface                |

### Typography

- **Display/headings:** Fraunces (serif). Use italic for brand moments ("crisp," tagline).
- **Body/UI:** Outfit (sans-serif). Generous line height and spacing.

### Buttons & Inputs

- Border radius: 4–7px
- Tap targets: 34px minimum height (buttons)
- **Primary button:** sage background, navy text, soft shadow
- **Ghost button:** transparent background, navy border
- Subtle color transitions on hover/focus

---

## Booking Flow (5 Steps)

1. **Size** — home square footage band
2. **Frequency** — one-time, weekly, bi-weekly, monthly
3. **Add-ons** — pets toggle, heavy/dirty toggle, à-la-carte extras
4. **Schedule** — date + 2-hour arrival window
5. **Details** — contact info, address, payment

Each step is its own view with smooth animations. Progress bar at top. Back button appears after step 1.

### Price Panel

- **Desktop:** navy gradient sidebar, always visible (right side of card)
- **Mobile:** sticky footer showing live total
- Shows itemized breakdown
- For recurring: prominently show "First clean (deep clean): $X" then "Then $Y per [frequency] visit"

---

## Pricing — Rate Card (Salt Lake City, 2026)

Price is set by home size band and visit frequency. Never by the hour.

| Home size band          | One-time / First clean | Bi-weekly | Weekly |
|-------------------------|------------------------|-----------|--------|
| Under 1,500 sq ft       | $220                   | $160      | $145   |
| 1,500–2,500 sq ft       | $300                   | $200      | $180   |
| 2,500–3,500 sq ft       | $390                   | $260      | $235   |
| 3,500–4,500 sq ft       | $480                   | $320      | $290   |

- **Monthly:** priced at the one-time rate for that band (infrequent cleans take longer).
- **Over 4,500 sq ft:** custom quote only — route to a "request a custom quote" contact step, do not show a price.

### Critical Rule — First Clean Is Always a Deep Clean

- Every new client's first visit is a mandatory deep clean, charged at the one-time rate.
- **One-time booking:** charged the one-time rate (it is the deep clean).
- **Recurring booking (weekly, bi-weekly, monthly):** first visit = one-time rate; every visit after = recurring rate for that frequency.
- The UI must make this clear: show **"First clean (deep clean): $X"** prominently, then **"Then $Y per [frequency] visit."**

---

## Add-On Modifiers

| Add-on                   | Type             | Price              |
|--------------------------|------------------|--------------------|
| Pets in home             | Toggle           | +$15               |
| Heavy / extra dirty      | Toggle           | +20% of base price |
| Inside oven              | Checkbox         | +$30               |
| Inside fridge            | Checkbox         | +$30               |
| Interior windows         | Quantity selector | +$8 per window    |
| Laundry wash and fold    | Quantity selector | +$25 per load     |

"Heavy/extra dirty" applies to homes not professionally cleaned in 3+ months.

---

## Price Calculation Order

1. `base` = rate from card for selected size band and frequency
2. For recurring: `firstVisitBase` = one-time rate for that band; `recurringBase` = frequency rate
3. `heavySurcharge` = 20% of the applicable base (applied to both first-visit and recurring base)
4. `pets` = +$15 if toggled
5. `alacarte` = sum of selected à-la-carte items × quantities
6. **One-time total** = `base + heavySurcharge + pets + alacarte`
7. **Recurring:**
   - `firstVisitTotal` = `firstVisitBase + (20% of firstVisitBase if heavy) + pets + alacarte`
   - `recurringTotal` = `recurringBase + (20% of recurringBase if heavy) + pets + alacarte`
   - (À-la-carte currently included in both; revisit later)

---

## Arrival Time Windows

Customers pick a 2-hour window, not an exact time.

- 8:00–10:00 AM
- 10:00 AM–12:00 PM
- 12:00–2:00 PM
- 2:00–4:00 PM
- 4:00–6:00 PM
