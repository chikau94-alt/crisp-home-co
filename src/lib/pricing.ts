/**
 * Crisp Home Co. — Pricing module
 *
 * Single source of truth for the rate card and all price calculations.
 * Calculation order follows CLAUDE.md exactly:
 *   1. base = rate for size band + frequency
 *   2. For recurring: firstVisitBase = one-time rate; recurringBase = frequency rate
 *   3. heavySurcharge = 20% of the applicable base
 *   4. petsCharge = +$15 if toggled
 *   5. alacarteCharge = sum of à-la-carte items × quantities
 *   6. One-time total = base + heavySurcharge + petsCharge + alacarteCharge
 *   7. Recurring: separate totals for first visit and subsequent visits
 */

// ─── Rate card ───────────────────────────────────────────────────────────────

export const RATE_CARD = {
  under1500:    { onetime: 220, biweekly: 160, weekly: 145 },
  '1500to2500': { onetime: 300, biweekly: 200, weekly: 180 },
  '2500to3500': { onetime: 390, biweekly: 260, weekly: 235 },
  '3500to4500': { onetime: 480, biweekly: 320, weekly: 290 },
} as const

export type SizeBand = keyof typeof RATE_CARD
export type Frequency = 'weekly' | 'biweekly' | 'monthly' | 'onetime'

// ─── UI metadata ─────────────────────────────────────────────────────────────

export const SIZE_BANDS: {
  id: SizeBand
  label: string
  description: string
}[] = [
  { id: 'under1500',    label: 'Under 1,500 sq ft',   description: 'Studio, 1–2 bed condo or apartment' },
  { id: '1500to2500',   label: '1,500 – 2,500 sq ft', description: 'Small to mid-size family home' },
  { id: '2500to3500',   label: '2,500 – 3,500 sq ft', description: 'Large family home, 3–4 bedrooms' },
  { id: '3500to4500',   label: '3,500 – 4,500 sq ft', description: 'Executive home, 4–5 bedrooms' },
]

export const FREQUENCIES: {
  id: Frequency
  label: string
  description: string
  badge?: string
}[] = [
  { id: 'weekly',   label: 'Weekly',    description: 'Your home, always crisp.',   badge: 'Best value' },
  { id: 'biweekly', label: 'Bi-weekly', description: 'A clean every two weeks.',   badge: 'Most popular' },
  { id: 'monthly',  label: 'Monthly',   description: 'A fresh start each month.' },
  { id: 'onetime',  label: 'One-time',  description: 'A thorough deep clean.',     badge: 'Deep clean' },
]

// ─── Add-ons ──────────────────────────────────────────────────────────────────

export interface AddOns {
  pets: boolean
  heavyDirty: boolean
  oven: boolean
  fridge: boolean
  windows: number  // quantity; 0 = not selected
  laundry: number  // quantity; 0 = not selected
}

// ─── Price breakdown types ────────────────────────────────────────────────────

/** One-time or monthly booking: single price per visit */
export interface SinglePriceBreakdown {
  kind: 'single'
  isMonthly: boolean
  baseRate: number
  heavySurcharge: number
  petsCharge: number
  alacarteCharge: number
  total: number
}

/** Weekly or bi-weekly booking: different price for first vs subsequent visits */
export interface RecurringPriceBreakdown {
  kind: 'recurring'
  /** "week" | "2 weeks" */
  frequencyLabel: string
  firstVisitBaseRate: number
  recurringBaseRate: number
  firstHeavySurcharge: number
  recurringHeavySurcharge: number
  petsCharge: number
  alacarteCharge: number
  firstVisitTotal: number
  recurringTotal: number
}

export type PriceBreakdown = SinglePriceBreakdown | RecurringPriceBreakdown

// ─── Calculation ──────────────────────────────────────────────────────────────

export function calculatePrice(
  band: SizeBand,
  frequency: Frequency,
  addons: AddOns
): PriceBreakdown {
  const rates = RATE_CARD[band]

  // Step 5: à-la-carte total
  const alacarteCharge =
    (addons.oven    ? 30 : 0) +
    (addons.fridge  ? 30 : 0) +
    addons.windows * 8 +
    addons.laundry * 25

  // Step 4: pets charge
  const petsCharge = addons.pets ? 15 : 0

  if (frequency === 'onetime' || frequency === 'monthly') {
    // Monthly uses the one-time rate every visit (infrequent cleans take longer)
    const base  = rates.onetime
    // Step 3: heavy surcharge = 20% of base
    const heavy = addons.heavyDirty ? Math.round(base * 0.2) : 0
    return {
      kind:           'single',
      isMonthly:      frequency === 'monthly',
      baseRate:       base,
      heavySurcharge: heavy,
      petsCharge,
      alacarteCharge,
      total:          base + heavy + petsCharge + alacarteCharge,
    }
  }

  // Weekly / bi-weekly: first visit = one-time rate; subsequent = frequency rate
  const firstBase     = rates.onetime
  const recurringBase = frequency === 'weekly' ? rates.weekly : rates.biweekly

  const firstHeavy     = addons.heavyDirty ? Math.round(firstBase     * 0.2) : 0
  const recurringHeavy = addons.heavyDirty ? Math.round(recurringBase * 0.2) : 0

  return {
    kind:                      'recurring',
    frequencyLabel:            frequency === 'weekly' ? 'week' : '2 weeks',
    firstVisitBaseRate:        firstBase,
    recurringBaseRate:         recurringBase,
    firstHeavySurcharge:       firstHeavy,
    recurringHeavySurcharge:   recurringHeavy,
    petsCharge,
    alacarteCharge,
    firstVisitTotal:           firstBase + firstHeavy + petsCharge + alacarteCharge,
    recurringTotal:            recurringBase + recurringHeavy + petsCharge + alacarteCharge,
  }
}

// ─── Utilities ────────────────────────────────────────────────────────────────

export function fmt(n: number): string {
  return '$' + n.toLocaleString()
}
