'use client'

import { useState } from 'react'
import {
  RATE_CARD,
  SIZE_BANDS,
  FREQUENCIES,
  calculatePrice,
  fmt,
  type SizeBand,
  type Frequency,
  type AddOns,
  type PriceBreakdown,
} from '@/lib/pricing'

// ─── Constants ────────────────────────────────────────────────────────────────

const STEP_LABELS = [
  'Your home',
  'Frequency',
  'Add-ons',
  'Schedule',
  'Your details',
]

const ARRIVAL_WINDOWS = [
  { id: '8-10',  label: '8–10 AM' },
  { id: '10-12', label: '10 AM–12 PM' },
  { id: '12-2',  label: '12–2 PM' },
  { id: '2-4',   label: '2–4 PM' },
  { id: '4-6',   label: '4–6 PM' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getUpcomingDates(count = 8): Date[] {
  const out: Date[] = []
  const today = new Date()
  for (let i = 1; i <= count; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    out.push(d)
  }
  return out
}

function dateParts(d: Date) {
  return {
    weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
    day:     d.getDate().toString(),
    month:   d.toLocaleDateString('en-US', { month: 'short' }),
  }
}

function formatDateFull(d: Date): string {
  return d.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })
}

function windowLabel(id: string): string {
  return ARRIVAL_WINDOWS.find(w => w.id === id)?.label ?? id
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = 'booking' | 'quote' | 'quoteConfirmed' | 'confirmed'

// ─── Root component ───────────────────────────────────────────────────────────

export default function BookingFlow() {
  const [mode, setMode]     = useState<Mode>('booking')
  const [step, setStep]     = useState(1)
  const [stepKey, setStepKey] = useState(0) // bump to re-trigger CSS animation

  // ── Booking state ──
  const [size,          setSize]          = useState<SizeBand | null>(null)
  const [frequency,     setFrequency]     = useState<Frequency | null>(null)
  const [pets,          setPets]          = useState(false)
  const [heavyDirty,    setHeavyDirty]    = useState(false)
  const [oven,          setOven]          = useState(false)
  const [fridge,        setFridge]        = useState(false)
  const [windows,       setWindows]       = useState(0)
  const [laundry,       setLaundry]       = useState(0)
  const [date,          setDate]          = useState<Date | null>(null)
  const [arrival,       setArrival]       = useState<string | null>(null)
  const [name,          setName]          = useState('')
  const [email,         setEmail]         = useState('')
  const [phone,         setPhone]         = useState('')
  const [neighborhood,  setNeighborhood]  = useState('')
  const [address,       setAddress]       = useState('')
  const [bookingNotes,  setBookingNotes]  = useState('')

  // ── Quote state ──
  const [qName,  setQName]  = useState('')
  const [qEmail, setQEmail] = useState('')
  const [qPhone, setQPhone] = useState('')
  const [qSqft,  setQSqft]  = useState('')
  const [qNotes, setQNotes] = useState('')

  const addons: AddOns = { pets, heavyDirty, oven, fridge, windows, laundry }
  const pricing: PriceBreakdown | null =
    size && frequency ? calculatePrice(size, frequency, addons) : null

  function goTo(next: number) {
    setStep(next)
    setStepKey(k => k + 1)
  }

  function advance() {
    if (step < 5) goTo(step + 1)
    else setMode('confirmed')
  }

  function selectSize(band: SizeBand | 'over4500') {
    if (band === 'over4500') {
      setMode('quote')
      setStepKey(k => k + 1)
    } else {
      setSize(band)
    }
  }

  function canContinue(): boolean {
    if (mode === 'quote') return !!(qName && qEmail && qPhone)
    switch (step) {
      case 1: return size !== null
      case 2: return frequency !== null
      case 3: return true
      case 4: return date !== null && arrival !== null
      case 5: return !!(name && email && phone && address)
      default: return false
    }
  }

  function reset() {
    setMode('booking'); setStep(1); setStepKey(k => k + 1)
    setSize(null); setFrequency(null)
    setPets(false); setHeavyDirty(false); setOven(false); setFridge(false)
    setWindows(0); setLaundry(0)
    setDate(null); setArrival(null)
    setName(''); setEmail(''); setPhone('')
    setNeighborhood(''); setAddress(''); setBookingNotes('')
    setQName(''); setQEmail(''); setQPhone(''); setQSqft(''); setQNotes('')
  }

  // ── Confirmed / quote-confirmed screens ──
  if (mode === 'confirmed' && size && frequency && pricing && date && arrival) {
    return (
      <ConfirmationScreen
        size={size} frequency={frequency} pricing={pricing}
        date={date} arrival={arrival} onReset={reset}
      />
    )
  }

  if (mode === 'quoteConfirmed') {
    return <QuoteConfirmationScreen name={qName} onReset={reset} />
  }

  const isQuote = mode === 'quote'

  return (
    <div className="pb-28 md:pb-0 font-[family-name:var(--font-body)]">
      {/* Card */}
      <div className="bg-white rounded-xl shadow-sm border border-cream-deep overflow-hidden flex flex-col md:flex-row">

          {/* ── Left: form area ── */}
          <div className="flex-1 flex flex-col">

            {/* Progress / header */}
            <div className="px-6 pt-6 pb-5 border-b border-cream-deep">
              {isQuote ? (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-mist tracking-[0.14em] uppercase">
                    Custom quote request
                  </span>
                  <button
                    onClick={() => { setMode('booking'); setStepKey(k => k + 1) }}
                    className="inline-flex items-center gap-1 text-xs text-ink-soft hover:text-ink transition-colors"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Back to size
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-mist tracking-[0.14em] uppercase">
                      Step {String(step).padStart(2, '0')} of 05 &middot; {STEP_LABELS[step - 1]}
                    </span>
                    {step > 1 && (
                      <button
                        onClick={() => goTo(step - 1)}
                        className="inline-flex items-center gap-1 text-xs text-ink-soft hover:text-ink transition-colors"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <polyline points="15 18 9 12 15 6" />
                        </svg>
                        Back
                      </button>
                    )}
                  </div>
                  <div className="h-[3px] bg-cream-deep rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sage rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${(step / 5) * 100}%` }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Step content with enter animation */}
            <div key={stepKey} className="animate-step-enter flex-1 p-6 md:p-8 md:pb-10">
              {isQuote ? (
                <QuoteForm
                  name={qName} onName={setQName}
                  email={qEmail} onEmail={setQEmail}
                  phone={qPhone} onPhone={setQPhone}
                  sqft={qSqft} onSqft={setQSqft}
                  notes={qNotes} onNotes={setQNotes}
                  canSubmit={canContinue()}
                  onSubmit={() => setMode('quoteConfirmed')}
                />
              ) : step === 1 ? (
                <Step1Size selected={size} onSelect={selectSize} />
              ) : step === 2 ? (
                <Step2Frequency selected={frequency} onSelect={setFrequency} size={size!} />
              ) : step === 3 ? (
                <Step3Addons
                  pets={pets} onPets={setPets}
                  heavy={heavyDirty} onHeavy={setHeavyDirty}
                  oven={oven} onOven={setOven}
                  fridge={fridge} onFridge={setFridge}
                  windows={windows} onWindows={setWindows}
                  laundry={laundry} onLaundry={setLaundry}
                />
              ) : step === 4 ? (
                <Step4Schedule
                  date={date} onDate={setDate}
                  arrival={arrival} onArrival={setArrival}
                />
              ) : (
                <Step5Details
                  name={name} onName={setName}
                  email={email} onEmail={setEmail}
                  phone={phone} onPhone={setPhone}
                  neighborhood={neighborhood} onNeighborhood={setNeighborhood}
                  address={address} onAddress={setAddress}
                  notes={bookingNotes} onNotes={setBookingNotes}
                />
              )}
            </div>
          </div>

          {/* ── Right: price panel (desktop only) ── */}
          {!isQuote && (
            <div
              className="hidden md:flex flex-col w-72 lg:w-80 flex-shrink-0"
              style={{ background: 'linear-gradient(170deg, #1a2b4a 0%, #11203b 100%)' }}
            >
              <PricePanel
                pricing={pricing}
                size={size}
                frequency={frequency}
                addons={addons}
                canContinue={canContinue()}
                onContinue={advance}
                step={step}
              />
            </div>
          )}
      </div>

      {/* ── Mobile sticky bar ── */}
      {!isQuote && (
        <MobilePriceBar
          pricing={pricing}
          canContinue={canContinue()}
          onContinue={advance}
          step={step}
        />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 — Home size
// ─────────────────────────────────────────────────────────────────────────────

function Step1Size({
  selected,
  onSelect,
}: {
  selected: SizeBand | null
  onSelect: (v: SizeBand | 'over4500') => void
}) {
  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] text-navy text-2xl md:text-3xl mb-1">
        What size is your home?
      </h2>
      <p className="text-ink-soft text-sm mb-6">
        Approximate square footage sets your base price.
      </p>
      <div className="flex flex-col gap-3">
        {SIZE_BANDS.map(band => (
          <SizeCard
            key={band.id}
            id={band.id}
            label={band.label}
            description={band.description}
            selected={selected === band.id}
            onSelect={() => onSelect(band.id)}
          />
        ))}
        {/* Over 4,500 — routes to custom quote */}
        <SizeCard
          id="over4500"
          label="Over 4,500 sq ft"
          description="Custom quote — we'll reach out to confirm details"
          selected={false}
          onSelect={() => onSelect('over4500')}
          variant="ghost"
        />
      </div>
    </div>
  )
}

function SizeCard({
  label,
  description,
  selected,
  onSelect,
  variant = 'default',
}: {
  id: string
  label: string
  description: string
  selected: boolean
  onSelect: () => void
  variant?: 'default' | 'ghost'
}) {
  return (
    <button
      onClick={onSelect}
      className={[
        'w-full text-left rounded-lg border-2 px-5 py-4 transition-all duration-150',
        'flex items-center justify-between gap-4 min-h-[72px]',
        selected
          ? 'border-navy bg-navy/5'
          : variant === 'ghost'
          ? 'border-cream-deep hover:border-ink-soft/40 bg-white'
          : 'border-cream-deep hover:border-sage bg-white',
      ].join(' ')}
    >
      <div>
        <p className={`font-semibold text-base ${selected ? 'text-navy' : 'text-ink'}`}>
          {label}
        </p>
        <p className="text-ink-soft text-sm mt-0.5">{description}</p>
      </div>
      {selected && (
        <span className="w-6 h-6 rounded-full bg-navy flex-shrink-0 flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      )}
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 — Frequency
// ─────────────────────────────────────────────────────────────────────────────

function Step2Frequency({
  selected,
  onSelect,
  size,
}: {
  selected: Frequency | null
  onSelect: (f: Frequency) => void
  size: SizeBand
}) {
  const rates = RATE_CARD[size]

  const priceFor = (f: Frequency): number => {
    if (f === 'weekly')   return rates.weekly
    if (f === 'biweekly') return rates.biweekly
    return rates.onetime  // monthly and onetime both use the onetime rate
  }

  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] text-navy text-2xl md:text-3xl mb-1">
        How often?
      </h2>
      <p className="text-ink-soft text-sm mb-6">
        Recurring plans lock in a lower rate. Your first visit is always a deep clean.
      </p>
      <div className="flex flex-col gap-3">
        {FREQUENCIES.map(freq => (
          <FreqCard
            key={freq.id}
            freq={freq}
            price={priceFor(freq.id)}
            selected={selected === freq.id}
            onSelect={() => onSelect(freq.id)}
          />
        ))}
      </div>
    </div>
  )
}

function FreqCard({
  freq,
  price,
  selected,
  onSelect,
}: {
  freq: (typeof FREQUENCIES)[number]
  price: number
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className={[
        'w-full text-left rounded-lg border-2 px-5 py-4 transition-all duration-150',
        'flex items-center justify-between gap-4 min-h-[72px]',
        selected
          ? 'border-navy bg-navy/5'
          : 'border-cream-deep hover:border-sage bg-white',
      ].join(' ')}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className={`font-semibold text-base ${selected ? 'text-navy' : 'text-ink'}`}>
            {freq.label}
          </p>
          {freq.badge && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sage/15 text-sage">
              {freq.badge}
            </span>
          )}
        </div>
        <p className="text-ink-soft text-sm mt-0.5">{freq.description}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className={`font-semibold text-lg ${selected ? 'text-navy' : 'text-ink'}`}>
          {fmt(price)}
        </p>
        <p className="text-mist text-xs">
          {freq.id === 'onetime' ? 'one-time' : 'per visit'}
        </p>
      </div>
      {selected && (
        <span className="w-6 h-6 rounded-full bg-navy flex-shrink-0 flex items-center justify-center ml-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      )}
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 — Add-ons
// ─────────────────────────────────────────────────────────────────────────────

function Step3Addons({
  pets, onPets,
  heavy, onHeavy,
  oven, onOven,
  fridge, onFridge,
  windows, onWindows,
  laundry, onLaundry,
}: {
  pets: boolean;     onPets: (v: boolean) => void
  heavy: boolean;    onHeavy: (v: boolean) => void
  oven: boolean;     onOven: (v: boolean) => void
  fridge: boolean;   onFridge: (v: boolean) => void
  windows: number;   onWindows: (v: number) => void
  laundry: number;   onLaundry: (v: number) => void
}) {
  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] text-navy text-2xl md:text-3xl mb-1">
        Any extras?
      </h2>
      <p className="text-ink-soft text-sm mb-7">
        All optional — prices update instantly in your summary.
      </p>

      {/* Toggle add-ons */}
      <div className="flex flex-col gap-3 mb-7">
        <ToggleRow
          label="Pets in home"
          description="A few extra touches for furry-friendly spaces"
          price="+$15"
          active={pets}
          onToggle={() => onPets(!pets)}
        />
        <ToggleRow
          label="Heavy / extra dirty"
          description="Home not professionally cleaned in 3+ months"
          price="+20%"
          active={heavy}
          onToggle={() => onHeavy(!heavy)}
        />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-cream-deep" />
        <span className="text-mist text-xs tracking-widest uppercase">À la carte</span>
        <div className="flex-1 h-px bg-cream-deep" />
      </div>

      {/* Checkbox add-ons */}
      <div className="flex flex-col gap-3">
        <CheckRow label="Inside oven" price="+$30" checked={oven} onChange={() => onOven(!oven)} />
        <CheckRow label="Inside fridge" price="+$30" checked={fridge} onChange={() => onFridge(!fridge)} />
        <QuantityRow
          label="Interior windows"
          unitPrice={8}
          unitLabel="per window"
          quantity={windows}
          onChange={onWindows}
        />
        <QuantityRow
          label="Laundry wash & fold"
          unitPrice={25}
          unitLabel="per load"
          quantity={laundry}
          onChange={onLaundry}
        />
      </div>
    </div>
  )
}

function ToggleRow({
  label, description, price, active, onToggle,
}: {
  label: string; description: string; price: string
  active: boolean; onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className={[
        'w-full text-left rounded-lg border-2 px-5 py-4 transition-all duration-150',
        'flex items-center justify-between gap-4',
        active ? 'border-navy bg-navy/5' : 'border-cream-deep hover:border-sage bg-white',
      ].join(' ')}
    >
      <div className="flex-1">
        <p className={`font-semibold text-sm ${active ? 'text-navy' : 'text-ink'}`}>{label}</p>
        <p className="text-ink-soft text-xs mt-0.5">{description}</p>
      </div>
      <span className="text-sage text-sm font-semibold flex-shrink-0">{price}</span>
      {/* Visual toggle */}
      <span
        className={[
          'flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 relative',
          active ? 'bg-navy' : 'bg-cream-deep',
        ].join(' ')}
        aria-hidden
      >
        <span
          className={[
            'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm',
            'transition-transform duration-200',
            active ? 'translate-x-5' : 'translate-x-0',
          ].join(' ')}
        />
      </span>
    </button>
  )
}

function CheckRow({
  label, price, checked, onChange,
}: {
  label: string; price: string; checked: boolean; onChange: () => void
}) {
  return (
    <button
      onClick={onChange}
      className={[
        'w-full text-left rounded-lg border-2 px-5 py-3.5 transition-all duration-150',
        'flex items-center gap-4 min-h-[56px]',
        checked ? 'border-navy bg-navy/5' : 'border-cream-deep hover:border-sage bg-white',
      ].join(' ')}
    >
      <span
        className={[
          'w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-colors duration-150',
          checked ? 'bg-navy border-navy' : 'border-cream-deep',
        ].join(' ')}
        aria-hidden
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white"
            strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      <span className={`flex-1 font-medium text-sm ${checked ? 'text-navy' : 'text-ink'}`}>
        {label}
      </span>
      <span className="text-sage text-sm font-semibold">{price}</span>
    </button>
  )
}

function QuantityRow({
  label, unitPrice, unitLabel, quantity, onChange,
}: {
  label: string; unitPrice: number; unitLabel: string
  quantity: number; onChange: (v: number) => void
}) {
  const active = quantity > 0
  return (
    <div
      className={[
        'rounded-lg border-2 px-5 py-3.5 transition-colors duration-150',
        'flex items-center gap-4 min-h-[56px]',
        active ? 'border-navy bg-navy/5' : 'border-cream-deep bg-white',
      ].join(' ')}
    >
      <div className="flex-1">
        <p className={`font-medium text-sm ${active ? 'text-navy' : 'text-ink'}`}>{label}</p>
        <p className="text-mist text-xs">
          {fmt(unitPrice)} {unitLabel}
        </p>
      </div>
      {active && (
        <span className="text-sage text-sm font-semibold">
          {fmt(quantity * unitPrice)}
        </span>
      )}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(0, quantity - 1))}
          className="w-8 h-8 rounded-md border border-cream-deep bg-white hover:border-navy text-ink flex items-center justify-center transition-colors disabled:opacity-30"
          disabled={quantity === 0}
          aria-label={`Remove one ${label}`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" aria-hidden>
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <span className="w-6 text-center text-sm font-semibold text-ink tabular-nums">
          {quantity}
        </span>
        <button
          onClick={() => onChange(quantity + 1)}
          className="w-8 h-8 rounded-md border border-cream-deep bg-white hover:border-navy text-ink flex items-center justify-center transition-colors"
          aria-label={`Add one ${label}`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" aria-hidden>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4 — Schedule
// ─────────────────────────────────────────────────────────────────────────────

const UPCOMING_DATES = getUpcomingDates(8)

function Step4Schedule({
  date, onDate,
  arrival, onArrival,
}: {
  date: Date | null;    onDate: (d: Date) => void
  arrival: string | null; onArrival: (w: string) => void
}) {
  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] text-navy text-2xl md:text-3xl mb-1">
        Pick a date
      </h2>
      <p className="text-ink-soft text-sm mb-6">
        We&apos;ll arrive in your chosen 2-hour window.
      </p>

      {/* Date chips */}
      <div className="overflow-x-auto pb-1 -mx-1">
        <div className="flex gap-2 px-1 min-w-max">
          {UPCOMING_DATES.map((d, i) => {
            const { weekday, day, month } = dateParts(d)
            const sel = date?.toDateString() === d.toDateString()
            return (
              <button
                key={i}
                onClick={() => onDate(d)}
                className={[
                  'flex flex-col items-center rounded-lg border-2 px-3.5 py-3 min-w-[64px] transition-all duration-150',
                  sel
                    ? 'border-navy bg-navy text-white'
                    : 'border-cream-deep bg-white hover:border-sage text-ink',
                ].join(' ')}
              >
                <span className={`text-[11px] font-medium uppercase tracking-wide ${sel ? 'text-sage-soft' : 'text-mist'}`}>
                  {weekday}
                </span>
                <span className="text-xl font-semibold leading-tight mt-0.5">{day}</span>
                <span className={`text-[11px] ${sel ? 'text-sage-soft/80' : 'text-mist'}`}>{month}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Arrival window */}
      <div className="mt-7">
        <p className="text-sm font-semibold text-ink mb-3">Arrival window</p>
        <div className="flex flex-wrap gap-2">
          {ARRIVAL_WINDOWS.map(w => {
            const sel = arrival === w.id
            return (
              <button
                key={w.id}
                onClick={() => onArrival(w.id)}
                className={[
                  'rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-all duration-150',
                  sel
                    ? 'border-navy bg-navy text-white'
                    : 'border-cream-deep bg-white hover:border-sage text-ink',
                ].join(' ')}
              >
                {w.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 5 — Details
// ─────────────────────────────────────────────────────────────────────────────

function Step5Details({
  name, onName, email, onEmail, phone, onPhone,
  neighborhood, onNeighborhood, address, onAddress,
  notes, onNotes,
}: {
  name: string; onName: (v: string) => void
  email: string; onEmail: (v: string) => void
  phone: string; onPhone: (v: string) => void
  neighborhood: string; onNeighborhood: (v: string) => void
  address: string; onAddress: (v: string) => void
  notes: string; onNotes: (v: string) => void
}) {
  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] text-navy text-2xl md:text-3xl mb-1">
        About you
      </h2>
      <p className="text-ink-soft text-sm mb-7">
        Your details are only used to confirm your booking.
      </p>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full name" required>
            <input
              type="text" value={name} onChange={e => onName(e.target.value)}
              placeholder="Jane Smith"
              className={fieldCls}
            />
          </Field>
          <Field label="Email" required>
            <input
              type="email" value={email} onChange={e => onEmail(e.target.value)}
              placeholder="jane@example.com"
              className={fieldCls}
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Phone" required>
            <input
              type="tel" value={phone} onChange={e => onPhone(e.target.value)}
              placeholder="(801) 555-0100"
              className={fieldCls}
            />
          </Field>
          <Field label="Neighborhood">
            <input
              type="text" value={neighborhood} onChange={e => onNeighborhood(e.target.value)}
              placeholder="Sugar House, Millcreek…"
              className={fieldCls}
            />
          </Field>
        </div>
        <Field label="Service address" required>
          <input
            type="text" value={address} onChange={e => onAddress(e.target.value)}
            placeholder="123 Main St, Salt Lake City, UT"
            className={fieldCls}
          />
        </Field>
        <Field label="Notes for your cleaner">
          <textarea
            value={notes} onChange={e => onNotes(e.target.value)}
            placeholder="Gate code, parking info, areas to focus on…"
            rows={3}
            className={`${fieldCls} resize-none`}
          />
        </Field>
      </div>
    </div>
  )
}

const fieldCls =
  'w-full border border-cream-deep rounded-md px-4 py-3 text-ink text-sm bg-white ' +
  'placeholder:text-mist focus:outline-none focus:border-sage transition-colors duration-150'

function Field({ label, required, children }: {
  label: string; required?: boolean; children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-ink-soft uppercase tracking-wider mb-1.5">
        {label}{required && <span className="text-sage ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PRICE PANEL — desktop sidebar
// ─────────────────────────────────────────────────────────────────────────────

function PricePanel({
  pricing, size, frequency, addons, canContinue, onContinue, step,
}: {
  pricing: PriceBreakdown | null
  size: SizeBand | null
  frequency: Frequency | null
  addons: AddOns
  canContinue: boolean
  onContinue: () => void
  step: number
}) {
  return (
    <div className="flex flex-col h-full p-6 gap-5">
      <p className="font-[family-name:var(--font-display)] text-white/60 text-xs tracking-widest uppercase">
        Your crisp price
      </p>

      {/* Price display */}
      <div className="flex-1">
        {!pricing ? (
          <PricePlaceholder size={size} />
        ) : pricing.kind === 'single' ? (
          <SinglePriceDisplay bp={pricing} frequency={frequency!} addons={addons} />
        ) : (
          <RecurringPriceDisplay bp={pricing} addons={addons} />
        )}
      </div>

      {/* CTA */}
      <button
        onClick={onContinue}
        disabled={!canContinue}
        className={[
          'w-full py-4 rounded-md font-semibold text-sm transition-all duration-200',
          canContinue
            ? 'bg-sage text-navy shadow-md hover:bg-sage-soft'
            : 'bg-white/10 text-white/30 cursor-not-allowed',
        ].join(' ')}
      >
        {step < 5 ? 'Continue' : 'Confirm booking'}
      </button>
    </div>
  )
}

function PricePlaceholder({ size }: { size: SizeBand | null }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="h-14 rounded-md bg-white/5 flex items-center justify-center">
        <p className="text-white/30 text-sm text-center px-3">
          {size ? 'Select a frequency to see your price' : 'Select a home size to get started'}
        </p>
      </div>
    </div>
  )
}

function SinglePriceDisplay({
  bp, frequency, addons,
}: {
  bp: Extract<PriceBreakdown, { kind: 'single' }>
  frequency: Frequency
  addons: AddOns
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="font-[family-name:var(--font-display)] text-white text-5xl font-light">
          {fmt(bp.total)}
        </p>
        {bp.isMonthly && (
          <p className="text-sage-soft text-sm mt-1">per month</p>
        )}
        {/* First-clean note for monthly */}
        {bp.isMonthly && (
          <p className="text-white/50 text-xs mt-2 leading-relaxed">
            First visit is a deep clean at this rate.
          </p>
        )}
      </div>
      <PriceLineItems bp={bp} isFirstVisit={false} addons={addons} />
    </div>
  )
}

function RecurringPriceDisplay({
  bp, addons,
}: {
  bp: Extract<PriceBreakdown, { kind: 'recurring' }>
  addons: AddOns
}) {
  return (
    <div className="flex flex-col gap-5">
      {/* First visit */}
      <div>
        <p className="text-sage-soft text-xs tracking-wide uppercase mb-1">
          First clean (deep clean)
        </p>
        <p className="font-[family-name:var(--font-display)] text-white text-4xl font-light">
          {fmt(bp.firstVisitTotal)}
        </p>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/10" />

      {/* Recurring */}
      <div>
        <p className="text-sage-soft text-xs tracking-wide uppercase mb-1">
          Then per {bp.frequencyLabel}
        </p>
        <p className="font-[family-name:var(--font-display)] text-white text-3xl font-light">
          {fmt(bp.recurringTotal)}
        </p>
      </div>

      {/* Itemized for first visit */}
      <PriceLineItems bp={bp} isFirstVisit addons={addons} />
    </div>
  )
}

/** Itemized breakdown rows, shared by single and recurring panels */
function PriceLineItems({
  bp, isFirstVisit, addons,
}: {
  bp: PriceBreakdown
  isFirstVisit: boolean
  addons: AddOns
}) {
  const isSingle   = bp.kind === 'single'
  const isRecurring = bp.kind === 'recurring'

  const base  = isRecurring
    ? (isFirstVisit ? bp.firstVisitBaseRate    : bp.recurringBaseRate)
    : bp.baseRate
  const heavy = isRecurring
    ? (isFirstVisit ? bp.firstHeavySurcharge   : bp.recurringHeavySurcharge)
    : (isSingle ? bp.heavySurcharge : 0)
  const pets  = bp.petsCharge
  const ac    = bp.alacarteCharge

  const rows: { label: string; amount: number }[] = [
    { label: 'Base cleaning',  amount: base },
    ...(heavy > 0       ? [{ label: 'Heavy/dirty (+20%)',  amount: heavy }] : []),
    ...(pets  > 0       ? [{ label: 'Pets in home',        amount: pets  }] : []),
    ...(addons.oven     ? [{ label: 'Inside oven',          amount: 30   }] : []),
    ...(addons.fridge   ? [{ label: 'Inside fridge',        amount: 30   }] : []),
    ...(addons.windows > 0 ? [{ label: `Windows (×${addons.windows})`, amount: addons.windows * 8  }] : []),
    ...(addons.laundry > 0 ? [{ label: `Laundry (×${addons.laundry})`, amount: addons.laundry * 25 }] : []),
  ]

  if (rows.length <= 1) return null  // only base — no breakdown needed

  return (
    <div className="flex flex-col gap-1.5 border-t border-white/10 pt-3">
      {rows.map(r => (
        <div key={r.label} className="flex justify-between text-xs">
          <span className="text-white/50">{r.label}</span>
          <span className="text-white/70 tabular-nums">{fmt(r.amount)}</span>
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE PRICE BAR
// ─────────────────────────────────────────────────────────────────────────────

function MobilePriceBar({
  pricing, canContinue, onContinue, step,
}: {
  pricing: PriceBreakdown | null
  canContinue: boolean
  onContinue: () => void
  step: number
}) {
  const mainPrice = pricing
    ? pricing.kind === 'single'
      ? pricing.total
      : pricing.firstVisitTotal
    : null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 md:hidden z-30 border-t border-white/10 px-4 pt-3 pb-5"
      style={{ background: '#11203b' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          {mainPrice !== null ? (
            <>
              <p className="font-[family-name:var(--font-display)] text-white text-2xl">
                {fmt(mainPrice)}
              </p>
              {pricing?.kind === 'recurring' && (
                <p className="text-sage-soft text-xs">
                  then {fmt(pricing.recurringTotal)} / {pricing.frequencyLabel}
                </p>
              )}
              {pricing?.kind === 'single' && pricing.isMonthly && (
                <p className="text-sage-soft text-xs">per month</p>
              )}
            </>
          ) : (
            <p className="text-white/40 text-sm">Select size &amp; frequency</p>
          )}
        </div>
        <button
          onClick={onContinue}
          disabled={!canContinue}
          className={[
            'px-6 py-3.5 rounded-md font-semibold text-sm transition-all duration-200',
            canContinue
              ? 'bg-sage text-navy shadow-md hover:bg-sage-soft'
              : 'bg-white/10 text-white/30 cursor-not-allowed',
          ].join(' ')}
        >
          {step < 5 ? 'Continue' : 'Confirm'}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOM QUOTE FORM
// ─────────────────────────────────────────────────────────────────────────────

function QuoteForm({
  name, onName, email, onEmail, phone, onPhone,
  sqft, onSqft, notes, onNotes, canSubmit, onSubmit,
}: {
  name: string; onName: (v: string) => void
  email: string; onEmail: (v: string) => void
  phone: string; onPhone: (v: string) => void
  sqft: string; onSqft: (v: string) => void
  notes: string; onNotes: (v: string) => void
  canSubmit: boolean
  onSubmit: () => void
}) {
  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] text-navy text-2xl md:text-3xl mb-1">
        Let&apos;s get you a quote
      </h2>
      <p className="text-ink-soft text-sm mb-7">
        Homes over 4,500 sq ft need a custom price. We&apos;ll reach out within one business day.
      </p>
      <div className="flex flex-col gap-4 max-w-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full name" required>
            <input type="text" value={name} onChange={e => onName(e.target.value)}
              placeholder="Jane Smith" className={fieldCls} />
          </Field>
          <Field label="Email" required>
            <input type="email" value={email} onChange={e => onEmail(e.target.value)}
              placeholder="jane@example.com" className={fieldCls} />
          </Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Phone" required>
            <input type="tel" value={phone} onChange={e => onPhone(e.target.value)}
              placeholder="(801) 555-0100" className={fieldCls} />
          </Field>
          <Field label="Approx. square footage">
            <input type="text" value={sqft} onChange={e => onSqft(e.target.value)}
              placeholder="e.g. 5,200 sq ft" className={fieldCls} />
          </Field>
        </div>
        <Field label="Anything else we should know?">
          <textarea value={notes} onChange={e => onNotes(e.target.value)}
            placeholder="Service frequency, pets, special requests…"
            rows={3} className={`${fieldCls} resize-none`} />
        </Field>

        {/* Desktop submit button (mobile handled by parent bar) */}
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className={[
            'hidden md:flex items-center justify-center mt-2',
            'py-4 rounded-md font-semibold text-sm transition-all duration-200',
            canSubmit
              ? 'bg-sage text-navy shadow-md hover:bg-sage-soft'
              : 'bg-cream-deep text-mist cursor-not-allowed',
          ].join(' ')}
        >
          Send quote request
        </button>

        {/* Mobile submit */}
        <div className="fixed bottom-0 left-0 right-0 md:hidden z-30 border-t border-cream-deep px-4 pt-3 pb-5 bg-white">
          <button
            onClick={onSubmit}
            disabled={!canSubmit}
            className={[
              'w-full py-4 rounded-md font-semibold text-sm transition-all duration-200',
              canSubmit
                ? 'bg-sage text-navy shadow-md hover:bg-sage-soft'
                : 'bg-cream-deep text-mist cursor-not-allowed',
            ].join(' ')}
          >
            Send quote request
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CONFIRMATION SCREEN
// ─────────────────────────────────────────────────────────────────────────────

function ConfirmationScreen({
  size, frequency, pricing, date, arrival, onReset,
}: {
  size: SizeBand
  frequency: Frequency
  pricing: PriceBreakdown
  date: Date
  arrival: string
  onReset: () => void
}) {
  const sizeBand  = SIZE_BANDS.find(b => b.id === size)!
  const freqOption = FREQUENCIES.find(f => f.id === frequency)!

  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 font-[family-name:var(--font-body)]">
      <div className="max-w-lg w-full flex flex-col items-center text-center gap-6">

        {/* Animated checkmark */}
        <div className="animate-pop-in">
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden>
            <circle cx="36" cy="36" r="36" fill="#9eaa8f" fillOpacity="0.15" />
            <circle cx="36" cy="36" r="28" fill="#9eaa8f" fillOpacity="0.2" />
            <polyline
              points="22,36 32,46 50,28"
              fill="none"
              stroke="#9eaa8f"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="60"
              className="animate-draw-check"
            />
          </svg>
        </div>

        <div>
          <h1 className="font-[family-name:var(--font-display)] text-navy text-4xl md:text-5xl leading-tight">
            Consider it handled.
          </h1>
          <p className="font-[family-name:var(--font-display)] italic text-sage text-lg mt-2">
            Come home to crisp.
          </p>
        </div>

        <p className="text-ink-soft leading-relaxed max-w-sm">
          We&apos;ve received your booking. You&apos;ll get a confirmation email shortly — and a reminder 24 hours before your clean.
        </p>

        {/* Receipt card */}
        <div className="w-full bg-white rounded-xl border border-cream-deep shadow-sm overflow-hidden">
          <div
            className="px-6 py-4"
            style={{ background: 'linear-gradient(135deg, #1a2b4a 0%, #11203b 100%)' }}
          >
            <p className="text-white/50 text-xs tracking-widest uppercase mb-1">Booking summary</p>
            <p className="font-[family-name:var(--font-display)] text-white text-lg">
              {sizeBand.label} · {freqOption.label}
            </p>
          </div>
          <div className="px-6 py-5 flex flex-col gap-3 text-sm">
            <ReceiptRow label="Date"           value={formatDateFull(date)} />
            <ReceiptRow label="Arrival window" value={windowLabel(arrival)} />

            <div className="h-px bg-cream-deep my-1" />

            {pricing.kind === 'single' ? (
              <>
                <ReceiptRow
                  label={pricing.isMonthly ? 'Per month' : 'Deep clean total'}
                  value={fmt(pricing.total)}
                  bold
                />
              </>
            ) : (
              <>
                <ReceiptRow label="First clean (deep clean)" value={fmt(pricing.firstVisitTotal)} bold />
                <ReceiptRow
                  label={`Then per ${pricing.frequencyLabel}`}
                  value={fmt(pricing.recurringTotal)}
                />
              </>
            )}
          </div>
        </div>

        <button
          onClick={onReset}
          className="text-ink-soft text-sm hover:text-ink transition-colors underline underline-offset-4"
        >
          Start a new booking
        </button>
      </div>
    </div>
  )
}

function ReceiptRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-ink-soft">{label}</span>
      <span className={bold ? 'font-semibold text-navy' : 'text-ink'}>{value}</span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// QUOTE CONFIRMATION SCREEN
// ─────────────────────────────────────────────────────────────────────────────

function QuoteConfirmationScreen({ name, onReset }: { name: string; onReset: () => void }) {
  const firstName = name.split(' ')[0] || 'there'
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 font-[family-name:var(--font-body)]">
      <div className="max-w-md w-full flex flex-col items-center text-center gap-6">
        <div className="animate-pop-in">
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden>
            <circle cx="36" cy="36" r="36" fill="#9eaa8f" fillOpacity="0.15" />
            <circle cx="36" cy="36" r="28" fill="#9eaa8f" fillOpacity="0.2" />
            <polyline
              points="22,36 32,46 50,28"
              fill="none" stroke="#9eaa8f" strokeWidth="3.5"
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="60" className="animate-draw-check"
            />
          </svg>
        </div>
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-navy text-4xl leading-tight">
            Got it, {firstName}.
          </h1>
          <p className="font-[family-name:var(--font-display)] italic text-sage text-lg mt-2">
            We&apos;ll be in touch within one business day.
          </p>
        </div>
        <p className="text-ink-soft leading-relaxed max-w-sm">
          Our team will review your home details and reach out with a custom quote. Check your inbox — we&apos;ll reply fast.
        </p>
        <button
          onClick={onReset}
          className="text-ink-soft text-sm hover:text-ink transition-colors underline underline-offset-4"
        >
          Back to booking
        </button>
      </div>
    </div>
  )
}
